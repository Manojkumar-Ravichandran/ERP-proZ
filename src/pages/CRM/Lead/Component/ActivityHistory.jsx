import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import icons from "../../../../contents/Icons";
import {
  convertActivityTime,
  convertToIST,
  TformatDateToYYYYMMDDWTime,
} from "../../../../utils/Date";
import { padgeColorList } from "../../../../contents/Colors";
import { images } from "../../../../contents/Images";
import "../Lead.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import ReadMore from "../../../../UI/ReadMore/ReadMore";
import Modal from "../../../../UI/Modal/Modal";
import { useForm } from "react-hook-form";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import Select from "../../../../UI/Select/SingleSelect";
import TextArea from "../../../../UI/Input/TextArea/TextArea";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import { setLeadDetailInprogress } from "../../../../redux/CRM/lead/LeadActions";
import "./LeadDetailPanel.css";
import StatusContainer from "../../../../UI/StatusContainer/StatusContainer";
import { LeadHistoryUpdate } from "../../../../redux/CRM/lead/LeadEffects";

export default function ActivityHistory({ showOnlyFirst = false }) {
  const [timeline, setTimeline] = useState();
  const dispatch = useDispatch();
  const timelines = useSelector(
    (state) => state?.lead?.leadDetail?.followup?.data
  );
  const total = useSelector((state) => state.lead?.leadDetail?.followup?.total);
  const closedtype = useSelector((state) => state.lead?.leadDetail?.data?.is_closed);
  const leadData = useSelector((state) => state?.lead?.leadDetail);
  const [expandedCards, setExpandedCards] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [EditModalIsOpen, setEditModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] =useState();
  const [toastData,setToastData]= useState({show:false})
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
    setValue: activitySetValue,
    formState: { errors: activityError },
    handleSubmit: activityHandleSubmit,
    reset: activityReset,
  } = useForm();
  const iconsList = {
    Email: icons.mail,
    WhatsApp: icons.whatsappIcon,
    Message: icons.messageIcon,
    Direct: icons.directIcon,
    Phone: icons.call,
  };
  const buttonStyle = {
    color: "blue",
    fontSize: ".85rem",
    // Add any other CSS styles as needed
  };
  useEffect(() => {
    setTimeline(timelines);
  }, [timelines, currentPage]);

  const toggleCard = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  useEffect(() => {
    if (timelines) {
      if (showOnlyFirst) {
        const filteredTimelines = {};
        // Keep only the first item for each category
        if (timelines?.today?.length > 0) {
          filteredTimelines.today = timelines.today.slice(0, 1);
        } else if (
          timelines?.today?.length == 0 &&
          timelines?.this_week?.length > 0
        ) {
          filteredTimelines.this_week = timelines.this_week.slice(0, 1);
        } else if (
          timelines?.today?.length == 0 &&
          timelines?.this_week?.length == 0 &&
          timelines?.this_month?.length > 0
        ) {
          filteredTimelines.this_week = timelines.this_month.slice(0, 1);
        } else if (
          timelines?.today?.length == 0 &&
          timelines?.this_week?.length == 0 &&
          timelines?.this_month?.length == 0 &&
          timelines?.earlier?.length > 0
        ) {
          filteredTimelines.this_week = timelines.earlier.slice(0, 1);
        }
        setTimeline(filteredTimelines);
      } else {
        setTimeline(timelines);
      }
    }
  }, [timelines, showOnlyFirst, currentPage]);
  const loadMoreItems = () => {    
    const payload = {
      uuid: leadData?.data?.uuid,
      stages: "",
      fp_length: Number(leadData?.followup?.per_page) + 10,
    };
    dispatch(setLeadDetailInprogress(payload));
    // setCurrentPage((prev) => prev + 1);
  };
  if (!timeline) return null;
  const itemsPerPage = 1;
  const UpdateActivityHandler = async(data) => {
    const payload={
      uuid:selectedActivity?.uuid,
      ...data
    }
    try {
      const result = await LeadHistoryUpdate(payload);
        if (result.data.status === "success") {
          setToastData({
            show: true,
            type: result?.data?.status,
            message: result?.data?.message,
          });
        }
    }catch(error){
        setToastData({
          show: true,
          type: error?.data?.status,
          message: error?.data?.message,
        });
      

    }finally {
      setEditModalOpen(false);
      setSelectedActivity('');
      activityReset();
      const dataLoad ={
        uuid:leadData?.data?.uuid,
        stage:""
      }
      dispatch(setLeadDetailInprogress(dataLoad))
    }
   
   };   
   
 
  const closeEditModelClose =()=>{
    setEditModalOpen(false)
    setSelectedActivity('');
  }
  const  findLocation =(latitude,longitude)=>{
   return `https://www.google.com/maps?q=${latitude},${longitude}`
  }
  return (
    <>
      <div className="font-semibold  mt-4 pe-2">History <span className="px-2 rounded-full p-0.5 bg-gray-200 text-sm font-normal"> {total}</span></div>
      {/* {timeline?.today?.length == 0 && timeline?.earlier?.length == 0 && (
        <>
          <p className="mb-2 text-center text-gray-600 flex flex-col items-center">
            <img
              src={images?.noData}
              alt="No have Upcoming Activity"
              className="w-20"
            />
            No have Activity History
          </p>
        </>
      )} */}
      {timeline?.today?.length > 0 && (
        <>
          <p className="text-md flex items-center gap-1 text-gray-600 font-normal py-2">
            <span className="top-clr font-bold">{icons.TbCalendarWeek}</span>{" "}
            Today
          </p>
          <div className="relative">
            {timeline?.today.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 relative">
                {/* Vertical Line */}
                {index !== timeline?.today?.length - 1 && (
                  <div className="absolute left-9 top-10 h-full w-px bg-gray-300 z-0 line"></div>
                )}
                {/* Date Section */}
                <div className="grid justify-items-center w-20">
                  <span className="icon-top-clr p-2 inline-block rounded-full border-0">
                    {activity?.mode_communication_name
                      ? React.cloneElement(
                        icons[
                        activity?.mode_communication_name.toLowerCase()
                        ],
                        { size: 20 }
                      )
                      : React.cloneElement(icons["call"], { size: 20 })}
                  </span>
                  <span className="font-semibold text-xs pt-2">
                    {(() => {
                      const date = new Date(activity?.date);
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = date.toLocaleString("en-US", {
                        month: "short",
                      });
                      const year = String(date.getFullYear()).slice(-2);
                      return `${day} ${month} ${year}`;
                    })()}
                  </span>
                </div>

                {/* Activity Card */}
                <div className="darkCardBg rounded-lg border my-2 w-full">
                  {/* Header Section */}
                  <div className="flex justify-between items-center p-2">
                    <div className="details px-2 text-lg flex font-medium mb-1 items-center">
                      {/* Clickable Stages Name */}
                      <span
                        className="underline cursor-pointer"
                        onClick={() => toggleCard(index)}
                      >
                        {activity.stages_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                    {activity.latitude &&activity.longitude && (
                        <span
                          className="top-clr rounded-full border p-2 cursor-pointer"
                          data-tooltip-id="location"
                        >
                          <a
                            href={findLocation(activity.latitude,activity.longitude)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {React.cloneElement(icons?.locationIcon, { size: 18 })}{" "}
                          </a>
                        </span>
                      )}
                      
                      {activity.file_url && (
                        <span
                          className="top-clr rounded-full border p-2 cursor-pointer"
                          data-tooltip-id="file"
                        >
                          <a
                            href={activity.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {React.cloneElement(icons.filepin, { size: 18 })}{" "}
                          </a>
                        </span>
                      )}
                     <span
                        className={`top-clr rounded-full border p-2 ${closedtype === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                          }`}
                        data-tooltip-id="edit-notes"
                        onClick={(e) => {
                          if (closedtype !== 1) {
                            activitySetValue("notes",activity?.notes);
                            setSelectedActivity(activity)
                            setEditModalOpen(true);
                          }
                        }}
                      >
                        {React.cloneElement(icons.editIcon, { size: 18 })}
                      </span>
                    </div>
                  </div>
                  <hr />

                  {/* Main Content Section */}
                  <ReadMore
                    className="font-normal p-4 text-sm"
                    maxWords={20}
                    text={activity?.content_reply_name}
                  />

                  {/* Replay & Notes Section - Expandable */}
                  {expandedCards[index] && (
                    <div className="p-3">
                      {/* Replay Icon */}
                      {activity?.customer_reply_name && (
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center">
                            <span className="top-clr p-2 inline-block rounded-full border">
                              {React.cloneElement(icons["replay"], { size: 18 })}
                            </span>
                            <span className="text-sm mt-2">Replay</span>
                          </div>
                          <div className="grow">
                            <ReadMore
                              className="darkCardBg rounded-lg border p-4 text-sm mb-4"
                              maxWords={15}
                              text={activity?.customer_reply_name}
                            />
                          </div>
                        </div>
                      )}

                      {/* Notes Icon */}
                      {activity?.notes && (
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                            <span className="top-clr p-2 inline-block rounded-full border">
                              {React.cloneElement(icons["note"], { size: 18 })}
                            </span>
                            <span className="text-sm mt-2">Notes</span>
                          </div>
                          <div className="grow">
                            <ReadMore
                              className="darkCardBg rounded-lg border p-4 text-sm mb-4"
                              maxWords={15}
                              text={activity?.notes}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer Section */}
                  <div className="flex justify-between bg-gray-100 p-2 rounded-b-md">
                    <div className="flex gap-2">
                      <span className="flex items-center gap-2">
                        <span className="top-clr">{icons.employeeIcon}</span>{" "}
                        {activity?.next_assign_name}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="top-clr">{icons.timeIcon}</span>
                        {(() => {
                          const date = new Date(activity?.date);
                          const time = date.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          });
                          return time;
                        })()}
                      </span>
                    </div>
                    {activity?.is_schedule &&<div className="flex gap-1 items-center tex-sm">
                      <span className="top-clr">{React.cloneElement(icons.calendarCheck,{size:20})} </span>
                      Scheduled
                    </div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {/*week  */}
      {timeline?.this_week?.length > 0 && (
        <>
          <p className="text-md flex items-center gap-1 text-gray-600 font-normal py-2">
            <span className="top-clr font-bold">{icons.TbCalendarWeek}</span>{" "}
            This Week
          </p>
          <div className="relative">
            {timeline?.this_week.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 relative">
                {/* Vertical Line */}
                {index !== timeline?.this_week?.length - 1 && (
                  <div className="absolute left-9 top-10 h-full w-px bg-gray-300 z-0 line"></div>
                )}
                {/* Date Section */}
                <div className="grid justify-items-center w-20">
                  <span className="icon-top-clr p-2 inline-block rounded-full border-0">
                    {activity?.mode_communication_name
                      ? React.cloneElement(
                        icons[
                        activity?.mode_communication_name.toLowerCase()
                        ],
                        { size: 20 }
                      )
                      : React.cloneElement(icons["call"], { size: 20 })}
                  </span>
                  <span className="font-semibold text-xs pt-2">
                    {(() => {
                      const date = new Date(activity?.date);
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = date.toLocaleString("en-US", {
                        month: "short",
                      });
                      const year = String(date.getFullYear()).slice(-2);
                      return `${day} ${month} ${year}`;
                    })()}
                  </span>
                </div>

                {/* Activity Card */}
                <div className="darkCardBg rounded-lg border my-2 w-full">
                  {/* Header Section */}
                  <div className="flex justify-between items-center p-2">
                    <div className="details px-2 text-lg flex font-medium mb-1 items-center">
                      {/* Clickable Stages Name */}
                      <span
                        className="underline cursor-pointer"
                        onClick={() => toggleCard(index)}
                      >
                        {activity.stages_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                    {activity.latitude &&activity.longitude && (
                        <span
                          className="top-clr rounded-full border p-2 cursor-pointer"
                          data-tooltip-id="location"
                        >
                          <a
                            href={findLocation(activity.latitude,activity.longitude)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {React.cloneElement(icons?.locationIcon, { size: 18 })}{" "}
                          </a>
                        </span>
                      )}
                      {activity.file_url && (
                        <span
                          className="top-clr rounded-full border p-2 cursor-pointer"
                          data-tooltip-id="file"
                        >
                          <a
                            href={activity.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {React.cloneElement(icons.filepin, { size: 18 })}{" "}
                          </a>
                        </span>
                      )}
                      <span
                        className={`top-clr rounded-full border p-2 ${closedtype === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                          }`}
                        data-tooltip-id="edit-notes"
                        onClick={(e) => {
                          if (closedtype !== 1) {                            
                            activitySetValue("notes",activity?.notes);
                            setSelectedActivity(activity)

                            setEditModalOpen(true);
                          }
                        }}
                      >
                        {React.cloneElement(icons.editIcon, { size: 18 })}
                      </span>
                      {/* <span
                        className="top-clr rounded-full border p-2 cursor-pointer"
                        data-tooltip-id="edit-notes"
                        onClick={() => {
                          setEditModalOpen(true);
                        }}
                      >
                        {React.cloneElement(icons.editIcon, { size: 18 })}
                      </span> */}
                    </div>
                  </div>
                  <hr />

                  {/* Main Content Section */}
                  <ReadMore
                    className="font-normal p-4 text-sm"
                    maxWords={20}
                    text={activity?.content_reply_name}
                  />

                  {/* Replay & Notes Section - Expandable */}
                  {expandedCards[index] && (
                    <div className="p-3">
                      {/* Replay Icon */}
                      {activity?.customer_reply_name && (
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center">
                            <span className="top-clr p-2 inline-block rounded-full border">
                              {React.cloneElement(icons["replay"], { size: 18 })}
                            </span>
                            <span className="text-sm mt-2">Replay</span>
                          </div>
                          <div className="grow">
                            <ReadMore
                              className="darkCardBg rounded-lg border p-4 text-sm mb-4"
                              maxWords={15}
                              text={activity?.customer_reply_name}
                            />
                          </div>
                        </div>
                      )}

                      {/* Notes Icon */}
                      {activity?.notes && (
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                            <span className="top-clr p-2 inline-block rounded-full border">
                              {React.cloneElement(icons["note"], { size: 18 })}
                            </span>
                            <span className="text-sm mt-2">Notes</span>
                          </div>
                          <div className="grow">
                            <ReadMore
                              className="darkCardBg rounded-lg border p-4 text-sm mb-4"
                              maxWords={15}
                              text={activity?.notes}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer Section */}
                  <div className="flex justify-between bg-gray-100 p-2 rounded-b-md">
                    <div className="flex gap-2">
                      <span className="flex items-center gap-2">
                        <span className="top-clr">{icons.employeeIcon}</span>{" "}
                        {activity?.next_assign_name}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="top-clr">{icons.timeIcon}</span>
                        {(() => {
                          const date = new Date(activity?.date);
                          const time = date.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          });
                          return time;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {/* month */}
      {timeline?.this_month?.length > 0 && (
        <>
          <p className="text-md flex items-center gap-1 text-gray-600 font-normal py-2">
            <span className="top-clr font-bold">{icons.TbCalendarWeek}</span>{" "}
            This Month
          </p>
          <div className="relative">
            {timeline?.this_month.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 relative">
                {/* Vertical Line */}
                {index !== timeline?.this_month?.length - 1 && (
                  <div className="absolute left-9 top-10 h-full w-px bg-gray-300 z-0 line"></div>
                )}
                {/* Date Section */}
                <div className="grid justify-items-center w-20">
                  <span className="icon-top-clr p-2 inline-block rounded-full border-0">
                    {activity?.mode_communication_name
                      ? React.cloneElement(
                        icons[
                        activity?.mode_communication_name.toLowerCase()
                        ],
                        { size: 20 }
                      )
                      : React.cloneElement(icons["call"], { size: 20 })}
                  </span>
                  <span className="font-semibold text-xs pt-2">
                    {(() => {
                      const date = new Date(activity?.date);
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = date.toLocaleString("en-US", {
                        month: "short",
                      });
                      const year = String(date.getFullYear()).slice(-2);
                      return `${day} ${month} ${year}`;
                    })()}
                  </span>
                </div>

                {/* Activity Card */}
                <div className="darkCardBg rounded-lg border my-2 w-full">
                  {/* Header Section */}
                  <div className="flex justify-between items-center p-2">
                    <div className="details px-2 text-lg flex font-medium mb-1 items-center">
                      {/* Clickable Stages Name */}
                      <span
                        className="underline cursor-pointer"
                        onClick={() => toggleCard(index)}
                      >
                        {activity.stages_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                    {activity.latitude &&activity.longitude && (
                        <span
                          className="top-clr rounded-full border p-2 cursor-pointer"
                          data-tooltip-id="location"
                        >
                          <a
                            href={findLocation(activity.latitude,activity.longitude)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {React.cloneElement(icons?.locationIcon, { size: 18 })}{" "}
                          </a>
                        </span>
                      )}
                      {activity.file_url && (
                        <span
                          className="top-clr rounded-full border p-2 cursor-pointer"
                          data-tooltip-id="file"
                        >
                          <a
                            href={activity.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {React.cloneElement(icons.filepin, { size: 18 })}{" "}
                          </a>
                        </span>
                      )}
                      <span
                        className={`top-clr rounded-full border p-2 ${closedtype === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                          }`}
                        data-tooltip-id="edit-notes"
                        onClick={() => {
                          if (closedtype !== 'lost') {
                            activitySetValue("notes",activity?.notes);
                            setSelectedActivity(activity)

                            setEditModalOpen(true);

                          }
                        }}
                      >
                        {React.cloneElement(icons.editIcon, { size: 18 })}
                      </span>
                      {/* <span
                        className="top-clr rounded-full border p-2 cursor-pointer"
                        data-tooltip-id="edit-notes"
                        onClick={() => {
                          setEditModalOpen(true);
                        }}
                      >
                        {React.cloneElement(icons.editIcon, { size: 18 })}
                      </span> */}
                    </div>
                  </div>
                  <hr />

                  {/* Main Content Section */}
                  <ReadMore
                    className="font-normal p-4 text-sm"
                    maxWords={20}
                    text={activity?.content_reply_name}
                  />
                  {/* Replay & Notes Section - Expandable */}
                  {expandedCards[index] && (
                    <div className="p-3">
                      {/* Replay Icon */}
                      {activity?.customer_reply_name && (
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center">
                            <span className="top-clr p-2 inline-block rounded-full border">
                              {React.cloneElement(icons["replay"], { size: 18 })}
                            </span>
                            <span className="text-sm mt-2">Replay</span>
                          </div>
                          <div className="grow">
                            <ReadMore
                              className="darkCardBg rounded-lg border p-4 text-sm mb-4"
                              maxWords={15}
                              text={activity?.customer_reply_name}
                            />
                          </div>
                        </div>
                      )}

                      {/* Notes Icon */}
                      {activity?.notes && (
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                            <span className="top-clr p-2 inline-block rounded-full border">
                              {React.cloneElement(icons["note"], { size: 18 })}
                            </span>
                            <span className="text-sm mt-2">Notes</span>
                          </div>
                          <div className="grow">
                            <ReadMore
                              className="darkCardBg rounded-lg border p-4 text-sm mb-4"
                              maxWords={15}
                              text={activity?.notes}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer Section */}
                  <div className="flex justify-between bg-gray-100 p-2 rounded-b-md">
                    <div className="flex gap-2">
                      <span className="flex items-center gap-2">
                        <span className="top-clr">{icons.employeeIcon}</span>{" "}
                        {activity?.next_assign_name}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="top-clr">{icons.timeIcon}</span>
                        {(() => {
                          const date = new Date(activity?.date);
                          const time = date.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          });
                          return time;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {/* earlier */}
      {timeline?.earlier?.length > 0 && (
        <>
          <p className="text-md flex items-center gap-1 text-gray-600 font-normal py-2">
            <span className="top-clr font-bold">{icons.TbCalendarWeek}</span>{" "}
             Earlier          </p>
          <div className="relative">
            {timeline?.earlier.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 relative">
                {/* Vertical Line */}
                {index !== timeline?.earlier?.length - 1 && (
                  <div className="absolute left-9 top-10 h-full w-px bg-gray-300 z-0 line"></div>
                )}
                {/* Date Section */}
                <div className="grid justify-items-center w-20">
                  <span className="icon-top-clr p-2 inline-block rounded-full border-0">
                    {activity?.mode_communication_name
                      ? React.cloneElement(
                        icons[
                        activity?.mode_communication_name.toLowerCase()
                        ],
                        { size: 20 }
                      )
                      : React.cloneElement(icons["call"], { size: 20 })}
                  </span>
                  <span className="font-semibold text-xs pt-2">
                    {(() => {
                      const date = new Date(activity?.date);
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = date.toLocaleString("en-US", {
                        month: "short",
                      });
                      const year = String(date.getFullYear()).slice(-2);
                      return `${day} ${month} ${year}`;
                    })()}
                  </span>
                </div>

                {/* Activity Card */}
                <div className="darkCardBg rounded-lg border my-2 w-full">
                  {/* Header Section */}
                  <div className="flex justify-between items-center p-2">
                    <div className="details px-2 text-lg flex font-medium mb-1 items-center">
                      {/* Clickable Stages Name */}
                      <span
                        className="underline cursor-pointer"
                        onClick={() => toggleCard(index)}
                      >
                        {activity.stages_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                    {activity.latitude &&activity.longitude && (
                        <span
                          className="top-clr rounded-full border p-2 cursor-pointer"
                          data-tooltip-id="location"
                        >
                          <a
                            href={findLocation(activity.latitude,activity.longitude)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {React.cloneElement(icons?.locationIcon, { size: 18 })}{" "}
                          </a>
                        </span>
                      )}
                      {activity.file_url && (
                        <span
                          className="top-clr rounded-full border p-2 cursor-pointer"
                          data-tooltip-id="file"
                        >
                          <a
                            href={activity.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {React.cloneElement(icons.filepin, { size: 18 })}{" "}
                          </a>
                        </span>
                      )}
                      <span
                        className={`top-clr rounded-full border p-2 ${closedtype === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                          }`}
                        data-tooltip-id="edit-notes"
                        onClick={() => {
                          if (closedtype !== 1) {
                            activitySetValue("notes",activity?.notes)
                            setSelectedActivity(activity)

                            setEditModalOpen(true);
                          }
                        }}
                      >
                        {React.cloneElement(icons.editIcon, { size: 18 })}
                      </span>
                    </div>
                  </div>
                  <hr />

                  {/* Main Content Section */}
                  <ReadMore
                    className="font-normal p-4 text-sm"
                    maxWords={20}
                    text={activity?.content_reply_name}
                  />
                  {/* Replay & Notes Section - Expandable */}
                  {expandedCards[index] && (
                    <div className="p-3">
                      {/* Replay Icon */}
                      {activity?.customer_reply_name && (
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center">
                            <span className="top-clr p-2 inline-block rounded-full border">
                              {React.cloneElement(icons["replay"], { size: 18 })}
                            </span>
                            <span className="text-sm mt-2">Replay</span>
                          </div>
                          <div className="grow">
                            <ReadMore
                              className="darkCardBg rounded-lg border p-4 text-sm mb-4"
                              maxWords={15}
                              text={activity?.customer_reply_name}
                            />
                          </div>
                        </div>
                      )}

                      {/* Notes Icon */}
                      {activity?.notes && (
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                            <span className="top-clr p-2 inline-block rounded-full border">
                              {React.cloneElement(icons["note"], { size: 18 })}
                            </span>
                            <span className="text-sm mt-2">Notes</span>
                          </div>
                          <div className="grow">
                            <ReadMore
                              className="darkCardBg rounded-lg border p-4 text-sm mb-4"
                              maxWords={15}
                              text={activity?.notes}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer Section */}
                  <div className="flex justify-between bg-gray-100 p-2 rounded-b-md">
                    <div className="flex gap-2">
                      <span className="flex items-center gap-2">
                        <span className="top-clr">{icons.employeeIcon}</span>{" "}
                        {activity?.next_assign_name}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="top-clr">{icons.timeIcon}</span>
                        {(() => {
                          const date = new Date(activity?.date);
                          const time = date.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          });
                          return time;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!showOnlyFirst &&
        leadData?.followup?.total > leadData?.followup?.per_page ? (
        <div className="flex justify-center">
          <button
            className="top-clr my-2 p-2 font-medium bg-gray-100 rounded-md flex items-center"
            onClick={loadMoreItems}
          >
            Show More <span className="ps-1"> {icons.arrowdown}</span>
          </button>
        </div>
      ) : (
        <>
          {/* {!showOnlyFirst && */}
            <>
              <StatusContainer
                icon={React.cloneElement(icons?.timeIcon, { size: 20 })}
                content="Lead Created On:"
                time={leadData?.data?.created_at}
              />
            </>
          {/* } */}
        </>

      )}

      <ReactTooltip id="file" place="top" content="View File" />
      <ReactTooltip id="location" place="top" content="View location" />
      <ReactTooltip id="edit-notes" place="top" content="Edit" />
      <Modal
        isOpen={EditModalIsOpen}
        onClose={() => closeEditModelClose()}
        title="Edit Activity"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={activityHandleSubmit(UpdateActivityHandler)}>
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
          <div className="flex gap-3 mt-3">
            <IconButton
              type="button"
              icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
            />
            <IconButton
              type="submit"
              icon={React.cloneElement(icons.saveIcon, { size: "20px" })}
              label="Update"
              className="px-4 py-2"
            />
          </div>
        </form>
      </Modal>
    </>
  );
}
