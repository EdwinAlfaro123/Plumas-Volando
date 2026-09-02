import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

import HTMLRecoveryEmail from "../utils/sentMailVerificationCode.js";

import { config } from "../../config.js";
import customerModel from "../model/Customer.js";

const recoveryPasswordCustomerController = {};

// =====================================================
// CLIENTE OAUTH2 DE GOOGLE
// =====================================================

const oAuth2Client = new OAuth2Client(
  config.email.client_id,
  config.email.client_secret
);

oAuth2Client.setCredentials({
  refresh_token: config.email.refresh_token,
});

// =====================================================
// ENVIAR CORREO USANDO GMAIL API
// HTTPS - PUERTO 443
// =====================================================

async function sendGmailApi({
  to,
  subject,
  htmlContent,
}) {
  try {
    const accessTokenResponse =
      await oAuth2Client.getAccessToken();

    const accessToken =
      accessTokenResponse?.token;

    if (!accessToken) {
      throw new Error(
        "No se pudo obtener el access token de Google"
      );
    }

    // Gmail necesita el asunto codificado correctamente
    // para soportar tildes y caracteres especiales.
    const utf8Subject =
      `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;

    const messageParts = [
      `From: Plumas Volando <${config.email.user_email}>`,
      `To: ${to}`,
      "Content-Type: text/html; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: ${utf8Subject}`,
      "",
      htmlContent,
    ];

    const message =
      messageParts.join("\n");

    // Gmail API requiere base64 URL-safe.
    const encodedMessage =
      Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const response = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          raw: encodedMessage,
        }),
      }
    );

    if (!response.ok) {
      const errorData =
        await response.json();

      console.error(
        "Error Gmail API:",
        errorData
      );

      throw new Error(
        JSON.stringify(errorData)
      );
    }

    const responseData =
      await response.json();

    return responseData;
  } catch (error) {
    console.error(
      "Error al enviar correo con Gmail API:",
      error
    );

    throw error;
  }
}

// =====================================================
// PASO 1
// ENVIAR CÓDIGO DE RECUPERACIÓN
// =====================================================

recoveryPasswordCustomerController.requestCode =
  async (req, res) => {
    try {
      let { email } = req.body;

      // ===============================================
      // VALIDAR EMAIL
      // ===============================================

      if (!email) {
        return res.status(400).json({
          message:
            "Email is required",
        });
      }

      email =
        email.trim().toLowerCase();

      // ===============================================
      // BUSCAR CLIENTE
      // ===============================================

      const customerFound =
        await customerModel.findOne({
          email,
        });

      if (!customerFound) {
        return res.status(404).json({
          message:
            "Customer not found",
        });
      }

      // ===============================================
      // GENERAR CÓDIGO
      // ===============================================

      const randomCode =
        crypto
          .randomBytes(3)
          .toString("hex");

      console.log(
        "Código de recuperación generado para:",
        email
      );

      // ===============================================
      // CREAR TOKEN TEMPORAL
      // ===============================================

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

      // ===============================================
      // GUARDAR COOKIE
      // ===============================================

      res.cookie(
        "recoveryCookie",
        token,
        {
          maxAge:
            15 * 60 * 1000,

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

      // ===============================================
      // ENVIAR CORREO
      // ===============================================

      try {
        await sendGmailApi({
          to: email,

          subject:
            "Recuperación de contraseña - Plumas Volando",

          htmlContent:
            HTMLRecoveryEmail(
              randomCode
            ),
        });

        console.log(
          "Correo de recuperación enviado correctamente a:",
          email
        );

        // El token se devuelve porque la app móvil
        // lo necesita manualmente.
        return res.status(200).json({
          message:
            "Email sent",

          token,
        });
      } catch (error) {
        console.error(
          "Error enviando correo:",
          error
        );

        return res.status(500).json({
          message:
            "Error sending email",
        });
      }
    } catch (error) {
      console.error(
        "Error requestCode:",
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

      // ===============================================
      // VALIDAR CÓDIGO
      // ===============================================

      if (!code) {
        return res.status(400).json({
          message:
            "Code is required",
        });
      }

      // ===============================================
      // OBTENER TOKEN
      // WEB: cookie
      // MÓVIL: header o body
      // ===============================================

      const token =
        req.cookies?.recoveryCookie ||
        req.headers[
          "recovery-token"
        ] ||
        req.body.token;

      if (!token) {
        return res.status(401).json({
          message:
            "Recovery token is required",
        });
      }

      // ===============================================
      // DECODIFICAR TOKEN
      // ===============================================

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
          return res
            .status(401)
            .json({
              message:
                "Recovery token expired",
            });
        }

        return res.status(401).json({
          message:
            "Invalid recovery token",
        });
      }

      // ===============================================
      // COMPROBAR TIPO DE USUARIO
      // ===============================================

      if (
        decoded.userType !==
        "customer"
      ) {
        return res.status(403).json({
          message:
            "Invalid user type",
        });
      }

      // ===============================================
      // COMPARAR CÓDIGO
      // ===============================================

      if (
        code
          .trim()
          .toLowerCase() !==
        decoded.randomCode
          .trim()
          .toLowerCase()
      ) {
        return res.status(400).json({
          message:
            "Invalid code",
        });
      }

      // ===============================================
      // CREAR TOKEN VERIFICADO
      // ===============================================

      const newToken =
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

      // ===============================================
      // ACTUALIZAR COOKIE
      // ===============================================

      res.cookie(
        "recoveryCookie",
        newToken,
        {
          maxAge:
            15 * 60 * 1000,

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

      // ===============================================
      // RESPUESTA
      // ===============================================

      return res.status(200).json({
        message:
          "Code verified successfully",

        token:
          newToken,
      });
    } catch (error) {
      console.error(
        "Error verifyCode:",
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

      // ===============================================
      // CAMPOS OBLIGATORIOS
      // ===============================================

      if (
        !newPassword ||
        !confirmNewPassword
      ) {
        return res.status(400).json({
          message:
            "Both password fields are required",
        });
      }

      // ===============================================
      // VALIDAR LONGITUD
      // ===============================================

      if (
        newPassword.length < 8
      ) {
        return res.status(400).json({
          message:
            "Password must contain at least 8 characters",
        });
      }

      // ===============================================
      // COMPARAR CONTRASEÑAS
      // ===============================================

      if (
        newPassword !==
        confirmNewPassword
      ) {
        return res.status(400).json({
          message:
            "Passwords do not match",
        });
      }

      // ===============================================
      // OBTENER TOKEN
      // ===============================================

      const token =
        req.cookies?.recoveryCookie ||
        req.headers[
          "recovery-token"
        ] ||
        req.body.token;

      if (!token) {
        return res.status(401).json({
          message:
            "Recovery token is required",
        });
      }

      // ===============================================
      // DECODIFICAR TOKEN
      // ===============================================

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
          return res
            .status(401)
            .json({
              message:
                "Recovery token expired",
            });
        }

        return res.status(401).json({
          message:
            "Invalid recovery token",
        });
      }

      // ===============================================
      // VALIDAR TIPO DE USUARIO
      // ===============================================

      if (
        decoded.userType !==
        "customer"
      ) {
        return res.status(403).json({
          message:
            "Invalid user type",
        });
      }

      // ===============================================
      // COMPROBAR QUE PASÓ POR PASO 2
      // ===============================================

      if (!decoded.verified) {
        return res.status(400).json({
          message:
            "Code not verified",
        });
      }

      // ===============================================
      // ENCRIPTAR NUEVA CONTRASEÑA
      // ===============================================

      const passwordHash =
        await bcrypt.hash(
          newPassword,
          10
        );

      // ===============================================
      // ACTUALIZAR CLIENTE
      // ===============================================

      const customerUpdated =
        await customerModel.findOneAndUpdate(
          {
            email:
              decoded.email,
          },

          {
            password:
              passwordHash,
          },

          {
            new: true,
          }
        );

      if (!customerUpdated) {
        return res.status(404).json({
          message:
            "Customer not found",
        });
      }

      // ===============================================
      // ELIMINAR COOKIE
      // ===============================================

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

      // ===============================================
      // RESPUESTA
      // ===============================================

      return res.status(200).json({
        message:
          "Password updated successfully",
      });
    } catch (error) {
      console.error(
        "Error newPassword:",
        error
      );

      return res.status(500).json({
        message:
          "Internal server error",
      });
    }
  };

export default recoveryPasswordCustomerController;