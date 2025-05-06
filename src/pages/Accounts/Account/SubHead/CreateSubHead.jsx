// import React, { useEffect, useState } from "react";

// import { useForm } from "react-hook-form";
// import Modal from "../../../../UI/Modal/Modal";
// import FormInput from "../../../../UI/Input/FormInput/FormInput";
// import icons from "../../../../contents/Icons";
// import { getTransactionMatsterCreateEffect, getTransactionMatsterUpdateEffect } from "../../../../redux/Account/Transactions/Transaction";
// const CreateSubHead = ({ isCreateModal, setIsCreateModal, onClose, setToastData, IsUpdate = false,
//     data = null, }) => {
//     const {
//         register,
//         formState: { errors },
//         handleSubmit,
//         reset,
//         setValue,
//     } = useForm();
//     useEffect(() => {
//         if (IsUpdate && data) {
//             setValue("uuid", data.uuid || "");
//             setValue("type", data.type || "");
//             setValue("subHead", data.subHead || "");
//         }
//         else if (!IsUpdate && data) {
//             setValue("uuid", "");
//             setValue("type", data.type || "");
//             setValue("subHead", "");
//         }

//         else {
//             reset();
//         }
//     }, [IsUpdate, data, setValue, reset]);

//     const [PurposeData, SetPurposeData] = useState([]);

//     const submitFormHandler = async (data) => {
//         console.log("create sunb head",data);
        
//         try {
//             if (IsUpdate) {
//                 const updatePayload = {
//                     uuid: data.uuid, // Assuming `uuid` is part of the `data` object
//                     type: data.type,
//                     subHead: data.subHead,
//                 };
//                 const updateDebitResponse = await getTransactionMatsterUpdateEffect(updatePayload); // Call the update API

//                 if (updateDebitResponse?.success) {
//                     setToastData({
//                         type: "success",
//                         message: "Master entry updated successfully",
//                     });
//                 } else {
//                     throw new Error(updateDebitResponse?.message || "Failed to update master entry");
//                 }
//             } else {
//                 // Create Debit API Call
//                 const createPayload = {

//                     name: data.name,
//                     type: data.type,
//                 };

//                 await getTransactionMatsterCreateEffect(createPayload); // Call the create API
//                 setToastData({
//                     type: "success",
//                     message: "Master entry created successfully",
//                 });
//             }

//             reset();
//             setIsCreateModal(false);
//             if (onClose) onClose();
//         } catch (error) {
//             console.error("Error:", error);

//             // Failure: Show error toast
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
//                 title={IsUpdate ? "Update SubHead data" : "Create SubHead Data "}
//                 showHeader
//                 size="m"
//                 showFooter={false}
//                 className="darkCardBg"
//             >
//                 <form
//                     onSubmit={handleSubmit(submitFormHandler)}
//                 >
//                     <FormInput
//                         label="Sub Head"
//                         id="subHead"
//                         type="text"
//                         iconLabel={icons?.productValue}
//                         placeholder="Enter Sub Head"
//                         register={register}
//                         validation={{
//                             required: "Sub Head is required",

//                         }}
//                         errors={errors}
//                     />
//                     <input
//                         type="hidden"
//                         id="type"
//                         value={data?.type}
//                     />
//                     <input type="hidden" id="uuid" value={data?.uuid} />
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

// export default CreateSubHead;
