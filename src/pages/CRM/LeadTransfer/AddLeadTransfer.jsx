import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextArea from '../../../UI/Input/TextArea/TextArea';
import Modal from '../../../UI/Modal/Modal';
import IconButton from '../../../UI/Buttons/IconButton/IconButton';
import icons from '../../../contents/Icons';
import Select from '../../../UI/Select/SingleSelect';
import FormInput from '../../../UI/Input/FormInput/FormInput';
import { getDefaultDate, getDefaultDateTime } from '../../../utils/Data';
import { addleadbranchtransfer, getBranchListEffect } from '../../../redux/CRM/lead/LeadEffects';
import { getActivityReplayListEffect } from '../../../redux/common/CommonEffects';


const AddLeadTransfer = ({ itemModal, setItemModal, onClose, lead_uuid, setToastData }) => {
    const { register, handleSubmit, reset, setValue, formState: { errors }, watch } = useForm({
        defaultValues: {
            uuid: lead_uuid, // Set the UUID dynamically
            transfer_date: getDefaultDate(),
            type: "branch",
        },
    });
    console.log("lead_uuid", lead_uuid);
    const [loading, setLoading] = useState(false);
    const [branchList, setBranchList] = useState([]);

    const updateItem = async (data) => {
        setLoading(true);
        try {
            const result =await addleadbranchtransfer(data); 
            reset();
            setItemModal(false); 
            setToastData({
                type: result?.status,
                message: result?.message || "Lead transfer added successfully",
            });
        } catch (error) {
            setToastData({
                type: "error",
                message: "Failed to add lead transfer",
            });
        } finally {
            setLoading(false);
            if (onClose) onClose(); // Trigger the callback to refresh the list

        }
    };
      useEffect(() => {
        (async () => {
          try {
            let { data } = await getBranchListEffect();
            data = data.data.map((list) => ({
              ...list,
              label: list.name,
              value: list.id,
            }));
            setBranchList(data);
          } catch (error) {
            setBranchList([]);
          }
       
      })();}
         , []);
    return (
        <Modal
            isOpen={itemModal}
            onClose={() => {
                 reset();
                  if (onClose) onClose();
            }}
            title={"Lead Transfer"}
            showHeader
            size="m"
            showFooter={false}
        >
            <form onSubmit={handleSubmit(updateItem)}>
                <input type="hidden" {...register("uuid")} />
                <input type="hidden" {...register("type")} />

                <div className='flex flex-col gap-3'>
                    <FormInput
                        id="transfer_date"
                        iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
                        label="Transfer Date"
                        type="date"
                        register={register}
                        errors={errors}
                        validation={{ required: "Date is required" }}
                        min={getDefaultDate()}
                    />
                    <Select
                        options={branchList}
                        label="Branch"
                        id="branch"
                        register={register}
                        errors={errors}
                        validation={{ required: "branch is required" }}
                        placeholder="Select branch"
                    />
                    <TextArea
                        id="transfer_reason"
                        iconLabel={icons?.note}
                        label="Transfer Reason"
                        register={register}
                        errors={errors}
                        showStar={true}
                        showIcon={true}
                        defaultValue={watch("transfer_reason")}
                        validation={{ required: "Transfer reason is required" }}
                    />
                    <TextArea
                        id="other_reason"
                        iconLabel={icons?.note}
                        label="Other Reason"
                        register={register}
                        errors={errors}
                        showStar={false}
                        showIcon={true}
                        defaultValue={watch("other_reason")}
                        validation={{ required: false }}
                    />

                    <div className="flex gap-3">
                        <IconButton
                            type="submit"
                            icon={React.cloneElement(icons.plusIcon, { size: "20px" })}
                            label="Add  Transfer"
                            className="px-4 py-2"
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default AddLeadTransfer;