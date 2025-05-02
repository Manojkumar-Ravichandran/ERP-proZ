import React, { useEffect, useState } from 'react'
import AlertNotification from '../../../UI/AlertNotification/AlertNotification'
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import { useLocation, useNavigate } from 'react-router';
import SearchableSelect from '../../../UI/Select/SearchableSelect';
import icons from '../../../contents/Icons';
import FormInput from '../../../UI/Input/FormInput/FormInput';
import RadioInput from '../../../UI/Input/RadioInput/RadioInput';
import Select from '../../../UI/Select/SingleSelect';
import { getAllProductListEffect, getAllUnitListEffect, getEmployeeListEffect, getLeadPurposeEffect, getMaterialDetailEffect } from '../../../redux/common/CommonEffects';
import { useForm } from 'react-hook-form';
import TextArea from '../../../UI/Input/TextArea/TextArea';
import { validationPatterns } from '../../../utils/Validation';
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import { CreateProjectEffect, CreateTaskEffect, projectDropdownEffect, taskCategoryDropdownEffect, taskSubCategoryDropdownEffect, UpdateTaskEffect } from "../../../redux/project/ProjectEffects";
import { DevTool } from '@hookform/devtools';



const CreateTask = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [IsEditMode, setIsEditMode] = useState(false);

    const {
        register,
        formState: { errors },
        control,
        setValue,
        watch,
        reset,
        handleSubmit,

    } = useForm();
    // useEffect(() => {
    //     if (location?.state) {
    //         
    //         const lead = location.state;
    //         // setSelectedLead({
    //         //     value: lead.lead_id,
    //         //     label: `${lead.cust_name} - ${lead.lead_id}`,
    //         // });

    //         setValue("project_id", lead?.project_id || "");
    //         setValue("uuid", lead?.uuid || "");
    //         setValue("category_id", lead?.category_id || "");
    //         setValue("subtask_id", lead?.subtask_id || "");
    //         setValue("description", lead?.description || "");
    //         setValue("assigned_to", lead?.assigned_to || "");
    //         setValue("planned_date", lead?.planned_date || "");
    //         setValue("priority", lead?.priority);
    //         setIsEditMode(true)
    //     } else {

    //         setValue("date", new Date().toISOString().split("T")[0]); // Set today's date for new entries
    //     }
    // }, [location?.state, setValue]);
    useEffect(() => {
        if (location?.state) {
            
            const lead = location.state;

            // Only set values if they exist in location.state
            if (lead?.project_id) setValue("project_id", lead.project_id);
            if (lead?.uuid) setValue("uuid", lead.uuid);
            if (lead?.category_id) setValue("category_id", lead.category_id);
            if (lead?.subtask_id) setValue("subtask_id", lead.subtask_id);
            if (lead?.description) setValue("description", lead.description);
            if (lead?.assigned_to) setValue("assigned_to", lead.assigned_to);
            if (lead?.planned_date) setValue("planned_date", lead.planned_date);
            if (lead?.priority) setValue("priority", lead.priority);

            setIsEditMode(true);
        } else {
            setValue("date", new Date().toISOString().split("T")[0]); // Set today's date for new entries
        }
    }, [location?.state, setValue]);

    const [formValues, setFormValues] = useState({
        unit: 16,
        area_type: "approximate", // Set a default value for area_type
        length: "",
        width: "",
    });

    const [materialDetailList, setMaterialDetailList] = useState([]);
    const [leadPurpose, setLeadPurpose] = useState([]);
    const [productList, setProductList] = useState([]);
    const [toastData, setToastData] = useState({ show: false });
    const breadcrumbItems = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Task List", link: "/user/project/task" },
        { id: 3, label: "create Task", link: "" }
    ];
    useEffect(() => {
        (async () => {
            try {
                let { data } = await projectDropdownEffect();
                data = data.data.map((list) => ({
                    ...list,
                    label: list.project_id,
                    value: list.id,
                }));
                setMaterialDetailList(data);
            } catch (error) {
                setMaterialDetailList([]);
            }
        })();

    // }, []);

        (async () => {
            try {
                let { data } = await getEmployeeListEffect();
                data = data.data.map((list) => ({
                    ...list,
                    label: list.name,
                    value: list.id,
                }));
                setLeadPurpose(data);
            } catch (error) {
                setLeadPurpose([]);
            }
        })();

    }, []);


    useEffect(() => {
        (async () => {
            try {
                let { data } = await taskCategoryDropdownEffect();
                data = data.data.map((list) => ({
                    ...list,
                    label: list.name,
                    value: list.id,
                }));
                setProductList(data);
            } catch (error) {
                setProductList([]);
            }
        })();
    }
        , []);
    const [subCategoryList, setSubCategoryList] = useState([]);

    const categoryId = watch('category_id');

    useEffect(() => {
        if (categoryId) {
            (async () => {
                try {
                    const { data } = await taskSubCategoryDropdownEffect({ category_id: categoryId });
                    const formattedData = data.data.map((list) => ({
                        label: list.name,
                        value: list.id,
                    }));

                    setSubCategoryList(formattedData);

                } catch (error) {
                    console.error('Error fetching sub-category data:', error);
                    setSubCategoryList([]);
                }
            })();
        } else {

            setSubCategoryList([]);
        }
    }, [categoryId]);


    const toastOnclose = () => {
        setToastData({ ...toastData, show: false });
    };

    const submitFormHandler = async (data) => {
        setLoading(true);

        

        try {
            let result;

            if (IsEditMode && !location?.state?.iscreate_new) {

                result = await UpdateTaskEffect(data);
            } else {
                result = await CreateTaskEffect(data);
            }

            setToastData({
                show: true,
                type: result.data.status,
                message: result.data.message,
            });

            if (location?.state?.tabs_Details?.project_uuid) {
                navigate(`/user/project/project-detail/${location.state.tabs_Details.project_uuid}`, {
                    state: { ...location.state.tabs_Details },
                });
            } else {
                navigate(-1);
            }            // navigate("/user/project/task/");

        } catch (error) {
            setToastData({
                show: true,
                type: "error",
                message: error?.response?.data?.message || "Something went wrong!",
            });
        } finally {
            setLoading(false);

            reset();
            setIsEditMode(false); // Reset edit mode
            if (location?.state?.tabs_Details?.project_uuid) {
                navigate(`/user/project/project-detail/${location.state.tabs_Details.project_uuid}`, {
                    state: { ...location.state.tabs_Details },
                });
            } else {
                navigate(-1);
            }

        }
    };
    const duration = watch("duration") || 0;
    const durationType = watch("duration_type");

    useEffect(() => {
        if (durationType === "days" && duration > 365) {
            setValue("duration", 365); // Limit to max 365 for days
        } else if (durationType === "month" && duration > 12) {
            setValue("duration", 12); // Limit to max 12 for months
        } else if (duration < 0) {
            setValue("duration", 0); // Ensure duration is not negative
        }
    }, [duration, durationType, setValue]);

    return (
        <div>
            {toastData?.show && (
                <AlertNotification
                    show={toastData?.show}
                    message={toastData?.message}
                    onClose={toastOnclose}
                />
            )}
            <div className=" rounded-lg p-2 my-2 bg-white darkCardBg">
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <form
                onSubmit={handleSubmit(submitFormHandler)}
            >
                <>
                    <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-3xl 2xl:max-w-4xl">



                        {!location?.state?.isperticularproject && (
                            <Select
                                options={materialDetailList || []}
                                label="Project Name/ Id"
                                id="project_id"
                                iconLabel={icons.user}
                                placeholder="Select Project"
                                register={register}
                                validation={{
                                    required: "Project is required",
                                }}
                                errors={errors}
                                defaultValue={location?.state?.project_id}
                                setValue={watch("project_id")}
                                value={watch('project_id')}
                            />
                        )}

                        {location?.state?.isperticularproject && (
                            <div className="hidden">
                                <input
                                    type="hidden"
                                    {...register("project_id")}
                                    value={location?.state?.project_id || ""}
                                />
                            </div>
                        )}


                    </div>
                    <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-3xl 2xl:max-w-4xl">
                        <Select
                            options={productList || []}
                            label="Task category"
                            id="category_id"
                            iconLabel={icons.user}
                            placeholder="Select Task category"
                            register={register}
                            validation={{
                                required: "Task category is required",
                            }}
                            errors={errors}

                            setValue={watch("category_id")}
                            value={watch('category_id')}

                        />

                        <Select
                            options={subCategoryList || []}
                            label="Sub-Category"
                            id="subtask_id"
                            iconLabel={icons.user}
                            placeholder="Select Sub task"
                            register={register}
                            validation={{
                                required: "Sub Task is required",
                            }}
                            errors={errors}

                            setValue={watch("subtask_id")}
                            value={watch('subtask_id')}
                        />

                    </div>

                    <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-3xl 2xl:max-w-4xl">
                        <div className="col-span-2"
                        >
                            <TextArea
                                id="description"
                                iconLabel={icons.note}
                                label="Project Description"
                                type="text"
                                placeholder="Enter the Project Description"
                                register={register}
                                errors={errors}
                                className=" col-span-2"
                                showStar={false}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-3xl 2xl:max-w-4xl">

                        <Select

                            options={leadPurpose || []}
                            label="Assigned To"
                            id="assigned_to"
                            iconLabel={icons.user}
                            placeholder="Select Assigned To"
                            register={register}
                            validation={{
                                required: "Assigned To is required",
                            }}
                            errors={errors}
                            setValue={watch("assigned_to")}

                            value={watch('assigned_to')}

    />
                        <FormInput
                            id="planned_date"
                            iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
                            label="Planned Date "
                            type="date"
                            register={register}
                            errors={errors}
                            validation={{ required: "start date required" }}
                            showStar={true}


                            defaultValue={new Date().toISOString().split("T")[0]}

                            min={!location?.state?.planned_date ? new Date().toISOString().split("T")[0] : undefined} // Conditionally set min

                        />
                    </div>
                    <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-3xl 2xl:max-w-4xl">

                        <Select
                            options={[
                                { label: "Low", value: "low" },
                                { label: "Medium", value: "medium" },
                                { label: "High", value: "high" },
                            ]}
                            register={register}

                            setValue={setValue}
                            label="Priority"
                            id="priority"
                            iconLabel={icons.calendarWDate}
                            placeholder="Select Priority"

                            showStar={false}
                            validation={{
                                required: "Priority is required",
                            }}
                            errors={errors}
                            value={watch('priority')}

                        />

                    </div>
                </>

                <div className="flex gap-3 mt-3">
                    <IconButton
                        type="button"
                        icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
                        label="Cancel"
                        className="px-4 py-2 btn_cancel"
                        onClick={() => {
                            reset();

                            if (location?.state?.tabs_Details?.project_uuid) {
                                navigate(`/user/project/project-detail/${location.state.tabs_Details.project_uuid}`, {
                                    state: { ...location.state.tabs_Details },
                                });
                            } else {
                                navigate(-1);
                            }

                        }}
                        disabled={loading}
                    />
                    <IconButton
                        icon={React.cloneElement(icons.plusIcon, { size: "20px" })}
                        label="Submit"
                        className="px-4 py-2"
                        type="submit"
                        loading={loading}
                    />
                </div>
            </form>

            {/* <DevTool control={control} /> */}


        </div>
    )
}

export default CreateTask
