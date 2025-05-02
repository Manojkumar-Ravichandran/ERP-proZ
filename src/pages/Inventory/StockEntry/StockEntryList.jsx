import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import {
  fetchStockEntry,
  updateStockEntry,
  deleteStockEntry,
} from "../../../redux/Inventory/StockEntry/StockEntryAction";
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
import AddStockEntry from "./AddStockEntry";
import ModalCenter from "../../../UI/ModalCenter/ModalCenter";
import FileInput from "../../../UI/Input/FileInput/FileInput";
import formatDateForDisplay from "../../../UI/Date/DateDisplay";
import formatDateForInput from "../../../UI/Date/Date";
import SearchBar from "../../../components/SearchBar/SearchBar";
import '../Master/Master.css'
const StockEntryList = () => {
  const dispatch = useDispatch();
  // Redux state
  const {
    inventory = [],
    pagination = {},
    error,
  } = useSelector((state) => state.stockEntry || {});
  const stockEntryData = inventory?.data || [];
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
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

  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Stock Entry List", link: "" },
  ];
  // Function to fetch inventory master data
  const fetchData = () => {
    dispatch(
      fetchStockEntry({
        page: paginationCurrentPage,
        per_page: paginationPageSize,
        search: searchText,
      })
    );
  };

  useEffect(() => {
    fetchData();
  }, [ paginationCurrentPage, paginationPageSize,searchText]);

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
    { label: "Delete", action: "delete", icon: icons.deleteIcon },
  ];

  const handleAction = (action, e, master) => {
    
    setSelectedUser(e.data);
    const {
      uuid,
      id,
      date,
      attachment,
      item_id,
      quantity,
      unit,
      unit_name,
      material_name,
    } = e?.data || {};

    if (action === "edit" && uuid && id) {
      setValue("uuid", uuid); // Ensure UUID is set in the form
      setValue("date", formatDateForInput(date));
      setValue("attachment", attachment);
      setValue("item_id", item_id);
      setValue("quantity", quantity);
      setValue("unit", unit);
      setValue("unit_name", unit_name);
      setValue("material_name", material_name);

      // Debugging log
      setIsUpdateModal(true);
    } else if (action === "delete" && uuid ) {
      setSelectedMaster(master);
      setIsDeleteModalOpen(true);
    }
  };

  const columnDefs = [
    { headerName: "Item Name", field: "material_name", unSortIcon: true },
    {
      headerName: "Quantity",
      field: "quantity",
      unSortIcon: true,
      valueFormatter: (params) => {
        const quantity = params.value;
        return quantity !== undefined && quantity !== null
          ? `${quantity} units`
          : " ";
      },
    },
    { headerName: "Unit", field: "unit_name", unSortIcon: true },
    {
      headerName: "Date",
      field: "date",
      unSortIcon: true,
      valueGetter: (params) => {
        return formatDateForDisplay(params.data.date);
      },
    },
    {
      headerName: "File",
      field: "photo",
      unSortIcon: false,
      minWidth: 150,
      maxWidth: 100,
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
    dispatch(
      updateStockEntry({
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
          deleteStockEntry({ ...selectedMaster, callback: deleteHandler })
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
            <div className="flex items-center justify-center p-4">
            <SearchBar
              onChange={handleSearchChange}
              value={searchText}
              onClear={() => setSearchText("")}
            />            </div>
          </div>
          <div className="flex items-center gap-2">
            <AddStockEntry onSuccess={handleCreateSuccess} />
            <ExportButton
              label="Export"
              data={stockEntryData}
              filename="Stock Entry List"
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
        title="Update StockEntry"
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
          <div>
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> */}
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
              id="item_id"
              iconLabel={icons.itemBox}
              placeholder="Select Item"
              register={register}
              errors={errors}
              disabled="false"
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
              disabled
            />
            {/* <FileInput
                            id="attachment"
                            label="Upload File"
                            showStar={false}
                            iconLabel={React.cloneElement(icons.filepin, { size: 20 })}
                            validation={{ required: false }}
                            register={register}
                            errors={errors}
                            accept=".jpg,.png,.pdf"
                            multiple={false}
                        /> */}
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
export default StockEntryList;
