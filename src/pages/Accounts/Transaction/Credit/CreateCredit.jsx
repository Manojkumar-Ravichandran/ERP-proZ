import React, { useEffect, useState } from "react";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import icons from "../../../../contents/Icons";
import Modal from "../../../../UI/Modal/Modal";
import FileInput from "../../../../UI/Input/FileInput/FileInput";
import Select from "../../../../UI/Select/SingleSelect";
import { useForm } from "react-hook-form";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import { createCreditEffect, getCreditMasterDropdownEffect, updateCreditEffect, uploadFileEffect } from "../../../../redux/Account/Transactions/Transaction";
import { wastageScrubImageUploadEffect } from "../../../../redux/Inventory/WastageScrub/WastageScrubEffects";
import { CreditUpload } from "../../../../redux/Account/Transactions/TransactionFile";

const CreateCredit = ({ isCreateDebitModal, setIsCreateDebitModal, onClose, lead_uuid, setToastData, IsUpdate = false,
  data = null, }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm();
  useEffect(() => {
    if (IsUpdate && data) {
      setValue("uuid", data.uuid);
      setValue("date", data.date);
      setValue("sender_name", data.sender_name);
      setValue("reference_no", data.reference_no);
      setValue("amount", data.amount);
      setValue("payment_mode", data.payment_mode);
      setValue("file_url", data.attachment);
      setValue("purpose", data.purpose);
      // setFileUrl(data?.attachment || null); // Set file URL if available
    } else {
      reset(); // Clear the form for create mode
    }
  }, [IsUpdate, data, setValue, reset]);
  
  const [PurposeData, SetPurposeData] = useState([]);
 useEffect(() => {
       
            (async () => {
                try {
                    let { data } = await getCreditMasterDropdownEffect();
                    data = data.data.map((list) => ({
                        ...list,
                        label: list.name,
                        value: list.id,
                    }));
                    // data.unshift({ label: "ALL", value: "ALL" });
                    SetPurposeData(data);
                } catch (error) {
                  SetPurposeData([]);

                    // setItemList([]);
                }
            })();
        }
   ,[]);
  const PaymentMode = [
    { value: "cash", label: "Cash" },
    { value: "online", label: "Online" },
    { value: "cheque", label: "Cheque" },
    { value: "card", label: "Card" },
  ];
  const submitFormHandler = async (data) => {
    console.log("Form Data:", data);
    const file_url = data.file_url[0];
    const formData = new FormData();
    formData.append("file_url", file_url);
    try {
      if (IsUpdate) {
        const updatePayload = {
          uuid: data.uuid, // Assuming `uuid` is part of the `data` object
          date: data?.date,
          sender_name: data.sender_name,
          reference_no: data.reference_no,
          amount: data.amount,
          payment_mode: data.payment_mode,
          purpose: data?.purpose,
        };
        const updateCreditResponse = await updateCreditEffect(updatePayload); // Call the update API
  
        if (updateCreditResponse?.success) {
          setToastData({
            type: "success",
            message: "Credit entry updated successfully",
          });
        } else {
          throw new Error(updateCreditResponse?.message || "Failed to update credit entry");
        }
      } else {
        // Create Credit API Call
        const createPayload = {
          date: data?.date,
          sender_name: data.sender_name,
          reference_no: data.reference_no,
          amount: data.amount,
          purpose: data?.purpose,
          payment_mode: data.payment_mode,
        };
  
        console.log("Payload for Create Credit:", createPayload);
  
        const createCreditResponse = await createCreditEffect(createPayload); // Call the create API
        const creditUuid = createCreditResponse?.data?.uuid; // Extract UUID from the response
  
        if (!creditUuid) {
          throw new Error("Failed to retrieve UUID from Create Credit API");
        }
  
          if (data.file_url && file_url) {
          const filePayload = new FormData(); 
          filePayload.append("uuid", creditUuid);
          filePayload.append("file_url", file_url);
  
          console.log("Payload for File Upload:", filePayload);
  
          const fileUploadResponse = await CreditUpload(filePayload); // Call the file upload API
  
          if (fileUploadResponse?.success) {
            setToastData({
              type: "success",
              message: "File uploaded successfully",
            });
          } else {
            throw new Error(fileUploadResponse?.message || "File upload failed");
          }
        }
  
        setToastData({
          type: "success",
          message: "Credit entry created successfully",
        });
      }
  
      reset();
      setIsCreateDebitModal(false);
      if (onClose) onClose();
    } catch (error) {
      console.error("Error:", error);
  
      // Failure: Show error toast
      setToastData({
        type: "error",
        message: error?.response?.data?.message || error.message || "An error occurred",
      });
    }
    finally {
      reset();
      setIsCreateDebitModal(false);
      if (onClose) onClose();
    }
  };
  const [fileUrl, setFileUrl] = useState(null);
  
  //  const submitFormHandler = async (data) => {
  //   const payload = {
  //     lead_uuid: lead_uuid,
  //     sender_name: data.sender_name,
  //     reference_no: data.reference_no,
  //     amount: data.amount,
  //     // file_url: data.file_url[0],
  //     // payment_mode: data.payment_mode,
  //   };
  //     console.log("payload", payload)

  //     setToastData({
  //       type: "success",
  //       message: "Debit entry created successfully",
  //     });
  //     reset();
  //   }
  // const fileUrlWatch = watch("file_url");
  // useEffect(() => {
  //   if (fileUrlWatch) {
  //     setFileUrl("");
  //   }
  // }, [fileUrlWatch]);
  return (
    <>
      <Modal
        isOpen={isCreateDebitModal}
        onClose={() => { setIsCreateDebitModal(false); onClose() }}
        title={IsUpdate ? "Update Credit " : "Create Credit "}
        showHeader
        size="m"
        showFooter={false}
        className="darkCardBg"
      >
        <form
          onSubmit={handleSubmit(submitFormHandler)}
        >    <FormInput
            label="Date"
            id="date"
            type="date"
            iconLabel={icons.date}
            register={register}
            // upper={true}
            // validation={{
            //   required: "Lead UUID is required",
            // }}
            errors={errors}
          />

          <Select
            options={PurposeData}
            label="Purpose"
            id="purpose"
            iconLabel={icons.truck}
            placeholder="Select Logistic type"
            register={register}
            errors={errors}
            validation={{ required: "Logistics Type Required" }}
          />
          <FormInput
            label="Sander Name"
            id="sender_name"
            type="text"
            iconLabel={icons.user}
            placeholder="Enter Sender Name"
            register={register}
            upper={true}
            validation={{
              required: "sender name  is required",

            }}
            errors={errors}
          />
          <FormInput
            label="Reference Number"
            id="reference_no"
            type="text"
            iconLabel={icons.BsBoxes}
            placeholder="Enter Reference Number"
            register={register}
            upper={true}
            validation={{
              required: "Reference Number is required",

            }}
            errors={errors}
          />
          <FormInput
            label="Amount Cretited"
            id="amount"
            type="number"
            iconLabel={icons.money}
            placeholder="Enter Amount Cretited"
            register={register}
            upper={true}
            validation={{
              required: "Amount is required",

            }}
            errors={errors}
          />


          {/* Reference Number */}


          <Select
            options={PaymentMode}
            label="Payment mode"
            id="payment_mode"
            iconLabel={icons.truck}
            placeholder="Select Payment mode"
            register={register}
            errors={errors}
            validation={{ required: "Payment mode Required" }}
          />

          {/* <FileInput
            id="file_url"
            label="Upload File"
            showStar={false}
            iconLabel={React.cloneElement(icons.filepin, { size: 20 })}
            validation={{ required: false }}
            register={register}
            errors={errors}
            accept=".jpg,.png,.pdf"
            multiple={false}
          /> */}
          <FileInput
            id="file_url"
            label="Upload File"
            showStar={false}
            iconLabel={React.cloneElement(icons.filepin, { size: 20 })}
            validation={{ required: false }}
            register={register}
            errors={errors}
            accept=".jpg,.png,.pdf"
            multiple={false}
          />
         
          <input type="hidden" id="uuid" value={data?.uuid} />
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="summit"
              className="border border-gray-400 px-4 py-2 rounded"
              onClick={() => {
                reset();
                setIsCreateDebitModal(false);
                if (onClose) onClose();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreateCredit;
