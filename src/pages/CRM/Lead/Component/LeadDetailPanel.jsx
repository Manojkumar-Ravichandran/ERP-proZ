import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import ProfileCircle from "../../../../UI/ProfileCircle/ProfileCircle";
import { useSelector } from "react-redux";
import { findFirstLetter, findSpecificIdDatas } from "../../../../utils/Data";
import EditLeadDetails from "./EditLeadDetails";
import { images } from "../../../../contents/Images";
import LeadActivityModal from "./LeadActivityModal";
import icons from "../../../../contents/Icons";
import CircleIconBtn from "../../../../UI/Buttons/CircleIconBtn/CircleIconBtn";
import ViewHeadingContainer from "./ViewHeadingContainer";
import EditOtherDetails from "./EditOtherDetails";
import IconWithInfo from "./IconWithInfo";
import Product from "../../../../assets/img/product";
import { ContactDetailEditForm, InchargeDetailEditForm, ReferenceEditForm, SecInchargeDetailEditForm } from "./EditForms";
import { referralList } from "../../../../contents/DropdownList";

export default function LeadDetailPanel() {
  const leadDetails = useSelector((state) => state?.lead?.leadDetail?.data);
  const [leadDetail, setLeadDetail] = useState();
  
const [refenece,setReference ]=useState()
  useEffect(() => {
    setLeadDetail(leadDetails);
    getReference()
  }, [leadDetails]);
 const getReference=()=>{
  if(leadDetails?.reference_type){
    const selectedLead = findSpecificIdDatas(referralList,leadDetails?.reference_type)
    setReference(selectedLead?.label)
  }else{
    setReference("No")
  }
  }

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
  return (
    <>
      <div className="ps-4 p-1 pt-4">
        <div className="profile__container flex gap-2 items-start">
          <div className="flex gap-2 items-center grow">
            <ProfileCircle letter={findFirstLetter(leadDetail?.lead_name, 2)} bgColor={`#${leadDetail?.colour_code?.trim()}`||"#fff3c4"}/>
            <div className="flex items-start">
              <div className="flex flex-col">
                <span className="text-black-800 text-lg font-bold flex">
                  {leadDetail?.lead_name}
                </span>
                <span className="text-gray-700 "> #{leadDetail?.lead_id}</span>
              </div>
              <img src={images?.goldShield} alt="badge" />
            </div>
          </div>
          <div className="flex flex-col justify-end al items-end gap-3">
                   <EditLeadDetails />
            <div className="flex gap-2">
              <span className="top-clr">
                {React.cloneElement(icons.phoneWithWave, { size: 24 })}
              </span>
              <span>{leadDetail?.lead_contact}</span>
            </div>
          </div>
        </div>
        <div className="action__container my-7 ">
          
          <LeadActivityModal id={leadDetail?.id} leadData={leadDetail} />
        </div>
        <div className="contact__container mt-7">
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
        </div>
        <div className="product__container">
          <ViewHeadingContainer
            title="Product Details"
            editIcon={<EditOtherDetails leadData={leadDetail}/>}
          />
          <div className="mt-2 bg-l bg-white-400  rounded-2xl	">
            <div className="p-3">
              <IconWithInfo
                icon={React.cloneElement(icons.materialToolIcon)}
                iconClassName="top-clr"
                label="Product Name:"
                info={leadDetail?.material_details_name || " "}
                className="border-b"
              />
               <IconWithInfo
                icon={React.cloneElement(icons.roofIcon)}
                iconClassName="top-clr"
                label="Roofing Type:"
                info={leadDetail?.product_name || " "}
                className="border-b"
              />
               <IconWithInfo
                icon={React.cloneElement(icons.projectIcon)}
                iconClassName="top-clr"
                label="Purpose:"
                info={leadDetail?.lead_purpose_name || " "}
                className="border-b"
              />
            </div>
            <div className="grid grid-cols-2 p-3">
              <IconWithInfo
                icon={React.cloneElement(icons?.productValue, { size: 18 })}
                iconClassName="top-clr"
                label="Project Value"
                contentConClass="flex-col"
                info={`Rs. ${leadDetail?.lead_value ?? ""}`}
              />
              <IconWithInfo
                icon={React.cloneElement(icons?.widthScaleIcon, { size: 18 })}
                iconClassName="top-clr"
                label="Length"
                contentConClass="flex-col"
                info={
                  leadDetail && leadDetail.length ? (
                    <>
                      {leadDetail.length} {leadDetail.unit_name || ""}
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
                  leadDetail && leadDetail.width ? (
                    <>
                      {leadDetail.width} {leadDetail.unit_name || ""}
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
                  leadDetail && leadDetail.height ? (
                    <>
                      {leadDetail.height} {leadDetail.unit_name || ""}
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
            title="Incharge"
            editIcon={<InchargeDetailEditForm leadData={leadDetails}/>}
          />
          <div className="pt-2 flex items-center gap-2">
            <ProfileCircle
              letter={findFirstLetter(leadDetail?.sec_incharge_name, 2)}
            />
            <span className="text-lg font-semibold">
              {leadDetail?.sec_incharge_name}
            </span>
          </div>
        </div>
        {/* secondry in charge */}
        {/* {leadDetail?.sec_incharge_name != null && (
        <div className="incharge__container mt-1">
          <ViewHeadingContainer
            title="Secondary Incharge"
            editIcon={<SecInchargeDetailEditForm leadData={leadDetails}/>}
          />
          <div className="pt-2 flex items-center gap-2">
            <ProfileCircle
              letter={findFirstLetter(leadDetail?.sec_incharge_name, 2)}
            />
            <span className="text-lg font-semibold">
              {leadDetail?.sec_incharge_name}
            </span>
          </div>
        </div>
        )} */}
        <div className="reference__container mt-7">
        <ViewHeadingContainer
            title="Reference Details"
            editIcon={<ReferenceEditForm leadData={leadDetail}/>}
          />
          {/* <div className="">
          <IconWithInfo
                icon={React.cloneElement(icons?.user,{size:24})}
                iconClassName="top-clr bg-white-400 w-15 h-15"
                label={<div><span>Referred : </span> <span className="top-clr">{leadDetail?.reference_type||"No"}</span></div>}
                info={leadDetail?.referal_employee_name ||leadDetail?.referal_platform ||""}
                className="px-1"
                contentConClass="flex-col"
              />
          </div> */}
          <div className="">
  <IconWithInfo
    icon={React.cloneElement(icons?.user, { size: 24 })}
    iconClassName="top-clr bg-white-400 w-15 h-15"
    label={
      <div>
        <span>Referred: </span> 
        <span className="top-clr">{leadDetail?.reference_type || "No"}</span>
      </div>
    }
    info={
      ["architect", "engineer"].includes(leadDetail?.reference_type) 
        ? leadDetail?.referal_name 
        : ["social_media", "employee"].includes(leadDetail?.reference_type) 
          ? leadDetail?.referal_platform 
          : ""
    }
    className="px-1"
    contentConClass="flex-col"
  />
</div>

        
        </div>

      </div>
    </>
  );
}
