import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Modal from "../../../../UI/Modal/Modal";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import TextArea from "../../../../UI/Input/TextArea/TextArea";
import Select from "../../../../UI/Select/SingleSelect";
import IconOnlyBtn from "../../../../UI/Buttons/IconOnlyBtn/IconOnlyBtn";

import icons from "../../../../contents/Icons";
import { localityList } from "../../../../contents/DropdownList";
import { getAllDistrictListEffect } from "../../../../redux/common/CommonEffects";
import { validationPatterns } from "../../../../utils/Validation";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import SingleCheckbox from "../../../../UI/Input/CheckBoxInput/SingleCheckbox";
import { updateLeadEffect } from "../../../../redux/CRM/lead/LeadEffects";
import { setLeadDetailInprogress } from "../../../../redux/CRM/lead/LeadActions";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";

export default function EditLeadDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [districtList, setDistrictList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastData, setToastData] = useState();
  const dispatch = useDispatch();

  const leadDetail = useSelector((state) => state?.lead?.leadDetail?.data);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm();
  const isContact = watch("is_contact");

  // Fetch district list when the component mounts
  useEffect(() => {
    if (leadDetail) {
      reset(leadDetail); // Reset form values based on lead details
      fetchDistrictList();
    }
  }, [leadDetail, reset]);

  const fetchDistrictList = async (stateCode = 31) => {
    const { data } = await getAllDistrictListEffect({ state_code: stateCode });
    const formattedDistricts = data.data.map((list) => ({
      label: list.city_name,
      value: list.city_code,
    }));
    setDistrictList(formattedDistricts);
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const onSubmits = async (formData) => {
    setIsLoading(true);
    const fieldList = {
      uuid: formData.uuid,
      contact: formData?.lead_contact,
      whatsapp: formData?.whatsapp_contact || null,
      name: formData?.lead_name,
      email: formData.email,
      address: formData?.address,
      locality: formData?.locality,
      landmark: formData?.landmark,
      pincode: formData?.pincode,
      district: formData?.district,
    };
    // Object.keys(fieldList).forEach(key => {
    //   if (formData.hasOwnProperty(key)) {
    //     fieldList[key] = formData[key];
    //   }
    // });

    try {
      const result = await updateLeadEffect(fieldList);
      if (result.data.status === "success") {
        setToastData({
          show: true,
          type: result?.data?.status,
          message: result?.data?.message,
        });
      }
    } catch (error) {
      console.error("Failed to create lead activity:", error);
      setToastData({
        show: true,
        type: error?.data?.status,
        message: error?.data?.message,
      });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      reset();
      // <DetailsCall uuid ={leadData.uuid} />
      const payloads = {
        uuid: leadDetail.uuid,
        stages: "",
        is_schedule: 0,
      };
      dispatch(setLeadDetailInprogress({ ...payloads }));
    }
  };
  const toastOnclose = useCallback(() => {
    setToastData({ ...toastData, show: false });
  }, [toastData]);

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
        tooltipId="edit-lead-btn"
        icon={React.cloneElement(icons.editIcon, { size: 24 })}
        tooltip="Edit Lead Details"
        onClick={handleModalOpen}
        disabled={leadDetail.is_closed === 1}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Edit Lead Details"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(onSubmits)}>
          <div className="grid  gap-3">
            <FormInput
              label="Contact"
              id="lead_contact"
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
              id="lead_name"
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

            <TextArea
              id="address"
              label="Address"
              iconLabel={icons.address}
              placeholder="Enter Address ..."
              register={register}
              validation={{ required: false }}
              errors={errors}
            />

            <Select
              options={localityList}
              label="Village/Town"
              id="locality"
              iconLabel={icons.homeIcon}
              placeholder="Select Village/Town"
              register={register}
              validation={{ required: false }}
              errors={errors}
            />

            <FormInput
              label="Landmark"
              id="landmark"
              iconLabel={icons.locationIcon}
              placeholder="E.g. Near Library"
              register={register}
              validation={{ required: false }}
              errors={errors}
              showStar={false}
            />

            <FormInput
              label="Postal Code"
              id="pincode"
              iconLabel={icons.pincode}
              placeholder="Enter your Pincode"
              register={register}
              validation={{
                required: "Postal Code is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Postal Code must be exactly 6 digits",
                },
              }}
              errors={errors}
            />

            <Select
              options={districtList}
              label="District"
              id="district"
              iconLabel={icons.district}
              placeholder="Select District"
              register={register}
              validation={{ required: false }}
              errors={errors}
              className="mt-2"
            />
          </div>
          <div className="mt-2 flex gap-2">
            <IconButton
              label="Cancel"
              icon={icons.cancelIcon}
              type="button"
              className="btn_cancel"
              onClick={handleModalClose}
            />
            <IconButton label="Update" icon={icons.saveIcon} type="submit" />
          </div>
        </form>
      </Modal>
    </>
  );
}
