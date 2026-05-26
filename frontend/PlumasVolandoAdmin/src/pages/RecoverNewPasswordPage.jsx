import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/RecoverNewPassword.css";
import CustomAlert from "../components/CustomAlert";

const RecoverNewPasswordPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [alert, setAlert] = useState({
    isOpen: false,
    type: "error",
    title: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const passwordLimpia = formData.password.trim();
    const confirmPasswordLimpia = formData.confirmPassword.trim();

    if (!passwordLimpia || !confirmPasswordLimpia) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Campos incompletos",
        message: "Por favor llena ambos campos",
      });
      return;
    }

    if (passwordLimpia !== confirmPasswordLimpia) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Contraseñas diferentes",
        message: "Las contraseñas no coinciden",
      });
      return;
    }

    setAlert({
      isOpen: true,
      type: "success",
      title: "Contraseña actualizada",
      message: "Tu contraseña se cambió correctamente",
    });

    setTimeout(() => {
      navigate("/login");
    }, 1400);
  };

  return (
    <>
      <div className="recover-new-page">
        <div className="recover-new-panel">
          <h1 className="recover-new-title">
            Recuperar
            <br />
            Contraseña
            <span className="recover-new-stars"> ***</span>
          </h1>

          <div className="recover-new-card">
            <form onSubmit={handleSubmit} className="recover-new-form">
              <label className="recover-new-label">
                Ingresar una nueva contraseña
              </label>

              <div className="recover-new-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="recover-new-input"
                />
                <button
                  type="button"
                  className="recover-new-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <label className="recover-new-label">
                Confirmar tu nueva contraseña
              </label>

              <div className="recover-new-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="recover-new-input"
                />
                <button
                  type="button"
                  className="recover-new-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>
              </div>

              <button type="submit" className="recover-new-btn-primary">
                Cambiar contraseña
              </button>

              <button
                type="button"
                className="recover-new-btn-secondary"
                onClick={() => navigate("/login")}
              >
                Volver al Inicio de sesion
              </button>
            </form>
          </div>
        </div>
      </div>

      <CustomAlert
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() =>
          setAlert((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
      />
    </>
  );
};

export default RecoverNewPasswordPage;