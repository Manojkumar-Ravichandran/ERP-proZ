import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import {
  fetchAssets,
  updateAssets,
  deleteAssets,
} from "../../../redux/Inventory/Assets/AssetsAction";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import Pagination from "../../../UI/AgGridTable/Pagination/Pagination";
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import icons from "../../../contents/Icons";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import ExportButton from "../../../UI/AgGridTable/ExportBtn/ExportBtn";
import DateRangePickerComponent from "../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent";
import Modal from "../../../UI/Modal/Modal";
import ActionDropdown from "../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import { useForm } from "react-hook-form";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Select from "../../../UI/Select/SingleSelect";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import AddAssets from "./AddAssets";
import formatDateForDisplay from "../../../UI/Date/DateDisplay";
import formatDateForInput from "../../../UI/Date/Date";
import ModalCenter from "../../../UI/ModalCenter/ModalCenter";
import FileInput from "../../../UI/Input/FileInput/FileInput";
import SingleCheckbox from "../../../UI/Input/CheckBoxInput/SingleCheckbox";
import LendForm from "./LendForm";
import {
  getAllItemListEffect,
  getAllUnitListEffect,
  getAllInventoryMasterListEffect,
  getEmployeeListEffect,
} from "../../../redux/common/CommonEffects";
import { createLendAssets } from "../../../redux/Inventory/Assets/AssetsAction";
import SearchBar from "../../../components/SearchBar/SearchBar";
import { assetTypeList } from "../../../contents/Inventory/Inventory";
import { validationPatterns } from "../../../utils/Validation";

const AssetsList = () => {
  const dispatch = useDispatch();
  // Redux state
  const {
    inventory = [],
    pagination = {},
    error,
  } = useSelector((state) => state.assets || {});
  const assetsData = inventory?.data || [];
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm();
  const [toastData, setToastData] = useState({ show: false });
  const [islendModal, setIslendModal] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const current_page = pagination?.current_page || 1;
  const total_pages = pagination?.last_page || 1;
  const total_items = pagination?.total || 0;
  const { createMaster } = useSelector((state) => state.master || {});
  const [employeeList, setEmployeeList] = useState([]);

  // Component state
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [paginationCurrentPage, setPaginationCurrentPage] =
    useState(current_page);
  const [searchText, setSearchText] = useState("");
  const [dates, setDates] = useState({ startDate: null, endDate: null });
  const [isMasterCreateModal, setIsMasterCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [loading, setLoading] = useState(false);
  const [masterList, setMasterItemList] = useState([]);
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Assets List", link: "" },
  ];
  // Function to fetch inventory master data
  const fetchData = () => {
    dispatch(
      fetchAssets({
        page: paginationCurrentPage,
        per_page: paginationPageSize,
        search: searchText,
      })
    );
  };

  useEffect(() => {
    fetchData();
  }, [paginationCurrentPage, paginationPageSize, searchText]);

  const handleCreateSuccess = () => {
    fetchData();
    setIsMasterCreateModal(false);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page > 0 && page <= total_pages) {
      setPaginationCurrentPage(page);
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
  }, []);
  // Handle page size change
  const handlePageSizeChange = (pageSize) => {
    setPaginationPageSize(pageSize);
    setPaginationCurrentPage(1);
  };

  // Handle search text change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Handle date range change
  const handleDatesChange = ({ startDate, endDate }) => {
    setDates({ startDate, endDate });
  };
  // {React.cloneElement(icons?.widthScaleIcon, { size: 18 })}
  const option = [
    {
      label: "Lend",
      action: "lend",
      icon: React.cloneElement(icons?.lend, { size: 20 }),
    },
    { label: "Edit", action: "edit", icon: icons.pencil },
    { label: "Delete", action: "delete", icon: icons.deleteIcon },
    // <LendForm />
  ];

  const handleAction = (action, e, master) => {
    
    setSelectedUser(e.data);
    const {
      uuid,
      id,
      date,
      description,
      name,
      quantity,
      asset_type,
      renew_date,
      is_expire,
      is_vehicle,
      serial_no,
      vehicle_no,
      is_depreciation,
    } = e?.data || {};
    if (action === "edit" && uuid && id) {
      setValue("date", formatDateForInput(date));
      setValue("name", name);
      setValue("description", description);
      setValue("quantity", quantity);
      setValue("asset_type", asset_type);
      setValue("renew_date", formatDateForInput(renew_date));
      setValue("is_expire", is_expire === "yes" ? true : false);
      setValue("is_vehicle", is_vehicle === "yes" ? true : false);
      setValue("is_depreciation", is_depreciation === "yes" ? true : false);
      setValue("serial_no", serial_no);
      setValue("vehicle_no", vehicle_no);

      setIsUpdateModal(true);
    } else if (action === "delete" && uuid && id) {
      setSelectedMaster(master);
      setIsDeleteModalOpen(true);
    } else if (action === "lend" && uuid && id) {
      
      setIslendModal(true);
      setValue("date", formatDateForInput(new Date()));
      setValue("expiry_date", formatDateForInput(new Date()));
    }
  };
  const columnDefs = [
    { headerName: "Assets Name", field: "name", unSortIcon: true },
    { headerName: "Asset Type", field: "asset_type", unSortIcon: true },
    // { headerName: "Quantity", field: "quantity", unSortIcon: true, },
    {
      headerName: "Date of manufacture",
      field: "date",
      unSortIcon: true,
      valueGetter: (params) => {
        return formatDateForDisplay(params.data.date);
      },
    },
    {
      headerName: "Expiry Date",
      field: "renew_date",
      unSortIcon: true,
      valueGetter: (params) => {
        return formatDateForDisplay(params.data.expiry_date);
      },
    },
    // { headerName: "Renewal Date", field: "renewal", unSortIcon: true, },
    // { headerName: "Inventory Type", field: "inventory_type", unSortIcon: true, },
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
  const isExpireWatch = watch("is_expire");
  const isVehicleWatch = watch("is_vehicle");
  // const isDepreciationWatch = watch("is_depreciation");
  const masterHandler = (response) => {
    
    if (response.success) {
      setToastData({
        show: true,
        message: response.data.message,
        type: "success",
      });
      setIsUpdateModal(false);
      fetchData();
    } else {
      setToastData({ show: true, message: response.error, type: "error" });
    }
    setLoading(false);
  };
  const updateHandler = (data) => {
    if (!data?.is_vehicle) {
      delete data?.renew_date;
    }
    data.is_expire = data?.is_expire ? "yes" : "no";
    data.is_vehicle = data?.is_vehicle ? "yes" : "no";
    data.is_depreciation = data?.is_depreciation ? "yes" : "no";
    dispatch(
      updateAssets({
        ...data,
        uuid: data.uuid,
        callback: masterHandler,
      })
    );
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
    setLoading(false);
  };

  // Function to handle delete confirmation
  const confirmDelete = () => {
    setLoading(true);
    if (selectedMaster) {
      try {
        const result = dispatch(
          deleteAssets({ ...selectedMaster, callback: deleteHandler })
        );
        
      } catch (error) {
        console.error("Error during deletion: ", error);
        setToastData({ show: true, message: "Deletion failed", type: "error" });
      }
    }
  };
  // Function to handle cancel
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const [isChecked, setIsChecked] = useState(false);

  // Toggle checkbox state
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  // /////////////////////////

  useEffect(() => {
      (async () => {
        try {
          const { data } = await getAllInventoryMasterListEffect();
          setMasterItemList(
            data.data.map((list) => ({
              label: list.name,
              value: list.id,
            }))
          );
        } catch {
          setMasterItemList([]);
        }
      })();
  }, []);

  useEffect(() => {
    
    if (createMaster?.success) {
      
      setToastData({
        show: true,
        message: createMaster?.data?.message || "Success",
        type: "success",
      });
      // onSuccess?.();
      reset();
      fetchData();
    } else if (createMaster?.error) {
      console.error("Create master error:", createMaster?.error);
      setToastData({
        show: true,
        message: createMaster?.error || "Failed",
        type: "error",
      });
    }
    setLoading(false);
  }, [createMaster, reset]);

  const addMasterHandler = (data) => {
    setLoading(true);
    dispatch(
      createLendAssets({
        ...data,
        callback: masterHandlers,
      })
    );
  };

  const masterHandlers = (response) => {
    
    if (response.success) {
      setToastData({
        show: true,
        message: response.data.message,
        type: "success",
      });
      setIslendModal(false);
      // onSuccess?.();
      reset();
    } else {
      setToastData({ show: true, message: response.error, type: "error" });
    }
    setLoading(false);
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
      <div className="rounded-lg p-2 my-2 bg-white darkCardBg">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="bg-white py-3 rounded-lg darkCardBg">
        <div className="bg-white rounded-lg pe-3 flex items-center justify-between">
          <div className="flex items-center">
            {/* <div className="flex items-center justify-center p-4">
                            <div className="relative w-full max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchText}
                                    onChange={handleSearchChange}
                                    className="w-full px-4 py-2 pr-10 pl-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3  cursor-pointer" >
                                    {icons.searchIcon}
                                </div>
                            </div>
                        </div> */}
            <SearchBar
              onChange={handleSearchChange}
              value={searchText}
              onClear={() => setSearchText("")}
            />
          </div>
          <div className="flex items-center gap-2">
            <AddAssets onSuccess={handleCreateSuccess} />
            <ExportButton
              label="Export"
              data={assetsData}
              filename="Inventory Master List"
            />
          </div>
        </div>
      </div>
      <div>
        <ReusableAgGrid
          key={columnDefs.length}
          rowData={assetsData}
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
      </div>
      <Modal
        isOpen={isUpdateModal}
        onClose={() => setIsUpdateModal(false)}
        title="Update Assets"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(updateHandler)}>
          <div className="flex flex-col gap-2">
            <input
              type="hidden"
              {...register("uuid")}
              value={selectedUser?.uuid}
            />
            <FormInput
              label="Assets Name"
              id="name"
              iconLabel={icons.name}
              placeholder="Name"
              disabled={true}
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

            <TextArea
              id="description"
              iconLabel={icons.address}
              label="Description"
              register={register}
              validation={{ required: false }}
              errors={errors}
              placeholder="Enter Address ..."
            />
            {/* <lable className="flex items-center gap-2 ">
            <input
              type="checkbox"
              checked={isChecked}
              id="is_expire"
              onChange={handleCheckboxChange}
            />{" "}
            Expiry
          </lable>
          <br /> */}
            <SingleCheckbox
              id="is_vehicle"
              label="Mark as Vehicle"
              register={register}
              errors={errors}
              validation={{
                required: false,
              }}
            />
            <SingleCheckbox
              id="is_expire"
              label="Expire"
              register={register}
              errors={errors}
              validation={{
                required: false,
              }}
            />
            <SingleCheckbox
              id="is_depreciation"
              label="Mark as Depreciation"
              register={register}
              errors={errors}
            />

            <div className="flex flex-col gap-2"></div>
            {isExpireWatch && (
              <FormInput
                id="renew_date"
                iconLabel={icons.calendarWDate}
                label="Expiry Date"
                type="date"
                register={register}
                errors={errors}
              />
            )}
            {isVehicleWatch && (
              <FormInput
                id="vehicle_no"
                iconLabel={icons.truckIcon}
                label="Vehicle No"
                register={register}
                errors={errors}
                validation={{
                  required: isVehicleWatch ? "Vehicle No is required" : false,
                  pattern: {
                    value: validationPatterns.vehicleNumber,
                    message: "Provide Valid Vehicle Number",
                  },
                }}
              />
            )}
            {!isVehicleWatch && (
              <FormInput
                id="serial_no"
                iconLabel={icons.barcode}
                label="Serial Number"
                register={register}
                errors={errors}
                validation={{
                  required: "Serial No is required",
                }}
              />
            )}
          </div>
          {/* <SingleCheckbox
                        id="is_expire"
                        label="Expire"
                        register={register}
                        errors={errors}
                        validation={{
                            required: false,
                        }}
                    />
                    <FormInput
                        id="expiry_date"
                        iconLabel={icons.calendarWDate}
                        label="Expiry Date"
                        type="date"
                        register={register}
                        errors={errors}
                    /> */}
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
      {/* lend form */}
      <Modal
        isOpen={islendModal}
        onClose={() => setIslendModal(false)}
        title="Lend Form"
        showHeader
        size="m"
        showFooter={false}
        className="darkCardBg"
      >
        <form onSubmit={handleSubmit(addMasterHandler)}>
          <input
            type="hidden"
            {...register("uuid")}
            value={selectedUser?.uuid}
          />

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
            options={employeeList}
            label="Lend By"
            id="lend_by"
            iconLabel={icons.itemBox}
            placeholder="Select Employee"
            register={register}
            errors={errors}
            validation={{ required: false }}
            // showStar={false}
          />
          <Select
            options={employeeList}
            label="Lend To"
            id="lend_to"
            iconLabel={icons.itemBox}
            placeholder="Select employee"
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
          <IconButton
            label="Add Lend"
            icon={icons.plusIcon}
            type="submit"
            loading={loading}
          />
        </form>
      </Modal>
    </>
  );
};
export default AssetsList;
