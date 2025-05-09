import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import Modal from "../../../UI/Modal/Modal";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import SingleCheckbox from "../../../UI/Input/CheckBoxInput/SingleCheckbox";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import { createAccountMasterEffect, getAccountMasterDropdownEffect, updateAccountMasterEffect } from "../../../redux/Account/Accounts/AccountsEffects";
import SearchableSelector from "../../../UI/Select/selectBox";
const CreateAccountsMaster = ({ isCreateModal, setIsCreateModal, onClose, setToastData, IsUpdate = false,
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
            setValue("uuid", data.uuid || "");
            setValue("isDepreciationApplicable", data.depreciation === "Applicable");
            setValue("isTDSApplicable", data.tds === "Yes");
            setValue("details", data.details || "");
        }else {
            reset();
        }
    }, [IsUpdate, data, setValue, reset]);

    const [loading, setLoading] = useState(false);
    const [sectionOptions, setSectionOptions] = useState([]);
    const [natureOptions, setNatureOptions] = useState([]);
    const [majorHeadOptions, setMajorHeadOptions] = useState([]);
    const [subHeadOptions, setSubHeadOptions] = useState([]);

    useEffect(() => {
            fetchDropdownOptions();
    }, []);

    const fetchDropdownOptions = async () => {
            setLoading(true);
            try {
                const response = await getAccountMasterDropdownEffect({ section: "", natureaccount: "" });
                console.log("getAccountMasterDropdownEffect",response);
                
                const sectionOptions = response?.data?.data?.map(item => ({
                    label: item.section,
                    value: item.section,
                })) || [];
                const natureOptions = response?.data?.data?.map(item => ({
                    label: item.natureaccount,
                    value: item.natureaccount,
                })) || [];
                const majorheadOptions = response?.data?.data?.map(item => ({
                    label: item.natureaccount,
                    value: item.natureaccount,
                })) || [];
                const subheadOptions = response?.data?.data?.map(item => ({
                    label: item.natureaccount,
                    value: item.natureaccount,
                })) || [];
                setNatureOptions(natureOptions);
                setSectionOptions(sectionOptions);
                setMajorHeadOptions(majorheadOptions);
                setSubHeadOptions(subheadOptions);
            } catch (error) {
                console.error("Error fetching nature of account options:", error);
            } finally {
                setLoading(false);
            }
            // // for Sub head create dropdown
            // try {
            //     const response = await getSubHeadDropdownEffect({ section: "", natureaccount: "", majorhead:""});
            //     console.log("getSubHeadDropdownEffect",response);
                
            //     const majorHeadOptions = response?.data?.data?.map(item => ({
            //         label: item.majorhead,
            //         value: item.majorhead,
            //     })) || [];
            //     console.log("majorHeadOptions",majorHeadOptions);
    
            //     setMajorHeadOptions(majorHeadOptions);
            // } catch (error) {
            //     console.error("Error fetching nature of account options:", error);
            // } finally {
            //     setLoading(false);
            // }
        };
    const submitFormHandler = async (data) => {
        console.log("Account Master data", data);
        
        try {
            if (IsUpdate) {
                const updatePayload = {
                    uuid: data.uuid,
                    depreciation: data.isDepreciationApplicable ? "applicable" : "notapplicable",
                    tds: data.isTDSApplicable ? "yes" : "no",
                    details: data.details || ""
                };
                await updateAccountMasterEffect(updatePayload); // Call the update API
                    setToastData({
                        type: "success",
                        message: "Master entry updated successfully",
                    });
                
            } else {
                const createPayload = {

                    section: data.section,
                    natureaccount: data.natureaccount,
                    majorhead: data.majorhead,
                    subhead: data.subhead,
                    depreciation: data.isDepreciationApplicable ? "Applicable" : "Not Applicable",
                    tds: data.isTDSApplicable ? "Yes" : "No",
                    details: data.details,
                    is_edit: 1,
                };

                const response =  await createAccountMasterEffect(createPayload); // Call the create API
                console.log("createAccountMasterEffect",response);
                
                if (response?.success) {
                setToastData({
                    type: "success",
                    message: "Master entry created successfully",
                });
            }
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
                    {!IsUpdate && (
                        <div className="mb-4">
                        <SearchableSelector
                            id="section"
                            label="Section"
                            options={sectionOptions}
                            placeholder="Select Section"
                            setValue={setValue}
                            register={register}
                            validation={{ required: "Section is required" }}
                            errors={errors}
                        />
                        </div>
                    )}
                    {!IsUpdate && (
                        <div className="mb-4">
                            <SearchableSelector
                                label="Nature of Account"
                                id="natureaccount"
                                placeholder="Select Nature of Account"
                                options={natureOptions}
                                setValue={setValue}
                                register={register}
                                validation={{ required: "Select Nature of Account" }}
                                errors={errors}
                            />
                        </div>
                    )}
                    {!IsUpdate && (
                        <div className="mb-4">
                            <SearchableSelector
                                label="Major Head"
                                id="majorhead"
                                placeholder="Select Major Head"
                                options={majorHeadOptions}
                                setValue={setValue}
                                register={register}
                                validation={{ required: "Select Major Head" }}
                                errors={errors}
                            />
                        </div>
                    )}
                    {!IsUpdate && (
                        <div className="mb-4">
                            <SearchableSelector
                                label="SubHead"
                                id="subhead"
                                placeholder="Select SubHead"
                                options={subHeadOptions}
                                setValue={setValue}
                                register={register}
                                validation={{ required: "Select Major Head" }}
                                errors={errors}
                            />
                        </div>
                    )}
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
                        id="details"
                        label="Details"
                        placeholder="Enter Details"
                        register={register}
                        validation={{
                            maxLength: {
                            value: 500,
                            message: "Maximum 500 characters allowed"
                            }
                        }}
                        errors={errors}
                    /></div>
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

export default CreateAccountsMaster;
