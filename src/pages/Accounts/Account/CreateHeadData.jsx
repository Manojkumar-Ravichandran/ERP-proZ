// import React, { useEffect, useState } from "react";

// import { useForm } from "react-hook-form";
// import Modal from "../../../UI/Modal/Modal";
// import FormInput from "../../../UI/Input/FormInput/FormInput";
// import SearchableSelector from "../../../UI/Select/selectBox";
// import { createMajorHeadEffect, createSubHeadEffect, getMajorHeadDropdownEffect, getMajorHeadEffect, getMajorHeadListEffect, getNatureOfAccountDropdownEffect, getNatureOfAccountListEffect, getSubHeadDropdownEffect, updateMajorHeadEffect, updateSubHeadEffect } from "../../../redux/Account/Accounts/AccountsEffects";
// const CreateHeadsData = ({ isCreateModal, setIsCreateModal, onClose, setToastData, IsUpdate = false,
//     data = null, }) => {
        
//     const {
//         register,
//         formState: { errors },
//         handleSubmit,
//         reset,
//         watch,
//         setValue,
//     } = useForm();
    
//     useEffect(() => {
//         if (IsUpdate && data) {
//             const type = data.headType || "major";
//             setHeadType(type);

//             setValue("uuid", data.uuid || "");
//             setValue("section", data.section || "");
//             setValue("natureaccount", data.natureaccount || "");
    
//             if (type === "major") {
//                 setValue("name", data.name || "");
//             } else if (type === "sub") {
//                 setValue("majorhead", data.majorhead || "");
//                 setValue("name", data.name || "");
//             }
    
//         } else {
//             setHeadType(data?.headType || "major");
//             reset();
//         }
//     }, [IsUpdate, data, setValue, reset]);
    

//     const [loading, setLoading] = useState(false);
//     const [headType, setHeadType] = useState("major");
//     const [natureOptions, setNatureOptions] = useState([]);
//     const [majorHeadOptions, setMajorHeadOptions] = useState([]);
//     const [sectionOptions, setSectionOptions] = useState([]);

//     useEffect(() => {
//         fetchDropdownOptions();
//     }, []);

//     const fetchDropdownOptions = async () => {
//         setLoading(true);
//         try {
//             const response = await getMajorHeadDropdownEffect({ section: "", natureaccount: "" });
            
//             // const sectionOptions = response?.data?.data?.map(item => ({
//             //     label: item.section,
//             //     value: item.section,
//             // })) || [];
//             const natureOptions = response?.data?.data?.map(item => ({
//                 label: item.natureaccount,
//                 value: item.natureaccount,
//             })) || [];
//             setNatureOptions(natureOptions);
//             // setSectionOptions(sectionOptions);
//         } catch (error) {
//             console.error("Error fetching nature of account options:", error);
//         } finally {
//             setLoading(false);
//         }
//         try {
//             const response = await getNatureOfAccountListEffect({ name: "" });
//             console.log("getNatureOfAccountListEffect",response);
            
//             const options = [
//                 { id: 1, label: "Assets", value: "assets" },
//                 { id: 2, label: "Income", value: "income" },
//                 { id: 3, label: "Expenses", value: "expenses" },
//                 { id: 4, label: "Liability", value: "liability" }
//             ];
    
            
//             const natureOptions = response?.data?.data?.data?.map(item => ({
//                 label: item.name,
//                 value: item.name,
//             })) || [];
//             console.log("natureOptions",natureOptions);

//             setSectionOptions(options);
//         } catch (error) {
//             console.error("Error fetching nature of account options:", error);
//         } finally {
//             setLoading(false);
//         }
//         // for Sub head create dropdown
//         try {
//             const response = await getSubHeadDropdownEffect({ section: "", natureaccount: "", majorhead:""});
//             console.log("getSubHeadDropdownEffect",response);
            
//             const majorHeadOptions = response?.data?.data?.map(item => ({
//                 label: item.majorhead,
//                 value: item.majorhead,
//             })) || [];
//             console.log("majorHeadOptions",majorHeadOptions);

//             setMajorHeadOptions(majorHeadOptions);
//         } catch (error) {
//             console.error("Error fetching nature of account options:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//     const submitFormHandler = async (data) => {
//         console.log("create head",data);
        
//         try {

            
//             if (IsUpdate) {
//                 if(headType === "major"){
//                     const updatemajorPayload = {
//                         uuid: data.uuid, // Assuming `uuid` is part of the `data` object
//                         name: data.name,
//                     };
//                     console.log("updatePayload",updatemajorPayload);
                    
//                     const response = await updateMajorHeadEffect(updatemajorPayload); // Call the update API
//                     console.log("updateMajorHeadEffect",response);
    
//                     if (response?.success) {
//                         setToastData({
//                             type: "success",
//                             message: "MajorHead updated successfully",
//                     })};
//                 }
//                     const updatesubPayload = {
//                         uuid: data.uuid, // Assuming `uuid` is part of the `data` object
//                         name: data.name,
//                     };
//                     console.log("updatePayload",updatesubPayload);
                    
//                     const response = await updateSubHeadEffect(updatesubPayload); // Call the update API
//                     console.log("updateSubHeadEffect",response);
    
//                     if (response?.success) {
//                         setToastData({
//                             type: "success",
//                             message: "subHead updated successfully",
//                     });
//             } else {
//                 throw new Error(response?.message || "Failed to update subHead entry");
//             }
//             } else {
                
                
//                 if(headType === "major"){
//                     const createPayload = {
//                         name: data.name,
//                         section: data.section,
//                         natureaccount:data.natureaccount,
//                         is_edit: 1,
//                     };
//                     const majorResponse = await createMajorHeadEffect(createPayload); // Call the create API
//                     if (majorResponse?.success) {
//                         setToastData({
//                         type: "success",
//                         message: "MajorHead created successfully",
//                     });
//                  };
//                 } else if (headType === "sub") {
//                 const createPayload = {
//                     name: data.name,
//                     section: data.section,
//                     natureaccount:data.natureaccount,
//                     is_edit: 1,
//                     majorhead:data.majorhead
//                 };
//                 const subResponse = await createSubHeadEffect(createPayload); // Call the create API
//                 if (subResponse?.success) {
//                     setToastData({
//                         type: "success",
//                         message: "MajorHead created successfully",
//                     });
//                 };
//             }
//             }

//             reset();
//             setIsCreateModal(false);
//             if (onClose) onClose();
//         } catch (error) {
//             console.error("Error:", error);

//             setToastData({
//                 type: "error",
//                 message: error?.response?.data?.message || error.message || "An error occurred",
//             });
//         }
//         finally {
//             reset();
//             setIsCreateModal(false);
//             if (onClose) onClose();
//         }
//     };

//     return (
//         <>
//             <Modal
//                 isOpen={isCreateModal}
//                 onClose={() => { setIsCreateModal(false); onClose() }}
//                 title={IsUpdate ? (headType === "major" ? "Update Major Head data": "Update Sub Head data") : (headType === "major" ? "Create Major Head": "Create Sub Head")}
//                 showHeader
//                 size="m"
//                 showFooter={false}
//                 className="darkCardBg"
//             >
//                 <form
//                     onSubmit={handleSubmit(submitFormHandler)}
//                 >
//                     {!IsUpdate && (
//                     <div className="mb-4">
//                     <SearchableSelector
//                         id="section"
//                         label="Section"
//                         options={sectionOptions}
//                         placeholder="Select Section"
//                         setValue={setValue}
//                         register={register}
//                         validation={{ required: "Section is required" }}
//                         errors={errors}
//                     />
//                     </div>
//                 )}
//                     {!IsUpdate && (
//                     <div className="mb-4">
//                     <SearchableSelector
//                         label="Nature of Account"
//                         id="natureaccount"
//                         placeholder="Select Nature of Account"
//                         options={natureOptions}
//                         setValue={(id, value) => {
//                             setValue(id,value)
//                         if (id === "headType") setHeadType(value);
//                         }}
//                         register={register}
//                         validation={{ required: "Select Nature of Account" }}
//                         errors={errors}
//                     />
//                     </div>
//                 )}
//                 {!IsUpdate && headType === "sub" && (
//                     <div className="mb-4">
//                     <SearchableSelector
//                         label="Major Head"
//                         id="majorhead"
//                         placeholder="Select Major Head"
//                         options={majorHeadOptions}
//                         setValue={(id, value) => {
//                             setValue(id,value)
//                         if (id === "headType") setHeadType(value);
//                         }}
//                         register={register}
//                         validation={{ required: "Select Major Head" }}
//                         errors={errors}
//                         defaultValue={watch("name")}
//                     />
//                     </div>
//                 )}
//                     {!IsUpdate ? (
//                     <div className="mb-4">
//                     <FormInput
//                         label={headType === "major" ? "Major Head Name" : "Sub Head Name"}
//                         id="name"
//                         type="text"
//                         placeholder={`Enter ${headType === "major" ? "Major" : "Sub"} Head Name`}
//                         register={register}
//                         validation={{ required: "Name is required" }}
//                         errors={errors}
//                     />
//                     </div>
//                 ):(
//                     <FormInput
//                         label={headType === "major" ? "Major Head Name" : "Sub Head Name"}
//                         id="name"
//                         type="text"
//                         placeholder={`Enter ${headType === "major" ? "Major" : "Sub"} Head Name`}
//                         register={register}
//                         validation={{ required: "Name is required" }}
//                         errors={errors}
//                     />
//                     )}
                    
//                     <input
//                         type="hidden"
//                         id="type"
//                         value={data?.type}
//                     />
//                     <input type="hidden" id="uuid"{...register("uuid")} />
//                     <div className="flex justify-end gap-4 pt-4">
//                         <button
//                             type="summit"
//                             className="border border-gray-400 px-4 py-2 rounded"
//                             onClick={() => {
//                                 reset();
//                                 setIsCreateModal(false);
//                                 if (onClose) onClose();
//                             }}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="bg-green-600 text-white px-4 py-2 rounded"
//                         >
//                             Submit
//                         </button>
//                     </div>
//                 </form>
//             </Modal>
//         </>
//     );
// };

// export default CreateHeadsData;
