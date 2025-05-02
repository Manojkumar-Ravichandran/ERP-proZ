import React, { useState, useEffect } from "react";
import { createLendAssets } from "../../../redux/Inventory/Assets/AssetsAction";
import { useForm } from "react-hook-form";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import icons from "../../../contents/Icons";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../UI/Modal/Modal";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import Select from "../../../UI/Select/SingleSelect";
import ModalCenter from "../../../UI/ModalCenter/ModalCenter";
import SingleCheckbox from "../../../UI/Input/CheckBoxInput/SingleCheckbox";
import formatDateForInput from "../../../UI/Date/Date";
import { getAllItemListEffect, getAllUnitListEffect, getAllInventoryMasterListEffect, getEmployeeListEffect } from "../../../redux/common/CommonEffects";
import FileInput from "../../../UI/Input/FileInput/FileInput"

const LendForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { register, formState: { errors }, handleSubmit, setValue, reset } = useForm();
  const { createMaster } = useSelector((state) => state.master || {});
  const [toastData, setToastData] = useState({ show: false });
  const [loading, setLoading] = useState(false);
  const [isAddAssetsModal, setIsAddAssetsModal] = useState(false);
  const [masterList, setMasterItemList] = useState([]);

  useEffect(() => {
    
    if (createMaster?.success) {
      
      setToastData({ show: true, message: createMaster?.data?.message || "Success", type: "success" });
      onSuccess?.();
      reset();
    } else if (createMaster?.error) {
      console.error("Create master error:", createMaster?.error);
      setToastData({ show: true, message: createMaster?.error || "Failed", type: "error" });
    }
    setLoading(false);
  }, [createMaster, reset, onSuccess]);

  const addMasterHandler = (data) => {
    setLoading(true);
    dispatch(
      createLendAssets({
        ...data,
        callback: masterHandler,
      })
    );
  };

  const masterHandler = (response) => {
    
    if (response.success) {
      setToastData({ show: true, message: response.data.message, type: "success" });
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
    setValue("expiry_date", formatDateForInput(new Date()))

  };

  useEffect(() => {
    if (masterList.length === 0) {
      (async () => {
        try {
          const { data } = await getAllInventoryMasterListEffect();
          setMasterItemList(data.data.map((list) => ({
            label: list.name,
            value: list.id
          })));
        } catch {
          setMasterItemList([]);
        }
      })();
    }
  }, [masterList]);
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
      <IconButton label="Lend" icon={React.cloneElement(icons?.lend, { size: 24 })}
       onClick={openModalHandler} />
      <Modal
        isOpen={isAddAssetsModal}
        onClose={() => setIsAddAssetsModal(false)}
        title="Lend Form"
        showHeader
        size="l"
        showFooter={false}
        className="darkCardBg"
      >
        <form onSubmit={handleSubmit(addMasterHandler)}>
          <FormInput
            id="date"
            iconLabel={icons.calendarWDate}
            label="Date"
            type="date"
            register={register}
            errors={errors}
          />
          <FormInput
            id="expiry_date"
            iconLabel={icons.calendarWDate}
            label="Return Date"
            type="date"
            register={register}
            errors={errors}
          />

          <Select
            options={masterList}
            label="Lend By"
            id="lend_by"
            iconLabel={icons.itemBox}
            placeholder="Select Inventory"
            register={register}
            errors={errors}
            validation={{ required: false }}
          // showStar={false}
          />
          <Select
            options={masterList}
            label="Lend To"
            id="lend_to"
            iconLabel={icons.itemBox}
            placeholder="Select Inventory"
            register={register}
            errors={errors}
            validation={{ required: false }}
          // showStar={false}
          />
          <FileInput
            id="lend_asset_photo"
            label="Lend Photo"
            showStar={false}
            iconLabel={React.cloneElement(icons.filepin, { size: 20 })}
            validation={{ required: false }}
            register={register}
            errors={errors}
            accept=".jpg,.png,.pdf"
            multiple={false}
          />
          <IconButton label="Add Lend" icon={icons.plusIcon} type="submit" loading={loading} />
        </form>
      </Modal>
    </>
  );
};
export default LendForm;
