import express from "express"
import cookieParser from "cookie-parser"
import registerEmployee from "./src/routes/RegisterEmployeeRoutes.js"
import recoveryPasswordEmployee from "./src/routes/RecoveryPasswordEmployeeRoutes.js"
import  Customer from "./src/routes/CustomerRoutes.js"
import  loginCustomerRoutes from "./src/routes/LoginCustomerRoutes.js"
import registerCustomerRoutes from "./src/routes/RegisterCustomerRoutes.js"

const app = express();

app.use(cookieParser());

app.use(express.json());

//Normales
app.use("/api/customers", Customer)


//Autenticacion
app.use("/api/registerEmployee", registerEmployee)
app.use("/api/recoveryPasswordEmployee", recoveryPasswordEmployee)
app.use("/api/registerCustomer", registerCustomerRoutes)
app.use("/api/loginCustomer", loginCustomerRoutes)



export default app;