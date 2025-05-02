import React, { useEffect, useRef, useState } from "react";
import icons from "../../../contents/Icons";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import { validateDateTime } from "rsuite/esm/DateInput";
import { useForm } from "react-hook-form";
import Modal from "../../../UI/Modal/Modal";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { validationPatterns } from "../../../utils/Validation";
import Select from "../../../UI/Select/SingleSelect";
import {
  addAddressEffect,
  getAllDistrictListEffect,
  getAllStateListEffect,
} from "../../../redux/common/CommonEffects";
import { useDispatch } from "react-redux";
import {
  getBillingAddressInprogress,
  getShippingAddressInprogress,
} from "../../../redux/Address/AddressAction";

export function AddAddress({ data, type }) {
  const [isAddShippingModal, setIsAddShippingModal] = useState();
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const dispatch = useDispatch();

  const {
    register: billingRegister,
    handleSubmit: billingSubmit,
    control,
    setValue: billingSetValue,
    watch: billingWatch,
    formState: { errors: billingErrors },
  } = useForm();
  const state = billingWatch("state");

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
  const openModel = () => {
    billingSetValue("state", 31);
    setIsAddShippingModal(true);
  };
  const addBillingAddressHandler = async (datas) => {
    const payload = {
      ...datas,
      type,
    };
    const result = await addAddressEffect(payload);
    dispatch(getBillingAddressInprogress({}));
    dispatch(getShippingAddressInprogress({}));
    setIsAddShippingModal(false);
  };
  return (
    <>
      <button
        className="top-clr flex items-center gap-2 "
        style={{ color: "var(--primary-color)" }}
        onClick={openModel}
      >
        {React.cloneElement(icons.plusIcon)} Add Address
      </button>

      <Modal
        size="lg"
        showFooter={false}
        isOpen={isAddShippingModal}
        title={`Add ${type == "billing" ? "Billing" : "Shipping"} Address`}
        onClose={() => setIsAddShippingModal(false)} // Fixed
      >
        <div>
          <>
            <form onSubmit={billingSubmit(addBillingAddressHandler)}>
              <div className="grid gap-3 grid-cols-2">
                <FormInput
                  label="Name"
                  placeholder="Enter Name"
                  register={billingRegister}
                  id="name"
                  errors={billingErrors}
                  validation={{
                    required: "Name is Required",
                    pattern: {
                      value: validationPatterns.textOnly,
                      message: "Provide Valid Name",
                    },
                  }}
                />
                <FormInput
                  label="Contact Number"
                  placeholder="Enter Contact Number"
                  register={billingRegister}
                  id="contact"
                  errors={billingErrors}
                  validation={{
                    required: "Contact Number is Required",
                    pattern: {
                      value: validationPatterns.contactNumber,
                      message: "Provide Valid Contact Number",
                    },
                  }}
                />
                <FormInput
                  label="Door No"
                  placeholder="Enter Door No/Flat No"
                  register={billingRegister}
                  id="door_no"
                  errors={billingErrors}
                  validation={{
                    required: "Door no is Required",
                    pattern: {
                      value: validationPatterns.spacePattern,
                      message: "Provide Valid Door no",
                    },
                  }}
                />
                <FormInput
                  label="Area"
                  placeholder="Enter Area"
                  register={billingRegister}
                  id="area"
                  errors={billingErrors}
                  validation={{
                    required: "Area is Required",
                    pattern: {
                      value: validationPatterns.spacePattern,
                      message: "Provide Valid Area",
                    },
                  }}
                />
                <FormInput
                  label="Landmark"
                  placeholder="Enter Landmark"
                  register={billingRegister}
                  id="landmark"
                  showStar={false}
                  errors={billingErrors}
                  validation={{
                    required: false,
                  }}
                />
                <Select
                  options={stateList}
                  label="State"
                  id="state"
                  placeholder="Select state"
                  register={billingRegister}
                  validation={{ required: "State is required" }}
                  errors={billingErrors}
                />
                {districtList.length > 0 && (
                  <Select
                    options={districtList}
                    label="District"
                    id="district"
                    placeholder="Select District"
                    register={billingRegister}
                    validation={{ required: "District is required" }}
                    errors={billingErrors}
                  />
                )}
                <FormInput
                  label="Pincode"
                  placeholder="Enter Pincode"
                  register={billingRegister}
                  id="pincode"
                  errors={billingErrors}
                  validation={{
                    required: "Pincode is Required",
                    pattern: {
                      value: validateDateTime.pincode,
                      message: "Provide Valid pincode",
                    },
                  }}
                />
              </div>
              <div className="flex  mt-3">
                <IconButton label="Add" icon={icons.plusIcon} type="submit" />
              </div>
            </form>
          </>
        </div>
      </Modal>
    </>
  );
}
