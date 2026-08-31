import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import registerEmployee from "./src/routes/RegisterEmployeeRoutes.js"
import employeeRoutes from "./src/routes/EmployeesRoutes.js"
import loginEmployeeRoutes from "./src/routes/LoginEmployeeRoutes.js"
import recoveryPasswordEmployee from "./src/routes/RecoveryPasswordEmployeeRoutes.js"
import ProductsRoutes from "./src/routes/ProductsRoutes.js"
import EggsRoutes from "./src/routes/EggsRoutes.js"
import ChickensRoutes from "./src/routes/ChickensRoutes.js"
import OrderROutes from "./src/routes/OrderRoutes.js"
import customersRoutes from "./src/routes/CustomerRoutes.js"
import loginCustomerRoutes from "./src/routes/LoginCustomerRoutes.js"
import registerCustomers from "./src/routes/RegisterCustomerRoutes.js"
import recoveryPasswordCustomer from "./src/routes/RecoveryPasswordCustomer.js"
import BillRoutes from "./src/routes/BillRoutes.js"
import SalesHistoryRoutes from "./src/routes/SalesHistoryRoutes.js"

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// Rutas de empleados
app.use("/api/registerEmployee", registerEmployee);
app.use("/api/recoveryPasswordEmployee", recoveryPasswordEmployee);
app.use("/api/employee", employeeRoutes);
app.use("/api/loginEmployee", loginEmployeeRoutes);

// Rutas de productos
app.use("/api/products", ProductsRoutes);
app.use("/api/egg", EggsRoutes);
app.use("/api/chicken", ChickensRoutes);

// Rutas de órdenes
app.use("/api/orders", OrderROutes);

// Rutas de clientes
app.use("/api/loginCustomer", loginCustomerRoutes);
app.use("/api/customer", customersRoutes);
app.use("/api/registerCustomer", registerCustomers);
app.use("/api/recoveryPasswordCustomer", recoveryPasswordCustomer);

// Rutas de facturación
app.use("/api/bill", BillRoutes);
app.use("/api/salesHistory", SalesHistoryRoutes);

export default app
