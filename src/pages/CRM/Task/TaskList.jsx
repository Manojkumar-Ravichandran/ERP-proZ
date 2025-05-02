import React, { useEffect, useState } from "react";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import { useDispatch, useSelector } from "react-redux";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import { useNavigate } from "react-router";
import ActionDropdown from "../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import icons from "../../../contents/Icons";
import Pagination from "../../../UI/AgGridTable/Pagination/Pagination";
import Modal from "../../../UI/Modal/Modal";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import { useForm } from "react-hook-form";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import StatusManager from "../../../UI/StatusManager/StatusManager";
import formatDateForDisplay from "../../../UI/Date/DateDisplay";
import formatTimeForDisplay from "../../../UI/Date/Time";
import SearchBar from "../../../components/SearchBar/SearchBar";
import ToggleSwitch from "../../../UI/Input/ToggleSwitch/ToggleSwitch";
import LabeledSwitchButton from "../../../UI/WithoutHook/Toggle/LabeledSwitchButton/LabeledSwitchButton";
import DateRangePickerComponent from "../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent";
import DropdownButton from "../../../UI/Buttons/DropdownBtn/DropdownBtn";
import AssignTask from "./AssignTask";
import { getTaskListInProgress } from "../../../redux/CRM/Task/TaskAction";
import { calculateColumnWidth } from "../../../utils/Table";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import Select from "../../../UI/Select/SingleSelect";
import { priorityData, taskStatusData } from "../../../contents/CRM/CRM";
import { validationPatterns } from "../../../utils/Validation";
import { select } from "redux-saga/effects";
import {
  getActivityQueryListEffect,
  getActivityReplayListEffect,
  getEmployeeListEffect,
} from "../../../redux/common/CommonEffects";
import {
  arrOptForDropdown,
  getDefaultDate,
  getDefaultDateTime,
} from "../../../utils/Data";
import {
  deleteTaskEffect,
  editTaskListEffect,
  updateTaskImageUploadEffect,
  updateTaskListEffect,
} from "../../../redux/CRM/Task/TaskEffect";
import getDef from "ajv-keywords/dist/definitions/patternRequired";
import FileInput from "../../../UI/Input/FileInput/FileInput";
import { min } from "date-fns";
import Accordion from "../../../UI/Accordion/Accordion";
import { v4 as uuidv4 } from "uuid";
import StatusIndicator from "../../../UI/Badge/StatusIndicator/StatusIndicator";
import "../../Inventory/Master/Master.css";
import GeoMap from "../../../UI/GeoLocation/GeoMap/GeoMap";
import {
  createLeadActivityEffect,
  getLeadSourceListEffect,
  getLeadStageListEffect,
} from "../../../redux/CRM/lead/LeadEffects";
import { setLeadDetailInprogress } from "../../../redux/CRM/lead/LeadActions";
import { getUnitEffect } from "../../../redux/Utils/Unit/UnitEffect";
import SearchableSelect from "../../../UI/Select/SearchableSelect";
import SingleCheckbox from "../../../UI/Input/CheckBoxInput/SingleCheckbox";
import { Toggle } from "rsuite";
import FilterDropdown from "../../../components/DropdownFilter/FilterDropdown";

export default function TaskList() {
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Task List" },
  ];
  const [toastData, setToastData] = useState({ show: false });
  const [taskList, settaskList] = useState([]);
  const [taskData, settaskData] = useState();
  const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);

  const [filterData, setFilterData] = useState({
    isOpen: true,
    startDate: "",
    endDate: "",
    task_type: "All",
  });
  const taskDatas = useSelector((state) => state?.crmTask?.taskList);
  const [selectedData, setSelectedData] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [focusedInput, setFocusedInput] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(""); // Default to existing image
  const [accordionItem, setAccordionItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [communicationMode, setCommunicationMode] = useState();
  const [selectedQuery, setSelectedQuery] = useState(null); // Track selected query
  const [selectedReplayLabel, setSelectedReplayLabel] = useState("");
  const [activityIsModal, setActivityIsModal] = useState(false);
  const [stageList, setStageList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [leadSourceList, setLeadSourceList] = useState([]);
  const [queryList, setQueryList] = useState([]);
  const [selectedQueryLabel, setSelectedQueryLabel] = useState("");
  const [replyList, setReplyList] = useState([]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm({ defaultValues: {} });
  const dateWatch = watch("date");

  const {
    register: updateRegister,
    formState: { errors: updateErrors },
    handleSubmit: updateHandleSubmit,
    setValue: updateSetValue,
    watch: updateWatch,
    reset: updateReset,
  } = useForm({ defaultValues: {} });
  const imageFile = updateWatch("file_url");
  const {
    register: activityRegister,
    formState: { errors: activityError },
    handleSubmit: activityHandleSubmit,
    setValue: activitySetValue,
    watch: activityWatch,
    reset: activityReset,
  } = useForm();
  const pipeStage = activityWatch("stages_id");
  const dimension = activityWatch("editDimension");
  useEffect(() => {
    if (imageFile?.[0]) {
      const file = imageFile[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl); // Cleanup old preview URL
    }
  }, [imageFile]);
  useEffect(() => {
    (async () => {
      try {
        let { data } = await getActivityReplayListEffect();
        data = data.data.map((list) => ({
          ...list,
          label: list.name,
          value: list.id,
        }));
        setReplyList(data);
      } catch (error) {
        setReplyList([]);
      }
    })();
  }, []);

  const datafeed = (event) => {
    const stage = event.stages_id;
    const payload = [
      {
        label: "Email",
        value: 5,
      },
      {
        label: "Direct",
        value: 6,
      },
      {
        label: "Phone",
        value: 7,
      },
      {
        label: "WhatsApp",
        value: 8,
      },
      {
        label: "Message",
        value: 9,
      },
    ];

    setLeadSourceList(payload);
    if (stage == 2) {
      const payload = [
        {
          label: "Email",
          value: 5,
        },
        {
          label: "Direct",
          value: 6,
        },
        {
          label: "Phone",
          value: 7,
        },
        {
          label: "WhatsApp",
          value: 8,
        },
        {
          label: "Message",
          value: 9,
        },
      ];

      setLeadSourceList(payload);
    } else if (stage == 3) {
      const payload = [
        {
          label: "Direct",
          value: 6,
        },
      ];
      setLeadSourceList(payload);
    } else if (stage == 4) {
      const payload = [
        {
          label: "Email",
          value: 5,
        },
        {
          label: "Phone",
          value: 7,
        },
        {
          label: "WhatsApp",
          value: 8,
        },
        {
          label: "Message",
          value: 9,
        },
      ];
      setLeadSourceList(payload);
      setValue("mode_communication", event.mode_communication);
      setValue("notes", event.notes);
    }
    setValue("mode_communication", event?.mode_communication);
  };
  useEffect(() => {
    getTaskList();
  }, [searchText, filterData]);

  const getTaskList = (payload = {}) => {
    dispatch(
      getTaskListInProgress({
        task_type: filterData?.task_type,
        type: filterData?.isOpen ? "pending" : "completed",
        from: filterData?.startDate,
        to: filterData?.endDate,
        search: searchText,
        page: paginationCurrentPage,
        page_size: paginationPageSize,
      })
    );
  };

  useEffect(() => {
    settaskData(taskDatas);
    if (taskDatas?.data?.length > 0) {
      settaskList([...taskDatas?.data]);
    } else {
      console.log("No data found in taskDatas.");
      settaskList([]);
    }
  }, [taskDatas]);
  useEffect(() => {
    (async () => {
      const { data } = await getEmployeeListEffect();
      if (data?.data?.length > 0) {
        setEmployeeList(arrOptForDropdown(data?.data, "name", "id") || []);
      } else {
        setEmployeeList([]);
      }
    })();
  }, []);
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-orange-500";
      case "Overdue":
        return "text-red-500";
      case "Completed":
        return "text-green-500";
      default:
        return "text-blue-500";
    }
  };
  const renderTaskContent = (item, latestUpdate) => {
    const statusColor = getStatusColor(latestUpdate);

    return (
      <div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="top-clr">
              {React.cloneElement(icons?.file, { size: 20 })}
            </span>
            <span className="text-sm font-semibold text-gray-500 ml-2">
              Task Description
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={statusColor}>
              {React.cloneElement(icons?.dotFill, { size: 20 })}
            </span>
            <span>{latestUpdate}</span>
          </div>
        </div>

        {item?.details && (
          <div className="border rounded my-4 p-2">{item.details}</div>
        )}

        {item?.attachment && (
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <span className="top-clr">
                {React.cloneElement(icons?.filepin, { size: 20 })}
              </span>
              <span className="text-sm font-semibold text-gray-500 ml-2">
                Attachment
              </span>
            </div>

            <div className="flex items-center justify-between  rounded p-2">
              <div className="flex items-center">
                <span className="top-clr">
                  {React.cloneElement(icons?.file, { size: 18 })}
                </span>
                <span className="ml-2 text-sm text-gray-700 truncate max-w-[200px]">
                  {item.attachment.split("/").pop()}
                </span>
              </div>
              <a
                href={item.attachment}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-500 hover:underline"
              >
                {React.cloneElement(icons?.downloadIcon, { size: 18 })}
                <span className="ml-1 text-sm">Download</span>
              </a>
            </div>
          </div>
        )}
      </div>
    );
  };
  const handleAction = (action, params, data) => {
    setSelectedData(data);

    switch (action) {
      case "edit":
        const fieldsToSet = [
          "date",
          "task_name",
          "assigned_to",
          "description",
          "priority",
          "deadline",
        ];
        fieldsToSet.forEach((field) => setValue(field, data?.[field]));
        setIsEditModalOpen(true);
        break;

      case "update":
        updateSetValue("date", getDefaultDate());
        setValue("notes", data?.notes);
        activitySetValue("date", data?.date);
        setCommunicationMode(data?.mode_communication);
        datafeed(data);

        setIsUpdateModalOpen(true);
        break;

      case "view":
        console.log("view", data);
        const items =
          data?.task_update?.map((item) => ({
            id: uuidv4(),
            title: item?.date,
            content: renderTaskContent(item, data?.latest_update),
          })) || [];

        setAccordionItem(items);
        setIsViewModalOpen(true);
        break;

      case "delete":
        // handle delete action here
        setIsDeleteModalOpen(true);
        break;

      default:
        console.warn(`Unhandled action type: ${action}`);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let { data } = await getActivityQueryListEffect();
        data = data.data.map((list) => ({
          ...list,
          label: list.name,
          value: list.id,
        }));
        setQueryList(data);
      } catch (error) {
        setQueryList([]);
      }
    })();
  }, []);

  const handleEditModalClose = () => {
    reset();
    setIsEditModalOpen(false);
  };
  const handleUpdateModalClose = () => {
    updateReset();
    setIsUpdateModalOpen(false);
  };
  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
  };
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const columnDefs = [
    {
      headerName: "Lead Name / Task Name ",
      field: "task_name",
      minWidth: Math.max(calculateColumnWidth("task_name", taskList), 150),
      unSortIcon: true,
      valueGetter: (params) => {
        return params.data?.task_type === "schedule"
          ? params.data?.lead_name
          : params.data?.task_name;
      },
    },

    {
      headerName: "Employee Name",
      field: "assigned_to_name",
      minWidth: calculateColumnWidth("assigned_to_name", taskList),
      unSortIcon: true,
    },
    {
      headerName: "Date",
      minWidth: 200,
      unSortIcon: true,
      field: "date",
    },

    {
      headerName: "Priority",
      minWidth: 200,
      unSortIcon: true,
      field: "priority",
    },
    {
      headerName: "Status",
      minWidth: 200,
      unSortIcon: true,
      field: "latest_update",
      cellRenderer: (params) => {
        if (params?.data?.latest_update === "Pending") {
          return <StatusManager status="darkOrange" message="Pending" />;
        } else if (params?.data?.latest_update === "Overdue") {
          return <StatusManager status="darkRed" message="Overdue" />;
        } else if (params?.data?.latest_update === "Completed") {
          return <StatusManager status="darkgreen" message="Completed" />;
        }
      },
    },
    {
      headerName: "Task Type",
      minWidth: 200,
      unSortIcon: true,
      field: "task_type",
      valueGetter: (params) => {
        return params.data?.task_type === "schedule"
          ? "Scheduled"
          : "Assigned Task";
      },
    },
    {
      headerName: "Overdue",
      field: "days_overdue",
      minWidth: 200,
      sortable: false,
    },

    {
      headerName: "Action",
      field: "action",
      pinned: "right",
      sortable: false,
      minWidth: 100,
      maxWidth: 100,
      cellRenderer: (params) => {
        const ActionButton = [
          // { action: "order", label: "Convert To Order", icon: icons.tick, iconClass: "text-green-200 cursor-pointer", },

          // {
          //   action: "update",
          //   label: "Update",
          //   icon: icons.rotateIcon,
          //   iconClass: "text-blue-200 cursor-pointer ",
          // },
          {
            action: "delete",
            label: "Delete",
            icon: icons.deleteIcon,
            iconClass: "text-red-200 cursor-pointer ",
          },
        ];
        if (params.data?.task_type == "assigned") {
          ActionButton.push({
            action: "view",
            label: "View",
            icon: icons.eyeIcon,
            iconClass: "text-blue-800 cursor-pointer ",
          });
        }
        if (
          params.data?.task_type == "assigned" &&
          params.data?.is_completed == 0
        ) {
          ActionButton.push({
            action: "edit",
            label: "Edit",
            icon: icons.editIcon,
            iconClass: "text-green-200 cursor-pointer",
          });
        }
        return (
          <div className={`flex gap-1 items-center `}>
            {/* {params?.data?.status === 1 && ( */}
            <ActionDropdown
              options={ActionButton}
              onAction={(e) => handleAction(e, params, params.data)}
            />
            {/* )} */}
          </div>
        );
      },
    },
  ];

  const handlePageChange = (page) => {
    setPaginationCurrentPage(page);
    getTaskList({ page });
  };
  const handlePageSizeChange = (pageSize) => {
    setPaginationPageSize(pageSize);
    setPaginationCurrentPage(1);
    getTaskList({ page: 1 });
  };
  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
  };
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleDateChange = ({ startDate, endDate }) => {
    setFilterData((prev) => ({ ...prev, startDate, endDate }));
  };

  const editTaskHandler = async (data) => {
    const datas = await editTaskListEffect({
      ...data,
      uuid: selectedData.uuid,
    });

    if (datas?.data?.status === "success") {
      setToastData({
        show: true,
        type: "success",
        message: datas?.data?.message,
      });
    } else {
      setToastData({
        show: true,
        type: "error",
        message: datas?.data?.message,
      });
    }
    setIsEditModalOpen(false);
    dispatch(getTaskListInProgress({ page: paginationCurrentPage }));
    reset();
  };
  const editHandleClose = () => {
    setIsEditModalOpen(false);
    reset();
  };

  const updateTaskHandler = async (data) => {
    console.log("Uploaded File:", data.file_url[0]); // Log the selected file

    try {
      const payload = { ...data, uuid: selectedData.uuid };
      delete payload.file_url;
      const response = await updateTaskListEffect(payload);

      if (response?.data?.status === "success") {
        if (
          response?.data?.status === "success" &&
          response?.data?.uuid &&
          data?.file_url?.length > 0
        ) {
          const formData = new FormData();
          formData.append("file_url", data.file_url[0]);
          formData.append("uuid", response.data.uuid);
          console.log(formData, "formData");

          const uploadResponse = await updateTaskImageUploadEffect(formData);
          if (uploadResponse?.data?.status === "success") {
            setToastData({
              show: true,
              type: "success",
              message: response.data.message,
            });
          }
        } else {
          setToastData({
            show: true,
            type: "success",
            message: response.data.message,
          });
        }
      } else {
        setToastData({
          show: true,
          type: "error",
          message: response?.data?.message || "Failed to update task.",
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setToastData({
        show: true,
        type: "error",
        message: error?.message || "An unexpected error occurred.",
      });
    } finally {
      setIsUpdateModalOpen(false);
      dispatch(getTaskListInProgress({ page: paginationCurrentPage }));
      updateReset();
    }
  };

  const confirmDelete = async () => {
    try {
      const datas = await deleteTaskEffect({
        uuid: selectedData.uuid,
      });

      if (datas?.data?.status === "success") {
        setToastData({
          show: true,
          type: "success",
          message: datas?.data?.message,
        });
      } else {
        setToastData({
          show: true,
          type: "error",
          message: datas?.data?.message,
        });
      }
    } catch (err) {
      setToastData({
        show: true,
        type: "error",
        message: err?.data?.message,
      });
    } finally {
      setIsDeleteModalOpen(false);
      dispatch(getTaskListInProgress({ page: paginationCurrentPage }));
    }
  };

  const currentLocations = useSelector(
    (state) => state?.common?.location?.location
  );
  const filteredReplyList = replyList.filter((reply) => {
    return reply.query_id === selectedQuery;
  });

  useEffect(() => {
    const mapToOptions = (data) =>
      data.map(({ name, id }) => ({ label: name, value: id }));

    const fetchData = async () => {
      try {
        const [
          { data: employees },
          { data: stages },
          { data: sources },
          { data: units },
        ] = await Promise.all([
          getEmployeeListEffect(),
          getLeadStageListEffect(),
          getLeadSourceListEffect(),
          getUnitEffect(),
        ]);

        setEmployeeList(mapToOptions(employees.data));
        setStageList(
          mapToOptions(stages.data.filter(({ name }) => name !== "New"))
        );
        setSourceList(mapToOptions(sources.data));
        setUnitList(arrOptForDropdown(units.data?.data, "unit_name", "id"));
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };

    fetchData();
  }, []);

  const activityHandler = async (data, reset) => {
    setActivityLoading(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "send_msg") {
        formData.append(key, value ? 1 : 0);
      } else if (key === "date" || key === "schedule_time") {
        formData.append(key, value.replace("T", " "));
      } else if (key === "file_url") {
        if (value?.length > 0) {
          formData.append(key, value[0]); // Appending the first file
        } else {
          formData.append(key, ""); // Ensure empty value if no file is selected
        }
      } else if (key === "notes") {
        formData.append(key, value || "");
      } else {
        formData.append(key, value);
      }
    });

    formData.append("mode_communication", communicationMode);
    formData.append("pipeline_id", data?.stages_id);
    formData.append("lead_id", selectedData?.lead_id);
    formData.append("is_schedule", 1);
    formData.append("schedule_id", selectedData?.uuid);
    formData.append("customer_reply", selectedQuery);
    formData.append("content_reply", selectedReplayLabel);

    if (data?.stages_id == 3) {
      formData.append("latitude", currentLocations[0]);
      formData.append("longitude", currentLocations[1]);
    }

    try {
      const result = await createLeadActivityEffect(formData);

      if (result.data.status === "success") {
        setToastData({
          show: true,
          type: "success",
          message: result?.data?.message || "Activity saved successfully!",
        });

        setActivityIsModal(false);
      }
    } catch (error) {
      setToastData({
        show: true,
        type: "error",
        message: error?.response?.data?.message || "Failed to save activity!",
      });
    } finally {
      setActivityLoading(false);
      setActivityIsModal(false);
      // reset();
      const payloads = {
        uuid: selectedData?.uuid,
        stages: "",
        is_schedule: 1,
        customer_reply: selectedQuery,
        content_reply: selectedReplayLabel,
      };
      dispatch(setLeadDetailInprogress(payloads));
    }
  };

  const StatusFilter = [
    { value: "All", label: "All" },
    { value: "assigned", label: "Assigned" },
    { value: "schedule", label: "Schedule" },
  ];
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
      <div className=" rounded-lg p-2 my-2 bg-white darkCardBg">
        <Breadcrumps items={breadcrumbItems} />
      </div>
      <div className="flex justify-between items-center gap-4 my-4">
        <div className="flex   items-center gap-4 ">
          <LabeledSwitchButton
            isOpen={filterData?.isOpen}
            onToggle={() => {
              setFilterData({ ...filterData, isOpen: !filterData.isOpen });
            }}
            openLabel="Pending"
            closedLabel="Completed"
            className="w-24"
          />

          <DateRangePickerComponent
            className="darkCardBg"
            focusedInput={focusedInput}
            onFocusChange={setFocusedInput}
            startDate={filterData.startDate}
            endDate={filterData.endDate}
            onDatesChange={handleDateChange}
          />
          <FilterDropdown
            options={StatusFilter}
            placeholder="Status"
            showClearButton={true}
            onFilter={(value) => {
              setFilterData({ ...filterData, task_type: value });
            }}
            value={filterData.task_type} // Bind the value to the filters.status state
          />
        </div>
        <div className="">
          <IconButton
            label="Clear Filter"
            className="light_btn"
            icon={icons?.clear}
            onClick={() =>
              setFilterData({
                ...filterData,
                isOpen: true,
                startDate: null,
                endDate: null,
                task_type: "All",
              })
            }
          />
        </div>
      </div>
      <div className=" rounded-lg p-2 my-2 bg-white darkCardBg">
        <div className="flex justify-between items-center mb-2">
          <SearchBar
            onChange={handleSearchChange}
            value={searchText}
            onClear={() => setSearchText("")}
            width="w-1/11"

          />
          <div className="flex  items-center gap-4">
            {/* <IconButton
              label="Assign"
              icon={icons?.plusIcon}
              onClick={() => {}}
            /> */}
            <AssignTask />
            <DropdownButton
              label="Export"
              options={["Download Excel", "Download PDF"]}
              onSelect={(option) => console.log(option)}
            />
          </div>
        </div>
      </div>
      <>
        <ReusableAgGrid
          key={columnDefs.length}
          rowData={taskList}
          columnDefs={columnDefs}
          defaultColDef={{ resizable: false }}
          onGridReady={(params) => params.api.sizeColumnsToFit()}
          pagination={false}
          showCheckbox={false}
          from={(taskData?.from-1) ||0}
        />
        <Pagination
          currentPage={paginationCurrentPage}
          totalPages={taskData?.last_page || 1}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          startItem={taskData?.from || 0}
          endItem={taskData?.to || 0}
          totalItems={taskData?.total || 0}
        />
      </>

      {/* EDIT MODEL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        title="Assign Task"
        size="l"
        showFooter={false}
        contentStyle={{ width: "100%" }}
      >
        <form onSubmit={handleSubmit(editTaskHandler)}>
          <div className="grid  grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormInput
                id="date"
                iconLabel={React.cloneElement(icons.calendarWDate, {
                  size: 20,
                })}
                label="Date"
                type="date"
                register={register}
                errors={errors}
                validation={{ required: "Date is required" }}
              />
            </div>
            <FormInput
              id="task_name"
              iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
              label="Task Name"
              register={register}
              errors={errors}
              validation={{
                required: "Task name is required",
                pattern: {
                  value: validationPatterns?.spacePattern,
                  message: "Provide Valid Task Name",
                },
              }}
            />
            <Select
              options={employeeList}
              label="Assign To"
              id="assigned_to"
              placeholder="Select Assignee"
              iconLabel={React.cloneElement(icons.TbUserCheck, {
                size: 20,
              })}
              register={register}
              errors={errors}
              validation={{ required: "Assignee is required" }}
            />
            <div className="col-span-2">
              <TextArea
                id="description"
                iconLabel={React.cloneElement(icons.calendarWDate, {
                  size: 20,
                })}
                label="Task Description"
                register={register}
                errors={errors}
                showStar={false}
                placeholder={"Enter description"}
                validation={{ required: false }}
              />
            </div>

            <Select
              options={priorityData}
              label="Priority"
              id="priority"
              placeholder="Select Priority"
              iconLabel={React.cloneElement(icons.TbUserCheck, {
                size: 20,
              })}
              register={register}
              errors={errors}
              validation={{ required: "Priority is required" }}
            />

            <FormInput
              id="deadline"
              iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
              label="Deadline"
              type="date"
              register={register}
              errors={errors}
              validation={{ required: "DeadLine is required" }}
              min={dateWatch}
            />
          </div>
          <div className="flex gap-4 my-3">
            <IconButton
              label={"Cancel"}
              type="button"
              className="btn_cancel"
              onClick={editHandleClose}
            />
            <IconButton label={"Save"} type="submit" icon={icons?.saveIcon} />
          </div>
        </form>
      </Modal>

      {/* UPDATE MODAL */}

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={handleUpdateModalClose}
        title="Update Task"
        size="l"
        showFooter={false}
        contentStyle={{ width: "100%" }}
      >
        {selectedData?.task_type === "assigned" ? (
          <form onSubmit={updateHandleSubmit(updateTaskHandler)}>
            <div className="grid  grid-cols-2 gap-4">
              {/* <div className="col-span-2"> */}
              <FormInput
                id="date"
                iconLabel={React.cloneElement(icons.calendarWDate, {
                  size: 20,
                })}
                label="Date"
                type="date"
                register={updateRegister}
                errors={updateErrors}
                min={getDefaultDate(2)}
                max={getDefaultDate(0)}
                validation={{
                  required: "Date is required",
                  min: {
                    value: getDefaultDate(2),
                    message: "Date cannot be in the Past",
                  },
                }}
              />
              {/* </div> */}
              <Select
                options={taskStatusData}
                label="Status"
                id="update_status"
                placeholder="Select Status"
                iconLabel={React.cloneElement(icons.listStart, {
                  size: 20,
                })}
                register={updateRegister}
                errors={updateErrors}
                validation={{ required: "Priority is required" }}
              />

              <div className="col-span-2">
                <TextArea
                  id="details"
                  iconLabel={React.cloneElement(icons.file, {
                    size: 20,
                  })}
                  label="Outcome/Details"
                  register={updateRegister}
                  errors={updateErrors}
                  showStar={false}
                  placeholder={"Enter description"}
                  validation={{ required: false }}
                />
              </div>
              <div className="col-span-2">
                <FileInput
                  id="file_url"
                  label="Upload File"
                  showStar={false}
                  register={updateRegister}
                  iconLabel={React.cloneElement(icons.filepin, {
                    size: "20px",
                  })}
                  validation={{ required: false }}
                  errors={updateErrors}
                  accept=".jpg,.png,.pdf"
                  multiple={false}
                />
              </div>
            </div>
            <div className="flex gap-4 my-3">
              <IconButton
                label={"Cancel"}
                type="button"
                className="btn_cancel"
                onClick={editHandleClose}
              />
              <IconButton label={"Save"} type="submit" icon={icons?.saveIcon} />
            </div>
          </form>
        ) : (
          /* ACTIVITY HANDLER */
          <form onSubmit={activityHandleSubmit(activityHandler)}>
            <FormInput
              id="date"
              iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
              label="Date & Time"
              type="datetime-local"
              register={activityRegister}
              errors={activityError}
              validation={{ required: "Schedule Date & Time is required" }}
              max={getDefaultDateTime()}
              min={getDefaultDateTime(2)}
            />
            <Select
              options={stageList}
              label="Purpose"
              id="stages_id"
              register={activityRegister}
              errors={activityError}
              // disabled={true}
              validation={{ required: "Purpose is required" }}
              placeholder="Select Stage"
              iconLabel={React.cloneElement(icons.tag, { size: 20 })}
            />
            <div className="flex my-4 gap-3">
              {leadSourceList.map((option) => (
                <button
                  key={option?.value}
                  className={`chip cursor-not-allowed ${
                    communicationMode == option?.value ? "active" : ""
                  } `}
                  style={{ cursor: "not-allowed" }}
                  onClick={() => setCommunicationMode(option?.value)}
                  type="button"
                >
                  {icons[option?.label.toLowerCase()]}
                  {option?.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-12">
                <SearchableSelect
                  options={queryList}
                  id="customer_reply"
                  iconLabel={React.cloneElement(icons.textarea, { size: 20 })}
                  label="Lead Insights / Inquiries"
                  validation={{ required: "Customer Feedback is required" }}
                  register={activityRegister}
                  errors={activityError}
                  setValue={setValue}
                  onChange={(selectedOption) => {
                    setSelectedQueryLabel(selectedOption.label);
                    setSelectedQuery(selectedOption.value); // Ensure selectedQuery is updated
                  }}
                />
              </div>
              <div className="col-span-12">
                <SearchableSelect
                  options={filteredReplyList}
                  label="Our Reply"
                  id="content_reply"
                  iconLabel={React.cloneElement(icons.replay, { size: "20px" })}
                  validation={{ required: "Our Reply is required" }}
                  register={activityRegister}
                  errors={activityError}
                  setValue={setValue}
                  onChange={(selectedOption) => {
                    setSelectedReplayLabel(selectedOption.value); // Ensure selectedReplay is updated correctly
                  }}
                />
              </div>
              <div className="col-span-12">
                <TextArea
                  id="notes"
                  iconLabel={icons.note}
                  label="Notes"
                  validation={{ required: false }}
                  register={activityRegister}
                  errors={activityError}
                  showStar={false}
                />
              </div>
              {communicationMode == 8 && (
                <>
                  <div className="col-span-12">
                    <SingleCheckbox
                      id="send_msg"
                      label="Send to WhatsApp"
                      register={activityRegister}
                      errors={activityError}
                      validation={{
                        required: false,
                      }}
                    />
                  </div>
                  <div className="col-span-12">
                    <FileInput
                      id="file_url"
                      label="File"
                      iconLabel={icons.filepin}
                      type="file"
                      register={activityRegister}
                      errors={activityError}
                      showStar={false}
                      validation={{
                        required: false,
                      }}
                    />
                  </div>
                </>
              )}
              {communicationMode == 5 && (
                <>
                  <div className="col-span-12">
                    <SingleCheckbox
                      id="send_msg"
                      label="Send to Mail"
                      register={activityRegister}
                      errors={activityError}
                      validation={{
                        required: false,
                      }}
                    />
                  </div>
                  <div className="col-span-12">
                    <FileInput
                      id="file_url"
                      label="File"
                      iconLabel={icons.filepin}
                      type="file"
                      register={activityRegister}
                      errors={activityError}
                      showStar={false}
                      validation={{
                        required: false,
                      }}
                    />
                  </div>
                </>
              )}

              {pipeStage == 3 && (
                <>
                  <div className="col-span-12">
                    <SingleCheckbox
                      id="editDimension"
                      label="Add Area Dimension Details"
                      register={activityRegister}
                      errors={activityError}
                      validation={{
                        required: false,
                      }}
                    />
                  </div>
                  {dimension && (
                    <>
                      <div className="col-span-12">
                        <label>Area Measurement</label>
                      </div>
                      <div className="col-span-12">
                        <div className="grid grid-cols-12 gap-2">
                          {["length", "width", "height"].map((id) => (
                            <div className="col-span-6" key={id}>
                              <FormInput
                                id={id}
                                label={id[0].toUpperCase() + id.slice(1)}
                                type="number"
                                iconLabel={icons[`${id}ScaleIcon`]}
                                register={activityRegister}
                                errors={activityError}
                              />
                            </div>
                          ))}
                          <div className="col-span-6">
                            <Select
                              options={unitList}
                              label="Unit"
                              id="unit"
                              placeholder="Select Unit"
                              iconLabel={icons.unit}
                              register={activityRegister}
                              errors={activityError}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="col-span-12 mt-3">
                    <GeoMap />
                  </div>
                </>
              )}
              {/* <div className="col-span-12">
                       <Select
                         options={employeeList}
                         label="Assignee"
                         id="assignee"
                         placeholder="Select Employee"
                         iconLabel={React.cloneElement(icons.referenceIcon, { size: 20 })}
                         register={register}
                         errors={errors}
                         showStar={false}
                         validation={{ required: false }}
                       />
                     </div> */}
            </div>

            <div className="flex gap-3 mt-3">
              <IconButton
                type="button"
                icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
                label="Cancel"
                className="px-4 py-2 btn_cancel"
                onClick={() => {
                  setActivityIsModal(false);
                  reset();
                }}
              />
              <IconButton
                type="submit"
                icon={React.cloneElement(icons.plusIcon, { size: "20px" })}
                label="Add Activity"
                className="px-4 py-2"
                loading={activityLoading}
              />
            </div>
          </form>
        )}
      </Modal>

      {/* VIEW MODAL */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        title={selectedData?.task_name || selectedData?.lead_leadid}
        size="l"
        showFooter={false}
        contentStyle={{ width: "100%" }}
      >
        <div>
          <Accordion items={accordionItem} singleOpen={false} />
        </div>
      </Modal>
      {isDeleteModalOpen && (
        <div className="delete-modal">
          <div className="modal-content-del darkCardBg">
            <div className="flex items-center justify-between">
              <h4>Confirm Delete</h4>
              <button className="modal-close" onClick={handleDeleteModalClose}>
                {" "}
                &times;
              </button>
            </div>
            <hr />
            <p className="pt-4">Are you sure you want to delete this item?</p>
            <div className="modal-actions justify-end">
              <button
                onClick={handleDeleteModalClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-danger"
                loading={loading}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
