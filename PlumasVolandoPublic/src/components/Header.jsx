import React from "react";
import { Menu, Search, ShoppingCart, Mail } from "lucide-react";
import logoPlumas from "../assets/logo-plumas.png";

const Header = () => {
  return (
    <header className="topbar">
      <div className="brand">
        <img
          src={logoPlumas}
          alt="Logo Plumas Volando"
          className="brand-logo-img"
        />

        <div className="brand-text">
          <span className="brand-small">Plumas</span>
          <strong>Volando</strong>
        </div>
      </div>

      <nav className="nav-links">
        <a href="#inicio">Inicio</a>
        <a href="#nosotros">Nosotros</a>
        <a href="#productos">Productos</a>
        <a href="#recetas">Recetas</a>
        <a href="#contacto">Contacto</a>
      </nav>

      <div className="topbar-actions">
        <button className="icon-btn" aria-label="Menú">
          <Menu size={16} />
        </button>

        <button className="icon-btn" aria-label="Buscar">
          <Search size={16} />
        </button>
        
        <button className="icon-btn" aria-label="Correo">
          <Mail size={16} />
        </button>

        <button className="icon-btn" aria-label="Carrito">
          <ShoppingCart size={16} />
        </button>
      </div>
    </header>
  );
};

export default Header;