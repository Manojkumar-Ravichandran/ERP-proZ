import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../UI/Modal/Modal";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import Select from "../../../UI/Select/SingleSelect";
import icons from "../../../contents/Icons";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import IconRoundedBtn from "../../../UI/Buttons/IconRoundedBtn/IconRoundedBtn";
import {
  getLeadStageListEffect,
  getLeadSourceListEffect,
  createLeadActivityEffect,
  createLeadScheduleEffect,
  createLeadNoteEffect,
} from "../../../redux/CRM/lead/LeadEffects";
import { getEmployeeListEffect } from "../../../redux/common/CommonEffects";
import { useDispatch } from "react-redux";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import { activityList } from "../../../contents/ActivityList";
import FileInput from "../../../UI/Input/FileInput/FileInput";
import { getUnitEffect } from "../../../redux/CRM/lead/LeadEffects";
import { arrOptForDropdown, getDefaultDateTime } from "../../../utils/Data";
import { padgeColorList } from "../../../contents/Colors";
import { setLeadDetailInprogress } from "../../../redux/CRM/lead/LeadActions";
import { DetailsCall } from "./Component/LeadUtils/DetailsCall";

export default function LeadActivityModal({ id, leadData }) {
  const dispatch = useDispatch();
  const [stageList, setStageList] = useState([]);
  const [leadstageList, setLeadStageList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [isModalOpenWhatsapp, setIsModalOpenWhatsapp] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [mailLoading, setMailLoading] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [toastData, setToastData] = useState();
  const [isModalOpenMail, setIsModalOpenMail] = useState(false);
  const [isModalOpenNotes, setIsModalOpenNotes] = useState(false);
  const [isModalOpenActivity, setIsModalOpenActivity] = useState(false);
  const [isModalScheduling, setIsModalScheduling] = useState(false);
  const [primaryOption, setPrimaryOption] = useState("Enquiry");
  const [enquiryOption, setEnquiryOption] = useState("WhatsApp");
  const [unitList, setUnitList] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const {
    register: whatsappRegister,
    formState: { errors: whatsappError },
    handleSubmit: whatsappHandleSubmit,
    setValue: whatsappSetValue,
    reset: whatsappReset,
  } = useForm();
  const {
    register: mailRegister,
    formState: { errors: mailError },
    handleSubmit: mailHandleSubmit,
    setValue: mailSetValue,
    reset: mailReset,
  } = useForm();
  const {
    register: noteRegister,
    formState: { errors: noteError },
    handleSubmit: noteHandleSubmit,
    reset: noteReset,
  } = useForm();
  const {
    register: activityRegister,
    formState: { errors: activityError },
    handleSubmit: activityHandleSubmit,
    reset: activityReset,
    setValue: activitySetValue,
  } = useForm();
  const {
    register,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
    handleSubmit,
  } = useForm();

  // Fetch data on component mount
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
    whatsappSetValue("date", getDefaultDateTime());
    mailSetValue("date", getDefaultDateTime());
  }, []);

  const actionButtons = [
    {
      icon: icons.whatsapp,
      tooltip: "Whatsapp",
      className: padgeColorList?.green,
      onClick: () => {
        setIsModalOpenWhatsapp(true);

        setLeadStageList(() => {
          return stageList.filter((list) =>
            activityList?.whatsapp?.stage.includes(list.label)
          );
        });
      },
    },
    {
      icon: icons.mail,
      tooltip: "Mail",
      className: padgeColorList?.yellow,
      onClick: () => {
        setIsModalOpenMail(true);
        setLeadStageList(() => {
          return stageList.filter((list) =>
            activityList?.mail?.stage.includes(list.label)
          );
        });
      },
    },
    {
      icon: icons.note,
      tooltip: "Note",
      className: padgeColorList?.teal,
      onClick: () => setIsModalOpenNotes(true),
    },
    {
      icon: icons.call,
      tooltip: "Call",
      className: padgeColorList?.blue,
      // onClick: () => setIsModalOpenActivity(true),
    },
    {
      icon: icons.GoNote,
      tooltip: "Activity",
      className: padgeColorList?.magenta,
      onClick: () => setIsModalOpenActivity(true),
    },
    // {
    //   icon: icons.schedule,
    //   tooltip: "Schedule",
    //   className: "schedule",
    //   onClick: () => setIsModalScheduling(true),
    // },
  ];

  // Whatsapp handler
  const whatsappHandler = useCallback(
    async (data) => {
      if (!leadData?.whatsapp_contact) {
        setToastData({
          show: true,
          type: "error",
          message: "Kindly Provide whatsapp number ",
        });
        return;
      }

      setWhatsappLoading(true);
      let file_url;
      const formData = new FormData();

      if (Object.keys(data?.file_url || {}).length === 0) {
        file_url = "";
      } else {
        formData.append("file_url", data.file_url[0]);
      }
      //  ? null : data?.file_url;
      const payload = {
        ...data,
        date: data?.date?.replace("T", " "),
        lead_id: leadData?.id,
        mode_communication: 8,
        file_url,
        is_schedule: 0,
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
        setWhatsappLoading(false);
        setIsModalOpenWhatsapp(false);
        whatsappReset();
        // <DetailsCall uuid ={leadData.uuid} />
        const payloads = {
          uuid: leadData.uuid,
          stages: "",
          is_schedule: 0,
        };
        dispatch(setLeadDetailInprogress({ ...payloads }));

        // DetailsCall(leadData.uuid);
      }
    },
    [leadData?.id, leadData?.whatsapp_contact, whatsappReset]
  );

  const mailHandler = useCallback(
    async (data) => {
      if (!leadData?.email) {
        setToastData({
          show: true,
          type: "error",
          message: "Kindly Provide whatsapp number ",
        });
        return;
      }

      setMailLoading(true);
      let file_url;
      const formData = new FormData();

      if (Object.keys(data?.file_url || {}).length === 0) {
        file_url = "";
      } else {
        formData.append("file_url", data.file_url[0]);
      }
      //  ? null : data?.file_url;
      const payload = {
        ...data,
        date: data?.date?.replace("T", " "),

        lead_id: leadData?.id,
        mode_communication: 5,
        file_url,
        is_schedule: 0,
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
        setMailLoading(false);
        setIsModalOpenMail(false);
        mailReset(); // Reset the form after successful submission
        const payloads = {
          uuid: leadData.uuid,
          stages: "",
          is_schedule: 0,
        };
        dispatch(setLeadDetailInprogress({ ...payloads }));
      }
    },
    [leadData?.id, leadData?.email, mailReset]
  );
  const noteHandler = async (data) => {
    const payload = {
      ...data,
      lead_id: leadData?.id,
    };
    try {
      const result = await createLeadNoteEffect(payload);
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
      setNoteLoading(false);
      setIsModalOpenNotes(false);
      noteReset(); // Reset the form after successful submission
      // DetailsCall(leadData?.uuid);
      const payloads = {
        uuid: leadData.uuid,
        stages: "",
      };
      dispatch(setLeadDetailInprogress({ ...payloads }));
    }
  };
  // Toast close handler
  const toastOnclose = useCallback(() => {
    setToastData({ ...toastData, show: false });
  }, [toastData]);

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
      Mail: FeedbackForm,
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
      lead_id: leadData?.id,
      pipeline_id: pipeline ? pipeline.value : null, // Ensure we get the correct value or null
      mode_communication: modeCommunication ? modeCommunication.value : null, // Ensure we get the correct value or null
      ...data,
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
      const payloads = {
        uuid: leadData.uuid,
        stages: "",
      };
      dispatch(setLeadDetailInprogress({ ...payloads }));
    }
  };

  const addScheduleHandler = async (data) => {
    const payload = {
      ...data,
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
      };
      dispatch(setLeadDetailInprogress({ ...payloads }));
    }
  };
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

      <div className="flex justify-between">
        <div className="flex gap-2">
          {actionButtons.map(({ icon, tooltip, className, onClick }, idx) => (
            <IconRoundedBtn
              key={idx}
              icon={icon}
              tooltip={tooltip}
              className={className}
              tooltipId={className}
              onClick={onClick}
              namefeild={tooltip}
            />
          ))}
        </div>
      </div>

      {/* Whatsapp Modal */}
      <Modal
        isOpen={isModalOpenWhatsapp}
        onClose={() => setIsModalOpenWhatsapp(false)}
        title="Share Message on Whatsapp"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={whatsappHandleSubmit(whatsappHandler)}>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
              <FormInput
                id="date"
                iconLabel={React.cloneElement(icons.calendarWDate, {
                  size: 20,
                })}
                label="Date & Time"
                type="datetime-local"
                register={whatsappRegister}
                errors={whatsappError}
                defaultValue={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="col-span-12">
              <Select
                options={leadstageList}
                label="Purpose"
                id="pipeline_id"
                register={whatsappRegister}
                errors={whatsappError}
                validation={{ required: "Purpose is required" }}
                placeholder="Select Purpose"
                iconLabel={React.cloneElement(icons.tag, { size: 20 })}
              />
            </div>
            <div className="col-span-12">
              <TextArea
                id="customer_reply"
                iconLabel={React.cloneElement(icons.textarea, { size: 20 })}
                label="Lead Insights / Inquiries"
                validation={{ required: "Customer Feedback is required" }}
                register={whatsappRegister}
                errors={whatsappError}
              />
            </div>
            <div className="col-span-12">
              <TextArea
                id="content_reply"
                iconLabel={React.cloneElement(icons.replay, { size: 20 })}
                label="Our Reply"
                validation={{ required: "Our Reply is required" }}
                register={whatsappRegister}
                errors={whatsappError}
              />
            </div>
            <div className="col-span-12">
              <TextArea
                id="notes"
                iconLabel={React.cloneElement(icons.note, { size: 20 })}
                label="Notes"
                showStar={false}
                validation={{ required: false }}
                register={whatsappRegister}
                errors={whatsappError}
              />
            </div>
            <div className="col-span-12">
              <FileInput
                id="file_url"
                label="Upload File"
                showStar={false}
                register={whatsappRegister}
                iconLabel={React.cloneElement(icons.filepin, { size: 20 })}
                validation={{ required: false }}
                errors={whatsappError}
                accept=".jpg,.png,.pdf"
                multiple={false}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-3">
            <IconButton
              type="button"
              icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
              onClick={() => {
                setIsModalOpenWhatsapp(false);
                whatsappReset();
              }}
              disabled={whatsappLoading}
            />
            <IconButton
              type="submit"
              icon={React.cloneElement(icons.whatsappIcon, { size: "20px" })}
              label="Share"
              className="px-4 py-2"
              loading={whatsappLoading}
            />
          </div>
        </form>
      </Modal>

      {/* mail */}
      <Modal
        isOpen={isModalOpenMail}
        onClose={() => setIsModalOpenMail(false)}
        title="Compose Mail"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={mailHandleSubmit(mailHandler)}>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
              <FormInput
                id="date"
                iconLabel={React.cloneElement(icons.calendarWDate, {
                  size: 20,
                })}
                label="Date & Time"
                type="datetime-local"
                register={mailRegister}
                errors={mailError}
                defaultValue={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="col-span-12">
              <Select
                options={leadstageList}
                label="Purpose"
                id="pipeline_id"
                register={mailRegister}
                errors={mailError}
                validation={{ required: "Purpose is required" }}
                placeholder="Select Purpose"
                iconLabel={React.cloneElement(icons.tag, { size: 20 })}
              />
            </div>
            <div className="col-span-12">
              <FormInput
                id="subject"
                iconLabel={React.cloneElement(icons.mailSubjectIcon, {
                  size: 20,
                })}
                label="Subject"
                validation={{ required: "subject is required" }}
                register={mailRegister}
                errors={mailError}
              />
            </div>
            <div className="col-span-12">
              <TextArea
                id="customer_reply"
                iconLabel={React.cloneElement(icons.textarea, { size: 20 })}
                label="Lead Insights / Inquiries"
                validation={{ required: "Customer Feedback is required" }}
                register={mailRegister}
                errors={mailError}
              />
            </div>
            <div className="col-span-12">
              <TextArea
                id="content_reply"
                iconLabel={React.cloneElement(icons.replay, { size: "20px" })}
                label="Our Reply"
                validation={{ required: "Our Reply is required" }}
                register={mailRegister}
                errors={mailError}
              />
            </div>
            <div className="col-span-12">
              <TextArea
                id="notes"
                iconLabel={React.cloneElement(icons.note, { size: "20px" })}
                label="Notes"
                showStar={false}
                validation={{ required: false }}
                register={mailRegister}
                errors={mailError}
              />
            </div>
            <div className="col-span-12">
              <FileInput
                id="file_url"
                label="Upload File"
                showStar={false}
                register={whatsappRegister}
                iconLabel={React.cloneElement(icons.filepin, { size: "20px" })}
                validation={{ required: false }}
                errors={whatsappError}
                accept=".jpg,.png,.pdf"
                multiple={false}
              />
            </div>
            <div className="flex gap-3 mt-3">
              <IconButton
                type="button"
                icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
                label="Cancel"
                className="px-4 py-2 btn_cancel"
                onClick={() => {
                  setIsModalOpenMail(false);
                  mailReset();
                }}
                disabled={mailLoading}
              />
              <IconButton
                type="submit"
                icon={React.cloneElement(icons.mail, { size: "20px" })}
                label="Share"
                className="px-4 py-2"
                loading={mailLoading}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Notes Modal */}
      <Modal
        isOpen={isModalOpenNotes}
        onClose={() => setIsModalOpenNotes(false)}
        title="Add Notes"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={noteHandleSubmit(noteHandler)}>
          {/* <FormInput id="title" label="Title" validation={{ required: "Title is required" }} /> */}
          <TextArea
            id="description"
            label="Notes"
            validation={{ required: "Title is required" }}
            register={noteRegister}
            errors={noteError}
            iconLabel={React.cloneElement(icons.note, { size: "20px" })}
          />
          <div className="flex gap-3 mt-3">
            <IconButton
              type="button"
              icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
              onClick={() => {
                setIsModalOpenNotes(false);
                noteReset();
              }}
              disabled={noteLoading}
            />
            <IconButton
              type="submit"
              icon={React.cloneElement(icons.plusIcon, { size: "20px" })}
              label="Add Notes"
              className="px-4 py-2"
              loading={noteLoading}
            />
          </div>
        </form>
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
                ? ["Call", "WhatsApp", "Mail"]
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
                  mailReset();
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
            <Select
              options={sourceList}
              label="Mode of Communication"
              id="mode_communication"
              register={register}
              errors={errors}
              validation={{ required: "Mode of communication is required" }}
              placeholder="Select Stage"
              iconLabel={React.cloneElement(icons.tag, { size: 20 })}
            />
          </div>
          <div className="mb-5">
            <Select
              options={stageList}
              label="Purpose"
              id="mode_communication"
              register={register}
              errors={errors}
              validation={{ required: "Purpose is required" }}
              placeholder="Select Stage"
              iconLabel={React.cloneElement(icons.tag, { size: 20 })}
            />
          </div>
          <div className="mb-5">
            <FormInput
              id="schedule_time"
              iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
              label="Date & Time"
              type="datetime-local"
              register={register}
              errors={errors}
              validation={{ required: "Schedule Date & Time is required" }}
              defaultValue={new Date().toISOString().slice(0, 16)}
            />
          </div>
          <div className="mb-5">
            <Select
              options={employeeList}
              label="Assignee"
              id="referal_employee"
              placeholder="Select Employee"
              iconLabel={React.cloneElement(icons.referenceIcon, { size: 20 })}
              register={register}
              errors={errors}
              validation={{ required: "Assignee is required" }}
            />
          </div>
          <IconButton
            icon={icons?.Calender}
            label="Add Schedule"
            type="submit"
          />
        </form>
        {/* </VerticalForm> */}
      </Modal>
    </>
  );
}
