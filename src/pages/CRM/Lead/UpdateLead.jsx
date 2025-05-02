import React, { useEffect, useState } from "react";
import SubmitBtn from "../../../UI/Buttons/SubmitBtn/SubmitBtn";
import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import icons from "../../../contents/Icons";
import { validationPatterns } from "../../../utils/Validation";
import ToggleSwitch from "../../../UI/Input/ToggleSwitch/ToggleSwitch";
import Select from "../../../UI/Select/SingleSelect";
import { genderList } from "../../../contents/DropdownList";
import {
  getAllDistrictListEffect,
  getAllStateListEffect,getEmployeeListEffect
} from "../../../redux/common/CommonEffects";
import { useLocation, useNavigate } from "react-router";
import { updateLeadInprogress } from "../../../redux/CRM/lead/LeadActions";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

export default function UpdateLead() {
  const location = useLocation();
  const initialValues = location?.state || {};
  const dispatch = useDispatch();
  const {
    register,
    formState: { touchedFields, errors },
    control,
    setValue,
    watch,
    handleSubmit,
  } = useForm({ defaultValues: initialValues });

  const [toastData, setToastData] = useState();
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [loading, isLoading] = useState();
  const [isContact, setIsContact] = useState();
  const navigate = useNavigate();
  const { lead } = useLocation().state || {}; // The lead data from the previous page
  const [updatedLead, setUpdatedLead] = useState(lead);
  const state = watch("state");
  const leadContact = watch("leadContact");
  const { uuid } = useParams(); 
  const [employeeList, setEmployeeList] = useState([]);

  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Lead", link: "/user/crm/lead/" },
    { id: 3, label: "Lead Detail", link: `/user/crm/lead/detail-lead/${initialValues?.uuid}` },
    { id: 4, label: "Edit Lead" },
  ];


  useEffect(() => {
    if (state) {
      getDistrictList(state);
    }
  }, [state]);

  const getDistrictList = async (state_code) => {
    let { data } = await getAllDistrictListEffect({ state_code });
    data = data.data.map((list) => ({
      label: list.city_name,
      value: list.city_code,
    }));
    setDistrictList(data);
  };
  useEffect(() => { getEmployeeList() });

  const getEmployeeList = async () => {
    let { data } = await getEmployeeListEffect({});
    const formattedData = data.data.map((list) => ({
      label: list.name,
      value: list.id,
    }));
    setEmployeeList(formattedData);
  };
  useEffect(() => {
    setIsContact(watch("is_contact") == "true" ? true : false);
    if (touchedFields?.is_contact || touchedFields?.lead_contact) {
      if (watch("is_contact")) {
        setValue("whatsapp_contact", watch("lead_contact"));
      } else {
        setValue("whatsapp_contact", initialValues?.whatsapp_contact);
      }
    } else {
      if (watch("is_contact")) {
        setValue("whatsapp_contact", watch("lead_contact"));
      } else {
        setValue("whatsapp_contact", initialValues?.whatsapp_contact);
      }
    }
  }, [watch("is_contact"), watch("lead_contact")]);

  useEffect(() => {
    // if (stateList.length === 0) {
      (async () => {
        try {
          let { data } = await getAllStateListEffect();
          data = data.data.map((list) => ({
            label: list.state_name,
            value: list.state_code,
          }));
          setStateList(data);
        } catch (error) {
          setStateList([]);
        }
      })();
    }
  , []);
  
  
  const editLeadHandler = async (data) => {
    const datas = await dispatch(
      updateLeadInprogress({ ...data, callback: leadHandler })
    );
  };

  const leadHandler = (data) => {
    setToastData({ show: true, message: data?.message, type: data?.status });
    navigate(`/user/crm/lead/detail-lead/${initialValues?.uuid}`, { state: { lead: updatedLead } });
  };
  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
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
      <Breadcrumps items={breadcrumbItems} />
      <div className="card rounded shadow-sm my-2 darkCardBg">
        <div className="p-3">
          <form onSubmit={handleSubmit(editLeadHandler)}>
            <p className="text-lg font-medium flex items-center gap-2">General Info</p>
            <div className="grid grid-cols-12  gap-x-4 gap-y-2 mt-2 mb-5">
              {/* Name Field */}
              <div className="col-span-4">
                <FormInput
                  label="Name"
                  id="lead_name"
                  placeholder="Lead Name"
                  register={register}
                  showStar={false}
                  validation={{
                    required: "Lead name is required",
                    pattern: {
                      value: validationPatterns.textOnly,
                      message: "Provide Valid Name",
                    },
                  }}
                  errors={errors}
                />
              </div>

              {/* Email Field */}
              <div className="col-span-4">
                <FormInput
                  label="Email"
                  id="email"
                  placeholder="Enter your email id"
                  register={register}
                  showStar={false}
                  validation={{
                    required: false,
                  }}
                  errors={errors}
                />
              </div>

              {/* Empty Space */}
              <div className="col-span-3"></div>

              {/* Contact Number */}
              <div className="col-span-2">
                <FormInput
                  label="Contact "
                  id="lead_contact"
                  placeholder="Contact Number"
                  register={register}
                  validation={{
                    required: "Contact is required",
                    pattern: {
                      value: validationPatterns.contactNumber,
                      message: "Provide Valid Contact Number",
                    },
                  }}
                  errors={errors}
                />
              </div>
              {/* WhatsApp Number */}
              <div className="col-span-2">
                <FormInput
                  label="WhatsApp"
                  id="whatsapp_contact"
                  placeholder="Enter your WhatsApp Number"
                  register={register}
                  errors={errors}
                  disabled={isContact}
                  validation={{
                    required: "WhatsApp Number is required",
                    pattern: {
                      value: validationPatterns.contactNumber,
                      message: "Provide Valid WhatsApp Number",
                    },
                  }}
                />
              </div>
                 {/* Same as WhatsApp Number Toggle */}
             <div className="col-span-4 grid ">
                <p className="text-gray-500 font-medium mt-2">Same as Contact number</p>
                <ToggleSwitch
                  id="is_contact"
                  label=""
                  register={register}
                  validation={{ required: false }}
                  errors={errors}
                  className=""
                />
              </div>


              {/* Empty Space */}
              <div className="col-span-3"></div>
              <div className="col-span-4">
                <Select
                  options={genderList}
                  label="Gender"
                  id="gender"
                  placeholder="Select Gender"
                  register={register}
                  showStar={false}
                  validation={{ required: "Select Your Gender" }}
                  errors={errors}
                />
              </div>
              <div className="col-span-4 lg:col-span-4">
                <Select
                  options={employeeList}
                  label=""
                  id="incharge"
                  placeholder="Select stage"
                  register={register}
                  showStar={false}
                  validation={{ required: false }}
                  errors={errors}
                />
              </div>
              <div className="col-span-7"></div>

            </div>

            <hr />
            <p className="text-lg font-medium flex items-center gap-2 mt-3">Location Details</p>
            <div className="grid grid-cols-12  gap-x-4 gap-y-2 my-2">
              <div className="col-span-4">
                <FormInput
                  label="Door No"
                  id="door_no"
                  placeholder="Enter Door No / Apartment No"
                  register={register}
                  showStar={false}
                  validation={{
                    required: false,
                  }}
                  errors={errors}
                />
              </div>
              <div className="col-span-4">
                <FormInput
                  label="Street Name"
                  id="street_name"
                  placeholder="Enter Street Name"
                  showStar={false}
                  validation={{ required: false }}
                  errors={errors}
                />
              </div>
              <div className="col-span-4">
              </div>
              <div className="col-span-4">
                <FormInput
                  label="Area"
                  id="area"
                  placeholder="Enter Area"
                  register={register}
                  showStar={false}
                  validation={{
                    required: false,
                  }}
                  errors={errors}
                />
              </div>
              <div className="col-span-4">
                <FormInput
                  label="Landmark"
                  id="main_location"
                  placeholder="E.g. Near Library"
                  register={register}
                  showStar={false}
                  validation={{ required: false }}
                  errors={errors}
                />
              </div>
              <div className="col-span-4">
              </div>
              {/* State and District in the same row */}
              <div className="col-span-4">
                <Select
                  options={stateList}
                  label="State"
                  id="state"
                  placeholder="Select state"
                  register={register}
                  showStar={false}
                  validation={{ required: false }}
                  errors={errors}
                />
              </div>
              <div className="col-span-4">
                {districtList?.length > 0 && (
                  <Select
                    options={districtList}
                    label="District"
                    id="district"
                    placeholder="Select District"
                    register={register}
                    showStar={false}
                    validation={{ required: false }}
                    errors={errors}
                  />
                )}
              </div>
              <div className="col-span-4">
              </div>
              <div className="col-span-4">
                <FormInput
                  label="Postal Code"
                  id="pincode"
                  placeholder="Enter your Pincode"
                  register={register}
                  showStar={false}
                  validation={{
                    required: false,
                  }}
                  errors={errors}
                />
              </div>
            </div>

            <div className="flex justify-start my-3 me-2">
              <SubmitBtn label="Update Lead" loading={loading} />
            </div>
          </form>
          {/* <DevTool control={control} /> */}
        </div>
      </div>
    </>
  );
}