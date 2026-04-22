import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import RecoverEmail from "./pages/RecoverEmailPasswordPage";
import EmailCode from "./pages/RecoverEmailCodePage";
import NewPass from "./pages/RecoverNewPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import CustomerPage from "./pages/CustomerPage";
import BillPage from "./pages/BillPage";
import Employee from "./pages/EmployeePage"
import OrdersPage from "./pages/OrdersPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recoverEmail" element={<RecoverEmail />} />
        <Route path="/emailCode" element={<EmailCode />} />
        <Route path="/newPass" element={<NewPass />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/bills" element={<BillPage />} />
        <Route path="/employees" element={<Employee />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;