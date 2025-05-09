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
import { getNatureOfAccountListEffect } from "../../../redux/Account/Accounts/AccountsEffects";
import { formatDateToYYYYMMDD } from "../../../utils/Date";
import { useDispatch } from "react-redux";
const NatureOfAccount = () => {
    const {
        reset,
    } = useForm();

    const [activeFilter, setActiveFilter] = useState("Section");
    const [paginationPageSize, setPaginationPageSize] = useState(10);
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
    const [stageList, setStageList] = useState([]);
    const [selectedSection, setSelectedSection] = useState();
    const [closedType, setClosedType] = useState("");
    const [searchText, setSearchText] = useState("");
    const [isApproveModal, setIsApproveModal] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("assets");
    const [accountList, setAccountList] = useState({ data: [] });
    const [sectionDatas, setSectionDatas] = useState();
    const [leadList, setSectionList] = useState([]);
    const [section, setSection] = useState("");
    const [dates, setDates] = useState({
        startDate: null,
        endDate: null,
      });
    
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toastOnclose = () => {
        setToastData(() => ({ ...toastData, show: false }));
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

    const tabs = [
        { id: "assets", label: "Assets" },
        { id: "liability", label: " Liability" },
        { id: "expenses", label: "Expenses" },
        { id: "income", label: "Income" },
    ];
    const columnDefs = [
        { headerName: "Section", field: "section", unSortIcon: true },
        { headerName: "Nature Of Account", field: "name", unSortIcon: true },
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
                </div>
            ),
        },
    ];
    useEffect(() => {
        fetchAccountList (activeTab);
        // getSectionList();
    }, [searchText,activeTab,paginationPageSize, paginationCurrentPage,selectedSection]);

    // const getSectionList = async () => {
    //     let { data } = await getNatureOfAccountListEffect();
        
    //     const formattedData = data.data.data.map((list) => ({
    //       label: list.section,
    //       value: list.section,
    //     }));

    //     setStageList(formattedData);
    //   };

    // const fetchAccountList  = async() => {
    //     setLoading(true);
    //     try {
    //         const payload = {
    //             section: selectedSection || "",
    //             search: searchText.trim(),
    //         };
    //         const response = await getNatureOfAccountListEffect(payload);
    //         setAccountList({ data: response?.data?.data?.data || [] });
    //     } catch (error) {
    //         console.error("Failed to fetch data:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const fetchAccountList  = async(section) => {
        setLoading(true);
        try {
            // const payload = {
            //     section: selectedSection || "",
            //     search: searchText.trim(),
            // };
            const response = await getNatureOfAccountListEffect();
            console.log("getNatureOfAccountListEffect",response);

            const data = response?.data?.data?.data || [];
            console.log("datya",data);

            const filteredData = data.filter(item => item.section === section);
            console.log("datya",filteredData);

            const formattedData = filteredData.map(item => ({
                id: item.id,
                name: item.name,
                section: item.section,
            }));
            setAccountList({ data: formattedData });
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleStageChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedSection(selectedValue);
        setPaginationCurrentPage(1); // Reset to first page on section change
    }
    const handleClearFilters = () => {
        setSearchText('')
        setSelectedSection(null);
        // setActiveTab("asstes");
    };
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setPaginationCurrentPage(1); // Reset to first page on search
    };

    const handleModalClose = () => {
        setIsApproveModal(false);
        reset();
        setIsUpdate(false);
        setSelectedData(null);
        fetchAccountList ();
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
                        <div className="bg-white pr-2 rounded-lg darkCardBg">
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
                                {/* <div className="">
                                    <select className="chips" onChange={handleStageChange}>
                                    {stageList.map((list) => (
                                        <option
                                        className="darkCardBg"
                                        key={list.value}
                                        value={list.value}
                                        >
                                        {list.label}
                                        </option>
                                    ))}
                                    </select>
                                </div> */}
                                <div className="flex">
                                    {tabs.map((tab) => (
                                        <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-6 py-2 -mb-px ${activeTab === tab.id ? "tab-active" : ""}`}
                                        >
                                        {tab.label}
                                        </button>
                                    ))}
                                </div>
                                {/* <button
                                    className="chips text-white px-1 py-1 rounded transition float-end gap-2"
                                    onClick={handleClearFilters}
                                >
                                    <span>{icons.clear}</span> Clear Filters
                                </button> */}
                                <div className="me-3">
                                    <IconButton
                                        label="Add"
                                        icon={icons.plusIcon}
                                        onClick={() => {
                                            setIsApproveModal(true);
                                            setIsUpdate(false);
                                            setSelectedData(null);
                                        }}
                                    />
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