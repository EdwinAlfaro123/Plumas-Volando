import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/RecoverEmailPassword.css";
import CustomAlert from "../components/CustomAlert";

const RecoverPasswordPage = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");

  const [alert, setAlert] = useState({
    isOpen: false,
    type: "error",
    title: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const correoLimpio = correo.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoLimpio) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Campos incompletos",
        message: "Por favor llena todos los campos",
      });
      return;
    }

    if (!emailRegex.test(correoLimpio)) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Correo inválido",
        message: "Ingresa un correo válido",
      });
      return;
    }

    const usuarioGuardado = JSON.parse(
      localStorage.getItem("usuarioRegistrado")
    );

    if (!usuarioGuardado) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Sin registro",
        message: "No hay usuarios registrados",
      });
      return;
    }

    if (correoLimpio !== usuarioGuardado.correo) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Correo no encontrado",
        message: "Este correo no está registrado",
      });
      return;
    }

    setAlert({
      isOpen: true,
      type: "success",
      title: "Código enviado",
      message: "Revisa tu correo para continuar",
    });

    setTimeout(() => {
      navigate("/emailCode");
    }, 1200);
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
                Ingresa tu correo electronico
              </label>

              <div className="recover-input-wrapper">
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="recover-input"
                />
                <Mail size={14} className="recover-input-icon" />
              </div>

              <button type="submit" className="recover-btn-primary">
                Enviar
              </button>

              <button
                type="button"
                className="recover-btn-secondary"
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

export default RecoverPasswordPage;