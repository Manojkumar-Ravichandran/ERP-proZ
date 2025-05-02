import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getUserLocalStorage } from "../utils/utils";
import './Layout.css'
export default function RootLayout() {
  const navigate =useNavigate();

  useEffect(()=>{
    (async()=>{
      const token =getUserLocalStorage();
      if(!token){
        navigate('/')
      }
    })();
  },[]);
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-auto no-scrollbar bg-main darkCardLightBg">
        <Outlet /> {/* Render child routes here */}
      </main>
    </div>
  );
}
