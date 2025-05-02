import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import icons from "../../../contents/Icons";

export default function CircleIconBtn({
  icon,
  type="button",
  tooltipPlace = "bottom",
  tooltip,
  tooltipId,
  className,
  content,
  disabled =false,
  onClick
}) {
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-1">
        <button
          className={`text-center w-16 h-16 border flex items-center rounded-full ${className}`}
          type={type}
          disabled={disabled}
          onClick={onClick}
        >
          <span className="mx-auto">{icon}</span>
        </button>
        {content&&<span className="text-black-800">{content}</span>}
      </div>
      {tooltip && (
        <ReactTooltip id={tooltipId} place={tooltipPlace} content={tooltip} />
      )}
    </>
  );
}
