import React, { useEffect, useState } from 'react';
import { MaterialReturnApprovedEffect, MaterialReturnUpdateEffect, ProjectShowMaterialEffect, ProjectShowMaterialReturnEffect, ProjectShowTaskEffect } from '../../../../redux/project/ProjectEffects';
import Loader from '../../../../components/Loader/Loader';
import icons from '../../../../contents/Icons';
import AlertNotification from '../../../../UI/AlertNotification/AlertNotification';
import { useNavigate } from 'react-router';
import ReusableAgGrid from '../../../../UI/AgGridTable/AgGridTable';
import ActionDropdown from '../../../../UI/AgGridTable/ActionDropdown/ActionDropdown';
import StatusManager from '../../../../UI/StatusManager/StatusManager';
import Pagination from "../../../../UI/AgGridTable/Pagination/Pagination";
import IconButton from '../../../../UI/Buttons/IconButton/IconButton';
import FilterDropdown from '../../../../components/DropdownFilter/FilterDropdown';
import { useForm } from 'react-hook-form';
import DateRangePickerComponent from '../../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent';
import moment from 'moment';
import { formatDateToYYYYMMDD } from '../../../../utils/Date';
import FormInput from '../../../../UI/Input/FormInput/FormInput';
import Modal from '../../../../UI/Modal/Modal';
import TextArea from '../../../../UI/Input/TextArea/TextArea';
import { DevTool } from '@hookform/devtools';

const MaterialReturn = ({ projectDetails }) => {
    const {
        register, watch,
        control, reset,
        setValue,
        handleSubmit, getValues,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const [focusedInput, setFocusedInput] = useState(null);

    const [materialReturn, setMaterialReturn] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [searchText, setSearchText] = useState("");
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
    const [isApproveModal, setIsApproveModal] = useState(false);
    const [itemModal, setItemModal] = useState(false);
    const [itemList, setItemList] = useState(false);

    const [paginationPageSize, setPaginationPageSize] = useState(10);
    
    const [filters, setFilters] = useState({
        startDate: moment().subtract(30, "days"), // 30 days ago
        endDate: moment(), // Current date
        status: "ALL",
    });
    const handleDateChange = ({ startDate, endDate }) => {
        setFilters((prev) => ({ ...prev, startDate, endDate }));
    };
    const StatusFilter = [
        { value: "ALL", label: "ALL" },
        { value: 1, label: "Pending" },
        { value: 0, label: "Cancel" },
        { value: 2, label: "Approved" },
        { value: 3, label: "Reject" },
        { value: 4, label: "Transit" },
        { value: 5, label: "Delivered" },
    ];
    const ActionButton = [
        { action: "Approved", label: "Approved", icon: icons.cancelIcon, iconClass: "text-green-200 cursor-pointer ", },
        { action: "Transit", label: "Transit", icon: icons.tick, iconClass: "text-green-200 cursor-pointer", },
        { action: "Delivered", label: "Delivered", icon: icons.cancelIcon, iconClass: "text-green-200 cursor-pointer ", },
        { action: "Cancel", label: "Cancel", icon: icons.tick, iconClass: " text-red-200 cursor-pointer", },
        { action: "Reject", label: "Reject", icon: icons.tick, iconClass: "text-red-200 cursor-pointer", },

    ];

    const fetchMaterialReturn = async () => {
        setLoading(true);
        try {
            const data = {
                project_uuid: projectDetails?.project_uuid,
                search: searchText,
                status: filters.status,
                from_date: filters.startDate ? formatDateToYYYYMMDD(filters.startDate) : "",
                to_date: filters.endDate ? formatDateToYYYYMMDD(filters.endDate) : "",
            }; // Pass project_uuid
            const response = await ProjectShowMaterialReturnEffect(data);
            
            setMaterialReturn(response.data?.data || []); // Assuming the API returns a `materialReturn` array
        } catch (err) {

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectDetails?.project_uuid) {
            fetchMaterialReturn();
        }
    }, [projectDetails?.project_uuid, searchText, filters,paginationCurrentPage, paginationPageSize]);

    const handleStatusChange = (selectedOption) => {
        setFilters((prev) => ({ ...prev, status: selectedOption || "" }));
    };

    const toastOnclose = () => {
        setToastData({ ...toastData, show: false });
    };
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        // if (!e.target.value) setPaginationCurrentPage(1);
    };




    const handlePageChange = (page) => {
        setPaginationCurrentPage(page);
        fetchMaterialReturn();
    };

    const handlePageSizeChange = (pageSize) => {
        setPaginationPageSize(pageSize);
        setPaginationCurrentPage(1);
        fetchMaterialReturn();
    };

    const columnDefs = [
        { headerName: "Material Request ID", field: "request_no", unSortIcon: true },
        { headerName: "Item name ", field: "item_name", unSortIcon: true },
        { headerName: "Quantity", field: "quantity", unSortIcon: true },
        
        {
            headerName: "Status",
            field: "status",
            sortable: false,
            cellRenderer: (params) => {
                const statusMapping = {
                    1: "darkpurple",
                    0: "darkRed",
                    2: "lightgreen",
                    5: "darkBlue",
                    4: "warning",
                    3: "darkpink",
                };
                const status = statusMapping[params?.data?.status];
                return (
                    <div className="flex justify-center items-center w-100">
                        <div className="flex justify-center">
                            <StatusManager
                                status={status}
                                message={params?.data?.status_label}
                            />
                        </div>
                    </div>
                );
            },
        },
    
        {
            headerName: "Action",
            field: "action",
            sortable: false,
            pinned: "right",
            maxWidth: 200,
            minWidth: 150,
            cellRenderer: (params) => {
                const filteredActions = ActionButton.filter((action) => {
                    if (params?.data?.status === 1) {
                        return ["Approved", "Cancel", "Reject"].includes(action.action);
                    }
                    if (params?.data?.status === 2) {
                        return ["Transit"].includes(action.action);
                    }
                    if (params?.data?.status === 4) {
                        return ["Delivered"].includes(action.action);
                    }
                    return false; // Exclude actions for other statuses
                });
    
                return (
                    <div className={`flex gap-1 items-center ${params?.data?.status !== 1 ? "justify-end" : "justify-center"}`}>
                        <span
                            className="top-clr rounded-full border p-2 cursor-pointer"
                            onClick={() => {
                                setItemList(params?.data); // Open the modal with the selected item data
                                setItemModal(true);
                            }}
                        >
                            {React.cloneElement(icons.viewIcon, { size: 18 })}
                        </span>
    
                        <span
                            className="top-clr rounded-full border p-2 cursor-pointer"
                            data-tooltip-id="edit-notes"
                            onClick={() => {
                                setValue("uuid", params?.data?.uuid);
                                setValue("date", params?.data?.date);
                                setValue("quantity", params?.data?.quantity);
                                setItemModal(true); // Open the modal
                            }}
                        >
                            {React.cloneElement(icons.editIcon, { size: 18 })}
                        </span>
    
                        {params?.data?.status !== 0 && params?.data?.status !== 5 && params?.data?.status !== 3 && (
                            <ActionDropdown
                                options={filteredActions}
                                onAction={(e) => handleAction(e, params, params.data)}
                            />
                        )}
                    </div>
                );
            },
        },
    ];
    
    const handleAction = async (action, params, master) => {
        const actionTypeMapping = {
            Approved: 2,
            Transit: 4,
            Delivered: 5,
            Cancel: "0",
            Reject: 3,
        };

        // Get the action type number based on the action name
        const actionType = actionTypeMapping[action] || null;
        setValue("status", Number(actionType)); // Convert actionType to a number
        setValue("uuid", params.data.uuid); // Set the UUID
        setIsApproveModal(true); // Open the modal
    };

    const updateItem = async (data) => {
        setLoading(true);
        try {
            const result = await MaterialReturnUpdateEffect(data);
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
            fetchMaterialReturn();
            setItemModal(false);
            reset();

        }
    };

    const approveHandler = async (data) => {

        setLoading(true);
        try {
            const result = await MaterialReturnApprovedEffect(data);
            
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
            fetchMaterialReturn(); // Refresh the list
            setIsApproveModal(false); // Close the modal
            reset();
        }

    };

    return (
        <div >
            {toastData?.show && (
                <AlertNotification
                    show={toastData?.show}
                    message={toastData?.message}
                    onClose={toastOnclose}
                />
            )}
            {loading && (
                <Loader />
            )}
            <>
                <div className=" rounded-lg pe-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center p-4">
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
                    <div className="flex items-center gap-2">
                        <DateRangePickerComponent className="darkCardBg "
                            focusedInput={focusedInput}
                            onFocusChange={setFocusedInput}
                            startDate={filters.startDate}
                            endDate={filters.endDate}
                            onDatesChange={handleDateChange}
                        />
                        <FilterDropdown
                            options={StatusFilter}
                            placeholder="Status"
                            // showClearButton={true}
                            onFilter={handleStatusChange}
                            value={filters.status} // Bind the value to the filters.status state
                        />
                        <div>

                            <IconButton
                                label="Create"
                                icon={icons.plusIcon}
                                onClick={() => {
                                    navigate("/user/project/material-return/add-material-return", {
                                        state: {
                                            project_id: projectDetails?.project_no, isperticularproject: true, iscreate_new: true, tabs_Details: { ...projectDetails, tab: 5 ,pro_id:projectDetails?.project_no }
                                        }
                                    });
                                }}
                            />
                        </div>

                    </div>
                </div>
            </>

            {!loading && materialReturn?.data?.length > 0 ? (
                <>
                    <ReusableAgGrid
                        key={columnDefs.length}
                        rowData={materialReturn?.data}
                        columnDefs={columnDefs}
                        defaultColDef={{ resizable: false }}
                        onGridReady={(params) => params.api.sizeColumnsToFit()}
                        pagination={false}
                        showCheckbox={false}
                    />
                    <Pagination
                        currentPage={paginationCurrentPage}
                        totalPages={materialReturn?.last_page || 1}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        startItem={materialReturn?.from || 0}
                        endItem={materialReturn?.to || 0}
                        totalItems={materialReturn?.total || 0}
                    />

                </>
            ) : (
                !loading && <div className="bg-white rounded-lg pe-3 flex w-full h- items-center justify-center text-gray-500">
                    No materialReturn found.</div>
            )}
            <Modal
                isOpen={isApproveModal}
                onClose={() => { setIsApproveModal(false); reset(); }}
                title="approve Material Return"
                showHeader
                size="m"
                showFooter={false}
            >
                <form onSubmit={handleSubmit(approveHandler)}>
                    <input type="hidden" {...register("uuid")} />
                    <input type="hidden" {...register("status")} />
                    <div>
                        <TextArea
                            label="reason"
                            id="reason"
                            placeholder="reason"
                            register={register}
                            validation={{
                                required: "Please Enter reason"
                            }}
                            errors={errors}
                        />

                    </div>

                    <div className="flex mt-4">
                        <IconButton label="Submit" icon={icons.saveIcon} type="submit" loading={loading} />
                    </div>
                </form>

            </Modal>
            <Modal
                isOpen={itemModal}
                onClose={() => { setItemModal(false); reset(); }}
                title="Update Material Return"
                showHeader
                size="m"
                showFooter={false}
            >

                <form onSubmit={handleSubmit(updateItem)}>
                    <input type="hidden" {...register("uuid")} />
                    <input type="hidden" {...register("date")} />

                    <div>
                        <FormInput
                            label="Quantity"
                            id="quantity"
                            placeholder="quantity"
                            type="number"
                            min={0}
                            register={register}
                            validation={{
                                required: "Please Enter quantity"
                            }}
                            errors={errors}
                        />

                    </div>

                    <div className="flex mt-4">
                        <IconButton label="Submit" icon={icons.saveIcon} type="submit" loading={loading} />
                    </div>
                </form>
                {/* <DevTool control={control} /> */}

            </Modal>
        </div>
    );
};

export default MaterialReturn;