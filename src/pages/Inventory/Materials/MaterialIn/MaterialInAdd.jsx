import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import icons from "../../../../contents/Icons";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";
import Modal from "../../../../UI/Modal/Modal";
import Select from "../../../../UI/Select/SingleSelect";
import {
  getAllInventoryMasterListEffect,
  getAllItemListEffect,
  getAllUnitListEffect,
} from "../../../../redux/common/CommonEffects";
import { createMaterialInOut } from "../../../../redux/Inventory/Material/MaterialInOut/MaterialInOutAction";
import FileInput from "../../../../UI/Input/FileInput/FileInput";
import { Tooltip as ReactTooltip } from "react-tooltip";
import ProductList from "../../Product/ProductList";
import { useLocation, useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import SearchableSelect from "../../../../UI/Select/SearchableSel";
import { formatToINR } from "../../../../utils/Rupees";
import { validationPatterns } from "../../../../utils/Validation";
import { arrOptForDropdown, getDefaultDateTime } from "../../../../utils/Data";
import { getCurrentDateTime } from "../../../../utils/Date";
const MaterialInAdd = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      type: "in",
    },
  });
  const {
    register:itemRegister,
    control:itemControl,
    formState: { errors:itemErrors },
    handleSubmit :itemHandleSubmit,
    reset :itemReset,
    setValue :itemSetValue,
  } = useForm({
    defaultValues: {
      type: "in",
    },
  });

  const { createMaster } = useSelector((state) => state.master || {});

  const [loading, setLoading] = useState(false);
  const [isMasterCreateModal, setIsMasterCreateModal] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [toastData, setToastData] = useState({ show: false });
  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 16);
    setValue("date", formattedDate);
  }, [setValue]);
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
    if(selectedItemList.length === 0){
      setToastData({
        show: true,
        message: "Please add at least one item",
        type: "error",
      });
      return
    }
    const payload = {
      type: data.type,
      date: data.date,
      material_type: data.material_type,
      inv_id: data.inv_id,
      // received_sent_by: data.received_sent_by,
      logistics_type: data.logistics_type,
      vehicle_no: data.vehicle_no,
      invoice_ref_no: data.invoice_ref_no,
      attachment: data.attachment,
      items: selectedItemList.map((item) => ({
        quantity: item.quantity,
        unit: item.unit,
        item_name: item.material_name,
        item_id: item.id,
      })),
    };

    // Optional: for debugging the payload

    setLoading(true);
    dispatch(
      createMaterialInOut({
        ...payload,
        callback: masterHandler,
      })
    );
    
  };
  useEffect(() => {
    setValue("date", getDefaultDateTime());
  }, [isMasterCreateModal]);
  const masterHandler = (response) => {
    if (response.success) {
      setToastData({
        show: true,
        message: response.data.message,
        type: "success",
      });
      reset();
      setSelectedItemList([]);
      setIsMasterCreateModal(false);
      onSuccess?.();
      reset();
    } else {
      setToastData({ show: true, message: response.error, type: "error" });
    }
    setLoading(false);
    reset();
    setSelectedItemList([]);

  };

  const toastOnClose = () => {
    setToastData({ ...toastData, show: false });
  };

  const materialType = [
    { label: "Purchase", value: "purchase" },
    // { label: "Sale", value: "sale" },
    { label: "Inter Transfer", value: "inter_transfer" },
    { label: "Return", value: "return" },
  ];
  const logisticsType = [
    { label: "Own", value: "own" },
    { label: "Parcel", value: "parcel" },
    { label: "Vendor", value: "vendor" },
  ];
  ///////////////////////////////////////////////////
  const [filteredItemList, setFilteredItemList] = useState([]);
  const [selectedItemList, setSelectedItemList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [totalAmountList, setTotalAmountList] = useState({});
  const [activityData, setActivityData] = useState();
  const [selectedLead, setSelectedLead] = useState();
  const location = useLocation();
  const [inventoryList, setInventoryList] = useState([]);

  const {
    register: materialRegister,
    handleSubmit: materialHandleSubmit,
    reset: materialReset,
    watch: materialWatch,
    setValue: materialSetValue,
    formState: { errors: materialErrors },
  } = useForm({ defaultValues: { quantity: 1 } });

  useEffect(() => {
    

    if (location?.state) {
      const datas = location?.state;
      setActivityData(location?.state?.payload);
      setSelectedLead({
        ...datas?.leadData,
        value: datas?.leadData?.id,
        label: `${datas?.leadData?.lead_name} - ${datas?.leadData?.lead_id}`,
      });
    }
  }, [location.state]);

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
    materialReset();
    materialSetValue("quantity", 1);
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

    (async () => {
      const invList = await getAllInventoryMasterListEffect();
      if (invList?.data?.data?.length > 0) {
        const invListData = await arrOptForDropdown(
          invList?.data?.data,
          "name",
          "id"
        );
        setInventoryList(invListData);
      } else {
        setInventoryList([]);
      }
    })();
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
  const calculateTotalAmount = () =>
    selectedItemList.reduce(
      (totals, item) => ({
        totalAmount: totals.totalAmount + item.total_cost,
        totalTaxAmount: totals.totalTaxAmount + item.tax_amount,
        totalWithoutTaxAmount:
          totals.totalWithoutTaxAmount + item.without_tax_cost,
      }),
      { totalAmount: 0, totalTaxAmount: 0, totalWithoutTaxAmount: 0 }
    );

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
  const selectedMaterialId = materialWatch("item_id");

  useEffect(() => {
    if (selectedMaterialId) {
      // Find the corresponding unit for the selected material
      const selectedMaterial = filteredItemList.find(
        (item) => item.id === selectedMaterialId
      );
      if (selectedMaterial) {
        materialSetValue("unit", selectedMaterial.unit); // Dynamically set the `unit` value
      } else {
        materialSetValue("unit", ""); // Reset if no material is selected
      }
    }
  }, [selectedMaterialId, materialSetValue, filteredItemList]);
  const handleDeleteItem = (index) => {
    setSelectedItemList((prevList) => prevList.filter((_, i) => i !== index));
  };
  return (
    <>
      {toastData.show && (
        <AlertNotification
          type={toastData.type}
          show={toastData.show}
          message={toastData.message}
          onClose={toastOnClose}
        />
      )}

      <IconButton
        label="Add Material In"
        icon={icons.plusIcon}
        onClick={() => setIsMasterCreateModal(true)}
      />
      <Modal
        isOpen={isMasterCreateModal}
        onClose={() => setIsMasterCreateModal(false)}
        title="Add Material In"
        showHeader
        size="xxl"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(addMasterHandler)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              options={inventoryList}
              label="Inventory"
              id="inv_id"
              iconLabel={icons.house}
              placeholder="Select Inventory"
              register={register}
              errors={errors}
              validation={{ required: "Inventory Required" }}
            />
            <FormInput
              id="date"
              iconLabel={icons.calendarWDate}
              label="Date & Time"
              type="datetime-local"
              register={register}
              errors={errors}
              min={getDefaultDateTime(2)}
              max={getDefaultDateTime()}
              validation={{ required: "Date and time is required" }}
            />
            <Select
              options={materialType}
              label="Material Type"
              id="material_type"
              iconLabel={icons.itemBox}
              placeholder="Select Item"
              register={register}
              errors={errors}
              validation={{ required: "Material Type is Required" }}
            />
            {/* <FormInput
                            label="Received/Sent By"
                            id="received_sent_by"
                            iconLabel={icons.replay}
                            placeholder="Enter Received/Sent By"
                            register={register}
                            validation={{ required: "Received/Sent By is required" }}
                            errors={errors}
                        /> */}
            <Select
              options={logisticsType}
              label="Logistics Type"
              id="logistics_type"
              iconLabel={icons.truck}
              placeholder="Select Item"
              register={register}
              errors={errors}
              validation={{ required: "Logistics Type is Required" }}
            />
            <FormInput
              label="Vehicle Number"
              id="vehicle_no"
              placeholder="Enter Vehicle Number"
              register={register}
              validation={{
                required: "Vehicle Number is required",
                pattern: {
                  value: validationPatterns?.vehicleNumber,
                  message: "Provide Valid Vehicle Number",
                },
              }}
              errors={errors}
            />
            <FormInput
              label="Invoice Reference No"
              id="invoice_ref_no"
              iconLabel={icons.invoice}
              placeholder="Enter Invoice Reference Number"
              register={register}
              validation={{ required: "Invoice Reference Number is required" }}
              errors={errors}
            />
            <FileInput
              id="attachment"
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
          {/* <div>
            <IconButton
              label="Add Material In"
              icon={icons.saveIcon}
              type="submit"
              className="my-4 text-white px-6 py-2 rounded"
              loading={loading}
            />
          </div> */}
        </form>

        {/* Item add */}
            <div>
        <form onSubmit={materialHandleSubmit(ItemSubmitHandler)}>
            <div>
                {/* onSubmit={materialHandleSubmit(ItemSubmitHandler)}> */}
                <div className="grid grid-cols-5 gap-3 my-3 justify-between content-end width-3/4">
                <div className="col-span-2">
                    <SearchableSelect
                    options={filteredItemList}
                    label="Item Name"
                    id="item_id"
                    className="w-50"
                    placeholder="Select Item"
                    register={materialRegister}
                    validation={{ required: "Item is Required" }}
                    errors={materialErrors}
                    showStar={true}
                    setValue={materialSetValue}
                    />
                </div>
                <FormInput
                    label="Quantity"
                    type="number"
                    placeholder="Enter Quantity"
                    register={materialRegister}
                    id="quantity"
                    errors={materialErrors}
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
                    register={materialRegister}
                    validation={{ required: "Unit is Required" }}
                    errors={materialErrors}
                    disabled={true}
                />
                <div className="flex items-center pt-4">
                    <IconButton
                    label="Add Item"
                    type="submit"
                    className="h-8"
                    icon={icons.plusIcon}
                    onClick={materialHandleSubmit(ItemSubmitHandler)}
                    />
                </div>
                </div>
            </div>
            </form>
            <div className="item-list__table__container overflow-auto max-w-full">
                <table className="item-list__table overflow-auto table-auto">
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

       

        <div>
            <IconButton
              label="Add Material In"
              icon={icons.saveIcon}
              type="submit"
              className="my-4 text-white px-6 py-2 rounded"
              loading={loading}
              onClick={()=>{handleSubmit(addMasterHandler)();}}
            />
          </div>
      </Modal>
      <ReactTooltip id="additem" place="top" content="Add Items" />
    </>
  );
};

export default MaterialInAdd;
