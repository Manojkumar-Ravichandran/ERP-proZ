import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import { useForm } from "react-hook-form";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import "./Master.css";
import MasterSidePanel from "./MasterSidePanel";
import MasterTracker from "./MasterTracker";
const MasterDetail = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm();
  const { createMaster } = useSelector((state) => state.master || {});
  const [toastData, setToastData] = useState({ show: false });
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Inventory List", link: "/user/inventory/master" },
    { id: 3, label: "Inventory Detail" },
  ];
  const toastOnclose = () => {
    setToastData({ ...toastData, show: false });
  };

  return (
    <>
      {toastData?.show && (
        <AlertNotification
          show={toastData?.show}
          message={toastData?.message}
          type={toastData?.type}
          onClose={toastOnclose}
        />
      )}
      <div className="min-h-screen">
        <div className="rounded-lg p-2 my-2 bg-white darkCardBg">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-[1fr,2fr] gap-3 divide-x bg-white darkCardBg">
          <MasterSidePanel />
          <MasterTracker />
        </div>
      </div>
    </>
  );
};
export default MasterDetail;
