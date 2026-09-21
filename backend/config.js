import dotenv from "dotenv";
dotenv.config();

export const config = {
  JWT: {
    secret: process.env.JWT_SECRET || (() => {
      console.error(" FATAL: JWT_SECRET no definida");
      process.exit(1);
    })(),
  },
  email: {
    user_email: process.env.USER_EMAIL,
    user_password: process.env.USER_PASSWORD,
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

// Validar variables críticas al iniciar
const requiredEnvVars = [
  'JWT_SECRET',
  'MONGO_URI',
  'USER_EMAIL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REFRESH_TOKEN',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("❌ Variables de entorno faltantes:");
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  process.exit(1);
}