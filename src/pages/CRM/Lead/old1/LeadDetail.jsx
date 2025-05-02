import React, { useEffect, useState } from "react";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import LeadDetailPanel from "./Component/LeadDetailPanel";
import { useDispatch } from "react-redux";
import { setLeadDetailInprogress } from "../../../redux/CRM/lead/LeadActions";
import { useParams } from "react-router";
import LeadTracker from "./Component/LeadTracker";

export default function LeadDetail() {
  const [toastData, setToastData] = useState({ show: false });
  const dispatch = useDispatch();
  const { uuid } = useParams();

  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Lead", link: "/user/crm/lead" },
    { id: 3, label: "Lead Detail" },
  ];
  const toastOnclose = () => setToastData({ ...toastData, show: false });
  useEffect(() => {
    const payload = {
      uuid,
      stages: "",
    };
    dispatch(setLeadDetailInprogress({ ...payload }));
  }, []);

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
      <div className="min-h-screen p-1">
        <Breadcrumps items={breadcrumbItems} className="p-0" />
        {/* <div className="border rounded-lg p-6 bg-white darkCardBg"> */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-3 mb-6">
          <LeadDetailPanel />
          <LeadTracker />
        </div>
        {/* </div> */}
      </div>
    </>
  );
}
