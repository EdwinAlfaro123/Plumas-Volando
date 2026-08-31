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
import loginCustomerRoutes from "./src/routes/loginCustomerRoutes.js"
import registerCustomers from "./src/routes/RegisterCustomerRoutes.js"
import recoveryPasswordCustomer from "./src/routes/RecoveryPasswordCustomer.js"
import BillRoutes from "./src/routes/BillRoutes.js"
import SalesHistoryRoutes from "./src/routes/SalesHistoryRoutes.js"

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        // Permitir peticiones sin origin (apps móviles nativas, Postman, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://plumas-volandot.onrender.com",
        ];
        
        // Permitir cualquier origen de red local (Expo Go en dispositivo físico)
        const isLocalNetwork = /^http:\/\/192\.168\.\d+\.\d+/.test(origin) ||
                               /^http:\/\/10\.\d+\.\d+\.\d+/.test(origin) ||
                               /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+/.test(origin) ||
                               /^exp:\/\//.test(origin);

        if (allowedOrigins.includes(origin) || isLocalNetwork) {
            return callback(null, true);
        }
        
        return callback(null, true); // En desarrollo permitir todo; restringir en producción
    },
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