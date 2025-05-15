import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import Modal from "../../../UI/Modal/Modal";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { createMajorHeadEffect, createSubHeadEffect, getMajorHeadDropdownEffect, getNatureOfAccountDropdownEffect, updateMajorHeadEffect, updateSubHeadEffect } from "../../../redux/Account/Accounts/AccountsEffects";
const CreateMajorandSubHead = ({ isCreateModal, setIsCreateModal, onClose, setToastData, IsUpdate = false,
    data, activeTab }) => {

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        watch,
        setValue,
    } = useForm();

    useEffect(() => {
        if (IsUpdate && data) {

            const type = data.headType || "major";
            setHeadType(type);

            setValue("uuid", data.uuid || "");
            setValue("section", data.section || "");
            setValue("natureaccount", data.natureaccount || 1);

            if (type === "major") {
                setValue("name", data.name || "");
            } else if (type === "sub") {
                setValue("majorhead", data.id || "");
                setValue("name", data.name || "");
            }

        } else {
            const type = data?.headType || "major";
            setHeadType(type);
            reset();

            setValue("section", data?.section || activeTab);
            setValue("natureaccount", 1);
            if (type === "sub") {
                
                setValue("majorhead", data?.majorhead || "");
                setValue("id", data?.id || "");
            }
        }
    }, [IsUpdate, data, setValue, reset, activeTab]);


    const [loading, setLoading] = useState(false);
    const [headType, setHeadType] = useState("major");
    const [natureOptions, setNatureOptions] = useState(5);
    const [majorHeadOptions, setMajorHeadOptions] = useState([]);
    const [sectionOptions, setSectionOptions] = useState([]);


    useEffect(() => {
        fetchDropdownOptions();
    }, []);
    const fetchDropdownOptions = async () => {
        setLoading(true);
        try {
            const options = [
                { id: 1, label: "Assets", value: "assets" },
                { id: 2, label: "Income", value: "income" },
                { id: 3, label: "Expenses", value: "expenses" },
                { id: 4, label: "Liability", value: "liability" }
            ];

            const activeTabOption = options.find(option => option.value === activeTab);

            if (!activeTabOption) {
                options.push({ id: options.length + 1, label: activeTab, value: activeTab });
            }

            setSectionOptions(options);
            const response = await getNatureOfAccountDropdownEffect({ section: "" });
            const natureOptions = response?.data?.data?.map(item => ({
                label: item.name,
                value: item.id,
            })) || [];

            setNatureOptions(natureOptions);
        } catch (error) {
            console.error("Error fetching nature of account options:", error);
        } finally {
            setLoading(false);
        }
        // for Sub head create dropdown
        try {
            const response = await getMajorHeadDropdownEffect({ section: "" });

            const majorHeadOptions = response?.data?.data?.map(item => ({
                label: item.name,
                value: item.name,
            })) || [];

            setMajorHeadOptions(majorHeadOptions);
        } catch (error) {
            console.error("Error fetching nature of account options:", error);
        } finally {
            setLoading(false);
        }
    };
    const submitFormHandler = async (data) => {

        try {

            if (IsUpdate) {
                if (headType === "major") {
                    const updatemajorPayload = {
                        uuid: data.uuid, // Assuming `uuid` is part of the `data` object
                        name: data.name,
                    };

                    const response = await updateMajorHeadEffect(updatemajorPayload); 

                    if (response?.success) {
                        setToastData({
                            type: "success",
                            message: "MajorHead updated successfully",
                        })
                    };
                } else if (headType === "sub") {

                    const updatesubPayload = {
                        uuid: data.uuid,
                        name: data.name,
                    };

                    const response = await updateSubHeadEffect(updatesubPayload);

                    if (response?.success) {
                        setToastData({
                            type: "success",
                            message: "subHead updated successfully",
                        });
                    }

                } else {
                    throw new Error("Failed to update subHead entry");
                }
            } else {


                if (headType === "major") {
                    const createPayload = {
                        name: data.name,
                        section: data.section,
                        is_edit: 1,
                    };
                    const majorResponse = await createMajorHeadEffect(createPayload); // Call the create API
                    if (majorResponse?.success) {
                        setToastData({
                            type: "success",
                            message: "MajorHead created successfully",
                        });
                    };
                } else if (headType === "sub") {
                    const createPayload = {
                        name: data.name,
                        section: data.section,
                        is_edit: 1,
                        majorhead: data.id

                    };
                    const subResponse = await createSubHeadEffect(createPayload); // Call the create API
                    if (subResponse?.success) {
                        setToastData({
                            type: "success",
                            message: "MajorHead created successfully",
                        });
                    };
                }
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
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            handleSubmit(submitFormHandler)();
        }
    };

    return (
        <>
            <Modal
                isOpen={isCreateModal}
                onClose={() => { setIsCreateModal(false); onClose() }}
                title={IsUpdate ? (headType === "major" ? "Update Major Head data" : "Update Sub Head data") : (headType === "major" ? "Create Major Head" : "Create Sub Head")}
                showHeader
                size="m"
                showFooter={false}
                className="darkCardBg"
            >
                <form
                    onSubmit={handleSubmit(submitFormHandler)}
                    onKeyDown={handleKeyDown}
                >
                    {!IsUpdate && headType === "sub" && (
                        <div className="mb-4">
                            <input
                                type="hidden"
                                id="majorhead"
                                {...register("majorhead")}
                                value={watch("majorhead")} 
                            />
                        </div>
                    )}
                    {!IsUpdate ? (
                        <div className="mb-4">
                            <FormInput
                                label={headType === "major" ? "Major Head Name" : "Sub Head Name"}
                                id="name"
                                type="text"
                                placeholder={`Enter ${headType === "major" ? "Major" : "Sub"} Head Name`}
                                register={register}
                                validation={{ required: "Name is required" }}
                                errors={errors}
                            />
                        </div>
                    ) : (
                        <FormInput
                            label={headType === "major" ? "Major Head Name" : "Sub Head Name"}
                            id="name"
                            type="text"
                            placeholder={`Enter ${headType === "major" ? "Major" : "Sub"} Head Name`}
                            register={register}
                            validation={{ required: "Name is required" }}
                            errors={errors}
                        />
                    )}

                    <input
                        type="hidden"
                        id="type"
                        value={data?.type}
                    />
                    <input type="hidden" id="uuid"{...register("uuid")} />
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
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

export default CreateMajorandSubHead;
