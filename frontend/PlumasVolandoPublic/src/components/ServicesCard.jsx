import React from "react";

const ServiceCard = ({ icon, title, text }) => {
  return (
    <article className="about-service-card">
      <div className="about-service-top-line"></div>

      <div className="about-service-content">
        <div className="about-service-text">
          <h3>{title}</h3>
          <p>{text}</p>
        </div>

        <div className="about-service-icon">{icon}</div>
      </div>
    </article>
  );
};

export default ServiceCard;