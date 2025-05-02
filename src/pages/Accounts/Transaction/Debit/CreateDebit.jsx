import React, { useEffect, useState } from "react";
import icons from "../../../../contents/Icons";
import Modal from "../../../../UI/Modal/Modal";
import FileInput from "../../../../UI/Input/FileInput/FileInput";
import Select from "../../../../UI/Select/SingleSelect";
import { useForm } from "react-hook-form";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import { createDebitEffect,  getDebitMasterDropdownEffect,  updateDebitEffect} from "../../../../redux/Account/Transactions/Transaction";
import { DebitUpload } from "../../../../redux/Account/Transactions/TransactionFile";

const CreateDebit = ({ isCreateDebitModal, setIsCreateDebitModal, onClose, setToastData, IsUpdate = false,
  data = null, }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();
  useEffect(() => {
    if (IsUpdate && data) {
      setValue("uuid", data.uuid);
      setValue("date", data.date);
      setValue("receipient_name", data.receipient_name);
      setValue("reference_no", data.reference_no);
      setValue("amount", data.amount);
      setValue("payment_mode", data.payment_mode);
      setValue("file_url", data.attachment);
      setValue("purpose", data.purpose);
    } else {
      reset();
    }
  }, [IsUpdate, data, setValue, reset]);
  
  const [PurposeData, SetPurposeData] = useState([]);
 useEffect(() => {
       
            (async () => {
                try {
                    let { data } = await getDebitMasterDropdownEffect();
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
          receipient_name: data.receipient_name,
          reference_no: data.reference_no,
          amount: data.amount,
          payment_mode: data.payment_mode,
          purpose: data?.purpose,
        };
        const updateDebitResponse = await updateDebitEffect(updatePayload); // Call the update API
  
        if (updateDebitResponse?.success) {
          setToastData({
            type: "success",
            message: "Debit entry updated successfully",
          });
        } else {
          throw new Error(updateDebitResponse?.message || "Failed to update debit entry");
        }
      } else {
        // Create Debit API Call
        const createPayload = {
          date: data?.date,
          receipient_name: data.receipient_name,
          reference_no: data.reference_no,
          amount: data.amount,
          purpose: data?.purpose,
          payment_mode: data.payment_mode,
        };
  
        console.log("Payload for Create Debit:", createPayload);
  
        const createDebitResponse = await createDebitEffect(createPayload); // Call the create API
        const debitUuid = createDebitResponse?.data?.uuid; // Extract UUID from the response
  
        if (!debitUuid) {
          throw new Error("Failed to retrieve UUID from Create Debit API");
        }
  
          if (data.file_url && file_url) {
          const filePayload = new FormData(); 
          filePayload.append("uuid", debitUuid);
          filePayload.append("file_url", file_url);
  
          console.log("Payload for File Upload:", filePayload);
  
          const fileUploadResponse = await DebitUpload(filePayload); // Call the file upload API
  
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
          message: "Debit entry created successfully",
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

  
 
  return (
    <>
      <Modal
        isOpen={isCreateDebitModal}
        onClose={() => { setIsCreateDebitModal(false); onClose() }}
        title={IsUpdate ? "Update Debit " : "Create Debit "}
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
            id="receipient_name"
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

export default CreateDebit;
