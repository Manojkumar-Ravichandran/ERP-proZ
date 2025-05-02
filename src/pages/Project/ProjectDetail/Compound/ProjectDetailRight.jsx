import React, { useEffect, useState } from "react";
import Overview from "./Overview";
import Task from "./Task";
import MaterialInOut from "./MaterialInOut";
import MaterialRequest from "./MaterialRequest";
import MaterialReturn from "./MaterialReturn";




export default function ProjectDetailRight({ tab, setTab, projectDetails }) {
  const [activeTab, setActiveTab] = useState();


  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  const tabs = [
    { id: 1, label: " Overview" },
    { id: 2, label: "Tasks" },
    { id: 3, label: "Materials" },
    { id: 4, label: "Request" },
    { id: 5, label: "Material Return" },
    // { id: 6, label: "Bill Of Materials" },
    // { id: 7, label: "Transactions" },

  ];

  const renderTabContent = () => {
    const tabContent = {
      1: (
        <Overview projectDetails={projectDetails} />
      ),
      2: (
        <Task projectDetails={projectDetails} />
      ),
      3: (
        <MaterialInOut projectDetails={projectDetails} />
      ),
      4: (
        <MaterialRequest projectDetails={projectDetails} />
      ),
      5: (
        <MaterialReturn projectDetails={projectDetails} />
      ),
      // 6: (
      //   <div className="p-4">
      //     <p>Bill Of Materials Content</p>
      //   </div>
      // ),
      // 7: (
      //   <div className="p-4">
      //     <p>Transactions Content</p>
      //   </div>
      // ),
    };

    // Return the content based on the activeTab
    return tabContent[activeTab] || <div className="p-4">Select a tab to see the content.</div>;
  };

  return (
    <div>
      <div className="border-t p-2 ">
        <div className="flex border-b justify-between">
          {tabs.map((tabItem) => (
            <button
              key={tabItem.id}
              onClick={() => {
                setTab(tabItem.id); // Update parent state
                setActiveTab(tabItem.id)
              }}
              className={`px-6 py-2 -mb-px ${activeTab === tabItem.id ? "tab-active" : ""
                }`}
            >
              {tabItem.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">{renderTabContent()}</div>
      </div>
    </div>
  );
}
