import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createCompSolutionEffect, complaintCloseEffect } from '../../../redux/CRM/lead/LeadEffects'; // Import both APIs
import TextArea from '../../../UI/Input/TextArea/TextArea';
import Modal from '../../../UI/Modal/Modal';
import IconButton from '../../../UI/Buttons/IconButton/IconButton';
import icons from '../../../contents/Icons';

const CompSolution = ({ itemModal, setItemModal, currentUuid, actionType, onClose }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      uuid: currentUuid, // Set the UUID dynamically
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset the form and set the UUID whenever the modal opens
    if (itemModal) {
      reset({ uuid: currentUuid });
    }
  }, [itemModal, currentUuid, reset]);

  const updateItem = async (data) => {
    setLoading(true);
    try {
      if (actionType === "solution") {
        await createCompSolutionEffect(data); // Call the API for "Solution"
      } else if (actionType === "close") {
        await complaintCloseEffect(data); // Call the API for "Close Complaint"
      }
      reset();
      setItemModal(false); // Close the modal after submission
      if (onClose) onClose(); // Trigger the callback to refresh the list

    } catch (error) {
      console.error(`Error updating item for ${actionType}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={itemModal}
      onClose={() => {
        setItemModal(false); reset(); if (onClose) onClose(); // Trigger the callback to refresh the list
      }}
      title={actionType === "solution" ? "Update Solution" : "Close Complaint"} // Dynamic title
      showHeader
      size="m"
      showFooter={false}
    >
      <form onSubmit={handleSubmit(updateItem)}>
        <input type="hidden" {...register("uuid")} />
        <div>
          <TextArea
            label={actionType === "solution" ? "Solution" : "Close Reason"} // Dynamic label
            id={actionType === "solution" ? "solution" : "close_reason"} // Dynamic key
            placeholder={actionType === "solution" ? "Enter Solution..." : "Enter Close Reason..."} // Dynamic placeholder
            register={register}
            validation={{
              required: actionType === "solution"
                ? "Please Enter Solution"
                : "Please Enter Close Reason", // Dynamic validation message
            }}
            errors={errors}
          />
        </div>

        <div className="flex mt-4">
          <IconButton
            label="Submit"
            icon={icons.saveIcon}
            type="submit"
            loading={loading}
          />
        </div>
      </form>
    </Modal>
  );
};

export default CompSolution;