import React, { useEffect, useState } from 'react'
import Modal from '../../../UI/Modal/Modal';
import FormInput from '../../../UI/Input/FormInput/FormInput';
import Select from '../../../UI/Select/SingleSelect';
import TextArea from '../../../UI/Input/TextArea/TextArea';
import IconButton from '../../../UI/Buttons/IconButton/IconButton';
import icons from '../../../contents/Icons';
import { useForm } from 'react-hook-form';
import { createComplaintEffect, getComplaintCategoryListEffect } from '../../../redux/CRM/lead/LeadEffects';
import { getDefaultDateTime } from '../../../utils/Data';
import SearchableSelector from '../../../UI/Select/selectBox';
import { getEmployeeListEffect } from '../../../redux/common/CommonEffects';

function AddComplaint({ itemModal, setItemModal, onClose, lead_uuid,setToastData }) {
    const [leadCompCategoryrList, setLeadCompCategoryList] = useState([]);
    const [employeeList, setEmployeeList] = useState([])
    const {
        register: complaintRegister,
        formState: { errors: complaintError },
        handleSubmit: complaintHandleSubmit,
        setValue: complaintSetValue,
        watch: complaintWatch,
        reset: complaintReset,
        control: complaintControl,
    } = useForm(
        {
            defaultValues: {
                comp_date: getDefaultDateTime(),
                lead_id: lead_uuid,
            }
        });
    useEffect(() => {
        (async () => {
            try {
                let { data } = await getComplaintCategoryListEffect();
                data = data.data.map((list) => ({
                    ...list,
                    label: list.name,
                    value: list.id,
                }));
                setLeadCompCategoryList(data);
            } catch (error) {
                setLeadCompCategoryList([]);
            }
        })();
    }
        , []);
    useEffect(() => {
        (async () => {
            try {
                let { data } = await getEmployeeListEffect();
                data = data.data.map((list) => ({
                    ...list,
                    label: list.name,
                    value: list.id,
                }));
                setEmployeeList(data);
            } catch (error) {
                setEmployeeList([]);
            }
        })();
    }
        , []);

    const ComplaintHandler = async (data) => {
        try {
            // Call the API to create a complaint
            const response = await createComplaintEffect(data);

            setToastData({
                show: true,
                type: "success",
                message: response?.data?.message,
              });
            
          } catch (error) {
            setToastData({
              show: true,
              type: "error",
              message: error?.data?.message,
            });
          }
        finally {
            complaintReset();
            setItemModal(false);
            if (onClose) onClose();
        }
    };
    return (
        <Modal
            isOpen={itemModal}
            onClose={() => {
                setItemModal(false);
                // if (onClose) onClose();
                complaintReset();
            }
            }
            title="Add Complaint"
            showHeader
            size="m"
            showFooter={false}
        >
            <form onSubmit={complaintHandleSubmit(ComplaintHandler)}>
                <div className='flex flex-col gap-3'>
                    <FormInput
                        id="comp_date"
                        iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
                        label="Date & Time"
                        type="datetime-local"
                        register={complaintRegister}
                        errors={complaintError}
                        validation={{ required: "Date is required" }}
                        min={getDefaultDateTime()}
                    />
                    <Select
                        options={leadCompCategoryrList}
                        label="Complaint category"
                        id="comp_category"
                        register={complaintRegister}
                        errors={complaintError}
                        validation={{ required: "category is required" }}
                        placeholder="Select category"
                    // iconLabel={React.cloneElement(icons.tag, { size: 20 })}
                    />

                    <Select
                        options={
                            [
                                { label: "High", value: "high" },
                                { label: "Medium", value: "medium" },
                                { label: "Low", value: "low" },

                            ]
                        }
                        label="Priority"
                        id="comp_priority"
                        register={complaintRegister}
                        errors={complaintError}
                        validation={{ required: "Priority is required" }}
                        placeholder="Select Priority"
                        iconLabel={React.cloneElement(icons.tag, { size: 20 })}
                    />

                    <TextArea
                        id="comp_details"
                        iconLabel={icons?.note}
                        label="Complaint Details"
                        register={complaintRegister}
                        errors={complaintError}
                        showStar={true}
                        showIcon={true}
                        defaultValue={complaintWatch("comp_details")}
                        validation={{ required: "Details is required" }}
                    />
                    <SearchableSelector
                        errors={complaintError}
                        label="Employee"
                        id="comp_against"
                        options={employeeList}
                        placeholder="Select  Employee"
                        error={false}
                        searchable={true}
                        showStar={false}
                        register={complaintRegister}
                        validation={{ required: false }}
                        setValue={complaintSetValue}
                        defaultid={complaintWatch('employee')}                                            // defaultValue={vendorList?.find((vendor) => vendor?.value === watch('vendor'))} // Match the value
                        defaultValue={complaintWatch('employee')}
                    />
                    <input type="hidden" id="lead_id" />

                    <div className="flex gap-3">
                        <IconButton
                            type="submit"
                            icon={React.cloneElement(icons.plusIcon, { size: "20px" })}
                            label="Add Complaint"
                            className="px-4 py-2"
                        />
                    </div>
                </div>
            </form>


        </Modal >
    )
}

export default AddComplaint