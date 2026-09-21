import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { google } from "googleapis";
import HTMLRecoveryEmail from "../utils/sentMailVerificationCode.js";
import { config } from "../../config.js";
import employeeModel from "../model/Employees.js";

const recoveryPasswordEmployeeController = {};

// =====================================================
// CONFIGURACIÓN OAUTH2 (Igual que en clientes)
// =====================================================
const createOAuthClient = () => {
  const { client_id, client_secret, refresh_token } = config.email;
  if (!client_id || !client_secret || !refresh_token) {
    throw new Error("Faltan variables de entorno de Google OAuth");
  }
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);
  oAuth2Client.setCredentials({ refresh_token });
  return oAuth2Client;
};

const encodeMessage = (message) => {
  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const sendRecoveryEmail = async ({ to, subject, html }) => {
  if (!config.email.user_email) {
    throw new Error("Falta la variable de entorno USER_EMAIL");
  }
  const auth = createOAuthClient();
  const accessTokenResponse = await auth.getAccessToken();
  if (!accessTokenResponse?.token) {
    throw new Error("Google no devolvió un access token");
  }
  const gmail = google.gmail({ version: "v1", auth });
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;
  const message = [
    `From: Plumas Volando <${config.email.user_email}>`,
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    html,
  ].join("\r\n");
  const raw = encodeMessage(message);
  const result = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });
  return result.data;
};

const getCookieOptions = () => ({
  maxAge: 15 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

// =====================================================
// PASO 1: SOLICITAR CÓDIGO DE RECUPERACIÓN
// =====================================================
recoveryPasswordEmployeeController.requestCode = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "El correo electrónico es requerido" });
    }
    email = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "El correo electrónico no es válido" });
    }
    
    const employeeFound = await employeeModel.findOne({ email });
    if (!employeeFound) {
      return res.status(404).json({ message: "No existe un empleado registrado con ese correo" });
    }
    
    const randomCode = crypto.randomBytes(3).toString("hex");
    const token = jsonwebtoken.sign(
      { email, randomCode, userType: "employee", verified: false },
      config.JWT.secret,
      { expiresIn: "15m" }
    );
    
    try {
      await sendRecoveryEmail({
        to: email,
        subject: "Recuperación de contraseña - Plumas Volando",
        html: HTMLRecoveryEmail(randomCode),
      });
    } catch (emailError) {
      console.error("[GMAIL] ERROR AL ENVIAR CORREO:", emailError.message);
      return res.status(500).json({ message: "Error sending email" });
    }
    
    res.cookie("recoveryCookie", token, getCookieOptions());
    return res.status(200).json({ message: "Código enviado correctamente", token });
  } catch (error) {
    console.error("[RECOVERY EMPLOYEE] Error requestCode:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =====================================================
// PASO 2: VERIFICAR CÓDIGO
// =====================================================
recoveryPasswordEmployeeController.verifyCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "El código es requerido" });
    }
    const cleanCode = String(code).trim().toLowerCase();
    if (cleanCode.length !== 6) {
      return res.status(400).json({ message: "El código debe contener 6 caracteres" });
    }
    
    const token = req.cookies?.recoveryCookie || req.headers["recovery-token"] || req.body.token;
    if (!token) {
      return res.status(401).json({ message: "El token de recuperación es requerido" });
    }
    
    let decoded;
    try {
      decoded = jsonwebtoken.verify(token, config.JWT.secret);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "El código de recuperación ha expirado" });
      }
      return res.status(401).json({ message: "Token de recuperación inválido" });
    }
    
    if (decoded.userType !== "employee") {
      return res.status(403).json({ message: "Tipo de usuario inválido" });
    }
    if (cleanCode !== String(decoded.randomCode).toLowerCase()) {
      return res.status(400).json({ message: "Código incorrecto" });
    }
    
    const verifiedToken = jsonwebtoken.sign(
      { email: decoded.email, userType: "employee", verified: true },
      config.JWT.secret,
      { expiresIn: "15m" }
    );
    
    res.cookie("recoveryCookie", verifiedToken, getCookieOptions());
    return res.status(200).json({ message: "Código verificado correctamente", token: verifiedToken });
  } catch (error) {
    console.error("[RECOVERY EMPLOYEE] Error verifyCode:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =====================================================
// PASO 3: CAMBIAR CONTRASEÑA
// =====================================================
recoveryPasswordEmployeeController.newPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;
    if (!newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "Debes ingresar y confirmar la nueva contraseña" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "La contraseña debe contener al menos 8 caracteres" });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }
    
    const token = req.cookies?.recoveryCookie || req.headers["recovery-token"] || req.body.token;
    if (!token) {
      return res.status(401).json({ message: "El token de recuperación es requerido" });
    }
    
    let decoded;
    try {
      decoded = jsonwebtoken.verify(token, config.JWT.secret);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "La sesión de recuperación ha expirado" });
      }
      return res.status(401).json({ message: "Token de recuperación inválido" });
    }
    
    if (decoded.userType !== "employee") {
      return res.status(403).json({ message: "Tipo de usuario inválido" });
    }
    if (decoded.verified !== true) {
      return res.status(403).json({ message: "Debes verificar el código antes de cambiar la contraseña" });
    }
    
    const employeeFound = await employeeModel.findOne({ email: decoded.email });
    if (!employeeFound) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    employeeFound.password = passwordHash;
    await employeeFound.save();
    
    res.clearCookie("recoveryCookie", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    
    return res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("[RECOVERY EMPLOYEE] Error newPassword:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default recoveryPasswordEmployeeController;