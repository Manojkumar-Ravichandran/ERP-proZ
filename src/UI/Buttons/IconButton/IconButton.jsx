import React from 'react';
import './IconButton.css';

export default function IconButton({
    type = "button",
    label,
    icon, // This accepts an icon component
    className = "",
    iconPosition = "left", // Optional: allows placing the icon left or right
    onClick ,
    loading=false,
    disabled=false
}) {
    return (
        <button type={type} className={`button button__btn flex text-white gap-2 ${className}`} onClick={onClick} disabled={loading ||disabled}>

{loading ? (
        <>
          <span className={` spinner`}></span> Loading...
        </>
      ) : (<>
            {iconPosition === "left"  && icon}
            {label}
            {iconPosition === "right"  &&icon}
      </>)}
        </button>
    );
}
