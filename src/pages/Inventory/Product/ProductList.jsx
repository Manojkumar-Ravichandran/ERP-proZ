import React, { useEffect, useState, useCallback } from "react";
import {  getAllLeadListEffect,
} from "../../../redux/CRM/lead/LeadEffects";
import SearchableSelect from "../../../UI/Select/SearchableSel";
import { useForm } from "react-hook-form";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { v4 as uuidv4 } from "uuid";
import { validationPatterns } from "../../../utils/Validation";
import Select from "../../../UI/Select/SingleSelect";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import icons from "../../../contents/Icons";
import {
  getAllItemListEffect,
  getAllUnitListEffect,
  getAllVendorListEffect,
} from "../../../redux/common/CommonEffects";
import { formatToINR } from "../../../utils/Rupees";
// import "../Quotation.css";
import { useLocation, useNavigate } from "react-router";
import "../../Quotation/Quotation.css"
export default function ProductList() {
  const [leadList, setLeadList] = useState([]);
  const [filteredItemList, setFilteredItemList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [selectedItemList, setSelectedItemList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [totalAmountList, setTotalAmountList] = useState({});
  const [activityData, setActivityData] = useState();
  const [selectedLead, setSelectedLead] = useState();
  const location = useLocation();

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
      (item) => Number(item.value) === Number(data.material_id)
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
  const selectedMaterialId = materialWatch("material_id");

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
      <div>
          <div >
           {/* onSubmit={materialHandleSubmit(ItemSubmitHandler)}> */}
            <div className="grid grid-cols-5 gap-3 my-3 justify-between content-end width-3/4">
              <div className="col-span-2">
                <SearchableSelect
                  options={filteredItemList}
                  label="Item Name"
                  id="material_id"
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
    </>
  );
}

