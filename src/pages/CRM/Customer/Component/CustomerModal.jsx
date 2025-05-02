import React, { useEffect, useState } from "react";
import IconOnlyBtn from "../../../../UI/Buttons/IconOnlyBtn/IconOnlyBtn";
import icons from "../../../../contents/Icons";
import Modal from "../../../../UI/Modal/Modal";
import { useForm } from "react-hook-form";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import { validationPatterns } from "../../../../utils/Validation";
import SingleCheckbox from "../../../../UI/Input/CheckBoxInput/SingleCheckbox";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import { useSelector, useDispatch } from "react-redux";
import CircleIconBtn from "../../../../UI/Buttons/CircleIconBtn/CircleIconBtn";
import TextArea from "../../../../UI/Input/TextArea/TextArea";
import { customerMessageEffect, customerUpdateEffect } from "../../../../redux/CRM/Customer/CustomerEffects";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";
import { useNavigate } from "react-router";
import { createLeadNoteEffect } from "../../../../redux/CRM/lead/LeadEffects";
import FileInput from "../../../../UI/Input/FileInput/FileInput";

export function CustomerDataEdit() {
  const customerDetails = useSelector(
    (state) => state?.customer?.customerDetail?.data
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastData, setToastData] = useState({ show: false });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const handleModalToggle = () => setIsModalOpen((prev) => !prev);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm();

  const isContact = watch("is_contact");

  useEffect(() => {
    if (customerDetails) {
      const isSameContact =
        customerDetails.contact === customerDetails.whatsapp_contact;
      setValue("uuid", customerDetails.uuid || "");
      setValue("is_contact", isSameContact);
      setValue("name", customerDetails.name || "");
      setValue("contact", customerDetails.contact || "");
      setValue("whatsapp_contact", customerDetails.whatsapp_contact || "");
      setValue("email", customerDetails.email || "");
    }
  }, [customerDetails, setValue]);

  const onSubmits = async (formData) => {
    setIsLoading(true);
    const isSameContact = formData.is_contact;
    const fieldList = {
      uuid: formData.uuid,
      contact: formData.contact,
      whatsapp: isSameContact ? formData.contact : formData.whatsapp_contact,
      name: formData.name,
      email: formData.email,
    };
    try {
      const result = await customerUpdateEffect(fieldList);
      if (result.data.status === "success") {
        setToastData({
          show: true,
          type: result?.data?.status,
          message: result?.data?.message,
        });
      }
    } catch (error) {
      setToastData({
        show: true,
        type: "error",
        message: "Failed to update customer details",
      });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      reset();
    }
  };

  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
  };
  return (
    <>
      {toastData?.show && (
        <AlertNotification
          type={toastData?.type}
          show={toastData?.show}
          message={toastData?.message}
          onClose={toastOnclose}
        />
      )}
      <IconOnlyBtn
        type="button"
        tooltipId="edit-customer-btn"
        icon={React.cloneElement(icons.editIcon, { size: 24 })}
        tooltip="Edit Customer Details"
        onClick={handleModalToggle}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        title="Edit Customer Details"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(onSubmits)} className="grid gap-3">
          <FormInput
            label="Contact"
            id="contact"
            iconLabel={icons.contact}
            placeholder="Enter your Contact Number"
            register={register}
            validation={{
              required: "Contact Number is required",
              pattern: {
                value: validationPatterns.contactNumber,
                message: "Provide Valid Contact Number",
              },
            }}
            errors={errors}
          />
          <div>
            <SingleCheckbox
              id="is_contact"
              label="Same as WhatsApp Number"
              register={register}
              errors={errors}
              validation={{
                required: false,
              }}
            />
          </div>
          {!isContact && (
            <FormInput
              label="WhatsApp"
              id="whatsapp_contact"
              iconLabel={icons.whatsapp}
              placeholder="Enter your WhatsApp Number"
              register={register}
              validation={{
                required: "WhatsApp Number is required",
                pattern: {
                  value: validationPatterns.contactNumber,
                  message: "Provide Valid WhatsApp Number",
                },
              }}
              errors={errors}
              showStar={false}
              max={10}
              allowNumbersOnly={true}
            />
          )}

          <FormInput
            label="Name"
            id="name"
            iconLabel={icons.name}
            placeholder="Lead Name"
            register={register}
            validation={{
              required: "Lead name is required",
              pattern: {
                value: validationPatterns.textOnly,
                message: "Provide Valid Name",
              },
            }}
            errors={errors}
          />

          <FormInput
            label="Email"
            id="email"
            iconLabel={icons.mail}
            placeholder="Enter your email id"
            register={register}
            validation={{ required: false }}
            errors={errors}
            showStar={false}
          />
          <div className="mt-2 flex gap-2">
            <IconButton label="Cancel" icon={icons.cancelIcon} type="button" onClick={handleModalToggle} />
            <IconButton label="Update" icon={icons.saveIcon} type="submit" />
          </div>
        </form>
      </Modal>
    </>
  );
}

export function WhatsAppMessage({ selectedCustomer }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [whatsappData, setWhatsAppData] = useState({
    show: false,
    loading: false,
    data: {},
  });
  const [toastData, setToastData] = useState({ show: false });
  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
  };
  const {
    register: whatsappRegister,
    formState: { errors: whatsappError },
    handleSubmit: whatsappHandleSubmit,
    setValue: whatsappSetValue,
    watch: whatsappWatch,
    reset: whatsappReset,
  } = useForm();

  const whatsAppHandler = async (data) => {
    setWhatsAppData({ ...whatsappData, loading: true });

    const payload = {
      ...data,
      uuid: selectedCustomer?.uuid,
      type: 8,
      send_msg: 1,
    };
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      console.log("key", key)

      if (key === "file_url") {
        console.log("keys", key)

        if (value?.length > 0) {
          formData.append("file_url", value[0]); // Appending the file

        } else {
          console.log("keys value", key, value)

          formData.append("file_url", "")
        }
      } else {
        formData.append(key, value);

      }
    });
    formData.append("message_for", "customer")
    formData.append("reference_id", selectedCustomer?.id)

    try {
      const result = await customerMessageEffect(formData);
      if (result.data.status === "success") {
        setToastData({
          show: true,
          type: result?.data?.status,
          message: result?.data?.message,
        });
      }
    } catch (error) {
      setToastData({
        show: true,
        type: error?.data?.status,
        message: error?.data?.message,
      });
    } finally {
      whatsappReset();
      setWhatsAppData({ ...whatsappData, loading: false, show: false });
    }
  };
  return (
    <>
      {toastData?.show && (
        <AlertNotification
          show={toastData?.show}
          message={toastData?.message}
          type={toastData?.type}
          onClose={toastOnclose}
        />
      )}
      <CircleIconBtn
        icon={React.cloneElement(icons?.whatsappIcon, { size: 24 })}
        tooltip="whatsapp_msg"
        className="btn-hover"
        tooltipId="whatsapp_msg"
        namefeild="whatsapp_msg"
        content="Whatsapp"
        onClick={() => {
          setWhatsAppData({ ...whatsappData, show: true });
        }}
      />
      <Modal
        isOpen={whatsappData?.show}
        onClose={() => {
          setWhatsAppData({ ...whatsappData, show: false });
          whatsappReset();
        }}
        title="WhatsApp Message"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={whatsappHandleSubmit(whatsAppHandler)}>
          <TextArea
            id="content"
            iconLabel={icons.textarea}
            label="Message"
            validation={{ required: "Message is required" }}
            register={whatsappRegister}
            errors={whatsappError}
          />
          <FileInput
            id="file_url"
            label="Upload File"
            showStar={false}
            register={whatsappRegister}
            iconLabel={React.cloneElement(icons.filepin, { size: 20 })}
            validation={{ required: false }}
            errors={whatsappError}
            accept=".jpg,.png,.pdf"
            multiple={false}
          />
          <div className="flex gap-3 mt-3">
            <IconButton
              type="button"
              icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
              onClick={() => {
                // setIsModalOpenWhatsapp(false);
                whatsappReset();
                setWhatsAppData({ ...whatsappData, show: false });
              }}
            // disabled={whatsappLoading}
            />
            <IconButton
              type="submit"
              icon={React.cloneElement(icons.whatsapp, { size: "20px" })}
              label="Send"
              className="px-4 py-2"
              loading={whatsappData?.loading}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}

export function MailMessage({ selectedCustomer }) {
  const [mailData, setMailData] = useState({
    show: false,
    loading: false,
    data: {},
  });
  const [toastData, setToastData] = useState({ show: false });

  const {
    register: mailRegister,
    formState: { errors: mailError },
    handleSubmit: mailHandleSubmit,
    setValue: mailSetValue,
    watch: mailActivity,
    reset: mailReset,
  } = useForm();
  const mailHandler = async (data) => {
    setMailData({ ...mailData, loading: true });
    const payload = {
      ...data,
      uuid: selectedCustomer?.uuid,
      type: 5,
    };
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      console.log("key", key)
      if (key === "file_url") {
        if (value?.length > 0) {
          formData.append("file_url", value[0]); // Appending the file

        } else {
          console.log("value", value)
          formData.append("file_url", "")
        }// Appending the file
      } else {
        formData.append(key, value);

      }
    });
    formData.append("message_for", "customer")
    formData.append("reference_id", selectedCustomer?.id)
    try {
      const result = await customerMessageEffect(formData);
      if (result.data.status === "success") {
        setToastData({
          show: true,
          type: result?.data?.status,
          message: result?.data?.message,
        });
      }
    } catch (error) {
      setToastData({
        show: true,
        type: error?.data?.status,
        message: error?.data?.message,
      });
    } finally {
      mailReset();
      setMailData({ ...mailData, loading: false, show: false });
    }
  };
  return (
    <>
      <CircleIconBtn
        icon={React.cloneElement(icons?.mail, { size: 24 })}
        tooltip="mail_msg"
        className="btn-hover"
        tooltipId="mail_msg"
        namefeild="mail_msg"
        content="Mail"
        onClick={() => {
          setMailData({ ...mailData, show: true });
        }}
      />

      <Modal
        isOpen={mailData?.show}
        onClose={() => {
          setMailData({ ...mailData, show: false });
          mailReset();
        }}
        title="Mail Message"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={mailHandleSubmit(mailHandler)}>
          <TextArea
            id="subject"
            iconLabel={icons.textarea}
            label="Subject"
            validation={{ required: "Subject is required" }}
            register={mailRegister}
            errors={mailError}
          />
          <TextArea
            id="content"
            iconLabel={icons.textarea}
            label="Message"
            validation={{ required: "Message is required" }}
            register={mailRegister}
            errors={mailError}
          />
          <FileInput
            id="file_url"
            label="Upload File"
            showStar={false}
            register={mailRegister}
            iconLabel={React.cloneElement(icons.filepin, { size: 20 })}
            validation={{ required: false }}
            errors={mailError}
            accept=".jpg,.png,.pdf"
            multiple={false}
          />
          <div className="flex gap-3 mt-3">
            <IconButton
              type="button"
              icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
              onClick={() => {
                // setIsModalOpenWhatsapp(false);
                mailReset();
                setMailData({ ...mailData, show: false });
              }}
            />
            <IconButton
              type="submit"
              icon={React.cloneElement(icons.mail, { size: "20px" })}
              label="Send"
              className="px-4 py-2"
              loading={mailData?.loading}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}

export function AddNotes({ selectedCustomer }) {
  const [toastData, setToastData] = useState({ show: false });

  const [noteData, setNoteData] = useState({
    show: false,
    loading: false,
    data: {},
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm();
  const submitHandler = async (data) => {
    const payload = {
      ...data,
      lead_id: selectedCustomer?.id,
      type: "customer"
    }
    try {
      const result = await createLeadNoteEffect(payload);
      if (result.data.status === "success") {
        setToastData({
          show: true,
          type: result?.data?.status,
          message: result?.data?.message,
        });
      }
    } catch (error) {
      setToastData({
        show: true,
        type: error?.data?.status,
        message: error?.data?.message,
      });
    } finally {
      reset();
      setNoteData({ ...noteData, loading: false, show: false })
      // setWhatsAppData({ ...whatsappData, loading: false, show: false });
    }
  };
  return (
    <>
      <CircleIconBtn
        icon={React.cloneElement(icons?.note, { size: 24 })}
        tooltip="note_msg"
        className="btn-hover"
        tooltipId="note_msg"
        namefeild="note_msg"
        content="Notes"
        onClick={() => {
          setNoteData({ ...noteData, show: true });
        }}
      />
      <Modal
        isOpen={noteData?.show}
        onClose={() => {
          setNoteData({ ...noteData, show: false });
          reset();
        }}
        title="Add Note"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(submitHandler)}>
          <TextArea
            id="description"
            iconLabel={icons.textarea}
            label="Notes"
            validation={{ required: "Notes is required" }}
            register={register}
            errors={errors}
          />

          <div className="flex gap-3 mt-3">
            <IconButton
              type="button"
              icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
              onClick={() => {
                // setIsModalOpenWhatsapp(false);
                reset();
                setNoteData({ ...noteData, show: false });
              }}
            />
            <IconButton
              type="submit"
              icon={React.cloneElement(icons.note, { size: "20px" })}
              label="Send"
              className="px-4 py-2"
              loading={noteData?.loading}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}

export function AddLead({ selectedCustomer }) {
  const navigate = useNavigate();
  const leadDatas = useSelector(state => state?.customer?.leadDetail?.data);
  const [leadData, setLeadData] = useState();

  useEffect(() => {
    setLeadData(leadDatas)
  }, [leadDatas])
  return (
    <>
      <CircleIconBtn
        icon={React.cloneElement(icons?.name, { size: 24 })}
        tooltip="add_lead"
        className="btn-hover"
        tooltipId="add_lead"
        namefeild="add_lead"
        content="Add Lead"
        onClick={() => {
          navigate(`/user/crm/lead/create-lead/`, {
            state: { contact: leadData?.contact }, // Pass leadId in state
          });

        }}
      />
    </>
  )

}

