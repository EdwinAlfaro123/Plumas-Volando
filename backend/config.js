import dotenv from "dotenv";

dotenv.config();

export const config = {
  JWT: {
    secret: process.env.JWT_SECRET,
  },

  email: {
    // Correo desde el cual se enviarán los códigos
    user_email: process.env.USER_EMAIL,

    // Se conserva por compatibilidad con cualquier módulo
    // antiguo que todavía utilice Nodemailer.
    user_password: process.env.USER_PASSWORD,

    // Credenciales OAuth 2.0 para Gmail API
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  },

  cloudinary: {
    cloudinary_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  },

  mongo: {
    uri: process.env.MONGO_URI,
  },
};