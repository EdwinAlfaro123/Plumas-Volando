import React from "react";
import "../styles/CustomAlert.css";

const CustomAlert = ({ isOpen, type = "success", title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="alert-overlay">
      <div className={`alert-box ${type}`}>
        <div className="alert-icon">
          {type === "success" ? "✓" : type === "error" ? "✕" : "!"}
        </div>

        <h3>{title}</h3>
        <p>{message}</p>

        <button className="custom-btn" onClick={onClose}>
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;