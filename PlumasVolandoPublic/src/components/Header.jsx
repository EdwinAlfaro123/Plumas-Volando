import React from "react";
import { Link } from "react-router";
import { Menu, Search, ShoppingCart, Mail } from "lucide-react";
import logoPlumas from "../assets/logo-plumas.png";

const Header = () => {
  return (
    <header className="topbar">
      {/* LOGO */}
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

      {/* NAV */}
      <nav className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/about">Nosotros</Link>
        <Link to="/products">Productos</Link>
        <Link to="/recipes">Recetas</Link>
        <Link to="/contact">Contacto</Link>
      </nav>

      {/* ICONOS */}
      <div className="topbar-actions">
        <button className="icon-btn">
          <Menu size={16} />
        </button>

        <button className="icon-btn">
          <Search size={16} />
        </button>

        <button className="icon-btn">
          <Mail size={16} />
        </button>

        <button className="icon-btn">
          <ShoppingCart size={16} />
        </button>
      </div>
    </header>
  );
};

export default Header;