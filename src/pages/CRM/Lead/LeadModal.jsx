import React, { useCallback, useEffect, useState } from "react";
import icons from "../../../contents/Icons";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import { useForm } from "react-hook-form";
import Modal from "../../../UI/Modal/Modal";
import Select from "../../../UI/Select/SingleSelect";
import {
  getLeadStageListEffect,
  getLeadSourceListEffect,
  createLeadActivityEffect,
  createLeadScheduleEffect,
  LeadReopenEffect,
} from "../../../redux/CRM/lead/LeadEffects";
import { getEmployeeListEffect } from "../../../redux/common/CommonEffects";
import { getUnitEffect } from "../../../redux/CRM/lead/LeadEffects";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import { arrOptForDropdown, getDefaultDateTime } from "../../../utils/Data";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import FileInput from "../../../UI/Input/FileInput/FileInput";
import { useDispatch } from "react-redux";
import { setLeadDetailInprogress } from "../../../redux/CRM/lead/LeadActions";
import { tooltip } from "leaflet";
import { useNavigate } from "react-router";
import ButtonFileInput from "../../../UI/Input/FileInput/ButtonFile";
import SearchableSelect from "../../../UI/Select/SearchableSelect";
import { getReasonListEffect } from "../../../redux/common/CommonEffects";
export default function LeadModal({
  id,
  leadData,
  showReopenButton,
  showScheduleButton,
}) {
  const [isModalOpenActivity, setIsModalOpenActivity] = useState(false);
  const [isModalScheduling, setIsModalScheduling] = useState(false);
  const [isModalOpenReopen, setIsModalOpenReopen] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [reasonList, setReasonList] = useState([]);
  const [stageList, setStageList] = useState([]);
  const [leadstageList, setLeadStageList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [leadSourceList, setLeadSourceList] = useState([]);
  const [primaryOption, setPrimaryOption] = useState("Enquiry");
  const [enquiryOption, setEnquiryOption] = useState("WhatsApp");
  const [isModalOpenMail, setIsModalOpenMail] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [toastData, setToastData] = useState({ show: false });
  const [unitList, setUnitList] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const {
    register: activityRegister,
    formState: { errors: activityError },
    handleSubmit: activityHandleSubmit,
    setValue: activeSetValue,
    reset: activityReset,
  } = useForm();
  const {
    register: reopenRegister,
    formState: { errors: reopenError },
    handleSubmit: reopenHandleSubmit,
    setValue: reopenSetValue,
    reset: reopenReset,
  } = useForm();
  const {
    register,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
    handleSubmit,
  } = useForm({ defaultValue: { date: getDefaultDateTime() } });
  const stage = watch("pipeline_id");
  const source = watch("mode_communication");
  const [selectedValue, setSelectedValue] = useState(""); // Track selected value
  const [payload, setPayload] = useState(null);

  useEffect(() => {

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
        // {
        //   label: "Message",
        //   value: 9,
        // },
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
        // {
        //   label: "Message",
        //   value: 9,
        // },
      ];

      setLeadSourceList(payload);
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
    }
  }, [stage]);

  const actionButtons = [
    ...(showScheduleButton
      ? [
        {
          icon: icons.TbCalendarTime,
          tooltip: "Schedule",
          className: "schedule-btn",
          classNameicon: "schedule-icon",
          onClick: () => setIsModalScheduling(true),
        },
      ]
      : []),
    ...(showReopenButton
      ? [
        {
          icon: icons.TbUserCheck,
          tooltip: "Reopen",
          className: "reopen-btn",
          classNameicon: "reopen-icon",
          onClick: () => setIsModalOpenReopen(true),
        },
      ]
      : []),
    // {
    //   icon: icons.GoNote,
    //   tooltip: "Activity",
    //   className: "padgeColorList?.magenta",
    //   onClick: () => setIsModalOpenActivity(true),
    // },
  ];

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
        setValue("pipeline_id", 2);

        setSourceList(mapToOptions(sources.data));
        setLeadSourceList(mapToOptions(sources.data));
        setUnitList(arrOptForDropdown(units.data?.data, "unit_name", "id"));
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };

    fetchData();
    activeSetValue("schedule_time", getDefaultDateTime());
    activeSetValue("assignee", leadData?.incharge);
    activeSetValue("date", getDefaultDateTime());
    setValue("date", getDefaultDateTime());
    setValue("assignee", leadData?.incharge);
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
          label="Our Reply"
          validation={{ required: "Our Reply is required" }}
          register={activityRegister}
          errors={activityError}
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
      <div className="col-span-12">
        <FormInput
          id="date"
          iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
          label="Date & Time"
          type="datetime-local"
          register={activityRegister}
          errors={activityError}
          validation={{ required: "Schedule Date & Time is required" }}
          defaultValue={new Date().toISOString().slice(0, 16)}
        />
      </div>
      <div className="col-span-12">
        <p className="mt-3 font-semibold">Next Follow-up Details</p>
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
          defaultValue={new Date().toISOString().slice(0, 16)}
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
      Email: FeedbackForm,
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
      Email: [
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
    const pipeline = stageList.find((list) => list?.label === primaryOption);
    const modeCommunication = sourceList.find(
      (list) => list?.label === enquiryOption
    );
    if (!leadData?.whatsapp_contact && modeCommunication == 8) {
      setToastData({
        show: true,
        type: "error",
        message: "Kindly Provide whatsapp number ",
      });
      return;
    }
    if (!leadData?.email && modeCommunication == 5) {
      setToastData({
        show: true,
        type: "error",
        message: "Kindly Provide Email ",
      });
      return;
    }
    setActivityLoading(true);

    const payload = {
      lead_id: leadData?.id,
      pipeline_id: selectedValue, // Ensure we get the correct value or null
      mode_communication: modeCommunication ? modeCommunication.value : null, // Ensure we get the correct value or null
      ...data,
      date: data?.date?.replace("T", " "),
      schedule_time: data?.schedule_time?.replace("T", " "),

      is_schedule: 0,
    };
    console.log("payload sheduled", payload)
    try {
      const result = await createLeadActivityEffect({ ...payload });
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
      const payloads = {
        uuid: leadData.uuid,
        stages: "",
        is_schedule: 0,
      };
      dispatch(setLeadDetailInprogress({ ...payloads }));
    }
  };
  // const timeConvert=(date)=>{
  //   const split = date.replace("T",' ');
  //   return`${}`

  // }

  const addScheduleHandler = async (data) => {
    const payload = {
      ...data,
      date: data?.date.replace("T", " "),
      lead_id: leadData?.id,
    };

    try {
      const result = await createLeadScheduleEffect(payload);
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
      setScheduleLoading(false);
      setIsModalScheduling(false);
      reset(); // Reset the form after successful submission
      const payloads = {
        uuid: leadData.uuid,
        stages: "",
        is_schedule: 0,
      };
      dispatch(setLeadDetailInprogress({ ...payloads }));
    }
  };
  // Toast close handler
  const toastOnclose = useCallback(() => {
    setToastData({ ...toastData, show: false });
  }, [toastData]);
  
  useEffect(() => {
    // if (reasonList.length === 0) {
      (async () => {
        try {
          let { data } = await getReasonListEffect();
  
          data = data.data
            .filter((list) => list.dropdown_for === "reopen_reason")
            .map((list) => ({
              ...list,
              label: list.name,
              value: list.id,
            }));
  
          setReasonList(data);
        } catch (error) {
          console.error("Error fetching reason list:", error);
          setReasonList([]);
        }
      })();
    }
  , []);
  
  const reOpenHandler = async (data) => {
    const payload = {
      uuid: leadData.uuid,
      reopen_reason: watch("reason")
    };
  
    try {
      const result = await LeadReopenEffect(payload);
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
      setScheduleLoading(false);
      setIsModalOpenReopen(false);
      reopenReset(); // Reset the form after successful submission
      const payloads = {
        uuid: leadData.uuid,
        stages: "",
        is_schedule: 0,
      };
      dispatch(setLeadDetailInprogress({ ...payloads }));
    }
  };
  

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    setSelectedValue(selected);

    const selectedOption = stageList.find(option => option.value == selected);
    
    
  }
useEffect(() => {
    // if (reasonList.length === 0) {
      (async () => {
        try {
          let { data } = await getReasonListEffect();
  
          data = data.data
          .filter((list) => list.dropdown_for === "reopen_reason")
          .map((list) => ({
            ...list,
            label: list.name,
            value: list.id,
          }));
  
          setReasonList(data);
        } catch (error) {
          console.error("Error fetching reason list:", error);
          setReasonList([]);
        }
      })();
    }
  , []);
  return (
    <>
      {toastData?.show && (
        <AlertNotification
          type={toastData?.type}
          show={toastData?.show}
          message={toastData?.message}
          onClose={toastOnclose}
        />
      )}

      <div className="flex gap-2 justify-end my-2">
        {actionButtons.map((list) => (
          <>
            <button
              className={`flex items-center gap-3 rounded-md border px-3 p-1 ${list.className}`}
              onClick={list.onClick}
              type="button"
            >
              {list.tooltip}
              <span className={`${list.classNameicon}`}>{list.icon}</span>
            </button>
          </>
        ))}
      </div>

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
                ? ["Call", "WhatsApp", "Email"]
                : ["WhatsApp", "Email"]
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
      {/* Scheduling Modal */}
      <Modal
        isOpen={isModalScheduling}
        onClose={() => setIsModalScheduling(false)}
        title="Add Schedule"
        showHeader
        size="m"
        showFooter={false}
      >
        {/* <VerticalForm onSubmit={addScheduleHandler}> */}
        <form onSubmit={handleSubmit(addScheduleHandler)}>
          <div className="mb-5">
            <FormInput
              id="date"
              iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
              label="Date & Time"
              type="datetime-local"
              register={register}
              errors={errors}
              validation={{ required: "Schedule Date & Time is required" }}
              min={getDefaultDateTime()}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="">{React.cloneElement(icons.tag, { size: 20 })} Purpose</label>
            <select
              id="pipeline_id"
              value={selectedValue}
              onChange={handleSelectChange}
              className="form-select border w-full p-2 rounded"
            >
              <option value="" disabled>Select Purpose</option>
              {stageList.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {/* <Select
              options={stageList}
              label="Purpose"
              id="pipeline_id"
              register={register}
              errors={errors}
              validation={{ required: "Purpose is required" }}
              placeholder="Select Stage"
              iconLabel={React.cloneElement(icons.tag, { size: 20 })}
            /> */}
          </div>
          <div className="mb-5">
            <Select
              options={leadSourceList}
              label="Mode of Communication"
              id="mode_communication"
              register={register}
              errors={errors}
              validation={{ required: "Mode of communication is required" }}
              placeholder="Select Stage"
              iconLabel={React.cloneElement(icons.tag, { size: 20 })}
            />
          </div>

          <div className="col-span-12">
            <TextArea
              id="notes"
              iconLabel={icons.note}
              label="Notes"
              validation={{ required: "Notes is required" }}
              register={register}
              errors={errors}
            />
          </div>
          <div className="mb-5">
            <Select
              options={employeeList}
              label="Assignee"
              id="assignee"
              placeholder="Select Assignee"
              iconLabel={React.cloneElement(icons.referenceIcon, { size: 20 })}
              register={register}
              errors={errors}
              validation={{ required: "Assignee is required" }}
            />
          </div>
          {(selectedValue === "2" || selectedValue === "3") && (
            <IconButton
              icon={icons?.Calender}
              label="Add Schedule"
              type="submit"
            />
          )}

          {selectedValue === "4" && (
            <div className="flex justify-between">
              <IconButton
                type="submit"
                icon={React.cloneElement(icons.generate, { size: "20px" })}
                label="Generate"
                className="px-4 py-2"
                onClick={() => navigate("/user/quotation/add-manual-quotation", { state: { leadData, payload } })}
              />
              <ButtonFileInput
                id="file_url"
                label="Upload File"
                showStar={false}
                register={register}
                iconLabel={React.cloneElement(icons.filepin, { size: 20 })}
                validation={{ required: false }}
                errors={errors}
                accept=".jpg,.png,.pdf"
                multiple={false}
              />
              <IconButton
                type="submit"
                icon={React.cloneElement(icons.whatsappIcon, { size: "20px" })}
                label="Share"
                className="px-4 py-2"
              />
            </div>
          )}
        </form>
        {/* </VerticalForm> */}
      </Modal>
      {/* reopen model */}
      <Modal
        isOpen={isModalOpenReopen}
        onClose={() => setIsModalOpenReopen(false)}
        title="Reopen"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={reopenHandleSubmit(reOpenHandler)}>
          <div className="col-span-12">
            <SearchableSelect
              options={reasonList}
              label="Reopen Reason"
              id="reopen_reason"
              iconLabel={icons.GoNote}
              placeholder="Enter Product Name "
              register={register}
              validation={{ required: "Provide Valid Reason" }}
              errors={errors}
              setValue={setValue}
              onChange={(selected) => setValue("reason", selected?.label)}
            />
          </div>

          <div className="flex gap-3 mt-3">
            <IconButton
              type="button"
              icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
              onClick={() => {
                setIsModalOpenReopen(false);
                reopenReset();
              }}
            />
            <IconButton
              type="submit"
              icon={React.cloneElement(icons.circleCheck, { size: "20px" })}
              label="Reopen"
              className="px-4 py-2"
            />
          </div>
        </form>
      </Modal>
    </>
  );
}
