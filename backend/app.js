import express from "express"
import cookieParser from "cookie-parser"
import registerEmployee from "./src/routes/RegisterEmployeeRoutes.js"
import recoveryPasswordEmployee from "./src/routes/RecoveryPasswordEmployeeRoutes.js"

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use("/api/registerEmployee", registerEmployee)
app.use("/api/recoveryPasswordEmployee", recoveryPasswordEmployee)

export default app