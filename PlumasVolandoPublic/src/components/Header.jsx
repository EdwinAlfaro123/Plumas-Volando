import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, Search, ShoppingCart, Mail } from "lucide-react";
import logoPlumas from "../assets/logo-plumas.png";
import { getCart } from "../utils/cartStorage";

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
        <button className="icon-btn" type="button" aria-label="Menú">
          <Menu size={16} />
        </button>

        <button className="icon-btn" type="button" aria-label="Buscar">
          <Search size={16} />
        </button>

        <button className="icon-btn" type="button" aria-label="Correo">
          <Mail size={16} />
        </button>

        <Link to="/cart" className="icon-btn cart-link" aria-label="Carrito">
          <ShoppingCart size={16} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </div>
    </header>
  );
};

export default Header;