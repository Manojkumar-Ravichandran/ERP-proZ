import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMaterialTransfer } from "../../../redux/Inventory/MaterialTransfer/MaterialTransferAction";
import icons from "../../../contents/Icons";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import Modal from "../../../UI/Modal/Modal";
import { useForm } from "react-hook-form";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Select from "../../../UI/Select/SingleSelect";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import {
  getAllItemListEffect,
  getAllUnitListEffect,
  getAllInventoryMasterListEffect,
  getEmployeeListEffect,
} from "../../../redux/common/CommonEffects";
import ModalCenter from "../../../UI/ModalCenter/ModalCenter";
import FileInput from "../../../UI/Input/FileInput/FileInput";
import { useLocation, useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import SearchableSelect from "../../../UI/Select/SearchableSel";
import { formatToINR } from "../../../utils/Rupees";
import { validationPatterns } from "../../../utils/Validation";
import "../Purchase/Purchase.css";
import { materialTransferImageUploadEffect } from "../../../redux/Inventory/MaterialTransfer/MaterialTransferEffects";
import { getDefaultDateTime } from "../../../utils/Data";
const MaterialTransferForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const [toastData, setToastData] = useState({ show: false });
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm();
  const { createMaster } = useSelector((state) => state.MaterialTransfer || {});
  const [isMasterCreateModal, setIsMasterCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unitList, setUnitList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [masterList, setMasterItemList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);

  const [filteredItemList, setFilteredItemList] = useState([]);
  const [selectedItemList, setSelectedItemList] = useState([]);
  const [totalAmountList, setTotalAmountList] = useState({});
  const [activityData, setActivityData] = useState();
  const [selectedLead, setSelectedLead] = useState();
  const location = useLocation();

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
  useEffect(() => {
    if (createMaster?.success) {
      setToastData({
        show: true,
        message: createMaster.data.message || "Success",
        type: "success",
      });
      onSuccess?.();
      reset();
    } else if (createMaster?.error) {
      setToastData({
        show: true,
        message: createMaster.error || "Failed",
        type: "error",
      });
    }
    setLoading(false);
  }, [createMaster, onSuccess, reset]);

  const addMasterHandler = (data) => {
    const payload = {
      trans_from: data.trans_from,
      trans_from_name:
        itemList.find((item) => item.value === data.trans_from)?.label || "",
      trans_to: data.trans_to,
      trans_to_name:
        itemList.find((item) => item.value === data.trans_to)?.label || "",
      trans_by: data.trans_by,
      trans_by_name:
        itemList.find((item) => item.value === data.trans_by)?.label || "",
      date: data.date,
      material_type: data.material_type,
      // received_sent_by: data.received_sent_by,
      logistics_type: data.logistics_type,
      vehicle_no: data.vehicle_no,
      attachment: data.attachment,
      items: selectedItemList.map((item) => ({
        quantity: item.quantity,
        unit: item.unit,
        item_name: item.material_name,
        item_id: item.id,
      })),
    };

    setLoading(true);
    dispatch(
      createMaterialTransfer({
        ...payload,
        callback: async (response) => {
          // masterHandler(response);
          if (
            response?.success &&
            response?.data?.uuid &&
            data?.file_url?.length > 0
          ) {
            await uploadFile(response?.data?.uuid, data?.file_url[0]); // Assuming a single file
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
      const response = await materialTransferImageUploadEffect(formData);
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
      setIsMasterCreateModal(false);
      onSuccess?.();
      setSelectedItemList([]);
    }
  };
  const {
    register: itemRegister,
    formState: { errors: itemErrors },
    handleSubmit: itemHandleSubmit,
    reset: itemReset,
    setValue: itemSetValue,
    watch: itemWatch,
  } = useForm({defaultValues: { material_type: 'inter_transfer' }});

  const masterHandler = (response) => {
    if (response.success) {
      setToastData({
        show: true,
        message: response.data.message,
        type: "success",
      });
      setIsMasterCreateModal(false);
      onSuccess?.();
      reset();
      setSelectedItemList([]);
    } else {
      setToastData({ show: true, message: response.error, type: "error" });
    }
    setLoading(false);
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
        let { data } = await getAllItemListEffect();
        data = data.data.map((list) => ({
          label: list.material_name,
          value: list.id,
        }));
        setItemList(data);
      } catch (error) {
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
    if (employeeList.length === 0) {
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
    }
  }, [employeeList]);
  const toastOnclose = () => {
    setToastData({ ...toastData, show: false });
  };
  // Get today's date and format it
  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Set default date when the form is loaded
    setValue("date", getDefaultDateTime());
  }, [setValue, todayDate]);

  ////////////////////////
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
  useEffect(() => {
    const fetchData = async () => {
      const [itemData, unitData] = await Promise.all([
        getAllItemListEffect(),
        getAllUnitListEffect(),
      ]);

      setItemList(
        itemData?.data?.data.map((item) => ({
          label: `${item.material_name} ${
            item?.material_code ? "-" + item?.material_code : ""
          }`,
          value: item.id,
          ...item,
        }))
      );
      setUnitList(
        unitData?.data?.data.map((unit) => ({
          label: unit.unit_name,
          value: unit.id,
        }))
      );
    };

    fetchData();
  }, []);

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
      <IconButton
        label="Transfer Material"
        icon={icons.direct}
        onClick={() => setIsMasterCreateModal(true)}
      />
      <Modal
        isOpen={isMasterCreateModal}
        onClose={() => setIsMasterCreateModal(false)}
        title="Transfer Material"
        showHeader
        size="xxl"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(addMasterHandler)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              id="date"
              iconLabel={icons.calendarWDate}
              label="Date"
              type="datetime-local"
              register={register}
              errors={errors}
              validation={{ required: "Date is Required" }}

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
          </div>
        </form>
        <div>
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
        </div>
        <div className="flex  mt-4">
          <IconButton
            label="Transfer"
            icon={icons.direct}
            type="submit"
            className="my-4"
            loading={loading}
            onClick={() => {
              handleSubmit(addMasterHandler)();
            }}
          />
        </div>
      </Modal>
    </div>
  );
};
export default MaterialTransferForm;
