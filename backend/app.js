import express from "express"
import cookieParser from "cookie-parser"
import registerEmployee from "./src/routes/RegisterEmployeeRoutes.js"
import employeeRoutes from "./src/routes/EmployeesRoutes.js"
import loginEmployeeRoutes from "./src/routes/LoginEmployeeRoutes.js"
import recoveryPasswordEmployee from "./src/routes/RecoveryPasswordEmployeeRoutes.js"
import ProductsRoutes from "./src/routes/ProductsRoutes.js"
import EggsRoutes from "./src/routes/EggsRoutes.js"
import ChickensRoutes from "./src/routes/ChickensRoutes.js"
import OrderROutes from "./src/routes/OrderRoutes.js"
const app = express();

app.use(cookieParser());

app.use(express.json());

app.use("/api/registerEmployee", registerEmployee);
app.use("/api/recoveryPasswordEmployee", recoveryPasswordEmployee);
app.use("/api/employee", employeeRoutes);
app.use("/api/loginEmployee", loginEmployeeRoutes);
app.use("/api/products", ProductsRoutes);
app.use("/api/egg", EggsRoutes);
app.use("/api/chicken", ChickensRoutes);
app.use("/api/orders", OrderROutes)

export default app