import React, { useEffect, useState } from 'react'
import { getLeadMailListEffect } from '../../../../redux/CRM/lead/LeadEffects';
import { DBtimeConvert } from '../../../../utils/Date';
import { padgeColorList } from '../../../../contents/Colors';
import icons from '../../../../contents/Icons';
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

export default function LeadMail({ uuid }) {
  const [mailList, setMailList] = useState([]);
  const [EditModalIsOpen, setEditModalOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const closedtype = useSelector((state) => state.lead?.leadDetail?.data?.is_closed);
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
  const UpdateActivityHandler = () => { };

  useEffect(() => {
    if (uuid) {
      (async () => {
        const payload = { uuid };
        const { data } = await getLeadMailListEffect({ ...payload });
        setMailList(data.data);
      })();
    }
  }, []);
  return (
    <>
      {mailList.length > 0 && (
        <>
          {mailList.map((mail, index) => (
            <div className="" key={mail?.uuid}>
              <div className="flex items-center gap-2 py-2" key={mail.id}>
                <div className="grid justify-items-center w-20">
                  <span className="icon-top-clr p-2 inline-block rounded-full border-0">
                    {mail?.mode_communication_name
                      ? React.cloneElement(
                        icons[mail?.mode_communication_name.toLowerCase()],
                        { size: 20 }
                      )
                      : React.cloneElement(icons["call"], { size: 20 })}
                  </span>
                  <span className="font-semibold text-xs pt-2">
                    {(() => {
                      const date = new Date(mail?.created_at);
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
                        {mail.mode_communication_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {mail.file_url && (
                        <span
                          className="top-clr rounded-full border p-2 cursor-pointer"
                          data-tooltip-id="file"
                        >
                          <a
                            href={mail.file_url}
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
                    text={mail?.content_reply_name}
                  />

                  {/* Replay & Notes Section - Expandable */}
                  {expandedCards[index] && (
                    <div className="p-3">
                      {/* Replay Icon */}
                      {mail?.customer_reply_name && (
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
                              text={mail?.customer_reply_name}
                            />
                          </div>
                        </div>
                      )}

                      {/* Notes Icon */}
                      {mail?.notes && (
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
                              text={mail?.notes}
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
                        {mail?.next_assign_name}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="top-clr">{icons.timeIcon}</span>
                        {(() => {
                          const date = new Date(mail?.date);
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
                {/* <div className="activity__card grow darkCardBg mt-2 rounded-lg border gap-2 z-0 w-full">
                  <div className="flex">
                    <div className="grow w-full">
                      <div className="pb-3">
                        <ReadMore className="font-normal px-4 pt-3 text-sm" maxWords={23} text={mail?.notes} />
                      </div>
                      <div className="flex justify-between bg-gray-100 p-2 rounded-b-md ">
                        <div className="flex gap-2">
                          <span className="flex items-center gap-2">
                            <span className="top-clr"> {icons.employeeIcon}</span> <span className='text-sm'>{mail?.created_by || "Admin"}</span> </span>
                        </div>
                        <div>
                          <span className="flex items-center gap-2">
                            <span className="top-clr">{icons.timeIcon}</span>
                            <span className='text-sm'>
                            {(() => {
                              const date = new Date(mail?.date);
                              const time = date.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              });
                              return time;
                            })()}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div >
            </div>
          ))}
        </>
      )}

      {mailList?.length == 0 && (
        <p className=" text-center">There are no Mail available.</p>
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
  )
}
