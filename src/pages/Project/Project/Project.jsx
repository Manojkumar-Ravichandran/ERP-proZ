import React, { useEffect, useState } from "react";
import icons from "../../../contents/Icons";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import Loader from "../../../components/Loader/Loader";
import Modal from "../../../UI/Modal/Modal";
import ExportButton from "../../../UI/AgGridTable/ExportBtn/ExportBtn";
import "../Project.css"
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import FilterDropdown from "../../../components/DropdownFilter/FilterDropdown";
import ProgressBar from "../../../UI/ProgressBar/ProgressBar";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import ActionDropdown from "../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import StatusManager from "../../../UI/StatusManager/StatusManager";
import { getProjectListEffect } from "../../../redux/project/ProjectEffects";
import { useForm } from "react-hook-form";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import Pagination from "../../../UI/AgGridTable/Pagination/Pagination";
import { calculateColumnWidth } from "../../../utils/Table";



export default function Project() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
  const [projectList, setProjectList] = useState(
    []
  );
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [toastData, setToastData] = useState({ show: false });
  console.log("progress", projectList)
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Project List", link: "" },
  ];



  const [filters, setFilters] = useState({
    //  startDate: null,
    //  endDate: null,
    status: "ALL",
  });

  useEffect(() => {
    fetchLeadList();
  }, [paginationPageSize, paginationCurrentPage, filters, searchText]);

  const fetchLeadList = async () => {
    setLoading(true);
    try {
      const response = await getProjectListEffect({
        page: paginationCurrentPage,
        page_size: paginationPageSize,
        search: searchText,
        //  from_date: filters.startDate ? formatDateToYYYYMMDD(filters.startDate) : "",
        //  to_date: filters.endDate ? formatDateToYYYYMMDD(filters.endDate) : "",
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
    { value: 1, label: "ongoing" },
    { value: "0", label: "cancel" },
    { value: 3, label: "Delay" },
    { value: 2, label: "Completed" },
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
    setFilters({ status: "ALL" });
    setSearchText("");
    setPaginationCurrentPage(1);
    fetchLeadList();
  };
  const [isApproveModal, setIsApproveModal] = useState(false);
  const {
    register,
    control, reset,
    setValue,
    handleSubmit, getValues,
    formState: { errors },
  } = useForm();

  const ActionDropdowns = [
    { action: 1, label: "Not Started" },
    { action: 2, label: "Pending" },
    { action: 3, label: "In Progress" },
    { action: 4, label: "Completed" },
  ];

  // const columnDefs = [
  //   {
  //     headerName: "Project Number", field: "project_id", unSortIcon: true, cellRenderer: (params) => {
  //       const uuid = params.data.uuid;
  //       const project_id = params.data.project_id || "";
  //       const datailList = { ...params?.data, project_uuid: uuid, tab: 1 }

  //       return (
  //         <div>
  //           <button
  //             className="top-clr underline"
  //             onClick={() =>
  //               navigate(`/user/project/project-detail/${uuid}`, {
  //                 state: { ...datailList },
  //               })
  //             }
  //             title="View Lead Details"
  //           >
  //             {project_id}
  //           </button>
  //         </div>
  //       );
  //     },
  //   },
  //   { headerName: "Project Lead", field: "incharge_name", unSortIcon: true },
  //   { headerName: "Location ", field: "location", unSortIcon: true, },
  //   {
  //     headerName: "Client",
  //     field: "cust_name",
  //     unSortIcon: true,
  //     // cellRenderer: (params) => {
  //     //   const name = params?.data?.cust_name || "";
  //     //   const uuid = params?.data?.cust_uuid || "";
  //     //   return (
  //     //     <div>
  //     //       <button
  //     //         className="top-clr underline"
  //     //         onClick={() =>
  //     //           navigate(`/user/crm/customer/customer-view/${uuid}`, {
  //     //             state: { ...params.data }, // Pass leadId in state
  //     //           })
  //     //         }
  //     //         title="View Customer Details"
  //     //       >
  //     //         {name}
  //     //       </button>
  //     //     </div>
  //     //   );
  //     // },
  //   },
  //   {
  //     headerName: "Progress",
  //     field: "progress",
  //     cellStyle: { padding: "0", overflow: "visible" },
  //     cellRenderer: (params) => {
  //       return <ProgressBar percentage={params?.data?.progress || 0} />;
  //     },
  //   },
  //   {
  //     headerName: "Status",
  //     field: "status_label",
  //     unSortIcon: true,
  //   },

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
  //               navigate("/user/project/create-project", { state: { ...params.data } });
  //             }}
  //           >
  //             {React.cloneElement(icons.editIcon, { size: 18 })}
  //           </span>
  //           {/* {params?.data?.status === 1 && */}
  //           {/* <ActionDropdown
  //           options={ActionDropdowns}
  //           onAction={(e) => handleAction(e, params, params.data)}
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
      minWidth: Math.max(calculateColumnWidth("project_id", projectList?.data), 150), // Dynamic minWidth
      cellRenderer: (params) => {
        const uuid = params.data.uuid;
        const project_id = params.data.project_id || "";
        const datailList = { ...params?.data, project_uuid: uuid, tab: 1 };
  
        return (
          <div>
            <button
              className="top-clr underline"
              onClick={() =>
                navigate(`/user/project/project-detail/${uuid}`, {
                  state: { ...datailList },
                })
              }
              title="View Lead Details"
            >
              {project_id}
            </button>
          </div>
        );
      },
    },
    {
      headerName: "Project Lead",
      field: "incharge_name",
      unSortIcon: true,
      minWidth: Math.max(calculateColumnWidth("incharge_name", projectList?.data), 150), // Dynamic minWidth
    },
    {
      headerName: "Location",
      field: "location",
      unSortIcon: true,
      minWidth: Math.max(calculateColumnWidth("location", projectList?.data), 150), // Dynamic minWidth
    },
    {
      headerName: "Client",
      field: "cust_name",
      unSortIcon: true,
      minWidth: Math.max(calculateColumnWidth("cust_name", projectList?.data), 150), // Dynamic minWidth
      // cellRenderer: (params) => {
      //   const name = params?.data?.cust_name || "";
      //   const uuid = params?.data?.cust_uuid || "";
      //   return (
      //     <div>
      //       <button
      //         className="top-clr underline"
      //         onClick={() =>
      //           navigate(`/user/crm/customer/customer-view/${uuid}`, {
      //             state: { ...params.data }, // Pass leadId in state
      //           })
      //         }
      //         title="View Customer Details"
      //       >
      //         {name}
      //       </button>
      //     </div>
      //   );
      // },
    },
    {
      headerName: "Progress",
      field: "progress",
      cellStyle: { padding: "0", overflow: "visible" },
      minWidth: Math.max(calculateColumnWidth("progress", projectList?.data), 150), // Dynamic minWidth
      cellRenderer: (params) => {
        return <ProgressBar percentage={params?.data?.progress || 0} />;
      },
    },
    {
      headerName: "Status",
      field: "status_label",
      unSortIcon: true,
      minWidth: Math.max(calculateColumnWidth("status_label", projectList?.data), 150), // Dynamic minWidth
    },
    {
      headerName: "Action",
      field: "action",
      sortable: false,
      maxWidth: 200,
      minWidth: Math.max(calculateColumnWidth("action", projectList?.data), 150), // Dynamic minWidth
      cellRenderer: (params) => {
        return (
          <div
            className={`flex gap-1 items-center ${
              params?.data?.status !== 1 ? "justify-end" : "justify-center"
            }`}
          >
            <span
              className="top-clr rounded-full border p-2 cursor-pointer"
              data-tooltip-id="edit-notes"
              onClick={() => {
                navigate("/user/project/create-project", { state: { ...params.data } });
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

  const approveHandler = async (data) => {
    setLoading(true);
    try {
      // const result = await UpdateTaskCategorylistEffect(data);
      // setToastData({
      //     show: true,
      //     type: result.data.status,
      //     message: result.data.message,
      // });
    } catch (error) {
      setToastData({
        show: true,
        type: "error",
        message: error?.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
      fetchLeadList();
      setIsApproveModal(false);

      reset();

    }
  };

  const handleAction = async (action, params, master) => {

    setValue("uuid", params?.data?.uuid);
    setValue("status", action);
    setIsApproveModal(true);
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
            {/* <div>
              <DateRangePickerComponent
                className="darkCardBg"
                startDate={dates.startDate}
                endDate={dates.endDate}
                onDatesChange={handleDatesChange}
                focusedInput={focusedInput}
                onFocusChange={setFocusedInput}
              />
            </div> */}
          </div>
          <div className="flex items-center">
            <div className="me-3">
              <IconButton
                label="Create"
                icon={icons.plusIcon}
                onClick={() => {
                  navigate("/user/project/create-project");
                }}
              />
            </div>
            <div>
              <ExportButton
                label="Export"
                data={Array.isArray(projectList?.data) ? projectList?.data.map(({
                  project_id,
                  incharge_name,
                  location,
                  cust_name,
                  progress,
                  status_label

                }) => ({
                  "Project Number": project_id,
                  "Project Lead": incharge_name,
                  "location": location,
                  "Customer": cust_name,
                  "progress": progress || 0,
                  "Status": status_label

                })) : []}
                filename="Project_List"
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="w-24">
      <ProgressBar percentage={51} />
      </div> */}
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

      <Modal
        isOpen={isApproveModal}
        onClose={() => { setIsApproveModal(false); reset(); }}
        title="edit Task Category"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(approveHandler)}>
          <input type="hidden" {...register("uuid")} />
          <input type="hidden" {...register("status")} />

          <div>
            <TextArea
              label="reason"
              id="reason"
              placeholder="reason"
              register={register}
              validation={{
                required: "Please Enter reason"
              }}
              errors={errors}
            />

          </div>

          <div className="flex mt-4">
            <IconButton label="Submit" icon={icons.saveIcon} type="submit" loading={loading} />
          </div>
        </form>

      </Modal>

    </>
  );

}
