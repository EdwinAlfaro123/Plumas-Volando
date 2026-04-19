import React from "react";
import { Bell, UserCircle2 } from "lucide-react";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <header className="dashboard-navbar">
      <div className="dashboard-navbar-spacer"></div>

      <div className="dashboard-navbar-right">
        <button type="button" className="dashboard-navbar-icon">
          <Bell size={20} />
        </button>

        <div className="dashboard-navbar-user">
          <span>Bienvenido Usuario</span>
          <UserCircle2 size={22} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;