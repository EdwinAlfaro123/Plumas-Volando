import React from "react";
import Plumas from "../img/Plumas.png";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="register-wrapper">
      <div className="register-card">
        <div className="register-left">
          <div className="register-header">
            <h1>{title}</h1>
            <h2>{subtitle}</h2>
          </div>

          {children}
        </div>

        <div className="register-right">
          <div className="register-right-inner">
            <img src={Plumas} alt="Imagen decorativa" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;