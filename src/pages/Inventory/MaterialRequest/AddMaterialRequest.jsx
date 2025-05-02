import React, { useState, useEffect } from "react";
import { createMaterialRequest } from "../../../redux/Inventory/MaterialRequest/MaterialRequestAction";
import { useForm } from "react-hook-form";
import icons from "../../../contents/Icons";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import { useDispatch, useSelector } from "react-redux";
import ModalCenter from "../../../UI/ModalCenter/ModalCenter";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import Select from "../../../UI/Select/SingleSelect";
import SearchableSelect from "../../../UI/Select/SearchableSel";
import FileInput from "../../../UI/Input/FileInput/FileInput";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import formatDateForInput from "../../../UI/Date/Date";
import "../Purchase/Purchase.css";
import {
  getAllUnitListEffect,
  getAllItemListEffect,
  getEmployeeListEffect,
  getAllInventoryMasterListEffect,
} from "../../../redux/common/CommonEffects";
import Modal from "../../../UI/Modal/Modal";
import { formatToINR } from "../../../utils/Rupees";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import { validationPatterns } from "../../../utils/Validation";
import { v4 as uuidv4 } from "uuid";
import { materialRequestImageUploadEffect } from "../../../redux/Inventory/MaterialRequest/MaterialRequestEffects";
import { getUserLocalStorage } from "../../../utils/utils";

const AddMaterialRequest = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm();
  const {
    register: itemRegister,
    formState: { errors: itemErrors },
    handleSubmit: itemHandleSubmit,
    reset: itemReset,
    setValue: itemSetValue,
    watch: itemWatch,
  } = useForm();
  const { createMaster } = useSelector((state) => state.master || {});
  const [toastData, setToastData] = useState({ show: false });
  const [loading, setLoading] = useState(false);

  const [isAddAssetsModal, setIsAddAssetsModal] = useState(false);
  const [unitList, setUnitList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [invList, setInvList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [totalAmountList, setTotalAmountList] = useState({});
  const [filteredItemList, setFilteredItemList] = useState([]);

  const [selectedItemList, setSelectedItemList] = useState([]);
  const [logData, setLogData]=useState(null)

  useEffect(() => {
    if (createMaster?.success) {
      setToastData({
        show: true,
        message: createMaster?.data?.message || "Success",
        type: "success",
      });
      onSuccess?.();
      reset();
    } else if (createMaster?.error) {
      setToastData({
        show: true,
        message: createMaster?.error || "Failed",
        type: "error",
      });
    }
    setLoading(false);
  }, [createMaster, reset, onSuccess]);

  // useEffect(() => {
  //     if (employeeList.length === 0) {
  //         (async () => {
  //             try {
  //                 let { data } = await getEmployeeListEffect();
  //                 data = data.data.map((list) => ({
  //                     label: list.name,
  //                     value: list.id,
  //                 }));
  //                 setEmployeeList(data);
  //             } catch (error) {
  //                 setEmployeeList([]);
  //             }
  //         })();
  //     }
  // }, [employeeList]);
  // useEffect(() => {
  //     if (unitList.length === 0) {
  //         (async () => {
  //             try {
  //                 let { data } = await getAllUnitListEffect();
  //                 data = data.data.map((list) => ({
  //                     label: list.unit_name,
  //                     value: list.id,
  //                 }));
  //                 setUnitList(data);
  //             } catch (error) {
  //                 setUnitList([]);
  //             }
  //         })();
  //     }
  // }, [unitList]);

  const fetchItemList = async () => {
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
  };
  useEffect(() => {
    if (itemList.length === 0) {
      fetchItemList();
    }
  }, []);

  // Handle Add Master
  const addMasterHandler = (data) => {
    const payload = {
      date: data.date,
      inv_id: data.inv_id,
      //   attachment: data.attachment,
      items: selectedItemList.map((item) => ({
        quantity: item.quantity,
        unit: item.unit,
        item_name: item.material_name,
        item_id: item.id,
      })),
    };
    
    setLoading(true);
    dispatch(
      createMaterialRequest({
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
      const response = await materialRequestImageUploadEffect(formData);
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
      setIsAddAssetsModal(false);
      onSuccess?.();
      setSelectedItemList([]);
    }
  };
/*************  ✨ Codeium Command 🌟  *************/
  /**
   * Master handler callback for add material request form
   * @param {Object} response - Response from the API
   * @return {void}
   */
  const masterHandler = (response) => {
    if (response.success) {
      // Show success toast
      setToastData({
        show: true,
        message: response.data.message,
        type: "success",
      });
      // Reset the form
      setIsAddAssetsModal(false);
      onSuccess?.();
      reset();
      // Reset the selected items
      setSelectedItemList([]);
      // Close the modal
      setIsAddAssetsModal(false);
      // Call the onSuccess callback
      onSuccess?.();
    } else {
      // Show error toast
      setToastData({ show: true, message: response.error, type: "error" });
    }
    // Set loading to false
    setLoading(false);
  };
/******  f1932751-1353-44ca-9bc6-5e2b6e1ac95a  *******/

  const toastOnclose = () => {
    setToastData({ ...toastData, show: false });
  };

  const openModalHandler = () => {
    setIsAddAssetsModal(true);
    setValue("date", formatDateForInput(new Date()));
  };
  ///////////////////////////
  useEffect(() => {
    const fetchData = async () => {
      const [itemData, unitData,inventoryData] = await Promise.all([
        getAllItemListEffect(),
        getAllUnitListEffect(),
        getAllInventoryMasterListEffect()
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
      setInvList(
        inventoryData?.data?.data.map((inv) => ({
          label: inv.name,
          value: inv.id,
        })) 
      );
    };

    fetchData();
  }, []);
  useEffect(() => {
    const logDatas = getUserLocalStorage();
    
    setLogData(logDatas?.userInfo);
    

  },[]);
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
  }, [selectedMaterialId, itemSetValue, filteredItemList]);
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
          onClose={toastOnclose}
        />
      )}
      <IconButton
        label="Add Material Request"
        icon={icons.plusIcon}
        onClick={openModalHandler}
      />
      <Modal
        isOpen={isAddAssetsModal}
        onClose={() => setIsAddAssetsModal(false)}
        title="Add Material Request"
        showHeader
        size="xxl"
        showFooter={false}
        className="darkCardBg"
      >
        <form onSubmit={handleSubmit(addMasterHandler)}>
          <div className="grid grid-cols-2 gap-3">
          {logData?.role===100&&<Select
                    options={invList}
                    label="Inventory Name"
                    id="inv_id"
                    placeholder="Select Inventory"
                    validation={{ required: "Inventory is Required" }}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    showStar={true}
                    iconLabel={icons.homeIcon}
                  />}
            <FormInput
              id="date"
              iconLabel={icons.calendarWDate}
              label="Date"
              type="date"
              register={register}
              errors={errors}
              validation={{ required: "Date is Required" }}
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
              className="mt-1 w-full"
            />
          </div>
        </form>

        <div>
          <div>
            <form onSubmit={itemHandleSubmit(ItemSubmitHandler)}>
              <div className="grid grid-cols-5 gap-3 my-3 justify-between content-end width-3/4">
                <div className="col-span-2">
                                          
                <SearchableSelect
                    options={itemList}
                    label="Item Name"
                    id="item_id"
                    placeholder="Select Inventory"
                    validation={{ required: "Inventory is Required" }}
                    register={itemRegister}
                    setValue={itemSetValue}
                    errors={itemErrors}
                    showStar={true}
                    iconLabel={icons.itemBox}
                  />
                </div>

                <Select
                  options={unitList}
                  label="Unit"
                  id="unit"
                  iconLabel={icons.unitIcon}
                  placeholder="Select Unit"
                  register={itemRegister}
                  errors={itemErrors}
                  validation={{ required: "Unit is Required" }}
                  disabled={true}
                  className="mb-1"
                />
                <FormInput
                  label="Quantity"
                  type="number"
                  iconLabel={icons.quotationIcon}
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
                        <td style={{ width: "20%" }}>{item.name}</td>
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
        <div className="flex mt-4">
          <IconButton
            label="Add Material Request"
            icon={icons.plusIcon}
            type="submit"
            loading={loading}
            onClick={() => handleSubmit(addMasterHandler)()}
          />
        </div>
      </Modal>
    </>
  );
};

export default AddMaterialRequest;
