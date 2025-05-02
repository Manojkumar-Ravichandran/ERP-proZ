import React, { useEffect, useState } from 'react'
import Loader from '../../../components/Loader/Loader';
import Pagination from '../../../UI/AgGridTable/Pagination/Pagination';
import ReusableAgGrid from '../../../UI/AgGridTable/AgGridTable';
import ExportButton from '../../../UI/AgGridTable/ExportBtn/ExportBtn';
import IconButton from '../../../UI/Buttons/IconButton/IconButton';
import DateRangePickerComponent from '../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent';
import FilterDropdown from '../../../components/DropdownFilter/FilterDropdown';
import AlertNotification from '../../../UI/AlertNotification/AlertNotification';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import icons from '../../../contents/Icons';
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import ActionDropdown from '../../../UI/AgGridTable/ActionDropdown/ActionDropdown';
import StatusManager from '../../../UI/StatusManager/StatusManager';
import moment from 'moment';
import { convertToIST, formatDateToYYYYMMDD } from '../../../utils/Date';
import { MaterialReturnListEffect } from '../../../redux/project/ProjectEffects';
import { getAllProductListEffect, getEmployeeListCountEffect, getMaterialDetailEffect } from '../../../redux/common/CommonEffects';
import { getLeadCategoryListEffect, leadReportEffect } from '../../../redux/CRM/lead/LeadEffects';


function Report() {
    const [focusedInput, setFocusedInput] = useState(null);
    const [focusedInput1, setFocusedInput1] = useState(null);
    const [focusedInput2, setFocusedInput2] = useState(null);

    const navigate = useNavigate();
    const {
        register,
        control, reset,
        setValue,
        handleSubmit, getValues,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();


    const [searchText, setSearchText] = useState("");
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
    const [projectList, setProjectList] = useState(
        []
    );
    const [paginationPageSize, setPaginationPageSize] = useState(10);
    const [loading, setLoading] = useState(true);
    const [toastData, setToastData] = useState({ show: false });

    const [leadCategoryList, setLeadCategoryList] = useState([]);
    const toastOnclose = () => {
        setToastData({ ...toastData, show: false });
    };

    const [filters, setFilters] = useState({

        // Default to today's end of the day
        created_from: moment(), // Default to 30 days ago
        created_to: moment(), // Default to today
        last_followup_from: null,
        last_followup_to: null,
        next_followup_from: null,
        next_followup_to: null,
        incharge: "ALL",
        material_details: "ALL",
        roof_type: "ALL",
        lead_category: "ALL",
        search: "",
    });
    const [StatusFilter, setStatusFilter] = useState([
        { label: "All", value: null },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },   
    ]);
    const [productList, setProductList] = useState([]);
    const [employeeCountList, setEmployeeCountList] = useState([]);

    useEffect(() => {
        fetchLeadList();
    }, [paginationPageSize, paginationCurrentPage, filters, searchText]);
    const [materialDetailList, setMaterialDetailList] = useState([]);
    const fetchLeadList = async () => {
        setLoading(true);
        try {
            const response = await leadReportEffect({
                page: paginationCurrentPage,
                page_size: paginationPageSize,
                search: searchText,
                created_from: filters.created_from ? formatDateToYYYYMMDD(filters.created_from) : "",
                created_to: filters.created_to ? formatDateToYYYYMMDD(filters.created_to) : "",
                last_followup_from: filters.last_followup_from
                    ? formatDateToYYYYMMDD(filters.last_followup_from)
                    : "",
                last_followup_to: filters.last_followup_to
                    ? formatDateToYYYYMMDD(filters.last_followup_to)
                    : "",
                next_followup_from: filters.next_followup_from
                    ? formatDateToYYYYMMDD(filters.next_followup_from)
                    : "",
                next_followup_to: filters.next_followup_to
                    ? formatDateToYYYYMMDD(filters.next_followup_to)
                    : "",
                incharge: filters.incharge,
                lead_category: filters.lead_category,
                material_details: filters.material_details,
                roof_type: filters.roof_type,
            });
            setProjectList(response.data.data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };
    const handleDateChange = ({ startDate, endDate }) => {
        setFilters((prev) => ({ ...prev, startDate, endDate }));
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        if (!e.target.value) setPaginationCurrentPage(1);
    };
    const handleStatusChange = (selectedOption) => {
        setFilters((prev) => ({ ...prev, status: selectedOption || "" }));
    };

    const handlePageChange = (page) => {
        setPaginationCurrentPage(page);
        fetchLeadList();
    };
    const breadcrumbItems = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Report", link: "" },
    ];

    const handlePageSizeChange = (pageSize) => {
        setPaginationPageSize(pageSize);
        setPaginationCurrentPage(1);
        fetchLeadList();
    };

    const handleClearFilters = () => {
        setFilters({
            created_from: moment(), // Default to 30 days ago
            created_to: moment(), 
            last_followup_from: null,
            last_followup_to: null,
            next_followup_from: null,
            next_followup_to: null,
            incharge: "ALL",
            material_details: "ALL",
            roof_type: "ALL",
            lead_category: "ALL",
        });
        setSearchText(""); 
        setPaginationCurrentPage(1); 
        fetchLeadList(); 
    };
    useEffect(() => {
        (async () => {
            try {
                setEmployeeCountList([]);
                let { data } = await getEmployeeListCountEffect();
                data = data.data.map((list) => ({
                    label: list.name,
                    value: list.id,
                    count: list.count,
                    sec_count: list.sec_count, // Ensure sec_count is included
                }));
                data.unshift({ label: "ALL", value: "ALL" });
                setEmployeeCountList(data);
            } catch (error) {
                setEmployeeCountList([]);
            }
        })();
    }, []);
    useEffect(() => {
        if (materialDetailList.length === 0) {
            (async () => {
                try {
                    let { data } = await getMaterialDetailEffect();
                    data = data.data.map((list) => ({
                        ...list,
                        label: list.name,
                        value: list.id,
                    }));
                    data.unshift({ label: "ALL", value: "ALL" });
                    setMaterialDetailList(data);
                } catch (error) {
                    setMaterialDetailList([]);
                }
            })();
        }
        setValue("material_details", "");
    }, [materialDetailList]);
    // const columnDefs = [
    //     {
    //         headerName: "Project Number", field: "project_id", unSortIcon: true, cellRenderer: (params) => {
    //             const uuid = params.data.project_uuid;
    //             const project_id = params.data.project_no || "";
    //             const datailList = { project_id: project_id, pro_id: params.data.project_id, project_uuid: uuid, tab: 5 }

    //             return (
    //                 <div>
    //                     <button
    //                         className="top-clr underline"
    //                         onClick={() =>
    //                             navigate(`/user/project/project-detail/${uuid}`, {
    //                                 state: { ...datailList },
    //                             })
    //                         }
    //                     >
    //                         {project_id}
    //                     </button>
    //                 </div>
    //             );
    //         }
    //     }, { headerName: "Material Request ID", field: "request_no", unSortIcon: true },
    //     { headerName: "Item name ", field: "item_name", unSortIcon: true, },
    //     { headerName: "Quantity", field: "quantity", unSortIcon: true },
    //     // { headerName: " Planned date", field: "planned_date", unSortIcon: true, },
    //     // { headerName: "Priority ", field: "priority", unSortIcon: true, },
    //     {
    //         headerName: "Status",
    //         field: "status",
    //         sortable: false,
    //         cellRenderer: (params) => {
    //             const statusMapping = {
    //                 1: "darkpurple",
    //                 0: "darkRed",
    //                 2: "lightgreen",
    //                 5: "darkBlue",
    //                 4: "warning",
    //                 3: "darkpink",

    //             };
    //             const status = statusMapping[params?.data?.status];
    //             return (
    //                 <div className="flex justify-center items-center w-100">
    //                     <div className="flex justify-center">
    //                         <StatusManager
    //                             status={status}
    //                             message={
    //                                 params?.data?.status_label
    //                             }
    //                         />            </div>
    //                 </div>

    //             );
    //         },
    //     },

    //     // {
    //     //   headerName: "Action",
    //     //   field: "action",
    //     //   sortable: false,
    //     //   pinned: "right",
    //     //   maxWidth: 200,
    //     //   minWidth: 150,
    //     //   cellRenderer: (params) => {
    //     //     const filteredActions = ActionButton.filter((action) => {
    //     //       if (params?.data?.status === 1) {
    //     //         return ["Approved", "Cancel", "Reject"].includes(action.action);
    //     //       }
    //     //       if (params?.data?.status === 2) {
    //     //         return ["Transit"].includes(action.action);
    //     //       }
    //     //       if (params?.data?.status === 4) {
    //     //         return ["Delivered"].includes(action.action);
    //     //       }
    //     //       return false; // Exclude actions for other statuses
    //     //     });

    //     //     return (
    //     //       <div className={`flex gap-1 items-center ${params?.data?.status !== 1 ? "justify-end" : "justify-center"}`}
    //     //       >
    //     //         {/* <span
    //     //           className="top-clr rounded-full border p-2 cursor-pointer"
    //     //           // data-tooltip-id="edit-notes"
    //     //           onClick={() => {

    //     //             // setValue("uuid", params?.data?.uuid);
    //     //             setItemList(params?.data);
    //     //             // setValue("sub_tasks_name", params?.data?.name);
    //     //             // setValue("duration", params?.data?.duration);
    //     //             // setValue("duration_type", params?.data?.duration_type);
    //     //             setItemModal(true); // Open the modal
    //     //           }}
    //     //         >
    //     //           {React.cloneElement(icons.viewIcon, { size: 18 })}
    //     //         </span> */}

    //     //         <span
    //     //           className="top-clr rounded-full border p-2 cursor-pointer"
    //     //           data-tooltip-id="edit-notes"
    //     //           onClick={() => {



    //     //             setValue("uuid", params?.data?.uuid);
    //     //             setValue("date", params?.data?.date);
    //     //             setValue("quantity", params?.data?.quantity);

    //     //             // setItemModal(true);

    //     //             // navigate("/user/project/material-return/add-material-return", { state: { ...params.data } });

    //     //             // navigate("/user/accounts/sale/create-sale-quotation", { state: { ...params.data } });
    //     //           }}
    //     //         >
    //     //           {React.cloneElement(icons.editIcon, { size: 18 })}
    //     //         </span>

    //     //         {/* {params?.data?.status !== 0 && params?.data?.status !== 5 && params?.data?.status !== 3 && (
    //     //           <ActionDropdown
    //     //             options={filteredActions}
    //     //             onAction={(e) => handleAction(e, params, params.data)}
    //     //           />
    //     //         )} */}
    //     //         {/* } */}
    //     //         {/* <ActionDropdown
    //     //           iconClass="top-clr rounded-full border p-2 cursor-pointer"
    //     //           icon={icons.MdShare}
    //     //           // options={ActionDropdowns}
    //     //           // onAction={(e) => handleAction(e, params, params.data)}
    //     //         /> */}
    //     //       </div>
    //     //     );
    //     //   },
    //     // },
    //     //  {
    //     //       headerName: "Action",
    //     //       field: "action",
    //     //       pinned: "right",
    //     //       minWidth: 250,
    //     //       maxWidth: 250,
    //     //       sortable: false,
    //     //       cellRenderer: (params) =>
    //     //         { 
    //     //           const filteredActions = ActionButton.filter((action) => {
    //     //             if (params?.data?.status === 1) {
    //     //               return ["Approved", "Cancel", "Reject"].includes(action.action);
    //     //             }
    //     //             if (params?.data?.status === 2) {
    //     //               return ["Transit"].includes(action.action);
    //     //             }
    //     //             if (params?.data?.status === 4) {
    //     //               return ["Delivered"].includes(action.action);
    //     //             }
    //     //             return false; // Exclude actions for other statuses
    //     //           });
    //     //           (
    //     //         <div className="">
    //     //           <ActionDropdown
    //     //             options={filteredActions}
    //     //             onAction={(e) => handleAction(e, params)}
    //     //           />
    //     //         </div>
    //     //       )}
    //     //     },
    // ];

    useEffect(() => {
        if (productList.length === 0) {
            (async () => {
                try {
                    let { data } = await getAllProductListEffect();
                    data = data.data.map((list) => ({
                        ...list,
                        label: list.product_name,
                        value: list.id,
                    }));
                    data.unshift({ label: "ALL", value: "ALL" });
                    setProductList(data);
                } catch (error) {
                    setProductList([]);

                    // setItemList([]);
                }
            })();
        }
    }, [productList]);
    
    useEffect(() => {
       
            (async () => {
                try {
                    let { data } = await getLeadCategoryListEffect();
                    data = data.data.map((list) => ({
                        ...list,
                        label: list.name,
                        value: list.id,
                    }));
                    data.unshift({ label: "ALL", value: "ALL" });
                    setLeadCategoryList(data);
                } catch (error) {
                    setLeadCategoryList([]);

                    // setItemList([]);
                }
            })();
        }
   ,[]);
    const columnDefs = [
        // { headerName: 'Lead Id', field: 'lead_id', minWidth: 120, maxWidth: 120, unSortIcon: true },
        {
            headerName: "Name",
            unSortIcon: true,
            minWidth: 200,
            maxWidth: 200,
            cellRenderer: (params) => {
                const uuid = params.data.uuid;
                const leadId = params.data.lead_id || "";
                const leadName = params.data.lead_name || "";

                return (
                    <div>
                        <button
                            className="text-blue underline"
                            onClick={() =>
                                navigate(`/user/crm/lead/detail-lead/${uuid}`, {
                                    state: { leadId }, // Pass leadId in state
                                })
                            }
                            title="View Lead Details"
                        >
                            {leadId} - {leadName}
                        </button>
                    </div>
                );
            },
        },

        {
            headerName: "Contact",
            field: "lead_contact",
            // minWidth: 200,
            // maxWidth: 200,
            unSortIcon: true,
        },

        {
            headerName: "Next Follow-up",
            field: "next_followup",
            // minWidth: 200,
            // maxWidth: 200,
            valueGetter: (params) => convertToIST(params.data.next_followup) || "",
            unSortIcon: true,
        },
        {
            headerName: "Last update Date",
            field: "next_followup",
            // minWidth: 200,
            // maxWidth: 200,
            // valueGetter: (params) => params.data.last_followup || "11-11-2024",
            valueGetter: (params) => {
                const dateString = params.data.last_followup || "2024-11-11";
                const date = new Date(dateString);

                if (isNaN(date)) {
                    return dateString; // Return the original value if not a valid date
                }

                // Extract and format day, month, and year
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
                const year = date.getFullYear();

                return `${day}-${month}-${year}`;
            },
            unSortIcon: true,
        },
        {
            headerName: "Over Due Days",
            field: "overdue_days",
            minWidth: 200,
            maxWidth: 200,
            unSortIcon: true,
            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering
        },

        {
            headerName: "Incharge",
            field: "incharge_name",
            // minWidth: 200,
            // maxWidth: 200,

            unSortIcon: true,
        },
        {
            headerName: "Stages",
            field: "stage_name",
            // minWidth: 200,
            // maxWidth: 200,
            // unSortIcon: true,
            sortable: false,
            valueGetter: (params) => {
                if (params?.data?.is_closed) {
                    if (params?.data?.is_closed_type == "won") {
                        return "Won";
                    } else {
                        return "Lost";
                    }
                } else {
                    return params.data.stage_name || "Enquiry";
                }
                // Provide a default value if "stage_name" is not available
            },
            cellRenderer: (params) => {
                // Define a mapping of stage_name to status
                const statusMapping = {
                    New: "success",
                    Enquiry: "warning",
                    Lost: "error",
                    FollowUp: "inprogress",
                    Quotation: "info",
                };

                // Get the appropriate status based on the stage_name
                const status = statusMapping[params.value] || "success"; // Default to "success" if not found

                return (
                    <div className="flex items-center">
                        <StatusManager status={status} message={params.value} />
                    </div>
                );
            },
        },

        // {
        //   headerName: "Action",
        //   field: "action",
        //   pinned: "right",
        //   // minWidth: 250,
        //   // maxWidth: 250,
        //   sortable: false,
        //   cellRenderer: (params) => (
        //     <div className="">
        //       <ActionDropdown
        //         options={params?.data?.is_closed ? limitOptions : option}
        //         onAction={(e) => handleAction(e, params)}
        //       />
        //       {/* <ActionModal /> */}
        //     </div>
        //   ),
        // },
    ];
    return (
        <>
            {toastData?.show && (
                <AlertNotification
                    show={toastData?.show}
                    message={toastData?.message}
                    onClose={toastOnclose}
                />
            )}
            <div className=" rounded-lg p-2 my-2 bg-white darkCardBg flex items-center justify-between">
                <Breadcrumb items={breadcrumbItems} />

            </div>
            <div className=" py-3 ">
                <div className=" pe-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">

                        <DateRangePickerComponent className="darkCardBg "
                            label="Next Follow-Up"
                            focusedInput={focusedInput}
                            onFocusChange={setFocusedInput}
                            startDate={filters.next_followup_from}
                            endDate={filters.next_followup_to}
                            // onDatesChange={handleDateChange}
                            onDatesChange={({ startDate, endDate }) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    next_followup_from: startDate,
                                    next_followup_to: endDate,
                                }))
                            }
                        />
                        <DateRangePickerComponent className="darkCardBg "
                            label="Lead Created"
                            focusedInput={focusedInput1}
                            onFocusChange={setFocusedInput1}
                            startDate={filters.created_from}
                            endDate={filters.created_to}
                            onDatesChange={({ startDate, endDate }) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    created_from: startDate,
                                    created_to: endDate,
                                }))
                            }

                        />
                        <DateRangePickerComponent
                            className="darkCardBg"
                            label="Last Follow-Up"
                            focusedInput={focusedInput2}
                            onFocusChange={setFocusedInput2}
                            startDate={filters.last_followup_from}
                            endDate={filters.last_followup_to}
                            onDatesChange={({ startDate, endDate }) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    last_followup_from: startDate,
                                    last_followup_to: endDate,
                                }))
                            }
                        />





                    </div>
                    <div className="flex items-end gap-2">
                        <button
                            className="chips text-white px-3 py-10 ml-5 rounded transition float-end gap-2 align-middle"
                            onClick={handleClearFilters}
                        >
                            <span>{icons.clear}</span> Clear Filters
                        </button>            </div>
                </div>
            </div>


            <div className="bg-white py-3 rounded-lg darkCardBg mb-4">
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
                    <FilterDropdown
                            label=" Lead Category"
                            options={leadCategoryList || []}
                            placeholder="Select Lead Category"
                            onFilter={(value) =>
                                setFilters((prev) => ({ ...prev,lead_category : value }))
                            }
                            value={filters.lead_category}
                        />
                    
                        <FilterDropdown
                            label="Incharge"
                            options={employeeCountList || []}
                            placeholder="Select Incharge"
                            onFilter={(value) =>
                                setFilters((prev) => ({ ...prev, incharge: value }))
                            }
                            value={filters.incharge}
                        />

                        {/* Material Details Dropdown */}
                        <FilterDropdown
                            label="Material Details"
                            options={materialDetailList || []}
                            placeholder="Select Material"
                            onFilter={(value) =>
                                setFilters((prev) => ({ ...prev, material_details: value }))
                            }
                            value={filters.material_details}
                        />

                        {/* Roof Type Dropdown */}
                        <FilterDropdown
                            label="Roof Type"
                            options={productList || []}
                            placeholder="Select Roof Type"
                            onFilter={(value) =>
                                setFilters((prev) => ({ ...prev, roof_type: value }))
                            }
                            value={filters.roof_type}
                        />
                    </div>
                </div>
            </div>

            {projectList?.data?.length > 0 ? (
                <>
                    <ReusableAgGrid
                        key={columnDefs.length}
                        rowData={projectList?.data}
                        columnDefs={columnDefs}
                        defaultColDef={{ resizable: false }}
                        onGridReady={(params) => params.api.sizeColumnsToFit()}
                        pagination={false}
                        showCheckbox={false}
                    />
                    <Pagination
                        currentPage={paginationCurrentPage}
                        totalPages={projectList?.last_page || 1}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        startItem={projectList?.from || 0}
                        endItem={projectList?.to || 0}
                        totalItems={projectList?.total || 0}
                    />
                </>
            ) : !loading ? (
                <div className="flex justify-center items-center h-40 text-gray-500 text-lg font-semibold">
                    No Data Found
                </div>
            ) : (
                <Loader />
            )}

        </>
    )
}

export default Report
