import React, { useState, useEffect } from "react";
import { createAssets } from "../../../redux/Inventory/Assets/AssetsAction";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import icons from "../../../contents/Icons";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Modal from "../../../UI/Modal/Modal";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import Select from "../../../UI/Select/SingleSelect";
import SingleCheckbox from "../../../UI/Input/CheckBoxInput/SingleCheckbox";
import formatDateForInput from "../../../UI/Date/Date";
import { assetItemDropEffect } from "../../../redux/Inventory/Assets/AssetsEffects";
import { arrOptForDropdown, findSpecificIdData, findSpecificIdDatas, getDefaultDate } from "../../../utils/Data";
import { assetTypeList } from "../../../contents/Inventory/Inventory";

const AddAssets = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
  } = useForm({
    defaultValues: {
      quantity: 1,
      asset_array: [],
    },
  });

  const { createMaster } = useSelector((state) => state.master || {});
  const [toastData, setToastData] = useState({ show: false });
  const [loading, setLoading] = useState(false);
  const [isAddAssetsModal, setIsAddAssetsModal] = useState(false);
  const [itemList, setItemList] = useState([]);



  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "assets",
  });

  const quantity = watch("quantity");
  const selectedItem = watch("item_id");
  const isVehicleWatch = watch("is_vehicle", false);
  const isExpireWatch = watch("is_expire", false);
  const [selectedItemData, setSelectedItemData] = useState(null);

  useEffect(() => {
    if (selectedItem) {
      const match = itemList.find((item) => item.value === selectedItem);
      if (match) {
        setSelectedItemData(match);
      }
    }
  }, [selectedItem, itemList]);

  useEffect(() => {
    (async () => {
      const { data } = await assetItemDropEffect();
      if (data?.status === "success") {
        setItemList(arrOptForDropdown(data?.data, "material_name", "id") || []);
      }
    })();
  }, []);

  useEffect(() => {
    if (quantity > fields.length) {
      for (let i = fields.length; i < quantity; i++) {
        append({ vehicle_no: "", serial_no: "", renew_date: "" });
      }
    } else if (quantity < fields.length) {
      for (let i = fields.length - 1; i >= quantity; i--) {
        remove(i);
      }
    }
  }, [quantity]);

  useEffect(() => {
    if (createMaster?.success) {
      setToastData({
        show: true,
        message: createMaster?.data?.message || "Success",
        type: "success",
      });
      onSuccess?.();
      reset();
    } else if (createMaster?.error) {
      setToastData({
        show: true,
        message: createMaster?.error || "Failed",
        type: "error",
      });
    }
    setLoading(false);
  }, [createMaster]);

  const openModalHandler = () => {
    setIsAddAssetsModal(true);
    setValue("date", formatDateForInput(new Date()));
    setValue("renew_date", formatDateForInput(new Date()));
  };

  const toastOnclose = () => {
    setToastData({ ...toastData, show: false });
  };

  const masterHandler = (response) => {
    if (response.success) {
      setToastData({
        show: true,
        message: response.data.message,
        type: "success",
      });
      setIsAddAssetsModal(false);
      onSuccess?.();
      reset();
    } else {
      setToastData({ show: true, message: response.error, type: "error" });
    }
    setLoading(false);
  };

  const addMasterHandler = (data) => {
  
    setLoading(true);
    if(!data?.is_vehicle){
      delete data?.renew_date
    }
    data.is_expire = data?.is_expire? 'yes' : 'no';
    data.is_vehicle = data?.is_vehicle? 'yes' : 'no';
    data.is_depreciation = data?.is_depreciation? 'yes' : 'no';
    if(!data?.is_expire){
      delete data?.renew_date
    }
    dispatch(
      createAssets({
        ...data,
        name:findSpecificIdDatas(itemList, Number(data.item_id))?.label,
        asset_array: data.assets,
        callback: masterHandler,
      })
    );
  };

  return (
    <>
      {toastData.show && (
        <AlertNotification
          type={toastData.type}
          show={toastData.show}
          message={toastData.message}
          onClose={toastOnclose}
        />
      )}
      <IconButton
        label="Add Assets"
        icon={icons.plusIcon}
        onClick={openModalHandler}
      />
      <Modal
        isOpen={isAddAssetsModal}
        onClose={() => setIsAddAssetsModal(false)}
        title="Add Assets"
        showHeader
        size="xxl"
        showFooter={false}
        className="darkCardBg"
      >
        <form onSubmit={handleSubmit(addMasterHandler)}>
          <div className="grid grid-cols-2 gap-4">
            <Select
              options={itemList}
              label="Item Name"
              id="item_id"
              iconLabel={icons.itemBox}
              placeholder="Select Item Name"
              register={register}
              errors={errors}
            />
            <FormInput
              label="Quantity"
              id="quantity"
              type="number"
              iconLabel={icons.BsBoxes}
              placeholder="Enter Quantity"
              register={register}
              validation={{
                required: "Quantity is required",
                min: { value: 1, message: "Quantity must be at least 1" },
              }}
              errors={errors}
            />
            <FormInput
              id="date"
              iconLabel={icons.calendarWDate}
              label="Date"
              type="date"
              register={register}
              errors={errors}
            />
            <Select
              options={assetTypeList}
              label="Asset Type"
              id="asset_type"
              iconLabel={icons.itemBox}
              placeholder="Select Asset Type"
              register={register}
              errors={errors}
            />
            <SingleCheckbox
              id="is_vehicle"
              label="Mark as Vehicle"
              register={register}
              errors={errors}
            />
            <SingleCheckbox
              id="is_depreciation"
              label="Mark as Depreciation"
              register={register}
              errors={errors}
            />
            <SingleCheckbox
              id="is_expire"
              label="Expire"
              register={register}
              errors={errors}
            />
            <TextArea
              id="description"
              showStar={false}
              iconLabel={icons.address}
              label="Description"
              register={register}
              validation={{ required: false }}
              errors={errors}
              placeholder="Enter Address ..."
            />
            <div className="col-span-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="border p-2 rounded-md my-2 relative"
                >
                  <h4 className="font-bold">Asset #{index + 1}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {isVehicleWatch && (
                      <FormInput
                        id={`assets.${index}.vehicle_no`}
                        iconLabel={icons.truckIcon}
                        label="Vehicle No"
                        register={register}
                        validation={{
                          required: isVehicleWatch
                            ? "Vehicle No is required"
                            : false,
                          validate: (value) => {
                            if (!isVehicleWatch || !value?.trim()) return true;
                            const vehicles = watch("assets").map((a) =>
                              a.vehicle_no?.trim()
                            );
                            const duplicates = vehicles.filter(
                              (v) => v === value?.trim()
                            );
                            return duplicates.length > 1
                              ? "Duplicate Vehicle No"
                              : true;
                          },
                        }}
                        errors={{
                          [`assets.${index}.vehicle_no`]:
                            errors?.assets?.[index]?.vehicle_no,
                        }}
                      />
                    )}
                    {/* selectedItemData?.is_trasability && */}
                    {/* !isVehicleWatch && selectedItemData?.is_trasability
                    ? */}
                    {!isVehicleWatch && (
                      <FormInput
                        id={`assets.${index}.serial_no`}
                        iconLabel={icons.barcode}
                        label="Serial Number"
                        register={register}
                        validation={{
                          required: "Serial No is required",
                          validate: (value) => {
                            const serials = watch("assets").map((a) =>
                              a.serial_no?.trim()
                            );
                            const duplicates = serials.filter(
                              (v) => v === value?.trim()
                            );
                            return duplicates.length > 1
                              ? "Duplicate Serial Number"
                              : true;
                          },
                        }}
                        errors={{
                          [`assets.${index}.serial_no`]:
                            errors?.assets?.[index]?.serial_no,
                        }}
                      />
                    )}
                    {isExpireWatch && (
                      <FormInput
                        id={`assets.${index}.renew_date`}
                        iconLabel={icons.calendarWDate}
                        label="Expiry Date"
                        type="date"
                        register={register}
                        min={getDefaultDate()}
                        validation={{
                          required: "Expiry date is required",
                          min: {
                            value: getDefaultDate(),
                            message: "Expiry date cannot be in the past",
                          },
                        }}
                        errors={{
                          [`assets.${index}.renew_date`]:
                            errors?.assets?.[index]?.expiry_date,
                        }}
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-red-500"
                    onClick={() => remove(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
          <IconButton
            label="Add Assets"
            icon={icons.plusIcon}
            type="submit"
            loading={loading}
          />
        </form>
      </Modal>
    </>
  );
};

export default AddAssets;
