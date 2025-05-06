import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import Modal from "../../../UI/Modal/Modal";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { getTransactionMatsterCreateEffect, getTransactionMatsterUpdateEffect } from "../../../redux/Account/Transactions/Transaction";
import SearchableSelector from "../../../UI/Select/selectBox";
import StaticAccountsData from "../AccountsMaster/StaticAccountsData";
const CreateHeadsData = ({ isCreateModal, setIsCreateModal, onClose, setToastData, IsUpdate = false,
    data = null, }) => {
        
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        setValue,
    } = useForm();
    
    useEffect(() => {
        if (IsUpdate && data) {
        const type = data.headType || "major";
        const name = type === "major" ? data.majorHead : data.subHead;

        setHeadType(type);
        setValue("uuid", data.uuid || "");
        setValue("type", data.type || "");
        setValue("name", name);

            const options = StaticAccountsData
            .map(item => ({
                label: type === "major" ? item.majorHead : item.subHead,
                value: type === "major" ? item.majorHead : item.subHead
            }))
            .filter(item => item.label);
        setHeadOptions(options);
        }
        else if (!IsUpdate && data) {
            setValue("uuid", "");
            setValue("type", data.type || "");
            setValue("sub", "");
        }

        else {
            reset();
        }
    }, [IsUpdate, data, setValue, reset]);

    const [headType, setHeadType] = useState("major");
    const [headOptions, setHeadOptions] = useState([]);


    const submitFormHandler = async (data) => {
        console.log("create sunb head",data);
        
        try {
            if (IsUpdate) {
                const updatePayload = {
                    uuid: data.uuid, // Assuming `uuid` is part of the `data` object
                    type: data.type,
                    subHead: data.subHead,
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
                    type: data.type,
                };

                await getTransactionMatsterCreateEffect(createPayload); // Call the create API
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



    return (
        <>
            <Modal
                isOpen={isCreateModal}
                onClose={() => { setIsCreateModal(false); onClose() }}
                title={IsUpdate ? (headType === "major" ? "Update Major Head data": "Update Sub Head data") : "Create Major & Sub Heads Data "}
                showHeader
                size="m"
                showFooter={false}
                className="darkCardBg"
            >
                <form
                    onSubmit={handleSubmit(submitFormHandler)}
                >
                    {!IsUpdate && (
                    <SearchableSelector
                        label="Major Head or SubHead"
                        id="headType"
                        options={[
                            { label: "Major Head", value: "major" },
                            { label: "Sub Head", value: "sub" },
                        ]}
                        setValue={(id, value) => {
                            setValue(id,value)
                        if (id === "headType") setHeadType(value);
                        }}
                        register={register}
                        validation={{ required: "Select Major or SubHead" }}
                        errors={errors}
                    />)}
                    {!IsUpdate ? (
                    <FormInput
                        label={headType === "major" ? "Major Head Name" : "Sub Head Name"}
                        id="name"
                        type="text"
                        placeholder={`Enter ${headType === "major" ? "Major" : "Sub"} Head Name`}
                        register={register}
                        validation={{ required: "Name is required" }}
                        errors={errors}
                    />
                ):(
                    <SearchableSelector
                        label={headType === "major" ? "Major Head Name" : "Sub Head Name"}
                        id="name"
                        type="text"
                        placeholder={`Enter ${headType === "major" ? "Major" : "Sub"} Head Name`}
                        register={register}
                        defaultValue={headType === "major"? data?.majorHead : data?.subHead}
                        setValue={setValue}
                        options={headOptions}
                        validation={{ required: "Name is required" }}
                        errors={errors}
                    />
                    )}
                    {!IsUpdate && (
                    <SearchableSelector
                        id="type"
                        label="Type"
                        options={[
                        { label: "Liability", value: "liability" },
                        { label: "Assets", value: "Assets" },
                        { label: "Expenses", value: "Expenses" },
                        { label: "Income", value: "Income" },
                        { label: "Others", value: "Others" },
                        ]}
                        placeholder="Select Type"
                        setValue={setValue}
                        register={register}
                        validation={{ required: "Type is required" }}
                        errors={errors}
                    />)}
                    <input
                        type="hidden"
                        id="type"
                        value={data?.type}
                    />
                    <input type="hidden" id="uuid" value={data?.uuid} />
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

export default CreateHeadsData;
