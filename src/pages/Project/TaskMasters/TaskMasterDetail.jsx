import React, { useEffect, useState } from 'react'
import IconButton from '../../../UI/Buttons/IconButton/IconButton';
import icons from '../../../contents/Icons';
import { useNavigate } from 'react-router';
import { getTasksubCategorylistEffect, SubTasksCreateEffect, SubTasksUpdateEffect } from '../../../redux/project/ProjectEffects';
import ActionDropdown from '../../../UI/AgGridTable/ActionDropdown/ActionDropdown';
import ProgressBar from '../../../UI/ProgressBar/ProgressBar';
import Loader from '../../../components/Loader/Loader';
import ReusableAgGrid from '../../../UI/AgGridTable/AgGridTable';
import Modal from '../../../UI/Modal/Modal';
import { useForm } from 'react-hook-form';
import FormInput from '../../../UI/Input/FormInput/FormInput';
import Select from '../../../UI/Select/SingleSelect';

const TaskMasterDetail = ({ activeCard }) => {
    const {
        register,
        control, reset,
        setValue,
        handleSubmit, getValues,
        formState: { errors },
    } = useForm();
    const [isEditMode, setIsEditMode] = useState(false); // Track whether it's edit mode
    const [searchText, setSearchText] = useState("");
    const [isApproveModal, setIsApproveModal] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [loading, setLoading] = useState(false);
    const [taskSubCategoryList, setTaskSubCategoryList] = useState(false);
    const navigate = useNavigate();
    const columnDefs = [
        { headerName: "Sub Tasks", field: "name", unSortIcon: true, },
        // { headerName: "Project Lead", field: "Project_lead", unSortIcon: true },
        // { headerName: "Location ", field: "location", unSortIcon: true, },
        {
            headerName: "Duration",
            minWidth: 200,
            unSortIcon: true,
            cellRenderer: (params) => {
                const duration = params?.data?.duration || 0;
                const duration_type = params?.data?.duration_type || "days";

                return (
                    <div>
                        {duration} {duration_type}
                    </div>
                );
            },
        },

        {
            headerName: "Action",
            field: "action",
            sortable: false,
            pinned: "right",
            // maxWidth: 200,
            // minWidth: 150, // Corrected property name
            cellRenderer: (params) => {
                return (
                    <div className={`flex gap-1 items-center ${params?.data?.status !== 1 ? "justify-end" : "justify-center"}`}
                    >

                        {/* {params?.data?.status === 1 && */}

                        <span
                            className="top-clr rounded-full border p-2 cursor-pointer"
                            data-tooltip-id="edit-notes"
                            onClick={() => {
                                setValue("uuid", params?.data?.uuid);
                                setValue("sub_tasks_name", params?.data?.name);
                                setValue("duration", params?.data?.duration);
                                setValue("duration_type", params?.data?.duration_type);
                                setIsApproveModal(true); // Open the modal
                                setIsEditMode(true); // Set to edit mode

                                // navigate("/user/project/create-project", { state: { ...params.data } });

                                // navigate("/user/accounts/sale/create-sale-quotation", { state: { ...params.data } });
                            }}
                        >
                            {React.cloneElement(icons.editIcon, { size: 18 })}
                        </span>
                        {/* } */}
                        {/* {params?.data?.status === 1 && */}
                        {/* <ActionDropdown
                        // options={ActionButton}
                        // onAction={(e) => handleAction(e, params, params.data)}
                        /> */}

                        {/* } */}
                        {/* <ActionDropdown
                      iconClass="top-clr rounded-full border p-2 cursor-pointer"
                      icon={icons.MdShare}
                      // options={ActionDropdowns}
                      // onAction={(e) => handleAction(e, params, params.data)}
                    /> */}
                    </div>
                );
            },
        },
    ];
    useEffect(() => {
        fetchLeadList();
    }, [activeCard, searchText]);

    const fetchLeadList = async () => {
        setLoading(true);
        try {
            const response = await getTasksubCategorylistEffect({ category_id: activeCard, search: searchText });
            setTaskSubCategoryList(response.data.data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const approveHandler = async (data) => {
        setLoading(true);
        try {
            let result;

            if (isEditMode) {
                // Call the update effect if in edit mode
                result = await SubTasksUpdateEffect(data);
            } else {
                // Call the create effect if not in edit mode
                result = await SubTasksCreateEffect(data);
            } setToastData({
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
            setIsEditMode(false); // Set to edit mode

        }
    };


    const toastOnclose = () => {
        setToastData(() => ({ ...toastData, show: false }));
    };
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        // if (!e.target.value) setPaginationCurrentPage(1);
      };

    return (
        <div className="w-full  flex flex-col h-full min-h-0">
            <div className="bg-white pr-2 rounded-lg darkCardBg ">
                <div className="bg-white rounded-lg  flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center p-3">
                            <div className="relative w-full max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchText}
                                      onChange={handleSearchChange}
                                    className="w-full px-4 py-2 pr-10 pl-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div
                                    className="absolute inset-y-0 right-0 flex items-center pr-3  cursor-pointer"
                                // onClick={handleFilterChange}
                                >
                                    {icons.searchIcon}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="me-3">
                            <IconButton
                                label="Add"
                                icon={icons.plusIcon}
                                onClick={() => {
                                    setIsEditMode(false); // Set to edit mode
                                    setValue("category_id", activeCard);
                                    setIsApproveModal(true)
                                    // navigate("/userproject/task-masters/add-task-category");
                                }}
                            />
                        </div>

                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0">
                {/* {cards.map((card) => (
            <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`rounded-lg p-2 my-1 bg-white darkCardBg shadow-lg flex justify-between items-center cursor-pointer 
                ${activeCard === card.id ? "border-b-[7px]" : "border-b border-gray-300"}`}
                style={{
                    borderColor: activeCard === card.id ? "var(--primary-color)" : undefined,
                }}
            >
                <span>{card.content}</span>
                <ActionDropdown
                    iconClass="cursor-pointer"
                    options={ActionButton}
                    onAction={(e) => {
                        e.stopPropagation();
                        handleAction(e, "params", "params.data");
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        ))} */}

                {taskSubCategoryList?.data?.length > 0 ? (
                    <>
                        <ReusableAgGrid
                            key={columnDefs.length}
                            rowData={taskSubCategoryList?.data}
                            columnDefs={columnDefs}
                            defaultColDef={{ resizable: false }}
                            onGridReady={(params) => params.api.sizeColumnsToFit()}
                            pagination={false}
                            showCheckbox={false}
                        />
                    </>
                ) : !loading ? (
                    <div className="flex justify-center items-center h-40 text-gray-500 text-lg font-semibold">
                        No Data Found
                    </div>
                ) : (
                    <Loader />
                )}
            </div>
            <Modal
                isOpen={isApproveModal}
                onClose={() => { setIsApproveModal(false); reset(); }}
                title="Edit Sub Task"
                showHeader
                size="m"
                showFooter={false}
            >
                <form onSubmit={handleSubmit(approveHandler)}>
                    {setIsEditMode === true
                        &&
                        <input type="hidden" {...register("uuid")} />}

                    <div >                                    <FormInput
                        label="Sub tasks name"
                        id="sub_tasks_name"
                        iconLabel={icons.Material}
                        placeholder="Sub Tasks Name"
                        validation={{
                            required: "Please Enter sub task name"
                        }}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                    />
                    </div>
                    <div className='flex  gap-2 my-3 col-span-5'>
                        <FormInput
                            label="Project Duration"
                            id="duration"
                            type="number"
                            iconLabel={icons.calendarWDate}
                            placeholder="Project Duration"
                            validation={{
                                required: false,
                                // validate: (value) => {
                                //     if (durationType === "days" && value > 365) {
                                //         console.log("value", value)
                                //         return "Duration cannot exceed 365 days";
                                //     }
                                //     if (durationType === "month" && value > 12) {
                                //         return "Duration cannot exceed 12 months";
                                //     }
                                //     if (value < 0) {
                                //         return "Duration cannot be negative";
                                //     }
                                //     return true;
                                // },
                            }}

                            register={register}
                            errors={errors}
                            setValue={setValue}
                        />
                       <div className='w-full'>
                        <Select
                            options={[
                                { label: "Hours", value: "Hours" },
                                { label: "Days", value: "days" },
                                { label: "Months", value: "months" },
                                { label: "Years", value: "years" },
                            ]}

                            label="Duration Type"
                            id="duration_type"
                            iconLabel={icons.timeIcon}
                            placeholder="Select Duration Type"
                            validation={{
                                required: "Duration type is required",
                            }}
                            register={register}
                            errors={errors}
                            setValue={setValue}
                        />
                        </div>
                    </div>
                    <div className="flex mt-4">
                        <IconButton label="Submit" icon={icons.saveIcon} type="submit" loading={loading} />
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default TaskMasterDetail
