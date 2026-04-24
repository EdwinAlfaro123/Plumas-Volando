import React, { useState } from "react";
import { Mail, Phone, User, MessageSquare, Send } from "lucide-react";
import emailjs from "@emailjs/browser";

// ⚠️ Reemplaza estos valores con los que obtengas de tu cuenta EmailJS
const SERVICE_ID = "service_uwswysh";   // ID del servicio de Gmail
const TEMPLATE_ID = "template_m3ol8yx"; // ID de la plantilla
const PUBLIC_KEY = "_qAHdfmeTx7M1X0Ut"; // Tu clave pública

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nombre es obligatorio";
    if (!formData.email.trim()) newErrors.email = "Correo es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Correo inválido";
    if (!formData.message.trim()) newErrors.message = "Mensaje es obligatorio";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSending(true);

    // Llamada real a EmailJS
    emailjs
      .send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          message: formData.message,
        },
        PUBLIC_KEY
      )
      .then((response) => {
        console.log("Correo enviado con éxito. Status:", response.status);
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
      })
      .catch((error) => {
        console.error("Error al enviar:", error);
        alert("Hubo un error al enviar el mensaje. Revisa la consola.");
      })
      .finally(() => {
        setSending(false);
      });
  };

  return (
    <div className="contact-form-wrapper">
      <h3>Envíanos un mensaje</h3>
      {submitted && (
        <div className="form-success-message">
          ¡Mensaje enviado con éxito! Te contactaremos pronto.
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>
            <User size={16} /> Nombre
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre completo"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>
            <Mail size={16} /> Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>
            <Phone size={16} /> Teléfono (opcional)
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+503 0000 0000"
          />
        </div>

        <div className="form-group">
          <label>
            <MessageSquare size={16} /> Mensaje
          </label>
          <textarea
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            placeholder="Cuéntanos en qué podemos ayudarte..."
          />
          {errors.message && (
            <span className="error-text">{errors.message}</span>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={sending}>
          <Send size={16} /> {sending ? "Enviando..." : "Enviar mensaje"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;