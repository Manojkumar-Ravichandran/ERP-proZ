import React, { useCallback, useEffect, useState } from "react";
import IconOnlyBtn from "../../../UI/Buttons/IconOnlyBtn/IconOnlyBtn";
import icons from "../../../contents/Icons";
import Modal from "../../../UI/Modal/Modal";
import { useForm } from "react-hook-form";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import Select from "../../../UI/Select/SingleSelect";
import { InventoryType } from "../../../contents/Inventory/Inventory";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import Button from "../../../UI/Buttons/Button/Button";
import {
  inventoryDetailMaster,
  updateInventoryMaster,
} from "../../../redux/Inventory/Master/MasterAction";
import {
  updateInventoryImageEffect,
  updateInventoryInchargeEffect,
  updateInventoryMasterEffect,
} from "../../../redux/Inventory/Master/MastersEffect";
import { getUnitEffect } from "../../../redux/CRM/lead/LeadEffects.js";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { getEmployeeListEffect } from "../../../redux/common/CommonEffects";
import { getCurrentDate } from "../../../utils/Date.js";
import { getDefaultDate } from "../../../utils/Data.js";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification.jsx";
import FileInput from "../../../UI/Input/FileInput/FileInput.jsx";
export const BasicDataEdit = () => {
  const dispatch = useDispatch();
  const masterDetails = useSelector(
    (state) => state.inventoryMaster?.masterDetail
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState({ show: false });

  const toggleModal = useCallback(() => setIsModalOpen((prev) => !prev), []);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    
  } = useForm({
    defaultValues: {
      name: masterDetails?.name || "",
      inventory_type: masterDetails?.inventory_type || "",
    },
  });

  useEffect(() => {
    if (masterDetails) {
      setValue("name", masterDetails.name);
      setValue("inventory_type", masterDetails.inventory_type);
    }
  }, [masterDetails, setValue]);

  const submitHandler = async (data) => {
    setLoading(true);

    const payload = { ...masterDetails, ...data };

    const result = await updateInventoryMasterEffect(payload);
    setToastData({
      show: true,
      message: result?.data?.message || "Something went wrong",
      status: result?.data?.status === "success" ? "success" : "error",
    });

    if (result?.data?.status === "success") {
      reset();
      dispatch(inventoryDetailMaster({ uuid: masterDetails?.uuid }));
    }

    setLoading(false);
    toggleModal();
  };

  const toastOnclose = () => {
    setToastData({ ...toastData, show: false });
  };

  return (
    <>
      {toastData?.show && (
        <AlertNotification
          show={toastData?.show}
          message={toastData?.message}
          onClose={toastOnclose}
          type={toastData?.status}
        />
      )}

      <IconOnlyBtn
        type="button"
        tooltipId="edit-lead-btn"
        icon={React.cloneElement(icons.editIcon, { size: 24 })}
        tooltip="Edit Inventory Data"
        onClick={toggleModal}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={toggleModal}
        title="Edit Inventory Detail"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="flex flex-col gap-4 mb-4">
            <FormInput
              label="Inventory Name"
              id="name"
              iconLabel={icons.name}
              placeholder="Name"
              register={register}
              validation={{
                required: "Name is required",
                pattern: {
                  value: /^[a-zA-Z\s]*$/,
                  message: "Provide a valid name",
                },
              }}
              errors={errors}
            />

            <Select
              options={InventoryType}
              label="Inventory Type"
              id="inventory_type"
              iconLabel={icons.inventoryIcon}
              placeholder="Select Inventory Type"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
              defaultValues={masterDetails?.inventory_type}
            />
          </div>
          <div className="flex gap-4">
            <Button
              label="Cancel"
              className="btn_cancel"
              onClick={toggleModal}
            />
            <IconButton
              label="Update"
              icon={icons.saveIcon}
              type="submit"
              loading={loading}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export const VolumeDataEdit = () => {
  const masterDetails = useSelector(
    (state) => state.inventoryMaster?.masterDetail
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState({ show: false });
  const handleModalClose = () => setIsModalOpen(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const [unitList, setUnitList] = useState([]);
  const toggleModal = useCallback(() => setIsModalOpen((prev) => !prev), []);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        let { data } = await getUnitEffect();
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

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      width: masterDetails?.width,
      length: masterDetails?.length,
      height: masterDetails?.height,
      unit: masterDetails?.unit,
    },
  });
  useEffect(() => {
    setValue("width", Math.round(masterDetails?.width));
    setValue("length", Math.round(masterDetails?.length));
    setValue("height", Math.round(masterDetails?.height));
    setValue("unit", Math.round(masterDetails?.unit));
    setValue("area_vol", Math.round(masterDetails?.area_vol));
  }, [masterDetails]);

  const length = watch("length") || 0;
  const width = watch("width") || 0;
  const height = watch("height") || 0;

  const area_vol = length * width * height;
  useEffect(() => {
    setValue("area_vol", area_vol);
  }, [length, width, height, area_vol, setValue]);
  const submitHandler = async (data) => {
    setLoading(true);

    const payload = { ...masterDetails, ...data };

    const result = await updateInventoryMasterEffect(payload);
    setToastData({
      show: true,
      message: result?.data?.message || "Something went wrong",
      status: result?.data?.status === "success" ? "success" : "error",
    });

    if (result?.data?.status === "success") {
      reset();
      dispatch(inventoryDetailMaster({ uuid: masterDetails?.uuid }));
    }

    setLoading(false);
    toggleModal();
  };
  const toastOnclose = () => {
    setToastData({ ...toastData, show: false });
  };

  return (
    <>
      {toastData?.show && (
        <AlertNotification
          show={toastData?.show}
          message={toastData?.message}
          onClose={toastOnclose}
          type={toastData?.status}
        />
      )}

      <IconOnlyBtn
        type="button"
        tooltipId="edit-vol-btn"
        icon={React.cloneElement(icons.editIcon, { size: 24 })}
        tooltip="Edit Inventory Volume Details"
        onClick={handleModalOpen}
        // disabled={leadData?.is_closed === 1}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Edit Inventory Volume Detail"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="flex flex-col gap-4 mb-4">
            <FormInput
              label="Width"
              id="width"
              iconLabel={icons.widthScaleIcon}
              placeholder="Enter Width"
              register={register}
              validation={{ required: false }}
              errors={errors}
              showStar={false}
              max={10}
              allowNumbersOnly={true}
            />
            <FormInput
              label="Length"
              id="length"
              iconLabel={icons.lengthScaleIcon}
              placeholder="Enter Length"
              register={register}
              showStar={false}
              validation={{
                required: false,
              }}
              errors={errors}
              max={10}
              allowNumbersOnly={true}
            />
            <FormInput
              label="Height"
              id="height"
              iconLabel={icons.heightScaleIcon}
              placeholder="Enter Height"
              showStar={false}
              register={register}
              validation={{
                required: false,
              }}
              errors={errors}
              max={10}
              allowNumbersOnly={true}
            />
            <Select
              options={unitList}
              label="Unit"
              id="unit"
              iconLabel={icons.unitIcon}
              placeholder="Select Unit"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
              defaultValues={masterDetails?.unit}
            />
            <FormInput
              label="Area Volume"
              id="area_vol"
              iconLabel={icons.alllist}
              placeholder="Area Volume"
              register={register}
              validation={{ required: false }}
              errors={errors}
              disabled
            />
          </div>
          <div className="flex gap-4">
            <Button
              label="Cancel"
              className="btn_cancel"
              onClick={handleModalClose}
            />
            <IconButton
              label="Update"
              icon={icons.saveIcon}
              type="submit"
              loading={loading}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export const LocationDataEdit = () => {
  const masterDetails = useSelector(
    (state) => state.inventoryMaster?.masterDetail
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastData, setToastData] = useState({ show: false });
  const [loading, setLoading] = useState(false);
  const handleModalClose = () => setIsModalOpen(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const [unitList, setUnitList] = useState([]);
  const [mapCoords, setMapCoords] = useState({
    lat: 11.879067,
    lng: 72.456734,
  });
  const [locationName, setLocationName] = useState("");
  const toggleModal = useCallback(() => setIsModalOpen((prev) => !prev), []);
  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: masterDetails?.name,
      inventory_type: masterDetails?.inventory_type,
    },
  });

  useEffect(() => {
    if (masterDetails) {
      setValue("name", masterDetails?.name);
      setValue("inventory_type", masterDetails?.inventory_type);
    }
  }, [masterDetails]);

  useEffect(() => {
    if (masterDetails) {
      setValue("address", masterDetails?.address);
      setValue("latitude", masterDetails?.latitude);
      setValue("longitude", masterDetails?.longitude);
      setValue("location", masterDetails?.location);
      setMapCoords({
        lat: masterDetails?.latitude,
        lng: masterDetails?.longitude,
      });
    }
  }, [masterDetails]);
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMapCoords({ lat, lng });
        getLocationNameFromLatLng(lat, lng).then((name) => {
          setLocationName(name);
          setValue("address", name);
        });
      },
    });
    return mapCoords ? <Marker position={mapCoords} /> : null;
  };

  const getLocationNameFromLatLng = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      return data.display_name || "Location Name Not Found";
    } catch (error) {
      return "Location Name Not Found";
    }
  };

  const submitHandler = async (data) => {
    setLoading(true);

    const payload = {
      ...masterDetails,
      ...data,
      longitude: mapCoords.lng,
      latitude: mapCoords.lat,
    };

    const result = await updateInventoryMasterEffect(payload);
    setToastData({
      show: true,
      message: result?.data?.message || "Something went wrong",
      status: result?.data?.status === "success" ? "success" : "error",
    });

    if (result?.data?.status === "success") {
      reset();
      dispatch(inventoryDetailMaster({ uuid: masterDetails?.uuid }));
    }

    setLoading(false);
    toggleModal();
  };
  const toastOnclose = () => {
    setToastData({ ...toastData, show: false });
  };
  return (
    <>
      {toastData?.show && (
        <AlertNotification
          show={toastData?.show}
          message={toastData?.message}
          onClose={toastOnclose}
          type={toastData?.status}
        />
      )}

      <IconOnlyBtn
        type="button"
        tooltipId="edit-location-btn"
        icon={React.cloneElement(icons.editIcon, { size: 24 })}
        tooltip="Edit Location Data"
        onClick={handleModalOpen}
        // disabled={leadData?.is_closed === 1}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Edit Location Detail"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="flex flex-col gap-4 mb-4">
            <FormInput
              label="LandMark"
              id="location"
              iconLabel={icons.locationIcon}
              placeholder="Select location from map"
              register={register}
              validation={{ required: "Location name is required" }}
              errors={errors}
            />
            <TextArea
              label="Address"
              id="address"
              iconLabel={icons.location}
              placeholder="Select location from map"
              register={register}
              validation={{ required: "Location name is required" }}
              errors={errors}
            />
            <div className="mb-4">
              <label className="block font-semibold mb-2">Location</label>
              <MapContainer
                center={[mapCoords.lat, mapCoords.lng]}
                zoom={13}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <LocationMarker />
              </MapContainer>
              <p className="text-sm text-gray-500 mt-2">
                Click on the map to select a location.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              label="Cancel"
              className="btn_cancel"
              onClick={handleModalClose}
            />
            <IconButton
              label="Update"
              icon={icons.saveIcon}
              type="submit"
              loading={loading}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export const EditIncharge = () => {
  const masterDetails = useSelector(
    (state) => state.inventoryMaster?.masterDetail
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState({ show: false });
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const [employeeList, setEmployeeList] = useState([]);
  const dispatch = useDispatch();
  const toggleModal = useCallback(() => setIsModalOpen((prev) => !prev), []);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm({
    defaultValues: {},
  });

  const submitHandler = async (data) => {
    setLoading(true);
    const payload = {
      ...data,
      uuid: masterDetails?.uuid,
      transfer_date: getDefaultDate(),
    };
    
    const result = await updateInventoryInchargeEffect(payload);
    
    setToastData({
      show: true,
      message: result?.data?.message || "Something went wrong",
      status: result?.data?.status === "success" ? "success" : "error",
    });

    if (result?.data?.status === "success") {
      reset();
      dispatch(inventoryDetailMaster({ uuid: masterDetails?.uuid }));
    }

    setLoading(false);
    toggleModal();
  };
  useEffect(() => {
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
  }, []);
  useEffect(() => {
    if (masterDetails) {
      setValue("incharge", masterDetails?.incharge);
    }
  }, [masterDetails]);
  const toastOnclose = () => {
    setToastData({ ...toastData, show: false });
  };
  return (
    <>
      {toastData?.show && (
        <AlertNotification
          show={toastData?.show}
          message={toastData?.message}
          onClose={toastOnclose}
          type={toastData?.status}
        />
      )}

      <IconOnlyBtn
        type="button"
        tooltipId="edit-incharge-btn"
        icon={React.cloneElement(icons.transferIcon, { size: 24 })}
        tooltip="Modify Inventory Incharge "
        onClick={handleModalOpen}
        // disabled={leadData?.is_closed === 1}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Edit Location Detail"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="flex flex-col gap-4 mb-4">
            <Select
              options={employeeList}
              label="Incharge"
              id="incharge"
              iconLabel={icons.referenceIcon}
              placeholder="Select Employee"
              register={register}
              showStar={true}
              validation={{ required: "Provide Incharge Detaisl" }}
              errors={errors}
            />
            <TextArea
              id="transfer_reason"
              iconLabel={icons.address}
              label="Reason"
              register={register}
              validation={{ required: "Provide Valid reason" }}
              errors={errors}
              placeholder="Enter Address ..."
            />
          </div>
          <div className="flex gap-4">
            <Button
              label="Cancel"
              className="btn_cancel"
              onClick={handleModalClose}
            />
            <IconButton
              label="Update"
              icon={icons.saveIcon}
              type="submit"
              loading={loading}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export const UploadImage = () => {
  const masterDetails = useSelector(
    (state) => state.inventoryMaster?.masterDetail
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastData, setToastData] = useState({ show: false });
  const [previewUrl, setPreviewUrl] = useState(masterDetails?.imageUrl || ""); // Default to existing image

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const imageFile = watch("file_url");
  const [loading, setLoading] = useState(false);
  const handleModalClose = () => setIsModalOpen(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const dispatch = useDispatch();
  useEffect(() => {
    if (imageFile?.[0]) {
      const file = imageFile[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl); // Cleanup old preview URL
    }
  }, [imageFile]);

  const submitHandler = async (data) => {
    // Log the selected file
    const formData = new FormData();
    formData.append("file_url", data.file_url[0]); // Append the selected file to FormData
    formData.append("uuid", masterDetails?.uuid); // Append the selected file to FormData
    const result = await updateInventoryImageEffect(formData);
    

    setToastData({
      show: true,
      message: result?.data?.message || "Something went wrong",
      status: result?.data?.status === "success" ? "success" : "error",
    });

    if (result?.data?.status === "success") {
      setIsModalOpen(false);
      dispatch(inventoryDetailMaster({ uuid: masterDetails?.uuid }));
    }
  };

  return (
    <>
      {toastData?.show && (
        <AlertNotification
          show={toastData.show}
          message={toastData.message}
          onClose={() => setToastData({ ...toastData, show: false })}
          type={toastData.status}
        />
      )}

      <IconOnlyBtn
        type="button"
        tooltipId="edit-inventory-img"
        icon={React.cloneElement(icons.editIcon, { size: 24 })}
        tooltip="Modify Inventory Image"
        onClick={() => setIsModalOpen(true)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Inventory Image"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="flex flex-col gap-4 mb-4">
            {/* Display Current or Uploaded Image */}

            <FileInput
              id="file_url"
              label="File"
              type="file"
              iconLabel={icons.filepin}
              register={register}
              errors={errors}
              accept="image/*"
              showStar={true}
              validation={{ required: "Provide an Image" }}
            />
            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Preview:</p>
                <img
                  src={previewUrl}
                  alt="Inventory"
                  className="w-32 h-32 object-cover border rounded-lg"
                />
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Button
              label="Cancel"
              className="btn_cancel"
              onClick={handleModalClose}
            />
            <IconButton
              label="Update"
              icon={icons.saveIcon}
              type="submit"
              loading={loading}
            />
          </div>
        </form>
        
      </Modal>
    </>
  );
};
