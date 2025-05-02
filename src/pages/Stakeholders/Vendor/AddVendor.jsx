import React, { useEffect, useState } from "react";
import { H5 } from "../../../UI/Heading/Heading";
import Button from "../../../UI/Buttons/Button/Button";
import { useNavigate } from "react-router";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import FormCard from "../../../UI/Card/FormCard/FormCard";
import SubmitBtn from "../../../UI/Buttons/SubmitBtn/SubmitBtn";
import { useForm } from "react-hook-form";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { validationPatterns } from "../../../utils/Validation";
import Select from "../../../UI/Select/SingleSelect";
import { vendorType } from "../../../contents/DropdownList";
import icons from "../../../contents/Icons";

import ToggleSwitch from "../../../UI/Input/ToggleSwitch/ToggleSwitch";
import {
  getAllStateListEffect,
  getAllDistrictListEffect,
} from "../../../redux/common/CommonEffects";
import GeoMap from "../../../UI/GeoLocation/GeoMap/GeoMap";
import { getCurrentLocation } from "../../../utils/location";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../../../redux/common/CommonAction";
import { createVendorInprogress, createVendorInReset } from "../../../redux/Stakeholders/Vendor/VendorAction";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification"
import VendorTypes from "../../../redux/Stakeholders/Vendor/VendorTypes";
export default function AddVendor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [toastData, setToastData ] = useState({show:false});

  const dispatch = useDispatch();
  const currentLocations = useSelector(
    (state) => state.common.location.location
  );
  const {createVendor} = useSelector(state=> state.vendor)

  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Vendor", link: "/user/stakeholders/vendor" },
    { id: 3, label: "Add Vendor" },
  ];

  const {
    register,
    formState: { errors },
    control,
    setValue,
    reset,
    watch,
    handleSubmit,
  } = useForm();
  const isContact = watch("is_contact");
  const contact = watch("contact");
  const state = watch("state");
  useEffect(() => {
    if (currentLocations.length == 0) {
      const currentLocation =  getCurrentLocation();
      
      if (currentLocation.length > 0) {
        dispatch(setLocation({ location: currentLocation, error: false }));
      } else {
        dispatch(setLocation({ location: [], error: true }));
      }
    }
    // dispatch()
  }, []);

  useEffect(()=>{
    reset();
    setLoading(false)
    if(createVendor.success===true){
        setToastData({show:true,message:createVendor?.data.message, type:"success"});
        dispatch(createVendorInReset());
        setTimeout(()=>{
          navigate("/user/stakeholders/vendor");
        },2000)
    }else if(createVendor.error===true){
        setToastData({show:true,message:createVendor?.message, type:"error"});
        dispatch(createVendorInReset());
    }
  },[createVendor]);

  useEffect(() => {
    if (isContact) {
      // Set the whatsapp_contact to lead_contact if is_contact is true
      setValue("whatsapp_contact", contact);
    } else {
      // Clear the whatsapp_contact if is_contact is false
      setValue("whatsapp_contact", "");
    }
  }, [isContact, contact, setValue]);
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

  const addVendorHandler = (data) => {
    setLoading(true);
    const datas ={
      ...data,
      geo_lat:currentLocations[0],
      geo_long:currentLocations[1],
    }
    dispatch(createVendorInprogress({...datas}))
  };
  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
  };

  return (
    <>
     {toastData?.show===true &&<AlertNotification 
        show={toastData?.show} 
        message={toastData?.message} 
        type={toastData?.type} 
        onClose={toastOnclose}

        />}
      <Breadcrumps items={breadcrumbItems} />
      <FormCard title="Add Vendor">
        <form onSubmit={handleSubmit(addVendorHandler)}>
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
            <Select
              options={vendorType}
              label="Vendor Type"
              id="vendor_type"
              placeholder="Select state"
              register={register}
              showStar={false}
              validation={{ required: "Select Your State" }}
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
          <div style={{zIndex:-1}}>
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
          <SubmitBtn label="Add Vendor" loading={loading} />
        </form>

      </FormCard>
    </>
  );
}
