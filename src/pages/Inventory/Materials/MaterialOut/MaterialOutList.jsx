import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from 'react-router'
import { fetchMaterialInOut, updateMaterialInOut } from "../../../../redux/Inventory/Material/MaterialInOut/MaterialInOutAction";
import ReusableAgGrid from "../../../../UI/AgGridTable/AgGridTable";
import Pagination from "../../../../UI/AgGridTable/Pagination/Pagination";
import Breadcrumb from "../../../../UI/Breadcrumps/Breadcrumps";
import icons from "../../../../contents/Icons";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import ExportButton from "../../../../UI/AgGridTable/ExportBtn/ExportBtn";
import DateRangePickerComponent from "../../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent";
import Modal from "../../../../UI/Modal/Modal";
import ActionDropdown from "../../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import { useForm } from "react-hook-form";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";
// import '../MaterialIn/MaterilaInList.css'
import TextArea from "../../../../UI/Input/TextArea/TextArea";
import Select from "../../../../UI/Select/SingleSelect";
import MaterialOutAdd from "./MaterialOutAdd";
import FileInput from "../../../../UI/Input/FileInput/FileInput"
import formatDateForDisplay from "../../../../UI/Date/DateDisplay"; 
import formatDateForInput from "../../../../UI/Date/Date"; 

const MaterialOutList = () => {
    const dispatch = useDispatch();
    const { inventory, pagination, error } = useSelector((state) => state.materialInOut);
    const materialInData = inventory?.data || [];
    console.log("materialInData", materialInData)
    // console.log("materialInData", materialInData)
    const current_page = pagination?.current_page || 1;
    const total_pages = pagination?.last_page || 1;
    const total_items = pagination?.total || 0;
    const [toastData, setToastData] = useState({ show: false });
    const [paginationPageSize, setPaginationPageSize] = useState(10);
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(current_page);
    const [searchText, setSearchText] = useState("");
    const [dates, setDates] = useState({ startDate: null, endDate: null });
    const [isMasterCreateModal, setIsMasterCreateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState();
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("in");
    const [isMasterUpdateModal, setIsMasterUpdateModal] = useState(false);
    const { register, formState: { errors }, handleSubmit, setValue } = useForm();
    const [isUpdateModal, setIsUpdateModal] = useState(false);


    const breadcrumbItems = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Material Out", link: "" },
    ];
    const toastOnclose = () => {
        setToastData({ ...toastData, show: false });
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
    const columnDefs = [
        {
            headerName: "Date",
            field: "date",
            unSortIcon: true,
            valueGetter: (params) => {
                return formatDateForDisplay(params.data.date);
            },
        },
        // { headerName: "Date", field: "date", unSortIcon: true },
        { headerName: "Logistics Type", field: "logistics_type", unSortIcon: true },
        { headerName: "Vehicle No", field: "vehicle_no", unSortIcon: true },
        { headerName: "Material Type", field: "material_type", unSortIcon: true },
        { headerName: "Invoice No", field: "invoice_ref_no", unSortIcon: true },
        { headerName: "Item List", field: "material_name", unSortIcon: true },
        { headerName: "Quantity", field: "quantity", unSortIcon: true },
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

    const option = [
        { label: "View", action: "view", icon: icons.viewIcon },
        { label: "Edit", action: "edit", icon: icons.pencil },
    ];

    const handleAction = (action, e, master, callback) => {
        setSelectedUser(e.data);
        const { uuid, id, date, material_type, received_sent_by, logistics_type, vehicle_no, invoice_ref_no, attachment, item_id, quantity, unit, item_name } = e?.data || {};
        // const { uuid, id } = e?.data || {};
        if (action === "edit" && uuid && id) {
            setValue("date", date); // Assuming `date` is in the correct format
            setValue("material_type", material_type);
            // setValue("received_sent_by", received_sent_by);
            setValue("logistics_type", logistics_type);
            setValue("vehicle_no", vehicle_no);
            setValue("invoice_ref_no", invoice_ref_no);
            setValue("attachment", attachment);
            setValue("item_id", item_id);
            setValue("quantity", quantity);
            setValue("unit", unit);
            setValue("item_name", item_name)
            setIsUpdateModal(true);
        } else if (action === "view" && uuid && id) {

        }
    };


    // Function to fetch inventory master data
    const fetchData = () => {
        dispatch(fetchMaterialInOut({ page: paginationCurrentPage, per_page: paginationPageSize, type: "out" }));
    };

    useEffect(() => {
        fetchData();
    }, [dispatch, paginationCurrentPage, paginationPageSize, type]);
    const handleCreateSuccess = () => {
        fetchData();
    };
     const masterHandler = (response) => {
            
            if (response.success) {
                setToastData({ show: true, message: response.data.message, type: "success" });
                setIsUpdateModal(false);
                fetchData()
            } else {
                setToastData({ show: true, message: response.error, type: "error" });
            }
        };
        const updateHandler = (data) => {
            dispatch(
                updateMaterialInOut({
                    ...data,
                    uuid: data.uuid,
                    callback: masterHandler,
                })
            )
        };
        const materialType = [
            { label: "Purchase", value: "purchase" },
            // { label: "Sale", value: "sale" },
            { label: "Inter Transfer", value: "inter_transfer" },
            { label: "Return", value: "return" },
        ];
        const logisticsType = [
            { label: "Own", value: "own" },
            { label: "Parcel", value: "parcel" },
            { label: "Vendor", value: "vendor" },
        ];
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
                        {/* <div>
                            <DateRangePickerComponent
                                className="darkCardBg"
                                startDate={dates.startDate}
                                endDate={dates.endDate}
                                onDatesChange={handleDatesChange}
                            />
                        </div> */}
                    </div>
                    <div className="flex items-center">
                        <div className="me-3">
                            <MaterialOutAdd onSuccess={handleCreateSuccess} />
                        </div>
                        <div>
                            <ExportButton label="Export" data={materialInData} filename="Inventory Master List" />
                        </div>
                    </div>
                </div>
            </div>
            {materialInData.length === 0 ? (
                <p>No data available</p>
            ) : (
                <ReusableAgGrid
                    key={columnDefs.length}
                    rowData={materialInData}
                    columnDefs={columnDefs}
                    defaultColDef={{ resizable: true }}
                    onGridReady={(params) => {
                        params.api.sizeColumnsToFit();
                    }}
                    pagination={false}
                />
            )}

            <Pagination
                currentPage={paginationCurrentPage}
                totalPages={total_pages}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                startItem={(paginationCurrentPage - 1) * paginationPageSize + 1}
                endItem={Math.min(paginationCurrentPage * paginationPageSize, total_items)}
                totalItems={total_items}
            />
             <Modal
                isOpen={isUpdateModal}
                onClose={() => setIsUpdateModal(false)}
                title="Update Material Out"
                showHeader
                size="m"
                showFooter={false}
            >
                <form onSubmit={handleSubmit(updateHandler)}>
                    <input type="hidden" {...register("uuid")} value={selectedUser?.uuid} />
                    <FormInput
                        id="date"
                        iconLabel={icons.calendarWDate}
                        label="Date & Time"
                        type="datetime-local"
                        register={register}
                        errors={errors}
                    />
                    <Select
                        options={materialType}
                        label="Material Type"
                        id="material_type"
                        placeholder="Select Item"
                        register={register}
                        errors={errors}
                        iconLabel={icons.itemBox}
                    />
                    {/* <FormInput
                        label="Received/Sent By"
                        id="received_sent_by"
                        placeholder="Enter Received/Sent By"
                        register={register}
                        validation={{ required: "Received/Sent By is required" }}
                        errors={errors}
                        iconLabel={icons.replay}
                    /> */}
                    <Select
                        options={logisticsType}
                        label="Logistics Type"
                        id="logistics_type"
                        placeholder="Select Item"
                        register={register}
                        errors={errors}
                        iconLabel={icons.truck}
                    />
                    <FormInput
                        label="Vehicle Number"
                        id="vehicle_no"
                        placeholder="Enter Vehicle Number"
                        register={register}
                        validation={{ required: "Vehicle Number is required" }}
                        errors={errors}
                    />

                    <FormInput
                        label="Invoice Reference No"
                        id="invoice_ref_no"
                        placeholder="Enter Invoice Reference Number"
                        register={register}
                        validation={{ required: "Invoice Reference Number is required" }}
                        errors={errors}
                        iconLabel={icons.invoice}
                    />
  <FileInput
                        id="attachment"
                        label="Upload File"
                        showStar={false}
                        iconLabel={React.cloneElement(icons.filepin, { size: 20 })}
                        validation={{ required: false }}
                        register={register}
                        errors={errors}
                        accept=".jpg,.png,.pdf"
                        multiple={false}
                    />
                    {/* <FormInput
                        label="Attachment"
                        id="attachment"
                        type="file"
                        register={register}
                        errors={errors}
                        iconLabel={icons.filepin}
                    /> */}
                    <div>
                    <h4 className="mt-2">Items</h4>
                        <div>
                            <FormInput
                                label="Item Name"
                                id="item_id"
                                placeholder="Enter Item Name"
                                register={register}
                                validation={{ required: "Item Name is required" }}
                                errors={errors}
                                disabled={true}
                                
                                iconLabel={icons.itemBox}
                            />

                            <FormInput
                                label="Quantity"
                                id="quantity"
                                type="number"
                                placeholder="Enter Quantity"
                                register={register}
                                validation={{
                                    required: "Quantity is required",
                                    min: { value: 1, message: "Quantity must be at least 1" },
                                }}
                                errors={errors}
                                iconLabel={icons.BsBoxes}
                            />
                            <FormInput
                                label="Unit"
                                id="unit"
                                iconLabel={icons.unitIcon}
                                placeholder="Enter Unit"
                                register={register}
                                validation={{ required: "Unit is required" }}
                                errors={errors}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <IconButton label="Update" icon={icons.saveIcon} type="submit" className="my-3" loading={loading} />

                </form>
            </Modal>
        </>
    )
}
export default MaterialOutList;