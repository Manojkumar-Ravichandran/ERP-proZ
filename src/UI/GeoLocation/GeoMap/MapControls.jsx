import React, { useEffect } from 'react';
import { FaLocationCrosshairs } from "react-icons/fa6";
import { RiFullscreenLine } from "react-icons/ri";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';

// Button for getting the current location
export function CurrentLocationButton({ getCurrentLocation }) {
    return (
        <div className="leaflet-control-container">
            <button 
                onClick={getCurrentLocation} 
                type="button" 
                aria-label="Locate current position"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '5px', border: '1px solid #aaa' }}>
                <FaLocationCrosshairs style={{ fontSize: '25px' }} />
            </button>
        </div>
    );
}

// Button for expanding or collapsing the map
export function ExpandMapButton({ setExpand }) {
    const handleClick = () => setExpand((prevState) => !prevState);

    return (
        <div className="leaflet-control-container">
            <button 
                onClick={handleClick} 
                type="button" 
                aria-label="Expand or collapse map"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '5px', border: '1px solid #aaa' }}>
                <RiFullscreenLine style={{ fontSize: '25px' }} />
            </button>
        </div>
    );
}

// Component for placing a marker on the map
export function LocationMarker({ position, setPosition, customIcon, handleClick }) {
    const map = useMap(); // Get map instance

    useMapEvents({
        click: (e) => {
            if (handleClick) {
                handleClick(e);
            }
        },
    });

    // Ensure position is valid before flying to it
    useEffect(() => {
        if (position && position.lat != null && position.lng != null) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position && position.lat != null && position.lng != null ? (
        <Marker position={position} icon={customIcon}>
            <Popup>You selected this location</Popup>
        </Marker>
    ) : null;
}
