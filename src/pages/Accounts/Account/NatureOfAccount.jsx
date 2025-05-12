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
import { getAccountMasterListEffect, getNatureOfAccountListEffect } from "../../../redux/Account/Accounts/AccountsEffects";
import { formatDateToYYYYMMDD } from "../../../utils/Date";
import { useDispatch } from "react-redux";
import DropdownButton from "../../../UI/Buttons/DropdownBtn/DropdownBtn";
import FilterDropdown from "../../../components/DropdownFilter/FilterDropdown";
const NatureOfAccount = () => {
    const {
        reset,
    } = useForm();

    const [activeFilter, setActiveFilter] = useState("");
    const [paginationPageSize, setPaginationPageSize] = useState(10);
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
    const [selectedSection, setSelectedSection] = useState();
    const [isDepOpen, setIsDepOpen] = useState(true);
    const [isTDSOpen, setIsTDSOpen] = useState(true);
    const [closedType, setClosedType] = useState("");
    const [searchText, setSearchText] = useState("");
    const [isApproveModal, setIsApproveModal] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("assets");
    const [accountList, setAccountList] = useState({ data: [] });
    const [section, setSection] = useState("");
    const [filters, setFilters] = useState({status: ""});
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toastOnclose = () => {
        setToastData(() => ({ ...toastData, show: false }));
    };
    const handleSectionChange = (selectedOption) => {
        setFilters((prev) => ({ ...prev, status: selectedOption || "" }));
    };
    const breadcrumbItems = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Nature Of Account" },
    ];

    const handleEdit = (data) => {
        setIsUpdate(true);
        setSelectedData(data);
        setIsApproveModal(true);
    };

    const sectionFilter = [
        { value: "assets", label: "Assets" },
        { value: "liability", label: " Liability" },
        { value: "expenses", label: "Expenses" },
        { value: "income", label: "Income" },
    ];
    
    // useEffect(() => {
    //     fetchAccountList (searchText);
    // }, [searchText,activeTab,paginationPageSize, paginationCurrentPage,selectedSection]);
    
    const fetchAccountList  = async() => {
        setLoading(true);
        try {
            const payload = {
                section: selectedSection  || "",
                majorhead: "",
                subhead: "",
                depreciation:"",
                tds:"",
                search: searchText.trim(),
            };
            const response = await getAccountMasterListEffect(payload);
            console.log("getAccountMasterListEffect",response);

            const data = response?.data?.data?.data || [];
            console.log("datya",data);

            // const filteredData = data.filter(item => item.section === section);
            // console.log("datya",filteredData);
            // const filteredData = data.filter(item => {
            // const matchesSection = section ? item.section === section : true;
            // const matchesSearch = search
            //     ? item.name.toLowerCase().includes(search.toLowerCase())
            //     : true;
            // return matchesSection && matchesSearch;
            // });

            const formattedData = data.map(item => ({
                uuid: item.uuid,
                name: item.name,
                section: item.section,
            }));
            console.log("formattedData",formattedData);
            
            setAccountList({ data: formattedData });
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAccountList();
    }, [selectedSection, searchText, paginationPageSize, paginationCurrentPage]);

    // const handleClearFilters = () => {
    //     setActiveFilter("Open");
    //     setSearchText('')
    //     setSelectedSection(null);
    //     setActiveTab("asstes");
    //     fetchAccountList();
    // };
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setPaginationCurrentPage(1); 
    };
    const handleClearFilters = () => {
        setSearchText('');
        setSelectedSection('');
        fetchAccountList(); 
    };
    const columnDefs = [
        { headerName: "Nature Of The Account", field: "name", unSortIcon: true },
        { headerName: "Section", field: "section", unSortIcon: true },
        { headerName: "Major Head", field: "majorhead_name", unSortIcon: true },
        { headerName: "Sub Head", field: "subhead_name", unSortIcon: true },
        { headerName: "Depreciation", field: "depreciation", unSortIcon: true },
        { headerName: "TDS", field: "tds", unSortIcon: true },
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
                        data-tooltip-id="edit-notes"
                        // onClick={() => handleSubEdit(params?.data)}
                    >
                        {React.cloneElement(icons.deleteIcon, { size: 18,color: "#eb8934" })}
                    </span>
                </div>
            ),
        },
    ];
    const handleDepreciationToggle = () => {
    const tds = !isDepOpen;
    setIsDepOpen(tds);
    const newFilter = tds ? "Open" : "Closed";
    setActiveFilter(newFilter);
    // getLeadList(newFilter, stage, clickedClosedType);
  };
    const handleTDSToggle = () => {
    const tds = !isTDSOpen;
    setIsTDSOpen(tds);
    const newFilter = tds ? "Open" : "Closed";
    setActiveFilter(newFilter);
    // getLeadList(newFilter, stage, clickedClosedType);
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
                                            className={`toggle-switch ${isDepOpen ? "bg-blue-500" : "bg-gray-0"
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
                                            className={`toggle-button ${isDepOpen ? "translate-x-8" : "translate-x-0"
                                                }`}
                                            ></div>
                                        </div>
                                        </div>
                                    <div className="toggle-container">
                                        <div
                                            onClick={handleTDSToggle}
                                            className={`toggle-switch ${isTDSOpen ? "bg-blue-500" : "bg-gray-0"
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
                                                    section:section,
                                                });
                                            }}
                                        />
                                    </div>
                                    {/* <div>
                                        <ExportButton label="Export" data={leadList} filename="Nature Account List" />
                                    </div> */}
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
                </div>
    );
};

export default NatureOfAccount;