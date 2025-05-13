import { Loader } from "rsuite";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import icons from "../../../contents/Icons";
import CreateNatureOfAccount from "./CreateNatureOfAccount";
import { getAccountMasterDeleteEffect, getAccountMasterListEffect } from "../../../redux/Account/Accounts/AccountsEffects";
import { useDispatch } from "react-redux";
import FilterDropdown from "../../../components/DropdownFilter/FilterDropdown";
import "../Account/Natureaccount.css"
const NatureOfAccount = () => {
    const {
        reset,
    } = useForm();

    const [activeFilter, setActiveFilter] = useState("");
    const [paginationPageSize, setPaginationPageSize] = useState(10);
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
    const [selectedSection, setSelectedSection] = useState("assets");
    const [isDepOpen, setIsDepOpen] = useState(false);
    const [isTDSOpen, setIsTDSOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isApproveModal, setIsApproveModal] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [loading, setLoading] = useState(false);
    const [accountList, setAccountList] = useState({ data: [] });
    const [filters, setFilters] = useState({status: ""});
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toastOnclose = () => {
        setToastData(() => ({ ...toastData, show: false }));
    };
    const handleSectionChange = (selectedOption) => {
        setSelectedSection(selectedOption);
        setFilters((prev) => ({ ...prev, section: selectedOption || "" }));
    };
    const breadcrumbItems = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Nature Of Account" },
    ];

    const handleEdit = (data) => {
        setIsUpdate(true);
        setSelectedData({
            uuid: data.uuid,
            natureaccount: data.natureaccount,
            section: data.section,
            majorhead_name: data.majorhead_name,
            majorhead: data.majorhead,
            subhead_name: data.subhead_name,
            subhead:data.subhead,
            depreciation: data.depreciation === "yes",
            tds: data.tds === "yes",
            details: data.details || "",
        });
        setIsApproveModal(true);
    };

    const sectionFilter = [
        { value: "assets", label: "Assets" },
        { value: "liability", label: " Liability" },
        { value: "expenses", label: "Expenses" },
        { value: "income", label: "Income" },
    ];
    
    const fetchAccountList  = async() => {
        setLoading(true);
        try {
            const payload = {
                section: selectedSection,
                majorhead: "",
                subhead: "",
                depreciation:isDepOpen ? "yes" : "no",
                tds:isTDSOpen ? "yes" : "no",
                search: searchText,
            };
            const response = await getAccountMasterListEffect(payload);

            const data = response?.data?.data?.data || [];

            const formattedData = data.map(item => ({
                uuid: item.uuid,
                name: item.name,
                section: item.section,
                natureaccount: item.natureaccount,
                majorhead_name: item.majorhead_name,
                majorhead: item.majorhead,
                subhead_name: item.subhead_name,
                subhead: item.subhead,
                depreciation: item.depreciation,
                tds: item.tds,
                details: item.details || "",
            }));
            
            setAccountList({ data: formattedData });
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAccountList(searchText);
    }, [selectedSection, searchText, paginationPageSize, paginationCurrentPage,, isDepOpen, isTDSOpen]);

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setPaginationCurrentPage(1); 
    };
    const handleClearFilters = () => {
        setSearchText('');
        setSelectedSection("assets");
        setIsDepOpen(false);
        setIsTDSOpen(false);
        setFilters({ section: "assets" });
        fetchAccountList(); 
    };
    const columnDefs = [
        { headerName: "Nature Of The Account", field: "natureaccount", unSortIcon: true },
        { headerName: "Section", field: "section", unSortIcon: true },
        { headerName: "Major Head", field: "majorhead_name", unSortIcon: true },
        { headerName: "Sub Head", field: "subhead_name", unSortIcon: true },
        { headerName: "Depreciation", field: "depreciation", unSortIcon: true },
        { headerName: "TDS", field: "tds", unSortIcon: true },
        { headerName: "Details", field: "details", unSortIcon: true },
        {
            headerName: "Action",
            field: "action",
            sortable: false,
            pinned: "right",
            maxWidth: 100,
            minWidth: 100,
            cellRenderer: (params) => (
                <div className="flex gap-1 items-center justify-center">
                    <span
                        className="top-clr rounded-full border p-2 cursor-pointer"
                        data-tooltip-id="edit-notes"
                        onClick={() => handleEdit(params?.data)}
                    >
                        {React.cloneElement(icons.editIcon, { size: 18 })}
                    </span>
                    <span
                        className="top-clr rounded-full border p-2 cursor-pointer"
                        data-tooltip-id="delete"
                        onClick={() => openDeleteModal(params?.data)}
                    >
                        {React.cloneElement(icons.deleteIcon, { size: 18,color: "#eb8934" })}
                    </span>
                </div>
            ),
        },
    ];
    const openDeleteModal = (data) => {
        setSelectedData(data);
        setIsDeleteModalOpen(true);
    };
    const handleDelete = async (data) => {
    
            setLoading(true);
            try {
                const payload = { uuid: selectedData.uuid };
                let response;
                    response = await getAccountMasterDeleteEffect(payload);
               
    
                if (response?.status === 200) {
                    setToastData({
                        type: "success",
                        message: " Nature Of AccountDeleted successfully",
                    })
                }
                setIsDeleteModalOpen(false);
                 fetchAccountList();
            } catch (error) {
                console.error("Failed to delete:", error);
                setToastData({
                    type: "error",
                    message: error?.response?.data?.message || error.message || "An error occurred",
                });
            } finally {
                setLoading(false);
                reset();
            }
    }
    const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedData(null);
  };

const handleDepreciationToggle = () => {
    setIsDepOpen((prev) => !prev);
};

const handleTDSToggle = () => {
    setIsTDSOpen((prev) => !prev);
};

    const handleModalClose = () => {
        setIsApproveModal(false);
        reset();
        setIsUpdate(false);
        setSelectedData(null);
        fetchAccountList ( searchText);
    };
    return (
        <div >
            {toastData?.show && (
                <AlertNotification
                    show={toastData.show}
                    message={toastData.message}
                    type={toastData.type}
                    onClose={toastOnclose}
                />
            )}
                    
                    <div className="rounded-lg p-2 my-2 bg-white darkCardBg">
                        <Breadcrumps items={breadcrumbItems} />
                    </div>
                    <div className="w-full flex flex-col h-full min-h-0">
                        <div className="flex items-center justify-end p2 mb-2 gap-2">
                            <FilterDropdown
                                options={sectionFilter}
                                placeholder="Section"
                                showClearButton={true}
                                onFilter={handleSectionChange}
                                value={selectedSection}
                            />
                            <button
                                className="chips text-white px-1 py-1 rounded transition float-end gap-2"
                                onClick={handleClearFilters}>
                                <span>{icons.clear}</span> Clear Filters
                            </button>
                        </div>
                        <div className="bg-white pr-2 rounded-lg darkCardBg ">
                            <div className="bg-white rounded-lg flex items-center justify-between">
                                <div className="flex items-center p-3">
                                    <div className="relative w-full max-w-md">
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchText}
                                            onChange={handleSearchChange}
                                            className="w-full px-4 py-2 pr-10 pl-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                                            {icons.searchIcon}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center  justify-between gap-2">
                                    <div className="toggle-container">
                                        <div
                                            onClick={handleDepreciationToggle}
                                            className={`toggle-switch-1 ${isDepOpen ? "bg-blue-500" : "bg-gray-0"
                                            }`}
                                        >
                                            <span
                                            className={`toggle-label ${isDepOpen ? "opacity-100" : "opacity-0"}`}
                                            >
                                            Depreciation
                                            </span>
                                            <span
                                            className={`toggle-label ${isDepOpen ? "opacity-0" : "opacity-100"}`}
                                            >
                                            Depreciation
                                            </span>
                                            <div
                                            className={`toggle-button ${isDepOpen ? "translate-x-9" : "translate-x-0"
                                                }`}
                                            ></div>
                                        </div>
                                        </div>
                                    <div className="toggle-container">
                                        <div
                                            onClick={handleTDSToggle}
                                            className={`toggle-switch  w-200 ${isTDSOpen ? "bg-blue-500" : "bg-gray-0"
                                            }`}
                                        >
                                            <span
                                            className={`toggle-label ${isTDSOpen ? "opacity-100" : "opacity-0"}`}
                                            >
                                            TDS
                                            </span>
                                            <span
                                            className={`toggle-label ${isTDSOpen ? "opacity-0" : "opacity-100"}`}
                                            >
                                            TDS
                                            </span>
                                            <div
                                            className={`toggle-button ${isTDSOpen ? "translate-x-8" : "translate-x-0"
                                                }`}
                                            ></div>
                                        </div>
                                        </div>
                                    <div className="me-3">
                                        <IconButton
                                            label="Add"
                                            icon={icons.plusIcon}
                                            onClick={() => {
                                                setIsApproveModal(true);
                                                setIsUpdate(false);
                                                setSelectedData({
                                                    section:selectedSection,
                                                    deprecitation:isDepOpen,
                                                    tds:isTDSOpen,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0">
                            {accountList.data.length > 0 ? (
                                <ReusableAgGrid
                                    key={columnDefs.length}
                                    rowData={accountList.data}
                                    columnDefs={columnDefs}
                                    defaultColDef={{ resizable: false }}
                                    onGridReady={(params) => params.api.sizeColumnsToFit()}
                                    pagination={false}
                                    showCheckbox={false}
                                />
                            ) : !loading ? (
                                <div className="flex justify-center items-center h-40 text-gray-500 text-lg font-semibold">
                                    No Data Found
                                </div>
                            ) : (
                                <Loader />
                            )}
                        </div>
        
                        <CreateNatureOfAccount
                            isCreateModal={isApproveModal}
                            setIsCreateModal={setIsApproveModal}
                            onClose={handleModalClose}
                            setToastData={setToastData}
                            IsUpdate={isUpdate}
                            data={selectedData}
                        />
                    </div>
                    {/* delete */}
      {isDeleteModalOpen && (
        <div className="delete-modal">
          <div className="modal-content-del darkCardBg">
            <div className="flex items-center justify-between">
              <h4>Confirm Delete</h4>
              <button className="modal-close" onClick={cancelDelete}>
                {" "}
                &times;
              </button>
            </div>
            <hr />
            <p className="pt-4">Are you sure you want to delete this item?</p>
            <div className="modal-actions">
              <button
                onClick={handleDelete}
                className="btn btn-danger"
                loading={loading}
              >
                Yes, Delete
              </button>
              <button onClick={cancelDelete} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
                </div>
    );
};

export default NatureOfAccount;