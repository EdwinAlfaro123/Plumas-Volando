import React from "react";

const FeatureCard = ({ icon, title, text }) => {
  return (
    <article className="about-feature-card">
      <div className="about-feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
};

export default FeatureCard;