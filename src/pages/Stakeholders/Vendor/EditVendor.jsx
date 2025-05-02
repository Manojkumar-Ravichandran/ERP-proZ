import React, { useEffect, useState } from "react";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import FormCard from "../../../UI/Card/FormCard/FormCard";
import { updateVendorInprogress, updateVendorInReset } from "../../../redux/Stakeholders/Vendor/VendorAction";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { validationPatterns } from "../../../utils/Validation";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import ToggleSwitch from "../../../UI/Input/ToggleSwitch/ToggleSwitch";
import icons from "../../../contents/Icons";
import Select from "../../../UI/Select/SingleSelect";
import SubmitBtn from "../../../UI/Buttons/SubmitBtn/SubmitBtn";
import GeoMap from "../../../UI/GeoLocation/GeoMap/GeoMap";
import { updateMatCategoryInReset } from "../../../redux/Inventory/Material/Category/CategoryAction";
import { getAllDistrictListEffect, getAllStateListEffect } from "../../../redux/common/CommonEffects";



export default function EditVendor() {
  const [loading, setLoading] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [toastData, setToastData] = useState({ show: false });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const initialValues = location?.state || {}; // Initial values from location state
  const [isContact, setIsContact] = useState();

  const currentLocations = useSelector(
    (state) => state.common.location.location
  );
  const {updateVendor} = useSelector(state=> state.vendor)


  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Vendor", link: "/user/stakeholders/vendor" },
    { id: 3, label: "Edit Vendor" },
  ];

  const {
    register,
    formState: { touchedFields,errors },
    control,
    setValue,
    reset,
    watch,
    handleSubmit,
  } = useForm({defaultValues:initialValues});
  const state = watch("state");

  useEffect(() => {
    setIsContact(watch("is_contact")=="true"?true:false);
    if(touchedFields?.is_contact ||touchedFields?.lead_contact){
        if (watch("is_contact")) {
          setValue("whatsapp_contact", watch("contact"));
        } else {
          setValue("whatsapp_contact", initialValues?.whatsapp_contact);
        }

    }else{
         if (watch("is_contact")) {
          setValue("whatsapp_contact", watch("contact"));
        } else {
          setValue("whatsapp_contact", initialValues?.whatsapp_contact);
        }
    }
  }, [watch("is_contact"),watch("contact")]);

  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
  };
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

  useEffect(() => {
    if (stateList.length === 0) {
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
  }, [stateList]);

  useEffect(()=>{
    reset();
    setLoading(false)
    if(updateVendor.success===true){
        setToastData({show:true,message:updateVendor?.data.message, type:"success"});
        dispatch(updateVendorInReset());
        setTimeout(()=>{
          navigate("/user/stakeholders/vendor");
        },2000)
    }else if(updateVendor.error===true){
        setToastData({show:true,message:updateVendor?.message, type:"error"});
        dispatch(updateMatCategoryInReset());
    }
  },[updateVendor]);

  const editVendorHandler = (data) => {
    setLoading(true);
    const datas ={
      ...data,
      geo_lat:currentLocations[0],
      geo_long:currentLocations[1],
    }
    dispatch(updateVendorInprogress({...datas}))
  };
  return (
    <>
      {toastData?.show === true && (
        <AlertNotification
          show={toastData?.show}
          message={toastData?.message}
          type={toastData?.type}
          onClose={toastOnclose}
        />
      )}
      <Breadcrumps items={breadcrumbItems} />
      <FormCard title="Edit Vendor">
        <form onSubmit={handleSubmit(editVendorHandler)}>
          <p className="text-lg text-secondary-300 font-medium flex items-center gap-2">
            General Info
            {React.cloneElement(icons.userHexagonIcon, { size: 20 })}
          </p>
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 mt-2">
            <FormInput
              label="Name"
              placeholder="Enter Name"
              register={register}
              id="name"
              errors={errors}
              validation={{
                required: " name is Required",
                pattern: {
                  value: validationPatterns.textOnly,
                  message: "Provide Valid Name",
                },
              }}
            />
            <FormInput
              label="Contact Number"
              id="contact"
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
            <div className="flex items-center">
              <ToggleSwitch
                id="is_contact"
                label="Same as WhatsApp number"
                register={register}
                validation={{ required: false }}
                errors={errors}
              />
            </div>
            <FormInput
              label="Whatsapp Number "
              id="whatsapp_contact"
              placeholder="Enter your Whatsapp Number"
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
            <FormInput
              label="Email"
              id="email"
              placeholder="Enter your email id"
              register={register}
              validation={{
                required: "Email Id is required",
                pattern: {
                  value: validationPatterns.email,
                  message: "Provide Valid Email Id",
                },
              }}
              errors={errors}
            />
          </div>

          <p className="text-lg text-secondary-300 font-medium flex items-center gap-2 mt-3">
            Location Details
            {React.cloneElement(icons.locationIcon, { size: 20 })}
          </p>

          <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 mt-2">
            <FormInput
              label="Address"
              id="address"
              placeholder="Enter Address"
              register={register}
              validation={{
                required: "Address is required",
                pattern: {
                  value: validationPatterns.spacePattern,
                  message: "Provide Valid Address",
                },
              }}
              errors={errors}
            />

            <Select
              options={stateList}
              label="State"
              id="state"
              placeholder="Select state"
              register={register}
              showStar={false}
              validation={{ required: "Select Your State" }}
              errors={errors}
            />
            {districtList.length > 0 && (
              <Select
                options={districtList}
                label="District"
                id="district"
                placeholder="Select District"
                register={register}
                showStar={false}
                validation={{ required: "Select Your district" }}
                errors={errors}
              />
            )}
            <FormInput
              label="Postal Code"
              id="pincode"
              placeholder="Enter your Pincode"
              register={register}
              validation={{
                required: "Postal Code is required",
                pattern: {
                  value: validationPatterns.pincode,
                  message: "Provide Valid Postal Code",
                },
              }}
              errors={errors}
            />
          </div>
          <div style={{ zIndex: -1 }}>
            <GeoMap />
          </div>

          <p className="text-lg text-secondary-300 font-medium flex items-center gap-2 mt-3">
            Card Details
            {React.cloneElement(icons.cardIcon, { size: 20 })}
          </p>
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 mt-2">
            <FormInput
              label="GST Number"
              placeholder="Enter GST Number"
              register={register}
              id="gst_no"
              upper={true}
              errors={errors}
              validation={{
                required: "GST Number is Required",
                pattern: {
                  value: validationPatterns.gstNo,
                  message: "Provide Valid GST Number",
                },
              }}
            />
            <FormInput
              label="PAN"
              upper={true}
              placeholder="Enter Your PAN"
              register={register}
              id="pan_no"
              errors={errors}
              validation={{
                required: "PAN is Required",
                pattern: {
                  value: validationPatterns.pan,
                  message: "Provide Valid PAN",
                },
              }}
            />
          </div>

          <p className="text-lg text-secondary-300 font-medium flex items-center gap-2 mt-3">
            Contact Person
          </p>
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 mt-2">
            <FormInput
              label="Name"
              placeholder="Enter Contact Person Name"
              register={register}
              id="contact_person"
              errors={errors}
              showStar={false}
              validation={{
                required: false,
              }}
            />
            <FormInput
              label="Email"
              placeholder="Enter Contact  Email"
              register={register}
              id="contact_email"
              errors={errors}
              showStar={false}
              validation={{
                required: false,
              }}
            />
            <FormInput
              label="Contact Number"
              placeholder="Enter Contact Number"
              register={register}
              id="contact_phone"
              errors={errors}
              showStar={false}
              validation={{
                required: false,
              }}
            />
          </div>
          <SubmitBtn label="Edit Vendor" loading={loading} />
        </form>
      </FormCard>
    </>
  );
}
