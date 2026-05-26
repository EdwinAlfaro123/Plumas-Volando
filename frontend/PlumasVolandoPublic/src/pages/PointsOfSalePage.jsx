import React, { useState, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MapContainerComponent from "../components/MapContainer";
import FrequentPointsCard from "../components/FrequentPoint";
import PointCard from "../components/PointCard";
import { pointsData, frequentPoints } from "../data/pointsData";
import "../styles/PointsOfSale.css";

const PointsOfSalePage = () => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const mapRef = useRef(null);

  const handleSelectPoint = (point) => {
    setSelectedPoint(point);
    if (mapRef.current) {
      mapRef.current.setView(point.coordinates, 11);
    }
    document.querySelector(".map-wrapper")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="points-of-sale-page">
      <div className="points-page-frame">
        <Header />

        <main className="points-main">
          <h1>Puntos de Venta</h1>
          <p className="points-subtitle">
            Encuentra nuestras diferentes puntos de venta en todo El Salvador. Haz click en un departamento para ver las diferentes puntos.
          </p>

          <div className="map-wrapper">
            <MapContainerComponent
              ref={mapRef}
              points={pointsData}
              onSelectPoint={handleSelectPoint}
            />
          </div>

          {selectedPoint && (
            <div className="selected-point-wrapper">
              <PointCard
                point={selectedPoint}
                onViewOnMap={() => handleSelectPoint(selectedPoint)}
              />
            </div>
          )}

          <section className="frequent-section">
            <FrequentPointsCard
              points={frequentPoints}
              onSelectPoint={handleSelectPoint}
            />
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default PointsOfSalePage;