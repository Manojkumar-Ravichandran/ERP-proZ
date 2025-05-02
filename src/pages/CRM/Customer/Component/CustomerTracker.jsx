import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import CustomerLead from './CustomerLead';
import CustomerNotes from './CustomerNotes';
import CommunicationTab from './CommunicationTab';
import OverView from './Overview';

export default function CustomerTracker() {
  const customerDatas = useSelector(state=>state?.customer?.customerDetail);
  const [customerData,setCustomerData]=useState()
  const tabs = [
    { id: "overview", label: " Overview" },
    { id: "lead", label: "Lead" },
    { id: "project", label: "Project" },
    { id: "accounts", label: "Accounts" },
    { id: "notes", label: "Notes" },
    { id: "communications", label: "Communications" },
  ];
  const [activeTab, setActiveTab] = useState("overview");
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="p-2">
            <OverView />
          </div>
        );
      case "lead":
        return (
          <div className="p-4">
            <CustomerLead leadDatList ={customerDatas?.leadData}/>
          
          </div>
        );
      case "notes":
        return (
          <div className="p-4">
            <CustomerNotes />
          </div>
        );
      case "project":
        return (
          <div className="p-4">
            There is no project data available
          </div>
        );
      case "accounts":
        return (
          <div className="p-4">
            No have Accounts Data
          </div>
        );
      case "communications":
        return (
          <div className="p-4">
            <CommunicationTab leadDatList ={customerDatas?.data}/>
          </div>
        );
     
      default:
        return <div className="p-4">Select a tab to see the content.</div>;
    }
  };

  return (
    <>
     <div className="border-t p-2 w-100 ">
        {/* <AddActivity leadData={leadDetail}/> */}
        <div className="flex border-b w-100">
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
    </>
    
  )
}
