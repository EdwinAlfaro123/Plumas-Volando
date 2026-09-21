import mongoose from "mongoose";
import { config } from "./config.js";

const connectDB = async () => {
  try {
    if (!config.mongo.uri) {
      throw new Error("MONGO_URI no está definida en las variables de entorno");
    }

    const conn = await mongoose.connect(config.mongo.uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(" Error al conectar MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;