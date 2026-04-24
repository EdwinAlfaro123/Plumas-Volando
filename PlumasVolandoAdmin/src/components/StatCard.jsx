import React from "react";
import "../styles/StatCard.css";
import NeumorphisCard from "./NeumorphisCard";

const StatCard = ({
  title,
  value,
  percentage,
  subtitle,
  icon,
  trend = "up",
}) => {
  return (
    <NeumorphisCard className="stat-card" padding="md">
      <div className="stat-card-top">
        <div className="stat-card-title">{title}</div>
        <div className="stat-card-icon">{icon}</div>
      </div>

      <div className="stat-card-middle">
        <h3 className="stat-card-value">{value}</h3>
        <div
          className={`stat-card-percentage ${
            trend === "down" ? "down" : "up"
          }`}
        >
          {percentage}
        </div>
      </div>

      <p className="stat-card-subtitle">{subtitle}</p>
    </NeumorphisCard>
  );
};

export default StatCard;