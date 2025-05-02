import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import CustomerPanel from "./Component/CustomerPanel";
import CustomerTracker from "./Component/CustomerTracker";
import { useDispatch, useSelector } from "react-redux";
import { setCustomerDetailInprogress } from "../../../redux/CRM/Customer/CustomerActions";

export default function CustomerView() {
  const [toastData, setToastData] = useState({ show: false });
  const location = useLocation();
  const dispatch = useDispatch();
  const customerDetails = useSelector(
    (state) => state?.customer?.customerDetail
  );

  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Customer", link: "/user/crm/customer" },
    { id: 3, label: "Customer View" },
  ];
  /* TOAST */
  const toastOnclose = () => setToastData({ ...toastData, show: false });
  useEffect(() => {
    if (location?.state?.uuid) {
      const payload = {
        uuid: location?.state?.uuid,
      };
      dispatch(setCustomerDetailInprogress(payload));
    }
  }, [location.state]);
  useEffect(() => {
  }, [customerDetails]);

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
          <Breadcrumps items={breadcrumbItems} className="p-0" />
        </div>
        <div className="grid grid-flow-row-dense  grid-cols-3 gap-3 divide-x bg-white darkCardBg">
          <div className="" style={{ minWidth: "330px" }}>
            <CustomerPanel />
          </div>
          <div className="col-start-2 col-end-4" style={{ minWidth: "330px" }}>
            <CustomerTracker />
          </div>
        </div>
      </div>
    </>
  );
}
