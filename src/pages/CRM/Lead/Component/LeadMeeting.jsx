import React, { useEffect, useState } from "react";
import { getLeadMeetingListEffect } from "../../../../redux/CRM/lead/LeadEffects";
import { convertDateTimeYMDToDMY, DBtimeConvert } from "../../../../utils/Date";
import { padgeColorList } from "../../../../contents/Colors";
import icons from "../../../../contents/Icons";
import ReadMore from "../../../../UI/ReadMore/ReadMore";
import { useSelector, useDispatch } from "react-redux";
import {
  convertActivityTime,
  convertToIST,
  TformatDateToYYYYMMDDWTime,
} from "../../../../utils/Date";
import { images } from "../../../../contents/Images";
import "../Lead.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Modal from "../../../../UI/Modal/Modal";
import { useForm } from "react-hook-form";
import TextArea from "../../../../UI/Input/TextArea/TextArea";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import "./LeadDetailPanel.css";
import { mergeRefs } from "rsuite/esm/internals/utils";

export default function LeadMeeting({ uuid }) {
  const [meetingList, setMeetingList] = useState([]);
  const [EditModalIsOpen, setEditModalOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const closedtype = useSelector(
    (state) => state.lead?.leadDetail?.data?.is_closed
  );
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
    reset: activityReset,
  } = useForm();
  const toggleCard = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const UpdateActivityHandler = () => {};

  useEffect(() => {
    if (uuid) {
      (async () => {
        const payload = { uuid };
        const { data } = await getLeadMeetingListEffect({ ...payload });
        setMeetingList(data.data);
      })();
    }
  }, []);
  return (
//     <>
//       {meetingList.length > 0 && (
//         <>
//           {meetingList.map((meeting, index) => (
//             <div className="" key={meeting?.uuid} id={meeting?.id}>
//               <div className="flex items-center gap-2 py-2" key={meeting.id}>
//                 <div className="grid justify-items-center w-20">
//                   <span className="icon-top-clr p-2 inline-block rounded-full border-0">
//                     {meeting?.mode_communication_name
//                       ? React.cloneElement(
//                           icons[meeting?.mode_communication_name.toLowerCase()],
//                           { size: 20 }
//                         )
//                       : React.cloneElement(icons["call"], { size: 20 })}
//                   </span>
//                   <span className="font-semibold text-xs pt-2">
//                     {/* {(() => {
//                       const date = new Date(meeting?.created_at);
//                       const day = String(date.getDate()).padStart(2, '0');
//                       const month = date.toLocaleString('en-US', { month: 'short' });
//                       const year = String(date.getFullYear()).slice(-2);
//                       return `${day} ${month} ${year}`;
//                     })()} */}
//                   </span>
//                 </div>
//                 {/* Activity Card */}
//                 <div className="darkCardBg rounded-lg border my-2 w-full">
//                   {/* Header Section */}
//                   <div className="flex justify-between items-center p-2">
//                     <div className="details px-2 text-lg flex font-medium mb-1 items-center">
//                       {/* Clickable Stages Name */}
//                       <span
//                         className={
//                           meeting?.reschedule_id
//                             ? "underline cursor-pointer"
//                             : ""
//                         }
//                         // onClick={() => toggleCard(index)}
//                       >
//                         <a href={`#${meeting?.reschedule_id}`}>
//                           {meeting.mode_communication_name}
//                         </a>
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       {meeting.file_url && (
//                         <span
//                           className="top-clr rounded-full border p-2 cursor-pointer"
//                           data-tooltip-id="file"
//                         >
//                           <a
//                             href={meeting.file_url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             {React.cloneElement(icons.filepin, { size: 18 })}{" "}
//                           </a>
//                         </span>
//                       )}
//                       {/* <span
//                         className={`top-clr rounded-full border p-2 ${closedtype === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
//                           }`}
//                         data-tooltip-id="edit-notes"
//                         onClick={() => {
//                           if (closedtype !== 1) {
//                             setEditModalOpen(true);
//                           }
//                         }}
//                       >
//                         {React.cloneElement(icons.editIcon, { size: 18 })}
//                       </span> */}
//                     </div>
//                   </div>
//                   <hr />

//                   {/* Main Content Section */}
//                   <ReadMore
//                     className="font-normal p-4 text-sm"
//                     maxWords={20}
//                     text={meeting?.reschedule_reason}
//                   />

//                   {/* Replay & Notes Section - Expandable */}
//                   {expandedCards[index] && (
//                     <div className="p-3">
//                       {/* Replay Icon */}
//                       {meeting?.customer_reply_name && (
//                         <div className="flex items-center gap-3">
//                           <div className="flex flex-col items-center">
//                             <span className="top-clr p-2 inline-block rounded-full border">
//                               {React.cloneElement(icons["replay"], {
//                                 size: 18,
//                               })}
//                             </span>
//                             <span className="text-sm mt-2">Replay</span>
//                           </div>
//                           <div className="grow">
//                             <ReadMore
//                               className="darkCardBg rounded-lg border p-4 text-sm mb-4"
//                               maxWords={15}
//                               text={meeting?.customer_reply_name}
//                             />
//                           </div>
//                         </div>
//                       )}
// {/* {meeting?.notes} */}
//                       {/* Notes Icon */}
//                       {meeting?.notes && (
//                         <div className="flex items-center gap-4">
//                           <div className="flex flex-col items-center">
//                             <span className="top-clr p-2 inline-block rounded-full border">
//                               {React.cloneElement(icons["note"], { size: 18 })}
//                             </span>
//                             <span className="text-sm mt-2">Notes</span>
//                           </div>
//                           <div className="grow">
//                             <ReadMore
//                               className="darkCardBg rounded-lg border p-4 text-sm mb-4"
//                               maxWords={15}
//                               text={meeting?.notes}
//                             />
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Footer Section */}
//                   <div className="flex justify-between bg-gray-100 p-2 rounded-b-md">
//                     <div className="flex gap-2">
//                       <span className="flex items-center gap-2">
//                         <span className="top-clr">{icons.employeeIcon}</span>{" "}
//                         {meeting?.next_assign_name}
//                       </span>
//                       <span className="flex items-center gap-2">
//                         <span className="top-clr">{icons.timeIcon}</span>
//                         {meeting?.reschedule_id?(<>
//                           {convertDateTimeYMDToDMY(
//                             meeting?.reschedule_date,
//                             true,
//                             false
//                           )}
//                         </>):(
//                           <>
//                           {convertDateTimeYMDToDMY(
//                           meeting?.date,
//                           true,
//                           false
//                         )}
//                           </>
//                         )
//                         }
                        
//                       </span>
//                     </div>
//                     {meeting?.reschedule_id ? (
//                       <div className="text-sm flex gap-2">
//                         <div className="flex gap-1">
//                           <span className="top-clr">
//                             {React.cloneElement(icons.TbCalendarTime, {
//                               size: 20,
//                             })}
//                           </span>
//                           <span>
//                             {convertDateTimeYMDToDMY(
//                               meeting?.date,
//                               false,
//                               true
//                             )}
//                           </span>
//                         </div>
//                         <div className="flex gap-1">
//                           <span className="top-clr">
//                             {React.cloneElement(icons.calendarCheck, {
//                               size: 20,
//                             })}
//                           </span>
//                           <span>
//                             {convertDateTimeYMDToDMY(
//                               meeting?.reschedule_date,
//                               false,
//                               true
//                             )}
//                           </span>
//                         </div>
//                       </div>
//                     ) : (
//                       <>
//                         <div className="flex gap-1">
//                           <span className="top-clr">
//                             {React.cloneElement(icons.calendarCheck, {
//                               size: 20,
//                             })}
//                           </span>
//                           <span>
//                             {convertDateTimeYMDToDMY(
//                               meeting?.date,
//                               false,
//                               true
//                             )}
//                           </span>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </>
//       )}

//       {meetingList?.length == 0 && (
//         <p className=" text-center">There are no Meeting available.</p>
//       )}
//       <ReactTooltip id="file" place="top" content="View File" />
//       <ReactTooltip id="edit-notes" place="top" content="Edit" />
//       <Modal
//         isOpen={EditModalIsOpen}
//         onClose={() => setEditModalOpen(false)}
//         title="Edit Activity"
//         showHeader
//         size="m"
//         showFooter={false}
//       >
//         <form onSubmit={handleSubmit(UpdateActivityHandler)}>
//           <div className="col-span-12">
//             <TextArea
//               id="notes"
//               iconLabel={icons.note}
//               label="Notes"
//               validation={{ required: "Notes is required" }}
//               register={activityRegister}
//               errors={activityError}
//             />
//           </div>
//           <div className="flex gap-3 mt-3">
//             <IconButton
//               type="button"
//               icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
//               label="Cancel"
//               className="px-4 py-2 btn_cancel"
//             />
//             <IconButton
//               type="submit"
//               icon={React.cloneElement(icons.plusIcon, { size: "20px" })}
//               label="Update"
//               className="px-4 py-2"
//             />
//           </div>
//         </form>
//       </Modal>
//     </>
<>
{meetingList.length > 0 && (
  <>
     {meetingList.map((call, index) => (
      <div className="" key={call?.uuid}>
        <div className="flex items-center gap-2 py-2" key={call.id}>
          <div className="grid justify-items-center w-20">
            <span className="icon-top-clr p-2 inline-block rounded-full border-0">
              {call?.mode_communication_name
                ? React.cloneElement(
                  icons[call?.mode_communication_name.toLowerCase()],
                  { size: 20 }
                )
                : React.cloneElement(icons["call"], { size: 20 })}
            </span>
            <span className="font-semibold text-xs pt-2">
              {(() => {
                const date = new Date(call?.created_at);
                const day = String(date.getDate()).padStart(2, '0');
                const month = date.toLocaleString('en-US', { month: 'short' });
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
                  {call.mode_communication_name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {call.file_url && (
                  <span
                    className="top-clr rounded-full border p-2 cursor-pointer"
                    data-tooltip-id="file"
                  >
                    <a
                      href={call.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {React.cloneElement(icons.filepin, { size: 18 })}{" "}
                    </a>
                  </span>
                )}
                {/* <span
                  className={`top-clr rounded-full border p-2 ${closedtype === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                    }`}
                  data-tooltip-id="edit-notes"
                  onClick={() => {
                    if (closedtype !== 1) {
                      setEditModalOpen(true);
                    }
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
              text={call?.content_reply_name}
            />

            {/* Replay & Notes Section - Expandable */}
            {expandedCards[index] && (
              <div className="p-3">
                {/* Replay Icon */}
                {call?.customer_reply_name && (
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
                        text={call?.customer_reply_name}
                      />
                    </div>
                  </div>
                )}

                {/* Notes Icon */}
                {call?.notes && (
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
                        text={call?.notes}
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
                  {call?.next_assign_name}
                </span>
                <span className="flex items-center gap-2">
                  <span className="top-clr">{icons.timeIcon}</span>
                  {(() => {
                    const date = new Date(call?.date);
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
        </div >
      </div>
    ))}
  </>
)}

{meetingList?.length == 0 && (
  <p className=" text-center">There are no Call available.</p>
)}
<ReactTooltip id="file" place="top" content="View File" />
<ReactTooltip id="edit-notes" place="top" content="Edit" />
<Modal
  isOpen={EditModalIsOpen}
  onClose={() => setEditModalOpen(false)}
  title="Edit Activity"
  showHeader
  size="m"
  showFooter={false}
>
  <form onSubmit={handleSubmit(UpdateActivityHandler)}>
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
        icon={React.cloneElement(icons.plusIcon, { size: "20px" })}
        label="Update"
        className="px-4 py-2"
      />
    </div>
  </form>
</Modal>
</>
  );
}
