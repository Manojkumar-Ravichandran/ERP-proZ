import React, { useState } from "react";
import icons from "../../../../contents/Icons";
import ActionDropdown from "../../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import Modal from "../../../../UI/Modal/Modal";

export default function CustomerActionDropdown({ params }) {
 
  const [whatsappData,setWhatsAppData]= useState({show:false,loading:false,data:{}})
  const option = [
    {
      label: "Add Lead",
      action: "addLead",
      icon: React.cloneElement(icons.plusIcon, { size: 20 }),
    },
    {
      label: "WhatsApp Message",
      action: "whatsAppChat",
      icon: React.cloneElement(icons.whatsapp, { size: 20 }),
    },
    {
      label: "Mail Message",
      action: "mailChat",
      icon: React.cloneElement(icons.mail, { size: 20 }),
    },
  ];
  const handleAction = (action, e) => {
    const {
      uuid,
      lead_name: name,
      email,
      lead_contact: contactNumber,
      whatsapp_contact: whatsappNumber,
      last_followup: lastFollowup,
      incharge_name: incharge,
      stage_name: stage,
      lead_id: id,
      status,
    } = e?.data || {};

    if (action === "addLead" && uuid) {
      // setIsQuickViewModal({
      //   isOpen: true,
      //   data: {
      //     uuid,
      //     name,
      //     email,
      //     contactNumber,
      //     whatsappNumber,
      //     lastFollowup,
      //     incharge,
      //     stage,
      //     id,
      //     status,
      //   },
      // });
    } 
    else if (action === "whatsAppChat" && uuid) {
      setWhatsAppData({...whatsappData,show:true})
      
    } else if (action === "activity") {
      // setIsModalOpenActivity(true);
      // activitySetValue("date", getDefaultDateTime());
      // activitySetValue("stages_id", 2);
      // activitySetValue("send_msg", true);
    } else {
      
    }
  };
  return (
    <>
      <ActionDropdown
        options={option}
        onAction={(e) => handleAction(e, params)}
      />
      <Modal
        isOpen={whatsappData?.show}
        onClose={() => setWhatsAppData({...whatsappData, show: false })}
        title="Quick Edit"
        showHeader
        size="m"
        showFooter={false}
      >
        hi
      </Modal>
    </>
  );
}
