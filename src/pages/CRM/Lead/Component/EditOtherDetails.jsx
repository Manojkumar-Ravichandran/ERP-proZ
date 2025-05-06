import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Modal from "../../../../UI/Modal/Modal";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import TextArea from "../../../../UI/Input/TextArea/TextArea";
import IconOnlyBtn from "../../../../UI/Buttons/IconOnlyBtn/IconOnlyBtn";
import icons from "../../../../contents/Icons";
import { localityList } from "../../../../contents/DropdownList";
import { getAllDistrictListEffect, getAllItemListEffect, getAllProductListEffect, getAllUnitListEffect, getLeadPurposeEffect, getMaterialDetailEffect } from "../../../../redux/common/CommonEffects";
import { validationPatterns } from "../../../../utils/Validation";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import SearchableSelect from "../../../../UI/Select/SearchableSel";
import Select from "../../../../UI/Select/SingleSelect";
import { LeadProductEffect } from "../../../../redux/CRM/lead/LeadEffects";
import { setLeadDetailInprogress } from "../../../../redux/CRM/lead/LeadActions";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";
import SearchableSelector from "../../../../UI/Select/selectBox";

export default function EditOtherDetails({leadData}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [districtList, setDistrictList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [roofList, setRoofList] = useState([]);
  const [purpose, setPurpose] = useState([]);
  const [referenceType, setReferenceType] = useState("employee");
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [toastData, setToastData] = useState();
  const [selected, setSelected] = useState();
  
  const toastOnclose = useCallback(() => {
    setToastData({ ...toastData, show: false });
  }, [toastData]);

  const leadDetail = useSelector((state) => state?.lead?.leadDetail?.data);
  console.log("leadDetail-->",leadDetail);
  
  const referralList = [
    { value: "social_media", label: "Social Media" },
    { value: "employee", label: "Employee" },
  ];
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm();
  const selectedItem = watch("product_name")

  // Fetch district list when the component mounts
  useEffect(() => {
    if (leadDetail) {
      reset(leadDetail); // Reset form with default lead details
      setValue("product_name", leadDetail.material_details || "");
      setValue("roofing_type", leadDetail.product_name || 6);
      setValue("purpose", leadDetail.lead_purpose || 24);
      setValue("unit", leadDetail.unit || "16");
  
      if (leadDetail.width) setValue("width", leadDetail.width ||7);
      if (leadDetail.height) setValue("height", leadDetail.height);
      if (leadDetail.length) setValue("length", leadDetail.length);
    }
  }, [leadDetail, reset, setValue]);

  useEffect(()=>{
    if (selectedItem && itemList.length) {
      const selectedItemData = itemList.find((e) => e.value === selectedItem);
      if (selectedItemData?.unit) {
        setValue("unit", selectedItemData.unit);
      }
    }
  },[itemList, selectedItem, setValue])
  useEffect(() => {
      (async () => {
        try {
          let { data } = await getMaterialDetailEffect();
          data = data.data.map((list) => ({
            label: list.name,
            value: list.id,
          }));
          setMaterialList(data);
        } catch (error) {
          setMaterialList([]);
        }
        try {
          let { data } = await getAllUnitListEffect();
          data = data.data.map((list) => ({
            label: list.unit_name,
            value: list.id,
          }));
          setUnitList(data);
        } catch (error) {
          setUnitList([]);
        }
      try {
        let { data } = await getAllProductListEffect();
          data = data.data.map((list) => ({
            label: list.product_name,
            value: list.id,
          }));
          setRoofList(data);
      } catch (error) {
        setRoofList([]);
      }
      try {
        let { data } = await getLeadPurposeEffect();
          data = data.data.map((list) => ({
            label: list.name,
            value: list.id,
          }));
          setPurpose(data);
      } catch (error) {
        setPurpose([]);
      }
    })();
    }, []);
  useEffect(() => {
    // if (itemList.length === 0) {
      (async () => {
        try {
          let { data } = await getAllItemListEffect();
          data = data.data.map((list) => ({
            ...list,
            label: list.material_name,
            value: list.id,
          }));
          setItemList(data);
        } catch (error) {
          setItemList([]);
        }
      })();
    }
  , []);

  const fetchDistrictList = async (stateCode = 31) => {
    const { data } = await getAllDistrictListEffect({ state_code: stateCode });
    const formattedDistricts = data.data.map((list) => ({
      label: list.city_name,
      value: list.city_code,
    }));
    setDistrictList(formattedDistricts);
  };

  // const handleModalOpen = () => setIsModalOpen(true);
  const handleModalOpen = () => {
    const waitForOptions = () => {
      const allLoaded =
        materialList.length &&
        roofList.length &&
        unitList.length &&
        purpose.length;
  
      if (allLoaded && leadDetail) {
        setValue("product_name", leadDetail.material_details || "");
        setValue("roofing_type", leadDetail.product_name || "");
        setValue("purpose", leadDetail.lead_purpose || "");
        setValue("unit", leadDetail.unit || "");
        setValue("width", leadDetail.width || "");
        setValue("length", leadDetail.length || "");
        setValue("height", leadDetail.height || "");
        setValue("lead_value", leadDetail.lead_value || "");
        reset(); // This will sync the state properly
        setIsModalOpen(true);
      } else {
        setTimeout(waitForOptions, 100); // retry after delay
      }
    };
  
    waitForOptions();
  };
  
  const handleModalClose = () => setIsModalOpen(false);

  const onSubmits = async(data) => {
    const payload = {
      uuid:leadData?.uuid,
      ...data
    }

    try {
      const result = await LeadProductEffect(payload);
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
    }
      // <DetailsCall uuid ={leadData.uuid} />
      const payloads = {
        uuid: leadData.uuid,
        stages: "",
        is_schedule: 0,
      };
    
      dispatch(setLeadDetailInprogress({ ...payloads }));
  };
  const handleReferenceTypeChange = (selectedOption) => {
    setReferenceType(selectedOption.value); // Update the state
  };
  const handleSelection = (selected) => {
    setSelected(selected);

    // Update form fields with lead's address data if available
    if (selected) {
      setValue("product_name", leadDetail.material_details || "");
      setValue("roofing_type", leadDetail.product_name || ""); 
    }
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
        tooltipId="edit-others-btn"
        icon={icons.editIcon}
        tooltip="Edit Lead Product Details"
        onClick={handleModalOpen}
        disabled={leadDetail.is_closed === 1} 

      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Edit Lead Product Details"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(onSubmits)}>
          <div className="grid  gap-2">

          <SearchableSelector
                errors={errors}
                label="Product Name"
                id="product_name"
                iconLabel={icons.materialToolIcon}
                options={materialList}
                placeholder="Enter Product Name"
                onChange={handleSelection}
                // error={false}
                searchable={true}
                // defaultValue={selectedVendor}
                register={register}
                validation={{ required: false}}
                setValue={setValue}
                defaultid={watch('product_name')}                                            // defaultValue={vendorList?.find((vendor) => vendor?.value === watch('vendor'))} // Match the value
                // defaultValue={watch('product_name')} // Match the value)} // Match the value
            />
            {/* <Select
               options={materialList}
               label="Product Name"
               id="product_name"
               iconLabel={icons.materialToolIcon}
               placeholder="Enter Product Name "
               register={register}
               validation={{
                 required: false,
               }}
               marginClass="mb-1"
               showStar={false}
               errors={errors}
              //  watch={watch}
               value={watch("product_name")}
               setValue={setValue}
            /> */}
            <Select
                  options={roofList}
                  label="Roofing Type"
                  id="roofing_type"
                  iconLabel={icons.roofIcon}
                  placeholder="Select Roofing Type"
                  register={register}
                  validation={{ required: "Roofing Type is Required" }}
                  errors={errors}
                  setValue={setValue}
                  value={watch("roofing_type")}
                />
            <Select
                  options={purpose}
                  label="Purpose"
                  id="purpose"
                  iconLabel={icons.projectIcon}
                  placeholder="Select purpose"
                  register={register}
                  validation={{ required: "Purpose is Required" }}
                  errors={errors}
                  setValue={setValue}
                  value={watch("purpose")}
                />
            <SearchableSelect
                  options={unitList}
                  label="Unit"
                  id="unit"
                  iconLabel={icons.unit}
                  placeholder="Select Unit"
                  register={register}
                  validation={{ required: "Unit is Required" }}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                />

            <FormInput
              label="Width"
              id="width"
              iconLabel={icons.widthScaleIcon}
              placeholder="Enter Width"
              register={register}

              validation={{ required: false }}
              errors={errors}
            />
            <FormInput
                  label="Length"
                  id="length"
                  iconLabel={icons.lengthScaleIcon}
                  placeholder="Enter Length"
                  register={register}
                  validation={{
                    required: false,
                  }}
                  errors={errors}
                />
                <FormInput
                  label="Height"
                  id="height"
                  iconLabel={icons.heightScaleIcon}
                  placeholder="Enter Height"
                  register={register}
                  showStar={false}
                  validation={{
                    required: false,
                  }}
                  errors={errors}
                />

            <FormInput
                label="Value (Rs.)"
                id="lead_value"
                iconLabel={React.cloneElement(icons.moneyIcon,{size:20})}
                placeholder="Enter Value "
                register={register}
                validation={{
                  required: false,
                }}
                errors={errors}
                allowNumbersOnly={true}
              />  
                
                {/* <SearchableSelect
                  options={referralList}
                  label="Referral Source"
                  id="reference_type"
                  iconLabel={icons.socialmedia}
                  placeholder="Select Reference Type"
                  register={register}
                  showStar={false}
                  validation={{ required: false }}
                  errors={errors}
                  onChange={handleReferenceTypeChange}
                  setValue={setValue}
                />
                
                <Select
                  options={referralList}
                  label="Referral Source"
                  id="reference_type"
                  iconLabel={icons.socialmedia}
                  placeholder="Select Reference Type"
                  register={register}
                  showStar={false}
                  validation={{ required: false }}
                  errors={errors}
                  className="mt-2"
                  onChange={handleReferenceTypeChange}
                  defaultValue={referralList.find((option) => option.value === "employee")} 
                /> */}

          </div>
          <div className="flex gap-2 items-center mt-3">
          <IconButton
              type="button"
              icon={React.cloneElement(icons?.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
              onClick ={handleModalClose}
            />
            <IconButton label="Update" icon={icons.saveIcon} type="submit" />
          </div>
        </form>
      </Modal>
    </>
  );
}
