import React, { useEffect, useRef, useState } from "react";
import FormCard from "../../../UI/Card/FormCard/FormCard";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBillAddListEffect,
  getAllCategoryListEffect,
  getAllDistrictListEffect,
  getAllItemListEffect,
  getAllShippingAddListEffect,
  getAllStateListEffect,
  getAllSubCategoryListEffect,
  getAllUnitListEffect,
  getAllVendorListEffect,
} from "../../../redux/common/CommonEffects";
import { useForm, FormProvider } from "react-hook-form";
import Select from "../../../UI/Select/SingleSelect";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { validationPatterns } from "../../../utils/Validation";
import SubmitBtn from "../../../UI/Buttons/SubmitBtn/SubmitBtn";
import "./Purchase.css";
import { v4 as uuidv4 } from "uuid";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import { formatToINR } from "../../../utils/Rupees";
import SelectableCard from "../../../UI/Card/SelectableCard/SelectableCard";
import ToggleSwitch from "../../../UI/Input/ToggleSwitch/ToggleSwitchNormal";
import { getCurrentDateTime } from "../../../utils/Date";
import SearchableSelect from "../../../UI/Select/SearchableSel";
import Modal from "../../../UI/Modal/Modal";
import { findSpecificIdData, optimizeAddress } from "../../../utils/Data";
import icons from "../../../contents/Icons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import styles for the calendar
import DatePickerInput from "../../../UI/Input/DatePicker/DatePicker";
import { DevTool } from "@hookform/devtools";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import { AddAddress } from "./AddressModal";
import {
  getBillingAddressInprogress,
  getShippingAddressInprogress,
} from "../../../redux/Address/AddressAction";

export default function AddPurchase() {
  const dispatch = useDispatch();
  const addressList = useSelector((state) => state?.address);
  const [itemList, setItemList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [selectedItemList, setSelectedItemList] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isBilling, setIsBilling] = useState(true);
  const formRef = useRef(null);
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [billingAddress, setBillingAddress] = useState();
  const [billingAddressData, setBillingAddressData] = useState();
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingAddressData, setShippingAddressData] = useState();
  const [isCategoryBased, setIsCategoryBased] = useState(false);
  const [filteredItemList, setFilteredItemList] = useState([]);
  const [billingModalData, setBillingModalData] = useState({
    show: false,
  });
  const [shippingModalData, setShippingModalData] = useState({
    show: false,
  });
  const [totalAmountList, setTotalAmountList] = useState({});
  const [toastData, setToastData] = useState({ show: false });
  const [isAddBillingModal, setIsAddBillingModal] = useState(false);
  const [isAddShippingModal, setIsAddShippingModal] = useState(false);
  const [shippingAddList, setShippingAddList] = useState([]);
  const [billingAddList, setBillingAddList] = useState([]);
  const [dummyBilling,setDummyBilling] =useState()
  const [dummyShipping,setDummyShipping] =useState()
  const shipping = useSelector(
    (state) => state?.address?.shippingAddressList?.data
  );
  const billing = useSelector(
    (state) => state?.address?.billingAddressList?.data
  );
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Purchase", link: "/user/inventory/purchase/" },
    { id: 3, label: "Add Purchase" },
  ];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "inventory",
      project_id: "",
      location_id: "",
      date: "",
      description: "",
    },
  });
  const {
    register: materialRegister,
    handleSubmit: materialHandleSubmit,
    reset: materialReset,
    watch: materialWatch,
    setValue: materialSetValue,
    formState: { errors: materialErrors },
  } = useForm({ defaultValues: { quantity: 1 } });
  const category_id = materialWatch("category_id");
  const subcategory_id = materialWatch("subcategory_id");
  const selectedMaterialId = materialWatch("material_id");

  const {
    register: billingRegister,
    handleSubmit: billingSubmit,
    reset: billingReset,
    watch: billingWatch,
    setValue: billingSetValue,
    formState: { errors: billingErrors },
  } = useForm({});
  const state = billingWatch("state");
  const {
    register: shippingRegister,
    handleSubmit: shippingSubmit,
    reset: shippingReset,
    watch: shippingWatch,
    setValue: shippingSetValue,
    formState: { errors: shippingErrors },
  } = useForm({});
  const shippingstate = shippingWatch("state");
  useEffect(() => {
    dispatch(getShippingAddressInprogress({}));
    dispatch(getBillingAddressInprogress({}));
  }, []);
  useEffect(() => {
    if(shipping?.length>0){
      const shippingLists = shipping?.map((list) =>
        optimizeAddress(list)
      );
      setShippingAddList(shippingLists);
      

    }else{
      setShippingAddList([])
    }
  }, [shipping]);
  useEffect(() => {
    if(billing?.length>0){
    const billingLists = billing?.map((list) => optimizeAddress(list));
    setBillingAddList(billingLists);
    setBillingAddressData(billingLists[0]);
    setBillingAddress(billingLists[0].id);
    }else{
      setBillingAddList([])
    }
  }, [billing]);
  

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

  useEffect(() => {
    if (category_id) {
      const payload = { category_id };
      (async () => {
        const { data } = await getAllSubCategoryListEffect({ ...payload });
        setSubcategoryList(
          data?.data?.map((list) => ({
            label: `${list.subcategory_name}`,
            value: list.id,
          }))
        );
      })();
      getItemList({ category_id });
    }
  }, [category_id]);

  useEffect(() => {
    if (subcategory_id) {
      getItemList({ category_id, subcategory_id });
    }
  }, [subcategory_id]);

  const getItemList = async (datas) => {
    const { data } = await getAllItemListEffect({ datas });
    setFilteredItemList(
      data?.data.map((item) => ({
        label: `${item.material_name} ${
          item?.material_code ? "-" + item?.material_code : ""
        }`,
        value: item.id,
        ...item,
      }))
    );
  };

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
    materialReset({ material_id: "" });
  };

  useEffect(() => {
    if (categoryList?.length == 0) {
      (async () => {
        const { data } = await getAllCategoryListEffect();
        setCategoryList(
          data?.data?.map((list) => ({
            label: `${list.category_name}`,
            value: list.id,
          }))
        );
      })();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [itemData, unitData, vendorData] = await Promise.all([
        getAllItemListEffect(),
        getAllUnitListEffect(),
        getAllVendorListEffect(),
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
      setVendorList(
        vendorData?.data?.data.map((vendor) => ({
          label: `${vendor.name} - ${vendor.contact}`,
          value: vendor.id,
        }))
      );
    };

    fetchData();
  }, []);

  const addPurchaseHandler = (data) => {
    const payload = {
      ...data,
      purchase_material: selectedItemList,
      billing_address_id: billingAddress,
      shipping_address_id: shippingAddress,
      is_billing: isBilling,
    };
  };
  
  const handleBillingChange = () => {
    setBillingAddress(dummyBilling);
    const address = billingAddList.find((e) => e.id === dummyBilling);
    setBillingAddressData(address);
    handleModalClose()
  };
  const handleShippingChange = () => {
    setShippingAddress(dummyShipping);
    const address = shippingAddList.find((e) => e.id === dummyShipping);
    setShippingAddressData(address);
    handleShippingModalClose()
    
  };
  const dummyBillingChange =(id)=>{
    const address = billingAddList.find((e) => e.id === id);
    setDummyBilling(id);
  }
  const dummyShippingChange =(id)=>{
    const address = shippingAddList.find((e) => e.id === id);
    setDummyShipping(id);
  }

  useEffect(() => {
    if (billingAddress) {
      const datas = findSpecificIdData(billingAddList, billingAddress);
      setBillingAddressData(datas);
    }
  }, [billingAddress]);
  useEffect(() => {
    if (billingAddress && isBilling) {
      const datas = findSpecificIdData(billingAddList, billingAddress);
      setShippingAddress(billingAddress);
      setShippingAddressData(datas);
    }
  }, [billingAddress, isBilling]);

  const handleModalClose = () =>
    setBillingModalData({ ...billingModalData, show: false });
  const handleShippingModalClose = () =>
    setShippingModalData({ ...shippingModalData, show: false });

  // const openBillingAddressModal =()

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

  useEffect(() => {
    if (stateList.length === 0) {
      (async () => {
        try {
          let { data } = await getAllStateListEffect();
          data = data.data.map((list) => ({
            label: list.state_name,
            value: list.state_code,
          }));
          setStateList(data);
        } catch (error) {
          setStateList([]);
        }
      })();
    }
  }, [stateList]);
  useEffect(() => {
    if (state) {
      getDistrictList(state);
    }
  }, [state]);

  const getDistrictList = async (state_code) => {
    let { data } = await getAllDistrictListEffect({ state_code });
    data = data.data.map((list) => ({
      label: list.city_name,
      value: list.city_code,
    }));
    setDistrictList(data);
  };

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
  const handleDeleteItem = (index) => {
    setSelectedItemList((prevList) => prevList.filter((_, i) => i !== index));
  };

  const theFormSubmit = (e) => {
    e.preventDefault(); // Add this to prevent the default form behavior

    if (selectedItemList?.length < 1) {
      setToastData({
        show: true,
        message: "Atleast Provide only one Item",
        type: "error",
      });
    } else {
      handleSubmit(addPurchaseHandler)();
    }
  };
  const minDate = new Date();
  minDate.setMonth(minDate.getMonth() - 2);
  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
  };
  const addBillingModalClose = () => {
    setIsAddBillingModal(false);
  };
  const addBillingAddressHandler = (data) => {
    
  };
  const addShippingModalClose = () => {
    setIsAddShippingModal(false);
  };
  const addShippingAddressHandler = (data) => {
    
  };

  return (
    <>
      <Breadcrumps items={breadcrumbItems} />
      {toastData?.show && (
        <AlertNotification
          show={toastData?.show}
          message={toastData?.message}
          type={toastData?.type}
          onClose={toastOnclose}
        />
      )}

      <div className="grid grid-cols-12 gap-2 mb-3">
        {/* General Details Section - col-4 */}

        <div className="col-span-6  rounded-lg p-6 bg-white darkCardBg">
          <form
            ref={formRef}
            id="myForm"
            onSubmit={handleSubmit(addPurchaseHandler)}
          >
            <p className="text-lg text-secondary-300 font-medium flex items-center gap-2 mb-3">
              General Details
            </p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <FormInput
                label="E-Seva Bill Number "
                type="number"
                placeholder="Enter E-Seva Bill Number"
                register={register}
                id="e_seva_bill"
                errors={errors}
                showStar={false}
                validation={{
                  required: false,
                }}
              />
              <FormInput
                label="Purchase Order Number"
                type="number"
                placeholder="Enter Purchase Order Number"
                register={register}
                showStar={false}
                id="purchase_order_no"
                errors={errors}
                disabled={true}
                validation={{
                  required: false,
                }}
              />
            </div>

            <div className="grid grid-cols-12 gap-x-1 gap-y-0 content-end">
              {/* Vendor SearchableSelect takes 8 columns */}
              <div className="col-span-7">
                <SearchableSelect
                  label="Vendor"
                  id="vendor_id"
                  options={vendorList}
                  placeholder="Select Vendor"
                  validation={{ required: "Vendor is required" }} // Validation
                  showStar={true}
                  register={register} // Passing register directly
                  errors={errors} // Passing errors directly
                  setValue={setValue} // Passing setValue directly
                />
              </div>

              {/* DatePickerInput takes 4 columns */}
              <div className="col-span-5">
                <FormInput
                  id="date"
                  label="Date"
                  type="date"
                  register={register}
                  validation={{ required: "Date is required" }}
                  errors={errors}
                  placeholder="Select Date"
                  control={control}
                  minDate={minDate} // Optional: set a minimum date
                  maxDate={new Date()}
                />
              </div>

              {/* Description TextArea spans the entire width (col-span-12 for full width) */}
              <div className="col-span-12">
                <TextArea
                  id="description"
                  label="Description"
                  placeholder="Enter a description"
                  register={register}
                  showStar={false}
                  validation={{ required: false }}
                  errors={errors}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Billing Address Section - col-8 */}
        <div className="col-span-6  rounded-lg p-6 bg-white darkCardBg ">
          <div className="flex justify-between items-center mb-3">
            <p className="text-lg text-secondary-300 font-medium flex items-center gap-2 ">
              Address Details
            </p>
            {/* <div className="flex gap-3 mb-3 items-center"> */}
            <ToggleSwitch
              id="is_billing"
              label="Same as Billing address"
              checked={isBilling}
              onChange={(e) => setIsBilling(e.target.checked)}
            />
            {/* </div> */}
          </div>

          <div className="grid gap-5 grid-cols-2">
            <div>
              <p className="flex justify-between">Billing Address</p>

              <div className="card text-sm mt-3">
                <div className="flex justify-between mb-2">
                  <p className="text-xl font-semi-bold text primary capitalize">
                    {billingAddressData?.name}
                  </p>
                  <button
                    className="text-sm text-[#269bdd] hover:text-[#269bdd] hover:underline"
                    onClick={(e) => {
                      setDummyBilling(billingAddress)
                      setBillingModalData({
                        ...billingModalData,
                        show: true,
                      });
                    }}
                  >
                    Change
                  </button>
                </div>
                {billingAddressData?.address}
                <br />
                <span className="">Cell :{billingAddressData?.contact}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <p className="flex">Shipping Address</p>

                {/* <button className="text-base flex items-center text-[#269bdd] hover:text-[#269bdd] hover:underline">
                  {icons.add} Add
                </button> */}
              </div>

              <div className="card text-sm mt-3">
                <div className="flex justify-between mb-2 ">
                  <p className="text-xl font-semi-bold text primary capitalize">
                    {shippingAddressData?.name}
                  </p>
                  {!isBilling && (
                    <button
                      className="text-sm text-[#269bdd] hover:text-[#269bdd] hover:underline"
                      onClick={() => {
                        setShippingModalData({
                          ...shippingModalData,
                          show: true,
                        });
                      }}
                    >
                      Change
                    </button>
                  )}
                </div>
                <p>{shippingAddressData?.address}</p>
                <span className="">Cell :{billingAddressData?.contact}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FormCard>
        {/* Item Details Section */}
        {/* <DevTool control={control} /> */}
        <p className="flex justify-between width-3-4 my-2">
          <span className="font-bold">Item Details</span>
          <div>
            <ToggleSwitch
              className="font-normal"
              id="isCategoryBased"
              label="Search Item Based on Category"
              checked={isCategoryBased}
              onChange={(e) => setIsCategoryBased(e.target.checked)}
            />
          </div>
        </p>

        {isCategoryBased && (
          <div className="grid gap-3 grid-cols-2 width-3-4">
            <SearchableSelect
              options={categoryList}
              label="Category"
              id="category_id"
              placeholder="Select Category"
              register={materialRegister}
              validation={{ required: false }}
              errors={materialErrors}
              showStar={false}
              setValue={materialSetValue}
            />
            {
              <SearchableSelect
                options={subcategoryList}
                label="Sub Category"
                id="subcategory_id"
                placeholder="Select Category"
                register={materialRegister}
                validation={{ required: false }}
                errors={materialErrors}
                showStar={false}
                setValue={materialSetValue}
              />
            }
          </div>
        )}

        {/* Submit Buttons Section */}
        <FormProvider
          {...{ materialRegister, materialSetValue, materialErrors }}
        >
          <form onSubmit={materialHandleSubmit(ItemSubmitHandler)}>
            <div className="grid grid-cols-5 gap-3 justify-between content-end width-3-4">
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
                />
              </div>
            </div>
          </form>
        </FormProvider>

        {/* Item List Table */}
        <div className="item-list__table__container overflow-auto max-w-full">
          <table className="item-list__table overflow-auto">
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
                          onChange={(e) => handleInputChange(e, index, "unit")}
                          className="w-full border rounded h-8 min-w-16"
                        >
                          {unitList.map((unit) => (
                            <option key={unit.value} value={unit.value}>
                              {unit.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ width: "10%" }}>{formatToINR(item.cost)}</td>
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
                        <span>{formatToINR(totalAmountList.totalAmount)}</span>
                      </div>
                    </td>
                    <td>
                      <span>{formatToINR(totalAmountList.totalTaxAmount)}</span>
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
        <div className="my-3 flex justify-center gap-2">
          <SubmitBtn
            label="Save"
            style={{ background: "#aaadb1" }}
            onClick={theFormSubmit}
          />
          <SubmitBtn
            label="Save & Print"
            className="bg-secondary-500"
            onClick={theFormSubmit}
          />
        </div>
      </FormCard>

      <Modal
        isOpen={billingModalData?.show}
        title="Select Billing Address"
        onClose={handleModalClose}
        showFooter={false}
      >
        <div>
          <div className="grid grid-cols-2 gap-2">
            {billingAddList.map((item) => (
              <SelectableCard
                key={item?.id}
                id={item?.id}
                name={item?.name}
                contact={item?.contact}
                address={item?.address}
                isSelected={dummyBilling === item.id}
                onChange={dummyBillingChange}
              />
            ))}
          </div>
        </div>
        <div className=" mt-3 flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <IconButton
              type="button"
              label="Close"
              icon={React.cloneElement(icons.cancelIcon)}
              className="btn_cancel"
              onClick={handleModalClose}
            />
            <IconButton
              disabled ={!dummyBilling}
              type="button"
              label="Save"
              icon={React.cloneElement(icons.saveIcon)}
              onClick={handleBillingChange}
            />

          </div>
          <AddAddress data="" type="billing" />
        </div>
      </Modal>
      <Modal
        size="lg"
        showFooter={false}
        isOpen={isAddShippingModal}
        title="Add Billing Address"
        onClose={addBillingModalClose}
       
      >
        <div>
          <>
            <form onSubmit={billingSubmit(addBillingAddressHandler)}>
              <div className="grid gap-3 grid-cols-2">
                <FormInput
                  label="Name"
                  placeholder="Enter Name"
                  register={billingRegister}
                  id="name"
                  errors={billingErrors}
                  validation={{
                    required: "Name is Required",
                    pattern: {
                      value: validationPatterns.textOnly,
                      message: "Provide Valid Name",
                    },
                  }}
                />
                <FormInput
                  label="Contact Number"
                  placeholder="Enter Contact Number"
                  register={billingRegister}
                  id="contact"
                  errors={billingErrors}
                  validation={{
                    required: "Contact Number is Required",
                    pattern: {
                      value: validationPatterns.contactNumber,
                      message: "Provide Valid Contact Number",
                    },
                  }}
                />
                <FormInput
                  label="Door No"
                  placeholder="Enter Door No/Flat No"
                  register={billingRegister}
                  id="door_no"
                  errors={billingErrors}
                  validation={{
                    required: "Door no is Required",
                    pattern: {
                      value: validationPatterns.spacePattern,
                      message: "Provide Valid Door no",
                    },
                  }}
                />
                <FormInput
                  label="Area"
                  placeholder="Enter Area"
                  register={billingRegister}
                  id="area"
                  errors={billingErrors}
                  validation={{
                    required: "Area is Required",
                    pattern: {
                      value: validationPatterns.spacePattern,
                      message: "Provide Valid Area",
                    },
                  }}
                />
                <FormInput
                  label="Landmark"
                  placeholder="Enter Landmark"
                  register={billingRegister}
                  id="landmark"
                  showStar={false}
                  errors={billingErrors}
                  validation={{
                    required: false,
                  }}
                />
                <Select
                  options={stateList}
                  label="State"
                  id="state"
                  placeholder="Select state"
                  register={billingRegister}
                  validation={{ required: "State is required" }}
                  errors={billingErrors}
                />
                {districtList.length > 0 && (
                  <Select
                    options={districtList}
                    label="District"
                    id="district"
                    placeholder="Select District"
                    register={billingRegister}
                    validation={{ required: "District is required" }}
                    errors={billingErrors}
                  />
                )}
                <FormInput
                  label="Pincode"
                  placeholder="Enter Pincode"
                  register={billingRegister}
                  id="pincode"
                  errors={billingErrors}
                  validation={{
                    required: "Pincode is Required",
                    pattern: {
                      value: validationPatterns.pincode,
                      message: "Provide Valid pincode",
                    },
                  }}
                />
              </div>
              <div className="flex justify-end mt-3">
                <IconButton label="Add" icon={icons.plusIcon} type="submit" />
              </div>
            </form>
          </>
        </div>
      </Modal>

      <Modal
        isOpen={shippingModalData?.show}
        title="Select Shipping Address"
        onClose={handleShippingModalClose}
        showFooter={false}
      >
        <div className="flex gap-3">
          {shippingAddList.map((item) => (
            <SelectableCard
              key={item?.id}
              id={item?.id}
              name={item?.name}
              address={item?.address}
              isSelected={dummyShipping === item.id}
              contact={item?.contact}
              onChange={dummyShippingChange}
            />
          ))}
        </div>
        <div className=" mt-3 flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <IconButton
              type="button"
              label="Close"
              icon={React.cloneElement(icons.cancelIcon)}
              className="btn_cancel"
              onClick={handleShippingModalClose}
            />
            <IconButton
              disabled ={!dummyShipping}
              type="button"
              label="Save"
              icon={React.cloneElement(icons.saveIcon)}
              onClick={handleShippingChange}
            />

          </div>
          <AddAddress data="" type="shipping" />
        </div>
      </Modal>
      <Modal
        size="lg"
        showFooter={false}
        isOpen={isAddShippingModal}
        title="Add Shipping Address"
        onClose={addShippingModalClose}
        // footerButtons={[
        //   {
        //     text: "+ Add Address",
        //     className: "link-add",
        //   },
        //   {
        //     text: "Close",
        //     className: "",
        //   },
        // ]}
      >
        <div>
          <>
            <form onSubmit={shippingSubmit(addShippingAddressHandler)}>
              <div className="grid gap-3 grid-cols-2">
                <FormInput
                  label="Name"
                  placeholder="Enter Name"
                  register={shippingRegister}
                  id="name"
                  errors={billingErrors}
                  validation={{
                    required: "Name is Required",
                    pattern: {
                      value: validationPatterns.textOnly,
                      message: "Provide Valid Name",
                    },
                  }}
                />
                <FormInput
                  label="Contact Number"
                  placeholder="Enter Contact Number"
                  register={shippingRegister}
                  id="contact"
                  errors={billingErrors}
                  validation={{
                    required: "Contact Number is Required",
                    pattern: {
                      value: validationPatterns.contactNumber,
                      message: "Provide Valid Contact Number",
                    },
                  }}
                />
                <FormInput
                  label="Door No"
                  placeholder="Enter Door No/Flat No"
                  register={shippingRegister}
                  id="door_no"
                  errors={billingErrors}
                  validation={{
                    required: "Door no is Required",
                    pattern: {
                      value: validationPatterns.spacePattern,
                      message: "Provide Valid Door no",
                    },
                  }}
                />
                <FormInput
                  label="Area"
                  placeholder="Enter Area"
                  register={shippingRegister}
                  id="area"
                  errors={billingErrors}
                  validation={{
                    required: "Area is Required",
                    pattern: {
                      value: validationPatterns.spacePattern,
                      message: "Provide Valid Area",
                    },
                  }}
                />
                <FormInput
                  label="Landmark"
                  placeholder="Enter Landmark"
                  register={shippingRegister}
                  id="landmark"
                  showStar={false}
                  errors={billingErrors}
                  validation={{
                    required: false,
                  }}
                />
                <Select
                  options={stateList}
                  label="State"
                  id="state"
                  placeholder="Select state"
                  register={shippingRegister}
                  validation={{ required: "State is required" }}
                  errors={billingErrors}
                />
                {districtList.length > 0 && (
                  <Select
                    options={districtList}
                    label="District"
                    id="district"
                    placeholder="Select District"
                    register={shippingRegister}
                    validation={{ required: "District is required" }}
                    errors={billingErrors}
                  />
                )}
                <FormInput
                  label="Pincode"
                  placeholder="Enter Pincode"
                  register={shippingRegister}
                  id="pincode"
                  errors={billingErrors}
                  validation={{
                    required: "Pincode is Required",
                    pattern: {
                      value: validationPatterns.pincode,
                      message: "Provide Valid pincode",
                    },
                  }}
                />
              </div>
              <div className="flex justify-end mt-3">
                <IconButton label="Add" icon={icons.plusIcon} type="submit" />
              </div>
            </form>
          </>
        </div>
      </Modal>
    </>
  );
}

const AddressCards = ({ addresses, selectedId, onSelect }) => (
  <div>
    {addresses.map((address) => (
      <SelectableCard
        key={address.id}
        selected={selectedId === address.id}
        onClick={() => onSelect(address.id)}
      >
        {address.address}
      </SelectableCard>
    ))}
  </div>
);
