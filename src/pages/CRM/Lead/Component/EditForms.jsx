import React, { useCallback, useEffect, useState } from "react";
import IconOnlyBtn from "../../../../UI/Buttons/IconOnlyBtn/IconOnlyBtn";
import icons from "../../../../contents/Icons";
import Modal from "../../../../UI/Modal/Modal";
import {
  genderList,
  localityList,
  referralList,
  socialMediaList,
} from "../../../../contents/DropdownList";
import { getLeadStageListEffect, referenceDetails, getReferenceList, UpdateReferenceEffect } from "../../../../redux/CRM/lead/LeadEffects";

import { useForm } from "react-hook-form";
import Select from "../../../../UI/Select/SingleSelect";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import { getEmployeeListEffect, getrefernceTypeListEffect } from "../../../../redux/common/CommonEffects";
import TextArea from "../../../../UI/Input/TextArea/TextArea";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import { getDefaultDateTime } from "../../../../utils/Data";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";
import { useDispatch } from "react-redux";
import { LeadReferenceEffect, LeadTransferEffect } from "../../../../redux/CRM/lead/LeadEffects";
import { setLeadDetailInprogress } from "../../../../redux/CRM/lead/LeadActions";


export function ReferenceEditForm({ leadData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [engineerList, setEngineerList] = useState([]);
  const [architectList, setArchitectList] = useState([]);
  const [refTypeList, setRefTypeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState(null);
  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    setValue,
    watch,
    reset,
    handleSubmit,
  } = useForm();

  const referalType = watch("reference_type");

  const handleModalOpen = () => {
    setValue("reference_type", leadData?.reference_type || "");
    setValue("referal_employee", leadData?.referal_employee || "");
    setValue("referal_platform", leadData?.referal_platform || "");
    setIsModalOpen(true);
  };

  const handleModalClose = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchEmployeeList = async () => {
      try {
        let { data } = await getEmployeeListEffect();
        setEmployeeList(data.data.map((list) => ({ label: list.name, value: list.id })));
      } catch {
        setEmployeeList([]);
      }
    };

    fetchEmployeeList();
  }, []);
  useEffect(() => {
    if (referalType === "architect" || referalType === "engineer") {
      getReferenceList({}, referalType);
    }
  }, [referalType]);
  
  useEffect(() => {
    (async () => {
      try {
        let { data } = await getrefernceTypeListEffect();
        data = data.data.map((list) => ({
          label: list.name.charAt(0).toUpperCase() + list.name.slice(1),
          value: list.name.toLowerCase(),
        }));

        setRefTypeList(data);
      } catch (error) {
        setRefTypeList([]);
      }
    })();
    setValue("incharge", "");
    setValue("reference_type", "");
    setValue("lead_type", "")
  }, []);
  
  const getEngineerList = async (search) => {
    try {
      let { data } = await getReferenceList({}, (search === "architect" || search === "engineer") ? search : undefined);
      const formattedData = data.data.data.map((list) => ({ label: list.name, value: list.id }));
      
      search === "architect" ? setArchitectList(formattedData) : setEngineerList(formattedData);
    } catch {
      search === "architect" ? setArchitectList([]) : setEngineerList([]);
    }
  };
  
  useEffect(() => {
    if (referalType === "architect" || referalType === "engineer") {
      getEngineerList(referalType);
    }
  }, [referalType]);
  

  const submitFormHandler = async (data) => {
    setLoading(true);
    const payload = { uuid: leadData?.uuid, ...data };

    try {
      const result = await LeadReferenceEffect(payload);
      setToastData({
        show: true,
        type: result.data.status,
        message: result.data.message,
      });
    } catch (error) {
      setToastData({
        show: true,
        type: "error",
        message: error?.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      reset();
      dispatch(setLeadDetailInprogress({ uuid: leadData.uuid, stages: "", is_schedule: 0 }));
    }
  };

  const toastOnClose = useCallback(() => {
    setToastData((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <>
      {toastData?.show && (
        <AlertNotification
          type={toastData.type}
          show={toastData.show}
          message={toastData.message}
          onClose={toastOnClose}
        />
      )}

      <IconOnlyBtn
        type="button"
        tooltipId="edit-lead-btn"
        icon={React.cloneElement(icons.editIcon, { size: 24 })}
        tooltip="Edit Lead Reference"
        onClick={handleModalOpen}
        disabled={leadData?.is_closed === 1}
      />

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title="Edit Lead Reference Detail" showFooter={false}>

        <form onSubmit={handleSubmit(submitFormHandler)}>
          <div className="grid gap-2">
            <Select
              options={refTypeList}
              label="Referral Source"
              id="reference_type"
              iconLabel={icons.socialmedia}
              placeholder="Select Reference Type"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />

            {referalType?.toLowerCase() === "social media" && (
              <Select
                options={socialMediaList}
                label="Social Media Platform"
                id="referal_platform"
                iconLabel={icons.social}
                placeholder="Select Social Media Platform"
                register={register}
                showStar={false}
                validation={{ required: false }}
                errors={errors}
              />
            )}

            {referalType === "employee" && (
              <Select
                options={employeeList}
                label="Referred Employee"
                id="referal_employee"
                iconLabel={icons.referenceIcon}
                placeholder="Select Employee"
                register={register}
                showStar={false}
                validation={{ required: false }}
                errors={errors}
              />
            )}

            {referalType === "architect" && (
              <Select
                options={architectList}
                label="Referred Architect"
                id="referal_employee"
                iconLabel={icons.referenceIcon}
                placeholder="Select Architect"
                register={register}
                showStar={false}
                validation={{ required: false }}
                errors={errors}
              />
            )}

            {referalType === "engineer" && (
              <Select
                options={engineerList}
                label="Referred Engineer"
                id="referal_employee"
                iconLabel={icons.referenceIcon}
                placeholder="Select Engineer"
                register={register}
                showStar={false}
                validation={{ required: false }}
                errors={errors}
              />
            )}
          </div>

          <div className="flex gap-3 mt-3">
            <IconButton
              disabled={loading}
              type="button"
              icon={React.cloneElement(icons?.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
              onClick={handleModalClose}
            />
            <IconButton
              type="submit"
              icon={React.cloneElement(icons?.saveIcon, { size: "20px" })}
              label="Save"
              className="px-4 py-2"
              loading={loading}
              disabled={!referalType}
            />
          </div>
        </form>

      </Modal>
    </>
  );
}

/////////////////////////////////////
export function ContactDetailEditForm({ leadData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <>
      <IconOnlyBtn
        type="button"
        tooltipId="edit-lead-btn"
        icon={React.cloneElement(icons.editIcon, { size: 24 })}
        tooltip="Edit Lead Details"
        onClick={handleModalOpen}
        disabled={leadData?.is_closed === 1}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Edit Lead Details"
        showFooter={false}
      >
        hi
      </Modal>
    </>
  );
}
export function InchargeDetailEditForm({ leadData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState();
  const dispatch = useDispatch()

  const {
    register,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
    handleSubmit,
  } = useForm();
  useEffect(() => {
    setValue("date", getDefaultDateTime());
    setValue("incharge", leadData?.incharge);
  }, []);
  const toastOnclose = useCallback(() => {
    setToastData({ ...toastData, show: false });
  }, [toastData]);
  const handleModalOpen = () => {
    setIsModalOpen(true);
    setValue("incharge", leadData?.incharge);

  };
  const handleModalClose = () => setIsModalOpen(false);
  useEffect(() => {
    (async () => {
      try {
        let { data } = await getEmployeeListEffect();
        data = data.data.map((list) => ({
          label: list.name,
          value: list.id,
        }));
        setEmployeeList(data);
      } catch (error) {
        setEmployeeList([]);
      }
    })()
  }, [])

  const submitTheData = async (data) => {
    const payload = {
      date: data.date.replace("T", " "),
      uuid: leadData?.uuid,
      ...data,
      type: "primary"
    }

    try {
      const result = await LeadTransferEffect(payload);
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
      setLoading(false);
      setIsModalOpen(false);
      reset();
      // <DetailsCall uuid ={leadData.uuid} />
      const payloads = {
        uuid: leadData.uuid,
        stages: "",
        is_schedule: 0,
      };
      dispatch(setLeadDetailInprogress({ ...payloads }));

      // DetailsCall(leadData.uuid);
    }
  }
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
        tooltipId="edit-lead-transfer-btn"
        icon={React.cloneElement(icons.transferIcon, {
          size: 24,
          style: { transform: "rotate(90deg)" },
        })}
        tooltip="Transfer the lead"
        onClick={handleModalOpen}
        disabled={leadData?.is_closed === 1}

      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Transfer the lead"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(submitTheData)}>
          <FormInput
            id="date"
            iconLabel={React.cloneElement(icons.calendarWDate, {
              size: 20,
            })}
            label="Date & Time"
            type="datetime-local"
            register={register}
            errors={errors}
            defaultValue={new Date().toISOString().slice(0, 16)}
            max={getDefaultDateTime()}
            min={getDefaultDateTime(2)}
          />
          <Select
            options={employeeList}
            label="Select Employee"
            id="incharge"
            iconLabel={icons.referenceIcon}
            placeholder="Select Employee"
            register={register}
            validation={{
              required: "Incharge is required",
            }}
            errors={errors}
          />
          <TextArea
            id="transfer_reason"
            iconLabel={icons.textarea}
            label="Reason"
            validation={{ required: "Reason is required" }}
            register={register}
            errors={errors}
          />
          <div className="flex gap-3 mt-3">
            <IconButton
              disabled={loading}
              type="button"
              icon={React.cloneElement(icons?.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
            />
            <IconButton
              type="submit"
              icon={React.cloneElement(icons?.saveIcon, { size: "20px" })}
              label="Submit"
              className={`px-4 py-2 `}
              loading={loading}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}

export function SecInchargeDetailEditForm({ leadData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState();
  const dispatch = useDispatch()

  const {
    register,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
    handleSubmit,
  } = useForm();
  useEffect(() => {
    setValue("date", getDefaultDateTime());
    setValue("incharge", leadData?.incharge);
  }, []);
  const toastOnclose = useCallback(() => {
    setToastData({ ...toastData, show: false });
  }, [toastData]);
  const handleModalOpen = () => {
    setIsModalOpen(true);
    setValue("incharge", leadData?.incharge);

  };
  const handleModalClose = () => setIsModalOpen(false);
  useEffect(() => {
    (async () => {
      try {
        let { data } = await getEmployeeListEffect();
        data = data.data.map((list) => ({
          label: list.name,
          value: list.id,
        }));
        setEmployeeList(data);
      } catch (error) {
        setEmployeeList([]);
      }
    })()
  }, [])

  const submitTheData = async (data) => {
    const payload = {
      date: data.date.replace("T", " "),
      uuid: leadData?.uuid,
      type: "secondary",
      ...data
    }

    try {
      const result = await LeadTransferEffect(payload);
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
      setLoading(false);
      setIsModalOpen(false);
      reset();
      // <DetailsCall uuid ={leadData.uuid} />
      const payloads = {
        uuid: leadData.uuid,
        stages: "",
        is_schedule: 0,
      };
      dispatch(setLeadDetailInprogress({ ...payloads }));

      // DetailsCall(leadData.uuid);
    }
  }
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
        tooltipId="edit-lead-transfer-btn"
        icon={React.cloneElement(icons.transferIcon, {
          size: 24,
          style: { transform: "rotate(90deg)" },
        })}
        tooltip="Transfer the lead"
        onClick={handleModalOpen}
        disabled={leadData?.is_closed === 1}

      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Transfer the lead"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(submitTheData)}>
          <FormInput
            id="date"
            iconLabel={React.cloneElement(icons.calendarWDate, {
              size: 20,
            })}
            label="Date & Time"
            type="datetime-local"
            register={register}
            errors={errors}
            defaultValue={new Date().toISOString().slice(0, 16)}
            max={getDefaultDateTime()}
            min={getDefaultDateTime(2)}
          />
          <Select
            options={employeeList}
            label="Select Employee"
            id="incharge"
            iconLabel={icons.referenceIcon}
            placeholder="Select Employee"
            register={register}
            validation={{
              required: "Incharge is required",
            }}
            errors={errors}
          />
          <TextArea
            id="transfer_reason"
            iconLabel={icons.textarea}
            label="Reason"
            validation={{ required: "Reason is required" }}
            register={register}
            errors={errors}
          />
          <div className="flex gap-3 mt-3">
            <IconButton
              disabled={loading}
              type="button"
              icon={React.cloneElement(icons?.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
            />
            <IconButton
              type="submit"
              icon={React.cloneElement(icons?.saveIcon, { size: "20px" })}
              label="Submit"
              className={`px-4 py-2 `}
              loading={loading}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}