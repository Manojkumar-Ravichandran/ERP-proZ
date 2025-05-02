import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import icons from "../../../contents/Icons";
import ProfileCircle from "../../../UI/ProfileCircle/ProfileCircle";
import IconWithInfo from "../../CRM/Lead/Component/IconWithInfo";
import ViewHeadingContainer from "../../CRM/Lead/Component/ViewHeadingContainer";
import { findFirstLetter } from "../../../utils/Data";
import { inventoryDetailMaster } from "../../../redux/Inventory/Master/MasterAction";
import {
  BasicDataEdit,
  EditIncharge,
  LocationDataEdit,
  UploadImage,
  VolumeDataEdit,
} from "./MasterDataEdit";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import NonEditableMap from "../../../UI/GeoLocation/NonEditableMap/NonEditableMap";

const MasterSidePanel = () => {
  const { uuid } = useParams();
  const dispatch = useDispatch();
  const masterDetails = useSelector(
    (state) => state.inventoryMaster?.masterDetail
  );
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        
        // setMapCoords({ lat, lng });
        getLocationNameFromLatLng(lat, lng).then((name) => {
          
          // setLocationName(name);
          // setValue("address", name);
        });
      },
    });
    return masterDetails?.latitude && masterDetails?.longitude ? (
      <Marker position={[masterDetails?.latitude, masterDetails?.longitude]} />
    ) : null;
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
    if (uuid) dispatch(inventoryDetailMaster({ uuid }));
  }, [uuid, dispatch]);

  // Volume Details Configuration
  const dimensions = [
    { key: "width", label: "Width", icon: icons?.widthScaleIcon, size: 18 },
    { key: "length", label: "Length", icon: icons?.lengthScaleIcon, size: 22 },
    { key: "height", label: "Height", icon: icons?.heightScaleIcon, size: 22 },
  ];

  // Location Details Configuration
  const locationDetails = [
    { key: "location", label: "Location Name", icon: icons?.locationIcon },
    { key: "address", label: "Address", icon: icons?.district },
  ];

  return (
    <div className="p-3">
      {/* Profile Section */}
      <div className="profile__container flex gap-2 items-start">
        <div className="grow flex">
          <ProfileCircle
            letter={findFirstLetter(masterDetails?.name, 2)}
            bgColor={`#${masterDetails?.colour_code?.trim() || "fff3c4"}`}
          />
          <div className="flex flex-col">
            <span className="text-black-800 text-lg font-bold">
              {masterDetails?.name}
            </span>
            <span className="text-gray-700">
              #{masterDetails?.inventory_type}
            </span>
          </div>
        </div>
        <div className="self-start justify-self-end">
          <BasicDataEdit />
        </div>
      </div>

      {/* Volume Details */}
      <div className="product__container">
        <div className="flex justify-between border-b">
          <ViewHeadingContainer title="Volume Details" />
          <VolumeDataEdit />
        </div>
        <div className="mt-2 bg-white-400 rounded-2xl">
          <div className="grid grid-cols-3 p-3">
            {dimensions.map(({ key, label, icon, size }) => (
              <IconWithInfo
                key={key}
                icon={icon ? React.cloneElement(icon, { size }) : null}
                iconClassName="top-clr"
                label={label}
                contentConClass="flex-col"
                info={
                  masterDetails?.[key]
                    ? `${parseFloat(masterDetails[key]).toFixed(2)} ${
                        masterDetails?.unit_name
                      }`
                    : "N/A"
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="contact__container mt-7">
        <div className="flex justify-between border-b">
          <ViewHeadingContainer title="Location Details" />
          <LocationDataEdit />
        </div>
        <div className="p-3 pb-0">
          {locationDetails.map(({ key, label, icon }) => (
            <IconWithInfo
              key={key}
              icon={icon ? React.cloneElement(icon, { size: 24 }) : null}
              iconClassName="top-clr w-15 h-15"
              iconBgClass="bg-white-400"
              label={label}
              contentConClass="flex-col"
              info={masterDetails?.[key] || "N/A"}
            />
          ))}
        </div>
        <div>
          {masterDetails?.latitude && masterDetails?.longitude && (
            <NonEditableMap
              latitude={masterDetails?.latitude}
              longitude={masterDetails?.longitude}
            />
          )}
        </div>
      </div>

      {/* Incharge Details */}
      <div className="incharge__container mt-1">
        <div className="flex justify-between border-b">
          <ViewHeadingContainer title="Incharge" />
          <EditIncharge />
        </div>
        <div className="pt-2 flex items-center gap-2">
          <ProfileCircle
            letter={findFirstLetter(masterDetails?.incharge_name, 1)}
            bgColor={`#${masterDetails?.colour_code?.trim() || "fff3c4"}`}
          />
          <span className="text-2xl font-semibold">
            {masterDetails?.incharge_name || "N/A"}
          </span>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="gallery mt-5">
        <div className="flex justify-between border-b">
          <ViewHeadingContainer title="Gallery" />
          <UploadImage />
        </div>
        {masterDetails?.photo ? (
          <div className="pt-2 flex items-center gap-2">
            <img
              src={masterDetails?.photo}
              alt="product"
              className="rounded w-full "
            />
          </div>
        ) : (
          <div className="pt-2 flex items-center gap-2">
            {/* <img src={noImage} alt="product" className="w-20 h-20" /> */}
            No inventory images available.
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterSidePanel;
