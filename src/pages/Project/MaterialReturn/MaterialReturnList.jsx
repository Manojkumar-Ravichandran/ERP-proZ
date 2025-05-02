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
import { ApproveTaskCategoryEffect, CancelTaskCategoryEffect, DeliverTaskCategoryEffect, getTaskListEffect, MaterialListEffect, MaterialReturnApprovedEffect, MaterialReturnListEffect, MaterialReturnUpdateEffect, RejectTaskCategoryEffect, TransitTaskCategoryEffect } from "../../../redux/project/ProjectEffects";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { useForm } from "react-hook-form";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import { da } from "date-fns/locale";
import moment from "moment";
import Pagination from "../../../UI/AgGridTable/Pagination/Pagination";
import { calculateColumnWidth } from "../../../utils/Table";

export default function MaterialReturn() {
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    control, reset,
    setValue,
    handleSubmit, getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();


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
  const [itemList, setItemList] = useState(false);

  const [selectedUser, setSelectedUser] = useState(false);

  const [filters, setFilters] = useState({
    status: "ALL",
    startDate: moment().subtract(30, "days"), // 30 days ago
    endDate: moment(), // Current date
  });

  useEffect(() => {
    fetchLeadList();
  }, [paginationPageSize, paginationCurrentPage, filters, searchText]);

  const fetchLeadList = async () => {
    setLoading(true);
    try {
      const response = await MaterialReturnListEffect({
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
    { value: "ALL", label: "ALL" },
    { value: 1, label: "Pending" },
    { value: 0, label: "Cancel" },
    { value: 2, label: "Approved" },
    { value: 3, label: "Reject" },
    { value: 4, label: "Transit" },
    { value: 5, label: "Delivered" },
  ];

  const ActionButton = [
    { action: "Approved", label: "Approved", icon: icons.cancelIcon, iconClass: "text-green-200 cursor-pointer ", },
    { action: "Transit", label: "Transit", icon: icons.tick, iconClass: "text-green-200 cursor-pointer", },
    { action: "Delivered", label: "Delivered", icon: icons.cancelIcon, iconClass: "text-green-200 cursor-pointer ", },
    { action: "Cancel", label: "Cancel", icon: icons.tick, iconClass: " text-red-200 cursor-pointer", },
    { action: "Reject", label: "Reject", icon: icons.tick, iconClass: "text-red-200 cursor-pointer", },

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
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Material Return List", link: "" },
  ];

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
    });// Set endDate to the current date
    setSearchText(""); // Clear search text
    setPaginationCurrentPage(1); // Reset pagination to the first page
    fetchLeadList(); // Fetch the updated list
  };


  const columnDefs = [
    {
      headerName: "Project Number",
      field: "project_id",
      unSortIcon: true,
      minWidth: Math.max(calculateColumnWidth("project_no", projectList?.data), 150), // Dynamic minWidth
      cellRenderer: (params) => {

        const uuid = params.data.project_uuid;
        const project_id = params.data.project_no || "";
        const datailList = { project_id: project_id, pro_id: params.data.project_id, project_uuid: uuid, tab: 5 };

        return (
          <div>
            <div className="flex justify-center items-center w-100">
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
          </div>
        );
      },
    },
    {
      headerName: "Material Request ID",
      field: "request_no",
      unSortIcon: true,
      // cellStyle: { display: "flex", justifyContent: "center" },
      minWidth: Math.max(calculateColumnWidth("request_no", projectList?.data), 150), // Dynamic minWidth
    },
    {
      headerName: "Item name ",
      field: "item_name",
      unSortIcon: true,
      // cellStyle: { display: "flex", justifyContent: "center" },
      minWidth: Math.max(calculateColumnWidth("item_name", projectList?.data), 150), // Dynamic minWidth
    },
    {
      headerName: "Quantity",
      field: "quantity",
      unSortIcon: true,
      // cellStyle: { display: "flex", justifyContent: "center" },
      minWidth: Math.max(calculateColumnWidth("quantity", projectList?.data), 150), // Dynamic minWidth
    },
    {
      headerName: "Status",
      field: "status",
      sortable: false,
      // cellStyle: { display: "flex", justifyContent: "center" },
      minWidth: Math.max(calculateColumnWidth("status", projectList?.data), 150), // Dynamic minWidth
      cellRenderer: (params) => {
        const statusMapping = {
          1: "darkpurple",
          0: "darkRed",
          2: "lightgreen",
          5: "darkBlue",
          4: "warning",
          3: "darkpink",
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
      pinned: "right",
      cellClass: "action-col",
       cellStyle: { display: "flex", justifyContennt: "end" },
      maxWidth: 200,
      minWidth: Math.max(calculateColumnWidth("action", projectList?.data), 150), // Dynamic minWidth
      cellRenderer: (params) => {
        const filteredActions = ActionButton.filter((action) => {
          if (params?.data?.status === 1) {
            return ["Approved", "Cancel", "Reject"].includes(action.action);
          }
          if (params?.data?.status === 2) {
            return ["Transit"].includes(action.action);
          }
          if (params?.data?.status === 4) {
            return ["Delivered"].includes(action.action);
          }
          return false; // Exclude actions for other statuses
        });

        return (
          <div
            className={`flex gap-1 items-center ${params?.data?.status !== 1 ? "justify-end" : "justify-center"
              }`}
          >
            <span
              className="top-clr rounded-full border p-2 cursor-pointer"
              data-tooltip-id="edit-notes"
              onClick={() => {
                setValue("uuid", params?.data?.uuid);
                setValue("date", params?.data?.date);
                setValue("quantity", params?.data?.quantity);
                setItemModal(true);
              }}
            >
              {React.cloneElement(icons.editIcon, { size: 18 })}
            </span>

            {params?.data?.status !== 0 &&
              params?.data?.status !== 5 &&
              params?.data?.status !== 3 && (
                <ActionDropdown
                  options={filteredActions}
                  onAction={(e) => handleAction(e, params, params.data)}
                />
              )}
          </div>
        );
      },
    },
  ];
  const handleAction = async (action, params, master) => {
    const actionTypeMapping = {
      Approved: 2,
      Transit: 4,
      Delivered: 5,
      Cancel: "0",
      Reject: 3,
    };


    // Get the action type number based on the action name
    const actionType = actionTypeMapping[action] || null;
    setValue("status", Number(actionType)); // Convert actionType to a number
    setValue("uuid", params.data.uuid); // Set the UUID
    setIsApproveModal(true); // Open the modal
  };

  const toastOnclose = () => {
    setToastData({ ...toastData, show: false });
  };
  const handleDateChange = ({ startDate, endDate }) => {
    setFilters((prev) => ({ ...prev, startDate, endDate }));
  };
  const updateItem = async (data) => {
    setLoading(true);
    try {
      const result = await MaterialReturnUpdateEffect(data);
      setToastData({
        show: true,
        type: result.data.status,
        message: result.data.message,
      });
    } catch (error) {
      setToastData({
        show: true,
        type: "error",
        message: error?.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
      fetchLeadList();
      setItemModal(false);
      reset();

    }
  };

  const approveHandler = async (data) => {

    setLoading(true);
    try {
      const result = await MaterialReturnApprovedEffect(data);

      setToastData({
        show: true,
        type: result.data.status,
        message: result.data.message,
      });
    } catch (error) {
      setToastData({
        show: true,
        type: "error",
        message: error?.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
      fetchLeadList(); // Refresh the list
      setIsApproveModal(false); // Close the modal
      reset();
    }

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
            <div>

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
      <Modal
        isOpen={isApproveModal}
        onClose={() => { setIsApproveModal(false); reset(); }}
        title="approve Material Return"
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
      <Modal
        isOpen={itemModal}
        onClose={() => { setItemModal(false); reset(); }}
        title="Update Material Return"
        showHeader
        size="m"
        showFooter={false}
      >

        <form onSubmit={handleSubmit(updateItem)}>
          <input type="hidden" {...register("uuid")} />
          <input type="hidden" {...register("date")} />

          <div>
            <FormInput
              label="Quantity"
              id="quantity"
              placeholder="quantity"
              type="number"
              min={0}
              register={register}
              validation={{
                required: "Please Enter quantity"
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
