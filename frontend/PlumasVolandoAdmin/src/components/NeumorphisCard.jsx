import React from "react";
import "../styles/NeumorphicCard.css";

const NeumorphicCard = ({ children, className = "", padding = "md" }) => {
  return (
    <div className={`neumorphic-card neumorphic-card-${padding} ${className}`}>
      {children}
    </div>
  );
};

export default NeumorphicCard;