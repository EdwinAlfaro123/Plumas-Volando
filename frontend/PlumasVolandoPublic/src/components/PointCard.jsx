import React from "react";
import { MapPin, Phone, Clock, MapPinned } from "lucide-react";

const PointCard = ({ point, onViewOnMap }) => {
  if (!point) return null;

  const cardStyle = {
    borderLeft: `8px solid ${point.color}`,
    backgroundColor: `${point.color}10`,
  };

  return (
    <div className="selected-point-card" style={cardStyle}>
      <h2 style={{ color: "#0f4f93" }}>{point.name}</h2>

      <div className="point-detail-item">
        <MapPin size={18} className="detail-icon" />
        <span className="detail-label">Dirección:</span>
        <span className="detail-value">{point.address}</span>
      </div>

      <div className="point-detail-item">
        <Phone size={18} className="detail-icon" />
        <span className="detail-label">Teléfono:</span>
        <span className="detail-value">{point.phone}</span>
      </div>

      <div className="point-detail-item">
        <Clock size={18} className="detail-icon" />
        <span className="detail-label">Horario:</span>
        <span className="detail-value">{point.hours}</span>
      </div>

      <button className="view-on-map-btn" onClick={onViewOnMap}>
        <MapPinned size={16} />
        VER EN EL MAPA
      </button>
    </div>
  );
};

export default PointCard;