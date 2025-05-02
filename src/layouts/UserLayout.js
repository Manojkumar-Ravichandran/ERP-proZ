import React, { useEffect } from "react";
import SideBar from "../components/SideBar/SideBar";
import TopBar from "../components/TopBar/TopBar";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import { getUserLocalStorage } from "../utils/utils";

export default function UserLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = getUserLocalStorage();
    if (!token) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <div className=""></div>

      <div className="flex h-screen">
        <SideBar /> {/* Sidebar with fixed width */}
        {/* <div> */}
        <div className="flex-1 flex flex-col mx-auto">
          <TopBar /> {/* Make TopBar sticky */}
          <main className="flex-1 px-4 pt-1 overflow-auto">
            <Outlet /> {/* Render child routes here */}
          </main>
          <Footer className="mt-auto" /> {/* Sticky footer at the bottom */}
        </div>
        {/* </div> */}
      </div>
    </>
  );
}
