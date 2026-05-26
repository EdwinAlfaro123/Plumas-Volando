import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Users,
  Egg,
  Package,
  Truck,
  ReceiptText,
  History,
} from "lucide-react";
import "../styles/Sidebar.css";
import Logo from "../img/PlumasVolandoLogo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Inicio", icon: <Home size={18} />, path: "/dashboard" },
    { label: "Empleados", icon: <User size={18} />, path: "/employees" },
    { label: "Clientes", icon: <Users size={18} />, path: "/customers" },
    { label: "Gallinas", icon: <Egg size={18} />, path: "/chickens" },
    { label: "Productos", icon: <Package size={18} />, path: "/products" },
    { label: "Pedidos", icon: <Truck size={18} />, path: "/orders" },
    { label: "Facturas", icon: <ReceiptText size={18} />, path: "/bills" },
    { label: "Historial", icon: <History size={18} />, path: "/records" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo-card">
        <img src={Logo} alt="Plumas Volando" className="sidebar-logo" />
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={index}
              type="button"
              className={`sidebar-item ${isActive ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-text">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;