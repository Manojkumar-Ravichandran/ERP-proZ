import { useForm } from "react-hook-form";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import Modal from "../../../UI/Modal/Modal";
import { useEffect, useState } from "react";
import { createAccountMasterEffect, getAccountMasterDropdownEffect, getNatureOfAccountDropdownEffect, updateAccountMasterEffect, updateNatureOfAccountEffect } from "../../../redux/Account/Accounts/AccountsEffects";
import SingleCheckbox from "../../../UI/Input/CheckBoxInput/SingleCheckbox";
import TextArea from "../../../UI/Input/TextArea/TextArea";

const CreateNatureOfAccount = ({ isCreateModal, setIsCreateModal, onClose, setToastData, IsUpdate = false,
    data }) => {
        console.log("from data:",data);
        
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
            setValue("uuid", data.uuid || "");
            setValue("section", data.section || "");
            setValue("name", data.name || "");
            setValue("majorhead", data.majorhead || "");
            setValue("subhead", data.subhead || "");
        } else {
            reset();
        }
    }, [IsUpdate, data, setValue, reset]);

    const [section, setSection] = useState([]);
    const [majorHead, setMajorHead] = useState([]);
    const [subHead, setSubHead] = useState([]);
    const [depreciation, setDepreciation] = useState([]);
    const [tds, setTds] = useState([]);
    useEffect(() => {
        fetchDropdowns();
    }, []);


    const fetchDropdowns = async () => {
    try {
        const response = await getAccountMasterDropdownEffect();
        console.log("getAccountMasterDropdownEffect", response);

        const data = response?.data?.data || [];
console.log("data111",data);

        // const section = data.map(item => ({
        //     label: item.section,
        //     value: item.section,
        // }));

        // const majorhead = data.map(item => ({
        //     label: item.majorhead,
        //     value: item.majorhead,
        // }));

        // const subhead = data.map(item => ({
        //     label: item.subhead,
        //     value: item.subhead,
        // }));

        // const depreciation = data.map(item => ({
        //     label: item.depreciation,
        //     value: item.depreciation,
        // }));

        // const tds = data.map(item => ({
        //     label: item.tds,
        //     value: item.tds,
        // }));
        // console.log("Section Data:", section);
        // console.log("Major Head Data:", majorhead);
        // console.log("Sub Head Data:", subhead);
        // console.log("Depreciation Data:", depreciation);
        // console.log("TDS Data:", tds);

        // setSection(section);
        // setMajorHead(majorhead);
        // setSubHead(subhead);
        // setDepreciation(depreciation);
        // setTds(tds);

    } catch (error) {
        console.error("Error fetching nature of account options:", error);
    }
};


    const submitFormHandler = async (data) => {
        console.log("data Nature Of Account",data);
        
        try {
            if (IsUpdate) {
                const updatePayload = {
                    uuid: data.uuid, // Assuming `uuid` is part of the `data` object
                    name: data.name,
                    section: data.section,
                    majorhead: data.majorhead,
                    subhead: data.subhead,
                    depreciation: data.depreciation,
                    tds: data.tds,
                    details: data.details,
                    is_edit: 1
                };
                console.log("updatePayload",updatePayload);
                
                const response = await updateAccountMasterEffect(updatePayload); // Call the update API
                console.log("updateAccountMasterEffect",response);
                

                if (response?.success) {
                    setToastData({
                        type: "success",
                        message: "NatureOfAccount updated successfully",
                    });
                } else {
                    throw new Error(response?.message || "Failed to update master entry");
                }
            } else {
                const payload = {
                    name: data.name,
                    section:data.section,
                    majorhead:data.majorhead,
                    subhead:data.subhead,
                    depreciation:data.depreciation,
                    tds:data.tds,
                    details:data.details,
                    is_edit: 1,
                };

                const response = await createAccountMasterEffect(payload); // Call the create API
                
                if (response?.success) {
                    setToastData({
                        type: "success",
                        message: "Nature Of Account created successfully",
                    });
                };
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
                title={IsUpdate ? "Update Nature Of Account" : "Create Nature Of Account "}
                showHeader
                size="m"
                showFooter={false}
                className="darkCardBg"
            >
                <form
                    onSubmit={handleSubmit(submitFormHandler)}
                >
                    
                    <FormInput
                        label="Nature Of Account"
                        id="name"
                        type="text"
                        placeholder="Enter Nature Of Account"
                        register={register}
                        validation={{
                            required: "Nature Of Account is required",
                        }}
                        setValue={setValue}
                        errors={errors}
                    />
                    <div className="mb-4">
                    </div>
                        <div className="mb-4">
                            <input
                                type="hidden"
                                id="majorhead"
                                {...register("majorhead")}
                                value={watch("majorhead")} 
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="hidden"
                                id="subhead"
                                {...register("subhead")}
                                value={watch("subhead")} 
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="hidden"
                                id="section"
                                {...register("section")}
                                value={watch("section")} 
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

export default CreateNatureOfAccount;
