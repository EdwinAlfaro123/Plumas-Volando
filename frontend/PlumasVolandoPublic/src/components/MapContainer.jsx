import React, { forwardRef, useImperativeHandle } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapBoundsHandler = () => {
  const map = useMapEvents({
    load: () => {
      const bounds = L.latLngBounds(
        [12.98, -90.2],
        [14.45, -87.6]
      );
      map.setMaxBounds(bounds);
      map.fitBounds(bounds);
    },
  });
  return null;
};

const createEggIcon = (color) => {
  return L.divIcon({
    className: "custom-egg-marker",
    html: `<div style="
      width: 32px;
      height: 42px;
      background-color: white;
      border: 4px solid ${color};
      border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: ${color};
      font-size: 14px;
    ">🥚</div>`,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

const MapContainerComponent = forwardRef(({ points, onSelectPoint }, ref) => {
  const [map, setMap] = React.useState(null);

  useImperativeHandle(ref, () => ({
    setView: (coords, zoom) => {
      if (map) {
        map.setView(coords, zoom);
      }
    },
  }));

  return (
    <MapContainer
      center={[13.7942, -88.8965]}
      zoom={8}
      style={{ height: "500px", width: "100%", borderRadius: "12px" }}
      zoomControl={true}
      scrollWheelZoom={true}
      ref={setMap}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <MapBoundsHandler />

      {points.map((point) => (
        <Marker
          key={point.id}
          position={point.coordinates}
          icon={createEggIcon(point.color)}
          eventHandlers={{
            click: () => {
              onSelectPoint(point);
            },
          }}
        >
          <Popup>
            <strong style={{ color: point.color }}>{point.name}</strong>
            <br />
            {point.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
});

export default MapContainerComponent;