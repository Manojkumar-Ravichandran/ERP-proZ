import { Loader } from "rsuite";
import CreateAccountsMaster from "./CreateAccountsMaster";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import icons from "../../../contents/Icons";
import { useForm } from "react-hook-form";
import { getAccountMasterListEffect, getMajorHeadListEffect, getSubHeadListEffect } from "../../../redux/Account/Accounts/AccountsEffects";
import React, { useEffect, useState } from "react";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import CreateHeadsData from "../Account/CreateHeadData";
import CreateMajorandSubHead from "./CreateMajorandSubHead";

const AccountMaster = () => {
    const {reset} = useForm();
    const [masterList, setMasterList] = useState({ data: [] });
    const [searchText, setSearchText] = useState("");
    const [isApproveModal, setIsApproveModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [activeTab, setActiveTab] = useState("liability");
    const [activeCard, setActiveCard] = useState(null);
    const [activeType, setActiveType] = useState(null);
    const [selectedSection, setSelectedSection] = useState();
    const [majorHeadList, setMajorHeadList] = useState([]);
    const [subHeadList, setSubHeadList] = useState([]);

    const toastOnclose = () => {
        setToastData(() => ({ ...toastData, show: false }));
    };
    const breadcrumbItems = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Account Master" },
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
            // { headerName: "Nature Of Account", field: "natureaccount_name", unSortIcon: true },
            // { headerName: "Major Head", field: "majorhead_name", unSortIcon: true },
            { headerName: "Sub Head", field: "subhead_name", unSortIcon: true },
            { headerName: "Depreciation", field: "depreciation", unSortIcon: true },
            { headerName: "TDS", field: "tds", unSortIcon: true, },
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
                    </div>
                ),
            },
        ];
    useEffect(() => {
        // fetchMasterList();
        fetchMajorHeadList(activeTab);
        fetchSubHeadList();
        }, [searchText,activeTab,selectedSection]);
    // const fetchMasterList  = async(searchText, section) => {
    //     setLoading(true);
    //     try {
    //         const searchQuery = searchText.trim();
    //         const payload = {
    //         section: section,
    //         natureaccount_name: searchQuery,
    //         majorhead_name: searchQuery,
    //         subhead_name: searchQuery,
    //     };
    //         const response = await getAccountMasterListEffect(payload);
            
    //         setMasterList({ data: response?.data?.data?.data || [] });
    //     } catch (error) {
    //         console.error("Failed to fetch data:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const fetchSubHeadList = async (majorhead) => {
            setLoading(true);
            try {
                const response = await getSubHeadListEffect();
                console.log("getSubHeadListEffect",response);

                const data = response?.data?.data?.data || [];

                const filteredData = data.filter(item => item.majorhead === majorhead);

                const formattedData = filteredData.map(item => ({
                    id: item.id,
                    name: item.name,
                    majorhead: item.majorhead,
                }));
                setSubHeadList(formattedData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
    const fetchMajorHeadList = async (section) => {
        setLoading(true);
        try {
            const response = await getMajorHeadListEffect();
            console.log("getMajorHeadListEffect",response);
            
            const data = response?.data?.data?.data || [];

            const filteredData = data.filter(item => item.section === section);

            const formattedData = filteredData.map(item => ({
                id: item.id,
                name: item.name,
                section: item.section,
            }));

            setMajorHeadList({ data: formattedData });
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleClearFilters = () => {
        setSearchText('')
        setSelectedSection(null);
        setActiveTab("liability");
    };
    const handleCardClick = (card) => {
        setActiveCard(card.id);
        setActiveType(card.type);

    };
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };
    const handleModalClose = () => {
        setIsApproveModal(false);
        reset();
        setIsUpdate(false);
        setSelectedData(null);
        // fetchMasterList();
    };
    return(
        <>
        <div className="flex flex-col h-full overflow-hidden">
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
            <div className="p-2 bg-white darkCardBg mb-2">
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
            </div>
            {/* Major Head */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-[1fr,2fr] gap-3 min-h-0">
            <div className=" w-full bg-white rounded-lg shadow-md border border-gray-300 flex flex-col h-full min-h-0">
                        <div className="p-3 border-b border-gray-300 bg-white rounded-t-lg darkCardBg flex justify-between items-center">
                            <h3 className="px-2 text-xl font-semibold">Major Head List</h3>
                            <IconButton
                                label="Add"
                                icon={icons.plusIcon}
                                onClick={() => {
                                    setIsApproveModal(true);
                                    setIsUpdate(false);
                                    setSelectedData({ headType: "major" });
                                }}
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0">
                            {majorHeadList?.data?.map((card) => (
                                <div
                                    key={card.id}
                                    onClick={() => handleCardClick(card)}
                                    className={`rounded-lg p-2 my-1 bg-white darkCardBg shadow-lg flex justify-between items-center cursor-pointer 
                                ${activeCard === card.id ? "border-b-[7px]" : "border-b border-gray-300"}`}
                                    style={{
                                        borderColor: activeCard === card.id ? "var(--primary-color)" : undefined,
                                    }}
                                >
                                    <span>{card.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Sub Head */}
                <div className="w-full  flex flex-col h-full min-h-0">
                    <div className="bg-white pr-2 rounded-lg darkCardBg ">
                        <div className="bg-white rounded-lg  flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex items-center justify-center p-3">
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
                            {/* <button
                                className="chips text-white px-1 py-1 rounded transition float-end gap-2"
                                onClick={handleClearFilters}
                            >
                                <span>{icons.clear}</span> Clear Filters
                            </button> */}
                            <div className="flex items-center">
                                <div className="me-3">
                                    <IconButton
                                        label="Add"
                                        icon={icons.plusIcon}
                                        onClick={() => {
                                            setIsApproveModal(true);
                                            setIsUpdate(false); 
                                            setSelectedData({ headType: "sub" });
                                        }
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0">
                        {subHeadList?.data?.length > 0 ? (
                            <>
                                <ReusableAgGrid
                                    key={columnDefs.length}
                                    rowData={subHeadList?.data}
                                    columnDefs={columnDefs}
                                    defaultColDef={{ resizable: false }}
                                    onGridReady={(params) => params.api.sizeColumnsToFit()}
                                    pagination={false}
                                    showCheckbox={false}
                                />
                            </>
                        ) : !loading ? (
                            <div className="flex justify-center items-center h-40 text-gray-500 text-lg font-semibold">
                                No Data Found
                            </div>
                        ) : (
                            <Loader />
                        )}
                    </div>
                    {/* <CreateAccountsMaster
                        isCreateModal={isApproveModal}
                        setIsCreateModal={setIsApproveModal}
                        onClose={handleModalClose}
                        setToastData={setToastData}
                        IsUpdate={isUpdate}
                        data={selectedData}
                    /> */}
                    {/* <CreateHeadsData
                        isCreateModal={isApproveModal}
                        setIsCreateModal={setIsApproveModal}
                        onClose={handleModalClose}
                        setToastData={setToastData}
                        IsUpdate={isUpdate}
                        data={selectedData}
                    /> */}
                    <CreateMajorandSubHead
                        isCreateModal={isApproveModal}
                        setIsCreateModal={setIsApproveModal}
                        onClose={handleModalClose}
                        setToastData={setToastData}
                        IsUpdate={isUpdate}
                        data={selectedData}
                    />
                </div>
            </div>  
        </div>

        </>
    )
}
export default AccountMaster;