import { useForm } from "react-hook-form";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import Modal from "../../../UI/Modal/Modal";
import { useEffect, useState } from "react";
import SearchableSelector from "../../../UI/Select/selectBox";
import { createNatureOfAccountEffect, getNatureOfAccountDropdownEffect, updateNatureOfAccountEffect } from "../../../redux/Account/Accounts/AccountsEffects";

const CreateNatureOfAccount = ({ isCreateModal, setIsCreateModal, onClose, setToastData, IsUpdate = false,
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
            setValue("section", data.section || "");
            setValue("name", data.name || "");
        }else {
            reset();
        }
    }, [IsUpdate, data, setValue, reset]);

    const [sectionOptions, setSectionOptions] = useState([]);
    useEffect(() => {
        fetchSection();
    }, []);


    const fetchSection = async() => {
        try {
            const response = await getNatureOfAccountDropdownEffect();

            const options = [
                { id: 1, label: "Assets", value: "assets" },
                { id: 2, label: "Income", value: "income" },
                { id: 3, label: "Expenses", value: "expenses" },
                { id: 4, label: "Liability", value: "liability" }
            ];
    
            setSectionOptions(options);
        
        } catch (error) {
            console.error("Error fetching nature of account options:", error);
        } 
    }

    const submitFormHandler = async (data) => {
        console.log("data Nature Of Account",data);
        
        try {
            if (IsUpdate) {
                const updatePayload = {
                    uuid: data.uuid, // Assuming `uuid` is part of the `data` object
                    name:data.name,
                };
                console.log("updatePayload",updatePayload);
                
                const response = await updateNatureOfAccountEffect(updatePayload); // Call the update API
                console.log("updateNatureOfAccountEffect",response);
                

                if (response?.success) {
                    setToastData({
                        type: "success",
                        message: "NatureOfAccount updated successfully",
                    });
                } else {
                    throw new Error(response?.message || "Failed to update master entry");
                }
            } else {
                const createPayload = {

                    name: data.name,
                    section:data.section,
                    is_edit: 1,
                };

                const response = await createNatureOfAccountEffect(createPayload); // Call the create API
                
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
                    {!IsUpdate && (
                        <div className="mb-4">
                        <SearchableSelector
                            id="section"
                            label="Section"
                            options={sectionOptions}
                            placeholder="Select section"
                            setValue={setValue}
                            register={register}
                            validation={{ required: "section is required" }}
                            errors={errors}
                        />
                        </div>
                    )}
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
