import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/RecoverEmailPassword.css";
import CustomAlert from "../components/CustomAlert";

const RecoverEmailPasswordPage = () => {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const correoLimpio = correo.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoLimpio) {
      showAlert(
        "error",
        "Campos incompletos",
        "Por favor ingresa tu correo electrónico"
      );
      return;
    }

    if (!emailRegex.test(correoLimpio)) {
      showAlert("error", "Correo inválido", "Ingresa un correo válido");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:4000/api/recoveryPasswordEmployee/requestCode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: correoLimpio,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Not found") {
          showAlert(
            "error",
            "Correo no encontrado",
            "Este correo no está registrado"
          );
          return;
        }

        if (data.message === "Error sending mail") {
          showAlert(
            "error",
            "Error al enviar",
            "No se pudo enviar el código al correo"
          );
          return;
        }

        showAlert(
          "error",
          "Error",
          data.message || "No se pudo procesar la solicitud"
        );
        return;
      }

      showAlert(
        "success",
        "Código enviado",
        "Revisa tu correo para continuar"
      );

      setTimeout(() => {
        navigate("/emailCode");
      }, 1200);
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
      <div className="recover-page">
        <div className="recover-panel">
          <h1 className="recover-title">
            Recuperar
            <br />
            Contraseña
          </h1>

          <div className="recover-card">
            <form onSubmit={handleSubmit} className="recover-form">
              <label className="recover-label">
                Ingresa tu correo electrónico
              </label>

              <div className="recover-input-wrapper">
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="recover-input"
                  disabled={loading}
                  placeholder="ejemplo@gmail.com"
                />
                <Mail size={14} className="recover-input-icon" />
              </div>

              <button
                type="submit"
                className="recover-btn-primary"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar"}
              </button>

              <button
                type="button"
                className="recover-btn-secondary"
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

export default RecoverEmailPasswordPage;