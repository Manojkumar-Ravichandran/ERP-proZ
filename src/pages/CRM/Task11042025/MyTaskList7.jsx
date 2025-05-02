import React, { useEffect, useState } from "react";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import { useDispatch, useSelector } from "react-redux";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import { useNavigate } from "react-router";
import ActionDropdown from "../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import icons from "../../../contents/Icons";
import Pagination from "../../../UI/AgGridTable/Pagination/Pagination";
import Modal from "../../../UI/Modal/Modal";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import { useForm } from "react-hook-form";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import { getMyTaskListInProgress } from "../../../redux/CRM/Customer/CustomerActions";
import StatusManager from "../../../UI/StatusManager/StatusManager";
import formatDateForDisplay from "../../../UI/Date/DateDisplay"; 
import formatTimeForDisplay from "../../../UI/Date/Time";
export default function MyTaskList() {
    const breadcrumbItems = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "MyTask List" },
    ];
    const [toastData, setToastData] = useState({ show: false });
    const [taskList, settaskList] = useState([]);
    const [taskData, settaskData] = useState();
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
    const [paginationPageSize, setPaginationPageSize] = useState(10);
    const taskDatas = useSelector((state) => state?.customer?.customerList);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        getTaskList();
    }, []);

    const getTaskList = (payload = {}) => {
        dispatch(getMyTaskListInProgress(payload));
    };

    useEffect(() => {
        settaskData(taskDatas);
        if (taskDatas?.data?.length > 0) {
            settaskList([...taskDatas?.data]);
        } else {
            console.log("No data found in taskDatas.");
            settaskList([]);
        }
    }, [taskDatas]);

    const columnDefs = [
       
        {
            headerName: "Name",
            field: "lead_name", 
            minWidth: 250,
            unSortIcon: true,
            valueGetter: (params) => {
                const leadId = params.data.lead_leadid ;
                const leadName = params.data.lead_name;
                return `${leadId} - ${leadName}`;
            }
        },        

        // {
        //     headerName: "Name",
        //     unSortIcon: true,
        //     cellRenderer: (params) => {
        //       const uuid = params.data.uuid;
        //       const leadId = params.data.lead_leadid || "";
        //       const leadName = params.data.lead_name || "";
        //       return (
        //         <div>
        //           <button
        //             className="text-blue underline"
        //             onClick={() =>
        //               navigate(`/user/crm/lead/detail-lead/${uuid}`, {
        //                 state: { leadId }, // Pass leadId in state
        //               })
        //             }
        //             title="View Lead Details"
        //           >
        //             {leadId} - {leadName}
        //           </button>
        //         </div>
        //       );
        //     },
        //   },
        {
            headerName: "Employee",
            field: "created_by",
            minWidth: 200,
            unSortIcon: true,
        },
        {
            headerName: "Date",
            minWidth: 200,
            unSortIcon: true,
            field: "date",
            valueGetter: (params) => {
                return formatDateForDisplay(params.data.date);
            },
        },
        {
            headerName: "Time",
            minWidth: 200,
            unSortIcon: true,
            field: "date",
            valueGetter: (params) => {
                return formatTimeForDisplay(params.data.date);
            }

        },
        {
            headerName: "Status",
            field: "status",
            minWidth: 200,
            sortable: false,
            cellRenderer: (params) => {
                const statusMapping = {
                    Pending: "darkOrange",
                    Completed: "darkgreen"
                };
                const status = statusMapping[params.value] || "success";
                return (
                    <div className="flex items-center">
                        <StatusManager status={status} message={params.value} />
                    </div>
                );
            },
        },
        {
            headerName: "Stages",
            field: "stages_name",
            minWidth: 200,
            sortable: false,
            cellRenderer: (params) => {
                const statusMapping = {
                    New: "success",
                    Enquiry: "warning",
                    Lost: "error",
                    FollowUp: "inprogress",
                    Quotation: "info",
                };
                const status = statusMapping[params.value] || "success";
                return (
                    <div className="flex items-center">
                        <StatusManager status={status} message={params.value} />
                    </div>
                );
            },
        },
        {
            headerName: "Action",
            field: "action",
            minWidth: 250,
            maxWidth: 250,
            sortable: false,
            cellRenderer: (params) => (
                <div className="">
                    <button>{icons.deleteIcon}</button>
                </div>
            ),
        },
    ];

    const handlePageChange = (page) => {
        setPaginationCurrentPage(page);
        getTaskList({ page });
    };
    const handlePageSizeChange = (pageSize) => {
        setPaginationPageSize(pageSize);
        setPaginationCurrentPage(1);
        getTaskList({ page: 1 });
    };
    const toastOnclose = () => {
        setToastData(() => ({ ...toastData, show: false }));
    };
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
            <div className=" rounded-lg p-2 my-2 bg-white darkCardBg">
                <Breadcrumps items={breadcrumbItems} />
            </div>

            {/* {taskList?.length > 0 ? ( */}
            <>
                <ReusableAgGrid
                    key={columnDefs.length}
                    rowData={taskList}
                    columnDefs={columnDefs}
                    defaultColDef={{ resizable: false }}
                    onGridReady={(params) => params.api.sizeColumnsToFit()}
                    pagination={false}
                    showCheckbox={false}

                />
                <Pagination
                    currentPage={paginationCurrentPage}
                    totalPages={taskData?.last_page || 1}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    startItem={taskData?.from || 0}
                    endItem={taskData?.to || 0}
                    totalItems={taskData?.total || 0}
                />
            </>
            {/* )} */}
        </>
    );
}
