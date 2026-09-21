import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Importar rutas
import loginEmployeeRoutes from "./src/routes/LoginEmployeeRoutes.js";
import loginCustomerRoutes from "./src/routes/LoginCustomerRoutes.js";
import registerEmployeeRoutes from "./src/routes/RegisterEmployeeRoutes.js";
import registerCustomerRoutes from "./src/routes/RegisterCustomerRoutes.js";
import recoveryPasswordEmployeeRoutes from "./src/routes/RecoveryPasswordEmployeeRoutes.js";
import recoveryPasswordCustomerRoutes from "./src/routes/RecoveryPasswordCustomer.js";
import employeeRoutes from "./src/routes/EmployeesRoutes.js";
import customerRoutes from "./src/routes/CustomerRoutes.js";
import productsRoutes from "./src/routes/ProductsRoutes.js";
import chickensRoutes from "./src/routes/ChickensRoutes.js";
import eggsRoutes from "./src/routes/EggsRoutes.js";
import orderRoutes from "./src/routes/OrderRoutes.js";
import billRoutes from "./src/routes/BillRoutes.js";
import salesHistoryRoutes from "./src/routes/SalesHistoryRoutes.js";


dotenv.config();

const app = express();

// ✅ CORS - Debe ir primero
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:8081",
      "http://localhost:19006",
      "https://plumas-volandot.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "recovery-token",
    ],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/loginEmployee", loginEmployeeRoutes);
app.use("/api/loginCustomer", loginCustomerRoutes);
app.use("/api/registerEmployee", registerEmployeeRoutes);
app.use("/api/registerCustomer", registerCustomerRoutes);
app.use("/api/recoveryPasswordEmployee", recoveryPasswordEmployeeRoutes);
app.use("/api/recoveryPasswordCustomer", recoveryPasswordCustomerRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/chicken", chickensRoutes);
app.use("/api/eggs", eggsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bill", billRoutes);
app.use("/api/salesHistory", salesHistoryRoutes);


// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend funcionando correctamente" });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

export default app;