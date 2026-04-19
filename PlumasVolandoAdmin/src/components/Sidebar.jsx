import React from "react";
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
  const menuItems = [
    { label: "Inicio", icon: <Home size={18} />, active: true },
    { label: "Empleados", icon: <User size={18} /> },
    { label: "Clientes", icon: <Users size={18} /> },
    { label: "Gallinas", icon: <Egg size={18} /> },
    { label: "Productos", icon: <Package size={18} /> },
    { label: "Pedidos", icon: <Truck size={18} /> },
    { label: "Facturas", icon: <ReceiptText size={18} /> },
    { label: "Historial", icon: <History size={18} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo-card">
        <img src={Logo} alt="Plumas Volando" className="sidebar-logo" />
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <button
            key={index}
            type="button"
            className={`sidebar-item ${item.active ? "active" : ""}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;