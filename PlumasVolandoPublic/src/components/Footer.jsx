import React from "react";
import { Phone, Mail } from "lucide-react";
import { Link } from "react-router";
import logoPlumas from "../assets/logo-plumas.png";

// Icono SVG para Instagram
const InstagramIcon = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="footer" id="contacto">
      <div className="footer-col footer-brand-col">
        <img
          src={logoPlumas}
          alt="Logo Plumas Volando"
          className="footer-logo-img"
        />
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
          <a
            href="https://www.instagram.com/plumasvolando"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <InstagramIcon size={15} />
            @plumasvolando.sv
          </a>
        </p>
        <p>
          <a
            href="https://wa.me/50360651765"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Phone size={15} />
            503-6065-1765
          </a>
        </p>
        <p>
          {/* Correo → redirige a la página de contacto */}
          <Link
            to="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Mail size={15} />
            plumasvolando249@gmail.com
          </Link>
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