import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from 'react-router';
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import icons from "../../../contents/Icons";
import ExportButton from "../../../UI/AgGridTable/ExportBtn/ExportBtn";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import { fetchReason, updateReason } from "../../../redux/Utils/Reason/ReasonAction";
import CreateReasons from "./CreateReasons";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import Pagination from "../../../UI/AgGridTable/Pagination/Pagination";
import { useForm } from "react-hook-form";
import ActionDropdown from "../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import formatDateForDisplay from "../../../UI/Date/DateDisplay";
import formatDateForInput from "../../../UI/Date/Date";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import Modal from "../../../UI/Modal/Modal";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import Select from "../../../UI/Select/SingleSelect";

const Reasons = () => {
    const dispatch = useDispatch();
    // Redux state
    const { inventory = [], pagination = {}, error } = useSelector(
        (state) => state.reason || {}
    );
    const reasonData = inventory?.data || [];
    
    const { register, formState: { errors }, handleSubmit, setValue } = useForm();
    const [toastData, setToastData] = useState({ show: false });
    const navigate = useNavigate();
    const [unitList, setUnitList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [isUpdateModal, setIsUpdateModal] = useState(false);
    // Destructure pagination safely
    const current_page = pagination?.current_page || 1;
    const total_pages = pagination?.last_page || 1;
    const total_items = pagination?.total || 0;

    // Component state
    const [paginationPageSize, setPaginationPageSize] = useState(10);
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(current_page);
    const [searchText, setSearchText] = useState("");
    const [isMasterCreateModal, setIsMasterCreateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState();
    const [loading, setLoading] = useState(false);
    const [isViewModal, setIsViewModal] = useState(false);
    const [selectedType, setSelectedType] = useState("");

    const breadcrumbItems = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Reason List", link: "" }
    ];
    const reasonType = [
        { label: "Reopen Reason", value: "reopen_reason" },
        { label: "Lost Reason", value: "lost_reason" },
        { label: "Reallocate Reason", value: "reallocate_reason" },
    ];
    // Function to fetch inventory master data
    const fetchData = () => {
        dispatch(fetchReason({ page: paginationCurrentPage, per_page: paginationPageSize, type: selectedType }));
    };

    useEffect(() => {
        fetchData();
    }, [dispatch, paginationCurrentPage, paginationPageSize, selectedType]);

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

    const option = [
        { label: "Edit", action: "edit", icon: icons.pencil },
        { label: "View", action: "view", icon: icons.viewIcon },
        { label: "Delete", action: "delete", icon: icons.deleteIcon },
    ];

    const handleAction = (action, e, master) => {
        setSelectedUser(e.data);
        const { uuid, id, name } = e?.data || {};
        if (action === "edit" && uuid && id) {
            setValue("name", name);
            setIsUpdateModal(true);
        } else if (action === "view" && uuid && id) {
            setIsViewModal(true);
        }
    };

    const columnDefs = [
        { headerName: "Name", field: "name", unSortIcon: true },
        {
          headerName: "Type",
          field: "type",
          unSortIcon: true,
          valueGetter: (params) => {
            const typeMapping = {
              reopen_reason: "Reopen Reason",
              lost_reason: "Lost Reason",
              reallocate_reason: 'Reallocate Reason',
            };
            return typeMapping[params.data.type] || params.data.type; // Default fallback
          },
        },
            
        {
            headerName: "Action", field: "action", sortable: false, pinned: "right", cellRenderer: (params) => {
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
            updateReason({
                ...data,
                uuid: selectedUser?.uuid,
                callback: masterHandler,
            })
        )
    };
    const toastOnclose = () => {
        setToastData({ ...toastData, show: false });
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
                        {/* <div className="ps-3" >
                            <Select
                                options={reasonType}
                                id="type"
                                placeholder="Select Reason Type"
                                register={register}
                                errors={errors}
                                style={{ width: "130%" }}
                            />
                        </div> */}
                        {/* <div className="flex items-center gap-2">
                            <select
                                value={selectedType}
                                onChange={(e) => {
                                    setSelectedType(e.target.value);
                                    setPaginationCurrentPage(1); 
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Reasons</option> 
                                <option value="reopen_reason">Reopen Reason</option>
                                <option value="lost_reason">Lost Reason</option>
                                <option value="reallocate_reason">Reallocate Reason</option>
                            </select>
                        </div> */}

                    </div>
                    <div className="flex items-center gap-2">
                        <CreateReasons onSuccess={handleCreateSuccess} />
                        <ExportButton label="Export" data={reasonData} filename="Reason List" />
                    </div>
                </div>
            </div>
            <div>
                <ReusableAgGrid
                    key={columnDefs.length}
                    rowData={reasonData}
                    columnDefs={columnDefs}
                    defaultColDef={{ resizable: true }}
                    onGridReady={(params) => {
                        params.api.sizeColumnsToFit();
                    }}
                    pagination={false}
                    showCheckbox={false}
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
                title="Update Reasons"
                showHeader
                size="m"
                showFooter={false}
            >
                <form onSubmit={handleSubmit(updateHandler)}>
                    <input type="hidden" {...register("uuid")} value={selectedUser?.uuid} />
                    <div>
                        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> */}
                        <TextArea
                            label="Reason"
                            id="name"
                            type="text"
                            iconLabel={icons.GoNote}
                            placeholder="Enter Reason"
                            register={register}
                            validation={{
                                required: "Reason is required"
                            }}
                            errors={errors}
                        />



                    </div>
                    <div className="flex mt-4">
                        <IconButton label="Update Reason" icon={icons.saveIcon} type="submit" loading={loading} />
                    </div>
                </form>
            </Modal>
            <Modal isOpen={isViewModal} onClose={() => setIsViewModal(false)} title="View Reason" showHeader size="m" showFooter={false}>
                <div>
                    <div className="pb-4">
                        <p className="text-sm font-medium text-gray-500 w-32">
                            <span className="flex gap-1 items-center">{icons.GoNote} Reason:</span> </p>
                        <p>{selectedUser?.name}</p>
                    </div>
                    <div className="flex items-start">
                        <p className="text-sm font-medium text-gray-500 w-32">
                            <span className="flex gap-1 items-center">{icons.employeeIcon} Created By:</span> </p>
                        <p className="text-sm font-normal text-gray-800 capitalize">{selectedUser?.created_by}</p>
                    </div>
                </div>
            </Modal>
        </>
    )
};
export default Reasons;
