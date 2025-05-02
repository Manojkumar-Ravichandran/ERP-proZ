import React, { useEffect, useState } from 'react'
import Pagination from '../../../UI/AgGridTable/Pagination/Pagination'
import ReusableAgGrid from '../../../UI/AgGridTable/AgGridTable'
import { getComplaintListEffect } from '../../../redux/CRM/lead/LeadEffects';
import { formatDateToYYYYMMDD } from '../../../utils/Date';
import AlertNotification from '../../../UI/AlertNotification/AlertNotification';
import icons from '../../../contents/Icons';
import IconButton from '../../../UI/Buttons/IconButton/IconButton';
import DateRangePickerComponent from '../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent';
import FilterDropdown from '../../../components/DropdownFilter/FilterDropdown';
import { useNavigate } from 'react-router';
import CompSolution from './CompSolution';
import ActionDropdown from '../../../UI/AgGridTable/ActionDropdown/ActionDropdown';
import { calculateColumnWidth } from '../../../utils/Table';
import StatusManager from '../../../UI/StatusManager/StatusManager';
import AddComplaint from './AddComplaint';

function Complaint({ lead_uuid }) {
    const [isModalOpenComplaint, setIsModalOpenComplaint] = useState(false);
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
    const [paginationPageSize, setPaginationPageSize] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [toastData, setToastData] = useState({ show: false });
    const [focusedInput, setFocusedInput] = useState(null);
    const [currentUuid, setCurrentUuid] = useState({ uuid: null, action: null }); // State to store the current row's UUID
    const navigate = useNavigate();
    const toastOnclose = () => {
        setToastData({ ...toastData, show: false });
    };
    const [filters, setFilters] = useState({
        status: "ALL",
        startDate: null,
        endDate: null,
    });
    const [loading, setLoading] = useState(false);
    const handlePageChange = (page) => {
        setPaginationCurrentPage(page);
        getComplaintList({ page });
    };
    const [complaintList, setComplaintList] = useState([])
    console.log(complaintList);
    useEffect(() => {
        getComplaintList();
    }, [paginationPageSize, paginationCurrentPage, filters, searchText]);

    const getComplaintList = async () => {
        setLoading(true);
        try {
            const response = await getComplaintListEffect({
                page: paginationCurrentPage,
                page_size: paginationPageSize,
                search: searchText,
                from_date: filters.startDate ? formatDateToYYYYMMDD(filters.startDate) : "",
                to_date: filters.endDate ? formatDateToYYYYMMDD(filters.endDate) : "",
                status: filters.status,
                lead_uuid: lead_uuid || null,
            });
            setComplaintList(response.data.data);
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        setIsModalOpenComplaint(false);
        getComplaintList();
        setCurrentUuid({ uuid: null, action: null });
    };
    const handlePageSizeChange = (pageSize) => {
        setPaginationPageSize(pageSize);
        setPaginationCurrentPage(1);
        getComplaintList({ page: 1 });
    };
    const columnDefs = [
        ...(lead_uuid === null
            ? [
                {
                    headerName: "Lead Name",
                    field: "lead_name",
                    unSortIcon: true,
                    minWidth: 150,
                    cellStyle: { textAlign: "center" },
                },
            ]
            : []),

        {
            headerName: "Complaint Type",
            field: "compcategory_name",
            minWidth: 150,
            unSortIcon: true,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Complaint Details",
            field: "comp_details",
            unSortIcon: true,
            minWidth: 150,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Complaint Against",
            field: "comp_against_name",
            unSortIcon: true,
            minWidth: 150,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Complaint Priority",
            unSortIcon: true,

            field: "comp_priority",
            minWidth: 150,
            cellStyle: { textAlign: "center" },
        },

        {
            headerName: "Status",
            field: "status",
            sortable: false,
            unSortIcon: true,

            // cellStyle: { display: "flex", justifyContent: "center" },
            minWidth: Math.max(calculateColumnWidth("status_name", complaintList?.data), 150), // Dynamic minWidth
            cellRenderer: (params) => {
                const statusMapping = {
                    1: "darkpurple",
                    0: "darkRed",
                    2: "lightgreen",
                    //   5: "darkBlue",
                    //   4: "warning",
                    //   3: "darkpink",
                };
                const status = statusMapping[params?.data?.status];
                return (
                    <div className="flex justify-center items-center w-100">
                        <div className="flex justify-center">
                            <StatusManager
                                status={status}
                                message={params?.data?.status_name}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            headerName: "Action",
            field: "action",
            pinned: "right",
            maxWidth: 200,
            unSortIcon: true,
            minWidth: 100,
            cellRenderer: (params) => {
                return (
                    <ActionDropdown
                        options={filteredActions}
                        onAction={(e) => handleAction(e, params, params.data)}
                    />
                );
            },
        },
    ];
    // if (lead_uuid !== null) {
    //     columnDefs.unshift({
    //         headerName: "Lead Name",
    //         field: "lead_name",
    //         minWidth: 150,
    //         cellStyle: { textAlign: "center" },
    //     });
    // }
    const filteredActions = [
        { action: "solution", label: "Solution", icon: icons.cancelIcon, iconClass: "text-green-200 cursor-pointer ", },
        { action: "close", label: "Close", icon: icons.tick, iconClass: "text-green-200 cursor-pointer", },
    ];
    const handleAction = (action, params) => {
        const { uuid } = params.data; // Get the UUID from the current row
        if (action === "solution" || action === "close") {
            setCurrentUuid({ uuid: uuid, action: action }); // Set the UUID for the modal
            setIsModalOpen(true); // Open the modal
        }
    };
    const StatusFilter = [
        { value: "ALL", label: "All" },
        { value: 1, label: "Open" },
        { value: "0", label: "Closed" },
        { value: 2, label: "Resolved" },
    ];

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        if (!e.target.value) setPaginationCurrentPage(1);
    };
    const handleStatusChange = (selectedOption) => {
        setFilters((prev) => ({ ...prev, status: selectedOption || "" }));
    };
    const handleDateChange = ({ startDate, endDate }) => {
        setFilters((prev) => ({ ...prev, startDate, endDate }));
    };
    const handleClearFilters = () => {
        setFilters({
            status: "ALL",
            startDate: null,
            endDate: null,
        });
        setSearchText("");
        setPaginationCurrentPage(1);
    }
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };




  

  

return (
    <>

        {toastData?.show && (
            <AlertNotification
                show={toastData?.show}
                message={toastData?.message}
                onClose={toastOnclose}
            />
        )}

        <div className="flex justify-between items-center my-3">
            <h1 className="text-xl font-bold">Complaint List</h1>
            <div flex gap-10>
                <FilterDropdown
                    options={StatusFilter}
                    placeholder="Status"
                    onFilter={handleStatusChange}
                    value={filters.status}
                />
                <button
                    className="chips text-white px-2 py-12 ml-5 rounded transition float-end gap-2 align-middle"
                    onClick={handleClearFilters}
                >
                    <span>{icons.clear}</span> Clear Filters
                </button>
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
                    <div>

                        <IconButton
                            label="Create"
                            icon={icons.plusIcon}
                            onClick={() => {
                                setIsModalOpenComplaint(true);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
        <ReusableAgGrid

            key={columnDefs.length}
            rowData={complaintList?.data || []}
            columnDefs={columnDefs}
            defaultColDef={{ resizable: false }}
            onGridReady={(params) => params.api.sizeColumnsToFit()}
            pagination={false}
            showCheckbox={false}
            from={(complaintList?.from - 1) || 0}
        />
        <Pagination
            currentPage={paginationCurrentPage}
            totalPages={complaintList?.last_page || 1}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            startItem={complaintList?.from || 0}
            endItem={complaintList?.to || 0}
            totalItems={complaintList?.total || 0}
        />
        <CompSolution
            actionType={currentUuid?.action}
            currentUuid={currentUuid?.uuid} // Pass the current UUID and action to the modal
            itemModal={isModalOpen} // Pass modal open state
            setItemModal={setIsModalOpen} // Pass function to control modal visibility
            onClose={handleModalClose} // Pass the callback to refresh the list
        />
        <AddComplaint
            itemModal={isModalOpenComplaint} // Pass modal open state
            setItemModal={setIsModalOpenComplaint} // Pass function to control modal visibility
            onClose={handleModalClose}
            lead_uuid={lead_uuid}
            setToastData={setToastData} // Pass the toast data setter function
        // Pass the callback to refresh the list
        />
    </>)
}

export default Complaint