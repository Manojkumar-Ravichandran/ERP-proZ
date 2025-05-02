import React from "react";

const LocationComponent = ({ address, icons }) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;

  return (
    <span className="flex items-center gap-1 text-sm ps-2">
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-sm ps-2 hover:underline"
        title={`View location: ${address}`}
      >
        <span className="rounded-full top-clr border p-1 font-normal">
          {React.cloneElement(icons["locationIcon"], { size: 15 })}
        </span>
        Location
      </a>
    </span>
  );
};

export default LocationComponent;
