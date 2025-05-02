import React from 'react'

export default function DataShow(
    {label, icon, value,size=20}
) {
  return (
    <div className="flex items-center gap-4  text-center">
      <span className="top-clr">{icon}</span>
      <div className="flex flex-col text-normal justify-start items-start">
        <div className="  ">{label}</div>
        <div className="text-lg  text-regular  font-bold">{value}</div>
      </div>
    </div>
  );
}
