import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function IconOnlyBtn({
  type,
  icon,
  iconSize = 20,
  onClick,
  tooltipId,
  tooltip,
  tooltipPlace = "bottom",
  className,
  disabled = false // Add the disabled prop with a default value of false
}) {
  return (
    <>
      <button
        type={type}
        data-tooltip-id={tooltipId}
        className={`${className} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`} // Apply disabled styles
        onClick={!disabled ? onClick : undefined} // Prevent click if disabled
        disabled={disabled} // HTML disabled attribute
      >
        {React.cloneElement(icon, { size: iconSize })}
      </button>

      {tooltip && <ReactTooltip id={tooltipId} place={tooltipPlace} content={tooltip} />}
    </>
  );
}
