import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from 'react-router'
import { fetchLendAssets, updateAssets, deleteAssets, returnLendAssets } from "../../../redux/Inventory/Assets/AssetsAction";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import Pagination from "../../../UI/AgGridTable/Pagination/Pagination";
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import icons from "../../../contents/Icons";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import ExportButton from "../../../UI/AgGridTable/ExportBtn/ExportBtn";
import DateRangePickerComponent from "../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent";
import Modal from "../../../UI/Modal/Modal";
import ActionDropdown from "../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import { useForm } from "react-hook-form";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Select from "../../../UI/Select/SingleSelect";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import AddAssets from "./AddAssets";
import formatDateForDisplay from "../../../UI/Date/DateDisplay";
import formatDateForInput from "../../../UI/Date/Date";
import ModalCenter from "../../../UI/ModalCenter/ModalCenter";
import FileInput from "../../../UI/Input/FileInput/FileInput"
import SingleCheckbox from "../../../UI/Input/CheckBoxInput/SingleCheckbox";
import { getAllItemListEffect, getAllUnitListEffect, getAllInventoryMasterListEffect, getEmployeeListEffect } from "../../../redux/common/CommonEffects";

const LendAssetsList = () => {
    const dispatch = useDispatch();
    // Redux state
    const { inventory = [], pagination = {}, error } = useSelector(
        (state) => state.assets || {}
    );
    const assetsData = inventory?.data || [];
    const { register, formState: { errors }, handleSubmit, setValue, reset } = useForm();
    const [toastData, setToastData] = useState({ show: false });
    const [isMasterViewModal, setIsMasterViewModal] = useState(false);
    const [isUpdateModal, setIsUpdateModal] = useState(false);
    const current_page = pagination?.current_page || 1;
    const total_pages = pagination?.last_page || 1;
    const total_items = pagination?.total || 0;
    const { createMaster } = useSelector((state) => state.master || {});

    // Component state
    const [paginationPageSize, setPaginationPageSize] = useState(10);
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(current_page);
    const [searchText, setSearchText] = useState("");
    const [dates, setDates] = useState({ startDate: null, endDate: null });
    const [isMasterCreateModal, setIsMasterCreateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState();
    const [loading, setLoading] = useState(false);
    const [employeeList, setEmployeeList] = useState([]);
    const [islendModal, setIslendModal] = useState(false);

    const breadcrumbItems = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Lend History List", link: "" }
    ];
    // Function to fetch inventory master data
    const fetchData = () => {
        dispatch(fetchLendAssets({ page: paginationCurrentPage, per_page: paginationPageSize }));
    };

    useEffect(() => {
        fetchData();
    }, [dispatch, paginationCurrentPage, paginationPageSize]);

    const handleCreateSuccess = () => {
        fetchData();
        setIsMasterCreateModal(false);
    };

    // Handle pagination
    const handlePageChange = (page) => {
        if (page > 0 && page <= total_pages) {
            setPaginationCurrentPage(page);
        }
    };

    // Handle page size change
    const handlePageSizeChange = (pageSize) => {
        setPaginationPageSize(pageSize);
        setPaginationCurrentPage(1);
    };

    // Handle search text change
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    // Handle date range change
    const handleDatesChange = ({ startDate, endDate }) => {
        setDates({ startDate, endDate });
    };

    const option = [
        // { label: "Edit", action: "edit", icon: icons.pencil },
        // { label: "Delete", action: "delete", icon: icons.deleteIcon },
        { label: "Return Lend", action: "lend", icon: React.cloneElement(icons?.lend, { size: 20 }) },

    ];

    const handleAction = (action, e, master) => {
        setSelectedUser(e.data);
        const { uuid, id, date, description, name,
            quantity, asset_type, expiry_date, is_expire,
        } = e?.data || {};
        if (action === "edit" && uuid && id) {
            setValue("date", formatDateForInput(date));
            setValue("name", name);
            setValue("description", description);
            setValue("quantity", quantity);
            setValue("asset_type", asset_type);
            setValue("expiry_date", expiry_date);
            setValue("is_expire", is_expire)
            setIsUpdateModal(true);
        } else if (action === "delete" && uuid && id) {
            setSelectedMaster(master);
            setIsDeleteModalOpen(true);
        } else if (action === "lend" && uuid && id) {
            setIslendModal(true);
            setValue("return_date", formatDateForInput(new Date()));
            // setValue("return_asset_cond", formatDateForInput(new Date()))
        }
    };
    const columnDefs = [
        { headerName: "Lend By", field: "lend_by_name", unSortIcon: true, },
        { headerName: "Lend To", field: "lend_to_name", unSortIcon: true },
        { headerName: "Return By", field: "return_by_name", unSortIcon: true, },
        { headerName: "Return To", field: "return_to_name", unSortIcon: true, },
        {
            headerName: "Return Date",
            field: "return_date",
            unSortIcon: true,
            valueGetter: (params) => {
                return formatDateForDisplay(params.data.return_date);
            },
        },
        // { headerName: "Renewal Date", field: "renewal", unSortIcon: true, },
        // { headerName: "Inventory Type", field: "inventory_type", unSortIcon: true, },
        {
            headerName: "Action",
            field: "action",
            sortable: false,
            pinned: "right",
            cellRenderer: (params) => {
                return (
                    <div>
                        <ActionDropdown options={option} onAction={(e) => handleAction(e, params, params.data)} />
                    </div>
                );
            },
        }
    ];
    const masterHandler = (response) => {
        
        if (response.success) {
            setToastData({ show: true, message: response.data.message, type: "success" });
            setIsUpdateModal(false);
            fetchData()
        } else {
            setToastData({ show: true, message: response.error, type: "error" });
        }
        setLoading(false);
    };
    const updateHandler = (data) => {
        dispatch(
            updateAssets({
                ...data,
                uuid: data.uuid,
                callback: masterHandler,
            })
        )
    };


    const toastOnclose = () => {
        setToastData({ ...toastData, show: false });
    };

    // State for modals and selected master
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMaster, setSelectedMaster] = useState(null);

    // Function to handle delete response
    const deleteHandler = (response) => {
        
        if (response?.success) {
            setToastData({ show: true, message: response.data.message, type: "success" });
            setIsDeleteModalOpen(false);
            fetchData();
        } else {
            setToastData({ show: true, message: response?.error || "Error deleting item", type: "error" });
        }
        setLoading(false);
    };

    // Function to handle delete confirmation
    const confirmDelete = () => {
        setLoading(true);
        if (selectedMaster) {
            try {
                const result = dispatch(deleteAssets({ ...selectedMaster, callback: deleteHandler }));
                
            } catch (error) {
                console.error("Error during deletion: ", error);
                setToastData({ show: true, message: "Deletion failed", type: "error" });
            }
        }
    };
    // Function to handle cancel
    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    const assetTypeList = [
        { label: "Return", value: "return" },
        { label: "Non Return", value: "non-return" }
    ];
    useEffect(() => {
        (async () => {
            try {
                let { data } = await getEmployeeListEffect();
                data = data.data.map((list) => ({
                    label: list.name,
                    value: list.id,
                }));
                setEmployeeList(data);
            } catch (error) {
                setEmployeeList([]);
            }
        })();
    }, []);
    useEffect(() => {
        
        if (createMaster?.success) {
            
            setToastData({ show: true, message: createMaster?.data?.message || "Success", type: "success" });
            // onSuccess?.();
            reset();
            fetchData();
        } else if (createMaster?.error) {
            console.error("Create master error:", createMaster?.error);
            setToastData({ show: true, message: createMaster?.error || "Failed", type: "error" });
        }
        setLoading(false);
    }, [createMaster, reset]);

    const addMasterHandler = (data) => {
        setLoading(true);
        dispatch(
            returnLendAssets({
                ...data,
                callback: masterHandlers,
            })
        );
    };

    const masterHandlers = (response) => {
        
        if (response.success) {
            setToastData({ show: true, message: response.data.message, type: "success" });
            setIslendModal(false);
            // onSuccess?.();
            reset();
            fetchData()
        } else {
            setToastData({ show: true, message: response.error, type: "error" });
        }
        setLoading(false);
    };

    return (
        <>
            {toastData.show && (
                <AlertNotification
                    type={toastData.type}
                    show={toastData.show}
                    message={toastData.message}
                    onClose={toastOnclose}
                />
            )}
            <div className="rounded-lg p-2 my-2 bg-white darkCardBg">
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <div className="bg-white py-3 rounded-lg darkCardBg">
                <div className="bg-white rounded-lg pe-3 flex items-center justify-between">
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
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3  cursor-pointer" >
                                    {icons.searchIcon}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ExportButton label="Export" data={assetsData} filename="Inventory Master List" />
                    </div>
                </div>
            </div>
            <div>
                <ReusableAgGrid
                    key={columnDefs.length}
                    rowData={assetsData}
                    columnDefs={columnDefs}
                    defaultColDef={{ resizable: true }}
                    onGridReady={(params) => {
                        params.api.sizeColumnsToFit();
                    }}
                    pagination={false}
                />

                <Pagination
                    currentPage={paginationCurrentPage}
                    totalPages={total_pages}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    startItem={(paginationCurrentPage - 1) * paginationPageSize + 1}
                    endItem={Math.min(paginationCurrentPage * paginationPageSize, total_items)}
                    totalItems={total_items}
                />
            </div>
            <Modal
                isOpen={isUpdateModal}
                onClose={() => setIsUpdateModal(false)}
                title="Update Assets Lend"
                showHeader
                size="m"
                showFooter={false}
            >
                <form onSubmit={handleSubmit(updateHandler)}>
                    <input type="hidden" {...register("uuid")} value={selectedUser?.uuid} />

                    <IconButton label="Update" icon={icons.saveIcon} type="submit" loading={loading} />
                </form>
            </Modal>
            {/* lend return form */}
            <Modal
                isOpen={islendModal}
                onClose={() => setIslendModal(false)}
                title="Return Lend Form"
                showHeader
                size="m"
                showFooter={false}
                className="darkCardBg"
            >
                <form onSubmit={handleSubmit(addMasterHandler)}>
                    <input type="hidden" {...register("uuid")} value={selectedUser?.uuid} />

                    <FormInput
                        id="return_date"
                        iconLabel={icons.calendarWDate}
                        label="Return Date"
                        type="date"
                        register={register}
                        errors={errors}
                    />
                    <TextArea
                        id="return_asset_cond"
                        iconLabel={icons.calendarWDate}
                        label="Return Content"
                        type=""
                        register={register}
                        errors={errors}
                    />

                    <Select
                        options={employeeList}
                        label="Return By"
                        id="return_by"
                        iconLabel={icons.itemBox}
                        placeholder="Select employee"
                        register={register}
                        errors={errors}
                        validation={{ required: false }}
                    // showStar={false}
                    />
                    <Select
                        options={employeeList}
                        label="Return To"
                        id="return_to"
                        iconLabel={icons.itemBox}
                        placeholder="Select employee"
                        register={register}
                        errors={errors}
                        validation={{ required: false }}
                    // showStar={false}
                    />
                    <FileInput
                        id="return_asset_photo"
                        label="Return Lend Photo"
                        showStar={false}
                        iconLabel={React.cloneElement(icons.filepin, { size: 20 })}
                        validation={{ required: false }}
                        register={register}
                        errors={errors}
                        accept=".jpg,.png,.pdf"
                        multiple={false}
                    />
                    <IconButton label="Add Lend" icon={icons.plusIcon} type="submit" loading={loading} />
                </form>
            </Modal>
        </>
    )
};
export default LendAssetsList;
