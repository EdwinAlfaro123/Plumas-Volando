import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RecoverEmailCode.css";
import CustomAlert from "../components/CustomAlert";

const RecoverEmailCodePage = () => {
  const navigate = useNavigate();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputsRef = useRef([]);

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

  const cleanInputValue = (value) => {
    return value.toLowerCase().replace(/[^a-f0-9]/g, "").slice(-1);
  };

  const clearCode = () => {
    setCode(["", "", "", "", "", ""]);

    setTimeout(() => {
      inputsRef.current[0]?.focus();
    }, 100);
  };

  const handleChange = (e, index) => {
    const value = cleanInputValue(e.target.value);

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

    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedCode = e.clipboardData
      .getData("text")
      .toLowerCase()
      .replace(/[^a-f0-9]/g, "")
      .slice(0, 6);

    if (!pastedCode) return;

    const newCode = ["", "", "", "", "", ""];

    pastedCode.split("").forEach((character, index) => {
      newCode[index] = character;
    });

    setCode(newCode);

    const nextIndex = pastedCode.length >= 6 ? 5 : pastedCode.length;
    inputsRef.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullCode = code.join("").trim().toLowerCase();

    if (fullCode.length !== 6 || code.includes("")) {
      showAlert(
        "error",
        "Código incompleto",
        "Ingresa los 6 caracteres del código enviado a tu correo"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:4000/api/recoveryPasswordEmployee/verifyCode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            code: fullCode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Invalid code") {
          showAlert(
            "error",
            "Código incorrecto",
            "El código ingresado no coincide con el código enviado"
          );
          clearCode();
          return;
        }

        if (data.message === "Internal server error") {
          showAlert(
            "error",
            "Código expirado",
            "El código venció o no existe una solicitud activa. Reenvía el código o vuelve a ingresar tu correo"
          );
          clearCode();
          return;
        }

        showAlert(
          "error",
          "Error de verificación",
          data.message || "No se pudo verificar el código"
        );
        clearCode();
        return;
      }

      if (data.message !== "Code verified successfully") {
        showAlert(
          "error",
          "Código no verificado",
          "El servidor no confirmó la verificación del código"
        );
        clearCode();
        return;
      }

      showAlert(
        "success",
        "Código correcto",
        "Ahora puedes crear tu nueva contraseña"
      );

      setTimeout(() => {
        navigate("/newPass");
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

  const handleResend = async () => {
    const savedEmail = sessionStorage.getItem("recoveryEmail");

    if (!savedEmail) {
      showAlert(
        "error",
        "Correo no encontrado",
        "Vuelve a ingresar tu correo para solicitar un nuevo código"
      );

      setTimeout(() => {
        navigate("/recoverEmail");
      }, 1500);

      return;
    }

    try {
      setResending(true);

      const response = await fetch(
        "http://localhost:4000/api/recoveryPasswordEmployee/requestCode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: savedEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Not found") {
          showAlert(
            "error",
            "Correo no encontrado",
            "Este correo ya no se encuentra registrado"
          );
          return;
        }

        if (data.message === "Error sending mail") {
          showAlert(
            "error",
            "Error al reenviar",
            "No se pudo enviar el nuevo código al correo"
          );
          return;
        }

        showAlert(
          "error",
          "Error al reenviar",
          data.message || "No se pudo reenviar el código"
        );
        return;
      }

      clearCode();

      showAlert(
        "success",
        "Código reenviado",
        "Se ha enviado un nuevo código a tu correo"
      );
    } catch (error) {
      showAlert(
        "error",
        "Error de conexión",
        "No se pudo conectar con el servidor"
      );
    } finally {
      setResending(false);
    }
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
                Ingresa el código de verificación
              </label>

              <div className="recover-code-inputs">
                {code.map((character, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    inputMode="text"
                    maxLength={1}
                    value={character}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="recover-code-input"
                    disabled={loading || resending}
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck="false"
                  />
                ))}
              </div>

              <p className="recover-code-text">
                ¿No recibiste el código?
                <span
                  className="recover-code-resend"
                  onClick={loading || resending ? undefined : handleResend}
                >
                  {resending ? " Reenviando..." : " Reenviar"}
                </span>
              </p>

              <p className="recover-code-text">
                El código vence en 15 minutos
              </p>

              <button
                type="submit"
                className="recover-code-btn-primary"
                disabled={loading || resending}
              >
                {loading ? "Verificando..." : "Ingresar"}
              </button>

              <button
                type="button"
                className="recover-code-btn-secondary"
                onClick={() => navigate("/login")}
                disabled={loading || resending}
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

export default RecoverEmailCodePage;