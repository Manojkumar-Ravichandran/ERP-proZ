import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import ProfileCircle from "../../../../UI/ProfileCircle/ProfileCircle";
import { findFirstLetter } from "../../../../utils/Data";
import icons from "../../../../contents/Icons";
import { useNavigate } from "react-router";
import StatusManager from "../../../../UI/StatusManager/StatusManager";
import { H6 } from "../../../../UI/Heading/Heading";
import "./LeadDetailPanel.css";
import InfoWithIcon from "../../../../UI/Text/InfoWithIcon/InfoWithIcon";

import { useForm } from "react-hook-form";
import ViewHeadingContainer from "../../../CRM/Lead/Component/ViewHeadingContainer";
import IconWithInfo from "../../../CRM/Lead/Component/IconWithInfo";
import EditOtherDetails from "../../../CRM/Lead/Component/EditOtherDetails";
import EditLeadDetails from "../../../CRM/Lead/Component/EditLeadDetails";
import LeadActivityModal from "../../../CRM/Lead/Component/LeadActivityModal";

// import EditLeadDetails from "./EditLeadDetails";
// import EditOtherDetails from "./EditOtherDetails";
// import LeadActivityModal from "../LeadActivityModal";
export default function ProjectDetailLeft({ projectList }) {
    
    //   const leadDetail = useSelector((state) => state?.lead?.leadDetail?.data);
    //   const [leadIdColor, setLeadIdColor] = useState("");
    //   const [isModalOpen, setIsModalOpen] = useState(false);
    //   const {
    //     register,
    //     formState: { errors },
    //     control,
    //     setValue,
    //     reset,
    //     watch,
    //     handleSubmit,
    //   } = useForm();

    //   const navigate = useNavigate();
    return (
        <>
            <div className="ps-4 p-1 pt-4">
                <div className="profile__container flex gap-2 items-start">
                    <div className="flex gap-2 items-center grow">
                        <ProfileCircle letter={findFirstLetter(projectList?.customer_name, 2)} bgColor={"#fff3c4"} />
                        <div className="flex items-start">
                            <div className="flex flex-col">
                                <span className="text-black-80  text-lg font-bold flex">
                                {projectList?.customer_name?.charAt(0)?.toUpperCase() + projectList?.customer_name?.slice(1)}
                                </span>
                                <span className="text-gray-700 "> #{projectList?.cust_id}</span>
                            </div>
                            {/* <img src={images?.goldShield} alt="badge" /> */}
                        </div>
                    </div>
                    <div className="flex flex-col justify-end al items-end gap-3">
                        {/* <EditLeadDetails 
                             //  leadDetail={leadDetail} 
                          />               */}
                    </div>


                </div>
                <div className="flex justify-between mt-4 mb-8">
                    <div className="flex gap-2 items-center">

                        <span className="top-clr">
                            {React.cloneElement(icons.calendarWDate, { size: 24 })}
                        </span>
                        <span>{projectList?.start_date}</span>
                    </div>

                    <div className="flex  ">
                        <span className="top-clr">
                            {React.cloneElement(icons.phoneWithWave, { size: 24 })}
                        </span>
                        <span>{projectList?.contact}</span>
                    </div>

                </div>
                {/* <div className="action__container my-7 ">
             
             <LeadActivityModal id={"leadDetail?.id} leadData={leadDetail"} />
           </div> */}
                {/* <div className="contact__container mt-7">
             <ViewHeadingContainer
               title="Contact Details"
               editIcon={false}
             />
             <div className="p-3 pb-0">
             <IconWithInfo
                 icon={React.cloneElement(icons?.address, { size: 24 })}
                 iconClassName="top-clr bg-white-400 w-15 h-15 "
                 label="Adderss"
                 iconBgClass ="bg-white-400"
                 contentConClass="flex-col"
                 info={leadDetail?.address || ""}
               />
               <IconWithInfo
                 icon={React.cloneElement(icons?.email, { size: 24 })}
                 iconClassName="top-clr w-15 h-15 "
                 iconBgClass ="bg-white-400"
                 label="Email "
                 contentConClass="flex-col"
                 info={leadDetail?.email || ""}
               />
               <IconWithInfo
                 icon={React.cloneElement(icons?.phone, { size: 24 })}
                 iconClassName="top-clr bg-white-400 w-15 h-15 "
                 label="Phone Number"
                 iconBgClass ="bg-white-400"
                 contentConClass="flex-col"
                 info={leadDetail?.lead_contact || ""}
               />
               <IconWithInfo
                 icon={React.cloneElement(icons?.whatsapp, { size: 24 })}
                 iconClassName="top-clr bg-white-400 w-15 h-15 "
                 label="WhatsApp"
                 iconBgClass ="bg-white-400"
                 contentConClass="flex-col"
                 info={leadDetail?.whatsapp_contact || ""}
               />
             
             </div>
           </div> */}
                <div className="product__container mb-8">
                    <ViewHeadingContainer
                        title="Product Details"
                    //    editIcon={<EditOtherDetails leadData={"leadDetail"}/>}
                    />
                    <div className="mt-2 bg-l bg-white-400  rounded-2xl	">
                        <div className="p-3">
                            <IconWithInfo
                                //    icon={<Product />}
                                iconClassName="top-clr"
                                label="Product Name:"
                                info={projectList?.product_name || " "}
                                className="border-b"
                            />
                        </div>
                        <div className="grid grid-cols-2 p-3">
                            <IconWithInfo
                                icon={React.cloneElement(icons?.productValue, { size: 18 })}
                                iconClassName="top-clr"
                                label="Overall Area "
                                contentConClass="flex-col"
                                info={
                                    projectList && projectList.area ? (
                                        <>
                                            {projectList.area} {projectList.unit_name || "Sq. ft."}
                                        </>
                                    ) : (
                                        ""
                                    )
                                } />
                            <IconWithInfo
                                icon={React.cloneElement(icons?.widthScaleIcon, { size: 18 })}
                                iconClassName="top-clr"
                                label="Length"
                                contentConClass="flex-col"
                                info={
                                    projectList && projectList.length ? (
                                        <>
                                            {projectList.length} {projectList.unit_name || "Sq. ft."}
                                        </>
                                    ) : (
                                        ""
                                    )
                                }
                            />
                            <IconWithInfo
                                icon={React.cloneElement(icons?.lengthScaleIcon, { size: 22 })}
                                iconClassName="top-clr"
                                label="Width"
                                contentConClass="flex-col"
                                info={
                                    projectList && projectList.width ? (
                                        <>
                                            {projectList.width} {projectList.unit_name || "Sq. ft."}
                                        </>
                                    ) : (
                                        ""
                                    )
                                }

                            />
                            <IconWithInfo
                                icon={React.cloneElement(icons?.heightScaleIcon, { size: 22 })}
                                iconClassName="top-clr"
                                label="Height"
                                contentConClass="flex-col"
                                info={
                                    projectList && projectList.height ? (
                                        <>
                                            {projectList.height} {projectList.unit_name || "Sq. ft."}
                                        </>
                                    ) : (
                                        ""
                                    )
                                }
                            />
                            {/* <IconWithInfo
                   icon={React.cloneElement(icons?.area, { size: 22 })}
                   iconClassName="top-clr"
                   label="Area Type"
                   contentConClass="flex-col"
                   info={
                     leadDetail && leadDetail.area_type ? (
                       <>
                         {leadDetail.area_type} 
                       </>
                     ) : (
                       ""
                     )
                   }
                 /> */}
                        </div>
                    </div>
                </div>

                <div className="incharge__container mt-1">
                    <ViewHeadingContainer
                        title="Primary Incharge"
                    //    editIcon={<InchargeDetailEditForm leadData={leadDetails}/>}
                    />
                    <div className="pt-2 flex items-center gap-2">
                        <ProfileCircle
                            letter={findFirstLetter(projectList?.incharge_name, 2)}
                        />
                        <span className="text-lg font-semibold">
                            {projectList?.incharge_name}
                        </span>
                    </div>
                </div>
                {/* secondry in charge */}


            </div>
        </>
    );
}
