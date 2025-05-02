import React, { useEffect, useState } from "react";
import Breadcrumps from "../../../../UI/Breadcrumps/Breadcrumps";
import { useNavigate } from "react-router";
import { H5 } from "../../../../UI/Heading/Heading";
import Button from "../../../../UI/Buttons/Button/Button";
import ReusableAgGrid from "../../../../UI/AgGridTable/AgGridTable";
import ActionDropdown from "../../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import { getMatItemInprogress } from "../../../../redux/Inventory/Material/Item/ItemAction";
import icons from "../../../../contents/Icons";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import Pagination from "../../../../UI/AgGridTable/Pagination/Pagination";
import Modal from "../../../../UI/Modal/Modal";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import { validationPatterns } from "../../../../utils/Validation";
import SubmitBtn from "../../../../UI/Buttons/SubmitBtn/SubmitBtn";
import FormCard from "../../../../UI/Card/FormCard/FormCard";
import { useForm } from "react-hook-form";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";
import {
  updateMatItemInprogress,
  updateMatItemInReset,
} from "../../../../redux/Inventory/Material/Item/ItemAction";
import { useDispatch, useSelector } from "react-redux";
import ExportButton from "../../../../UI/AgGridTable/ExportBtn/ExportBtn";
import DateRangePickerComponent from "../../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent";
import AddItem from "./AddItem";
import {
  getAllCategoryListEffect,
  getAllUnitListEffect,
  getAllSubCategoryListEffect,
  addRefernceEffect,
} from "../../../../redux/common/CommonEffects";
import Select from "../../../../UI/Select/SingleSelect";
import SearchableSelect from "../../../../UI/Select/SearchableSelect";
import SingleCheckbox from "../../../../UI/Input/CheckBoxInput/SingleCheckbox";
import DataShow from "./DataShow";
import { formatToINR } from "../../../../utils/Rupees";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import Selecter from "../../../../UI/WithoutHook/Selecter/Selecter";
export default function Item() {
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    {
      id: 2,
      label: "Item",
    },
  ];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [itemList, setItemList] = useState([]);
  // const [inventoryList, setinventoryList] = useState([]);
  // const [searchTerm, setSearchTerm] = useState('');
  // const [isOpen, setIsOpen] = useState(false);
  // const [selectedValue, setSelectedValue] = useState('');
  const [searchText, setSearchText] = useState("");
  const [dates, setDates] = useState({ startDate: null, endDate: null });
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
  const [categoryDatas, setcategoryDatas] = useState();
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState({ show: false });
  const [selectedUser, setSelectedUser] = useState();
  const [unitList, setUnitList] = useState([]);
  const { updateItem } = useSelector((state) => state.materialItem);
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubategoryList] = useState([]);
  const [isViewModal, setIsViewModal] = useState(false);
  const [filterList, setFilterList]=useState({category:'ALL',subcategory:'ALL'})

  const {
    register,
    formState: { touchedFields, errors },
    control,
    setValue,
    watch,
    reset,
    handleSubmit,
  } = useForm();
  const getItemList = () => {
    const data = {
      page: paginationCurrentPage,
      pageSize: paginationPageSize,
      startDate: dates.startDate,
      endDate: dates.endDate,
      search:searchText,
      ...filterList
    };
    dispatch(
      getMatItemInprogress({
        ...data,
        callback: handleItemList,
      })
    );
  };
  useEffect(() => {
    getItemList();
  }, [paginationCurrentPage, paginationPageSize,searchText,filterList]);

  const handleItemList = (data) => {
    setcategoryDatas(data);
    setItemList(data?.data?.data);
  };
  const option = [
    { label: "View", action: "view", icon: icons.viewIcon },
    { label: "Edit", action: "edit", icon: icons.pencil },
  ];
  const handleAction = (action, e) => {
    setSelectedUser(e.data);
    const {
      uuid,
      category_name,
      subcategory_name,
      material_name,
      hsn_code,
      gst_percentage,
      unit_name,
      material_code,
      comp_cost,
      cust_cost,
      unit,
      subcategory_id,
      category_id,
      is_asset,
      is_traceability,
    } = e?.data || {};

    if (action === "edit" && uuid) {
      setIsUpdateModal(true);
      reset({
        category_name,
        subcategory_name,
        material_name,
        hsn_code,
        gst_percentage,
        unit_name,
        material_code,
        comp_cost,
        cust_cost,
        unit,
        subcategory_id,
        category_id,
        is_asset,
        is_traceability,
      });
    }
    if (action === "view" && uuid) {
      setIsViewModal(true);
    }
  };
  const columnDefs = [
    { headerName: "Item Name", field: "material_name", unSortIcon: true },
    
    // { headerName: "HSN Code", field: "hsn_code",unSortIcon: true },
    // { headerName: "GST %", field: "gst_percentage",unSortIcon: true },
    { headerName: "Category Name", field: "category_name", unSortIcon: true },
    {
      headerName: "Sub Category Name",
      field: "subcategory_name",
      unSortIcon: true,
    },
    { headerName: "Unit", field: "unit_name", unSortIcon: true },
    { headerName: "Variant", field: "variant", unSortIcon: true },
    { headerName: "Colours", field: "color", unSortIcon: true },
    {
      headerName: "Action",
      field: "action",
      pinned: "right",
      cellRenderer: (params) => {
        return (
          <div className="flex gap-2">
            <ActionDropdown
              options={option}
              onAction={(e) => handleAction(e, params, params.data)}
            />
          </div>
        );
      },
    },
  ];
  const handlePageChange = (page) => {
    setPaginationCurrentPage(page);
    getItemList();
  };

  const handlePageSizeChange = (pageSize) => {
    setPaginationPageSize(pageSize);
    setPaginationCurrentPage(1);
    getItemList();
  };
  // Handle search text change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };
  const handleCategoryChange = (e) => {
    setFilterList({...filterList,category:e.target.value})
  };

  // Handle date range change
  const handleDatesChange = ({ startDate, endDate }) => {
    setDates({ startDate, endDate });
  };
  const handleCreateSuccess = () => {
    getItemList();
  };

  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
  };
  // edit
  useEffect(() => {
      (async () => {
        try {
          let { data } = await getAllSubCategoryListEffect();
          data = data.data.map((list) => ({
            label: list.subcategory_name,
            value: list.id,
          }));
          setSubategoryList(data);
        } catch (error) {
          setSubategoryList([]);
        }
      })();
  }, []);
  useEffect(() => {
      (async () => {
        try {
          let { data } = await getAllCategoryListEffect();
          data = data.data.map((list) => ({
            label: list.category_name,
            value: list.id,
          }));
          setCategoryList(data);
        } catch (error) {
          setCategoryList([]);
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
    reset();
    setLoading(false);
    if (updateItem.success === true) {
      setToastData({
        show: true,
        message: updateItem?.data.message,
        type: "success",
      });
      dispatch(updateMatItemInReset());
      setIsUpdateModal(false);
      getItemList();
    } else if (updateItem.error === true) {
      setToastData({ show: true, message: updateItem?.message, type: "error" });
      dispatch(updateMatItemInReset());
    }
  }, [updateItem]);

  const EditItemHandler = (data) => {
    dispatch(updateMatItemInprogress({ ...data, uuid: selectedUser?.uuid }));
  };
  const [inventoryList, setinventoryList] = useState([]); // State for the fetched list
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility
  const [selectedValue, setSelectedValue] = useState(""); // State for the selected value

  // Fetch data from API on component mount
  useEffect(() => {
      (async () => {
        try {
          let { data } = await addRefernceEffect(); // Replace with your API call
          data = data.data.map((list) => ({
            label: list.name,
            value: list.id,
          }));
          setinventoryList(data); // Update inventory list with fetched data
        } catch (error) {
          setinventoryList([]); // Handle error by setting empty list
        }
      })();
  }, []);

  // Filter options based on search term
  const filteredOptions = inventoryList.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle option selection
  const handleSelect = (value, label) => {
    setSelectedValue(label);
    setSearchTerm("");
    setIsOpen(false);
  };
  const handleClearFilters = () => {
    setFilterList({category:'ALL',subcategory:'ALL'})
    setSearchText('')
  }
  return (
    <>
      {toastData?.show === true && (
        <AlertNotification
          show={toastData?.show}
          message={toastData?.message}
          type={toastData?.type}
          onClose={toastOnclose}
        />
      )}
      <div className="rounded-lg p-2 my-2 bg-white darkCardBg">
        <Breadcrumps items={breadcrumbItems} />
      </div>
      <div className="bg-white py-3 rounded-lg darkCardBg">
        <div className="bg-white rounded-lg pe-3 flex items-center justify-between">
          <div className="flex items-end gap-4">
            {/* <div className="flex items-center justify-center p-4">
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
            </div> */}
            <SearchBar
              value={searchText}
              onChange={handleSearchChange} 
              onClear={()=>setSearchText('')}
            />
            {/* <div>
              <select id="inventory" className="border rounded-md p-2 px-3 text-gray-800">
                <option value="" >Select Inventory</option>
                {inventoryList.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div> */}
            {/*  */}
            <Selecter 
            id="category"
            list={[{value:"ALL", label:"ALL"},...categoryList]}
            onChange={handleCategoryChange}
            value={filterList?.category}
            />
             <button
                        className="chips text-white px-1 py-1 rounded transition float-end gap-2"
                        onClick={handleClearFilters}
                      >
                        <span>{icons.clear}</span> Clear Filters
                      </button>
            {/* <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select an option..."
                  value={isOpen ? searchTerm : selectedValue}
                  onClick={() => setIsOpen(!isOpen)}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsOpen(true);
                  }}
                  className="border rounded-md p-2 px-3 text-gray-800 w-full focus:outline-none cursor-pointer pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {icons.downArrowIcon}
                </div>
              </div>

              {isOpen && (
                <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg z-10">
                  <div className="max-h-48 overflow-y-auto">
                    {filteredOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => handleSelect(option.value, option.label)}
                        className="p-2 px-3 darkCardBg hover:bg-gray-100 cursor-pointer"
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div> */}
            {/*  */}
          </div>
          <div className="flex items-center">
            <div className="me-3">
              <AddItem onSuccess={handleCreateSuccess} />
            </div>
            <div>
              <ExportButton
                label="Export"
                data={itemList}
                filename="Inventory Item List"
              />
            </div>
          </div>
        </div>
      </div>
      {/* TABLE */}
      <ReusableAgGrid
        key={columnDefs.length}
        rowData={itemList}
        columnDefs={columnDefs}
        onGridReady={(params) => params.api.sizeColumnsToFit()}
        pagination={false}
      />
      <Pagination
        currentPage={paginationCurrentPage}
        totalPages={categoryDatas?.data?.last_page || 1}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        startItem={categoryDatas?.data?.from || 0}
        endItem={categoryDatas?.data?.to || 0}
        totalItems={categoryDatas?.data?.total || 0}
      />
      <Modal
        isOpen={isUpdateModal}
        onClose={() => setIsUpdateModal(false)}
        title="Update Item"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(EditItemHandler)}>
          <div className="flex flex-col gap-4">
            <Select
              options={categoryList}
              label="Category"
              id="category_id"
              placeholder="Select Category"
              iconLabel={icons.TbCategory}
              register={register}
              validation={{ required: "catagory Required" }}
              errors={errors}
            />
            <Select
              options={subcategoryList}
              label="Sub Category"
              iconLabel={icons.TbCategoryPlus}
              id="subcategory_id"
              placeholder="Select Sub Category"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />
            <FormInput
              label="Item name"
              placeholder="Enter Item Name"
              iconLabel={icons.itemBox}
              register={register}
              id="material_name"
              errors={errors}
              validation={{
                required: "Item name is Required",
                pattern: {
                  value: validationPatterns.textwithNumberOnly,
                  message: "Provide Valid Item ",
                },
              }}
            />
            <Select
              options={unitList}
              label="Unit"
              id="unit"
              iconLabel={icons.unit}
              placeholder="Select Unit"
              register={register}
              validation={{ required: "Unit is Required" }}
              errors={errors}
            />
            <FormInput
              label="Variant"
              placeholder="Enter Variant"
              iconLabel={icons.itemBox}
              register={register}
              id="material_name"
              errors={errors}
              validation={{
                required: "Variant is Required",
                pattern: {
                  value: validationPatterns.textwithNumberOnly,
                  message: "Provide Valid Item ",
                },
              }}
            />
            <FormInput
              label="Colour"
              placeholder="Enter Colour"
              iconLabel={icons.itemBox}
              register={register}
              id="material_name"
              errors={errors}
              validation={{
                required: "Colour is Required",
                pattern: {
                  value: validationPatterns.textwithNumberOnly,
                  message: "Provide Valid Item ",
                },
              }}
            />
            <FormInput
              label="HSN Code"
              placeholder="Enter HSN Code"
              iconLabel={icons.circleCheck}
              register={register}
              id="hsn_code"
              errors={errors}
              validation={{
                required: "HSN Code is Required",
                minLength: {
                  value: 4,
                  message: "HSN Code must be at least 4 characters",
                },
                maxLength: {
                  value: 8,
                  message: "HSN Code must be no more than 8 characters",
                },
                pattern: {
                  value: validationPatterns.hsnCode,
                  message: "Provide Valid HSN Code ",
                },
              }}
            />

            <FormInput
              label="GST"
              showStar={true}
              placeholder="Enter GST %"
              iconLabel={icons.money}
              register={register}
              id="gst_percentage"
              errors={errors}
              validation={{
                required: "GST is Required",
                pattern: {
                  value: validationPatterns.percentage,
                  message: "Provide Valid GST ",
                },
              }}
              // validation={{
              //   required: "GST is Required",
              //   minLength: {
              //     value: 1,
              //     message: "GST at least should have 1 character",
              //   },
              //   maxLength: {
              //     value: 3,
              //     message: "GST must be no more than 3 characters",
              //   },
              //   min: {
              //     value: 1,
              //     message: "GST must be at least 1",
              //   },
              //   max: {
              //     value: 100,
              //     message: "GST must not exceed 100",
              //   },
              //   pattern: {
              //     value: validationPatterns.spacePattern,
              //     message: "Provide Valid GST ",
              //   },
              // }}
            />
            <FormInput
              label="Item code"
              placeholder="Enter Item Code"
              register={register}
              iconLabel={icons.itemCode}
              id="material_code"
              errors={errors}
              showStar={false}
              validation={{
                required: false,
              }}
            />

            <FormInput
              label="Purchase Rate"
              placeholder="Buying Rate Rs."
              iconLabel={icons.moneyIcon}
              register={register}
              id="comp_cost"
              errors={errors}
              validation={{
                required: "Company rate is Required",
                minLength: {
                  value: 1,
                  message: "Rate at least should have 1 rupees",
                },
                min: {
                  value: 1,
                  message: "Rate must be at least 1",
                },
                pattern: {
                  value: validationPatterns.spacePattern,
                  message: "Provide Valid Rupees",
                },
              }}
            />
            <FormInput
              label="Sales Rate"
              placeholder="Customer Rate Rs."
              register={register}
              id="cust_cost"
              iconLabel={icons.moneyIcon}
              errors={errors}
              validation={{
                required: "Customer rate is Required",
                minLength: {
                  value: 1,
                  message: "Rate at least should have 1 rupees",
                },
                min: {
                  value: 1,
                  message: "Rate must be at least 1",
                },
                pattern: {
                  value: validationPatterns.spacePattern,
                  message: "Provide Valid Rupees",
                },
              }}
            />
            <SingleCheckbox
              id="is_asset"
              label="Mark as Asset"
              register={register}
              errors={errors}
              validation={{
                required: false,
              }}
            />
            <SingleCheckbox
              id="is_traceability"
              label="Enable Traceability"
              register={register}
              errors={errors}
              validation={{
                required: false,
              }}
            />
          </div>
          <IconButton
            label="Update"
            icon={icons.saveIcon}
            type="submit"
            className="my-3"
            loading={loading}
          />
        </form>
      </Modal>
      {/* view */}
      <Modal
        isOpen={isViewModal}
        onClose={() => setIsViewModal(false)}
        title="View Items"
        showHeader
        size="l"
        showFooter={false}
      >
        <div className="space-y-4">
          {selectedUser && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <DataShow
                  label="Category Name"
                  value={selectedUser?.category_name}
                  icon={React.cloneElement(icons.TbCategory, { size: 24 })}
                />
                {selectedUser?.subcategory_name && (
                  <DataShow
                    label="Subcategory Name"
                    value={selectedUser?.subcategory_name}
                    icon={React.cloneElement(icons.TbCategoryPlus, {
                      size: 24,
                    })}
                  />
                )}
                <DataShow
                  label="Item Name"
                  value={selectedUser?.material_name}
                  icon={React.cloneElement(icons.itemBox, { size: 24 })}
                />
                <DataShow
                  label="Item Name"
                  value={selectedUser?.material_name}
                  icon={React.cloneElement(icons.itemBox, { size: 24 })}
                />
                <DataShow
                  label="Unit"
                  value={selectedUser?.unit_name}
                  icon={React.cloneElement(icons.unit, { size: 24 })}
                />
                <DataShow
                  label="Varient"
                  value={selectedUser?.variant}
                  icon={React.cloneElement(icons.varientIcon, { size: 24 })}
                />
                <DataShow
                  label="Colour"
                  value={selectedUser?.color}
                  icon={React.cloneElement(icons.color, { size: 24 })}
                />
                <DataShow
                  label="HSN Code"
                  value={selectedUser?.hsn_code}
                  icon={React.cloneElement(icons.circleCheck, { size: 24 })}
                />
                <DataShow
                  label="GST %"
                  value={selectedUser?.gst_percentage}
                  icon={React.cloneElement(icons.money, { size: 24 })}
                />
                <DataShow
                  label="Item Code"
                  value={selectedUser?.itemCode}
                  icon={React.cloneElement(icons?.itemCode, { size: 24 })}
                />
                <DataShow
                  label="Purchase Rate (Rs.)"
                  value={formatToINR(selectedUser?.comp_cost)}
                  icon={React.cloneElement(icons.moneyIcon, { size: 24 })}
                />
                <DataShow
                  label="Is Asset"
                  value={selectedUser?.is_asset ? "Yes" : "No"}
                  icon={React.cloneElement(icons?.itemBox, { size: 24 })}
                />
                <DataShow
                  label="Traceability"
                  value={selectedUser?.is_traceability ? "Yes" : "No"}
                  icon={React.cloneElement(icons.traceability, { size: 24 })}
                />
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
