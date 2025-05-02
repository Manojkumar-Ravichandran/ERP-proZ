import React, { useState } from "react";
import icons from "../../contents/Icons";
import './MessageCard.css'
import InfoWithIcon from "../Text/InfoWithIcon/InfoWithIcon";
const MessageCard = ({
  title,
  description,
  linkText,
  linkIcon,
  scheduledDate,
  scheduledBy,
  onSaveDateTime,
  reschedule=false
}) => {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [editDateTime, setEditDateTime] = useState(false);
  const [newDateTime, setNewDateTime] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  const truncatedDescription = description?.length>40?  description.slice(0, 40) :description;

  const handleSave = () => {
    if (onSaveDateTime) onSaveDateTime(newDateTime);
    setSelectedDateTime(newDateTime); // Update selectedDateTime
    setEditDateTime(false);
  };

  return (
    <div className="border rounded-lg p-4 m-2 bg-gray-50">
      <div className="flex justify-between items-start">
        {/* Left Section */}
        <div className="flex">
          {/* Icon */}
          <div className="feildvisit text-center rounded-full p-3 w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-500">
            {linkIcon}
          </div>
          {/* Text Details */}
          <div className="ms-3">
            <p className="text-lg font-semibold flex items-center">
              {title}
            {
              linkText &&
              <span className="text-blue underline cursor-pointer text-sm flex items-center ms-2">
                {icons.filepin} {linkText}
              </span>
            }
            </p>
            <p className="text-gray-600 w-72">
              <label>Notes:</label>{" "}

              {isDescriptionExpanded ? description : `${truncatedDescription}...`}
              {description?.length>40 &&<span
                className="text-blue cursor-pointer ml-1"
                onClick={() => setDescriptionExpanded(!isDescriptionExpanded)}
              >
                {isDescriptionExpanded ? "Read Less" : "Read More"}
              </span>}
              
            </p>
          </div>
        </div>
        <div>
          <InfoWithIcon 
          icon={React.cloneElement(icons.profileIcon, { size: 20 })}
          colon={false}
          text="Jhon"
          />
        </div>

        {/* Right Section */}
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Next Schedule: <span className="font-medium">{scheduledDate}</span>
          </p>
          {reschedule&&<>
          <div className="mt-2 flex items-center justify-end gap-2">
            <p className="text-sm text-gray-600 mb-0">
              Rescheduled option:{" "}
              {selectedDateTime ? (
                <span className="font-medium">{selectedDateTime}</span>
              ) : (
                ""
              )}
            </p>
            <span
              className="cursor-pointer text-blue-500 flex items-center"
              onClick={() => setEditDateTime(true)} // State to toggle input field
            >
              {icons.pencil}
            </span>
          </div>
          {editDateTime && (
            <div className="mt-2 flex">
              <input
                type="datetime-local"
                className="border rounded-lg p-2 text-sm w-60"
                onChange={(e) => setNewDateTime(e.target.value)} // Function to capture input
              />
              <button
                className="px-3 ms-1 msg-btn border rounded-lg text-sm"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          )}
          </>}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
