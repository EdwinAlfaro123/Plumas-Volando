import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { ShoppingCart, MessageCircle, Mail } from "lucide-react";
import logoPlumas from "../assets/logo-plumas.png";
import { getCart } from "../utils/cartStorage";

const InstagramIcon = ({ size = 16 }) => (
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

const Header = () => {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalItems);
    };

    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cart-updated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

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
        <Link className={isActive("/") ? "active" : ""} to="/">
          Inicio
        </Link>
        <Link className={isActive("/about") ? "active" : ""} to="/about">
          Nosotros
        </Link>
        <Link className={isActive("/products") ? "active" : ""} to="/products">
          Productos
        </Link>
        <Link className={isActive("/recipes") ? "active" : ""} to="/recipes">
          Recetas
        </Link>
        <Link className={isActive("/news") ? "active" : ""} to="/news">
          Noticias
        </Link>
        <Link
          className={isActive("/points-of-sale") ? "active" : ""}
          to="/points-of-sale"
        >
          Puntos de venta
        </Link>
        <Link className={isActive("/contact") ? "active" : ""} to="/contact">
          Contacto
        </Link>
      </nav>

      <div className="topbar-actions">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn"
          aria-label="Instagram"
        >
          <InstagramIcon size={18} />
        </a>

        <a
          href="https://wa.me/50360651765"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn"
          aria-label="WhatsApp"
        >
          <MessageCircle size={18} />
        </a>

        <Link to="/contact" className="icon-btn" aria-label="Contacto">
          <Mail size={18} />
        </Link>

        <Link to="/cart" className="icon-btn cart-link" aria-label="Carrito">
          <ShoppingCart size={18} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </div>
    </header>
  );
};

export default Header;