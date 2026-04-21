import React from "react";
import { Link, useLocation } from "react-router";
import { Menu, Search, ShoppingCart, Mail } from "lucide-react";
import logoPlumas from "../assets/logo-plumas.png";

const Header = () => {
  const location = useLocation();

  const showCart =
    location.pathname === "/products" || location.pathname === "/cart";

  return (
    <header className="topbar">
      <div className="brand">
        <Link to="/">
          <img
            src={logoPlumas}
            alt="Logo Plumas Volando"
            className="brand-logo-img"
          />
        </Link>

        <div className="brand-text">
          <span className="brand-small">Plumas</span>
          <strong>Volando</strong>
        </div>
      </div>

      <nav className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/about">Nosotros</Link>
        <Link to="/products">Productos</Link>
        <Link to="/recipes">Recetas</Link>
        <Link to="/contact">Contacto</Link>
      </nav>

      <div className="topbar-actions">
        <button className="icon-btn" type="button" aria-label="Menú">
          <Menu size={16} />
        </button>

        <button className="icon-btn" type="button" aria-label="Buscar">
          <Search size={16} />
        </button>

        <button className="icon-btn" type="button" aria-label="Correo">
          <Mail size={16} />
        </button>

        {showCart && (
          <Link to="/cart" className="icon-btn cart-link" aria-label="Carrito">
            <ShoppingCart size={16} />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;