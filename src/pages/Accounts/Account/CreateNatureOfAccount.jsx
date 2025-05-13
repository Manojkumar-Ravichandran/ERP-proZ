import { useForm } from "react-hook-form";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import Modal from "../../../UI/Modal/Modal";
import { useEffect, useState } from "react";
import { createAccountMasterEffect, getAccountMasterDropdownEffect, getMajorHeadDropdownEffect, getNatureOfAccountDropdownEffect, getSubHeadDropdownEffect, updateAccountMasterEffect, updateNatureOfAccountEffect } from "../../../redux/Account/Accounts/AccountsEffects";
import SingleCheckbox from "../../../UI/Input/CheckBoxInput/SingleCheckbox";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import SearchableSelector from "../../../UI/Select/selectBox";

const CreateNatureOfAccount = ({ isCreateModal, setIsCreateModal, onClose, setToastData, IsUpdate = false,
    data }) => {
        
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
            setValue("natureaccount", data.natureaccount || "");
            setValue("majorhead", data.majorhead || "");
            setValue("subhead", data.subhead  || "");
            setValue("details", data.details || ""); 
            setValue("depreciation", data.depreciation || false); 
            setValue("tds", data.tds || false)

            setSelectedSection(data.section || "");
        setSelectedMajorHead(data.majorhead || "");
        } else {
            setValue("section", data?.section || ""); 
            setValue("majorhead", data?.majorhead || "");
            setValue("subhead", data?.subhead || "");
            setValue("depreciation", data?.deprecitation || false);
            setValue("tds", data?.tds || false);

            if (data?.section) {
            setSelectedSection(data.section);
        }
        if (data?.majorhead) {
            setSelectedMajorHead(data.majorhead);
        }
            reset();
        }
    }, [IsUpdate, data, setValue, reset]);

    const [loading, setLoading] = useState(false);
    const [section, setSection] = useState([]);
    const [majorhead, setMajorHead] = useState([]);
    
    const [subhead, setSubHead] = useState([]);

    useEffect(() => {
        fetchDropdowns();
    }, []);
const [selectedSection, setSelectedSection] = useState("");
const [selectedMajorHead, setSelectedMajorHead] = useState("");

    const fetchDropdowns = async () => {
        setLoading(true);
        try {
                const options = [
                    { id: 1, label: "Assets", value: "assets" },
                    { id: 2, label: "Income", value: "income" },
                    { id: 3, label: "Expenses", value: "expenses" },
                    { id: 4, label: "Liability", value: "liability" }
                ];
                    setSection(options);
                } catch (error) {
                    console.error("Error fetching nature of account options:", error);
                } finally {
                    setLoading(false);
                }
        try {
        const response = await getMajorHeadDropdownEffect();

        const data = response?.data?.data || [];
        const filteredMajorHead = data.filter(item => 
            !selectedSection || item.section === selectedSection
        );
        const majorheadOptions = filteredMajorHead.map(item => ({
            label: item.name,
            value: item.id,
        }));

        setMajorHead(majorheadOptions);

    } catch (error) {
        console.error("Error fetching nature of account options:", error);
    }
        try {
        const response = await getSubHeadDropdownEffect();

        const data = response?.data?.data || [];

        // const subhead = data.map(item => ({
        //     label: item.name,
        //     value: item.id,
        // }));

        const filteredSubHead = data.filter(item =>
            !selectedMajorHead || item.majorhead === selectedMajorHead
        );
        const subheadOptions = filteredSubHead.map(item => ({
            label: item.name,
            value: item.id,
        }));
        setSubHead(subheadOptions);

    } catch (error) {
        console.error("Error fetching nature of account options:", error);
    }
};
useEffect(() => {
    fetchDropdowns();
}, [selectedSection]);
useEffect(() => {
    fetchDropdowns();
}, [selectedMajorHead]);

    const submitFormHandler = async (data) => {
        const depreciation = data.depreciation ? "yes" : "no";
            const tds = data.tds ? "yes" : "no";
        try {
            if (IsUpdate) {
                const updatePayload = {
                    uuid: data.uuid, // Assuming `uuid` is part of the `data` object
                    natureaccount: data.natureaccount,
                    section: data.section,
                    majorhead: data.majorhead,
                    subhead: data.subhead,
                    depreciation: data.depreciation ? "yes" : "no",
                    tds: data.tds ? "yes" : "no",
                    details: data.details,
                    is_edit: 1
                };
                
                const response = await updateAccountMasterEffect(updatePayload); // Call the update API

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
                    natureaccount: data?.natureaccount,
                    section:data?.section || "",
                    majorhead:data?.majorhead || "",
                    subhead:data?.subhead || "",
                    depreciation:depreciation,
                    tds:tds,
                    details:data?.details || "",
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
                        id="natureaccount"
                        type="text"
                        placeholder="Enter Nature Of Account"
                        register={register}
                        validation={{
                            required: "Nature Of Account is required",
                        }}
                        value={watch("natureaccount")}
                        setValue={setValue}
                        errors={errors}
                    />
                    <div className="mb-4">
                        <SearchableSelector
                            id="section"
                            label="Section"
                            options={section}
                            placeholder="Select Section"
                            setValue={(id, value) => {
                                setValue("section", value);
                                setSelectedSection(value); 
                            }}
                            defaultValue={watch("section")}
                            register={register}
                            validation={{ required: "Section is required" }}
                            errors={errors}
                        />
                    </div>
                        <div className="mb-4">
                            <SearchableSelector
                                label="Major Head"
                                id="majorhead"
                                placeholder="Select Major Head"
                                options={majorhead}
                                defaultValue={watch("majorhead")}
                                setValue={(id, value) => {
                                    setValue("majorhead", value);
                                    setSelectedMajorHead(value);
                                }}
                                register={register}
                                validation={{ required: "Select Major Head" }}
                                errors={errors}
                            />
                        </div>
                        <div className="mb-4">
                            <SearchableSelector
                                label="SubHead"
                                id="subhead"
                                placeholder="Select SubHead"
                                options={subhead}
                                defaultValue={watch("subhead")}
                                setValue={(id, value) => {
                                    setValue("subhead", value);
                                }}
                                register={register}
                                validation={{ required: "Select Major Head" }}
                                errors={errors}
                            />
                        </div>
                    <div className="mb-4">
                    <SingleCheckbox
                        id="depreciation"
                        label="Depreciation is Applicable"
                        register={register}
                        errors={errors}
                    /></div>
                    <div className="mb-4">
                    <SingleCheckbox
                        id="tds"
                        label="TDS is Applicable"
                        register={register}
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
