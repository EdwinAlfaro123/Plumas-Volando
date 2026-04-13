import React, { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import "../styles/Register.css";
import Plumas from "../img/Plumas.png";

const RegisterUI = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    console.log("Datos de registro:", formData);
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <div className="register-left">
          <div className="register-header">
            <h1>Bienvenido a la Granja</h1>
            <h2>Registro</h2>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="nombre">Nombre</label>
              <div className="neo-input">
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
                <User size={16} />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="correo">Correo</label>
              <div className="neo-input">
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
                <Mail size={16} />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="telefono">Telefono</label>
              <div className="neo-input">
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
                <Phone size={16} />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <div className="neo-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {showPassword ? <EyeOff size={16} /> : <Lock size={16} />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <div className="neo-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Mostrar u ocultar confirmación"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="register-btn">
              Registrarse
            </button>

            <p className="register-footer">
              ¿Tienes cuenta? <span>Inicia sesion</span>
            </p>
          </form>
        </div>

        <div className="register-right">
          <div className="register-right-inner">
            <img src={Plumas} alt="Imagen decorativa" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterUI;