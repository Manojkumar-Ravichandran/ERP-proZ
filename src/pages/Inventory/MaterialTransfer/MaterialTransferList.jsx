import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import {
  fetchMaterialTransfer,
  updateMaterialTransfer,
  deleteMaterialTransfer,
} from "../../../redux/Inventory/MaterialTransfer/MaterialTransferAction";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import Pagination from "../../../UI/AgGridTable/Pagination/Pagination";
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import icons from "../../../contents/Icons";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import Modal from "../../../UI/Modal/Modal";
import ActionDropdown from "../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import { useForm } from "react-hook-form";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Select from "../../../UI/Select/SingleSelect";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import { v4 as uuidv4 } from "uuid";

import {
  getAllItemListEffect,
  getAllUnitListEffect,
  getAllInventoryMasterListEffect,
  getEmployeeListEffect,
} from "../../../redux/common/CommonEffects";
import ModalCenter from "../../../UI/ModalCenter/ModalCenter";
import MaterialTransferForm from "./MaterialTransferForm";
import FileInput from "../../../UI/Input/FileInput/FileInput";
import formatDateForInput from "../../../UI/Date/Date";
import { validationPatterns } from "../../../utils/Validation";
import SearchableSelect from "../../../UI/Select/SearchableSel";
import { formatToINR } from "../../../utils/Rupees";

const MaterialTransferList = () => {
  const dispatch = useDispatch();
  // Redux state
  const {
    inventory = [],
    pagination = {},
    error,
  } = useSelector((state) => state.MaterialTransfer || {});
  const transferData = inventory?.data || [];
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();
  const [toastData, setToastData] = useState({ show: false });
  const navigate = useNavigate();
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
  const [unitList, setUnitList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [masterList, setMasterItemList] = useState([]);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [viewSelectedData, setViewSelectedData] = useState();
  const [isViewModal, setIsViewModal] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Material Transfer", link: "" },
  ];
  const {
    register: itemRegister,
    formState: { errors: itemErrors },
    handleSubmit: itemHandleSubmit,
    reset: itemReset,
    setValue: itemSetValue,
    watch: itemWatch,
  } = useForm();
  const [filteredItemList, setFilteredItemList] = useState([]);
  const [selectedItemList, setSelectedItemList] = useState([]);
  const [totalAmountList, setTotalAmountList] = useState({});
  const [fileUrl, setFileUrl] = useState(selectedUser?.photo || null);

  // Function to fetch inventory master data
  const fetchData = () => {
    dispatch(
      fetchMaterialTransfer({
        page: paginationCurrentPage,
        per_page: paginationPageSize,
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
    { label: "View", action: "view", icon: icons.viewIcon },
    { label: "Edit", action: "edit", icon: icons.pencil },
  ];
  // const formatDateForInput = (date) => {
  //     const d = new Date(date);
  //     return d.toISOString().split('T')[0];
  // };

  const handleAction = (action, e) => {
    setSelectedUser(e.data);
    const {
      uuid,
      id,
      date,
      material_type,
      received_sent_by,
      logistics_type,
      vehicle_no,
      invoice_ref_no,
      attachment,
      item_id,
      quantity,
      unit,
      unit_name,
      material_name,
      trans_from,
      trans_from_name,
      trans_to,
      trans_to_name,
      trans_by,
      trans_by_name,
      transfer_material
    } = e?.data || {};
    if (action === "edit" && uuid && id) {
      // setValue("date", date);
      setValue("date", formatDateForInput(date));

      setValue("trans_from", trans_from);
      setValue("trans_to", trans_to);
      setValue("trans_to_name", trans_to_name);
      setValue("trans_by", trans_by);
      setValue("trans_by_name", trans_by_name);
      setValue("material_type", material_type);
      setValue("received_sent_by", received_sent_by);
      setValue("logistics_type", logistics_type);
      setValue("vehicle_no", vehicle_no);
      setValue("invoice_ref_no", invoice_ref_no);
      setValue("item_id", item_id);
      setValue("quantity", quantity);
      setValue("unit", unit);
      setValue("unit_name", unit_name);
      setValue("material_name", material_name);
      setFileUrl(selectedUser?.photo || null); // Set file URL if available

      setIsUpdateModal(true);
      setSelectedItemList([]);
      transfer_material.map((item) => {
        ItemSubmitHandler(item)
      })
      
    } else if (action === "view" && uuid && id) {
      setViewSelectedData(e.data);
      setIsViewModal(true);
    }
  };

  const materialType = [
    { label: "Purchase", value: "purchase" },
    { label: "Sale", value: "sale" },
    { label: "Inter Transfer", value: "inter_transfer" },
    { label: "Return", value: "return" },
  ];
  const logisticsType = [
    { label: "Own", value: "own" },
    { label: "Parcel", value: "parcel" },
    { label: "Vendor", value: "vendor" },
  ];
  const columnDefs = [
    // { headerName: "Item Name", field: "material_name", unSortIcon: true, },
    // { headerName: "Quantity", field: "quantity", unSortIcon: true, },
    { headerName: "Date", field: "date", unSortIcon: true },
    { headerName: "Transfer From", field: "trans_from_name", unSortIcon: true },
    { headerName: "Transfer To", field: "trans_to_name", unSortIcon: true },
    { headerName: "Transfer By", field: "trans_by_name", unSortIcon: true },
    { headerName: "Vehicle No", field: "vehicle_no", unSortIcon: true },
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
  const ViewcolumnDefs = [
    // { headerName: "Item Name", field: "material_name", unSortIcon: true, },
    // { headerName: "Quantity", field: "quantity", unSortIcon: true, },
    { headerName: "Item Name", field: "item_name", unSortIcon: false },
    { headerName: "Quantity", field: "quantity", unSortIcon: false },
    { headerName: "Unit", field: "unit_name", unSortIcon: false },
   
  ];

  const resetData = () => {
    fetchData();
      itemReset()
      setSelectedItemList([]);
      setFilteredItemList([...itemList]);
      setSelectedUser(null);
  }
  const masterHandler = (response) => {
    
    if (response.success) {
      setToastData({
        show: true,
        message: response.data.message,
        type: "success",
      });
      setIsUpdateModal(false);
      fetchData();
      itemReset()
      setSelectedItemList([]);
      setFilteredItemList([...itemList]);
      setSelectedUser(null);
    } else {
      setToastData({ show: true, message: response.error, type: "error" });
    }
  };
  const updateHandler = (data) => {
    dispatch(
      updateMaterialTransfer({
        ...data,
        uuid: selectedUser.uuid,
        items: selectedItemList.map((item) => ({
          m_uuid:item?.m_uuid,
          quantity: item.quantity,
          unit: item.unit,
          item_name: item.material_name,
          item_id: item.id,
        })),
        callback: masterHandler,
      })
    );
  };

  const toastOnclose = () => {
    setToastData({ ...toastData, show: false });
  };

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
              ...list,
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
  const ItemSubmitHandler = (data) => {
    
    const selectedItem = itemList.find(
      (item) => Number(item.value) === Number(data.item_id)
    );

    if (!selectedItem) {
      console.error("Selected item not found");
      return;
    }
    

    const withoutTaxCost = data.quantity * selectedItem.comp_cost;
    const taxAmount = (withoutTaxCost * selectedItem.gst_percentage) / 100;
    const totalCost = withoutTaxCost + taxAmount;

    const newItem = {
      ...data,
      id: selectedItem.id,
      material_name: selectedItem?.material_name,
      u_id: uuidv4(),
      name: selectedItem.label,
      hsn_code: selectedItem.hsn_code,
      cost: selectedItem.comp_cost,
      gst_percentage: selectedItem.gst_percentage,
      without_tax_cost: withoutTaxCost,
      tax_amount: taxAmount,
      total_cost: totalCost,
    };
    

    setSelectedItemList((prevList) => [...prevList, newItem]);
    itemReset();
    setValue("quantity", 1);
  };
  const selectedMaterialId = itemWatch("item_id");
  useEffect(() => {
    if (selectedMaterialId) {
      // Find the corresponding unit for the selected material
      const selectedMaterial = filteredItemList.find(
        (item) => item.id === selectedMaterialId
      );
      

      if (selectedMaterial) {
        itemSetValue("unit", selectedMaterial.unit); // Dynamically set the `unit` value
      } else {
        itemSetValue("unit", ""); // Reset if no material is selected
      }
    }
  }, [selectedMaterialId, filteredItemList]);
  const handleInputChange = (e, index, field) => {
    const { value } = e.target;

    setSelectedItemList((prevList) => {
      const updatedList = [...prevList];
      updatedList[index] = {
        ...updatedList[index],
        [field]:
          field === "unit" || field === "quantity" ? Number(value) : value, // Convert `unit` and `quantity` to numbers if needed
      };

      // Update calculations if quantity or unit is changed
      if (field === "quantity" || field === "unit") {
        const { quantity, cost, gst_percentage } = updatedList[index];
        const withoutTaxCost = quantity * cost;
        const taxAmount = (withoutTaxCost * gst_percentage) / 100;
        const totalCost = withoutTaxCost + taxAmount;

        // Update the calculated fields
        updatedList[index].without_tax_cost = withoutTaxCost;
        updatedList[index].tax_amount = taxAmount;
        updatedList[index].total_cost = totalCost;
      }

      return updatedList;
    });
  };
  useEffect(() => {
    if (selectedItemList?.length > 0) {
      setTotalAmountList(calculateTotalAmount());
      const idsToRemove = selectedItemList.map((item) => item.id);

      const updatedItemList = itemList.filter(
        (item) => !idsToRemove.includes(item.id)
      );
      setFilteredItemList(updatedItemList);
    } else {
      setFilteredItemList([...itemList]);
    }
  }, [selectedItemList, itemList]);
  const calculateTotalAmount = () => {
    if (selectedItemList.length === 0)
      return { totalAmount: 0, totalTaxAmount: 0, totalWithoutTaxAmount: 0 };
    return selectedItemList.reduce(
      (totals, item) => ({
        totalAmount: totals.totalAmount + item.total_cost,
        totalTaxAmount: totals.totalTaxAmount + item.tax_amount,
        totalWithoutTaxAmount:
          totals.totalWithoutTaxAmount + item.without_tax_cost,
      }),
      { totalAmount: 0, totalTaxAmount: 0, totalWithoutTaxAmount: 0 }
    );
  };

  const handleDeleteItem = (index) => {
    setSelectedItemList((prevList) => prevList.filter((_, i) => i !== index));
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
      <div className="flex justify-end">
        <MaterialTransferForm onSuccess={handleCreateSuccess} />
      </div>
      <div>
        <ReusableAgGrid
          key={columnDefs.length}
          rowData={transferData}
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
        title="Update Material Transfer"
        showHeader
        size="xxl"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(updateHandler)}>
          <input
            type="hidden"
            {...register("uuid")}
            value={selectedUser?.uuid}
          />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              id="date"
              iconLabel={icons.calendarWDate}
              label="Date"
              type="datetime-local"
              register={register}
              errors={errors}
            />
            <Select
              options={masterList}
              label="From"
              id="trans_from"
              iconLabel={icons.itemBox}
              placeholder="Select From Inventorty"
              register={register}
              errors={errors}
              validation={{ required: "From Inventorty Required" }}
              disabled={true}
            />
            <Select
              options={masterList}
              label="To"
              id="trans_to"
              iconLabel={icons.itemBox}
              placeholder="Select To Inventorty"
              register={register}
              errors={errors}
              validation={{ required: "To Inventorty Required" }}
              disabled={true}

            />
            <Select
              options={employeeList}
              label="Transfer By"
              id="trans_by"
              iconLabel={icons.referenceIcon}
              placeholder="Select Transfer By"
              register={register}
              showStar={false}
              validation={{ required: "Transfer By Required" }}
              errors={errors}
              disabled={true}

            />

            {/* <Select
              options={materialType}
              label="Material Type"
              id="material_type"
              iconLabel={icons.itemBox}
              placeholder="Select material type"
              register={register}
              errors={errors}
              validation={{ required: "Material Type Required" }}
              disabled={true}

            /> */}
            <Select
              options={logisticsType}
              label="Logistics Type"
              id="logistics_type"
              iconLabel={icons.truck}
              placeholder="Select Logistic type"
              register={register}
              errors={errors}
              validation={{ required: "Logistics Type Required" }}
            />
            <FormInput
              label="Vehicle Number"
              id="vehicle_no"
              iconLabel={icons.vehicle}
              placeholder="Enter Vehicle Number"
              register={register}
              upper={true}
              validation={{
                required: "Vehicle Number is required",
                pattern: {
                  value: validationPatterns.vehicleNumber,
                  message: "Provide Valid Vehicle Number",
                },
              }}
              errors={errors}
            />

            {/* <FormInput
              label="Invoice Reference No"
              id="invoice_ref_no"
              iconLabel={icons.invoice}
              placeholder="Enter Invoice Reference Number"
              register={register}
              validation={{ required: "Invoice Reference Number is required" }}
              errors={errors}
            /> */}
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

          {/* Centered submit button */}
         
        </form>
        <div>
            <form onSubmit={itemHandleSubmit(ItemSubmitHandler)}>
              <div className="grid grid-cols-5 gap-3 my-3 justify-between content-end ">
                <div className="col-span-2">
                  <SearchableSelect
                    options={filteredItemList}
                    label="Item Name"
                    id="item_id"
                    className="w-50"
                    placeholder="Select Item"
                    register={itemRegister}
                    errors={itemErrors}
                    validation={{ required: "Item is Required" }}
                    showStar={true}
                    setValue={itemSetValue}
                  />
                </div>
                <FormInput
                  label="Quantity"
                  type="number"
                  placeholder="Enter Quantity"
                  register={itemRegister}
                  errors={itemErrors}
                  id="quantity"
                  validation={{
                    required: "Quantity is Required",
                    pattern: {
                      value: validationPatterns.numberOnly,
                      message: "Provide Valid Quantity",
                    },
                  }}
                />
                <Select
                  options={unitList}
                  label="Unit"
                  id="unit"
                  className="w-full"
                  placeholder="Select Unit"
                  register={itemRegister}
                  errors={itemErrors}
                  validation={{ required: "Unit is Required" }}
                  disabled={true}
                />
                <div className="flex items-center pt-4">
                  <IconButton
                    label="Add Item"
                    type="submit"
                    className="h-8"
                    icon={icons.plusIcon}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="item-list__table__container overflow-auto max-w-full">
            <table className="item-list__table overflow-auto table-auto w-full border border-collapse ">
              <thead>
                <tr>
                  <th style={{ width: "3%" }}>SI.no</th>
                  <th>Item Name</th>
                  <th>HSN code</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Amount/per unit (Rs.)</th>
                  <th>Without Tax Amount</th>
                  <th>Tax Amount</th>
                  <th>Total Amount (Rs.)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedItemList.length > 0 && (
                  <>
                    {selectedItemList.map((item, index) => (
                      <tr key={item.u_id}>
                        <td style={{ width: "3%" }}>{index + 1}</td>
                        <td style={{ width: "40%" }}>{item.name}</td>
                        <td style={{ width: "5%" }}>{item.hsn_code}</td>
                        <td style={{ width: "10%" }}>
                          <input
                            type="number"
                            value={item.quantity || ""}
                            min="1"
                            onChange={(e) => {
                              let value = parseInt(e.target.value, 10);
                              if (isNaN(value) || value < 1) {
                                value = 1;
                              }
                              handleInputChange(
                                { target: { value } },
                                index,
                                "quantity"
                              );
                            }}
                            className="w-full p-1 rounded"
                            style={{ height: "2rem" }}
                          />
                        </td>
                        <td style={{ width: "10%" }}>
                          <select
                            value={item.unit || ""}
                            onChange={(e) =>
                              handleInputChange(e, index, "unit")
                            }
                            className="w-full border rounded h-8 min-w-16"
                          >
                            {unitList.map((unit) => (
                              <option key={unit.value} value={unit.value}>
                                {unit.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ width: "10%" }}>
                          {formatToINR(item.cost)}
                        </td>
                        <td style={{ width: "10%" }}>
                          {formatToINR(item?.without_tax_cost)}
                        </td>
                        <td style={{ width: "10%" }}>
                          {formatToINR(item?.tax_amount)}
                        </td>
                        <td style={{ width: "10%" }}>
                          {formatToINR(item.total_cost)}
                        </td>
                        <td style={{ width: "5%" }}>
                          <button
                            onClick={() => handleDeleteItem(index)}
                            className="text-red-500"
                          >
                            {icons.deleteIcon}
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={6}>
                        <div className="text-end font-semibold">
                          Total Amount :
                        </div>
                      </td>
                      <td>
                        <div className="text-end">
                          <span>
                            {formatToINR(totalAmountList.totalAmount)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span>
                          {formatToINR(totalAmountList.totalTaxAmount)}
                        </span>
                      </td>
                      <td>
                        <span>{formatToINR(totalAmountList.totalAmount)}</span>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <IconButton
              label="Update"
              icon={icons.saveIcon}
              type="submit"
              className="my-4"
              loading={loading}
              onClick ={()=>{handleSubmit(updateHandler)()}}
            />
          </div>
      </Modal>
      <Modal
        isOpen={isViewModal}
        onClose={() => setIsViewModal(false)}
        title="View Material Transfer"
        showHeader
        size="l"
        showFooter={false}
      >
        <div className="flex gap-4 items-center mb-4">
          <span className="top-clr">
            {React.cloneElement(icons?.truckArrowRightIcon, { size: 24 })}
          </span>
          <div className="flex  gap-6 items-center">
            <div className="flex flex-col ">
              <span className="font-semibold text-lg">
                {viewSelectedData?.trans_from_name}
              </span>
              <span className="text-sm ">
                {viewSelectedData?.trans_by_name}
              </span>
            </div>
            <span className="text-gray-400">
              {React.cloneElement(icons?.arrowRight, { size: 24 })}
            </span>
            <div className="flex flex-col ">
              <span className="font-semibold text-lg">
                {viewSelectedData?.trans_to_name}
              </span>
              <span className="text-sm">
                {viewSelectedData?.received_sent_by}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2  gap-9 items-center mb-4">
          <div className="flex gap-4 items-center ">
            <span className="top-clr">
              {React.cloneElement(icons?.calendarCheck, { size: 24 })}
            </span>
            <span>{viewSelectedData?.date}</span>
          </div>
          <div className="flex gap-4 items-center ">
            <span className="top-clr">
              {React.cloneElement(icons?.truckIcon, { size: 24 })}
            </span>
            <span>{viewSelectedData?.vehicle_no}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-9 items-center mb-4">
          <div className="flex gap-4 items-center ">
            <span className="top-clr">
              {React.cloneElement(icons?.truck, { size: 24 })}
            </span>
            <span className="flex flex-col ">
              <span>Logistics Type</span>
              <span className="font-semibold text-lg">
                {viewSelectedData?.logistics_type}
              </span>
            </span>
          </div>
          <div className="flex gap-4">
          <span className="top-clr">
            {React.cloneElement(icons?.invoice, { size: 24 })}
          </span>
          <span className="flex flex-col ">
            <span className="">Invoice Reference No</span>
            <span className="font-semibold text-lg ">
              {viewSelectedData?.invoice_ref_no}
            </span>
          </span>
        </div>
          
        </div>
        
        <div className="mt-5">
          <span className="top-clr text-lg font-semibold mb-2">Item List</span>
          
          <ReusableAgGrid
          key={ViewcolumnDefs.length}
          rowData={viewSelectedData?.transfer_material}
          columnDefs={ViewcolumnDefs}
          defaultColDef={{ resizable: true }}
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
          }}
          pagination={false}
        />
        </div>
      </Modal>
    </div>
  );
};
export default MaterialTransferList;
