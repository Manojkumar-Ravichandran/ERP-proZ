import React, { useEffect, useState } from "react";
import { H6 } from "../../../../UI/Heading/Heading";
import { convertActivityTime, convertToIST } from "../../../../utils/Date";
import icons from "../../../../contents/Icons";
import { padgeColorList } from "../../../../contents/Colors";
import ToggleSwitch from "../../../../UI/Input/ToggleSwitch/ToggleSwitchNormal";
import Modal from "../../../../UI/Modal/Modal";
import { useForm } from "react-hook-form";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import Select from "../../../../UI/Select/SingleSelect";
import { getEmployeeListEffect } from "../../../../redux/common/CommonEffects";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import ReadMore from "../../../../UI/ReadMore/ReadMore";
import { getActivityReplayListEffect, getActivityQueryListEffect } from "../../../../redux/common/CommonEffects";
import {
  createLeadActivityEffect, updateLeadActivityEffect,
  getLeadSourceListEffect,
  getLeadStageListEffect,
  LeadRescheduleEffect,
  updateLeadEffect,
} from "../../../../redux/CRM/lead/LeadEffects";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { getUnitEffect } from "../../../../redux/CRM/lead/LeadEffects";
import {
  arrOptForDropdown,
  findSpecificIdDatas,
  getDefaultDateTime,
} from "../../../../utils/Data";
import { getReasonListEffect } from "../../../../redux/common/CommonEffects";
import FileInput from "../../../../UI/Input/FileInput/FileInput";
import TextArea from "../../../../UI/Input/TextArea/TextArea";
import { images } from "../../../../contents/Images";
import { useDispatch, useSelector } from "react-redux";
import { setLeadDetailInprogress } from "../../../../redux/CRM/lead/LeadActions";
import StatusManager from "../../../../UI/StatusManager/StatusManager";
import "../Lead.css";
import LocationComponent from "./LocationComponent";
import SingleCheckbox from "../../../../UI/Input/CheckBoxInput/SingleCheckbox";
import GeoMap from "../../../../UI/GeoLocation/GeoMap/GeoMap";
import SearchableSelect from "../../../../UI/Select/SearchableSelect";

export default function UpcomingActivity({ events }) {
  const [rescheduleModalIsOpen, setRescheduleModalOpen] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [toastData, setToastData] = useState({ show: false });
  const [activityIsModal, setActivityIsModal] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [stageList, setStageList] = useState([]);
  const [leadStageList, setLeadStageList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [leadSourceList, setLeadSourceList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [primaryOption, setPrimaryOption] = useState("Enquiry");
  const [enquiryOption, setEnquiryOption] = useState("WhatsApp");
  const [toggleChange, setToggleChange] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();
  const [communicationMode, setCommunicationMode] = useState();
  const [selectedData, setSelectedData] = useState();
  const [reallocatList, setReallocatList] = useState([]);
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
  const filteredReplyList = replyList.filter((reply) => {
    return reply.query_id === selectedQuery;
  });
  const currentLocations = useSelector(
    (state) => state?.common?.location?.location
  );
  const leadData = useSelector((state) => state?.lead?.leadDetail?.data);
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
    handleSubmit,
  } = useForm();

  const {
    register: activityRegister,
    formState: { errors: activityError },
    handleSubmit: activityHandleSubmit,
    setValue: activitySetValue,
    watch: activityWatch,
    reset: activityReset,
  } = useForm();
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
  // Determine the status of an activity based on its date
  const getStatus = (inputDate) => {
    // Convert the input date to a consistent format (ISO 8601)
    const [day, month, year] = inputDate.split("-");
    const formattedDate = `${year}-${month}-${day}`;
    const givenDate = new Date(formattedDate);
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (givenDate.getTime() === today.getTime()) return "Today";
    if (givenDate.getTime() === tomorrow.getTime()) return "Tomorrow";
    if (givenDate.getTime() > tomorrow.getTime()) return "Upcoming";
    return "Overdue";
  };

  // Get the color associated with a status
  const getStatusColor = (status) => {
    switch (status) {
      case "Overdue":
        return padgeColorList.orange;
      case "Today":
        return padgeColorList.green;
      default:
        return padgeColorList.blue;
    }
  };
  const updateScheduleOpen = (data) => {
    setSelectedEvent(data);
    setValue("date", data?.date);
    setValue("assignee", data?.next_assign);
    setValue("notes", data?.notes);
    setRescheduleModalOpen(true);
    setSelectedUser(data);
    datafeed(data);

    // setValue("assignee", data?.next_assign);
  };
  const updateActivityOpen = (data) => {
    
    setSelectedData(data);
    // setValue("stages_id", data?.stages_id);
    setValue("notes", data?.notes);
    setCommunicationMode(data?.mode_communication);
    setActivityIsModal(true);
  }

  useEffect(() => {
      (async () => {
        try {
          let { data } = await getReasonListEffect();
          data = data.data
            .filter((list) => list.dropdown_for === "reallocate_reason")
            .map((list) => ({
              ...list,
              label: list.name,
              value: list.id,
            }));

          setReallocatList(data);
        } catch (error) {
          console.error("Error fetching reason list:", error);
          setReallocatList([]);
        }
      })();
    }
  , []);

  const scheduleUpdateHandler = async (data) => {
    const selectedReason = reallocatList.find(item => item.value === data?.reschedule_reason)?.label || "";
    const payload = {
      ...data,
      pipeline_id: selectedEvent.stages_id,
      uuid: selectedEvent.uuid,
      mode_communication: data?.mode_communication,
      schedule_time: data?.date.replace("T", " "),
      reschedule_reason: selectedReason,
    };
    try {
      const result = await LeadRescheduleEffect(payload);
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
      setIsLoading(false);
      setRescheduleModalOpen(false);
      reset(); // Reset the form after successful submission
      const payloads = {
        uuid: leadData.uuid,
        stages: "",
      };
      dispatch(setLeadDetailInprogress({ ...payloads }));
    }
  };
  const changeToggle = (e, data) => {
    if (e.target.checked) {
      setToggleChange(true);
      setPrimaryOption(data?.stages_name);
      setEnquiryOption(data?.mode_communication_name);
      setActivityIsModal(true);
    }
    setToggleChange(false);
  };
  const pipeStage = activityWatch("stages_id");
  const dimension = activityWatch("editDimension");

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
      ];

      setLeadSourceList(payload);
      // setCommunicationMode(5);
    } else if (pipeStage == 3) {
      const payload = [
        {
          label: "Direct",
          value: 6,
        },
      ];

      setLeadSourceList(payload);
      // setCommunicationMode(6);
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
      ];

      setLeadSourceList(payload);
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

      ];

      setLeadSourceList(payload);
      // setCommunicationMode(5);
    }
  }, [pipeStage]);

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
            uuid: leadData?.uuid,
            stages: "",
            is_schedule: 1,
            customer_reply: selectedQuery,
            content_reply: selectedReplayLabel,
        };
        dispatch(setLeadDetailInprogress(payloads));
    }
};

  return (
    <>
      <p className="pb-2 font-semibold">Upcoming Activity</p>
      {events?.length == 0 && (
        <p className="mb-2 text-center text-gray-600 flex flex-col items-center">
          {/* <img
            src={images?.noData}
            alt="No Upcoming Activities Scheduled"
            className="w-20"
          /> */}
          No Upcoming Activities Scheduled
        </p>
      )}
      <hr />
      {events?.map((event) => {
        const activityDate = convertToIST(event?.date);
        const [date, time, meridiem] = activityDate.split(" ");
        const status = getStatus(date);
        const statusColor = getStatusColor(status);

        return (
          <div className="flex items-center gap-2 py-2" key={event.id}>
            {/* {event?.mode_communication_name.toLowerCase()} */}
            <div className="grid justify-items-center w-20">
              {/* <span className={`${padgeColorList?.green} p-2 inline-block rounded-full border-0`}> */}
              <span className="icon-top-clr p-2 inline-block rounded-full border-0">
                {event?.mode_communication_name
                  ? React.cloneElement(
                    icons[event?.mode_communication_name.toLowerCase()],
                    { size: 20 }
                  )
                  : React.cloneElement(icons["call"], { size: 20 })}
              </span>
              {/* <span className="font-semibold text-xs pt-2">{event?.date}05 Dec 25</span> */}
              <span className="font-semibold text-xs pt-2">
                {(() => {
                  const date = new Date(event?.date);
                  const day = String(date.getDate()).padStart(2, "0");
                  const month = date.toLocaleString("en-US", {
                    month: "short",
                  });
                  const year = String(date.getFullYear()).slice(-2);
                  return `${day} ${month} ${year}`;
                })()}
              </span>
            </div>

            <div className="activity__card grow darkCardBg mt-2 rounded-lg border gap-2 z-0 w-full">
              <div className="flex">
                {/* <div className="date p-2 px-3 border-r flex flex-col justify-center">
                  <div>
                   <span
                      className={`${padgeColorList?.teal} p-2 inline-block rounded-full border-0`}
                    >
                      {event?.mode_communication_name
                        ? React.cloneElement(
                          icons[event?.mode_communication_name.toLowerCase()],
                          { size: 26 }
                        )
                        : React.cloneElement(icons["call"], { size: 26 })}
                    </span> 
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-semibold text-primary-500">
                      {event?.date && convertActivityTime(event?.date).date}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {event?.date && convertActivityTime(event?.date).month}
                    </span>
                  </div>
                </div> */}

                <div className="grow w-full">
                  <div className="flex justify-between items-center p-2">
                    <div className="details px-2 text-lg flex font-medium mb-1 items-center">
                      <span className="">{event?.mode_communication_name} </span>
                      {event?.location && (
                        <LocationComponent
                          address="1600 Amphitheatre Parkway, Mountain View, CA"
                          icons={icons}
                        />
                      )}
                      {/* <span className="flex items-center gap-1 text-sm ps-2"><span className="rounded-full top-clr border p-1">{React.cloneElement(icons["locationIcon"], { size: 15 })}</span>location</span> */}
                    </div>
                    <div
                      className={`text-xs flex items-center gap-2 px-3 py-1 rounded-2xl ${statusColor}`}
                    >
                      {status}
                      <span>{icons.timeIcon}</span>
                    </div>
                    {/* 
                      <span className="text-gray-500 text-sm px-2">
                        by {event?.next_assign_name || "Aysha"}
                      </span> 
                      */}
                  </div>
                  <hr />
                  <div className="pb-3">
                    <ReadMore
                      className="font-normal px-4 pt-3 text-sm"
                      maxWords={23}
                      text={event?.notes}
                    />
                  </div>
                  <div className="flex justify-between bg-gray-100 p-2 rounded-b-md ">
                    <div className="flex gap-2">
                      <span className="flex items-center gap-2">
                        <span className="top-clr"> {icons.employeeIcon}</span>{" "}
                        {event?.next_assign_name}
                      </span>
                      {/* <span className="flex items-center gap-2"><span className="top-clr">{icons.timeIcon}</span>{event?.date}10:30 AM</span> */}
                      <span className="flex items-center gap-2">
                        <span className="top-clr">{icons.timeIcon}</span>
                        {(() => {
                          const date = new Date(event?.date);
                          const time = date.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          });
                          return time;
                        })()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className="bg-white-50 rounded-full border p-2 text-blue-400 cursor-pointer	"
                        data-tooltip-id="re-schedule"
                        onClick={() => updateScheduleOpen(event)}
                      >
                        {icons.rescheduleIcon}
                      </span>
                      <span
                        className="top-clr bg-white-50 rounded-full border p-2 cursor-pointer	"
                        data-tooltip-id="activity-schedule"
                        onClick={() => {
                          updateActivityOpen(event)
                          // setSelectedData(event);
                          // activitySetValue("stages_id", event?.stages_id);
                          // setCommunicationMode(event?.mode_communication);
                          // setActivityIsModal(true);
                        }
                        }
                      >
                        {icons.tick}
                      </span>
                    </div>
                  </div>
                  {/* <div className="col-start-3">
                      <div className="text-right flex items-center gap-2">
                        <span className="text-sm flex items-center text-gray-800">
                          {React.cloneElement(icons.timeIcon, { size: 16 })}{" "}
                          {time} {meridiem}
                        </span>
                        <span
                          className={`text-xs p-1 rounded-2xl ${statusColor}`}
                        >
                          {status}
                        </span>
                      </div>
                      <div className="col-start-3 flex gap-3">
                        <button
                          data-tooltip-id="update-schedule"
                          className="text-primary-800 p-2"
                          onClick={() => updateScheduleOpen(event)}
                        >
                          {React.cloneElement(icons?.rescheduleIcon, {
                            size: 22,
                          })}
                        </button>
                        <ToggleSwitch
                          label="Done"
                          onChange={(e) => changeToggle(e, event)}
                          checked={toggleChange}
                        />
                      </div>
                    </div> */}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <ReactTooltip
        id="activity-schedule"
        place="top"
        content="Update Activity"
      />
      <ReactTooltip
        id="re-schedule"
        place="top"
        content="Reschedule Activity"
      />
      <Modal
        isOpen={activityIsModal}
        onClose={() => setActivityIsModal(false)}
        title="Update Activity"
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
            // disabled={true}
            validation={{ required: "Purpose is required" }}
            placeholder="Select Stage"
            iconLabel={React.cloneElement(icons.tag, { size: 20 })}
          />
          <div className="flex my-4 gap-3">
            {leadSourceList.map((option) => (
              <button
                key={option?.value}
                className={`chip cursor-not-allowed ${communicationMode == option?.value ? "active" : ""
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
                setActivityIsModal(false)
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
      </Modal>
      {/* reschedule Modal */}
      <Modal
        isOpen={rescheduleModalIsOpen}
        onClose={() => setRescheduleModalOpen(false)}
        title="Reschedule the Activity"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(scheduleUpdateHandler)}>
          <FormInput
            id="date"
            iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
            label="Date & Time"
            type="datetime-local"
            min={new Date().toISOString().slice(0, 16)} // Restrict past dates
            register={register}
            errors={errors}
            validation={{ required: "Schedule Date & Time is required" }}
          />
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
          <Select
            options={employeeList}
            label="Assignee"
            id="assignee"
            placeholder="Select Employee"
            iconLabel={React.cloneElement(icons.referenceIcon, { size: 20 })}
            register={register}
            errors={errors}
            validation={{ required: "Assignee is required" }}
          />
          <div className="col-span-12">
            {/* <TextArea
              id="reschedule_reason"
              iconLabel={icons.note}
              label="Reschedule Reason"
              validation={{ required: "Reschedule Reason is required" }}
              register={register}
              errors={errors}
            /> */}
            <SearchableSelect
              options={reallocatList}
              label=" Reschedule Reason"
              id="reschedule_reason"
              iconLabel={icons.note}
              register={register}
              validation={{
                required: "Reschedule Reason is required",
              }}
              errors={errors}
              setValue={setValue}
            />
          </div>
          <div className="flex gap-3 items-center mt-3">
            <IconButton
              type="button"
              icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
              onClick={() => {
                setRescheduleModalOpen(false);
                reset();
              }}
              disabled={isLoading}
            />
            <IconButton
              icon={icons?.Calender}
              label="Update Schedule"
              type="submit"
            />
          </div>
        </form>
      </Modal>
    </>
  );
}
