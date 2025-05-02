import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../../UI/Modal/Modal";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import Select from "../../../../UI/Select/SingleSelect";
import icons from "../../../../contents/Icons";
import TextArea from "../../../../UI/Input/TextArea/TextArea";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import IconRoundedBtn from "../../../../UI/Buttons/IconRoundedBtn/IconRoundedBtn";
import './LeadDetailPanel.css';
import { getActivityReplayListEffect, getActivityQueryListEffect } from "../../../../redux/common/CommonEffects";
import {
  getLeadStageListEffect,
  getLeadSourceListEffect,
  createLeadActivityEffect,
  createLeadScheduleEffect,
  createLeadNoteEffect, getUnitEffect
} from "../../../../redux/CRM/lead/LeadEffects";
import { useDispatch, useSelector } from "react-redux";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";
import { activityList } from "../../../../contents/ActivityList";
import FileInput from "../../../../UI/Input/FileInput/FileInput";
// import { getUnitEffect } from "../../../../redux/Utils/Unit/UnitEffect";
import { arrOptForDropdown, getDefaultDateTime } from "../../../../utils/Data";
import { padgeColorList } from "../../../../contents/Colors";
import { setLeadDetailInprogress } from "../../../../redux/CRM/lead/LeadActions";
import CircleIconBtn from "../../../../UI/Buttons/CircleIconBtn/CircleIconBtn";
import GeoMap from "../../../../UI/GeoLocation/GeoMap/GeoMap";
import SingleCheckbox from "../../../../UI/Input/CheckBoxInput/SingleCheckbox";
import "../../../../UI/AgGridTable/ExportBtn/ExportBtn.css";
import SearchableSelect from "../../../../UI/Select/SearchableSelect";
import {
  getAllDistrictListEffect,
  getAllStateListEffect,
  getEmployeeListEffect,
  getAllUnitListEffect,
  getAllItemListEffect,
} from "../../../../redux/common/CommonEffects";
import { useNavigate } from "react-router";
import ButtonFileInput from "../../../../UI/Input/FileInput/ButtonFile";

export default function LeadActivityModal({ id, leadData }) {
  const dispatch = useDispatch();
  const currentLocations = useSelector(
    (state) => state?.common?.location?.location
  );
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const navigate = useNavigate()
  const [stageList, setStageList] = useState([]);
  const [leadstageList, setLeadStageList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [isModalOpenWhatsapp, setIsModalOpenWhatsapp] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [mailLoading, setMailLoading] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [callLoading, setCallLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [toastData, setToastData] = useState();
  const [isModalOpenMail, setIsModalOpenMail] = useState(false);
  const [isModalOpenCall, setIsModalOpenCall] = useState(false);
  const [isModalOpenDirect, setIsModalOpenDirect] = useState(false);
  const [isModalOpenNotes, setIsModalOpenNotes] = useState(false);
  const [isModalOpenActivity, setIsModalOpenActivity] = useState(false);
  const [isModalScheduling, setIsModalScheduling] = useState(false);
  const [primaryOption, setPrimaryOption] = useState("Enquiry");
  const [enquiryOption, setEnquiryOption] = useState("WhatsApp");
  const [unitList, setUnitList] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [editDimension, setEditDimension] = useState(false);
  const [replyList, setReplyList] = useState([]);
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

  const [queryList, setQueryList] = useState([]);
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
    register: callRegister,
    formState: { errors: callError },
    handleSubmit: callHandleSubmit,
    setValue: callSetValue,
    reset: callReset,
  } = useForm();
  const {
    register: directRegister,
    formState: { errors: directError },
    handleSubmit: directHandleSubmit,
    setValue: directSetValue,
    watch: directWatch,
    reset: directReset,
  } = useForm();
  const stageId = directWatch("pipeline_id");
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
  // useEffect(() => {
  //   const mapToOptions = (data) =>
  //     data.map(({ name, id }) => ({ label: name, value: id }));

  //   const fetchData = async () => {
  //     try {
  //       const [
  //         { data: employees },
  //         { data: stages },
  //         { data: sources },
  //         { data: units },
  //       ] = await Promise.all([
  //         getEmployeeListEffect(),
  //         getLeadStageListEffect(),
  //         getLeadSourceListEffect(),
  //         getUnitEffect(),
  //       ]);

  //       setEmployeeList(mapToOptions(employees.data));
  //       setStageList(
  //         mapToOptions(stages.data.filter(({ name }) => name !== "New"))
  //       );
  //       setSourceList(mapToOptions(sources.data));
  //       setUnitList(arrOptForDropdown(units.data?.data, "unit_name", "id"));
  //     } catch (error) {
  //       console.error("Failed to fetch dropdown data:", error);
  //     }
  //   };

  //   fetchData();
  //   whatsappSetValue("date", getDefaultDateTime());
  //   mailSetValue("date", getDefaultDateTime());
  // }, []);
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let { data } = await getEmployeeListEffect();
        setEmployeeList(data.data.map(({ name, id }) => ({ label: name, value: id })));
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        setEmployeeList([]);
      }
    };

    const fetchStages = async () => {
      try {
        let { data } = await getLeadStageListEffect();
        setStageList(data.data.filter(({ name }) => name !== "New").map(({ name, id }) => ({ label: name, value: id })));
      } catch (error) {
        console.error("Failed to fetch stages:", error);
        setStageList([]);
      }
    };

    const fetchSources = async () => {
      try {
        let { data } = await getLeadSourceListEffect();
        setSourceList(data.data.map(({ name, id }) => ({ label: name, value: id })));
      } catch (error) {
        console.error("Failed to fetch sources:", error);
        setSourceList([]);
      }
    };

    const fetchUnits = async () => {
      try {
        let { data } = await getUnitEffect();
        setUnitList(arrOptForDropdown(data.data, "unit_name", "id"));
      } catch (error) {
        console.error("Failed to fetch units:", error);
        setUnitList([]);
      }
    };

    // Call functions separately
    fetchEmployees();
    fetchStages();
    fetchSources();
    fetchUnits();

    // Set default dates
    whatsappSetValue("date", getDefaultDateTime());
    mailSetValue("date", getDefaultDateTime());

  }, []);

  const actionButtons = [
    {
      icon: leadData?.is_closed ? (leadData?.is_closed_type == "won" ? icons.trophy : icons?.lost) : icons.circleCheck,
      tooltip: "",
      className: `border ${leadData?.is_closed ? (leadData?.is_closed_type == "won" ? 'border-green-500 text-white-500 bg-green-500' : 'border-red-500 text-white-500 bg-red-500') : 'border-green-500 text-white-500 bg-green-500'}`,
      content: ` ${leadData?.is_closed ? "Closed" : "Open"} `,
      disabled: true,
    },
    {
      icon: icons.whatsapp,
      tooltip: "Whatsapp",
      className: `btn-hover ${leadData?.is_closed ? 'cursor-not-allowed opacity-50' : ''}`,
      content: "Whatsapp",
      // onClick: () => {
      //   if (!leadData?.is_closed_type) {
      //     setIsModalOpenWhatsapp(true);
      //     setLeadStageList(() => {
      //       const filteredList = stageList.filter((list) =>
      //         activityList?.whatsapp?.stage.includes(list.label)
      //       );
      //       return filteredList;
      //     });
      //   }
      // },
      onClick: () => {
        if (!leadData?.is_closed_type) { // Check if the lead is closed
          setIsModalOpenWhatsapp(true);
          setLeadStageList(() => {
            return stageList.filter((list) =>
              activityList?.whatsapp?.stage.includes(list.label)
            );
          });
        }
      },
      disabled: leadData?.is_closed, // Disable button if lead is closed
    },
    {
      icon: icons.mail,
      tooltip: "Mail",
      className: `btn-hover ${leadData?.is_closed ? 'cursor-not-allowed opacity-50' : ''}`,
      content: "Mail",
      onClick: () => {
        if (!leadData?.is_closed_type) { // Check if the lead is closed
          setIsModalOpenMail(true);
          setLeadStageList(() => {
            return stageList.filter((list) =>
              activityList?.mail?.stage.includes(list.label)
            );
          });
        }
      },
      disabled: leadData?.is_closed, // Disable button if lead is closed
    },
    {
      icon: icons.note,
      tooltip: "Note",
      className: `btn-hover ${leadData?.is_closed ? 'cursor-not-allowed opacity-50' : ''}`,
      content: "Notes",
      onClick: () => {
        if (!leadData?.is_closed_type) { // Check if the lead is closed
          setIsModalOpenNotes(true);
        }
      },
      disabled: leadData?.is_closed, // Disable button if lead is closed
    },
    {
      icon: icons.call,
      tooltip: "Call",
      className: `btn-hover ${leadData?.is_closed ? 'cursor-not-allowed opacity-50' : ''}`,
      content: "Call",
      onClick: () => {
        if (!leadData?.is_closed_type) { // Check if the lead is closed
          setIsModalOpenCall(true);
          callSetValue(getDefaultDateTime());
          setLeadStageList(() => {
            return stageList.filter((list) =>
              activityList?.phone?.stage.includes(list.label)
            );
          });
        }
      },
      disabled: leadData?.is_closed, // Disable button if lead is closed
    },
    {
      icon: icons["field visit"],
      tooltip: "Direct Visit",
      className: `btn-hover ${leadData?.is_closed ? 'cursor-not-allowed opacity-50' : ''}`,
      content: "Direct Visit",
      onClick: () => {
        if (!leadData?.is_closed_type) { // Check if the lead is closed
          setIsModalOpenDirect(true);
          directSetValue(getDefaultDateTime());
          setLeadStageList(() => {
            return stageList.filter((list) =>
              activityList?.Direct?.stage.includes(list.label)
            );
          });
        }
      },
      disabled: leadData?.is_closed, // Disable button if lead is closed
    }
  ];

  const dimension = directWatch("editDimension");
  useEffect(() => {
    setEditDimension(dimension);
  }, [dimension]);
  const [payload, setPayload] = useState(null);
  const noteHandler = async (data) => {
    const payload = {
      ...data,
      lead_id: leadData?.id,
      type:"lead"
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
  const callHandler = useCallback(
    async (data) => {
      setCallLoading(true);
      
      const formData = new FormData();
      formData.append("date", data.date.replace("T", " "));
      formData.append("lead_id", leadData?.id);
      formData.append("mode_communication", 7);
      formData.append("is_schedule", 0);
      formData.append("pipeline_id", data.pipeline_id);
      formData.append("customer_reply", selectedQuery);
      formData.append("content_reply", selectedReplayLabel);
      formData.append("notes", data.notes || "");
  
      const payload = {
        "date": data.date.replace("T", " "),
        "lead_id": leadData?.id,
        "mode_communication": 7,
        "is_schedule": 0,
        "pipeline_id": data.pipeline_id,
        "customer_reply": selectedQuery,
        "content_reply": selectedReplayLabel,
        "notes": data.notes || "",
      };
  
      setPayload(payload);
  
      try {
        const result = await createLeadActivityEffect(formData);
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
        setCallLoading(false);
        setIsModalOpenCall(false);
        callReset();
  
        const payloads = {
          uuid: leadData.uuid,
          stages: "",
          is_schedule: 0,
          "customer_reply": selectedQuery,
          "content_reply": selectedReplayLabel,
        };
        dispatch(setLeadDetailInprogress({ ...payloads }));
      }
    },
    [leadData?.id, selectedQuery, selectedReplayLabel, callReset]
  );
  
  const directHandler = useCallback(
    async (data) => {
      
      setCallLoading(true);
      
      const formData = new FormData();
      formData.append("date", data.date.replace("T", " "));
      formData.append("lead_id", leadData?.id);
      formData.append("mode_communication", 6);
      formData.append("is_schedule", 0);
      
      if (data?.pipeline_id == 3) {
        formData.append("latitude", currentLocations[0]);
        formData.append("longitude", currentLocations[1]);
        if (editDimension) {
          formData.append("width", data?.width);
          formData.append("height", data?.height);
          formData.append("length", data?.length);
          formData.append("unit", data?.unit);
        }
      }  
      // Add other form fields
      formData.append("pipeline_id", data.pipeline_id);
      formData.append("customer_reply", selectedQuery);
      formData.append("content_reply", selectedReplayLabel);
      formData.append("notes", data.notes || "");
  
      const payload = {
        "date": data.date.replace("T", " "),
        "lead_id": leadData?.id,
        "mode_communication": 6,
        "is_schedule": 0,
        "pipeline_id": data.pipeline_id,
        "customer_reply": selectedQuery,
        "content_reply": selectedReplayLabel,
        "notes": data.notes || "",
        "latitude": data?.pipeline_id == 3 ? currentLocations[0] : null,
        "longitude": data?.pipeline_id == 3 ? currentLocations[1] : null,
        "width": editDimension ? data?.width : null,
        "height": editDimension ? data?.height : null,
        "length": editDimension ? data?.length : null,
        "unit": editDimension ? data?.unit : null
      };
  
      setPayload(payload);
  
      try {
        const result = await createLeadActivityEffect(formData);
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
        setCallLoading(false);
        setIsModalOpenDirect(false);
        directReset();
  
        const payloads = {
          uuid: leadData.uuid,
          stages: "",
          is_schedule: 0,
          "customer_reply": selectedQuery,
          "content_reply": selectedReplayLabel,
        };
        dispatch(setLeadDetailInprogress({ ...payloads }));
      }
    },
    [leadData?.id, selectedQuery, selectedReplayLabel, directReset]
  );
  
  // Toast close handler
  const toastOnclose = useCallback(() => {
    setToastData({ ...toastData, show: false });
  }, [toastData]);

  useEffect(() => {
      (async () => {
        try {
          let { data } = await getAllUnitListEffect();
          data = data.data.map((list) => ({
            label: list.unit_name,
            value: list.id,
          }));
          setUnitList(data);
          setValue("unit", 16);
        } catch (error) {
          setUnitList([]);
        }
      })();
    }
  , []);

  const FeedbackForm = (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-12">
        {/* <TextArea
          id="customer_reply"
          iconLabel={icons.textarea}
          label="Lead Insights / Inquiries"
          validation={{ required: "Customer Feedback is required" }}
          register={activityRegister}
          errors={activityError}
        /> */}
        <SearchableSelect
          options={queryList}
          id="customer_reply"
          iconLabel={icons.textarea}
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
          id="content_reply"
          iconLabel={icons.replay}
          label="Our Reply"
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
  const [selectedValue, setSelectedValue] = useState(""); // Track selected value

  // Whatsapp handler
  const whatsappHandler = useCallback(
    async (data) => {
      if (!leadData?.whatsapp_contact) {
        setToastData({
          show: true,
          type: "error",
          message: "Your profile does not have an WhatsApp number",
        });
        return;
      }

      setWhatsappLoading(true);

      const formData = new FormData();
      formData.append("date", data.date.replace("T", " "));
      formData.append("lead_id", leadData?.id);
      formData.append("mode_communication", 8);
      formData.append("is_schedule", 0);
      formData.append("pipeline_id", selectedValue);
      formData.append("customer_reply", selectedQuery); 
      formData.append("content_reply", selectedReplayLabel);
      formData.append("notes", data.notes || "");
      formData.append("send_msg", data?.send_msg ? 1 : 0);

      if (data?.file_url?.length > 0) {
        formData.append("file_url", data.file_url[0]); 
      }
      const payload = {
        "date": data.date.replace("T", " "),
        "lead_id": leadData?.id,
        "mode_communication": 8,
        "is_schedule": 0,
        "pipeline_id": selectedValue,
        "customer_reply": selectedQuery,
        "content_reply": selectedReplayLabel,
        "notes": data.notes || "",
        "send_msg": data?.send_msg ? 1 : 0,
        "file_url": data?.file_url?.length > 0 ? data.file_url[0] : null
      };
      setPayload(payload);
      try {
        const result = await createLeadActivityEffect(formData);
        if (result.data.status === "success") {
          setToastData({
            show: true,
            type: result?.data?.status,
            message: result?.data?.message,
          });
          setIsModalOpenWhatsapp(false);
          whatsappReset();
        }
      } catch (error) {
        setToastData({
          show: true,
          type: "error",
          message: error?.data?.message || "Something went wrong",
        });
      } finally {
        setWhatsappLoading(false);
        setIsModalOpenWhatsapp(false);
        whatsappReset();
        dispatch(setLeadDetailInprogress({ uuid: leadData.uuid, stages: "", is_schedule: 0 }));
      }
    },
    [leadData?.id, leadData?.whatsapp_contact, selectedValue, selectedQuery, selectedReplayLabel, whatsappReset]
  );

  const mailHandler = useCallback(
    async (data) => {
      if (!leadData?.email) {
        setToastData({
          show: true,
          type: "error",
          message: "Your profile does not have an email ID",
        });
        return;
      }
      
      setMailLoading(true);
      
      const formData = new FormData();
      formData.append("date", data.date.replace("T", " "));
      formData.append("lead_id", leadData?.id);
      formData.append("mode_communication", 5);
      formData.append("is_schedule", 0);
      
      if (data?.file_url?.length > 0) {
        formData.append("file_url", data.file_url[0]); // Appending the file
      }
      
      formData.append("pipeline_id", selectedValue);
      formData.append("customer_reply", selectedQuery);
      formData.append("content_reply", selectedReplayLabel);
      formData.append("notes", data.notes || "");
      formData.append("send_msg", data?.send_msg ? 1 : 0);
      
      const payload = {
        "date": data.date.replace("T", " "),
        "lead_id": leadData?.id,
        "mode_communication": 5,
        "is_schedule": 0,
        "pipeline_id": selectedValue,
        "customer_reply": selectedQuery,
        "content_reply": selectedReplayLabel, // Ensure correct variable
        "notes": data.notes || "",
        "send_msg": data?.send_msg ? 1 : 0,
        "file_url": data?.file_url?.length > 0 ? data.file_url[0] : null
      };
      
      setPayload(payload);
      
      try {
        const result = await createLeadActivityEffect(formData);
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
        mailReset();
        
        const payloads = {
          uuid: leadData.uuid,
          stages: "",
          is_schedule: 0,
        };
        dispatch(setLeadDetailInprogress({ ...payloads }));
      }
    },
    [leadData?.id, leadData?.email, selectedValue, mailReset]
  );
  
  const handleSelectChange = (e) => {
    const selected = e.target.value;
    setSelectedValue(selected);
    const selectedOption = leadstageList.find(option => option.value == selected);
  }

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
        <div className="flex flex-wrap gap-7">
          {actionButtons.map(
            ({ icon, tooltip, className, onClick, content }, idx) => (
              <>
                <CircleIconBtn
                  key={idx}
                  icon={React.cloneElement(icon, { size: 24 })}
                  tooltip={tooltip}
                  className={className}
                  tooltipId={className}
                  onClick={onClick}
                  namefeild={tooltip}
                  content={content}
                />
              </>
            )
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpenWhatsapp}
        onClose={() => setIsModalOpenWhatsapp(false)}
        title="Create WhatsApp Activity"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={whatsappHandleSubmit(whatsappHandler)}>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
              <FormInput
                id="date"
                iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
                label="Date & Time"
                type="datetime-local"
                register={whatsappRegister}
                errors={whatsappError}
                defaultValue={new Date().toISOString().slice(0, 16)}
                max={getDefaultDateTime()}
                min={getDefaultDateTime(2)}
              />
            </div>
            <div className="col-span-12">
              <label htmlFor="">{React.cloneElement(icons.tag, { size: 20 })} Purpose</label>
              <select
                id="pipeline_id"
                value={selectedValue}
                onChange={handleSelectChange}
                className="form-select border w-full p-2 rounded"
              >
                <option value="" disabled>Select Purpose</option>
                {leadstageList.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="col-span-12">
              <SearchableSelect
                options={queryList}
                label="Lead Insights / Inquiries"
                id="customer_reply"
                iconLabel={React.cloneElement(icons.textarea, { size: "20px" })}
                placeholder="Enter Product Name"
                register={whatsappRegister}
                validation={{ required: "Customer Feedback is required" }}
                errors={whatsappError}
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
                placeholder="Enter Product Name"
                register={whatsappRegister}
                validation={{ required: "Our Reply is required" }}
                errors={whatsappError}
                setValue={setValue}
                onChange={(selectedOption) => {
                  setSelectedReplayLabel(selectedOption.value); // Ensure selectedReplay is updated correctly
                }}
              />
            </div>
            <div className="col-span-12 mt-2 w-fit">
              <SingleCheckbox
                id="send_msg"
                label="Send to WhatsApp"
                register={whatsappRegister}
                errors={whatsappError}
                validation={{ required: false }}
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
            {selectedValue === "2" && (
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
            )}
          </div>
          <div className="flex gap-3 mt-3">
            {selectedValue === "2" && (
              <>
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
              </>
            )}
            {selectedValue === "4" && (
              <>
                <IconButton
                  type="submit"
                  icon={React.cloneElement(icons.generate, { size: "20px" })}
                  label="Generate"
                  className="px-4 py-2"
                  loading={whatsappLoading}
                  onClick={() => navigate("/user/quotation/add-manual-quotation", { state: { leadData, payload } })}
                />
                <ButtonFileInput
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
                <IconButton
                  type="submit"
                  icon={React.cloneElement(icons.whatsappIcon, { size: "20px" })}
                  label="Share"
                  className="px-4 py-2"
                  loading={whatsappLoading}
                />
              </>
            )}
          </div>
        </form>
      </Modal>

      {/* mail */}
      <Modal
        isOpen={isModalOpenMail}
        onClose={() => setIsModalOpenMail(false)}
        title="Create Mail Activity"
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
                max={getDefaultDateTime()}
                min={getDefaultDateTime(2)}
              />
            </div>
            <div className="col-span-12">
              <label htmlFor="">{React.cloneElement(icons.tag, { size: 20 })} Purpose</label>
              <select
                id="pipeline_id"
                value={selectedValue}
                onChange={handleSelectChange}
                className="form-select border w-full p-2 rounded"
              >
                <option value="" disabled>Select Purpose</option>
                {leadstageList.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
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
              <SearchableSelect
                options={queryList}
                label="Lead Insights / Inquiries"
                id="customer_reply"
                iconLabel={React.cloneElement(icons.textarea, { size: "20px" })}
                register={mailRegister}
                validation={{ required: "Customer Feedback is required" }}
                errors={mailError}
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
                register={mailRegister}
                validation={{ required: "Our Reply is required" }}
                errors={mailError}
                setValue={setValue}
                onChange={(selectedOption) => {
                  setSelectedReplayLabel(selectedOption.value); // Ensure selectedReplay is updated correctly
                }}
              />
            </div>
            {/* Checkbox */}
            <div className="col-span-12 flex items-center justify-between gap-2 mt-2">
              <SingleCheckbox
                id="send_msg"
                label="Send to Mail"
                register={mailRegister}
                errors={mailError}
                validation={{
                  required: false,
                }}
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
            {selectedValue === "2" && (
              <div className="col-span-12">
                <FileInput
                  id="file_url"
                  label="Upload File"
                  showStar={false}
                  register={mailRegister}
                  iconLabel={React.cloneElement(icons.filepin, { size: 20 })}
                  validation={{ required: false }}
                  errors={mailError}
                  accept=".jpg,.png,.pdf"
                  multiple={false}
                />
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-3">
            {selectedValue === "2" && (
              <>
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
                  icon={React.cloneElement(icons.whatsappIcon, { size: "20px" })}
                  label="Share"
                  className="px-4 py-2"
                  loading={mailLoading}
                />
              </>
            )}
            {selectedValue === "4" && (
              <>
                <IconButton
                  type="submit"
                  icon={React.cloneElement(icons.generate, { size: "20px" })}
                  label="Generate"
                  className="px-4 py-2"
                  loading={mailLoading}
                  onClick={() => navigate("/user/quotation/add-manual-quotation", { state: { leadData, payload } })}
                />
                <ButtonFileInput
                  id="file_url"
                  label="Upload File"
                  showStar={false}
                  register={mailRegister}
                  iconLabel={React.cloneElement(icons.filepin, { size: 20 })}
                  validation={{ required: false }}
                  errors={mailError}
                  accept=".jpg,.png,.pdf"
                  multiple={false}
                />
                <IconButton
                  type="submit"
                  icon={React.cloneElement(icons.whatsappIcon, { size: "20px" })}
                  label="Share"
                  className="px-4 py-2"
                  loading={mailLoading}
                />
              </>
            )}
          </div>
          {/* <div className="col-span-12">
              <FileInput
                id="file_url"
                label="Upload File"
                showStar={false}
                register={mailRegister}
                iconLabel={React.cloneElement(icons.filepin, { size: "20px" })}
                validation={{ required: false }}
                errors={mailError}
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
            </div> */}

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
              icon={React.cloneElement(icons.add, { size: "20px" })}
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

      {/* Call; */}
      <Modal
        isOpen={isModalOpenCall}
        onClose={() => setIsModalOpenCall(false)}
        title="Add Call Activity"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={callHandleSubmit(callHandler)}>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
              <FormInput
                id="date"
                iconLabel={React.cloneElement(icons.calendarWDate, {
                  size: 20,
                })}
                label="Date & Time"
                type="datetime-local"
                register={callRegister}
                errors={callError}
                defaultValue={new Date().toISOString().slice(0, 16)}
                max={getDefaultDateTime()}
                min={getDefaultDateTime(2)}
              />
            </div>
            <div className="col-span-12">
              <Select
                options={leadstageList}
                label="Purpose"
                id="pipeline_id"
                register={callRegister}
                errors={callError}
                validation={{ required: "Purpose is required" }}
                placeholder="Select Purpose"
                iconLabel={React.cloneElement(icons.tag, { size: 20 })}
              />
            </div>

            <div className="col-span-12">
              
              <SearchableSelect
                options={queryList}
                label="Lead Insights / Inquiries"
                id="customer_reply"
                iconLabel={React.cloneElement(icons.textarea, { size: "20px" })}
                register={callRegister}
                validation={{ required: "Customer Feedback is required" }}
                errors={callError}
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
                register={callRegister}
                validation={{ required: "Our Reply is required" }}
                errors={callError}
                setValue={setValue}
                onChange={(selectedOption) => {
                  setSelectedReplayLabel(selectedOption.value); // Ensure selectedReplay is updated correctly
                }}
              />
            </div>
            {/* Checkbox */}
            {/* <div className="col-span-12 flex items-center justify-between gap-2 mt-2">
              <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="confirm"
                className="w-4 h-4"
                checked={isCheckboxChecked}
                onChange={(e) => setIsCheckboxChecked(e.target.checked)}
              />
              <label htmlFor="confirm" className="text-gray-700">
                Confirm reply content
              </label>
              </div>
              <IconButton
               type="submit"
               icon={React.cloneElement(icons.TbSend, { size: "20px" })}
               label="Send"
               className="px-4 py-2"
                disabled={!isCheckboxChecked || whatsappLoading}
              />
            </div> */}
            <div className="col-span-12">
              <TextArea
                id="notes"
                iconLabel={React.cloneElement(icons.note, { size: "20px" })}
                label="Notes"
                showStar={false}
                validation={{ required: false }}
                register={callRegister}
                errors={callError}
              />
            </div>

            <div className=" col-span-12 flex gap-3 mt-3">
              <IconButton
                type="button"
                icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
                label="Cancel"
                className="px-4 py-2 btn_cancel"
                onClick={() => {
                  setIsModalOpenCall(false);
                  mailReset();
                }}
                disabled={callLoading}
              />
              <IconButton
                type="submit"
                icon={React.cloneElement(icons.phonePlus, { size: "20px" })}
                label="Add Call Activity"
                className="px-4 py-2"
                loading={callLoading}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Direct; */}
      <Modal
        isOpen={isModalOpenDirect}
        onClose={() => setIsModalOpenDirect(false)}
        title="Add Direct Visit Activity"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={directHandleSubmit(directHandler)}>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
              <FormInput
                id="date"
                iconLabel={React.cloneElement(icons.calendarWDate, {
                  size: 20,
                })}
                label="Date & Time"
                type="datetime-local"
                register={directRegister}
                errors={directError}
                defaultValue={new Date().toISOString().slice(0, 16)}
                max={getDefaultDateTime()}
                min={getDefaultDateTime(2)}
              />
            </div>
            <div className="col-span-12">
              <Select
                options={leadstageList}
                label="Purpose"
                id="pipeline_id"
                register={directRegister}
                errors={directError}
                validation={{ required: "Purpose is required" }}
                placeholder="Select Purpose"
                iconLabel={React.cloneElement(icons.tag, { size: 20 })}
              />
            </div>

            <div className="col-span-12">
              <SearchableSelect
                options={queryList}
                id="customer_reply"
                iconLabel={React.cloneElement(icons.textarea, { size: 20 })}
                label="Lead Insights / Inquiries"
                validation={{ required: "Customer Feedback is required" }}
                register={directRegister}
                errors={directError}
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
                register={directRegister}
                validation={{ required: "Our Reply is required" }}
                errors={directError}
                setValue={setValue}
                onChange={(selectedOption) => {
                  setSelectedReplayLabel(selectedOption.value); // Ensure selectedReplay is updated correctly
                }}
              />
            </div>
            <div className="col-span-12">
              <TextArea
                id="notes"
                iconLabel={React.cloneElement(icons.note, { size: "20px" })}
                label="Notes"
                showStar={false}
                validation={{ required: false }}
                register={directRegister}
                errors={directError}
              />
            </div>

            {stageId == 3 && (
              <>
                <div className="col-span-12">
                  <SingleCheckbox
                    id="editDimension"
                    label="Add Area Dimension Details"
                    register={directRegister}
                    errors={directError}
                    validation={{
                      required: false,
                    }}
                  />
                </div>
                {editDimension && (
                  <>
                    <div className="col-span-12">
                      <FormInput
                        label="Width"
                        id="width"
                        iconLabel={icons.widthScaleIcon}
                        placeholder="Enter Width"
                        register={register}
                        validation={{ required: "Width is required" }}
                        errors={errors}
                        showStar={true}
                        max={10}
                        allowNumbersOnly={true}
                      />
                    </div>
                    <div className="col-span-12">
                      <FormInput
                        label="Length"
                        id="length"
                        iconLabel={icons.lengthScaleIcon}
                        placeholder="Enter Length"
                        register={register}
                        showStar={true}
                        validation={{
                          required: "Length is required",
                        }}
                        errors={errors}
                        max={10}
                        allowNumbersOnly={true}
                      />
                    </div>
                    <div className="col-span-12">
                      <FormInput
                        label="Height"
                        id="height"
                        iconLabel={icons.heightScaleIcon}
                        placeholder="Enter Height"
                        showStar={true}
                        register={register}
                        validation={{
                          required: "Height is required",
                        }}
                        errors={errors}
                        max={10}
                        allowNumbersOnly={true}
                      />
                    </div>
                    <div className="col-span-12">
                      <Select
                        options={unitList}
                        label="Unit"
                        id="unit"
                        iconLabel={icons.unit}
                        placeholder="Select Unit"
                        register={register}
                        validation={{ required: "Unit is Required" }}
                        errors={errors}
                        showStar={false}
                      />
                    </div>
                  </>
                )}
                <div className="col-span-12">
                  <GeoMap />
                </div>
              </>
            )}

            <div className=" col-span-12 flex gap-3 mt-3">
              <IconButton
                type="button"
                icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
                label="Cancel"
                className="px-4 py-2 btn_cancel"
                onClick={() => {
                  setIsModalOpenDirect(false);
                  mailReset();
                }}
                disabled={callLoading}
              />
              <IconButton
                type="submit"
                icon={React.cloneElement(icons.locationIcon, { size: "20px" })}
                label="Add Direct Visit"
                className="px-4 py-2"
                loading={callLoading}
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
