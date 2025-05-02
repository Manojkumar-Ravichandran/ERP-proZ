import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const NonEditableMap = ({ latitude, longitude, zoom = 13, editable = false }) => {
  return (
    <MapContainer
      center={[latitude || 0, longitude || 0]}
      zoom={zoom}
      style={{ height: "300px", width: "100%" }}
      dragging={false}
      touchZoom={false}
      doubleClickZoom={false}
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution=""
      />
      {latitude && longitude && (
        <Marker position={[latitude, longitude]}>
          <Popup>Selected Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default NonEditableMap;
