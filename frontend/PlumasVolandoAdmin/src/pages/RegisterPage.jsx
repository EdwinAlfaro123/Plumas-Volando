import React, { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, CreditCard } from "lucide-react";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/Buttons";
import CustomInput from "../components/Input";
import AuthLayout from "../components/AuthLayout";
import CustomAlert from "../components/CustomAlert";
import api from "../services/api"

const RegisterPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    dui: "",
    DateContract: new Date().toISOString().split("T")[0],
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
    let newValue = value;

    if (name === "telefono") {
      const rawValue = value.replace(/\D/g, "").slice(0, 8);
      if (rawValue.length > 4) {
        newValue = `${rawValue.slice(0, 4)}-${rawValue.slice(4)}`;
      } else {
        newValue = rawValue;
      }
    }

    if (name === "dui") {
      const rawValue = value.replace(/\D/g, "").slice(0, 9);
      if (rawValue.length > 8) {
        newValue = `${rawValue.slice(0, 8)}-${rawValue.slice(8)}`;
      } else {
        newValue = rawValue;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nombre ||
      !formData.correo ||
      !formData.telefono ||
      !formData.dui ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.DateContract
    ) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Campos incompletos",
        message: "Por favor llena todos los campos",
      });
      return;
    }

    const phoneRegex = /^[67]\d{3}-\d{4}$/;
    if (!phoneRegex.test(formData.telefono)) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Teléfono inválido",
        message: "Ingresa un celular de El Salvador válido (ej. 7123-4567)",
      });
      return;
    }

    const duiRegex = /^\d{8}-\d{1}$/;
    if (!duiRegex.test(formData.dui)) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "DUI inválido",
        message: "Ingresa un formato de DUI válido (ej. 12345678-9)",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Las contraseñas no coinciden",
      });
      return;
    }

    try {
      await api.post("/Registeremployee", {
        name: formData.nombre,
        email: formData.correo,
        phone: formData.telefono.replace("-", ""),
        dui: formData.dui,
        DateContract: formData.DateContract,
        password: formData.password,
        Status: "Activo",
      });

      setAlert({
        isOpen: true,
        type: "success",
        title: "Registro exitoso",
        message: "Tu cuenta fue creada correctamente",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message ||
          "No se pudo registrar el empleado",
      });
    }
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
            placeholder="0000-0000"
            maxLength={9}
            required
          />

          <CustomInput
            label="DUI"
            type="text"
            name="dui"
            value={formData.dui}
            onChange={handleChange}
            icon={<CreditCard size={16} />}
            placeholder="00000000-0"
            maxLength={10}
            required
          />

          <CustomInput
            label="Fecha de Contratación"
            type="date"
            name="DateContract"
            value={formData.DateContract}
            onChange={handleChange}
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
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <CustomButton text="Registrarse" type="submit" />

          <p className="register-footer">
            ¿Tienes cuenta?{" "}
            <span onClick={() => navigate("/login")}>Inicia sesión</span>
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