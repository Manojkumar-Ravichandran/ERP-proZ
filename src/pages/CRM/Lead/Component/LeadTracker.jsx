import React, { useEffect, useState } from "react";

import Stepper from "../../../../UI/Stepper/Stepper";
import { arrOptForDropdown, findFirstLetter } from "../../../../utils/Data";
import { useDispatch, useSelector } from "react-redux";
import {
  getLeadSourceListInprogress,
  getLeadStageListError,
  getLeadStageListInprogress,
} from "../../../../redux/CRM/lead/LeadActions";
import { H5 } from "../../../../UI/Heading/Heading";
import MessageCard from "../../../../UI/MessageCard/MessageCard";
import icons from "../../../../contents/Icons";
import ActivityCard from "../../../../UI/Card/ActivityCard/ActivityCard";
import LeadModal from "../LeadModal";
import UpcommingActivity from "./UpcommingActivity";
import ActivityHistory from "./ActivityHistory";
import LeadNotes from "./LeadNotes";
import LeadMail from "./LeadMail";
import LeadCall from "./LeadCall";
import Breadcrumps from "../../../../UI/Breadcrumps/Breadcrumps";
import StatusContainer from "../../../../UI/StatusContainer/StatusContainer";
import LeadMeeting from "./LeadMeeting";
import AddActivity from "./AddActivity";
import Complaint from "../../Complaint/Complaint";
export default function LeadTracker() {
  const [stageList, setStageList] = useState([]);
  const [leadDetail,setLeadDetail] = useState()
  const leadDetails = useSelector((state) => state?.lead?.leadDetail?.data);
  const showReopenButton = leadDetail?.is_closed_type === "lost";
  const showScheduleButton = leadDetail?.is_closed_type === 0;

  useEffect(()=>{
    setLeadDetail(leadDetails)
  },[leadDetails])
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Lead", link: "/user/crm/lead" },
    { id: 3, label: "Lead Detail" },
  ];

  const upcommingActivity = useSelector(
    (state) => state?.lead?.leadDetail?.upcomming
  );
  const leadActivity = useSelector(
    (state) => state?.lead?.leadDetail?.followup
  );
  const { leadStageList, leadSourceList } = useSelector((state) => state.lead);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setStageList(arrOptForDropdown(leadStageList?.data, "name", "id"));
  }, [leadStageList]);

  useEffect(() => {
    if (leadSourceList?.data?.length === 0) {
      dispatch(getLeadSourceListInprogress({}));
    }
  }, []);
  useEffect(() => {
    if (leadStageList?.data?.length === 0) {
      dispatch(getLeadStageListInprogress({}));
    }
  }, []);

  const handleStepChange = (stepIndex) => {
    // 
  };
  const handleSaveDateTime = (newDateTime) => {
    // 
  };

  const tabs = [
    { id: "overview", label: " Overview" },
    { id: "activity", label: "Activity" },
    { id: "notes", label: "Notes" },
    { id: "mail", label: "Mail" },
    { id: "call", label: "Call" },
    { id: "meeting", label: "Meeting" },
    { id: "complaint", label: "Complaint" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="p-2">
            {leadDetail?.is_closed && leadDetail?.is_closed_type == "won" ? (
              <p>
                 
                <StatusContainer
                  icon={React.cloneElement(icons?.trophy, { size: 20 })}
                  content="Lead successfully moved onto the project on:"
                  time={leadDetail?.closed_at}
                />
                {/* won at */}
              </p>
            ) : ''}
            {leadDetail?.is_closed && leadDetail?.is_closed_type == "lost" ? (
              <>
                <StatusContainer
                  icon={React.cloneElement(icons?.cancelIcon, {
                    size: 20,
                    style: { color: "#a00" },
                  })}
                  content="Lead Closed On:"
                  time={leadDetail?.closed_at}
                />
                {/* won at */}
              </>
            ) : ("")}
            {!leadDetail?.is_closed && (
              <UpcommingActivity events={upcommingActivity} />
            )}
            <ActivityHistory showOnlyFirst={true} />
          </div>
        );
      case "activity":
        return (
          <div className="p-2">
            {leadDetail?.is_closed && leadDetail?.is_closed_type == "won" ? (
              <p>
                <StatusContainer
                  icon={React.cloneElement(icons?.trophy, { size: 20 })}
                  content="Lead successfully moved onto the project on:"
                  time={leadDetail?.closed_at}
                />
                {/* won at */}
              </p>
            ) : ''}
            {leadDetail?.is_closed && leadDetail?.is_closed_type == "lost" ? (
              <>
                <StatusContainer
                  icon={React.cloneElement(icons?.cancelIcon, {
                    size: 20,
                    style: { color: "#a00" },
                  })}
                  content="Lead Closed On:"
                  time={leadDetail?.closed_at}
                />
                {/* won at */}
              </>
            ) : ''}
            {!leadDetail?.is_closed && <UpcommingActivity events={upcommingActivity} />}
            <ActivityHistory />
            {/* <ActivityCard /> */}
          </div>
        );
      case "notes":
        return (
          <div className="p-4">
            <LeadNotes uuid={leadDetail?.uuid} />
          </div>
        );
      case "mail":
        return (
          <div className="p-4">
            <LeadMail uuid={leadDetail?.uuid} />
          </div>
        );
      case "call":
        return (
          <div className="p-4">
            <LeadCall uuid={leadDetail?.uuid} />
          </div>
        );
      case "meeting":
        return (
          <div className="p-4">
            <LeadMeeting uuid={leadDetail?.uuid} />
          </div>);
          case "complaint":
        return (
          <div className="p-4">
          <Complaint lead_uuid={leadDetail?.uuid} />
            {/* <LeadCall uuid={leadDetail?.uuid} /> */}
          </div>
        );
      default:
        return <div className="p-4">Select a tab to see the content.</div>;
    }
  };

  return (
    <div>
      {/* <div className="float-end">
        <Breadcrumps items={breadcrumbItems} className="p-0" />
      </div> */}
      <div className="pt-4 pb-2 ps-2 w-full flex 2xl:flex-nowrap flex-wrap items-center justify-between">
        <Stepper
          steps={stageList}
          activeStep={leadDetail?.stage_id || 2}
          onStepChange={handleStepChange}
        />
        {/* <LeadModal leadData={leadDetail} showReopenButton={leadDetail?.is_closed_type === "lost"}/> */}
        <div className="place-self-end w-full">

          <LeadModal
            leadData={leadDetail}
            showReopenButton={showReopenButton}
            showScheduleButton={showScheduleButton}
          />
        </div>
      </div>      
      <div className="border-t p-2 ">
        {/* <AddActivity leadData={leadDetail}/> */}
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 -mb-px ${activeTab === tab.id ? "tab-active" : ""
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">{renderTabContent()}</div>
      </div>
    </div>
  );
}
