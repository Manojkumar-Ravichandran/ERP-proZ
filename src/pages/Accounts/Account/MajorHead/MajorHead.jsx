// import React, { useEffect, useState } from 'react';
// import IconButton from '../../../../UI/Buttons/IconButton/IconButton';
// import icons from '../../../../contents/Icons';
// import { useNavigate } from 'react-router';
// import Loader from '../../../../components/Loader/Loader';
// import ReusableAgGrid from '../../../../UI/AgGridTable/AgGridTable';
// import { useForm } from 'react-hook-form';
// import StaticAccountsData from '../../AccountsMaster/StaticAccountsData';
// import AlertNotification from '../../../../UI/AlertNotification/AlertNotification';
// import Breadcrumps from '../../../../UI/Breadcrumps/Breadcrumps';
// import CreateMajorHead from '../../Account/MajorHead/CreateMajorHead'

// const MajorHead = () => {
//     const {
//         register,
//         control, reset,
//         setValue,
//         handleSubmit, getValues,
//         formState: { errors },
//     } = useForm();

//     const [searchText, setSearchText] = useState("");
//     const [isApproveModal, setIsApproveModal] = useState(false);
//     const [toastData, setToastData] = useState({ show: false });
//     const [loading, setLoading] = useState(false);
//     const [taskSubCategoryList, setTaskSubCategoryList] = useState({ data: [] });
//     const [isUpdate, setIsUpdate] = useState(false);
//     const [selectedData, setSelectedData] = useState(null);

//     const navigate = useNavigate();

//     const toastOnclose = () => {
//         setToastData(() => ({ ...toastData, show: false }));
//     };
//     const breadcrumbItems = [
//         { id: 1, label: "Home", link: "/user" },
//         { id: 2, label: "Major Head" },
//     ];

//     const handleEdit = (data) => {
//         setIsUpdate(true);
//         setSelectedData(data);
//         setIsApproveModal(true);
//     };

//     const columnDefs = [
//         { headerName: "Major Head", field: "majorHead", unSortIcon: true },
//         {
//             headerName: "Action",
//             field: "action",
//             sortable: false,
//             pinned: "right",
//             maxWidth: 100,
//             minWidth: 100,
//             cellRenderer: (params) => (
//                 <div className="flex gap-1 items-center justify-center">
//                     <span
//                         className="top-clr rounded-full border p-2 cursor-pointer"
//                         data-tooltip-id="edit-notes"
//                         onClick={() => handleEdit(params?.data)}
//                     >
//                         {React.cloneElement(icons.editIcon, { size: 18 })}
//                     </span>
//                 </div>
//             ),
//         },
//     ];

//     useEffect(() => {
//         fetchLeadList();
//     }, [searchText]);

//     const fetchLeadList = () => {
//         setLoading(true);
//         try {
//             const filtered = StaticAccountsData.filter(item => {
//                 const hasMajorHead = item.majorHead && item.majorHead.trim() !== "";
//                 const matchesSearch = searchText
//                     ? item.majorHead?.toLowerCase().includes(searchText.toLowerCase())
//                     : true;
//                 return hasMajorHead && matchesSearch;
//             });

//             setTaskSubCategoryList({ data: filtered });
//         } catch (error) {
//             console.error("Failed to fetch data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSearchChange = (e) => {
//         setSearchText(e.target.value);
//     };

//     const handleModalClose = () => {
//         setIsApproveModal(false);
//         reset();
//         setIsUpdate(false);
//         setSelectedData(null);
//         fetchLeadList();
//     };

//     return (
//         <div className="flex flex-col h-full overflow-hidden">
//             {toastData?.show && (
//                             <AlertNotification
//                             show={toastData.show}
//                             message={toastData.message}
//                             type={toastData.type}
//                             onClose={toastOnclose}
//                         />
//             )}
            
//             <div className="p-2 bg-white darkCardBg mb-2">
//                 <Breadcrumps items={breadcrumbItems} />
//             </div>
//             <div className="w-full flex flex-col h-full min-h-0">
//                 <div className="bg-white pr-2 rounded-lg darkCardBg">
//                     <div className="bg-white rounded-lg flex items-center justify-between">
//                         <div className="flex items-center p-3">
//                             <div className="relative w-full max-w-md">
//                                 <input
//                                     type="text"
//                                     placeholder="Search..."
//                                     value={searchText}
//                                     onChange={handleSearchChange}
//                                     className="w-full px-4 py-2 pr-10 pl-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
//                                     {icons.searchIcon}
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="me-3">
//                             <IconButton
//                                 label="Add"
//                                 icon={icons.plusIcon}
//                                 onClick={() => {
//                                     setIsApproveModal(true);
//                                     setIsUpdate(false);
//                                     setSelectedData(null);
//                                 }}
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0">
//                     {taskSubCategoryList.data.length > 0 ? (
//                         <ReusableAgGrid
//                             key={columnDefs.length}
//                             rowData={taskSubCategoryList.data}
//                             columnDefs={columnDefs}
//                             defaultColDef={{ resizable: false }}
//                             onGridReady={(params) => params.api.sizeColumnsToFit()}
//                             pagination={false}
//                             showCheckbox={false}
//                         />
//                     ) : !loading ? (
//                         <div className="flex justify-center items-center h-40 text-gray-500 text-lg font-semibold">
//                             No Data Found
//                         </div>
//                     ) : (
//                         <Loader />
//                     )}
//                 </div>

//                 <CreateMajorHead
//                     isCreateModal={isApproveModal}
//                     setIsCreateModal={setIsApproveModal}
//                     onClose={handleModalClose}
//                     setToastData={setToastData}
//                     IsUpdate={isUpdate}
//                     data={selectedData}
//                 />
//             </div>
//         </div>
//     );
// };

// export default MajorHead;
