import React, { useState, useEffect } from "react";
import { createWastageScrub } from "../../../redux/Inventory/WastageScrub/WastageScrubAction";
import { useForm } from "react-hook-form";
import icons from "../../../contents/Icons";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import { useDispatch, useSelector } from "react-redux";
import ModalCenter from "../../../UI/ModalCenter/ModalCenter";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import Select from "../../../UI/Select/SingleSelect";
import FileInput from "../../../UI/Input/FileInput/FileInput";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import formatDateForInput from "../../../UI/Date/Date";
import {
  getAllUnitListEffect,
  getAllItemListEffect,
  getEmployeeListEffect,
} from "../../../redux/common/CommonEffects";
import Modal from "../../../UI/Modal/Modal";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import { wastageScrubImageUploadEffect } from "../../../redux/Inventory/WastageScrub/WastageScrubEffects";
const AddWastageScrub = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm();
  const { createMaster } = useSelector((state) => state.master || {});
  const [toastData, setToastData] = useState({ show: false });
  const [loading, setLoading] = useState(false);
  const [isAddAssetsModal, setIsAddAssetsModal] = useState(false);
  const [unitList, setUnitList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);

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
  }, [createMaster, reset, onSuccess]);

  useEffect(() => {
    if (employeeList.length === 0) {
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
      })();
    }
  }, [employeeList]);
  useEffect(() => {
    if (unitList.length === 0) {
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
  }, [unitList]);

  const fetchItemList = async () => {
    try {
      const { data } = await getAllItemListEffect();
      setItemList(
        data.data.map((list) => ({
          label: list.material_name,
          value: list.id,
        }))
      );
    } catch {
      setItemList([]);
    }
  };
  useEffect(() => {
    if (itemList.length === 0) {
      fetchItemList();
    }
  }, []);

  // Handle Add Master
  const addMasterHandler = (data) => {
    
    const selectedItem = itemList.find(
      (item) => item.value === Number(data.item_id)
    );
    const payload = {
      ...data,
      item_name: selectedItem ? selectedItem.label : "",
    };
    setLoading(true);
    dispatch(
      createWastageScrub({
        ...payload,
        callback: async (response) => {
          // masterHandler(response);
          if (
            response.success &&
            response.data.uuid &&
            data.file_url.length > 0
          ) {
            await uploadFile(response.data.uuid, data.file_url[0]); // Assuming a single file
          }else{
            masterHandler(response);

          }
        },
      })
    );
  };
  const uploadFile = async (uuid, file) => {
    const formData = new FormData();
    formData.append("uuid", uuid);
    formData.append("file_url", file);

    try {
      const response = await wastageScrubImageUploadEffect(formData);
      // if (!response.ok) throw new Error("File upload failed");

      // const result = await response.json();
      // 
      
      setToastData({
        show: true,
        message: "Add Wastage scrap created successfully",
        type: "success",
      });
    } catch (error) {
      console.error("File upload error:", error);
      setToastData({
        show: true,
        message: "File upload failed",
        type: "error",
      });
    } finally {
      reset();
      setLoading(false);
      setIsAddAssetsModal(false);
    }
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

  const toastOnclose = () => {
    setToastData({ ...toastData, show: false });
  };

  const openModalHandler = () => {
    setIsAddAssetsModal(true);
    setValue("date", formatDateForInput(new Date()));
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
        label="Add Wastage"
        icon={icons.plusIcon}
        onClick={openModalHandler}
      />
      <Modal
        isOpen={isAddAssetsModal}
        onClose={() => setIsAddAssetsModal(false)}
        title="Add Wastage Scrap"
        showHeader
        size="m"
        showFooter={false}
        className="darkCardBg"
      >
        <div className="">
          <form onSubmit={handleSubmit(addMasterHandler)}>
            <div className="flex flex-col gap-y-2 ">
              <div>
                <FormInput
                  id="date"
                  iconLabel={icons.calendarWDate}
                  label="Date"
                  type="date"
                  register={register}
                  errors={errors}
                  className="mb-1 w-full"
                />
              </div>
              <Select
                options={itemList}
                label="Item Name"
                id="item_id"
                iconLabel={icons.itemBox}
                placeholder="Select Item"
                register={register}
                errors={errors}
                validation={{ required: "Item Name is Required" }}
                className="mb-1"
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
                className="mb-1 w-full"
              />
              <Select
                options={unitList}
                label="Unit"
                id="unit"
                iconLabel={icons.unitIcon}
                placeholder="Select Unit"
                register={register}
                validation={{ required: "Unit is Required" }}
                errors={errors}
                className="mb-1"
              />
              <FormInput
                label="Sales Rate"
                id="sales_rate"
                type="number"
                iconLabel={icons.moneyIcon}
                placeholder="Enter Quantity"
                register={register}
                validation={{
                  required: "Sales Rate is required",
                  min: { value: 1, message: "Sales Rate must be at least 1" },
                }}
                errors={errors}
                className="w-full"
              />
              <Select
                options={employeeList}
                label="Sales By"
                id="sales_by"
                iconLabel={icons.referenceIcon}
                placeholder="Select Employee"
                register={register}
                validation={{ required: "Sales By Required" }}
                errors={errors}
                className="my-1"
              />
              <FormInput
                id="sales_to"
                iconLabel={React.cloneElement(icons.name, {
                  size: 20,
                })}
                label="Sales To"
                register={register}
                errors={errors}
                validation={{ required: "Sales To is required" }}
                className=" w-full"
              />
              <TextArea
                id="scrap_reason"
                label="Reason"
                iconLabel={icons.note}
                placeholder="Enter Reason ..."
                register={register}
                validation={{ required: "Reason Required" }}
                errors={errors}
              />
              <FileInput
                id="file_url"
                label="Upload File"
                showStar={false}
                iconLabel={React.cloneElement(icons.filepin, { size: 20 })}
                validation={{ required: false }}
                register={register}
                errors={errors}
                accept=".jpg,.png,.pdf"
                multiple={false}
              />
            </div>
            <div className="flex mt-4">
              <IconButton
                label="Add Wastage"
                icon={icons.plusIcon}
                type="submit"
                loading={loading}
              />
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default AddWastageScrub;
