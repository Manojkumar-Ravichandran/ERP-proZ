import React, { useEffect, useState } from "react";
import StateCard from "../../../UI/Card/StatCard/StateCard";
import icons from "../../../contents/Icons";
import DateRangePickerComponent from "../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent";
import { employeeDasboardDataEffect } from "../../../redux/CRM/Task/TaskEffect";
import ReusableTable from "../../../UI/Tables/ReusableTable/ReusableTable";
import { render } from "@testing-library/react";
import { convertDateTimeYMDToDMY, getTodayRange } from "../../../utils/Date";

export default function EmployeeDashboard() {
  const [focusedInput, setFocusedInput] = useState(null);
  const [dashboardData, setDashboardData] = useState([]);
  const [filterData, setFilterData] = useState({
    from: getTodayRange().start,
    to: getTodayRange().end,
  });
  const handleDateChange = ({ startDate, endDate }) => {
    setFilterData((prev) => ({ ...prev, from: startDate, to: endDate }));
  };

  const getData = async () => {
    console.log("filterData", filterData);
    const data = await employeeDasboardDataEffect(filterData);
    console.log("data", data);
    setDashboardData(data?.data?.data);
  };
  useEffect(() => {
    getData();
  }, [filterData]);
  const columns = [
    {
      key: "ld_id",
      header: "Lead Name",
      render: (_, item) => (
        <div className="flex ">
          <span className="font-medium text-gray-800">
            {item.ld_id} {" -  "}{" "}
          </span>
          <span className="text-sm text-gray-800 capitalize">
            {item.ld_name}
          </span>
        </div>
      ),
    },
    { key: "stage", header: "Stage" },
    {
      key: "is_completed",
      header: "Status",
      render: (value) => (value ? "Completed" : "Pending"),
    },
  ];
  const otherTaskolumns = [
    {
      key: "date",
      header: "Assigned Date",
      render: (value) => {
        console.log("value", value);
        return <span>{convertDateTimeYMDToDMY(value, false)}</span>;
      },
    },
    { key: "task_name", header: "Task Name" },
    {
      key: "is_completed",
      header: "Status",
      render: (value) => (value ? "Completed" : "Pending"),
    },
  ];
  return (
    <>
      <div className="flex justify-between items-center mt-5">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <DateRangePickerComponent
          className="darkCardBg"
          focusedInput={focusedInput}
          onFocusChange={setFocusedInput}
          startDate={filterData.from}
          endDate={filterData.to}
          onDatesChange={handleDateChange}
        />
      </div>
      <div className="flex gap-5 my-5">
        <StateCard>
          <div className="flex gap-4 items-start">
            <span className="bg-gray-100 rounded p-2 top-clr">
              {React.cloneElement(icons.wave, { size: 24 })}
            </span>
            <div className="flex flex-col gap-2 text-lg font-semibold">
              <span className="text-3xl font-bold ">
                {dashboardData?.leads || 0}
              </span>
              <span className="">{"My Leads"}</span>
            </div>
          </div>
          <div className="flex gap-4 mt-2 ps-5">
            <div className="flex gap-2 items-center border-r border-gray-900 px-2">
              <span className="top-clr">
                {React.cloneElement(icons.spinner, { size: 18 })}
              </span>
              <span>In Progress:</span>
              <span>{dashboardData?.open_leads || 0}</span>
            </div>
            <div className="flex gap-2 items-center border-r border-gray-900 px-2">
              <span className="top-clr">
                {React.cloneElement(icons.trophy, { size: 18 })}
              </span>
              <span>Won:</span>
              <span>{dashboardData?.won_leads || 0}</span>
            </div>
            <div className="flex gap-2 items-center  px-2">
              <span className="top-clr">
                {React.cloneElement(icons.thumbDown, { size: 18 })}
              </span>
              <span>Lost:</span>
              <span>{dashboardData?.lost_leads || 0}</span>
            </div>
          </div>
        </StateCard>
        <StateCard>
          <div className="flex gap-4 items-start">
            <span className="bg-gray-100 rounded p-2 top-clr">
              {React.cloneElement(icons.threeUsers, { size: 24 })}
            </span>
            <div className="flex flex-col gap-2 text-lg font-semibold">
              <span className="text-3xl font-bold ">
                {dashboardData?.tfollowups || 0}
              </span>
              <span className="">{"Follow Ups"}</span>
            </div>
          </div>
          <div className="flex gap-4 mt-2 ps-5">
            <div className="flex gap-2  items-center border-r border-gray-900 px-2">
              <span className="text-green-500">
                {React.cloneElement(icons?.dotFill, { size: 30 })}
              </span>
              <span>Completed:</span>
              <span>{dashboardData?.pending || 0}</span>
            </div>
            <div className="flex gap-2 items-center border-r border-gray-900 px-2">
              <span className="text-yellow-500">
                {React.cloneElement(icons.dotFill, { size: 30 })}
              </span>
              <span>Pending:</span>
              <span>{dashboardData?.completed || 0}</span>
            </div>
            <div className="flex gap-2 items-center  px-2">
              <span className="text-red-500">
                {React.cloneElement(icons.dotFill, { size: 30 })}
              </span>
              <span>Overdue:</span>
              <span>{dashboardData?.overdue || 0}</span>
            </div>
          </div>
        </StateCard>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <ReusableTable
          columns={columns}
          data={dashboardData?.follow_ups || []}
          rowKey="leadid"
          emptyMessage="No Data Found"
        />
        <ReusableTable
          columns={otherTaskolumns}
          data={dashboardData?.other_task || []}
          rowKey="leadids"
          emptyMessage="No Data Found"
        />
      </div>
    </>
  );
}
