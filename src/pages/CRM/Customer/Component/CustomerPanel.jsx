import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfileCircle from "../../../../UI/ProfileCircle/ProfileCircle";
import { findFirstLetter, findSpecificIdDatas } from "../../../../utils/Data";
import {
  AddLead,
  AddNotes,
  CustomerDataEdit,
  MailMessage,
  WhatsAppMessage,
} from "./CustomerModal";
import ViewHeadingContainer from "../../Lead/Component/ViewHeadingContainer";
import IconWithInfo from "../../Lead/Component/IconWithInfo";
import icons from "../../../../contents/Icons";
import "../Customer.css";
import CircleIconBtn from "../../../../UI/Buttons/CircleIconBtn/CircleIconBtn";

export default function CustomerPanel() {
  const customerDetails = useSelector(
    (state) => state?.customer?.customerDetail?.data
  );
  const [customerDetail, setCustomerDetail] = useState();
  useEffect(() => {
    setCustomerDetail(customerDetails);
  }, [customerDetails]);

  return (
    <>
      <div className="ps-4 p-1 pt-4">
        <div className="profile__container flex gap-2 items-start">
          <div className="flex gap-2 items-center grow">
            <ProfileCircle
              letter={findFirstLetter(customerDetail?.name, 2)}
              bgColor={`#${customerDetail?.colour_code?.trim()}` || "#fff3c4"}
            />
            <span className="text-black-800 text-lg font-bold flex">
              {customerDetail?.name}
            </span>
          </div>
          <div>
            <CustomerDataEdit customerDetails={customerDetail} />
          </div>
        </div>
        <div className="contact__container mt-7">
          <ViewHeadingContainer title="Contact Details" editIcon={false} />
          <div className="p-3 pb-0">
            <IconWithInfo
              icon={React.cloneElement(icons?.email, { size: 24 })}
              iconClassName="top-clr w-15 h-15 "
              iconBgClass="bg-white-400"
              label="Email "
              contentConClass="flex-col"
              info={customerDetail?.email || ""}
            />
            <IconWithInfo
              icon={React.cloneElement(icons?.phone, { size: 24 })}
              iconClassName="top-clr bg-white-400 w-15 h-15 "
              label="Phone Number"
              iconBgClass="bg-white-400"
              contentConClass="flex-col"
              info={customerDetail?.contact || ""}
            />
            <IconWithInfo
              icon={React.cloneElement(icons?.whatsapp, { size: 24 })}
              iconClassName="top-clr bg-white-400 w-15 h-15 "
              label="WhatsApp"
              iconBgClass="bg-white-400"
              contentConClass="flex-col"
              info={customerDetail?.whatsapp_contact || ""}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between border-t py-2">
            <div className="flex flex-wrap gap-7">
              <AddLead selectedCustomer={customerDetail} />

              <WhatsAppMessage selectedCustomer={customerDetail} />
              <MailMessage selectedCustomer={customerDetail} />
              <AddNotes selectedCustomer={customerDetail} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
