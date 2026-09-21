import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import RecoverEmail from "./pages/RecoverEmailPasswordPage";
import EmailCode from "./pages/RecoverEmailCodePage";
import NewPass from "./pages/RecoverNewPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import CustomerPage from "./pages/CustomerPage";
import BillPage from "./pages/BillPage";
import Employee from "./pages/EmployeePage";
import OrdersPage from "./pages/OrdersPage";
import ChickenPage from "./pages/ChickenPage";
import ProductsPage from "./pages/ProductsPage";
import HistoryPage from "./pages/RecordsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recoverEmail" element={<RecoverEmail />} />
        <Route path="/emailCode" element={<EmailCode />} />
        <Route path="/newPass" element={<NewPass />} />

        {/* Rutas protegidas: requieren sesión iniciada */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/customers" element={<CustomerPage />} />
          <Route path="/bills" element={<BillPage />} />
          <Route path="/employees" element={<Employee />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/chickens" element={<ChickenPage />} />
          <Route path="/records" element={<HistoryPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Route>

        {/* Raíz y rutas desconocidas: pasan por el guard (con sesión -> dashboard, sin sesión -> login) */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;