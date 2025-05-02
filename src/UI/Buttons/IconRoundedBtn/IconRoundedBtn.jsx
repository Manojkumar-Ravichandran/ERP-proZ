import React from "react";
import icons from "../../../contents/Icons";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function IconRoundedBtn({
  icon,
  namefeild,
  className,
  onClick,
  tooltip,
  tooltipId,
  tooltipPlace = "bottom",
}) {
  return (
    <>
      <button
        className={`grid w-20 text-sm py-4 justify-items-center rounded-md text-center ${className}`}
        data-tooltip-id={tooltipId}
        onClick={onClick}
      >
        {React.cloneElement(icon, { size: 20 })}
        {namefeild}
      </button>
      {tooltip && (
        <ReactTooltip id={tooltipId} place={tooltipPlace} content={tooltip} />
      )}
    </>
  );
}
