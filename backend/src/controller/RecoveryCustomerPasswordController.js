import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { google } from "googleapis";

import HTMLRecoveryEmail from "../utils/sentMailVerificationCode.js";
import { config } from "../../config.js";
import customerModel from "../model/Customer.js";

const recoveryPasswordCustomerController = {};

// =====================================================
// CONFIGURACIÓN OAUTH2
// =====================================================

const createOAuthClient = () => {
  const {
    client_id,
    client_secret,
    refresh_token,
  } = config.email;

  if (!client_id) {
    throw new Error(
      "Falta la variable de entorno GOOGLE_CLIENT_ID"
    );
  }

  if (!client_secret) {
    throw new Error(
      "Falta la variable de entorno GOOGLE_CLIENT_SECRET"
    );
  }

  if (!refresh_token) {
    throw new Error(
      "Falta la variable de entorno GOOGLE_REFRESH_TOKEN"
    );
  }

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret
  );

  oAuth2Client.setCredentials({
    refresh_token,
  });

  return oAuth2Client;
};

// =====================================================
// CONVERTIR MENSAJE A BASE64 URL-SAFE
// =====================================================

const encodeMessage = (message) => {
  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

// =====================================================
// ENVIAR CORREO CON GMAIL API
// =====================================================

const sendRecoveryEmail = async ({
  to,
  subject,
  html,
}) => {
  if (!config.email.user_email) {
    throw new Error(
      "Falta la variable de entorno USER_EMAIL"
    );
  }

  // ===============================================
  // CREAR CLIENTE OAUTH
  // ===============================================

  const auth = createOAuthClient();

  // ===============================================
  // OBTENER ACCESS TOKEN
  // ===============================================

  console.log(
    "[GMAIL] Obteniendo access token..."
  );

  const accessTokenResponse =
    await auth.getAccessToken();

  if (!accessTokenResponse?.token) {
    throw new Error(
      "Google no devolvió un access token"
    );
  }

  console.log(
    "[GMAIL] Access token obtenido correctamente"
  );

  // ===============================================
  // CREAR CLIENTE GMAIL
  // ===============================================

  const gmail = google.gmail({
    version: "v1",
    auth,
  });

  // ===============================================
  // CODIFICAR ASUNTO UTF-8
  // ===============================================

  const encodedSubject =
    `=?UTF-8?B?${Buffer.from(subject).toString(
      "base64"
    )}?=`;

  // ===============================================
  // CONSTRUIR CORREO MIME
  // ===============================================

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

  // ===============================================
  // ENVIAR
  // ===============================================

  console.log(
    `[GMAIL] Enviando correo a ${to}...`
  );

  const result =
    await gmail.users.messages.send({
      userId: "me",

      requestBody: {
        raw,
      },
    });

  console.log(
    "[GMAIL] Correo enviado correctamente"
  );

  console.log(
    "[GMAIL] Message ID:",
    result.data.id
  );

  return result.data;
};

// =====================================================
// OPCIONES DE COOKIE
// =====================================================

const getCookieOptions = () => ({
  maxAge: 15 * 60 * 1000,

  httpOnly: true,

  secure:
    process.env.NODE_ENV === "production",

  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
});

// =====================================================
// PASO 1
// SOLICITAR CÓDIGO DE RECUPERACIÓN
// =====================================================

recoveryPasswordCustomerController.requestCode =
  async (req, res) => {
    try {
      let { email } = req.body;

      // =============================================
      // VALIDAR CORREO
      // =============================================

      if (!email) {
        return res.status(400).json({
          message:
            "El correo electrónico es requerido",
        });
      }

      email =
        email.trim().toLowerCase();

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message:
            "El correo electrónico no es válido",
        });
      }

      // =============================================
      // BUSCAR CLIENTE
      // =============================================

      const customerFound =
        await customerModel.findOne({
          email,
        });

      if (!customerFound) {
        return res.status(404).json({
          message:
            "No existe un cliente registrado con ese correo",
        });
      }

      // =============================================
      // GENERAR CÓDIGO
      // =============================================

      const randomCode =
        crypto
          .randomBytes(3)
          .toString("hex");

      // El código es hexadecimal:
      // ejemplo: a2f914
      //
      // Tiene exactamente 6 caracteres.

      console.log(
        `[RECOVERY] Código generado para ${email}`
      );

      // No imprimimos el código en producción.

      if (
        process.env.NODE_ENV !==
        "production"
      ) {
        console.log(
          "[RECOVERY] Código:",
          randomCode
        );
      }

      // =============================================
      // GENERAR TOKEN DE RECUPERACIÓN
      // =============================================

      const token =
        jsonwebtoken.sign(
          {
            email,
            randomCode,

            userType:
              "customer",

            verified:
              false,
          },

          config.JWT.secret,

          {
            expiresIn:
              "15m",
          }
        );

      // =============================================
      // ENVIAR CORREO
      // =============================================

      try {
        await sendRecoveryEmail({
          to: email,

          subject:
            "Recuperación de contraseña - Plumas Volando",

          html:
            HTMLRecoveryEmail(
              randomCode
            ),
        });
      } catch (emailError) {
        // Aquí quedará el error REAL
        // visible en Render.

        console.error(
          "========================================"
        );

        console.error(
          "[GMAIL] ERROR AL ENVIAR CORREO"
        );

        console.error(
          "Mensaje:",
          emailError.message
        );

        console.error(
          "Código:",
          emailError.code
        );

        console.error(
          "Status:",
          emailError.response?.status
        );

        console.error(
          "Data:",
          emailError.response?.data
        );

        console.error(
          "Stack:",
          emailError.stack
        );

        console.error(
          "========================================"
        );

        return res.status(500).json({
          message:
            "Error sending email",
        });
      }

      // =============================================
      // GUARDAR COOKIE PARA WEB
      // =============================================

      res.cookie(
        "recoveryCookie",
        token,
        getCookieOptions()
      );

      // =============================================
      // RESPUESTA
      // =============================================

      return res.status(200).json({
        message:
          "Código enviado correctamente",

        // Necesario para la app móvil.
        // La móvil no debe depender de cookies.
        token,
      });
    } catch (error) {
      console.error(
        "[RECOVERY] Error requestCode:",
        error
      );

      return res.status(500).json({
        message:
          "Internal server error",
      });
    }
  };

// =====================================================
// PASO 2
// VERIFICAR CÓDIGO
// =====================================================

recoveryPasswordCustomerController.verifyCode =
  async (req, res) => {
    try {
      const {
        code,
      } = req.body;

      // =============================================
      // VALIDAR CÓDIGO
      // =============================================

      if (!code) {
        return res.status(400).json({
          message:
            "El código es requerido",
        });
      }

      const cleanCode =
        String(code)
          .trim()
          .toLowerCase();

      if (
        cleanCode.length !== 6
      ) {
        return res.status(400).json({
          message:
            "El código debe contener 6 caracteres",
        });
      }

      // =============================================
      // OBTENER TOKEN
      //
      // WEB:
      // recoveryCookie
      //
      // MÓVIL:
      // body.token
      // =============================================

      const token =
        req.cookies
          ?.recoveryCookie ||
        req.headers[
          "recovery-token"
        ] ||
        req.body.token;

      if (!token) {
        return res.status(401).json({
          message:
            "El token de recuperación es requerido",
        });
      }

      // =============================================
      // VERIFICAR JWT
      // =============================================

      let decoded;

      try {
        decoded =
          jsonwebtoken.verify(
            token,
            config.JWT.secret
          );
      } catch (error) {
        if (
          error.name ===
          "TokenExpiredError"
        ) {
          return res.status(401).json({
            message:
              "El código de recuperación ha expirado",
          });
        }

        return res.status(401).json({
          message:
            "Token de recuperación inválido",
        });
      }

      // =============================================
      // VALIDAR USUARIO
      // =============================================

      if (
        decoded.userType !==
        "customer"
      ) {
        return res.status(403).json({
          message:
            "Tipo de usuario inválido",
        });
      }

      // =============================================
      // VALIDAR CÓDIGO
      // =============================================

      if (
        cleanCode !==
        String(
          decoded.randomCode
        ).toLowerCase()
      ) {
        return res.status(400).json({
          message:
            "Código incorrecto",
        });
      }

      // =============================================
      // CREAR TOKEN VERIFICADO
      // =============================================

      const verifiedToken =
        jsonwebtoken.sign(
          {
            email:
              decoded.email,

            userType:
              "customer",

            verified:
              true,
          },

          config.JWT.secret,

          {
            expiresIn:
              "15m",
          }
        );

      // =============================================
      // ACTUALIZAR COOKIE WEB
      // =============================================

      res.cookie(
        "recoveryCookie",
        verifiedToken,
        getCookieOptions()
      );

      // =============================================
      // DEVOLVER TOKEN PARA MÓVIL
      // =============================================

      return res.status(200).json({
        message:
          "Código verificado correctamente",

        token:
          verifiedToken,
      });
    } catch (error) {
      console.error(
        "[RECOVERY] Error verifyCode:",
        error
      );

      return res.status(500).json({
        message:
          "Internal server error",
      });
    }
  };

// =====================================================
// PASO 3
// CAMBIAR CONTRASEÑA
// =====================================================

recoveryPasswordCustomerController.newPassword =
  async (req, res) => {
    try {
      const {
        newPassword,
        confirmNewPassword,
      } = req.body;

      // =============================================
      // VALIDAR CAMPOS
      // =============================================

      if (
        !newPassword ||
        !confirmNewPassword
      ) {
        return res.status(400).json({
          message:
            "Debes ingresar y confirmar la nueva contraseña",
        });
      }

      // =============================================
      // VALIDAR LONGITUD
      // =============================================

      if (
        newPassword.length < 8
      ) {
        return res.status(400).json({
          message:
            "La contraseña debe contener al menos 8 caracteres",
        });
      }

      // =============================================
      // VALIDAR COINCIDENCIA
      // =============================================

      if (
        newPassword !==
        confirmNewPassword
      ) {
        return res.status(400).json({
          message:
            "Las contraseñas no coinciden",
        });
      }

      // =============================================
      // OBTENER TOKEN
      // =============================================

      const token =
        req.cookies
          ?.recoveryCookie ||
        req.headers[
          "recovery-token"
        ] ||
        req.body.token;

      if (!token) {
        return res.status(401).json({
          message:
            "El token de recuperación es requerido",
        });
      }

      // =============================================
      // VERIFICAR TOKEN
      // =============================================

      let decoded;

      try {
        decoded =
          jsonwebtoken.verify(
            token,
            config.JWT.secret
          );
      } catch (error) {
        if (
          error.name ===
          "TokenExpiredError"
        ) {
          return res.status(401).json({
            message:
              "La sesión de recuperación ha expirado",
          });
        }

        return res.status(401).json({
          message:
            "Token de recuperación inválido",
        });
      }

      // =============================================
      // VALIDAR CLIENTE
      // =============================================

      if (
        decoded.userType !==
        "customer"
      ) {
        return res.status(403).json({
          message:
            "Tipo de usuario inválido",
        });
      }

      // =============================================
      // DEBE HABER VERIFICADO EL CÓDIGO
      // =============================================

      if (
        decoded.verified !== true
      ) {
        return res.status(403).json({
          message:
            "Debes verificar el código antes de cambiar la contraseña",
        });
      }

      // =============================================
      // VERIFICAR QUE EL CLIENTE EXISTA
      // =============================================

      const customerFound =
        await customerModel.findOne({
          email:
            decoded.email,
        });

      if (!customerFound) {
        return res.status(404).json({
          message:
            "Cliente no encontrado",
        });
      }

      // =============================================
      // CIFRAR CONTRASEÑA
      // =============================================

      const passwordHash =
        await bcrypt.hash(
          newPassword,
          10
        );

      // =============================================
      // ACTUALIZAR
      // =============================================

      customerFound.password =
        passwordHash;

      await customerFound.save();

      // =============================================
      // ELIMINAR COOKIE WEB
      // =============================================

      res.clearCookie(
        "recoveryCookie",
        {
          httpOnly:
            true,

          secure:
            process.env.NODE_ENV ===
            "production",

          sameSite:
            process.env.NODE_ENV ===
            "production"
              ? "none"
              : "lax",
        }
      );

      // =============================================
      // RESPUESTA
      // =============================================

      return res.status(200).json({
        message:
          "Contraseña actualizada correctamente",
      });
    } catch (error) {
      console.error(
        "[RECOVERY] Error newPassword:",
        error
      );

      return res.status(500).json({
        message:
          "Internal server error",
      });
    }
  };

export default recoveryPasswordCustomerController;