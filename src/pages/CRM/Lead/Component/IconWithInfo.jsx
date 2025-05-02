import React from "react";

export default function IconWithInfo({
    icon,
    label,
    info,
    iconClassName,
    className,
    contentConClass,
    iconBgClass
    
}) {
  return (
    <div className={`flex items-center gap-2 p-3  ${className}`}>
      <span className={` p-2  block w-10 h-10 rounded-full text-center flex items-center  ${iconClassName} ${iconBgClass??'bg-white-50'} `} >
        <span className="mx-auto">
          {icon}
        </span>
      </span>
      <div className={`flex flex-row gap-2 ${contentConClass}`}>
        <span className="text-gray-700">{label}</span>
        <span className="text-black-800 font-semibold">
            {info}
          {/* {leadDetail?.product_name || "sfds"} */}
        </span>
      </div>
    </div>
  );
}
