

import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import { useForm } from "react-hook-form";
import moment from "moment";

import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import icons from "../../../contents/Icons";
import ExportButton from "../../../UI/AgGridTable/ExportBtn/ExportBtn";
import Loader from "../../../components/Loader/Loader";
import { formatDateToYYYYMMDD } from "../../../utils/Date";
import FilterDropdown from "../../../components/DropdownFilter/FilterDropdown";
import DateRangePickerComponent from "../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import Pagination from "../../../UI/AgGridTable/Pagination/Pagination";
import { getBranchTransferListEffect } from "../../../redux/CRM/lead/LeadEffects";
import { calculateColumnWidth } from "../../../utils/Table";
import StatusManager from "../../../UI/StatusManager/StatusManager";

export default function LeadTransfers() {
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();



  const [searchText, setSearchText] = useState("");
  const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
  const [projectList, setProjectList] = useState(
    []
  );
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [toastData, setToastData] = useState({ show: false });
  const [isApproveModal, setIsApproveModal] = useState(false);
  const [itemModal, setItemModal] = useState(false);


  const [filters, setFilters] = useState({
    type: "ALL",
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });

  useEffect(() => {
    fetchLeadList();
  }, [paginationPageSize, paginationCurrentPage, filters, searchText]);

  const fetchLeadList = async () => {
    setLoading(true);
    try {
      const response = await getBranchTransferListEffect({
        page: paginationCurrentPage,
        page_size: paginationPageSize,
        search: searchText,
        from_date: filters.startDate ? formatDateToYYYYMMDD(filters.startDate) : "",
        to_date: filters.endDate ? formatDateToYYYYMMDD(filters.endDate) : "",
        type: filters.type,
      });
      setProjectList(response.data.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };



  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    if (!e.target.value) setPaginationCurrentPage(1);
  };
  const handleStatusChange = (selectedOption) => {
    setFilters((prev) => ({ ...prev, type: selectedOption || "" }));
  };

  const handlePageChange = (page) => {
    setPaginationCurrentPage(page);
    fetchLeadList();
  };
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Lead Transfer", link: "" },
  ];

  const handlePageSizeChange = (pageSize) => {
    setPaginationPageSize(pageSize);
    setPaginationCurrentPage(1);
    fetchLeadList();
  };

  const handleClearFilters = () => {
    setFilters({
      type: "ALL", 
      startDate: moment().subtract(30, "days"), // Set startDate to 30 days ago
      endDate: moment(), // Set endDate to the current date
    });// Set endDate to the current date
    setSearchText(""); // Clear search text
    setPaginationCurrentPage(1); // Reset pagination to the first page
    fetchLeadList(); // Fetch the updated list
  };


  const columnDefs = [
    {
      headerName: "Lead ",
      field: "lead_name",
      unSortIcon: true,
      minWidth: Math.max(calculateColumnWidth("lead_name", projectList), 150), 
      // cellRenderer: (params) => {

      //   const uuid = params.data.project_uuid;
      //   const project_id = params.data.project_no || "";
      //   const datailList = { project_id: project_id, pro_id: params.data.project_id, project_uuid: uuid, tab: 5 };

      //   return (
      //     <div>
      //       <div className="flex justify-center items-center w-100">
      //         <button
      //           className="top-clr underline"
      //           onClick={() =>
      //             navigate(`/user/project/project-detail/${uuid}`, {
      //               state: { ...datailList },
      //             })
      //           }
      //         >
      //           {project_id}
      //         </button>
      //       </div>
      //     </div>
      //   );
      // },
    },
    {
      headerName: "From Branch",
      field: "old_branch_name",
      unSortIcon: true,
      // cellStyle: { display: "flex", justifyContent: "center" },
      minWidth: Math.max(calculateColumnWidth("old_branch_name", projectList), 150), // Dynamic minWidth
    },
    {
      headerName: "To Branch",
      field: "new_branch_name",
      unSortIcon: true,
      // cellStyle: { display: "flex", justifyContent: "center" },
      minWidth: Math.max(calculateColumnWidth("new_branch_name", projectList), 150), // Dynamic minWidth
    },
    {
      headerName: "Transfer Date",
      field: "transfer_date",
      unSortIcon: true,
      // cellStyle: { display: "flex", justifyContent: "center" },
      minWidth: Math.max(calculateColumnWidth("transfer_date", projectList), 150), // Dynamic minWidth
    },
    {
      headerName: "Transfer Reason",
      field: "transfer_reason",
      unSortIcon: true,
      // cellStyle: { display: "flex", justifyContent: "center" },
      minWidth: Math.max(calculateColumnWidth("transfer_reason", projectList), 150), // Dynamic minWidth
    },
   
   

  ];


  const toastOnclose = () => {
    setToastData({ ...toastData, show: false });
  };
  const handleDateChange = ({ startDate, endDate }) => {
    setFilters((prev) => ({ ...prev, startDate, endDate }));
  };

  const StatusFilter = [
    { value: "ALL", label: "ALL" },
    { value: "in", label: "Branch In" },
    { value: "out", label: "Branch Out" },
   
  ];

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
            onFilter={handleStatusChange}
            value={filters.type} 
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
                  value={searchText}
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
            {/* <div>

              <IconButton
                label="Create"
                icon={icons.plusIcon}
                onClick={() => {
                  navigate("/user/project/material-return/add-material-return");
                }}
              />
            </div>
            <div>
              <ExportButton
                label="Export"
                data={Array.isArray(projectList?.data) ? projectList?.data.map(({
                  project_no,
                  request_no,
                  item_name,
                  quantity,
                  status_label
                }) => ({
                  "Project Number": project_no,
                  "Material Request ID": request_no,
                  "Item Name": item_name,
                  "Quantity": quantity,
                  "Status": status_label
                })) : []}
                filename="Project_Return_List"
              />


            </div> */}
          </div>
        </div>
      </div>

      {projectList?.length > 0 ? (
        <>
          <ReusableAgGrid
            key={columnDefs.length}
            rowData={projectList}
            columnDefs={columnDefs}
            defaultColDef={{ resizable: true }}
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
