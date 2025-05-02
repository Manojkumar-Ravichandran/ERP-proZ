
import React, { useEffect, useState } from "react";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import ActionDropdown from "../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import icons from "../../../contents/Icons";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import { useNavigate } from "react-router";
import { getTaskCategorylistEffect, UpdateTaskCategorylistEffect } from "../../../redux/project/ProjectEffects";
import TaskMasterDetail from "./TaskMasterDetail";
import Modal from "../../../UI/Modal/Modal";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import { useForm } from "react-hook-form";
import FormInput from "../../../UI/Input/FormInput/FormInput";

const TaskMaster = () => {
    const navigate = useNavigate();

    const {
        register,
       reset,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [toastData, setToastData] = useState({ show: false });
    const [activeCard, setActiveCard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isApproveModal, setIsApproveModal] = useState(false);
    const [taskCategoryList, setTaskCategoryList] = useState(false);


    const toastOnclose = () => {
        setToastData(() => ({ ...toastData, show: false }));
    };

    const breadcrumbItems = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Task Master" },
    ];

    useEffect(() => {
        fetchLeadList();
    }, []);

    const fetchLeadList = async () => {
        setLoading(true);
        try {
            const response = await getTaskCategorylistEffect();
            console.log("response", response.data.data)
            setTaskCategoryList(response.data.data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (taskCategoryList?.data?.length > 0) {
            setActiveCard(taskCategoryList?.data[0]?.id);
        }
    }, [taskCategoryList]);

    console.log("activeCard", activeCard)

    const approveHandler = async (data) => {
        setLoading(true);
        try {
            const result = await UpdateTaskCategorylistEffect(data);
            setToastData({
                show: true,
                type: result.data.status,
                message: result.data.message,
            });
        } catch (error) {
            setToastData({
                show: true,
                type: "error",
                message: error?.response?.data?.message || "Something went wrong!",
            });
        } finally {
            setLoading(false);
            fetchLeadList();
            setIsApproveModal(false);

            reset();

        }
    };
    useEffect(() => {
        if (taskCategoryList?.data?.length > 0) {
            setActiveCard(taskCategoryList?.data[0]?.id);
        }
    }, [taskCategoryList]);
    const handleCardClick = (card) => {
        setActiveCard(card.id);
        
    };

    const handleAction = async (action, params, master) => {

        if (action === "Edit") {
            

            setValue("uuid", params?.uuid);
            setValue("category_name", params?.name);
            setIsApproveModal(true); // Open the modal
        }


        // if (action === "Delete") {

            
        // }
    };
    const ActionButton = [

        { action: "Edit", label: "Edit", },
        // { action: "Delete", label: "Delete", },
    ];
    return (
        <>
            <div className="flex flex-col h-full overflow-hidden">
                {toastData?.show && (
                    <AlertNotification
                        show={toastData?.show}
                        message={toastData?.message}
                        type={toastData?.type}
                        onClose={toastOnclose}
                    />
                )}

                <div className="p-2 bg-white darkCardBg mb-2">
                    <Breadcrumps items={breadcrumbItems} />
                </div>

                <div className="flex-1 grid grid-cols-2 lg:grid-cols-[1fr,2fr] gap-3 min-h-0">
                    <div className=" w-full bg-white rounded-lg shadow-md border border-gray-300 flex flex-col h-full min-h-0">
                        <div className="p-3 border-b border-gray-300 bg-white rounded-t-lg darkCardBg flex justify-between items-center">
                            <h3 className="px-2 text-xl font-semibold">Task Category</h3>
                            <IconButton
                                label="Add"
                                icon={icons.plusIcon}
                                onClick={() => {
                                    navigate("/user/project/task-masters/add-task-category");
                                }}
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0">
                            {taskCategoryList?.data?.map((card) => (
                                <div
                                    key={card.id}
                                    onClick={() => handleCardClick(card)}
                                    className={`rounded-lg p-2 my-1 bg-white darkCardBg shadow-lg flex justify-between items-center cursor-pointer 
                                ${activeCard === card.id ? "border-b-[7px]" : "border-b border-gray-300"}`}
                                    style={{
                                        borderColor: activeCard === card.id ? "var(--primary-color)" : undefined,
                                    }}
                                >
                                    <span>{card.name}</span>
                                    <ActionDropdown
                                        iconClass="cursor-pointer"
                                        options={ActionButton}
                                        onAction={(e) => {
                                            // e.stopPropagation();
                                            handleAction(e, card, "params.data");
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <TaskMasterDetail activeCard={activeCard} />
                </div>
            </div>
            <Modal
                isOpen={isApproveModal}
                onClose={() => { setIsApproveModal(false); reset(); }}
                title="Edit Task Category"
                showHeader
                size="m"
                showFooter={false}
            >
                <form onSubmit={handleSubmit(approveHandler)}>
                    <input type="hidden" {...register("uuid")} />
                    <div>
                        <FormInput
                            label="Category Name"
                            id="category_name"
                            iconLabel={icons.Material}
                            placeholder="Category Name"
                            register={register}
                            validation={{
                                required: "Please Enter Category Name"
                            }}
                            errors={errors}
                        />

                    </div>

                    <div className="flex mt-4">
                        <IconButton label="Submit" icon={icons.saveIcon} type="submit" loading={loading} />
                    </div>
                </form>
            </Modal>
        </>

    );
};

export default TaskMaster;
