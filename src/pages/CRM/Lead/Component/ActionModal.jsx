import React, { useState } from 'react'
import ActionDropdown from '../../../../UI/AgGridTable/ActionDropdown/ActionDropdown'
import icons from '../../../../contents/Icons';
import Modal from '../../../../UI/Modal/Modal';

export default function ActionModal() {
    const [isQuickViewModal, setIsQuickViewModal] =useState(false)

    const handleAction = (action) => {
        switch (action) {
          case "view":
            setIsQuickViewModal(true)
            break;
          case 'edit':
            break;
          case "delete":
            
            break;
          default:
            
        }
      };

      

      const option = [
        { label: "Quick View", action: "view", icon: icons.viewIcon, },
        { label: "Quick Edit", action: "edit", icon: icons.pencil },
        { label: "Add Activity", action: "activity", icon: icons.note },
        { label: "Add Quotation", action: "quotation", icon: icons.quotationIcon },
      ];
      
  return (
    <>
    <ActionDropdown options={option} onAction={handleAction} />

    <Modal
        isOpen={isQuickViewModal}
        onClose={() => setIsQuickViewModal(false)}
        title="Compose Mail"
        showHeader
        size="m"
        showFooter={false}
      >
        hi
    </Modal>
    </>
  )
}
