import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import registerEmployee from './src/routes/RegisterEmployeeRoutes.js';
import employeeRoutes from './src/routes/EmployeesRoutes.js';
import loginEmployeeRoutes from './src/routes/LoginEmployeeRoutes.js';
import recoveryPasswordEmployee from './src/routes/RecoveryPasswordEmployeeRoutes.js';
import ProductsRoutes from './src/routes/ProductsRoutes.js';
import EggsRoutes from './src/routes/EggsRoutes.js';
import ChickensRoutes from './src/routes/ChickensRoutes.js';
import OrderRoutes from './src/routes/OrderRoutes.js';
import customersRoutes from './src/routes/CustomerRoutes.js';
import loginCustomerRoutes from './src/routes/LoginCustomerRoutes.js';
import registerCustomers from './src/routes/RegisterCustomerRoutes.js';
import recoveryPasswordCustomer from './src/routes/RecoveryPasswordCustomer.js';
import BillRoutes from './src/routes/BillRoutes.js';
import SalesHistoryRoutes from './src/routes/SalesHistoryRoutes.js';
import HomeSummaryRoutes from './src/routes/HomeSummaryRoutes.js';

const app = express();

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/registerEmployee', registerEmployee);
app.use('/api/recoveryPasswordEmployee', recoveryPasswordEmployee);
app.use('/api/employee', employeeRoutes);
app.use('/api/loginEmployee', loginEmployeeRoutes);
app.use('/api/products', ProductsRoutes);
app.use('/api/egg', EggsRoutes);
app.use('/api/chicken', ChickensRoutes);
app.use('/api/orders', OrderRoutes);
app.use('/api/customer', customersRoutes);
app.use('/api/loginCustomer', loginCustomerRoutes);
app.use('/api/registerCustomer', registerCustomers);
app.use('/api/recoveryPasswordCustomer', recoveryPasswordCustomer);
app.use('/api/bill', BillRoutes);
app.use('/api/salesHistory', SalesHistoryRoutes);
app.use('/api/home-summary', HomeSummaryRoutes);

export default app;