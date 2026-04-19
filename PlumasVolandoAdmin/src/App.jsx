import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import RecoverEmail from "./pages/RecoverEmailPasswordPage"
import EmailCode from "./pages/RecoverEmailCodePage"
import NewPass from "./pages/RecoverNewPasswordPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recoverEmail" element={<RecoverEmail />} />
        <Route path="/emailCode" element={<EmailCode />} />
        <Route path="/newPass" element={<NewPass />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;