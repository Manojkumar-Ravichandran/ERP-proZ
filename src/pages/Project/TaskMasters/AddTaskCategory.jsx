import React, {  useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";


import { useLocation, useNavigate } from "react-router";
import icons from "../../../contents/Icons";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import FormTable from "../../../UI/AgGridFormTable/FormAgTable";
import { CreateTaskCategorylistEffect } from "../../../redux/project/ProjectEffects";
import Select from "../../../UI/Select/SingleSelect";

export default function CreateAddTaskCategory() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [itemList, setItemList] = useState([]);

    const [selectedItemList, setSelectedItemList] = useState([]);
    const location = useLocation();

    const mainFormMethods = useForm({
        defaultValues: {
            is_address: true,
        }
    });
    const itemFormMethods = useForm();

    const { register, formState: { errors }, handleSubmit, setValue, watch, reset, trigger } = mainFormMethods;

    const breadcrumbItems = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Task Master", link: "/user/project/task-masters" },
        { id: 3, label: "Create Task Category" }
    ];


    const ItemSubmitHandler = (data) => {



        const newItem = {
            ...data,
            sub_tasks_name: data.sub_tasks_name,
            duration: data?.duration,
            duration_type: data?.duration_type
        };

        setSelectedItemList((prevList) => [...prevList, newItem]);
        itemFormMethods.reset();
    };



    const handleDeleteItem = (index) => {
        setSelectedItemList((prevList) => prevList.filter((_, i) => i !== index));
    };

    const toastOnclose = () => {
        setToastData(() => ({ ...toastData, show: false }));
    };
    const addMasterHandler = async (data) => {
        console.log("data", data)
        let payload = {
            category_name: data.category_name,
            sub_tasks: selectedItemList.map(item => ({
                sub_tasks_name: item.sub_tasks_name,
                duration: item.duration,
                duration_type: item.duration_type,
            })),
        };

        try {
            setLoading(true);
            const response = await CreateTaskCategorylistEffect(payload);

            setLoading(false);
            if (response?.data?.status === "success") {
                setToastData({
                    show: true,
                    message: response?.data?.message,
                    type: 'success'
                });

                navigate(-1);

            } else {
                setToastData({
                    show: true,
                    message: response?.data?.message,
                    type: 'error'
                });
            }
        } catch (error) {
            setLoading(false);
            console.error("Error saving quotation:", error);
            setToastData({
                show: true,
                message: 'Failed to save quotation. Please try again.',
                type: 'error'
            });
        }

    };


    const columnDefs = [
        {
            headerName: "Sub Tasks Name",
            field: "sub_tasks_name",
            unSortIcon: true,
            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering

        },

        {
            headerName: "Duration",
            field: "duration",

            unSortIcon: true,
            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering

        },

        {
            headerName: "Duration Type",
            field: "duration_type",

            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering
        },

        {
            headerName: "Action",
            field: "action",
            pinned: "right",
            sortable: false,
            cellRenderer: (params) => {
                if (!params.data || params.data.cost === "Total Amount") return "";
                return (
                    <div>
                        <button
                            onClick={() => handleDeleteItem(params.node.rowIndex)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 text-orange-400"
                        >
                            {icons.deleteIcon}
                        </button>

                    </div>
                );
            },
        }

    ];



    const duration = watch("duration") || 0;
    const durationType = watch("duration_type");

    return (
        <>
            {toastData?.show && (
                <AlertNotification
                    show={toastData?.show}
                    message={toastData?.message}
                    type={toastData?.type}
                    onClose={toastOnclose}
                />
            )}
            <div className="py-3 rounded-lg overflow-hidden w-full border-b-5 border-black">

                <div className="p-2 rounded-lg bg-white darkCardBg mb-2">
                    <Breadcrumps items={breadcrumbItems} />
                </div>
                <div className="p-2 mb-2">
                    <FormProvider {...mainFormMethods}>
                        <form onSubmit={handleSubmit(addMasterHandler)}>

                            <div className="py-5 grid grid-cols-5 gap-3 justify-between content-end width-1-8">
                                <div className="col-span-2">
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
                                </div></div>
                            {/* <div>
                                <p className='text-lg font-semibold '>Quotation Details</p>
                                <div className="py-5 grid grid-cols-5 gap-x-4 xl:max-w-4xl 2xl:max-w-5xl">
                                    <div className="col-span-2">                                    <IconFormInput
                                        id="contact"
                                        label="Contact"
                                        placeholder="Contact Number"
                                        type="search"
                                        iconLabel={icons.call}
                                        register={register}
                                        validation={{
                                            required: "Contact is required",
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: "Provide a valid Contact Number",
                                            },
                                        }}
                                        onBlur={mobileNumberUserCheck}
                                        errors={errors}
                                        icon={icons.searchIcon}
                                        onClick={() => mobileNumberUserCheck()}
                                        max={10}
                                        allowNumbersOnly={true}
                                    />
                                    </div>
                                    <div className="col-span-2">

                                        <FormInput
                                            label="Name"
                                            id="name"
                                            iconLabel={icons.name}
                                            placeholder="Lead Name"
                                            register={register}
                                            validation={{
                                                required: "Lead name is required",
                                                pattern: {
                                                    value: validationPatterns.textOnly,
                                                    message: "Provide Valid Name",
                                                },
                                            }}
                                            errors={errors}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 gap-x-4 gap-y-2 my-2 mb-4 xl:max-w-4xl 2xl:max-w-5xl">
                                    <div className="col-span-2">
                                        <SelectSearchable
                                            label="Client"
                                            id="client"
                                            options={leadList}
                                            placeholder="Select Client"
                                            onChange={handleSelection}
                                            error={false}
                                            iconLabel={"👤"}
                                            isSearchable={true}
                                            errorMsg="Select Client"
                                            defaultValue={selectedLead}
                                            showIcon={true}
                                            register={register}
                                            validation={{ required: "Client is Required" }}
                                        />
                                        <div className="flex items-end justify-end">
                                            <button
                                                onClick={() => {
                                                    navigate("/user/crm/lead/create-lead");
                                                }}
                                                className="top-clr  "

                                                title="View Customer Details"
                                            >
                                                Add New Client
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-2">

                                        <FormInput
                                            id="date"
                                            iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
                                            label="Date"
                                            type="date"
                                            register={register}
                                            errors={errors}
                                            validation={{ required: false }}
                                            showStar={false}
                                            defaultValue={new Date().toISOString().split("T")[0]}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 gap-x-4 gap-y-2 my-2 mb-4 xl:max-w-4xl 2xl:max-w-5xl">
                                    <div className="col-span-2">
                                        <TextArea
                                            id="billing_address"
                                            iconLabel={icons.address}
                                            label="Billing Address"
                                            register={register}
                                            errors={errors}
                                            showStar={false}
                                            showIcon={true}
                                            defaultValue={watch("billing_address")}
                                            validation={{ required: "Billing Address required" }}
                                        />

                                        <SingleCheckbox
                                            id="is_address"
                                            label="Same For Shipping Address"
                                            register={register}
                                            errors={errors}
                                            validation={{
                                                required: false,
                                            }}
                                        />

                                    </div>
                                    <div className="col-span-2">

                                        {!isAddress && (
                                            <TextArea
                                                id="shipping_address"
                                                iconLabel={icons.address}
                                                label="Shipping Address"
                                                register={register}
                                                validation={{ required: false }}
                                                errors={errors}
                                                showStar={false}
                                                defaultValue={watch("shipping_address")}
                                            />
                                        )}

                                    </div>
                                </div>
                                {!location.state && (
                                    <>
                                        <input type="hidden" {...register("cust_id")} />
                                        <input type="hidden" {...register("lead_id")} />
                                    </>
                                )}
                                {location.state && (
                                    <>
                                        <input type="hidden" {...register("uuid")} />
                                    </>
                                )}
                            </div> */}
                        </form>
                    </FormProvider>
                    <div>
                        <FormProvider {...itemFormMethods}>
                            <form onSubmit={itemFormMethods.handleSubmit(ItemSubmitHandler)}>
                                <div className="gap-3 my-2 justify-between content-end width-1-10">

                                    <div className="py-5 grid grid-cols-5 gap-3 justify-between  ">
                                        <div className="col-span-2">                                    <FormInput
                                            label="Sub tasks name"
                                            id="sub_tasks_name"
                                            iconLabel={icons.Material}
                                            placeholder="Sub Tasks Name"
                                            validation={{
                                                required: "Please Enter sub task name"
                                            }}
                                            register={itemFormMethods.register}
                                            errors={itemFormMethods.formState.errors}
                                            setValue={itemFormMethods.setValue}
                                        />
                                        </div>
                                        <div className="col-span-2">
                                        <div className='flex  gap-2'>
                                        <FormInput
                                            label="Project Duration"
                                            id="duration"
                                            type="number"
                                            iconLabel={icons.calendarWDate}
                                            placeholder="Project Duration"
                                            validation={{
                                                required: false,
                                                validate: (value) => {
                                                    if (durationType === "days" && value > 365) {
                                                        console.log("value", value)
                                                        return "Duration cannot exceed 365 days";
                                                    }
                                                    if (durationType === "month" && value > 12) {
                                                        return "Duration cannot exceed 12 months";
                                                    }
                                                    if (value < 0) {
                                                        return "Duration cannot be negative";
                                                    }
                                                    return true;
                                                },
                                            }}

                                            register={itemFormMethods.register}
                                            errors={itemFormMethods.formState.errors}
                                            setValue={itemFormMethods.setValue}
                                        />
                                                               <div className='w-full'>

                                        <Select
                                            options={[
                                                { label: "Hours", value: "Hours" },
                                                { label: "Days", value: "days" },
                                                { label: "Month", value: "month" },
                                                { label: "Year", value: "year" },
                                            ]}

                                            label="Duration Type"
                                            id="duration_type"
                                            iconLabel={icons.timeIcon}
                                            placeholder="Select Duration Type"
                                            validation={{
                                                required: "Duration type is required",
                                            }}
                                            register={itemFormMethods.register}
                                            errors={itemFormMethods.formState.errors}
                                            setValue={itemFormMethods.setValue}
                                        />
                                        </div>
</div>
</div>
                                        <div className="flex items-center pt-6">
                                            <IconButton
                                                label="Add Sub Task"
                                                type="submit"
                                                className="h-8"
                                                icon={icons.plusIcon}
                                            />
                                        </div>

                                    </div>

                                    {selectedItemList.length > 0 && (
                                        <div>
                                            <FormTable
                                                key={columnDefs.length}
                                                rowData={selectedItemList}
                                                columnDefs={columnDefs}
                                                defaultColDef={{ resizable: false }}
                                                onGridReady={(params) => params.api.sizeColumnsToFit()}
                                                pagination={false}
                                                showCheckbox={false}
                                            />
                                        </div>
                                    )}
                                </div>
                            </form>
                        </FormProvider>
                    </div>

                    {/* {selectedItemList.length > 0 && ( */}
                        <FormProvider {...mainFormMethods}>
                            <form onSubmit={handleSubmit(addMasterHandler)}>
                                <div className="flex gap-3 mt-3">
                                    <IconButton
                                        type="button"
                                        icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
                                        label="Cancel"
                                        className="px-4 py-2 btn_cancel"
                                        onClick={() => {
                                            reset();

                                            navigate(-1);

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
                        </FormProvider>
                    {/* )} */}
                </div>
            </div >
        </>
    );
}

