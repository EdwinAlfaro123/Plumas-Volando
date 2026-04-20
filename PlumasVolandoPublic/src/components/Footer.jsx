import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import logoPlumas from "../assets/logo-plumas.png";

const Footer = () => {
  return (
    <footer className="footer" id="contacto">
      <div className="footer-col footer-brand-col">
        <img
          src={logoPlumas}
          alt="Logo Plumas Volando"
          className="footer-logo-img"
        />
        <p>Planta central</p>
      </div>

      <div className="footer-col">
        <h3>Lo mejor para nuestros clientes</h3>
        <p>
          Tus productos favoritos en productos frescos avícolas con la mejor
          calidad.
        </p>
        <p>Comprometidos con excelencia desde 2023.</p>
      </div>

      <div className="footer-col">
        <h3>Contactos</h3>
        <p>
          <MapPin size={15} /> plumasvolando.sv
        </p>
        <p>
          <Phone size={15} /> 503-0000-0000
        </p>
        <p>
          <Mail size={15} /> plumasvolando@gmail.com
        </p>
      </div>

      <div className="footer-bottom">
        <span>Plumas volando</span>
        <span>© 2025 Plumas Volando. All rights reserved. Privacy Policy</span>
      </div>
    </footer>
  );
};

export default Footer;