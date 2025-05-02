import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import {
  fetchWastageScrub,
  updateWastageScrub,
  deleteWastageScrub,
} from "../../../redux/Inventory/WastageScrub/WastageScrubAction";
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
import {
  getEmployeeListEffect,
  getAllUnitListEffect,
  getAllItemListEffect,
} from "../../../redux/common/CommonEffects";
import Select from "../../../UI/Select/SingleSelect";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import AddWastageScrub from "./AddWastageScrub";
import ModalCenter from "../../../UI/ModalCenter/ModalCenter";
import FileInput from "../../../UI/Input/FileInput/FileInput";
import formatDateForDisplay from "../../../UI/Date/DateDisplay";
import formatDateForInput from "../../../UI/Date/Date";
import SearchBar from "../../../components/SearchBar/SearchBar.jsx";
import { calculateColumnWidth } from "../../../utils/Table.js";
import { max } from "date-fns";
import { wastageScrubImageUploadEffect } from "../../../redux/Inventory/WastageScrub/WastageScrubEffects.js";

const WastageScrubList = () => {
  const dispatch = useDispatch();
  // Redux state
  const {
    inventory = [],
    pagination = {},
    error,
  } = useSelector((state) => state.WastageScrub || {});
  const stockEntryData = inventory?.data || [];
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm();

  const [toastData, setToastData] = useState({ show: false });
  const navigate = useNavigate();
  const [unitList, setUnitList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  // Destructure pagination safely
  const current_page = pagination?.current_page || 1;
  const total_pages = pagination?.last_page || 1;
  const total_items = pagination?.total || 0;

  // Component state
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [paginationCurrentPage, setPaginationCurrentPage] =
    useState(current_page);
  const [searchText, setSearchText] = useState("");
  const [isMasterCreateModal, setIsMasterCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [loading, setLoading] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [fileUrl, setFileUrl] = useState(selectedUser?.photo || null);

  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Wastage Scrap List", link: "" },
  ];
  // Function to fetch inventory master data
  const fetchData = () => {
    
    dispatch(
      fetchWastageScrub({
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

  // Handle page size change
  const handlePageSizeChange = (pageSize) => {
    setPaginationPageSize(pageSize);
    setPaginationCurrentPage(1);
  };

  // Handle search text change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const option = [
    { label: "Edit", action: "edit", icon: icons.pencil },
    // { label: "Delete", action: "delete", icon: icons.deleteIcon },
  ];

  const handleAction = (action, params, master) => {
    setSelectedUser(params.data);

    const {
      uuid,
      id,
      date,
      item_id,
      quantity,
      unit,
      unit_name,
      item_name,
      sales_by,
      sales_by_name,
      sales_to,
      scrap_reason,
      sales_rate,
    } = params?.data || {};

    if (action === "edit" && uuid) {
      setValue("uuid", uuid);
      setValue("date", formatDateForInput(date));
      setValue("item_id", item_id);
      setValue("quantity", quantity);
      setValue("unit", unit);
      setValue("unit_name", unit_name);
      setValue("item_name", item_name);
      setValue("sales_by", sales_by);
      setValue("sales_by_name", sales_by_name);
      setValue("sales_to", sales_to);
      setValue("scrap_reason", scrap_reason);
      setValue("sales_rate", sales_rate);
      setFileUrl(selectedUser?.photo || null); // Set file URL if available

      
      setIsUpdateModal(true);
    } else if (action === "delete" && uuid && id) {
      setSelectedMaster(master);
      setIsDeleteModalOpen(true);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file); // Generate a temporary URL
      setFileUrl(url);
    }
  };

  const columnDefs = [
    {
      headerName: "Item Name",
      field: "item_name",
      unSortIcon: true,
      minWidth: calculateColumnWidth("item_name", stockEntryData),
    },
    {
      headerName: "Quantity",
      field: "quantity",
      unSortIcon: true,
      minWidth: calculateColumnWidth("Quantity", stockEntryData)+50,

      valueFormatter: (params) => {
        const quantity = params.value;
        return quantity !== undefined && quantity !== null
          ? `${quantity} units`
          : " ";
      },
    },
    {
      headerName: "Unit",
      field: "unit_name",
      unSortIcon: true,
      minWidth: calculateColumnWidth("unit_name", stockEntryData),
    },
    {
      headerName: "Date",
      field: "date",
      unSortIcon: true,
      minWidth: calculateColumnWidth("date", stockEntryData),

      valueGetter: (params) => {
        return formatDateForDisplay(params.data.date);
      },
    },
    {
      headerName: "Sales Rate",
      field: "sales_rate",
      unSortIcon: true,
      minWidth: calculateColumnWidth("sales_rate", stockEntryData) + 50,

      valueFormatter: (params) => {
        return `₹${new Intl.NumberFormat("en-IN").format(params.value)}`;
      },
    },
    {
      headerName: "Sales By Name",
      field: "sales_by_name",
      unSortIcon: true,
      minWidth: calculateColumnWidth("sales_by_name", stockEntryData),
    },
    {
      headerName: "File",
      field: "photo",
      unSortIcon: false,
      minWidth: calculateColumnWidth("photo", stockEntryData),
            cellRenderer: (params) => {
        const handleOpenImage = () => {
          if (params?.data?.photo) {
            window.open(params.data.photo, "_blank");
          }
        };

        return (
          <div className="w-full text-center">
            {params?.data?.photo && (
              <button onClick={handleOpenImage} className="top-clr">
                {React.cloneElement(icons?.downloadIcon, { size: 20 })}
              </button>
            )}
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
      setIsUpdateModal(false);
      fetchData();
    } else {
      setToastData({ show: true, message: response.error, type: "error" });
    }
    setLoading(false);
  };
  const updateHandler = (data) => {
    const selectedItem = itemList.find(
      (item) => item.value === Number(data.item_id)
    );
    delete data?.photo;
    dispatch(
      updateWastageScrub({
        ...data,
        uuid: selectedUser?.uuid,
        item_name: selectedItem ? selectedItem.label : "",
        unit_name: selectedItem ? selectedItem.label : "",
        sales_by_name: selectedItem ? selectedItem.label : "",
        callback: async (response) => {
          if (data.file_url.length > 0) {
            await uploadFile(selectedUser.uuid, data.file_url[0]); // Assuming a single file
          } else {
            masterHandler(response);
          }
        },
      })
    );
  };

  const uploadFile = async (uuid, file, response) => {
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
      // masterHandler(response);

      reset();
      setLoading(false);
      setIsUpdateModal(false);
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
    setLoading(false);
  };

  // Function to handle delete confirmation
  const confirmDelete = () => {
    setLoading(true);
    if (selectedMaster) {
      try {
        const result = dispatch(
          deleteWastageScrub({ ...selectedMaster, callback: deleteHandler })
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
  }, []);

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
  const fileUrlWatch = watch("file_url");
  useEffect(() => {
    if (fileUrlWatch) {
      setFileUrl("");
    }
  }, [fileUrlWatch]);
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
          <div className="">
            <SearchBar
              onChange={handleSearchChange}
              value={searchText}
              onClear={() => setSearchText("")}
            />
          </div>
          <div className="flex items-center gap-2">
            <AddWastageScrub onSuccess={handleCreateSuccess} />
            <ExportButton
              label="Export"
              data={stockEntryData}
              filename="Wastage Scrap List"
            />
          </div>
        </div>
      </div>
      <div>
        <ReusableAgGrid
          key={columnDefs.length}
          rowData={stockEntryData}
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
        title="Update Wastage Scrub"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(updateHandler)}>
          <input
            type="hidden"
            {...register("uuid")}
            value={selectedUser?.uuid}
          />
          <div className="flex flex-col gap-y-4">
            <FormInput
              id="date"
              iconLabel={icons.calendarWDate}
              label="Date"
              type="date"
              register={register}
              errors={errors}
              className="w-full"
            />
            <Select
              options={itemList}
              label="Item Name"
              id="item_id"
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
              className="w-full"
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
              className="w-full"
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
            {fileUrl && (
              <div className="mt-4">
                {fileUrl.match(/\.(jpeg|jpg|png|gif)$/) ? (
                  <img
                    src={fileUrl}
                    alt="Uploaded File"
                    className="w-32 h-32 object-cover rounded"
                  />
                ) : fileUrl.match(/\.pdf$/) ? (
                  <iframe
                    src={fileUrl}
                    className="w-48 h-48 border"
                    title="PDF Preview"
                  ></iframe>
                ) : (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View File
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="flex mt-4">
            <IconButton
              label="Update Stock"
              icon={icons.saveIcon}
              type="submit"
              loading={loading}
            />
          </div>
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
    </>
  );
};
export default WastageScrubList;
