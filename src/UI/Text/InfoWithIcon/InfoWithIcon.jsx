import React from "react";

export default function InfoWithIcon({
  icon,
  label,
  text,
  oneLine = true,
  className,
  colon = true,
}) {
  return (
    <>
      <div
        className={`flex mb-2 text-sm  ${
          oneLine ? "flex-row items-center" : "flex-col items-start"
        } ${className}`}
      >
        <div className="flex items-center gap-1 font-semibold text-gray-600">
          {icon}
          <span>{label}</span>
        </div>
        <div className="text-black-800">
          {oneLine && colon && " : "}
          {text}
        </div>
      </div>
    </>
  );
}
