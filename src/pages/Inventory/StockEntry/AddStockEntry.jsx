import React, { useState, useEffect } from "react";
import { createStockEntry } from "../../../redux/Inventory/StockEntry/StockEntryAction";
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
  getAllInventoryMasterListEffect,
} from "../../../redux/common/CommonEffects";
import Modal from "../../../UI/Modal/Modal";
import { stockEntryImageUploadEffect } from "../../../redux/Inventory/StockEntry/StockEntryEffects";
const AddStockEntry = ({ onSuccess }) => {
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
  const [invList, setInvList] = useState([]);

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
  }, []);

  useEffect(() => {
    (async () => {
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
    })();
    (async () => {
      try {
        const { data } = await getAllInventoryMasterListEffect();
        setInvList(
          data.data.map((list) => ({
            label: list.name,
            value: list.id,
          }))
        );
      } catch {
        setInvList([]);
      }
    })();
  }, []);
  const addMasterHandler = (data) => {
    const payload = {
      date: data.date,
      attachment: data.attachment,
      items: [
        {
          quantity: parseInt(data.quantity),
          unit: data.unit,
          item_id: data.item,
          item_name:
            itemList.find((item) => item.value === data.item)?.label || "",
        },
      ],
    };
    setLoading(true);
    dispatch(
      createStockEntry({
        ...payload,
        callback: async (response) => {
          if(
            response?.status=="success" &&
            response?.data.uuid &&
            data?.file_url?.length > 0
          ) {
            await uploadFile(response.data.uuid, data.file_url[0]); // Assuming a single file
          } else {
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
      const response = await stockEntryImageUploadEffect(formData);
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
        label="Add Stock"
        icon={icons.plusIcon}
        onClick={openModalHandler}
      />
      <Modal
        isOpen={isAddAssetsModal}
        onClose={() => setIsAddAssetsModal(false)}
        title="Add Stock"
        showHeader
        size="m"
        showFooter={false}
        className="darkCardBg"
      >
        <form onSubmit={handleSubmit(addMasterHandler)}>
          <div className="flex flex-col gap-y-4">
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> */}

            <Select
              options={invList}
              label="Inventory"
              id="inv_id"
              iconLabel={icons.homeIcon}
              placeholder="Select Inventory"
              register={register}
              errors={errors}
              validation={{ required: "Inventory is Required" }}
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
              options={itemList}
              label="Item Name"
              id="item"
              iconLabel={icons.itemBox}
              placeholder="Select Item"
              register={register}
              errors={errors}
              validation={{ required: "Item Name is Required" }}
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
            <Select
              options={unitList}
              label="Unit"
              id="unit"
              iconLabel={icons.unitIcon}
              placeholder="Select Unit"
              register={register}
              validation={{ required: "Unit is Required" }}
              errors={errors}
            />
            <FileInput
              id="attachment"
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
              label="Add Stock"
              icon={icons.plusIcon}
              type="submit"
              loading={loading}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddStockEntry;
