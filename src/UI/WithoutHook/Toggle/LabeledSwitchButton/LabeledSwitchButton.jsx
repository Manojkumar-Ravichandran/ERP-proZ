import React from "react";
import './LabeledSwitchButton.css'
const LabeledSwitchButton = ({
  isOpen,
  onToggle,
  openLabel = "Open",
  closedLabel = "Closed",
  className = "",
}) => {
  return (
    <div className={`toggle-container ${className}`}>
      <div
        onClick={onToggle}
        className={`toggle-switch ${isOpen ? "bg-blue-500" : "bg-gray-400"
        }`}
      >
        <span
           className={`toggle-label ${isOpen ? "opacity-100" : "opacity-0"
           }`}
        >
          {openLabel}
        </span>
        <span
            className={`toggle-label ${isOpen ? "opacity-0" : "opacity-100"
            }`}
        >
          {closedLabel}
        </span>
        <div
           className={`toggle-button ${isOpen ? "translate-x-8" : "translate-x-0"
           }`}
        />
      </div>
    </div>
  );
};

export default LabeledSwitchButton;
