import React from "react";
import { MapPinned } from "lucide-react";

const FrequentPointItem = ({ point, onSelect }) => {
  return (
    <div className="frequent-point-card">
      <div className="frequent-card-top">
        <div
          className="frequent-color-tab"
          style={{ backgroundColor: point.color }}
        />
      </div>

      <div className="frequent-card-content">
        <div className="frequent-card-body">
          <h3 className="frequent-department-name">{point.name}</h3>

          <div className="frequent-info-row">
            <span className="frequent-label">Dirección:</span>
            <span className="frequent-value">{point.address}</span>
          </div>

          <div className="frequent-info-row">
            <span className="frequent-label">Teléfono:</span>
            <span className="frequent-value">{point.phone}</span>
          </div>

          <div className="frequent-info-row">
            <span className="frequent-label">Horario:</span>
            <span className="frequent-value">{point.hours}</span>
          </div>
        </div>

        <button className="frequent-map-btn" onClick={() => onSelect(point)}>
          <MapPinned size={16} />
          VER EN EL MAPA
        </button>
      </div>
    </div>
  );
};

const FrequentPointsCard = ({ points = [], onSelectPoint }) => {
  if (!points.length) {
    return <p>No hay puntos frecuentes disponibles.</p>;
  }

  return (
    <div className="frequent-points-section">
      <h2 style={{ color: "#0f4f93", marginBottom: "24px", fontSize: "2rem", fontWeight: 800 , display : "flex", justifyContent: "center"}}>
        Puntos más frecuentes
      </h2>
      <div className="frequent-points-grid">
        {points.map((point) => (
          <FrequentPointItem
            key={point.id}
            point={point}
            onSelect={onSelectPoint}
          />
        ))}
      </div>
    </div>
  );
};

export default FrequentPointsCard;