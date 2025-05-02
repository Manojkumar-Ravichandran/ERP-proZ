import React, { useEffect, useRef, useState } from "react";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import LeadDetailPanel from "./Component/LeadDetailPanel";
import { useDispatch } from "react-redux";
import { setLeadDetailInprogress } from "../../../redux/CRM/lead/LeadActions";
import { useParams, useLocation } from "react-router"; // Import useLocation
import LeadTracker from "./Component/LeadTracker";
import LeadActivityModal from "./LeadActivityModal";

export default function LeadDetail() {
  const [toastData, setToastData] = useState({ show: false });
  const [leadId, setLeadId] = useState(""); // State for lead ID
  const dispatch = useDispatch();
  const { uuid } = useParams();
  const location = useLocation();
  const [breadcrumbItems,setBreadcrumbItems] = useState([]);

  useEffect(()=>{
    if(location?.state?.is_customer){
      const breadcrumbItem = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Customer", link: "/user/crm/customer" },
        { id: 3, label: "Customer View", link: `/user/crm/customer/customer-view/${location?.state?.leadDatas?.uuid}` },
        { id: 4, label: location?.state?.leadId ? `${location?.state?.leadId}` : "Loading..." },
      ];
      setBreadcrumbItems(breadcrumbItem)


    }else{
      const breadcrumbItem = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Lead", link: "/user/crm/lead" },
        { id: 3, label: location?.state?.leadId ? `${location?.state?.leadId}` : "Loading..." },
      ];
      setBreadcrumbItems(breadcrumbItem)
    }
  },[location?.state])

  
  const sectionRef = useRef(null); // Create a ref for the target section

  const scrollToSection = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
   
    useEffect(() => {
      scrollToSection()
    }, [location.pathname,leadId]);
 
  const toastOnclose = () => setToastData({ ...toastData, show: false });

  useEffect(() => {
    if (location.state?.leadId) {
      setLeadId(location.state.leadId);
    } else {
    }
    const payload = {
      uuid,
      stages: "",
    };
    dispatch(setLeadDetailInprogress({ ...payload }));
  }, [uuid, location.state, dispatch]);

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
      <div className="min-h-screen"   ref={sectionRef}
      >
        <div className="rounded-lg p-2 my-2 bg-white darkCardBg">
          <Breadcrumps items={breadcrumbItems} className="p-0" />
        </div>
        {/* <LeadActivityModal/> */}
        <div className="grid grid-flow-row-dense  grid-cols-3 gap-3 divide-x bg-white darkCardBg">
          <div className="" style={{minWidth:"330px"}}>
            <LeadDetailPanel />

          </div>
          <div className="col-start-2 col-end-4" style={{minWidth:"330px"}}>

          <LeadTracker />
          </div>
        </div>
      </div>
    </>
  );
}
