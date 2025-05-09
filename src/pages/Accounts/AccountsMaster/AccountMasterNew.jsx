// import { Loader } from "rsuite";
// import CreateAccountsMaster from "./CreateAccountsMaster";
// import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
// import IconButton from "../../../UI/Buttons/IconButton/IconButton";
// import icons from "../../../contents/Icons";
// import { useForm } from "react-hook-form";
// import { getAccountMasterListEffect } from "../../../redux/Account/Accounts/AccountsEffects";
// import React, { useEffect, useState } from "react";
// import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
// import AlertNotification from "../../../UI/AlertNotification/AlertNotification";

// const AccountMaster = ({activeCard}) => {
//     const {reset} = useForm();
//     const [masterList, setMasterList] = useState({ data: [] });
//     const [searchText, setSearchText] = useState("");
//     const [isApproveModal, setIsApproveModal] = useState(false);
//     const [isUpdate, setIsUpdate] = useState(false);
//     const [selectedData, setSelectedData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [toastData, setToastData] = useState({ show: false });
//     const [activeTab, setActiveTab] = useState("Assets");
//     const [selectedSection, setSelectedSection] = useState();

//     const toastOnclose = () => {
//         setToastData(() => ({ ...toastData, show: false }));
//     };
//     const breadcrumbItems = [
//         { id: 1, label: "Home", link: "/user" },
//         { id: 2, label: "Account Master" },
//     ];
//     const handleEdit = (data) => {
//         setIsUpdate(true);
//         setSelectedData(data);
//         setIsApproveModal(true);
//     };
//     const tabs = [
//         { id: "all", label: "All" },
//         { id: "assets", label: "Assets" },
//         { id: "liability", label: " Liability" },
//         { id: "expenses", label: "Expenses" },
//         { id: "income", label: "Income" },
//     ];
//     const columnDefs = [
//             { headerName: "Nature Of Account", field: "natureaccount_name", unSortIcon: true },
//             { headerName: "Major Head", field: "majorhead_name", unSortIcon: true },
//             { headerName: "Sub Head", field: "subhead_name", unSortIcon: true },
//             { headerName: "Depreciation", field: "depreciation", unSortIcon: true },
//             { headerName: "TDS", field: "tds", unSortIcon: true, },
//             { headerName: "Details", field: "details", unSortIcon: true },
//             {
//                 headerName: "Action",
//                 field: "action",
//                 sortable: false,
//                 pinned: "right",
//                 maxWidth: 100,
//                 minWidth: 100,
//                 cellRenderer: (params) => (
//                     <div className="flex gap-1 items-center justify-center">
//                         <span
//                             className="top-clr rounded-full border p-2 cursor-pointer"
//                             data-tooltip-id="edit-notes"
//                             onClick={() => handleEdit(params?.data)}
//                         >
//                             {React.cloneElement(icons.editIcon, { size: 18 })}
//                         </span>
//                     </div>
//                 ),
//             },
//         ];
//     useEffect(() => {
//         // fetchMasterList();
//         fetchMasterList(searchText,activeTab);
//         }, [searchText,activeCard,activeTab,selectedSection]);
//     const fetchMasterList  = async(searchText, section = "assets") => {
//         setLoading(true);
//         try {
//             // const payload = {
//             //     section: section === "all" ? "":section,
//             //     natureaccount_name: "",
//             //     majorhead_name: "",
//             //     subhead_name: "",
//             //     search: searchText.trim(),
//             // };
//             const searchQuery = searchText.trim();
//         const payload = {
//             section: section === "all" ? "" : section,
//             natureaccount_name: searchQuery,
//             majorhead_name: searchQuery,
//             subhead_name: searchQuery,
//         };
//             const response = await getAccountMasterListEffect(payload);
//             console.log("getAccountMasterListEffect",response);
            
//             setMasterList({ data: response?.data?.data?.data || [] });
//         } catch (error) {
//             console.error("Failed to fetch data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//     const handleClearFilters = () => {
//         setSearchText('')
//         setSelectedSection(null);
//         setActiveTab("all");
//     };
//     const handleSearchChange = (e) => {
//         setSearchText(e.target.value);
//     };
//     const handleModalClose = () => {
//         setIsApproveModal(false);
//         reset();
//         setIsUpdate(false);
//         setSelectedData(null);
//         fetchMasterList();
//     };
//     return(
//         <>
//         {toastData?.show && (
//             <AlertNotification
//             show={toastData.show}
//             message={toastData.message}
//             type={toastData.type}
//             onClose={toastOnclose}
//         />
//         )}
//         <div className="rounded-lg p-2 my-2 bg-white darkCardBg">
//             <Breadcrumps items={breadcrumbItems} />
//         </div>
//         <div className="p-2 bg-white darkCardBg mb-2">
//             <div className="flex">
//                 {tabs.map((tab) => (
//                     <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`px-6 py-2 -mb-px ${activeTab === tab.id ? "tab-active" : ""}`}
//                     >
//                     {tab.label}
//                     </button>
//                 ))}
//             </div>
//         </div>
//         <div className="w-full  flex flex-col h-full min-h-0">
//             <div className="bg-white pr-2 rounded-lg darkCardBg ">
//                 <div className="bg-white rounded-lg  flex items-center justify-between">
//                     <div className="flex items-center">
//                         <div className="flex items-center justify-center p-3">
//                             <div className="relative w-full max-w-md">
//                                 <input
//                                     type="text"
//                                     placeholder="Search..."
//                                     value={searchText}
//                                     onChange={handleSearchChange}
//                                     className="w-full px-4 py-2 pr-10 pl-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                                 <div
//                                     className="absolute inset-y-0 right-0 flex items-center pr-3  cursor-pointer"
//                                 >
//                                     {icons.searchIcon}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <button
//                         className="chips text-white px-1 py-1 rounded transition float-end gap-2"
//                         onClick={handleClearFilters}
//                     >
//                         <span>{icons.clear}</span> Clear Filters
//                     </button>
//                     <div className="flex items-center">
//                         <div className="me-3">
//                             <IconButton
//                                 label="Add"
//                                 icon={icons.plusIcon}
//                                 onClick={() => {
//                                     setIsApproveModal(true);
//                                     setIsUpdate(false); // Set to create mode
//                                     setSelectedData(null); // Clear selected data
//                                 }
//                                 }
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0">
//                 {masterList?.data?.length > 0 ? (
//                     <>
//                         <ReusableAgGrid
//                             key={columnDefs.length}
//                             rowData={masterList?.data}
//                             columnDefs={columnDefs}
//                             defaultColDef={{ resizable: false }}
//                             onGridReady={(params) => params.api.sizeColumnsToFit()}
//                             pagination={false}
//                             showCheckbox={false}
//                         />
//                     </>
//                 ) : !loading ? (
//                     <div className="flex justify-center items-center h-40 text-gray-500 text-lg font-semibold">
//                         No Data Found
//                     </div>
//                 ) : (
//                     <Loader />
//                 )}
//             </div>
//             <CreateAccountsMaster
//                 isCreateModal={isApproveModal}
//                 setIsCreateModal={setIsApproveModal}
//                 onClose={handleModalClose}
//                 setToastData={setToastData}
//                 IsUpdate={isUpdate}
//                 data={selectedData}
//             />
//         </div>
//         </>
//     )
// }
// export default AccountMaster;