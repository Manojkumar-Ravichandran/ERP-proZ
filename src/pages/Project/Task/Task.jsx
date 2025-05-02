import React, { useEffect, useState } from "react";
import icons from "../../../contents/Icons";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
// import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import Loader from "../../../components/Loader/Loader";
import Modal from "../../../UI/Modal/Modal";
import ExportButton from "../../../UI/AgGridTable/ExportBtn/ExportBtn";
import "../Project.css"
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { getSaleQuotationListEffect } from "../../../redux/Account/Sales/SaleQuotation/SaleQuotationEffects";
import FilterDropdown from "../../../components/DropdownFilter/FilterDropdown";
import ProgressBar from "../../../UI/ProgressBar/ProgressBar";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";

import ActionDropdown from "../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import StatusManager from "../../../UI/StatusManager/StatusManager";
import { formatDateToYYYYMMDD } from "../../../utils/Date";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import DateRangePickerComponent from "../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent";
import { getTaskListEffect } from "../../../redux/project/ProjectEffects";

import moment from "moment";
import Pagination from "../../../UI/AgGridTable/Pagination/Pagination";
import { calculateColumnWidth } from "../../../utils/Table";


export default function Task() {
  const [focusedInput, setFocusedInput] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
  const [projectList, setProjectList] = useState([
    {
      "projectId": "ID0001",
      "projectLead": "Farina",
      "location": "Bangalore",
      "client": "John Doe",
      "progress": 60,
      "status": "Ongoing"
    },
    {
      "projectId": "ID0002",
      "projectLead": "Lakshmi",
      "location": "Chennai",
      "client": "Kevin",
      "progress": 100,
      "status": "Completed"
    },
    {
      "projectId": "ID0003",
      "projectLead": "Manoj",
      "location": "Trichy",
      "client": "Gowtham",
      "progress": 37,
      "status": "Delayed"
    },
    {
      "projectId": "ID0004",
      "projectLead": "Mohan",
      "location": "Salem",
      "client": "Tamil",
      "progress": 0,
      "status": "Cancelled"
    },
    {
      "projectId": "ID0005",
      "projectLead": "Priya",
      "location": "Namakkal",
      "client": "Abishek",
      "progress": 18,
      "status": "Delayed"
    },
    {
      "projectId": "ID0006",
      "projectLead": "Vandhana",
      "location": "Madurai",
      "client": "David",
      "progress": 93,
      "status": "Ongoing"
    }
  ]
  );
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [toastData, setToastData] = useState({ show: false });
  console.log("progress", projectList)
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Task List", link: "" },
  ];

  const [filters, setFilters] = useState({

    status: "ALL",
    startDate: moment().subtract(30, "days"), 
    endDate: moment(),

  });

  useEffect(() => {
    fetchLeadList();
  }, [paginationPageSize, paginationCurrentPage, filters, searchText,]);

  const fetchLeadList = async () => {
    setLoading(true);
    try {
      const response = await getTaskListEffect({
        page: paginationCurrentPage,
        page_size: paginationPageSize,
        search: searchText,
        from_date: filters.startDate ? formatDateToYYYYMMDD(filters.startDate) : "",
        to_date: filters.endDate ? formatDateToYYYYMMDD(filters.endDate) : "",
        status: filters.status,
      });

      setProjectList(response.data.data);

    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const StatusFilter = [

    { value: "ALL", label: "All" },
    { value: 1, label: "Not Started" },
    { value: 2, label: "Pending" },
    { value: 3, label: "In Progress" },
    { value: 4, label: "Completed" },

  ];

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    if (!e.target.value) setPaginationCurrentPage(1);
  };
  const handleStatusChange = (selectedOption) => {
    setFilters((prev) => ({ ...prev, status: selectedOption || "" }));
  };

  const handlePageChange = (page) => {
    setPaginationCurrentPage(page);
    fetchLeadList();
  };

  const handlePageSizeChange = (pageSize) => {
    setPaginationPageSize(pageSize);
    setPaginationCurrentPage(1);
    fetchLeadList();
  };

  const handleClearFilters = () => {
    setFilters({
      status: "ALL", // Reset status to "ALL"
      startDate: moment().subtract(30, "days"), // Set startDate to 30 days ago
      endDate: moment(), // Set endDate to the current date
    });

    setSearchText(""); // Clear search text
    setPaginationCurrentPage(1); // Reset pagination to the first page
    fetchLeadList(); // Fetch the updated list
  };

  // const columnDefs = [

  //   {
  //     headerName: "Project Number", field: "project_id", unSortIcon: true, cellRenderer: (params) => {
  //       const uuid = params.data.project_uuid;
  //       const project_id = params.data.project_no || "";
  //       const datailList = { project_id: project_id, pro_id: params.data.project_id, project_uuid: uuid, tab: 2 }

  //       return (
  //         <div>
  //           <button
  //             className="top-clr underline"
  //             onClick={() =>
  //               navigate(`/user/project/project-detail/${uuid}`, {
  //                 state: { ...datailList },
  //               })
  //             }
  //           >
  //             {project_id}
  //           </button>
  //         </div>
  //       );
  //     },
  //   }, { headerName: "Task Category", field: "category_name", unSortIcon: true },
  //   { headerName: "Task name ", field: "subtask_name", unSortIcon: true, },
  //   { headerName: "Assigned to", field: "assigned_name", unSortIcon: true },
  //   { headerName: " Planned date", field: "planned_date", unSortIcon: true, },
  //   { headerName: "Priority ", field: "priority", unSortIcon: true, },


  //   {
  //     headerName: "Status",
  //     field: "status",
  //     sortable: false,
  //     cellRenderer: (params) => {
  //       const statusMapping = {

  //         4: "darkpurple",
  //         1: "darkRed",

  //         2: "darkBlue",
  //         3: "lightgreen",

  //       };

  //       const status = statusMapping[params?.data?.status];
  //       return (
  //         <div className="flex justify-center items-center w-100">


  //           <div className="flex justify-center">
  //             <StatusManager
  //               status={status}
  //               message={
  //                 params?.data?.status_label

  //               }
  //             />            </div>


  //         </div>

  //       );
  //     },
  //   }

  //   ,

  //   {
  //     headerName: "Action",
  //     field: "action",
  //     sortable: false,
  //     // pinned: "right",

  //     maxWidth: 200,

  //     minWidth: 150,
  //     cellRenderer: (params) => {
  //       return (
  //         <div className={`flex gap-1 items-center ${params?.data?.status !== 1 ? "justify-end" : "justify-center"}`}
  //         >

  //           <span
  //             className="top-clr rounded-full border p-2 cursor-pointer"
  //             data-tooltip-id="edit-notes"
  //             onClick={() => {

  //               navigate("/user/project/task/add-task", { state: { ...params.data } });


  //               // navigate("/user/accounts/sale/create-sale-quotation", { state: { ...params.data } });
  //             }}
  //           >
  //             {React.cloneElement(icons.editIcon, { size: 18 })}
  //           </span>


  //           {/* <ActionDropdown
  //           // options={ActionButton}
  //           // onAction={(e) => handleAction(e, params, params.data)}
  //           /> */}


  //           {/* } */}
  //           {/* <ActionDropdown
  //             iconClass="top-clr rounded-full border p-2 cursor-pointer"
  //             icon={icons.MdShare}
  //             // options={ActionDropdowns}
  //             // onAction={(e) => handleAction(e, params, params.data)}
  //           /> */}
  //         </div>
  //       );
  //     },
  //   },
  // ];
 
  const columnDefs = [
    {
      headerName: "Project Number",
      field: "project_id",
      unSortIcon: true,
      minWidth: Math.max(calculateColumnWidth("project_no", projectList?.data), 150), // Use projectList?.data here
      cellRenderer: (params) => {
        const uuid = params.data.project_uuid;
        const project_id = params.data.project_no || "";
        const datailList = { project_id: project_id, pro_id: params.data.project_id, project_uuid: uuid, tab: 2 };
  
        return (
          <div>
            <button
              className="top-clr underline"
              onClick={() =>
                navigate(`/user/project/project-detail/${uuid}`, {
                  state: { ...datailList },
                })
              }
            >
              {project_id}
            </button>
          </div>
        );
      },
    },
    {
      headerName: "Task Category",
      field: "category_name",
      unSortIcon: true,
      minWidth: Math.max(calculateColumnWidth("category_name", projectList?.data), 150), // Use projectList?.data here
    },
    {
      headerName: "Task name ",
      field: "subtask_name",
      unSortIcon: true,
      minWidth: Math.max(calculateColumnWidth("subtask_name", projectList?.data), 150), // Use projectList?.data here
    },
    {
      headerName: "Assigned to",
      field: "assigned_name",
      unSortIcon: true,
      minWidth: Math.max(calculateColumnWidth("assigned_name", projectList?.data), 150), // Use projectList?.data here
    },
    {
      headerName: "Planned date",
      field: "planned_date",
      unSortIcon: true,
      minWidth: Math.max(calculateColumnWidth("planned_date", projectList?.data), 150), // Use projectList?.data here
    },
    {
      headerName: "Priority",
      field: "priority",
      unSortIcon: true,
      minWidth: Math.max(calculateColumnWidth("priority", projectList?.data), 150), // Use projectList?.data here
    },
    {
      headerName: "Status",
      field: "status",
      sortable: false,
      minWidth: Math.max(calculateColumnWidth("status", projectList?.data), 150), // Use projectList?.data here
      cellRenderer: (params) => {
        const statusMapping = {
          4: "darkpurple",
          1: "darkRed",
          2: "darkBlue",
          3: "lightgreen",
        };
  
        const status = statusMapping[params?.data?.status];
        return (
          <div className="flex justify-center items-center w-100">
            <div className="flex justify-center">
              <StatusManager
                status={status}
                message={params?.data?.status_label}
              />
            </div>
          </div>
        );
      },
    },
    {
      headerName: "Action",
      field: "action",
      sortable: false,
      maxWidth: 200,
      minWidth: Math.max(calculateColumnWidth("action", projectList?.data), 150), // Use projectList?.data here
      cellRenderer: (params) => {
        return (
          <div className={`flex gap-1 items-center ${params?.data?.status !== 1 ? "justify-end" : "justify-center"}`}>
            <span
              className="top-clr rounded-full border p-2 cursor-pointer"
              data-tooltip-id="edit-notes"
              onClick={() => {
                navigate("/user/project/task/add-task", { state: { ...params.data } });
              }}
            >
              {React.cloneElement(icons.editIcon, { size: 18 })}
            </span>
          </div>
        );
      },
    },
  ];
  
  const toastOnclose = () => {
    setToastData({ ...toastData, show: false });
  };
  const handleDateChange = ({ startDate, endDate }) => {
    setFilters((prev) => ({ ...prev, startDate, endDate }));
  };

  return (
    <>
      {toastData?.show && (
        <AlertNotification
          show={toastData?.show}
          message={toastData?.message}
          onClose={toastOnclose}
        />
      )}
      <div className=" rounded-lg p-2 my-2 bg-white darkCardBg">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="chips-container flex justify-end px-4 py-3 ">

        <div flex gap-10>
          <FilterDropdown
            options={StatusFilter}
            placeholder="Status"

            // showClearButton={true}
            onFilter={handleStatusChange}
            value={filters.status} // Bind the value to the filters.status state

          />
          <button
            className="chips text-white px-2 py-10 ml-5 rounded transition float-end gap-2 align-middle"
            onClick={handleClearFilters}
          >
            <span>{icons.clear}</span> Clear Filters
          </button>
        </div>
      </div>
      <div className="bg-white py-3 rounded-lg darkCardBg mb-4">
        <div className="bg-white rounded-lg pe-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center p-4">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search..."
                  // value={searchText}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 pr-10 pl-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-3  cursor-pointer"
                // onClick={handleFilterChange}
                >
                  {icons.searchIcon}
                </div>
              </div>
            </div>

          </div>
          <div className="flex items-center gap-2">
            <DateRangePickerComponent className="darkCardBg "
              focusedInput={focusedInput}
              onFocusChange={setFocusedInput}
              startDate={filters.startDate}
              endDate={filters.endDate}
              onDatesChange={handleDateChange}
            />
            <div className="">

              <IconButton
                label="Create"
                icon={icons.plusIcon}
                onClick={() => {
                  navigate("/user/project/task/add-task");
                }}
              />
            </div>
            <div>

            <ExportButton
                            label="Export"
                            data={Array.isArray(projectList?.data) ? projectList?.data.map(({
                              project_no,
                              category_name,
                              subtask_name,
                              assigned_name,
                              planned_date,
                              priority,
                              status_label

                            }) => ({
                              "Project Number": project_no,
                              "Task Category": category_name,
                              "Task name": subtask_name,
                              "Assigned to":  assigned_name,
                              "Planned date": planned_date,
                              "Priority": priority,
                              "Status": status_label

                            })) : []}
                            filename="Task_List"
                          />

            </div>
          </div>
        </div>
      </div>


      {projectList?.data?.length > 0 ? (
        <>
          <ReusableAgGrid
            key={columnDefs.length}
            rowData={projectList?.data}
            columnDefs={columnDefs}
            defaultColDef={{ resizable: false }}
            onGridReady={(params) => params.api.sizeColumnsToFit()}
            pagination={false}
            showCheckbox={false}
          />
          <Pagination

            currentPage={paginationCurrentPage}
            totalPages={projectList?.last_page || 1}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            startItem={projectList?.from || 0}
            endItem={projectList?.to || 0}
            totalItems={projectList?.total || 0}
          />

        </>
      ) : !loading ? (
        <div className="flex justify-center items-center h-40 text-gray-500 text-lg font-semibold">
          No Data Found
        </div>
      ) : (
        <Loader />
      )}

    </>

  );
}
