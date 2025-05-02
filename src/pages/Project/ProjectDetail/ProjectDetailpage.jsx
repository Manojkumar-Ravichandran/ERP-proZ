// import React, { useEffect, useRef, useState } from "react";
// import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
// import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
// import { useDispatch } from "react-redux";
// import { setLeadDetailInprogress } from "../../../redux/CRM/lead/LeadActions";
// import { useParams, useLocation } from "react-router"; // Import useLocation
// import ProjectDetailLeft from "./Compound/ProjectDetailLeft";
// import ProjectDetailRight from "./Compound/ProjectDetailRight";
// import { ProjectShowListEffect } from "../../../redux/project/ProjectEffects";


// export default function ProjectDetail() {
//   const [toastData, setToastData] = useState({ show: false });
//   const [leadId, setLeadId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [projectList, setProjectList] = useState([]);
//   const [tab, setTab] = useState(1); // Add state to store the tab value
//   const dispatch = useDispatch();
//   const { uuid } = useParams();
//   const location = useLocation();
//   const [breadcrumbItems, setBreadcrumbItems] = useState([]);

//   useEffect(() => {
//     if (location?.state) {
//       

//       // Set the tab value from location.state
//       if (location.state?.tab) {
//         setTab(location.state.tab);
//       }

//       const breadcrumbItem = [
//         { id: 1, label: "Home", link: "/user" },
//         { id: 2, label: "Project", link: "/user/project" },
//         { id: 3, label: location?.state?.project_id ? `${location?.state?.project_id}` : "Loading..." },
//       ];
//       setBreadcrumbItems(breadcrumbItem);
//     }
//   }, [location?.state]);

//   const sectionRef = useRef(null); // Create a ref for the target section

//   const scrollToSection = () => {
//     if (sectionRef.current) {
//       sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   };

//   useEffect(() => {
//     scrollToSection();
//   }, [location.pathname, leadId]);

//   const toastOnclose = () => setToastData({ ...toastData, show: false });

//   const fetchLeadList = async (project_uuid) => {
//     setLoading(true);
//     try {
//       const response = await ProjectShowListEffect({
//         project_uuid: project_uuid,
//       });
//       setProjectList(response.data.data);
//     } catch (error) {
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (location.state) {
//       
//       fetchLeadList(location.state?.project_uuid);
//     }
//   }, [location.state]);

//   return (
//     <>
//       {toastData?.show && (
//         <AlertNotification
//           show={toastData?.show}
//           message={toastData?.message}
//           type={toastData?.type}
//           onClose={toastOnclose}
//         />
//       )}
//       <div className="min-h-screen" ref={sectionRef}>
//         <div className="rounded-lg p-2 my-2 bg-white darkCardBg">
//           <Breadcrumps items={breadcrumbItems} className="p-0" />
//         </div>
//         <div className="grid grid-flow-row-dense grid-cols-3 gap-3 divide-x bg-white darkCardBg">
//           <div className="" style={{ minWidth: "330px" }}>
//             <ProjectDetailLeft />
//           </div>
//           <div className="col-start-2 col-end-4" style={{ minWidth: "330px" }}>
//             <ProjectDetailRight tab={tab} setTab={setTab} /> {/* Pass tab and setTab */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
import React, { useEffect, useRef, useState } from "react";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import { useDispatch } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router"; // Import useNavigate
import ProjectDetailLeft from "./Compound/ProjectDetailLeft";
import ProjectDetailRight from "./Compound/ProjectDetailRight";
import { ProjectShowListEffect } from "../../../redux/project/ProjectEffects";

export default function ProjectDetail() {
  const [toastData, setToastData] = useState({ show: false });
  const [leadId, setLeadId] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [tab, setTab] = useState(1); // Add state to store the tab value
  const dispatch = useDispatch();
  const { uuid } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  const [projectDetails, setProjectDetails] = useState({
    project_uuid: "",
    tab: 1,
    project_id:  "",
    project_no:"",
    lead_id: "",
    cust_id: "",
  });

  useEffect(() => {
    if (location?.state) {
      setProjectDetails((prevDetails) => ({
        ...prevDetails,
        project_uuid: location.state?.project_uuid || "",
        tab: location.state?.tab || 1,
        lead_id: location.state?.lead_id || "",
        cust_id: location.state?.cust_id || "",
        project_id: location.state?.project_id || "",
        project_no: location.state?.pro_id || "",
      }));

      if (location.state?.tab) {
        setTab(location.state.tab);
      }

      const breadcrumbItem = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Project", link: "/user/project" },
        { id: 3, label: location?.state?.project_id ? `${location?.state?.project_id}` : "Loading..." },
      ];
      setBreadcrumbItems(breadcrumbItem);
    }
  }, [location?.state]);

  const sectionRef = useRef(null); // Create a ref for the target section

  const scrollToSection = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    scrollToSection();
  }, [location.pathname, leadId]);

  const toastOnclose = () => setToastData({ ...toastData, show: false });

  const fetchLeadList = async (project_uuid) => {
    setLoading(true);
    try {
      const response = await ProjectShowListEffect({
        project_uuid: project_uuid,
      });
      setProjectList(response.data.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state) {
      
      fetchLeadList(location.state?.project_uuid);
    }
  }, [location.state]);

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
      <div className="min-h-screen" ref={sectionRef}>
        <div className="rounded-lg p-2 my-2 bg-white darkCardBg">
          <Breadcrumps items={breadcrumbItems} className="p-0" />
        </div>
        <div className="grid grid-flow-row-dense grid-cols-3 gap-3 divide-x bg-white darkCardBg">
          <div className="" style={{ minWidth: "300px" }}>
            <ProjectDetailLeft projectList={projectList} />
          </div>
          <div className="col-start-2 col-end-4" style={{ minWidth: "330px" }}>
            <ProjectDetailRight tab={tab} setTab={setTab} projectDetails={projectDetails} /> {/* Pass tab and setTab */}
          </div>
        </div>
      </div>
    </>
  );
}