import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Modal from "../../../../UI/Modal/Modal";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import TextArea from "../../../../UI/Input/TextArea/TextArea";
import IconOnlyBtn from "../../../../UI/Buttons/IconOnlyBtn/IconOnlyBtn";
import icons from "../../../../contents/Icons";
import { localityList } from "../../../../contents/DropdownList";
import { getAllDistrictListEffect, getAllItemListEffect, getAllUnitListEffect } from "../../../../redux/common/CommonEffects";
import { validationPatterns } from "../../../../utils/Validation";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import SearchableSelect from "../../../../UI/Select/SearchableSel";
import Select from "../../../../UI/Select/SingleSelect";
import { LeadProductEffect } from "../../../../redux/CRM/lead/LeadEffects";
import { setLeadDetailInprogress } from "../../../../redux/CRM/lead/LeadActions";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";

export default function EditOtherDetails({leadData}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [districtList, setDistrictList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [referenceType, setReferenceType] = useState("employee");
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [toastData, setToastData] = useState();

  const toastOnclose = useCallback(() => {
    setToastData({ ...toastData, show: false });
  }, [toastData]);

  const leadDetail = useSelector((state) => state?.lead?.leadDetail?.data);
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
      //reset(leadDetail); // Reset form with default lead details
      setValue("product_name", leadDetail.product_name || 12);
      setValue("unit", leadDetail.unit || "16");
  
      if (leadDetail.width) setValue("width", leadDetail.width ||7);
      if (leadDetail.height) setValue("height", leadDetail.height);
      if (leadDetail.length) setValue("length", leadDetail.length);
    }
  }, [leadDetail, reset, setValue]);

  useEffect(()=>{
    if(selectedItem){
      const selectedItemData = itemList?.filter(e=>e.value ==selectedItem);
      setValue("unit",3)
    }
  },[itemList, selectedItem, setValue])
  useEffect(() => {
      (async () => {
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
      })();
    }
  , []);
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

  const handleModalOpen = () => setIsModalOpen(true);
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
            <SearchableSelect
               options={itemList}
               label="Product Name"
               id="product_name"
               iconLabel={icons.roofIcon}
               placeholder="Enter Product Name "
               register={register}
               validation={{
                 required: false,
               }}
               marginClass="mb-1"
               showStar={false}
               errors={errors}
               setValue={setValue}
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
