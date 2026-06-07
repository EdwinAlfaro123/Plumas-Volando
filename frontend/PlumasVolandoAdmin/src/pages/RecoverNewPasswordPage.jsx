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

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [alert, setAlert] = useState({
    isOpen: false,
    type: "error",
    title: "",
    message: "",
  });

  const showAlert = (type, title, message) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPassword = formData.password;
    const confirmNewPassword = formData.confirmPassword;

    if (!newPassword.trim() || !confirmNewPassword.trim()) {
      showAlert(
        "error",
        "Campos incompletos",
        "Por favor llena ambos campos"
      );
      return;
    }

    if (newPassword.length < 6) {
      showAlert(
        "error",
        "Contraseña débil",
        "La contraseña debe tener al menos 6 caracteres"
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showAlert(
        "error",
        "Contraseñas diferentes",
        "Las contraseñas no coinciden"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:4000/api/recoveryPasswordEmployee/newPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            newPassword,
            confirmNewPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Password doesnt match") {
          showAlert(
            "error",
            "Contraseñas diferentes",
            "Las contraseñas no coinciden"
          );
          return;
        }

        if (data.message === "Code not verified") {
          showAlert(
            "error",
            "Código no verificado",
            "Primero debes verificar el código enviado a tu correo"
          );

          setTimeout(() => {
            navigate("/emailCode");
          }, 1400);

          return;
        }

        if (data.message === "Internal server error") {
          showAlert(
            "error",
            "Sesión expirada",
            "Vuelve a solicitar un código para cambiar tu contraseña"
          );

          setTimeout(() => {
            navigate("/recoverEmail");
          }, 1600);

          return;
        }

        showAlert(
          "error",
          "Error",
          data.message || "No se pudo actualizar la contraseña"
        );
        return;
      }

      if (data.message !== "Password updated") {
        showAlert(
          "error",
          "Error",
          "El servidor no confirmó el cambio de contraseña"
        );
        return;
      }

      sessionStorage.removeItem("recoveryEmail");

      showAlert(
        "success",
        "Contraseña actualizada",
        "Tu contraseña se cambió correctamente"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1400);
    } catch (error) {
      showAlert(
        "error",
        "Error de conexión",
        "No se pudo conectar con el servidor"
      );
    } finally {
      setLoading(false);
    }
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
                  disabled={loading}
                />

                <button
                  type="button"
                  className="recover-new-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
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
                  disabled={loading}
                />

                <button
                  type="button"
                  className="recover-new-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="recover-new-btn-primary"
                disabled={loading}
              >
                {loading ? "Cambiando..." : "Cambiar contraseña"}
              </button>

              <button
                type="button"
                className="recover-new-btn-secondary"
                onClick={() => navigate("/login")}
                disabled={loading}
              >
                Volver al Inicio de sesión
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