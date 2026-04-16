import React, { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import "../styles/Register.css";

import CustomButton from "../components/Buttons";
import CustomInput from "../components/Input";
import AuthLayout from "../components/AuthLayout";
import CustomAlert from "../components/CustomAlert";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    password: "",
    confirmPassword: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar campos vacíos
    if (
      !formData.nombre ||
      !formData.correo ||
      !formData.telefono ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Campos incompletos",
        message: "Por favor llena todos los campos",
      });
      return;
    }

    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Las contraseñas no coinciden",
      });
      return;
    }

    // Simular registro exitoso
    setAlert({
      isOpen: true,
      type: "success",
      title: "Registro exitoso",
      message: "Tu cuenta fue creada correctamente",
    });

    console.log("Datos de registro:", formData);

    // Limpiar formulario
    setFormData({
      nombre: "",
      correo: "",
      telefono: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <>
      <AuthLayout title="Bienvenido a la Granja" subtitle="Registro">
        <form className="register-form" onSubmit={handleSubmit}>
          
          <CustomInput
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            icon={<User size={16} />}
            required
          />

          <CustomInput
            label="Correo"
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            icon={<Mail size={16} />}
            required
          />

          <CustomInput
            label="Telefono"
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            icon={<Phone size={16} />}
            required
          />

          <CustomInput
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            rightElement={
              <button
                type="button"
                className="icon-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Lock size={16} />}
              </button>
            }
          />

          <CustomInput
            label="Confirmar Contraseña"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            rightElement={
              <button
                type="button"
                className="icon-button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            }
          />

          <CustomButton text="Registrarse" type="submit" />

          <p className="register-footer">
            ¿Tienes cuenta? <span>Inicia sesión</span>
          </p>

        </form>
      </AuthLayout>

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

export default RegisterPage;