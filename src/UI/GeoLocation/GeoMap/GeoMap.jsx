import React, { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import icons from "../../../contents/Icons";
import {
  CurrentLocationButton,
  ExpandMapButton,
  LocationMarker,
} from "./MapControls";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../../../redux/common/CommonAction";
import { getCurrentLocation } from "../../../utils/location";
// import './GeoTag.css';

function getTileLayerUrl(selectedLayer) {
  switch (selectedLayer) {
    case "OpenStreetMap":
      return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    case "StadiaMaps":
      return "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";
    case "Mapbox-Satellite":
      return "https://api.maptiler.com/maps/satellite/256/{z}/{x}/{y}.jpg?key=V4GE6sN9rb79IWzM6tR3";
    default:
      return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  }
}

export default function GeoMap() {
  const [position, setPosition] = useState(null);
  const [userLocationError, setUserLocationError] = useState(null);
  const [expand, setExpand] = useState(false);
  const dispatch = useDispatch();
  const currentLocation = useSelector((state) => state.common.location);

  useEffect(() => {
    setPosition(currentLocation.location);
  }, [currentLocation]);

  // const getCurrentLocation = () => {
  //     if ("geolocation" in navigator) {
  //         navigator.geolocation.getCurrentPosition(
  //             (position) => {
  //                 setUserLocationError(null);
  //                 setPosition([position.coords.latitude, position.coords.longitude]);
  //             },
  //             (error) => {
  //                 setUserLocationError(error.message);
  //                 console.error("Error getting user location:", error);
  //             }
  //         );
  //     } else {
  //         setUserLocationError("Geolocation is not supported by this browser.");
  //         console.error("Geolocation is not supported by this browser.");
  //     }
  // };
  const handleClick = useCallback((e) => {
    setPosition(e.latlng);
    dispatch(
      setLocation({ location: [e.latlng.lat, e.latlng.lng], error: false })
    );
  }, []);

  const customIcon = new Icon({
    iconUrl:
      "https://static.vecteezy.com/system/resources/previews/022/187/041/non_2x/map-location-pin-icon-free-png.png",
    iconSize: [25, 35],
  });

  const mapLayers = (
    <LayersControl>
      <LayersControl.BaseLayer name="Street Map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={getTileLayerUrl("OpenStreetMap")}
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer checked name="Google Map">
        <TileLayer
          attribution="Google Maps"
          url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Satellite">
        <LayerGroup>
          <TileLayer
            attribution="Google Maps Satellite"
            url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
          />
          <TileLayer url="https://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}" />
        </LayerGroup>
      </LayersControl.BaseLayer>
    </LayersControl>
  );

  return (
    <div style={{zIndex:-1}}>
      {userLocationError && <div role="alert">{userLocationError}</div>}
      <MapContainer
        center={[0, 0]}
        zoom={20}
        style={{
          height: expand ? "90vh" : "400px",
          position: "relative",
          width: expand ? "90vw" : "auto",
        }}
      >
        {mapLayers}
        <LocationMarker
          position={position}
          setPosition={setPosition}
          customIcon={customIcon}
          handleClick={handleClick}
        />
        <CurrentLocationButton getCurrentLocation={getCurrentLocation} />
        <ExpandMapButton setExpand={setExpand} />
      </MapContainer>
    </div>
  );
}
