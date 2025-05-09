
// import React, { useEffect, useState } from "react";
// import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
// import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
// import icons from "../../../contents/Icons";
// import IconButton from "../../../UI/Buttons/IconButton/IconButton";
// import { useNavigate } from "react-router";
// import { getTaskCategorylistEffect, UpdateTaskCategorylistEffect } from "../../../redux/project/ProjectEffects";
// import Modal from "../../../UI/Modal/Modal";
// import { useForm } from "react-hook-form";
// import FormInput from "../../../UI/Input/FormInput/FormInput";
// import AccountsDetail from "./AccountsDetailPage";
// import StaticAccountsData from "./StaticAccountsData";

// const AccountsList = () => {
//     const navigate = useNavigate();

//     const {
//         register,
//         reset,
//         setValue,
//         handleSubmit,
//         formState: { errors },
//     } = useForm();

//     const [toastData, setToastData] = useState({ show: false });
//     const [activeCard, setActiveCard] = useState(null);
//     const [activeType, setActiveType] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [isApproveModal, setIsApproveModal] = useState(false);
//     const [taskCategoryList, setTaskCategoryList] = useState([]);
//     const [searchText, setSearchText] = useState("");
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [activeTab, setActiveTab] = useState("liability");
//     const [selectedMajorHead, setSelectedMajorHead] = useState(null);

//     const toastOnclose = () => {
//         setToastData(() => ({ ...toastData, show: false }));
//     };

//     const handleSearchChange = (e) => {
//         setSearchText(e.target.value);
//         // if (!e.target.value) setPaginationCurrentPage(1);
//     };

//     const breadcrumbItems = [
//         { id: 1, label: "Home", link: "/user" },
//         { id: 2, label: "Accounts Master" },
//     ];

//     // useEffect(() => {
//     //     fetchDataList();
//     // }, [searchText]);

//     useEffect(() => {
//         fetchDataList(activeTab);
//     }, [searchText, activeTab]);

//     const fetchDataList = async (selectedTab = activeTab) => {
//         setLoading(true);
//         try {
//             const filteredData = StaticAccountsData.filter(item => 
//                 item.type?.toLowerCase() === selectedTab?.toLowerCase()
//             );
    
//             setTaskCategoryList({ data: filteredData });
//         } catch (error) {
//         } finally {
//             setLoading(false);
//         }
//     };

//     const tabs = [
//         { id: "liability", label: " Liability" },
//         { id: "assets", label: "Assets" },
//         { id: "expenses", label: "Expenses" },
//         { id: "income", label: "Income" },
//       ];

//     const approveHandler = async (data) => {
//         console.log("data",data);
        
//         setLoading(true);
//         try {
//             const result = await UpdateTaskCategorylistEffect(data);
//             setToastData({
//                 show: true,
//                 type: result.data.status,
//                 message: result.data.message,
//             });
//         } catch (error) {
//             setToastData({
//                 show: true,
//                 type: "error",
//                 message: error?.response?.data?.message || "Something went wrong!",
//             });
//         } finally {
//             setLoading(false);
//             fetchDataList();
//             setIsApproveModal(false);

//             reset();

//         }
//     };
//     useEffect(() => {
//         if (taskCategoryList?.data?.length > 0) {
//             setActiveCard(taskCategoryList?.data[0]?.id);
//             setActiveType(taskCategoryList?.data[0]?.type);

//         }
//     }, [taskCategoryList]);
    
//     const handleCardClick = (card) => {
//         setActiveCard(card.id);
//         setActiveType(card.type);

//     };

//     const handleAction = async (action, params, master) => {

//         if (action === "Edit") {
//             setIsEditMode(true);
//             setValue("uuid", params?.uuid);
//             setValue("category_name", params?.name);
//             setIsApproveModal(true); // Open the modal
//         }


//         // if (action === "Delete") {


//         // }
//     };
//     const ActionButton = [

//         { action: "Edit", label: "Edit", },
//         // { action: "Delete", label: "Delete", },
//     ];
//     return (
//         <>
//             <div className="flex flex-col h-full overflow-hidden">
//                 {toastData?.show && (
//                     <AlertNotification
//                         show={toastData?.show}
//                         message={toastData?.message}
//                         type={toastData?.type}
//                         onClose={toastOnclose}
//                     />
//                 )}

//                 <div className="p-2 bg-white darkCardBg mb-2">
//                     <Breadcrumps items={breadcrumbItems} /> 
//                 </div>
//                 <div className="p-2 bg-white darkCardBg mb-2">
//                     <div className="flex">
//                         {tabs.map((tab) => (
//                             <button
//                             key={tab.id}
//                             onClick={() => setActiveTab(tab.id)}
//                             className={`px-6 py-2 -mb-px ${activeTab === tab.id ? "tab-active" : ""
//                                 }`}
//                             >
//                             {tab.label}
//                             </button>
//                         ))}
//                         </div>
//                 </div>
//                 <div className="flex-1 gap-3 min-h-0">
//                     <AccountsDetail activeCard={activeType}  />
//                     {/* <TaskMasterDetail activeCard={activeCard} /> */}
//                 </div>
//             </div>
//             <Modal
//                 isOpen={isApproveModal}
//                 onClose={() => { setIsApproveModal(false); reset(); }}
//                 title={isEditMode ? "Edit Task Category" : "Add Task Category"}
//                 showHeader
//                 size="m"
//                 showFooter={false}
//             >
//                 <form onSubmit={handleSubmit(approveHandler)}>
//                     {/* <input type="hidden" {...register("uuid")} /> */}
//                     {!isEditMode && (
//                         <input type="hidden" {...register("type")} />
//                     )}
//                     {isEditMode && <input type="hidden" {...register("uuid")} />}
//                     <div>
//                         <FormInput
//                             label="Nature Of Account"
//                             id="natureofaccount"
//                             iconLabel={icons.Material}
//                             placeholder="Enter Nature Of Account"
//                             register={register}
//                             validation={{
//                                 required: "Please Enter Nature Of Account"
//                             }}
//                             errors={errors}
//                         />

//                     </div>

//                     <div className="flex mt-4">
//                         <IconButton label="Submit" icon={icons.saveIcon} type="submit" loading={loading} />
//                     </div>
//                 </form>
//             </Modal>
//         </>

//     );
// };

// export default AccountsList;
