import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import ProfileCircle from "../../../../UI/ProfileCircle/ProfileCircle";
import { findFirstLetter } from "../../../../utils/Data";
import IconOnlyBtn from "../../../../UI/Buttons/IconOnlyBtn/IconOnlyBtn";
import icons from "../../../../contents/Icons";
import { useNavigate } from "react-router";
import StatusManager from "../../../../UI/StatusManager/StatusManager";
import { stageBadgeColor } from "../../../../contents/BadgeColor";
import IconRoundedBtn from "../../../../UI/Buttons/IconRoundedBtn/IconRoundedBtn";
import { H6 } from "../../../../UI/Heading/Heading";
import "./LeadDetailPanel.css";
import InfoWithIcon from "../../../../UI/Text/InfoWithIcon/InfoWithIcon";
import Modal from "../../../../UI/Modal/Modal";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import { useForm } from "react-hook-form";
import { validationPatterns } from "../../../../utils/Validation";
import Customer from "../../Customer/Customer";
import TextArea from "../../../../UI/Input/TextArea/TextArea";
import EditLeadDetails from "./EditLeadDetails";
import EditOtherDetails from "./EditOtherDetails";
import LeadActivityModal from "../LeadActivityModal";
import { Link } from "react-router-dom";
export default function LeadDetailPanel() {
  const leadDetail = useSelector((state) => state?.lead?.leadDetail?.data);
  const [leadIdColor, setLeadIdColor] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    formState: { errors },
    control,
    setValue,
    reset,
    watch,
    handleSubmit,
  } = useForm();

  const navigate = useNavigate();

  useEffect(() => {
    if (!leadDetail) return;

    setLeadIdColor(
      leadDetail?.is_closed === 0
        ? "text-yellow-500"
        : leadDetail?.is_closed === 1 && leadDetail?.is_closed_type == "won"
        ? "text-green-500"
        : "text-red-500"
    );
  }, [leadDetail]);

  const renderContactInfo = useCallback(() => {
    if (!leadDetail) return null;

    const { lead_contact, whatsapp_contact } = leadDetail;
    const contactInfo = [
      {
        icon: icons.call,
        text: lead_contact,
        condition: lead_contact !== whatsapp_contact,
      },
      { icon: icons.whatsapp, text: whatsapp_contact },
    ];

    return contactInfo
      .filter((info) => info.text && info.condition !== false)
      .map(({ icon, text }, idx) => (
        <p key={idx} className="flex items-center">
          {icon}
          <span className="ms-2 text-sm">{text}</span>
        </p>
      ));
  }, [leadDetail]);

  const actionButtons = [
    { icon: icons.whatsapp, tooltip: "Whatsapp", className: "whatsapp" },
    { icon: icons.mail, tooltip: "Mail", className: "mail" },
    { icon: icons.file, tooltip: "File", className: "file" },
    { icon: icons.note, tooltip: "Note", className: "note" },
    { icon: icons.GoNote, tooltip: "Activity", className: "feildvisit" },
  ];

  const navigateToEdit = () =>
    navigate("/user/crm/lead/update-lead", { state: leadDetail });

  return (
    <>
      <div className="bg-white p-4 rounded-lg darkCardBg">
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex  items-center">
              <ProfileCircle letter={findFirstLetter(leadDetail?.lead_name)} />
              <div className="text-lg font-semibold grid">
                <div className="flex items-center ">
                  <button className="capitalize underline">
                    {leadDetail?.lead_name}
                  </button>
                </div>
                <span className={`text-sm ${leadIdColor}`}>
                  #{leadDetail?.lead_id}
                </span>
              </div>
            </div>
            <EditLeadDetails />
          </div>

          {/* Contact Info Section */}
          <div className="pt-2 callDetail">
            <p className="flex items-center pe-2">
              {icons.mail}{" "}
              <span className="mx-1 text-sm custom-divider1">
                {leadDetail?.email}
              </span>
              {leadDetail?.lead_contact == leadDetail?.whatsapp_contact ? (
                <span className="ms-2 flex">
                  {" "}
                  {icons.whatsappIcon}{" "}
                  <span className="ms-1 text-sm">
                    {leadDetail?.lead_contact}
                  </span>
                </span>
              ) : (
                <>
                  <span className="ms-2 flex">
                    {icons.call}
                    <span className="ms-1 text-sm custom-divider1">
                      {leadDetail?.lead_contact}
                    </span>
                  </span>
                  <span className="ms-2 flex">
                    {icons.whatsappIcon}
                    <span className="ms-1 text-sm">
                      {leadDetail?.whatsapp_contact}
                    </span>
                  </span>
                </>
              )}
            </p>
            {/* {renderContactInfo()} */}
            {/* <p className="text-sm flex items-center gap-1 mx-0">
              {React.cloneElement(icons.locationIcon, { size: 18 })}{" "}
              <span>
                {leadDetail?.address || "1/2"}{" "}
                {leadDetail?.district && `, ${leadDetail?.district}`}{" "}
                {leadDetail?.state && `, ${leadDetail?.state}`}{" "}
                {leadDetail?.pincode && `, ${leadDetail?.pincode}`}
              </span>
            </p> */}
          </div>
          <div className="flex text-center relative">
            <div className="pe-4 grid custom-divider">
              <span className="small-title">Incharge</span>
              <span>{leadDetail?.incharge_name || "N/A"}</span>
            </div>
            <div className="px-4 grid custom-divider">
              <span className="small-title">Status</span>
              <StatusManager
                className="rounded-full border-green-400 border"
                status="success"
                message={leadDetail?.status || "Active"}
              />
            </div>
            <div className="px-4 grid">
              <span className="small-title">Stages</span>
              {(() => {
                const statusMapping = {
                  New: "success",
                  Enquiry: "warning",
                  Lost: "error",
                  FollowUp: "inprogress",
                  Quotation: "info",
                };
                const status = leadDetail?.stage_name;
                const statusClass = statusMapping[status];

                return (
                  <StatusManager
                    status={statusClass}
                    message={leadDetail?.stage_name || "N/A"}
                  />
                );
              })()}
            </div>
          </div>
          <LeadActivityModal id={leadDetail?.id} leadData={leadDetail} />
          {/* <Customer /> */}
          <hr />
          {/* Other Details Section */}
          <div className="leading-3">
            {/* Header */}
            <div className="flex justify-between mb-1">
              <H6>Product Details</H6>
              <EditOtherDetails />
            </div>
            {/* Product Name */}
            <InfoWithIcon
              icon={React.cloneElement(icons.roofIcon, { size: 20 })}
              label="Product Name"
              oneLine
              text={leadDetail?.product_name}
              className="mb-3"
            />

            {/* Dimensions */}
            <div className="gap-2 mb-2">
              {/* Width */}
              <div className="flex items-center mb-2">
                <div className="flex items-center gap-2">
                  <label className="flex items-center font-medium gap-2">
                    {React.cloneElement(icons.widthScaleIcon, { size: 20 })}{" "}
                    Width:
                  </label>
                </div>
                <span className="text-gray-900">
                  {leadDetail?.width} {leadDetail?.unit_name}
                </span>
              </div>

              {/* Length */}
              <div className="flex items-center mb-2">
                <div className="">
                  <label className="flex items-center font-medium gap-2">
                    {React.cloneElement(icons.lengthScaleIcon, { size: 20 })}{" "}
                    Length:
                  </label>
                </div>
                <span className="text-gray-900">
                  {leadDetail?.length} {leadDetail?.unit_name}
                </span>
              </div>

              {/* Height */}
              <div className="flex items-center">
                <div className="">
                  <label className="flex items-center gap-2 font-medium">
                    {React.cloneElement(icons.heightScaleIcon, { size: 20 })}{" "}
                    Height:
                  </label>
                </div>
                <span className="text-gray-900">
                  {" "}
                  {leadDetail?.height}
                  {leadDetail?.unit_name}
                </span>
              </div>
            </div>
          </div>
          <hr />
          <div className="leading-3">
            {/* Header */}
            <div className="flex justify-between mb-1">
              <H6>Reference Details</H6>
              <EditOtherDetails />
            </div>
            {/* Product Name */}
            <InfoWithIcon
              icon={React.cloneElement(icons.referenceIcon, { size: 20 })}
              label="Referred"
              oneLine
              text={"Employee - Anu"}
              className="mb-3"
            />
          </div>
        </div>
      </div>
    </>
  );
}
