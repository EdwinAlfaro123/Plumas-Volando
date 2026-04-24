import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import FAQSection from "../components/FAQSection";
import { Mail, Phone, MapPin } from "lucide-react";
import "../styles/Contacto.css";

const ContactoPage = () => {
  return (
    <div className="contacto-page">
      <div className="contacto-page-frame">
        <Header />

        <main className="contacto-main">
          <h1>Contacto</h1>
          <p className="contacto-subtitle">
            Envíanos un correo electrónico o WhatsApp y cuéntanos en qué podemos ayudarte.
          </p>

          <div className="contacto-split">
            {/* Información de contacto directa */}
            <div className="contacto-info">
              <div className="info-card">
                <div className="info-item">
                  <Mail size={24} className="info-icon" />
                  <div>
                    <h4>Correo electrónico</h4>
                    <a href="mailto:plumasvolando249@gmail.com">
                      plumasvolando249@gmail.com
                    </a>
                  </div>
                </div>
                <div className="info-item">
                  <Phone size={24} className="info-icon" />
                  <div>
                    <h4>Teléfono / WhatsApp</h4>
                    <a href="tel:+6065 1765">6065 1765</a>
                  </div>
                </div>
                <div className="info-item">
                  <MapPin size={24} className="info-icon" />
                  <div>
                    <h4>Oficina central</h4>
                    <p>San Salvador, El Salvador</p>
                  </div>
                </div>
              </div>
              <button className="whatsapp-btn">
                <a
                  href="https://wa.me/50360651765?text=Hola%2C%20estoy%20interesado%20en%20sus%20productos%20av%C3%ADcolas."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-btn"
                >
                  <Phone size={18} />
                  Contáctanos por WhatsApp
                </a>
              </button>
            </div>

            {/* Formulario */}
            <ContactForm />
          </div>

          {/* Preguntas Frecuentes */}
          <FAQSection />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ContactoPage;