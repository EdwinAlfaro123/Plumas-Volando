import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RecoverEmailCode.css";
import CustomAlert from "../components/CustomAlert";

const RecoverCodePage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const [alert, setAlert] = useState({
    isOpen: false,
    type: "error",
    title: "",
    message: "",
  });

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fullCode = code.join("");

    if (fullCode.length < 6) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Código incompleto",
        message: "Por favor ingresa los 6 dígitos",
      });
      return;
    }

    setAlert({
      isOpen: true,
      type: "success",
      title: "Código correcto",
      message: "Verificación completada correctamente",
    });
  };

  const handleResend = () => {
    setAlert({
      isOpen: true,
      type: "success",
      title: "Código reenviado",
      message: "Se ha enviado un nuevo código a tu correo",
    });
  };

  return (
    <>
      <div className="recover-code-page">
        <div className="recover-code-panel">
          <h1 className="recover-code-title">
            Recuperar
            <br />
            Contraseña
          </h1>

          <div className="recover-code-card">
            <form onSubmit={handleSubmit} className="recover-code-form">
              <label className="recover-code-label">
                Ingresar codigo de verificacion
              </label>

              <div className="recover-code-inputs">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="recover-code-input"
                  />
                ))}
              </div>

              <p className="recover-code-text">
                ¿No recibiste el codigo?
                <span
                  className="recover-code-resend"
                  onClick={handleResend}
                >
                  Reenviar
                </span>
              </p>

              <button 
                type="submit" className="recover-code-btn-primary"
                onClick={() => navigate("/newPass")}>
                Ingresar
              </button>

              <button
                type="button"
                className="recover-code-btn-secondary"
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

export default RecoverCodePage;