import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import Modal from "../../../UI/Modal/Modal";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { getTransactionMatsterCreateEffect, getTransactionMatsterUpdateEffect } from "../../../redux/Account/Transactions/Transaction";
import StaticAccountsData from "./StaticAccountsData";
import SingleCheckbox from "../../../UI/Input/CheckBoxInput/SingleCheckbox";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import { createAccountMasterEffect } from "../../../redux/Account/Accounts/AccountsEffects";
const CreateAccountsMaster = ({ isCreateModal, setIsCreateModal, onClose, setToastData, IsUpdate = false,
    data = null, }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        watch,
        setValue,
        clearErrors,
    } = useForm();
    useEffect(() => {
        if (IsUpdate && data) {
            setValue("uuid", data.uuid || "");
            setValue("type", data.type || "");
            setValue("natureofaccount", data.natureofaccount || "");
            setValue("majorHead", data.majorHead || "");
            setValue("subHead", data.subHead || "");
            setValue("isDepreciationApplicable", data.depreciation === "Applicable");
            setValue("isTDSApplicable", data.tds === "Yes");
        }
        else if (!IsUpdate && data) {
            setValue("uuid", "");
            setValue("type", data.type || "");
            setValue("natureofaccount", "");
            setValue("majorHead", "");
            setValue("subHead", "");
            setValue("isDepreciationApplicable", false);
            setValue("isTDSApplicable", false);
        }

        else {
            reset();
        }
    }, [IsUpdate, data, setValue, reset]);

    const [showOtherNature, setShowOtherNature] = useState(false);
    const [showOtherMajor, setShowOtherMajor] = useState(false);
    const [showOtherSub, setShowOtherSub] = useState(false);
    const [previousNatureofaccount, setPreviousNatureofaccount] = useState("");
    const [previousMajorHead, setPreviousMajorHead] = useState("");
    const [previousSubHead, setPreviousSubHead] = useState("");

    const natureOfAccountValue = watch("natureofaccount");
    const majorHeadValue = watch("majorHead");
    const subHeadValue = watch("subHead");

    const submitFormHandler = async (data) => {
        console.log("Account Master data", data);
        
        try {
            if (IsUpdate) {
                const updatePayload = {
                    uuid: data.uuid, // Assuming `uuid` is part of the `data` object
                    type: data.type,
                    name: data.name,
                    depreciation: data.isDepreciationApplicable ? "Applicable" : "Not Applicable",
                    tds: data.isTDSApplicable ? "Yes" : "No",
                };
                const updateDebitResponse = await getTransactionMatsterUpdateEffect(updatePayload); // Call the update API

                if (updateDebitResponse?.success) {
                    setToastData({
                        type: "success",
                        message: "Master entry updated successfully",
                    });
                } else {
                    throw new Error(updateDebitResponse?.message || "Failed to update master entry");
                }
            } else {
                // Create Debit API Call
                const createPayload = {

                    name: data.name,
                    section: data.section,
                    natureaccount: data.natureaccount,
                    natureaccount: data.natureaccount,
                    depreciation: data.isDepreciationApplicable ? "Applicable" : "Not Applicable",
                    tds: data.isTDSApplicable ? "Yes" : "No",
                };

                await createAccountMasterEffect(createPayload); // Call the create API
                setToastData({
                    type: "success",
                    message: "Master entry created successfully",
                });
            }

            reset();
            setIsCreateModal(false);
            if (onClose) onClose();
        } catch (error) {
            console.error("Error:", error);

            // Failure: Show error toast
            setToastData({
                type: "error",
                message: error?.response?.data?.message || error.message || "An error occurred",
            });
        }
        finally {
            reset();
            setIsCreateModal(false);
            if (onClose) onClose();
        }
    };

    // const natureOfAccountOptions = Array.from(
    //     new Set(StaticAccountsData.map(item => item.natureofaccount))
    //   ).map(nature => ({
    //     label: nature,
    //     value: nature,
    // }));

    const getUniqueOptions = (data, key) => {
        const uniqueValues = [...new Set(data.map(item => item[key]).filter(Boolean))];
        return uniqueValues.map(val => ({ label: val, value: val }));
      };
      
      const natureOfAccountOptions = getUniqueOptions(StaticAccountsData, "natureofaccount");
      const majorHeadOptions = getUniqueOptions(StaticAccountsData, "majorHead");
      const subHeadOptions = getUniqueOptions(StaticAccountsData, "subHead");


    return (
        <>
            <Modal  
                isOpen={isCreateModal}
                onClose={() => { setIsCreateModal(false); onClose() }}
                title={IsUpdate ? "Update Master data" : "Create Master Data "}
                showHeader
                size="m"
                showFooter={false}
                className="darkCardBg"
            >
                <form
                    onSubmit={handleSubmit(submitFormHandler)}
                >
                    <div className="mb-4">
                    <FormInput
                        id="natureofaccount"
                        label="Nature of Account"
                        placeholder="Select Nature of Account"
                        errors={errors}
                        register={register}
                        validation={{ required: "Please select Nature of Account" }}
                    />
                    </div>
                    
                    <div className="mb-4">
                    <FormInput
                        id="majorHead"
                        label="Major Head"
                        placeholder="Select Major Head"
                        errors={errors}
                        register={register}
                        validation={{ required: "Please select Major Head" }}
                    />
                    </div>
                    <div className="mb-4">
                    <FormInput
                        id="subHead"
                        label="Sub Head"
                        placeholder="Select Sub Head"
                        errors={errors}
                        register={register}
                        validation={{ required: "Please select Sub Head" }}
                    />
                    </div>
                    <div className="mb-4">
                    <SingleCheckbox
                        id="isDepreciationApplicable"
                        label="Depreciation is Applicable"
                        register={register}
                        defaultid={data?.isDepreciationApplicable}
                        errors={errors}
                    /></div>
                    <div className="mb-4">
                    <SingleCheckbox
                        id="isTDSApplicable"
                        label="TDS is Applicable"
                        register={register}
                        defaultid={data?.isTDSApplicable}
                        errors={errors}
                    /></div>
                    <div className="mb-4">
                    <TextArea
                        id="notes"
                        label="Notes"
                        placeholder="Enter notes"
                        register={register}
                        validation={{
                            maxLength: {
                            value: 500,
                            message: "Maximum 500 characters allowed"
                            }
                        }}
                        errors={errors}
                    /></div>
                    {/* <input
                        type="hidden"
                        id="type"
                        value={data?.type}
                    />
                    <input type="hidden" id="uuid" value={data?.uuid} /> */}
                    <input type="hidden" {...register("type")} />
                    <input type="hidden" {...register("uuid")} />
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="summit"
                            className="border border-gray-400 px-4 py-2 rounded"
                            onClick={() => {
                                reset();
                                setIsCreateModal(false);
                                if (onClose) onClose();
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default CreateAccountsMaster;
