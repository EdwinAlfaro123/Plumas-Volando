// frontend/PlumasVolandoPublic/src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Eye, EyeOff, User, Phone, Calendar, Shield, UserPlus } from "lucide-react";
import api from "../services/api";
import CustomAlert from "../components/CustomAlert";
import "../styles/Register.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    DUI: "",
    birthdate: "",
  });

  const [alert, setAlert] = useState({
    isOpen: false,
    type: "info",
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

  const validateForm = () => {
    // Validar nombre
    if (!formData.name.trim() || formData.name.length < 3) {
      setAlert({
        isOpen: true,
        type: "warning",
        title: "Nombre inválido",
        message: "El nombre debe tener al menos 3 caracteres.",
      });
      return false;
    }

    // Validar apellido
    if (!formData.lastname.trim() || formData.lastname.length < 3) {
      setAlert({
        isOpen: true,
        type: "warning",
        title: "Apellido inválido",
        message: "El apellido debe tener al menos 3 caracteres.",
      });
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setAlert({
        isOpen: true,
        type: "warning",
        title: "Email inválido",
        message: "Por favor ingresa un correo electrónico válido.",
      });
      return false;
    }

    // Validar contraseña
    if (formData.password.length < 8) {
      setAlert({
        isOpen: true,
        type: "warning",
        title: "Contraseña débil",
        message: "La contraseña debe tener al menos 8 caracteres.",
      });
      return false;
    }

    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      setAlert({
        isOpen: true,
        type: "warning",
        title: "Contraseñas no coinciden",
        message: "Las contraseñas ingresadas no son iguales.",
      });
      return false;
    }

    // Validar teléfono
    const phoneRegex = /^[0-9]{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setAlert({
        isOpen: true,
        type: "warning",
        title: "Teléfono inválido",
        message: "El teléfono debe tener exactamente 8 dígitos.",
      });
      return false;
    }

    // Validar DUI
    const duiRegex = /^\d{8}-\d$/;
    if (!duiRegex.test(formData.DUI)) {
      setAlert({
        isOpen: true,
        type: "warning",
        title: "DUI inválido",
        message: "El DUI debe tener formato: 12345678-9",
      });
      return false;
    }

    // Validar fecha de nacimiento
    if (!formData.birthdate) {
      setAlert({
        isOpen: true,
        type: "warning",
        title: "Fecha de nacimiento requerida",
        message: "Por favor ingresa tu fecha de nacimiento.",
      });
      return false;
    }

    const birthDate = new Date(formData.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setAlert({
        isOpen: true,
        type: "warning",
        title: "Edad mínima",
        message: "Debes ser mayor de 18 años para registrarte.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name.trim(),
        lastname: formData.lastname.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        DUI: formData.DUI.trim(),
        birthdate: formData.birthdate,
        isActive: true,
      };

      const response = await api.post("/registerCustomer", userData);

      if (response.status === 201) {
        setAlert({
          isOpen: true,
          type: "success",
          title: "¡Registro exitoso!",
          message: "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }
    } catch (error) {
      console.error("Error en registro:", error);
      
      let errorMessage = "Ocurrió un error al registrar tu cuenta.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setAlert({
        isOpen: true,
        type: "error",
        title: "Error de registro",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="register-wrapper">
        <div className="register-card">
          <div className="register-left">
            <div className="register-header">
              <div className="register-logo-box">
                <img src="/src/img/PlumasVolandoLogo.png" alt="Logo" className="register-logo" />
              </div>
              <h1>Crear cuenta</h1>
              <p>Regístrate para empezar a comprar</p>
            </div>

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="register-row">
                <div className="register-field">
                  <label>Nombre</label>
                  <div className="register-input-wrapper">
                    <input
                      type="text"
                      name="name"
                      placeholder="Tu nombre"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <User size={18} className="register-input-icon" />
                  </div>
                </div>

                <div className="register-field">
                  <label>Apellido</label>
                  <div className="register-input-wrapper">
                    <input
                      type="text"
                      name="lastname"
                      placeholder="Tu apellido"
                      value={formData.lastname}
                      onChange={handleChange}
                    />
                    <User size={18} className="register-input-icon" />
                  </div>
                </div>
              </div>

              <div className="register-field">
                <label>Correo electrónico</label>
                <div className="register-input-wrapper">
                  <input
                    type="email"
                    name="email"
                    placeholder="tucorreo@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <Mail size={18} className="register-input-icon" />
                </div>
              </div>

              <div className="register-row">
                <div className="register-field">
                  <label>Contraseña</label>
                  <div className="register-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="register-icon-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="register-field">
                  <label>Confirmar contraseña</label>
                  <div className="register-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="register-icon-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="register-row">
                <div className="register-field">
                  <label>Teléfono</label>
                  <div className="register-input-wrapper">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="12345678"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <Phone size={18} className="register-input-icon" />
                  </div>
                </div>

                <div className="register-field">
                  <label>DUI</label>
                  <div className="register-input-wrapper">
                    <input
                      type="text"
                      name="DUI"
                      placeholder="12345678-9"
                      value={formData.DUI}
                      onChange={handleChange}
                    />
                    <Shield size={18} className="register-input-icon" />
                  </div>
                </div>
              </div>

              <div className="register-field">
                <label>Fecha de nacimiento</label>
                <div className="register-input-wrapper">
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                  />
                  <Calendar size={18} className="register-input-icon" />
                </div>
              </div>

              <button type="submit" className="register-btn" disabled={loading}>
                <UserPlus size={20} />
                {loading ? "Registrando..." : "Registrarse"}
              </button>

              <p className="register-login">
                ¿Ya tienes cuenta?{" "}
                <span onClick={() => navigate("/login")}>Inicia sesión aquí</span>
              </p>
            </form>
          </div>

          <div className="register-right">
            <div className="register-benefits">
              <h2>Beneficios de registrarte</h2>
              <ul>
                <li>🛒 Compra rápida y segura</li>
                <li>📦 Seguimiento de tus pedidos</li>
                <li>💳 Métodos de pago flexibles</li>
                <li>🎯 Ofertas exclusivas para clientes</li>
                <li>📱 Acceso desde cualquier dispositivo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <CustomAlert
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        confirmText="Entendido"
        onConfirm={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
        onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};

export default RegisterPage;