import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import {
  fetchInventoryMaster,
  updateInventoryMaster,
  deleteInventoryMaster,
} from "../../../redux/Inventory/Master/MasterAction";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import Pagination from "../../../UI/AgGridTable/Pagination/Pagination";
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import icons from "../../../contents/Icons";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import ExportButton from "../../../UI/AgGridTable/ExportBtn/ExportBtn";
import DateRangePickerComponent from "../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent";
import Modal from "../../../UI/Modal/Modal";
import MasterCreate from "./MasterCreate";
import ActionDropdown from "../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import { useForm } from "react-hook-form";
import SearchBar from "../../../components/SearchBar/SearchBar";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import "./Master.css";
import CardListMaster from "./CardListMaster";
import { getEmployeeListEffect } from "../../../redux/common/CommonEffects";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import Select from "../../../UI/Select/SingleSelect";
import StatusManager from "../../../UI/StatusManager/StatusManager";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MaterialTransferForm from "../MaterialTransfer/MaterialTransferForm";
// Fixing Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MasterList = () => {
  const dispatch = useDispatch();
  // Redux state
  const {
    inventory = [],
    pagination = {},
    error,
  } = useSelector((state) => state.inventoryMaster || {});
  const inventoryData = inventory?.data || [];
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm();
  const [mapCoords, setMapCoords] = useState({ lat: 0, lng: 0 });
  const [locationName, setLocationName] = useState("");
  const [toastData, setToastData] = useState({ show: false });
  const [isMasterUpdateModal, setIsMasterUpdateModal] = useState(false);
  const [isMasterViewModal, setIsMasterViewModal] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const navigate = useNavigate();

  const selectOptions = [
    { value: "primary", label: "Primary" },
    { value: "secondary", label: "Secondary" },
  ];
  // Destructure pagination safely
  const current_page = pagination?.current_page || 1;
  const total_pages = pagination?.last_page || 1;
  const total_items = pagination?.total || 0;

  // Component state
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [paginationCurrentPage, setPaginationCurrentPage] =
    useState(current_page);
  const [searchText, setSearchText] = useState("");
  const [dates, setDates] = useState({ startDate: null, endDate: null });
  const [isMasterCreateModal, setIsMasterCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [loading, setLoading] = useState(false);

  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Inventory List", link: "" },
  ];
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
  // Function to fetch inventory master data
  
  useEffect(() => {
    fetchData();
       
  }, [dispatch, paginationCurrentPage, paginationPageSize]);

  const handleCreateSuccess = () => {
    fetchData();
    setIsMasterCreateModal(false);
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
  // Function to fetch inventory master data
  const fetchData = () => {
    dispatch(
      fetchInventoryMaster({
        page: paginationCurrentPage,
        per_page: paginationPageSize,
      })
    );
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, paginationCurrentPage, paginationPageSize]);

  // Handle date range change
  const handleDatesChange = ({ startDate, endDate }) => {
    setDates({ startDate, endDate });
  };

  const option = [
    // { label: "View", action: "view", icon: icons.viewIcon },
    { label: "Edit", action: "edit", icon: icons.pencil },
    { label: "Delete", action: "delete", icon: icons.deleteIcon },
  ];
  const length = watch("length") || 0;
  const width = watch("width") || 0;
  const height = watch("height") || 0;

  const area_vol = length * width * height;
  useEffect(() => {
    setValue("area_vol", area_vol);
  }, [length, width, height, area_vol, setValue]);

  const handleAction = (action, e, master, callback) => {
    if (!master || !master.latitude || !master.longitude) {
      return;
    }

    
    setSelectedUser(e.data);
    const { uuid, id } = e?.data || {};
    if (action === "edit" && uuid && id) {
      setSelectedMaster(master);
      setMapCoords({
        lat: parseFloat(master.latitude),
        lng: parseFloat(master.longitude),
      });
      setValue("name", master.name);
      setValue("address", master.address);
      setValue("location", master.location);
      setValue("area_vol", master.area_vol);
      // setValue("length",length),
      // setValue("width",width),
      // setValue("height",height),
      setValue("pincode", master.pincode);
      setValue("incharge", master.incharge);
      setValue("inventory_type", master.inventory_type);
      const locationName = master.location.split(",")[0];
      setLocationName(locationName);
      setIsMasterUpdateModal(true);
      if (callback && typeof callback === "function") {
        callback(master);
      }
    } else if (action === "view" && uuid && id) {
      setSelectedMaster(master);
      setIsMasterViewModal(true);
    } else if (action === "delete" && uuid && id) {
      setSelectedMaster(master);
      setIsDeleteModalOpen(true);
    } else {
      console.error("Missing UUID or ID");
    }
  };

  const columnDefs = [
    {
      headerName: "Inventory Name",
      unSortIcon: true,
      cellRenderer: (params) => {
        const uuid = params.data.uuid;
        const Id = params.data.id || "";
        const Name = params.data.name || "";

        return (
          <div>
            <button
              className="text-blue underline capitalize"
              onClick={() =>
                navigate(`/user/Inventory/Master/detail-location/${uuid}`, {
                  state: { Id },
                })
              }
              title="View Lead Details"
            >
              {Name}
            </button>
          </div>
        );
      },
    },
    // { headerName: "Address", field: "address", unSortIcon: true },
    // { headerName: "Location", field: "location", unSortIcon: true, },
    {
      headerName: "Address",
      field: "latitude_longitude",
      unSortIcon: true,
      cellStyle: { textAlign: "center" },
      cellRenderer: (params) => {
        const latitude = params.data.latitude;
        const longitude = params.data.longitude;
        const adrs = params.data.address;
        if (!latitude || !longitude) {
          return "N/A";
        }
        return (
          <button
            className="btn btn-link"
            onClick={() => {
              const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
              window.open(mapUrl, "_blank", "noopener,noreferrer");
            }}
          >
            <span className="text-center text-blue" title="View on Map">
              {adrs}
            </span>
          </button>
        );
      },
    },
    { headerName: "Pincode", field: "pincode", unSortIcon: true },
    {
      headerName: "Area",
      field: "area_vol",
      unSortIcon: true,
      valueGetter: (params) => params?.data?.area_vol,
    },
    { headerName: "Incharge", field: "incharge", unSortIcon: true },
    // { headerName: "Inventory Type", field: "inventory_type", unSortIcon: true, },
    {
      headerName: "Inventory Type",
      field: "inventory_type",
      sortable: false,
      valueGetter: (params) => {
        return params.data?.inventory_type || "";
      },
      cellRenderer: (params) => {
        const statusMapping = {
          primary: "success",
          secondary: "inprogress",
        };
        const status = statusMapping[params.value] || "success";
        return (
          <div className="flex items-center">
            <StatusManager status={status} message={params.value} />
          </div>
        );
      },
    },
    {
      headerName: "Action",
      field: "action",
      sortable: false,
      pinned: "right",
      cellRenderer: (params) => {
        return (
          <div>
            <ActionDropdown
              options={option}
              onAction={(e) => handleAction(e, params, params.data)}
            />
          </div>
        );
      },
    },
  ];

  const masterHandler = (response) => {
    if (response.success) {
      setToastData({
        show: true,
        message: response.data.message,
        type: "success",
      });
      setIsMasterUpdateModal(false);
      fetchData();
      setLoading(false);
    } else {
      setLoading(false);
      setToastData({ show: true, message: response.error, type: "error" });
    }
  };

  const updateMasterHandler = (data) => {
    dispatch(
      updateInventoryMaster({
        ...data,
        // location: locationName,
        latitude: mapCoords.lat,
        longitude: mapCoords.lng,
        uuid: data.uuid,
        callback: masterHandler,
      })
    );
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
      // console.error("Error fetching location name:", error);
      return "Location Name Not Found";
    }
  };

  const toastOnclose = () => {
    setToastData({ ...toastData, show: false });
  };

  // State for modals and selected master
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState(null);

  // Function to handle delete response
  const deleteHandler = (response) => {
    if (response?.success) {
      setToastData({
        show: true,
        message: response.data.message,
        type: "success",
      });
      setIsDeleteModalOpen(false);
      fetchData();
    } else {
      setToastData({
        show: true,
        message: response?.error || "Error deleting item",
        type: "error",
      });
    }
  };
  
  const handlePageChange = (page) => {
    setPaginationCurrentPage(page);
    fetchData();
  };

  const handlePageSizeChange = (pageSize) => {
    setPaginationPageSize(pageSize);
    setPaginationCurrentPage(1);
    fetchData();
  };
  // Function to handle delete confirmation
  const confirmDelete = () => {
    setLoading(true);
    if (selectedMaster) {
      try {
        const result = dispatch(
          deleteInventoryMaster({ ...selectedMaster, callback: deleteHandler })
        );
      } catch (error) {
        setToastData({ show: true, message: "Deletion failed", type: "error" });
      }
    }
  };
  // Function to handle cancel
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };
  
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    if (!e.target.value) setPaginationCurrentPage(1);
  };
  return (
    <div>
      {toastData.show && (
        <AlertNotification
          type={toastData.type}
          show={toastData.show}
          message={toastData.message}
          onClose={toastOnclose}
        />
      )}
      <div className="rounded-lg p-2 my-2 bg-white darkCardBg">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <CardListMaster />
      <div className="bg-white py-3 rounded-lg darkCardBg">
        <div className="bg-white rounded-lg pe-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center p-4">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 pr-10 pl-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3  cursor-pointer">
                  {icons.searchIcon}
                </div>
              </div>
            </div>
            {/* <div>
                            <DateRangePickerComponent
                                className="darkCardBg"
                                startDate={dates.startDate}
                                endDate={dates.endDate}
                                onDatesChange={handleDatesChange}
                            />
                        </div> */}
          </div>
          <div className="flex items-center gap-2">
            {/* <MaterialTransferForm /> */}
            {/* <div className="me-3"> */}
            <MasterCreate onSuccess={handleCreateSuccess} />
            {/* </div>
                        <div> */}
            <ExportButton
              label="Export"
              data={inventoryData}
              filename="Inventory Master List"
            />
            {/* </div> */}
          </div>
        </div>
      </div>
      <ReusableAgGrid
        key={columnDefs.length}
        rowData={inventoryData}
        columnDefs={columnDefs}
        defaultColDef={{ resizable: true }}
        onGridReady={(params) => {
          params.api.sizeColumnsToFit();
        }}
        pagination={false}
      />

      <Pagination
        currentPage={paginationCurrentPage}
        totalPages={total_pages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        startItem={(paginationCurrentPage - 1) * paginationPageSize + 1}
        endItem={Math.min(
          paginationCurrentPage * paginationPageSize,
          total_items
        )}
        totalItems={total_items}
      />
      {/* View Master Modal */}
      <Modal
        isOpen={isMasterViewModal}
        onClose={() => setIsMasterViewModal(false)}
        title="View Master Details"
        showHeader
        size="m"
        className="darkCardBg"
        showFooter={false}
      >
        <div className="space-y-4">
          {/* Master Details */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Details</h3>
            <p className="capitalize">
              <span className="font-semibold">Name:</span>{" "}
              {selectedMaster?.name}
            </p>
            <p>
              <span className="font-semibold">Address:</span>{" "}
              {selectedMaster?.address}
            </p>
            <p>
              <span className="font-semibold">Location:</span>{" "}
              {selectedMaster?.location}
            </p>
            <p>
              <span className="font-semibold">Area:</span>{" "}
              {selectedMaster?.area_vol}
            </p>
            <p>
              <span className="font-semibold">Pincode:</span>{" "}
              {selectedMaster?.pincode}
            </p>
            <p>
              <span className="font-semibold">Incharge:</span>{" "}
              {selectedMaster?.incharge}
            </p>
          </div>

          {/* Map Section */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Map</h3>
            {selectedMaster?.latitude && selectedMaster?.longitude ? (
              <MapContainer
                center={[selectedMaster.latitude, selectedMaster.longitude]}
                zoom={13}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker
                  position={[selectedMaster.latitude, selectedMaster.longitude]}
                >
                  <Popup>
                    Latitude: {selectedMaster.latitude}, Longitude:{" "}
                    {selectedMaster.longitude}
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <p className="text-red-500">
                Latitude and Longitude not available
              </p>
            )}
          </div>
        </div>
      </Modal>

      {/* Update Master Modal */}
      <Modal
        isOpen={isMasterUpdateModal}
        onClose={() => setIsMasterUpdateModal(false)}
        title="Update Inventory"
        showHeader
        size="m"
        className="darkCardBg"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(updateMasterHandler)}>
          {/* Include the UUID field (hidden) */}
          <input
            type="hidden"
            {...register("uuid")}
            value={selectedMaster?.uuid}
          />
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
          />

          <TextArea
            label="Address"
            id="address"
            iconLabel={icons.location}
            placeholder="Location"
            defaultValues={selectedMaster?.location} // Default value
            register={register}
            validation={{
              required: "Location is required",
            }}
            errors={errors}
          />

          {/* Map Section */}
          <div>
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
              <LocationMarker /> {/* Custom component to place a marker */}
            </MapContainer>
            <p className="text-sm text-gray-500 mt-2">
              Click on the map to select a new location.
            </p>
          </div>

          {/* Update Button */}
          <IconButton
            label="Update"
            icon={icons.saveIcon}
            type="submit"
            loading={loading}
          />
        </form>
      </Modal>

      {/* delete */}
      {isDeleteModalOpen && (
        <div className="delete-modal">
          <div className="modal-content-del darkCardBg">
            <div className="flex items-center justify-between">
              <h4>Confirm Delete</h4>
              <button className="modal-close" onClick={cancelDelete}>
                {" "}
                &times;
              </button>
            </div>
            <hr />
            <p className="pt-4">Are you sure you want to delete this item?</p>
            <div className="modal-actions">
              <button
                onClick={confirmDelete}
                className="btn btn-danger"
                loading={loading}
              >
                Yes, Delete
              </button>
              <button onClick={cancelDelete} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MasterList;
