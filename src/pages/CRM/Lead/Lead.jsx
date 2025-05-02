import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import { useNavigate } from "react-router";
import {
  getComplaintCategoryListEffect,
  getLeadListEffect,
  getLeadStageListEffect,
} from "../../../redux/CRM/lead/LeadEffects";
import { useDispatch, useSelector } from "react-redux";
import { createLeadActivityInprogress, getLeadListInProgress } from "../../../redux/CRM/lead/LeadActions";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import icons from "../../../contents/Icons";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { H4, H5 } from "../../../UI/Heading/Heading";
import Card from "../../../UI/Card/Card";
import Modal from "../../../UI/Modal/Modal";
import { Capitalize } from "../../../utils/ContentFormat";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Pagination from "../../../UI/AgGridTable/Pagination/Pagination";
import ActionDropdown from "../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import ExportButton from "../../../UI/AgGridTable/ExportBtn/ExportBtn";
import StatusManager from "../../../UI/StatusManager/StatusManager";
import DateRangePickerComponent from "../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent";
import "./Lead.css";
import { useForm } from "react-hook-form";
import { convertToIST, formatDateToYYYYMMDD } from "../../../utils/Date";
import ActionModal from "./Component/ActionModal";
import VerticalForm from "../../../UI/Form/VerticalForm";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { validationPatterns } from "../../../utils/Validation";
import ToggleSwitch from "../../../UI/Input/ToggleSwitch/ToggleSwitch";
import { quickUpdateLeadEffect } from "../../../redux/CRM/lead/LeadEffects";
import Select from "../../../UI/Select/SingleSelect";
import {
  getLeadSourceListEffect,
  createLeadActivityEffect,
  createLeadScheduleEffect,
} from "../../../redux/CRM/lead/LeadEffects";
import { getEmployeeListEffect } from "../../../redux/common/CommonEffects";
import { getUnitEffect } from "../../../redux/CRM/lead/LeadEffects";
import { arrOptForDropdown, getDefaultDateTime } from "../../../utils/Data";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import FileInput from "../../../UI/Input/FileInput/FileInput";
import SingleCheckbox from "../../../UI/Input/CheckBoxInput/SingleCheckbox";

import ProfileCircle from "../../../UI/ProfileCircle/ProfileCircle";
import { findFirstLetter, findSpecificIdDatas } from "../../../utils/Data";
import { images } from "../../../contents/Images";
import ViewHeadingContainer from "../Lead/Component/ViewHeadingContainer";
import IconWithInfo from "../Lead/Component/IconWithInfo";
import Product from "../../../assets/img/product";
import { referralList } from "../../../contents/DropdownList";
import UpcommingActivity from "../Lead/Component/UpcommingActivity";
import ActivityHistory from "../Lead/Component/ActivityHistory";
import { useLocation } from "react-router-dom";
import GeoMap from "../../../UI/GeoLocation/GeoMap/GeoMap";
import Loader from "../../../components/Loader/Loader";
import { getActivityQueryListEffect, getActivityReplayListEffect } from "../../../redux/common/CommonEffects";
import SearchableSelect from "../../../UI/Select/SearchableSelect";
import { DevTool } from "@hookform/devtools";
import RadioInput from "../../../UI/Input/RadioInput/RadioInput";
import AddComplaint from "../Complaint/AddComplaint";
import AddLeadTransfer from "../LeadTransfer/AddLeadTransfer";

export default function Lead() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.lead);
  const [toastData, setToastData] = useState({ show: false });
  const [leadList, setLeadList] = useState([]);
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
  const [leadDatas, setLeadDatas] = useState();
  const [isOpen, setIsOpen] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [closedType, setClosedType] = useState("");
  const [stageList, setStageList] = useState([]);
  const [selectedStage, setSelectedStage] = useState();
  const [stage, setStage] = useState("");
  const [clickedClosedType, setClickedClosedType] = useState("");
  const [isQuickViewModal, setIsQuickViewModal] = useState(false);
  const [isQuickEditModal, setIsQuickEditModal] = useState(false);
  const [isContact, setIsContact] = useState();
  const [isModalOpenActivity, setIsModalOpenActivity] = useState(false);
  const [isModalOpenComplaint, setIsModalOpenComplaint] = useState(false);
  const [isModalOpenTransfer, setIsModalOpenTransfer] = useState(false);
  const location = useLocation();
  const [employeeList, setEmployeeList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [primaryOption, setPrimaryOption] = useState("Enquiry");
  const [enquiryOption, setEnquiryOption] = useState("WhatsApp");
  const [isModalOpenMail, setIsModalOpenMail] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [unitList, setUnitList] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [leadSourceList, setLeadSourceList] = useState([]);
  const [nextleadSourceList, setNextLeadSourceList] = useState([]);

  const [communicationMode, setCommunicationMode] = useState();
  const [replyList, setReplyList] = useState([]);
  const [queryList, setQueryList] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null); // Track selected query
  const [selectedQueryLabel, setSelectedQueryLabel] = useState("");
  const [selectedReplayLabel, setSelectedReplayLabel] = useState("");

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
  }
    , []);




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
  }
    , []);

  // Filter replyList based on selected query
  const filteredReplyList = replyList.filter((reply) => {

    return reply.query_id === selectedQuery;
  });
  const [loading, setLoading] = useState(true); // Add loading state
  const [option, setOption] = useState([
    { label: "Quick View", action: "view", icon: icons.viewIcon },
    { label: "Quick Edit", action: "edit", icon: icons.pencil },
    { label: "Add Activity", action: "activity", icon: icons.note },
    { label: "Add Complaint", action: "complaint", icon: icons.quotationIcon },
    { label: "Lead Transfer", action: "transfer", icon: icons?.user },
  ])
  const currentLocations = useSelector(
    (state) => state?.common?.location?.location
  );
  const upcommingActivity = useSelector(
    (state) => state?.lead?.leadDetail?.upcomming
  );
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Lead" },
  ];
  useEffect(() => {
    if (location.state?.setIsModalOpenActivity) {
      setSelectedUser({ ...selectedUser, id: location.state?.id });
      setIsModalOpenActivity(true);
    }
  }, [location.state]);
  const {
    register: activityRegister,
    formState: { errors: activityError },
    handleSubmit: activityHandleSubmit,
    setValue: activitySetValue,
    watch: activityWatch,
    reset: activityReset,
    control: activityControl,
  } = useForm();

  const {
    register: complaintRegister,
    formState: { errors: complaintError },
    handleSubmit: complaintHandleSubmit,
    setValue: complaintSetValue,
    watch: complaintWatch,
    reset: complaintReset,
    control: complaintControl,
  } = useForm();
  const pipeStage = activityWatch("stages_id");
  const NextpipeStage = activityWatch("next_stages_id");
  const is_next_schedule = activityWatch("is_next_schedule");
  const dimension = activityWatch("editDimension");
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm({});

  useEffect(() => {
    getLeadList("Open");
    getStageList();
  }, [paginationPageSize, paginationCurrentPage]);

  const getStageList = async () => {
    let { data } = await getLeadStageListEffect();
    const formattedData = data.data.map((list) => ({
      label: list.name,
      value: list.id,
    }));
    setStageList(formattedData);
  };

  const handleLeadList = (data) => {
    setLeadDatas(data);
    setLeadList(data.data.data);
  };

  const options = [
    { label: "Quick View", action: "view", icon: icons.viewIcon },
    { label: "Quick Edit", action: "edit", icon: icons.pencil },
    { label: "Add Activity", action: "activity", icon: icons.note },
    // { label: "Add Quotation", action: "quotation", icon: icons.quotationIcon },
  ];
  const limitOptions = [
    { label: "Quick View", action: "view", icon: icons.viewIcon },
    // { label: "Quick Edit", action: "edit", icon: icons.pencil },
    // { label: "Add Activity", action: "activity", icon: icons.note },
    // { label: "Add Quotation", action: "quotation", icon: icons.quotationIcon },
  ];
  const Schedule = [
    { label: 'Yes', value: '1' },
    { label: 'No', value: '0' },
  ];
  useEffect(() => {
    if (pipeStage) {
      activitySetValue("next_stages_id", pipeStage);
    }
  }, [pipeStage, activitySetValue]);

  const handleAction = (action, e) => {
    const {
      uuid,
      lead_name: name,
      email,
      lead_contact: contactNumber,
      whatsapp_contact: whatsappNumber,
      last_followup: lastFollowup,
      incharge_name: incharge,
      stage_name: stage,
      lead_id: id,
      status,
      reference_type: reference_type
    } = e?.data || {};
    setSelectedUser(e?.data)

    if (action === "view" && uuid) {
      setIsQuickViewModal({
        isOpen: true,
        data: {
          uuid,
          name,
          email,
          contactNumber,
          whatsappNumber,
          lastFollowup,
          incharge,
          stage,
          id,
          status, reference_type
        },
      });
    } else if (action === "edit" && uuid) {
      setValue("name", e?.data?.lead_name);
      setValue("whatsapp_contact", e?.data?.whatsapp_contact || "");
      setValue("contact", e?.data?.lead_contact);
      setValue("email", e?.data?.email);
      setIsQuickEditModal({
        isOpen: true,
        data: { uuid, name, email, contactNumber, whatsappNumber },
      });
    } else if (action === "activity") {
      setIsModalOpenActivity(true);
      activitySetValue("date", getDefaultDateTime());
      activitySetValue("schedule_time", getDefaultDateTime(-1));

      activitySetValue("stages_id", 2);
      activitySetValue("send_msg", true);
    }
    else if (action === "complaint") {
      console.log("Add Complaint");
      setIsModalOpenComplaint(true);
      complaintSetValue("date", getDefaultDateTime());

      complaintSetValue("lead_id", uuid);
      // activitySetValue("schedule_time", getDefaultDateTime(-1));

      // activitySetValue("stages_id", 2);
      // activitySetValue("send_msg", true);
    }
    else if (action === "transfer") {
      setIsModalOpenTransfer(true);
    }
    else {

    }
  };
  useEffect(() => {
    if (pipeStage == 2) {
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
        // {
        //   label: "Message",
        //   value: 9,
        // },
      ];

      setLeadSourceList(payload);
      setCommunicationMode(5);
    } else if (pipeStage == 3) {
      const payload = [
        {
          label: "Direct",
          value: 6,
        },
      ];

      setLeadSourceList(payload);
      setCommunicationMode(6);
    } else if (pipeStage == 4) {
      const payload = [
        {
          label: "Email",
          value: 5,
        },

        {
          label: "WhatsApp",
          value: 8,
        },
        // {
        //   label: "Message",
        //   value: 9,
        // },
      ];

      setLeadSourceList(payload);
      setCommunicationMode(5);
    } else {
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
        // {
        //   label: "Message",
        //   value: 9,
        // },
      ];

      setLeadSourceList(payload);
      setCommunicationMode(5);
    }
  }, [pipeStage]);

  useEffect(() => {
    if (NextpipeStage == 2) {
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
        // {
        //   label: "Message",
        //   value: 9,
        // },
      ];

      setNextLeadSourceList(payload);
      // setCommunicationMode(5);
    } else if (NextpipeStage == 3) {
      const payload = [
        {
          label: "Direct",
          value: 6,
        },
      ];

      setNextLeadSourceList(payload);
      // setCommunicationMode(6);
    } else if (NextpipeStage == 4) {
      const payload = [
        {
          label: "Email",
          value: 5,
        },

        {
          label: "WhatsApp",
          value: 8,
        },
        // {
        //   label: "Message",
        //   value: 9,
        // },
      ];

      setNextLeadSourceList(payload);
      // setCommunicationMode(5);
    } else {
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
        // {
        //   label: "Message",
        //   value: 9,
        // },
      ];

      setNextLeadSourceList(payload);
      // setCommunicationMode(5);
    }
  }, [NextpipeStage]);

  const columnDefs = [
    // { headerName: 'Lead Id', field: 'lead_id', minWidth: 120, maxWidth: 120, unSortIcon: true },
    {
      headerName: "Name",
      unSortIcon: true,
      minWidth: 200,
      maxWidth: 200,
      cellRenderer: (params) => {
        const uuid = params.data.uuid;
        const leadId = params.data.lead_id || "";
        const leadName = params.data.lead_name || "";

        return (
          <div>
            <button
              className="text-blue underline"
              onClick={() =>
                navigate(`/user/crm/lead/detail-lead/${uuid}`, {
                  state: { leadId }, // Pass leadId in state
                })
              }
              title="View Lead Details"
            >
              {leadId} - {leadName}
            </button>
          </div>
        );
      },
    },

    {
      headerName: "Contact",
      field: "lead_contact",
      // minWidth: 200,
      // maxWidth: 200,
      unSortIcon: true,
    },

    {
      headerName: "Next Follow-up",
      field: "next_followup",
      // minWidth: 200,
      // maxWidth: 200,
      valueGetter: (params) => convertToIST(params.data.next_followup) || "",
      unSortIcon: true,
    },
    {
      headerName: "Last update Date",
      field: "next_followup",
      // minWidth: 200,
      // maxWidth: 200,
      // valueGetter: (params) => params.data.last_followup || "11-11-2024",
      valueGetter: (params) => {
        const dateString = params.data.last_followup || "2024-11-11";
        const date = new Date(dateString);

        if (isNaN(date)) {
          return dateString; // Return the original value if not a valid date
        }

        // Extract and format day, month, and year
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      },
      unSortIcon: true,
    },
    {
      headerName: "Over Due Days",
      field: "overdue_days",
      minWidth: 200,
      maxWidth: 200,
      unSortIcon: true,
      cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering
    },

    {
      headerName: "Incharge",
      field: "incharge_name",
      // minWidth: 200,
      // maxWidth: 200,

      unSortIcon: true,
    },
    {
      headerName: "Stages",
      field: "stage_name",
      // minWidth: 200,
      // maxWidth: 200,
      // unSortIcon: true,
      sortable: false,
      valueGetter: (params) => {
        if (params?.data?.is_closed) {
          if (params?.data?.is_closed_type == "won") {
            return "Won";
          } else {
            return "Lost";
          }
        } else {
          return params.data.stage_name || "Enquiry";
        }
        // Provide a default value if "stage_name" is not available
      },
      cellRenderer: (params) => {
        // Define a mapping of stage_name to status
        const statusMapping = {
          New: "success",
          Enquiry: "warning",
          Lost: "error",
          FollowUp: "inprogress",
          Quotation: "info",
        };

        // Get the appropriate status based on the stage_name
        const status = statusMapping[params.value] || "success"; // Default to "success" if not found

        return (
          <div className="flex items-center">
            <StatusManager status={status} message={params.value} />
          </div>
        );
      },
    },

    {
      headerName: "Action",
      field: "action",
      pinned: "right",
      minWidth: 100,
      maxWidth: 100,
      sortable: false,
      cellRenderer: (params) => (
        <div className="">
          <ActionDropdown
            options={params?.data?.is_closed ? limitOptions : option}
            onAction={(e) => handleAction(e, params)}
          />
        </div>
      ),
    },
  ];

  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
  };

  // date range filter
  const [dates, setDates] = useState({
    startDate: null,
    endDate: null,
  });
  const [focusedInput, setFocusedInput] = useState(null);
  const handleDatesChange = ({ startDate, endDate }) => {
    setDates(() => ({ ...dates, startDate, endDate }));
  };
  //search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value === "") {
      setPaginationCurrentPage(1);
      getLeadList();
    }
    // } else {
    //   handleFilterChange();
    // }
  };


  const handleFilterChange = () => {
    setPaginationCurrentPage(1);
    getLeadList();
  };
  const handleToggle = () => {
    const newIsWon = !isOpen;
    setIsOpen(newIsWon);
    const newFilter = newIsWon ? "Open" : "Closed";
    setActiveFilter(newFilter);
    getLeadList(newFilter, stage, clickedClosedType);
  };

  const filterMap = {
    Open: "open",
    Overdue: "overdue",
    Closed: "closed",
    All: "",
  };
  // Function to fetch lead list
  const getLeadList = async (filter, stage, clickedClosedType) => {
    setLoading(true); // Start loading before fetching
    const filterValue = filterMap[filter] || "";
    const { startDate, endDate } = dates;

    const data = {
      page: paginationCurrentPage,
      page_size: paginationPageSize,
      search: searchText,
      status: filterValue,
      stages: stage,
      closed_type: clickedClosedType || "",
      from: startDate ? formatDateToYYYYMMDD(startDate) : "",
      to: endDate ? formatDateToYYYYMMDD(endDate) : "",
    };

    dispatch(
      getLeadListInProgress({
        ...data,
        callback: (response) => {
          handleLeadList(response);
          setLoading(false); // Stop loading when data is received
        }
      })
    );
  };

  // const getLeadList = async (filter, stage, clickedClosedType) => {
  //   const filterValue = filterMap[filter] || "";
  //   const { startDate, endDate } = dates;
  //   const data = {
  //     page: paginationCurrentPage,
  //     page_size: paginationPageSize,
  //     search: searchText,
  //     status: filterValue,
  //     stages: stage,
  //     closed_type: clickedClosedType || "",
  //     from: startDate ? formatDateToYYYYMMDD(startDate) : "",
  //     to: endDate ? formatDateToYYYYMMDD(endDate) : "",
  //   };
  //   dispatch(getLeadListInProgress({ ...data, callback: handleLeadList }));
  // };
  useState(() => {
    getLeadList();
  }, [dates.startDate, dates.endDate, searchText]);

  // Pagination handlers
  const handlePageChange = (page) => {
    setPaginationCurrentPage(page);
    getLeadList();
  };

  const handlePageSizeChange = (pageSize) => {
    setPaginationPageSize(pageSize);
    setPaginationCurrentPage(1);
    getLeadList();
  };
  const handleChipClick = (filter) => {
    // setActiveFilter(filter.label);
    setPaginationCurrentPage(1);
    let newClosedType = "";
    if (filter.label === "Won" || filter.label === "Lost") {
      newClosedType = filter.label.toLowerCase();
    }
    setClosedType(newClosedType);
    getLeadList(filter.label, stage, newClosedType);
    setActiveFilter((prevFilter) => (prevFilter === filter.label ? null : filter.label));
  };

  const handleStageChange = (selectedOption) => {
    setSelectedStage(selectedOption?.target?.value);
    getLeadList("", selectedOption?.target?.value);
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      uuid: selectedUser?.uuid,
    };

    try {
      const result = await quickUpdateLeadEffect(payload);
      if (result.data.status === "success") {
        setToastData({
          show: true,
          type: "success",
          message: result?.data?.message,
        });
      }
    } catch (error) {
      setToastData({
        show: true,
        type: "error",
        message: error?.data?.message,
      });
    } finally {
      setIsQuickEditModal({ isOpen: false, data: null });
      reset();
      // <DetailsCall uuid ={leadData.uuid} />
      getLeadList();
    }
  };

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
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    activitySetValue("is_next_schedule", "0");
  }, []);

  const FeedbackForm = (
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
          setValue={activitySetValue}
          onChange={(selectedOption1) => {
            setSelectedQueryLabel(selectedOption1.label); // Store the label here
            setSelectedQuery(selectedOption1.value);
          }}
        />
      </div>
      <div className="col-span-12">
        <SearchableSelect
          options={filteredReplyList}
          id="content_reply"
          iconLabel={React.cloneElement(icons.replay, { size: "20px" })}
          label="Our Reply"
          validation={{ required: "Our Reply is required" }}
          register={activityRegister}
          errors={activityError}
          setValue={activitySetValue}
          onChange={(selectedOption) => {
            setSelectedReplayLabel(selectedOption.value);
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
          <div className="col-span-12 " >
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

      {stage == 3 && (
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
      <div className="col-span-12 mt-3">
        <RadioInput
          options={Schedule}
          label="Next Schedule"
          id="is_next_schedule"
          register={activityRegister}
          showStar={false}
          validation={{
            required: false,
          }}
          errors={activityError}
        />
      </div>
      {is_next_schedule === "1" && (
        <>
          <div className="col-span-12">
            <p className="font-semibold">Next Schedule Details</p>
          </div>
          <div className="col-span-12">
            <FormInput
              id="schedule_time"
              iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
              label="Date & Time"
              type="datetime-local"
              register={activityRegister}
              errors={activityError}
              showStar={false}
              validation={{ required: false }}
              min={getDefaultDateTime()}
            />
          </div>
          <div className="col-span-12">


            <Select
              options={stageList}
              label="Purpose"
              id="next_stages_id"
              register={activityRegister}
              errors={activityError}
              validation={{ required: "Purpose is required" }}
              placeholder="Select Stage"
              iconLabel={React.cloneElement(icons.tag, { size: 20 })}
            />
          </div>
          <div className="col-span-12">


            <Select
              options={nextleadSourceList}
              label="Mode of Communication"
              id="next_mode_communication"
              register={activityRegister}
              errors={errors}
              placeholder="Select Stage"
              iconLabel={React.cloneElement(icons.tag, { size: 20 })}
              showStar={false}
              validation={{ required: false }}
            />
          </div>
          <div className="col-span-12">
            <TextArea
              id="next_notes"
              iconLabel={icons.note}
              label="Notes"
              validation={{ required: false }}
              register={activityRegister}
              errors={activityError}
              showStar={false}
            />

            {/* <div className="mt-7">
                        {primaryOption !== "Field Visit" && (
                          <div className="chips-container flex gap-2 mb-4">
                            {(primaryOption === "Enquiry"
                              ? ["Call", "WhatsApp", "Mail", "Direct"]
                              : ["WhatsApp", "Mail"]
                            ).map((option) => (
                              <button
                                key={option}
                                type="button"
                                className={`chip ${enquiryOption === option ? "active" : ""}`}
                                onClick={() => setEnquiryOption(option)}>
                                {icons[option?.toLowerCase()]}
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div> */}
          </div>

        </>
      )}
    </div>
  );
  const FORM_CONFIG = {
    Enquiry: {
      Phone: FeedbackForm,
      WhatsApp: FeedbackForm,
      Email: FeedbackForm,
      Direct: FeedbackForm,
    },
    "Field Visit": [FeedbackForm],
    Quotation: {
      WhatsApp: [FeedbackForm],
      Email: [FeedbackForm],
    },
  };


  const renderForm = (primaryOption, enquiryOption) => {
    return Array.isArray(FORM_CONFIG[primaryOption])
      ? FORM_CONFIG[primaryOption]
      : FORM_CONFIG[primaryOption]?.[enquiryOption] || null;
  };
  const activityHandler = async (data) => {
    setActivityLoading(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "send_msg") {
        formData.append(key, value ? 1 : 0);
      } else if (key == "date") {
        formData.append(key, value.replace("T", " "));
      } else if (key == "schedule_time") {
        formData.append(key, value.replace("T", " "));
      } else if (key == "file_url") {
        if (value?.length > 0) {
          formData.append(key, value[0]); // Appending the file
        } else {
          formData.append(key, ""); // Appending the file
        }
      } else if (key == "notes") {
        formData.append(key, value || "");
      } else {
        formData.append(key, value);
      }
    });
    formData.append("mode_communication", communicationMode);
    formData.append("pipeline_id", data?.stages_id);
    formData.append("lead_id", selectedUser?.id);
    formData.append("is_schedule", 0);
    formData.append("customer_reply", selectedQuery || "");
    formData.append("content_reply", selectedReplayLabel || "");
    // if (data?.stages_id == 3) {
    //   formData.append("latitude", currentLocations[0]);
    //   formData.append("longitude", currentLocations[1]);
    // }
    try {
      const result = await createLeadActivityEffect(formData);
      if (result.data.status === "success") {
        setToastData({
          show: true,
          type: "success",
          message: result?.data?.message,
        });
        setIsModalOpenActivity(false);
      }
    } catch (error) {
      setToastData({
        show: true,
        type: "error",
        message: error?.data?.message,
      });
    } finally {
      setActivityLoading(false);
      setIsModalOpenActivity(false);
      reset();
      // <DetailsCall uuid ={leadData.uuid} />
      const payloads = {
        uuid: leadDatas.uuid,
        stages: "",
        is_schedule: 0,
        customer_reply: selectedQuery,
        content_reply: selectedReplayLabel,
      };
      getLeadList()
    }

  };
  const [leadDetail, setLeadDetail] = useState();
  const leadDetails = useSelector((state) => state?.lead?.leadDetail?.data);

  const [refenece, setReference] = useState();
  useEffect(() => {
    setLeadDetail(leadDetails);
    getReference();
  }, [leadDetails]);
  const getReference = () => {
    if (leadDetails?.reference_type) {
      const selectedLead = findSpecificIdDatas(
        referralList,
        leadDetails?.reference_type
      );
      setReference(selectedLead?.label);
    } else {
      setReference("No");
    }
  };

  const handleClearFilters = () => {
    setSearchText('')
    setActiveFilter("Open");
    setSelectedStage(null);
    setIsOpen(true);
    getLeadList("Open");
  };

  const handleModalClose = () => {
    setIsModalOpenTransfer(false); 
    setIsModalOpenComplaint(false);
    getLeadList();
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
      <div className="chips-container flex justify-between px-4 py-3 ">
        <div className="flex gap-2">
          {[
            {
              label: "Won",
              icon: React.cloneElement(icons.trophy, { size: 20 }),
            },
            {
              label: "Lost",
              icon: React.cloneElement(icons.thumbDown, { size: 20 }),
            },
            {
              label: "Overdue",
              icon: React.cloneElement(icons.overdue, { size: 20 }),
            },
            {
              label: "All",
              icon: React.cloneElement(icons.alllist, { size: 20 }),
            },
          ].map((filter) => (
            <button
              key={filter.label}
              className={`flex items-center px-3 py-0 rounded transition border border-solid 
              ${activeFilter === filter.label
                  ? "bg-[var(--primary-color)] text-white border-[var(--primary-color)]"
                  : "border-[var(--primary-color)] text-[color-mix(in_srgb,var(--primary-color)_100%,black)] bg-[color-mix(in_srgb,var(--primary-color)_15%,transparent)]"
                }`}
              onClick={() => handleChipClick(filter)}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
          <div className="">
            <select className="chips" onChange={handleStageChange}>
              {stageList.map((list) => (
                <option
                  className="darkCardBg"
                  key={list.value}
                  value={list.value}
                >
                  {list.label}
                </option>
              ))}
            </select>
          </div>
          <div className="toggle-container">
            <div
              onClick={handleToggle}
              className={`toggle-switch ${isOpen ? "bg-blue-500" : "bg-gray-400"
                }`}
            >
              <span
                className={`toggle-label ${isOpen ? "opacity-100" : "opacity-0"
                  }`}
              >
                Open
              </span>
              <span
                className={`toggle-label ${isOpen ? "opacity-0" : "opacity-100"
                  }`}
              >
                Closed
              </span>
              <div
                className={`toggle-button ${isOpen ? "translate-x-8" : "translate-x-0"
                  }`}
              ></div>
            </div>
          </div>
        </div>
        <div>
          <button
            className="chips text-white px-1 py-1 rounded transition float-end gap-2"
            onClick={handleClearFilters}
          >
            <span>{icons.clear}</span> Clear Filters
          </button>
        </div>
      </div>
      <div className="bg-white py-3 rounded-lg darkCardBg">
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
                  onClick={handleFilterChange}
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
                label="Add Lead"
                icon={icons.plusIcon}
                onClick={() => {
                  navigate("/user/crm/lead/create-lead");
                }}
              />
            </div>
            <div>
              <ExportButton
                label="Export"
                data={leadList.map(({
                  lead_id,
                  lead_name,
                  lead_contact,
                  district_name,
                  p_village_town, // Assuming taluk is stored in p_village_town
                  address,
                  incharge_name,
                  stage_name,
                  overdue_days,
                  next_followup
                }) => ({
                  Lead_ID: lead_id,
                  Name: lead_name,
                  Contact: lead_contact,
                  District: district_name,
                  Taluk: p_village_town,
                  Address: address,
                  Incharge: incharge_name,
                  Stage: stage_name,
                  Overdue_Date: overdue_days,
                  Next_Update_Date: next_followup
                }))}
                filename="Lead_List"
              />
            </div>
          </div>
        </div>
      </div>
      {leadList.length > 0 ? (
        <>
          <ReusableAgGrid
            key={columnDefs.length}
            rowData={leadList}
            columnDefs={columnDefs}
            defaultColDef={{ resizable: false }}
            onGridReady={(params) => params.api.sizeColumnsToFit()}
            pagination={false}
            showCheckbox={false}
          />
          <Pagination
            currentPage={paginationCurrentPage}
            totalPages={leadDatas?.data?.last_page || 1}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            startItem={leadDatas?.data?.from || 0}
            endItem={leadDatas?.data?.to || 0}
            totalItems={leadDatas?.data?.total || 0}
          />
        </>
      ) : leadList.length === 0 && !loading ? (
        <div className="flex justify-center items-center h-40 text-gray-500 text-lg font-semibold">
          No Data Found
        </div>
      ) : (
        <Loader />
      )}
      {/* quickedit */}
      <Modal
        isOpen={isQuickEditModal?.isOpen}
        onClose={() => setIsQuickEditModal({ isOpen: false, data: null })}
        title="Quick Edit"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-6">
              <FormInput
                label="Name"
                id="name"
                iconLabel={icons.name}
                placeholder="Lead Name"
                register={register}
                validation={{
                  required: "Lead name is required",
                  pattern: {
                    value: validationPatterns.textOnly,
                    message: "Provide Valid Name",
                  },
                }}
                errors={errors}
              />
            </div>

            <div className="col-span-6">
              <FormInput
                label="Email"
                iconLabel={icons.mail}
                id="email"
                placeholder="Enter your email id"
                register={register}
                validation={{
                  required: false,
                }}
                showStar={false}
                errors={errors}
              />
            </div>
            <div className="col-span-6">
              <FormInput
                label="Contact"
                id="contact"
                iconLabel={icons.call}
                placeholder="Contact Number"
                register={register}
                validation={{
                  required: "Contact is required",
                  pattern: {
                    value: validationPatterns.contactNumber,
                    message: "Provide Valid Contact Number",
                  },
                }}
                errors={errors}
              />
            </div>
            <div className="col-span-6">
              <SingleCheckbox
                id="is_contact"
                label="Same as WhatsApp Number"
                register={register}
                errors={errors}
                validation={{
                  required: false,
                }}
              />
            </div>
            <div className="col-span-6">
              <FormInput
                label="WhatsApp"
                iconLabel={icons.whatsapp}
                id="whatsapp_contact"
                placeholder="Enter your WhatsApp Number"
                register={register}
                errors={errors}
                validation={{
                  required: false,
                }}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <IconButton
              label="Cancel"
              icon={icons.cancelIcon}
              type="button"
              className="btn_cancel"
              onClick={() => setIsQuickEditModal({ isOpen: false, data: null })}
            />
            <IconButton label="Update" icon={icons.saveIcon} type="submit" />
          </div>
        </form>
      </Modal>
      {/*quick view*/}
      <Modal
        isOpen={isQuickViewModal?.isOpen}
        onClose={() => setIsQuickViewModal({ isOpen: false, data: null })}
        title="Quick View"
        showHeader
        size="m"
        showFooter={false}
      >
        <div className="p-1 pt-4">
          <div className="profile__container flex gap-2 items-start">
            <div className="flex gap-2 items-center grow">
              <ProfileCircle
                letter={findFirstLetter(isQuickViewModal?.data?.name, 2)}
                bgColor={"#fff3c4"}
              />
              <div className="flex items-start">
                <div className="flex flex-col">
                  <a
                    href={`/user/crm/lead/detail-lead/${isQuickViewModal?.data?.uuid}`}
                    className="top-clr underline text-lg capitalize font-semibold"
                  >
                    {isQuickViewModal?.data?.name || "Ram"}
                  </a>
                  <span className="text-gray-700 ">
                    {" "}
                    #{isQuickViewModal?.data?.id}
                  </span>
                </div>
                <img src={images?.goldShield} alt="badge" />
              </div>
            </div>
            <div className="flex flex-col justify-end items-end gap-3">
              <div className="flex gap-2 items-center">
                <span className="top-clr">
                  {React.cloneElement(icons?.call, { size: 18 })}
                </span>
                <a
                  href={`tel:${isQuickViewModal?.data?.contactNumber}`}
                  className="text-black-900 hover:underline"
                >
                  {isQuickViewModal?.data?.contactNumber}
                </a>
              </div>
            </div>
          </div>
          <div className="contact__container mt-7">
            <ViewHeadingContainer title="Contact Details" editIcon={false} />
            <div className=" pt-2">
              <IconWithInfo
                icon={React.cloneElement(icons?.email, { size: 18 })}
                iconClassName="top-clr w-10 h-10 "
                iconBgClass="bg-white-400"
                label="Email "
                contentConClass="flex-col"
                info={isQuickViewModal?.data?.email || ""}
              />
              {/* <IconWithInfo
              icon={React.cloneElement(icons?.phone, { size: 24 })}
              iconClassName="top-clr bg-white-400 w-15 h-15 "
              label="Phone Number"
              iconBgClass ="bg-white-400"

              contentConClass="flex-col"
              info={isQuickViewModal?.data?.contactNumber || ""}
            /> */}
              <IconWithInfo
                icon={React.cloneElement(icons?.whatsapp, { size: 18 })}
                iconClassName="top-clr bg-white-400 w-10 h-10 "
                label="WhatsApp"
                iconBgClass="bg-white-400"
                contentConClass="flex-col"
                info={isQuickViewModal?.data?.whatsappNumber || ""}
              />
            </div>
          </div>
          <div className="reference__container">
            <div className="">
              <IconWithInfo
                icon={React.cloneElement(icons?.user, { size: 18 })}
                iconClassName="top-clr bg-white-400 w-10"
                label={
                  <div>
                    <span>Incharge </span>{" "}
                    <span className="top-clr">
                      {isQuickViewModal?.data?.incharge || "No"}
                    </span>
                  </div>
                }
                // className="px-1 py-0"
                contentConClass="flex-col"
                iconBgClass="bg-white-400"
              />
              <IconWithInfo
                icon={React.cloneElement(icons?.referenceIcon, { size: 18 })}
                iconClassName="top-clr bg-white-400 w-10 "
                label={
                  <div>
                    <span>Referred : </span>
                    <span className="top-clr">{isQuickViewModal?.data?.reference_type || "No"}</span>
                  </div>
                }
                info={
                  isQuickViewModal?.data?.referalemployeename ||
                  isQuickViewModal?.data?.referalplatform ||
                  ""
                }
                // className="px-1 py-0"
                contentConClass="flex-col"
                iconBgClass="bg-white-400"
              />
            </div>
          </div>
          {/*  */}
          <div className="py-3">
            <UpcommingActivity
              events={upcommingActivity?.length ? [upcommingActivity[0]] : []}
            />
            <ActivityHistory showOnlyFirst={true} />
          </div>
        </div>
      </Modal>
      {/* Activity Modal */}
      <Modal
        isOpen={isModalOpenActivity}
        onClose={() => setIsModalOpenActivity(false)}
        title="Add Activity"
        showHeader
        size="m"
        showFooter={false}
      >
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
            validation={{ required: "Purpose is required" }}
            placeholder="Select Stage"
            iconLabel={React.cloneElement(icons.tag, { size: 20 })}
          />
          <div className="flex my-4 gap-3">
            {leadSourceList.map((option) => (
              <button
                key={option?.value}
                className={`chip ${communicationMode == option?.value ? "active" : ""
                  } `}
                onClick={() => setCommunicationMode(option?.value)}
                type="button"
              >
                {icons[option?.label.toLowerCase()]}
                {option?.label}
              </button>
            ))}
          </div>


          {renderForm(
            findSpecificIdDatas(stageList, Number(pipeStage))?.label,
            findSpecificIdDatas(sourceList, communicationMode)?.label
          )}


          <div className="flex gap-3 mt-3">
            <IconButton
              type="button"
              icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
              onClick={() => {
                // setIsModalOpenWhatsapp(false);
                reset();
              }}
            // disabled={whatsappLoading}
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
      </Modal>
      <AddComplaint
        itemModal={isModalOpenComplaint} // Pass modal open state
        setItemModal={setIsModalOpenComplaint} // Pass function to control modal visibility
        onClose={handleModalClose}
        lead_uuid={selectedUser?.id}
        setToastData={setToastData}
      />
      <AddLeadTransfer
        itemModal={isModalOpenTransfer}
        setItemModal={setIsModalOpenTransfer}
        onClose={handleModalClose}
        lead_uuid={selectedUser?.uuid}
        setToastData={setToastData}
      />
      {/* <Modal
        isOpen={isModalOpenComplaint}
        onClose={() => setIsModalOpenComplaint(false)}
        title="Add Complaint"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={complaintHandleSubmit(activityHandler)}>
          <FormInput
            id="date"
            iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
            label="Date & Time"
            type="datetime-local"
            register={complaintRegister}
            errors={complaintError}
            validation={{ required: "Date is required" }}
            defaultValue={new Date().toISOString().slice(0, 16)}
            // showStar={false}
            min={getDefaultDateTime()}
          />
          <Select
            options={leadCompCategoryrList}
            // options={
            //   [
            //     { label: "High", value: "high" },
            //     { label: "Medium", value: "medium" },
            //     { label: "Low", value: "low" },

            //   ]
            // }
            label="Complaint category"
            id="comp_category"
            register={complaintRegister}
            errors={complaintError}
            validation={{ required: "category is required" }}
            placeholder="Select category"
          // iconLabel={React.cloneElement(icons.tag, { size: 20 })}
          />

          <Select
            options={
              [
                { label: "High", value: "high" },
                { label: "Medium", value: "medium" },
                { label: "Low", value: "low" },

              ]
            }
            label="Priority"
            id="comp_priority"
            register={complaintRegister}
            errors={complaintError}
            validation={{ required: "Priority is required" }}
            placeholder="Select Priority"
            iconLabel={React.cloneElement(icons.tag, { size: 20 })}
          />

          <TextArea
            id="comp_details"
            iconLabel={icons?.note}
            label="Complaint Details"
            register={complaintRegister}
            errors={complaintError}
            showStar={false}
            showIcon={true}
            defaultValue={complaintWatch("comp_details")}
            validation={{ required: false }}
          />
          <input type="hidden" id="lead_id" />

          <div className="flex gap-3 mt-3">
            <IconButton
              type="button"
              icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
              onClick={() => {
                reset();
                setIsModalOpenComplaint(false);
              }}
            />
            <IconButton
              type="submit"
              icon={React.cloneElement(icons.plusIcon, { size: "20px" })}
              label="Add Complaint"
              className="px-4 py-2"
              loading={setComplaintLoading}
            />
          </div>
        </form>
      </Modal> */}
    </>
  );
}
