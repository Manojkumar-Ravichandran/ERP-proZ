import React, { useEffect, useState } from "react";

export default function ProfileCircle({ letter = "A", color  }) {
  const [bgColor,setBgColor] = useState();
  useEffect(()=>{
    if(bgColor){
      setBgColor(color)
    }else{
      setBgColor("#fff3c4")
    }

  },[])
  return (
    <p
      className="pointer-events-none rounded-full uppercase h-14 w-14 flex items-center text-xl justify-center text-black-800 font-semibold me-2 border-primary-400"
      style={{ backgroundColor: bgColor }}
    >
      {letter}
    </p>
  );
}
