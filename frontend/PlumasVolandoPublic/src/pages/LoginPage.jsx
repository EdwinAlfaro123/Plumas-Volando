import React, { useState } from "react";
import { Mail, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../styles/Login.css";
import CustomAlert from "../components/CustomAlert";
import LoginImage from "../img/LoginImage.png";
import Logo from "../img/PlumasVolandoLogo.png";
import api from "../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [alert, setAlert] = useState({
    isOpen: false,
    type: "success",
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

  const getLoggedUser = (data) => {
    return (
      data?.customer ||
      data?.customerFound ||
      data?.user ||
      data?.userFound ||
      data?.data ||
      null
    );
  };

  const getUserName = (user) => {
    return (
      user?.name ||
      user?.nombre ||
      user?.firstName ||
      user?.username ||
      formData.email.split("@")[0] ||
      "usuario"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Campos incompletos",
        message: "Por favor llena todos los campos",
      });
      return;
    }

    try {
      const response = await api.post("/loginCustomer", {
        email: formData.email,
        password: formData.password,
      });

      const loggedUser = getLoggedUser(response.data);

      localStorage.setItem("loginEmail", formData.email);

      if (loggedUser) {
        localStorage.setItem("user", JSON.stringify(loggedUser));
      } else {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: formData.email,
          })
        );
      }

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      window.dispatchEvent(new Event("plumas:user-updated"));

      setAlert({
        isOpen: true,
        type: "success",
        title: "Bienvenido",
        message: `Hola ${getUserName(loggedUser)}, sesión iniciada correctamente`,
      });

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message ||
          "Correo o contraseña incorrectos",
      });
    }
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-left">
            <div className="login-header">
              <div className="login-logo-box">
                <img
                  src={Logo}
                  alt="Logo Plumas Volando"
                  className="login-logo"
                />
              </div>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <h1 className="login-form-title">Iniciar Sesión</h1>

              <div className="login-field">
                <label htmlFor="email">Correo</label>

                <div className="login-input-wrapper">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <Mail size={18} className="login-input-icon" />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="password">Contraseña</label>

                <div className="login-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="login-icon-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn">
                Entrar
              </button>

              <p className="login-forgot">
                <span
                  onClick={() => navigate("/recoverEmail")}
                  className="login-link"
                >
                  Restablece tu contraseña
                </span>
              </p>

              <p className="login-register">
                ¿No tienes cuenta?{" "}
                <span onClick={() => navigate("/register")}>
                  Regístrate aquí
                </span>
              </p>
            </form>
          </div>

          <div className="login-right">
            <img
              src={LoginImage}
              alt="Imagen login"
              className="login-side-image"
            />
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

export default LoginPage;