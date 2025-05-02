import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import { useNavigate } from "react-router";
import {
  getLeadListEffect,
  getLeadStageListEffect,
} from "../../../redux/CRM/lead/LeadEffects";
import { useDispatch, useSelector } from "react-redux";
import { getLeadListInProgress, } from "../../../redux/CRM/lead/LeadActions";
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
import { convertToIST, formatDateToYYYYMMDD } from "../../../utils/Date"
import ActionModal from "./Component/ActionModal";
import VerticalForm from "../../../UI/Form/VerticalForm";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { validationPatterns } from "../../../utils/Validation";
import ToggleSwitch from "../../../UI/Input/ToggleSwitch/ToggleSwitch";
import { quickUpdateLeadEffect } from '../../../redux/CRM/lead/LeadEffects'
///
import Select from "../../../UI/Select/SingleSelect";
import {
  getLeadSourceListEffect,
  createLeadActivityEffect,
  createLeadScheduleEffect,
} from "../../../redux/CRM/lead/LeadEffects";
import { getEmployeeListEffect } from "../../../redux/common/CommonEffects";
import { getUnitEffect } from "../../../redux/Utils/Unit/UnitEffect";
import { arrOptForDropdown } from "../../../utils/Data";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import FileInput from "../../../UI/Input/FileInput/FileInput";
import SingleCheckbox from "../../../UI/Input/CheckBoxInput/SingleCheckbox";


import ProfileCircle from "../../../UI/ProfileCircle/ProfileCircle"
import { findFirstLetter, findSpecificIdDatas } from "../../../utils/Data";
import { images } from "../../../contents/Images"
import ViewHeadingContainer from "../Lead/Component/ViewHeadingContainer";
import IconWithInfo from '../Lead/Component/IconWithInfo'
import Product from "../../../assets/img/product";
import { referralList } from "../../../contents/DropdownList";
import UpcommingActivity from "../Lead/Component/UpcommingActivity";
import ActivityHistory from "../Lead/Component/ActivityHistory";
import { useLocation } from 'react-router-dom';
export default function Lead() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.lead);
  const [toastData, setToastData] = useState({ show: false });
  const [leadList, setLeadList] = useState([]);
  const [paginationPageSize, setPaginationPageSize] = useState(10); // Default page size
  const [paginationCurrentPage, setPaginationCurrentPage] = useState(1); // Initial current page
  const [leadDatas, setLeadDatas] = useState();
  const [isOpen, setIsOpen] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState(" ");
  const [closedType, setClosedType] = useState("");
  const [stageList, setStageList] = useState([]);
  const [selectedStage, setSelectedStage] = useState();
  const [stage, setStage] = useState('');
  const [clickedClosedType, setClickedClosedType] = useState('');
  const [isQuickViewModal, setIsQuickViewModal] = useState(false)
  const [isQuickEditModal, setIsQuickEditModal] = useState(false)
  const [isContact, setIsContact] = useState();
  //
  const [isModalOpenActivity, setIsModalOpenActivity] = useState(false);
  const location = useLocation();
  const [employeeList, setEmployeeList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [primaryOption, setPrimaryOption] = useState("Enquiry");
  const [enquiryOption, setEnquiryOption] = useState("WhatsApp");
  const [isModalOpenMail, setIsModalOpenMail] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [unitList, setUnitList] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const upcommingActivity = useSelector(
    (state) => state?.lead?.leadDetail?.upcomming
  );
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Lead" },
  ];
  // useEffect(() => {
  //   if (location.state?.setIsModalOpenActivity) {
  //     setIsModalOpenActivity(true);
  //   }
  // }, [location.state]);
  const {
    register: activityRegister,
    formState: { errors: activityError },
    handleSubmit: activityHandleSubmit,
    reset: activityReset,
  } = useForm();
  const { register, formState: { errors }, handleSubmit, setValue, reset } = useForm({});

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

  const option = [
    { label: "Quick View", action: "view", icon: icons.viewIcon },
    { label: "Quick Edit", action: "edit", icon: icons.pencil },
    { label: "Add Activity", action: "activity", icon: icons.note },
    { label: "Add Quotation", action: "quotation", icon: icons.quotationIcon },
  ];

  const handleAction = (action, e) => {
    setSelectedUser(e.data)
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
    } = e?.data || {};

    if (action === "view" && uuid) {
      setIsQuickViewModal({
        isOpen: true,
        data: { uuid, name, email, contactNumber, whatsappNumber, lastFollowup, incharge, stage, id, status },
      });
    } else if (action === "edit" && uuid) {
      setValue("name", e?.data?.lead_name)
      setValue("whatsapp", e?.data?.whatsapp_contact || "")
      setValue("contact", e?.data?.lead_contact)
      setValue("email", e?.data?.email)
      setIsQuickEditModal({
        isOpen: true,
        data: { uuid, name, email, contactNumber, whatsappNumber },
      });
    } else if (action === "activity") {
      setIsModalOpenActivity(true)
    } else {
      
    }
  };

  const columnDefs = [
    // { headerName: 'Lead Id', field: 'lead_id', minWidth: 120, maxWidth: 120, unSortIcon: true },
    {
      headerName: "Name",
      // minWidth: 450,
      //  maxWidth: 450,
      unSortIcon: true,
      cellRenderer: (params) => {
        const uuid = params.data.uuid;
        const leadName = params.data.lead_name || "";
        const leadId = params.data.lead_id || "";
        return (
          <div>
            <button
              className="text-blue underline"
              onClick={() => navigate(`/user/crm/lead/detail-lead/${uuid}`)} // Use uuid for navigation
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
      valueGetter: (params) => convertToIST(params.data.next_followup)|| "",
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
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      },
      unSortIcon: true,
    },
    // {
    //   headerName: "Over Due Days",
    //   field: "overdue_days",
    //   minWidth: 200,
    //   maxWidth: 200,
    //   unSortIcon: true,

    // },
    // {
    //   headerName: "Next follow-up",
    //   field: "next_followupby",
    //   minWidth: 230,
    //   maxWidth: 230,
    //   unSortIcon: true,
    //   cellRenderer: (params) => {
    //     if(params?.data?.stage_id ==1){
    //       return `${params?.data?.stage_name} - ${params?.data?.incharge_name}`
    //     }else{
    //       return `${params?.data?.stage_name} - ${params?.data?.incharge_name}`

    //     }

    //   },
    // },
    // {
    //   headerName: "Incharge Name",
    //   field: "incharge_name",
    //   minWidth: 200,
    //   maxWidth: 200,
    //   unSortIcon: true,
    //   cellRenderer: (params) => {
    //     const apiDate = params.value;
    //     const defaultDate = "Manager";
    //     return apiDate || defaultDate;
    //   },
    // },
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
        if(params?.data?.is_closed){
          if(params?.data?.is_closed_type =="won"){
            return "Won"
          }else{
            return "Lost"
          }
        }else{

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
      // pinned: "right",
      // minWidth: 250,
      // maxWidth: 250,
      sortable: false,
      cellRenderer: (params) => (
        <div className="">
          <ActionDropdown options={option} onAction={(e) => handleAction(e, params)} />
          {/* <ActionModal /> */}
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
  const handleSearchChange = (e) => setSearchText(e.target.value);

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
    const filterValue = filterMap[filter] || "";
    const { startDate, endDate } = dates;
    const data = {
      page: paginationCurrentPage,
      page_size: paginationPageSize,
      search: searchText,
      status: filterValue,
      stages: stage,
      closed_type: clickedClosedType || '',
      from: startDate ? formatDateToYYYYMMDD(startDate) : '',
      to: endDate ? formatDateToYYYYMMDD(endDate) : '',
    };
    dispatch(getLeadListInProgress({ ...data, callback: handleLeadList }));
  };
  useState(() => {
    getLeadList()
  }, [dates.startDate, dates.endDate])

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
    setActiveFilter(filter.label);
    setPaginationCurrentPage(1);
    // Only update `closedType` for "Won" or "Lost"
    let newClosedType = "";
    if (filter.label === "Won" || filter.label === "Lost") {
      newClosedType = filter.label.toLowerCase();
    }
    setClosedType(newClosedType);
    getLeadList(filter.label, stage, newClosedType);
  };

  const handleStageChange = (selectedOption) => {
    setSelectedStage(selectedOption?.target?.value);
    getLeadList('', selectedOption?.target?.value)
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      uuid: selectedUser?.uuid
    }

    try {
      const result = await quickUpdateLeadEffect(payload);
      if (result.data.status === "success") {
        setToastData({
          show: true,
          type: result?.data?.status,
          message: result?.data?.message,
        });
      }
    } catch (error) {
      setToastData({
        show: true,
        type: error?.data?.status,
        message: error?.data?.message,
      });
    } finally {
      setIsQuickEditModal({ isOpen: false, data: null }); reset();
      // <DetailsCall uuid ={leadData.uuid} />
      getLeadList()

    };
  }

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

  const FeedbackForm = (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-12">
        <TextArea
          id="customer_reply"
          iconLabel={icons.textarea}
          label="Lead Insights / Inquiries"
          validation={{ required: "Customer Feedback is required" }}
          register={activityRegister}
          errors={activityError}
        />
      </div>
      <div className="col-span-12">
        <TextArea
          id="content_reply"
          iconLabel={icons.replay}
          label="Reply"
          validation={{ required: "Reply is required" }}
          register={activityRegister}
          errors={activityError}
        />
      </div>
      <div className="col-span-12">
        <TextArea
          id="notes"
          iconLabel={icons.note}
          label="Notes"
          validation={{ required: "Notes is required" }}
          register={activityRegister}
          errors={activityError}
        />
      </div>
      <div className="col-span-12">
        <FormInput
          id="schedule_time"
          iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
          label="Date & Time"
          type="datetime-local"
          register={activityRegister}
          errors={activityError}
          validation={{ required: "Schedule Date & Time is required" }}
        />
      </div>
      <div className="col-span-12">
        <Select
          options={employeeList}
          label="Assignee"
          id="assignee"
          placeholder="Select Employee"
          iconLabel={React.cloneElement(icons.referenceIcon, { size: 20 })}
          register={activityRegister}
          errors={activityError}
          validation={{ required: "Assignee is required" }}
        />
      </div>
    </div>
  );

  const FORM_CONFIG = {
    Enquiry: {
      Call: FeedbackForm,
      WhatsApp: FeedbackForm,
      Mail: FeedbackForm,
      Direct: FeedbackForm,
    },
    "Field Visit": [
      FeedbackForm,
      <label>Area Measurement</label>,
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
      </div>,
    ],
    Quotation: {
      WhatsApp: [
        FeedbackForm,
        <FileInput
          id="file_url"
          label="File"
          iconLabel={icons.filepin}
          type="file"
          register={activityRegister}
          errors={activityError}
        />,
      ],
      Mail: [
        FeedbackForm,
        <FileInput
          id="file"
          label="file_url"
          type="file"
          iconLabel={icons.filepin}
          register={activityRegister}
          errors={activityError}
        />,
      ],
    },
  };

  const renderForm = (primaryOption, enquiryOption) =>
    Array.isArray(FORM_CONFIG[primaryOption])
      ? FORM_CONFIG[primaryOption]
      : FORM_CONFIG[primaryOption]?.[enquiryOption] || null;
  const activityHandler = async (data) => {
    setActivityLoading(true);
    const pipeline = stageList.find((list) => list?.label === primaryOption);
    const modeCommunication = sourceList.find(
      (list) => list?.label === enquiryOption
    );

    const payload = {
      lead_id: leadDatas?.id,
      pipeline_id: pipeline ? pipeline.value : null, // Ensure we get the correct value or null
      mode_communication: modeCommunication ? modeCommunication.value : null, // Ensure we get the correct value or null
      ...data,
      is_schedule: 0
    };

    try {
      const result = await createLeadActivityEffect(payload);
      if (result.data.status === "success") {
        setToastData({
          show: true,
          type: result?.data?.status,
          message: result?.data?.message,
        });
      }
    } catch (error) {
      setToastData({
        show: true,
        type: error?.data?.status,
        message: error?.data?.message,
      });
    } finally {
      setActivityLoading(false);
      setIsModalOpenActivity(false);
      activityReset(); // Reset the form after successful submission
    }
  };
  const [leadDetail, setLeadDetail] = useState();
  const leadDetails = useSelector((state) => state?.lead?.leadDetail?.data);

  const [refenece, setReference] = useState()
  useEffect(() => {
    setLeadDetail(leadDetails);
    getReference()
  }, [leadDetails]);
  const getReference = () => {
    if (leadDetails?.reference_type) {
      const selectedLead = findSpecificIdDatas(referralList, leadDetails?.reference_type)
      setReference(selectedLead?.label)
    } else {
      setReference("No")
    }
  }

  const handleClearFilters = () => {
    setActiveFilter("Open");
    setSelectedStage(null);
    setIsOpen(true);
    getLeadList("Open")
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
              { label: "Won", icon: icons.trophy },
              { label: "Lost", icon: icons.lost },
              { label: "Overdue", icon: icons.overdue },
              { label: "All", icon: icons.alllist },
            ].map((filter) => (
              <button
                key={filter}
                className={`chips ${activeFilter === filter ? "active" : ""}`}
                onClick={() => handleChipClick(filter)}
              >
                <span className="mr-2">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
            {/* Stages */}
            <div className="">
              <select className="chips" onChange={handleStageChange}>
                {stageList.map((list) => (
                  <option className="darkCardBg" key={list.value} value={list.value}>
                    {list.label}
                  </option>
                ))}
              </select>
            </div>
            {/* open/close toogle */}
            <div className="toggle-container">
              <div
                onClick={handleToggle}
                className={`toggle-switch ${isOpen ? "bg-blue-500" : "bg-gray-400"
                  }`}
              >
                <span
                  className={`toggle-label ${isOpen ? "opacity-100" : "opacity-0"}`}
                >
                  Open
                </span>
                <span
                  className={`toggle-label ${isOpen ? "opacity-0" : "opacity-100"}`}
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
              onClick={handleClearFilters}>
              <span>{icons.clear}</span> Clear Filters
            </button>
          </div></div>
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
            <div>
              <DateRangePickerComponent
                className="darkCardBg"
                startDate={dates.startDate}
                endDate={dates.endDate}
                onDatesChange={handleDatesChange}
                focusedInput={focusedInput}
                onFocusChange={setFocusedInput}
              />
            </div>
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
              <ExportButton label="Export" data={leadList} filename="Lead List" />
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
      ) : (<div className="no-data-message text-center mt-2">No Data Found</div>)}


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
                id="whatsapp"
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

            <IconButton label="Cancel" icon={icons.cancelIcon} type="button" className="btn_cancel" onClick={() => setIsQuickEditModal({ isOpen: false, data: null })} />
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
              <ProfileCircle letter={findFirstLetter(isQuickViewModal?.data?.name, 2)}
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
                  <span className="text-gray-700 "> #{isQuickViewModal?.data?.id}</span>
                </div>
                <img src={images?.goldShield} alt="badge" />
              </div>
            </div>
            <div className="flex flex-col justify-end items-end gap-3">
              <div className="flex gap-2 items-center">
                <span className="top-clr">{React.cloneElement(icons?.call, { size: 18 })}</span>
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
            <ViewHeadingContainer
              title="Contact Details"
              editIcon={false}
            />
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
                label={<div><span>Incharge  </span> <span className="top-clr">{isQuickViewModal?.data?.incharge || "No"}</span></div>}
                // className="px-1 py-0"
                contentConClass="flex-col"
                iconBgClass="bg-white-400"

              />
              <IconWithInfo
                icon={React.cloneElement(icons?.referenceIcon, { size: 18 })}
                iconClassName="top-clr bg-white-400 w-10 "
                label={<div><span>Referred : </span><span className="top-clr">{refenece || "No"}</span></div>}
                info={isQuickViewModal?.data?.referalemployeename || isQuickViewModal?.data?.referalplatform || ""}
                // className="px-1 py-0"
                contentConClass="flex-col"
                iconBgClass="bg-white-400"

              />
            </div>
          </div>
          {/*  */}
          <div className="py-3">
            <UpcommingActivity events={upcommingActivity?.length ? [upcommingActivity[0]] : []} />
            <ActivityHistory showOnlyFirst={true} />
          </div>
        </div>
        {/* <div className="py-6 px-3">
          <div className="grid grid-cols-2 gap-y-1 items-center">
            <div>
              <label>{icons.name}Lead Name:</label>
            </div>
            <div>
              <a
                href={`/user/crm/lead/detail-lead/${isQuickViewModal?.data?.uuid}`}
                className="text-blue-600 hover:underline"
              >
                {isQuickViewModal?.data?.name || "Ram"}
              </a>
            </div>

            <div>
              <label># Lead ID:</label>
            </div>
            <div>
              <span>{isQuickViewModal?.data?.id || "LD002"}</span>
            </div>

            <div>
              <label>{icons.mail}Email:</label>
            </div>
            <div>
              <span>{isQuickViewModal?.data?.email || "ram@gmail.com"}</span>
            </div>

            <div>
              <label>{icons.call}Contact Number:</label>
            </div>
            <div>
              <span>{isQuickViewModal?.data?.contactNumber || "9483737221"}</span>
            </div>

            <div>
              <label>{icons.whatsapp}WhatsApp Number:</label>
            </div>
            <div>
              <span>{isQuickViewModal?.data?.whatsappNumber || "9483737221"}</span>
            </div>

            <div>
              <label>{icons.lastupdate}Last Follow-Up:</label>
            </div>
            <div>
              <span>{isQuickViewModal?.data?.lastFollowup || "No Follow-Up Details"}</span>
            </div>

            <div>
              <label>{icons.incharge}Incharge:</label>
            </div>
            <div>
              <span>{isQuickViewModal?.data?.incharge || "Manager"}</span>
            </div>

            <div>
              <label>{icons.tag} Status:</label>
            </div>
            <div>
              <span
                className={`px-3 py-1 text-sm rounded-full ${isQuickViewModal?.data?.status === "Active" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-800"
                  }`}
              >
                {isQuickViewModal?.data?.status || "Active"}
              </span>
            </div>
            <div>
              <label>{icons.stages}Stage:</label>
            </div>
            <div>
              {(() => {
                const statusMapping = {
                  New: "success",
                  Enquiry: "warning",
                  Lost: "error",
                  FollowUp: "inprogress",
                  Quotation: "info",
                };
                const stage = isQuickViewModal?.data?.stage || "Enquiry";
                const status = statusMapping[stage] || "success";

                return (
                  <div className="flex items-center">
                    <StatusManager status={status} message={stage} />
                  </div>
                );
              })()}
            </div>
          </div>
        </div> */}
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
        <div>
          <div className="grid">
            <label>
              {React.cloneElement(icons.addActivity, { size: 20 })}
              Purpose
            </label>
            <select
              value={primaryOption}
              onChange={(e) => setPrimaryOption(e.target.value)}
              className="dropdown"
            >
              <option value="Enquiry">Enquiry</option>
              <option value="Field Visit">Field Visit</option>
              <option value="Quotation">Quotation</option>
            </select>
          </div>
          {primaryOption !== "Field Visit" && (
            <div className="chips-container flex gap-2 mb-4">
              {(primaryOption === "Enquiry"
                ? ["Call", "WhatsApp", "Mail","Direct"]
                : ["WhatsApp", "Mail"]
              ).map((option) => (
                <button
                  key={option}
                  className={`chip ${enquiryOption === option ? "active" : ""}`}
                  onClick={() => setEnquiryOption(option)}
                >
                  {icons[option.toLowerCase()]}
                  {option}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={activityHandleSubmit(activityHandler)}>
            {renderForm(primaryOption, enquiryOption)}
            <div className="flex gap-3 mt-3">
              <IconButton
                type="button"
                icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
                label="Cancel"
                className="px-4 py-2 btn_cancel"
                onClick={() => {
                  setIsModalOpenMail(false);
                  activityReset();
                }}
                disabled={activityLoading}
              />
              <IconButton
                type="submit"
                icon={React.cloneElement(icons.plusIcon, { size: "20px" })}
                label="Create Activity"
                className="px-4 py-2"
                loading={activityLoading}
              />
            </div>
          </form>
        </div>
      </Modal>

    </>
  );
}
