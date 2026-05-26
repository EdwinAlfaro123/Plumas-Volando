  import React from "react";

const CustomButton = ({ text, type = "button", onClick, className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`custom-btn ${className}`}
    >
      {text}
    </button>
  );
};

export default CustomButton;