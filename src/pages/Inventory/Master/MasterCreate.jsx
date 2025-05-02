import React, { useState, useEffect } from "react";
import { createInventoryMaster } from "../../../redux/Inventory/Master/MasterAction";
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
import { getEmployeeListEffect } from "../../../redux/common/CommonEffects";
import {getDefaultDate, getDefaultDateTime}from "../../../utils/Data.js"
import { getUnitEffect } from "../../../redux/CRM/lead/LeadEffects.js";
const MasterCreate = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm({defaultValues:{formation_date:getDefaultDate()}});
  const { createMaster } = useSelector((state) => state.master || {});
  const [employeeList, setEmployeeList] = useState([]);
  const [unitList, setUnitList] = useState([]);

  const [mapCoords, setMapCoords] = useState({
    lat: 11.879067,
    lng: 72.456734,
  });
  const [locationName, setLocationName] = useState("");
  const [toastData, setToastData] = useState({ show: false });
  const [loading, setLoading] = useState(false);
  const [isMasterCreateModal, setIsMasterCreateModal] = useState(false);

  // Logs state updates
  
  

  useEffect(() => {
    
    if (createMaster?.success) {
      
      setToastData({
        show: true,
        message: createMaster?.data?.message || "Success",
        type: "success",
      });
      onSuccess();
      reset();
    } else if (createMaster?.error) {
      console.error("Create master error:", createMaster?.error);
      setToastData({
        show: true,
        message: createMaster?.error || "Failed",
        type: "error",
      });
    }
    setLoading(false);
  }, [createMaster, reset, onSuccess]);

  const length = watch("length") || 0;
  const width = watch("width") || 0;
  const height = watch("height") || 0;

  const area_vol = length * width * height;
  useEffect(() => {
    setValue("area_vol", area_vol);
  }, [length, width, height, area_vol, setValue]);

  const addMasterHandler = (data) => {
    const { locationName, ...dataWithoutLocationName } = data;
    
    setLoading(true);
    dispatch(
      createInventoryMaster({
        ...dataWithoutLocationName,
        area_vol,
        latitude: mapCoords.lat,
        longitude: mapCoords.lng,
        callback: masterHandler,
      })
    );
  };

  const masterHandler = (response) => {
    
    if (response.success) {
      setToastData({
        show: true,
        message: response.data.message,
        type: "success",
      });
      setIsMasterCreateModal(false);
      onSuccess?.(); // Call the onSuccess callback
      reset();
    } else {
      setToastData({ show: true, message: response.error, type: "error" });
    }
    setLoading(false);
  };

  const toastOnclose = () => {
    
    setToastData({ ...toastData, show: false });
  };

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
      console.error("Error fetching location name:", error);
      return "Location Name Not Found";
    }
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
  const selectOptions = [
    { value: "primary", label: "Primary" },
    { value: "secondary", label: "Secondary" },
  ];
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
        label="Add Inventory"
        icon={icons.plusIcon}
        onClick={() => setIsMasterCreateModal(true)}
      />
      <Modal
        isOpen={isMasterCreateModal}
        onClose={() => setIsMasterCreateModal(false)}
        title="Add Inventory"
        showHeader
        size="m"
        showFooter={false}
        className="darkCardBg"
      >
        <form onSubmit={handleSubmit(addMasterHandler)}>
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
              options={employeeList}
              label="Incharge"
              id="incharge"
              iconLabel={icons.referenceIcon}
              placeholder="Select Employee"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />
            {/* <TextArea
            id="address"
            iconLabel={icons.address}
            label="Address"
            register={register}
            validation={{ required: false }}
            errors={errors}
            placeholder="Enter Address ..."
          /> */}

            <Select
              options={selectOptions}
              label="Inventory Type"
              id="inventory_type"
              iconLabel={icons.inventoryIcon}
              placeholder="Select Inventory Type"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />
            {/* <FormInput label="Area Volume" id="area_vol" iconLabel={icons.alllist} placeholder="Enter Area Volume ....."
            register={register} validation={{ required: false }} errors={errors} /> */}
            {/* <h6 className="pt-2">Area Volume</h6> */}
            <FormInput
              label="Formation Date"
              id="formation_date"
              iconLabel={icons?.calendarWDate}
              placeholder="Enter Formation Date"
              register={register}
              validation={{ required: "Need Formation Date" }}
              type="date"
              errors={errors}
              showStar={true}
              max={getDefaultDate()}
            />
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
            <FormInput
              label="LandMark"
              id="location"
              iconLabel={icons.locationIcon}
              placeholder="Select location from map"
              register={register}
              validation={{ required: "Location name is required" }}
              errors={errors}
            />
            <FormInput
              label="Pincode"
              id="pincode"
              iconLabel={icons.pincode}
              placeholder="Enter pincode ..."
              register={register}
              validation={{ required: false }}
              errors={errors}
              type="number"
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
          </div>
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
          <IconButton
            label="Add Inventory"
            icon={icons.plusIcon}
            type="submit"
            loading={loading}
          />
        </form>
      </Modal>
    </>
  );
};

export default MasterCreate;
