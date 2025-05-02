import React, { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Breadcrumps from "../../../../UI/Breadcrumps/Breadcrumps";
import { H5 } from "../../../../UI/Heading/Heading";
import Button from "../../../../UI/Buttons/Button/Button";
import { useNavigate } from "react-router";
import ReusableAgGrid from "../../../../UI/AgGridTable/AgGridTable";
import { useDispatch } from "react-redux";
import { getMatSubCategoryInprogress } from "../../../../redux/Inventory/Material/SubCategory/SubCategoryAction";
import icons from "../../../../contents/Icons";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import ActionDropdown from "../../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import DateRangePickerComponent from "../../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent";
import ExportButton from "../../../../UI/AgGridTable/ExportBtn/ExportBtn";
import Pagination from "../../../../UI/AgGridTable/Pagination/Pagination";
import Modal from "../../../../UI/Modal/Modal";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import { validationPatterns } from "../../../../utils/Validation";
import SubmitBtn from "../../../../UI/Buttons/SubmitBtn/SubmitBtn";
import FormCard from "../../../../UI/Card/FormCard/FormCard";
import { useForm } from "react-hook-form";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";
import {
  updateMatSubCategoryInprogress,
  updateMatSubCategoryInReset,
} from "../../../../redux/Inventory/Material/SubCategory/SubCategoryAction";
import { getAllCategoryListEffect } from "../../../../redux/common/CommonEffects";
import Select from "../../../../UI/Select/SingleSelect";
import AddSubCategory from "./AddSubCategory";
import IconOnlyBtn from "../../../../UI/Buttons/IconOnlyBtn/IconOnlyBtn";
import SearchBar from "../../../../components/SearchBar/SearchBar";

export default function SubCategory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [subcategoryList, setSubCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState({ show: false });
  const [searchText, setSearchText] = useState("");
  const [dates, setDates] = useState({ startDate: null, endDate: null });
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [categoryDatas, setcategoryDatas] = useState();
  const [isViewModal, setIsViewModal] = useState(false);

  const {
    register,
    formState: { touchedFields, errors },
    control,
    setValue,
    watch,
    reset,
    handleSubmit,
  } = useForm();

  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Sub category" },
  ];
  const option = [
    { label: "View", action: "view", icon: icons.viewIcon },
    { label: "Edit", action: "edit", icon: icons.pencil },
  ];
  const handleAction = (action, e) => {
    setSelectedUser(e.data);
    const { uuid, category_name, subcategory_name, category_id } =
      e?.data || {};

    if (action === "edit" && uuid) {
      setIsUpdateModal(true);
      reset({ category_name, subcategory_name, category_id });
    }
    // if (action === "view" && uuid) {
    //   setIsViewModal(true);
    // }
  };
  const columnDefs = [
    {
      headerName: "Category Name",
      field: "category_name",
      unSortIcon: true,
    },
    {
      headerName: "SubCategory Name",
      field: "subcategory_name",
      unSortIcon: true,
    },
    // {
    //   headerName: "Brand",
    //   field: "brand",
    //   unSortIcon: true,
    // },
    {
      headerName: "Action",
      field: "action",
      sortable: false,
      cellRenderer: (params) => {
        return (
          <div className="flex gap-2">
            <IconOnlyBtn
              className="top-clr px-2 py-1 rounded"
              tooltipId="edit"
              tooltip="Edit"
              onClick={() => handleAction("edit", params)}
              icon={icons.pencil}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getCategoryList();
  }, [paginationCurrentPage, paginationPageSize, searchText]);

  const getCategoryList = async () => {
    const data = {
      page: paginationCurrentPage,
      pageSize: paginationPageSize,
      startDate: dates.startDate,
      endDate: dates.endDate,
      search: searchText,
    };
    dispatch(
      getMatSubCategoryInprogress({ ...data, callback: handleCategoryList })
    );
  };
  const handlePageChange = (page) => {
    setPaginationCurrentPage(page);
    getCategoryList();
  };

  const handlePageSizeChange = (pageSize) => {
    setPaginationPageSize(pageSize);
    setPaginationCurrentPage(1);
    getCategoryList();
  };
  const handleCategoryList = (data) => {
    setcategoryDatas(data);
    setSubCategoryList(data.data.data);
    setPaginationPageSize(data.data.total);
  };
  const handleCreateSuccess = () => {
    getCategoryList();
  };
  // Handle search text change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };
  // edit
  const categoryEditHandler = (data) => {
    const updatedData = {
      // ...data,
      category_name: data.category_id,
      subcategory_name: data.subcategory_name,
      uuid: selectedUser?.uuid,
    };

    setLoading(true);
    dispatch(
      updateMatSubCategoryInprogress({
        ...updatedData,
        callback: () => {
          setLoading(false);
          setIsUpdateModal(false);
          handleCreateSuccess();
          setToastData({
            show: true,
            message: "Category updated successfully!",
            type: "success",
          });
        },
      })
    );
  };
  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
  };
  useEffect(() => {
    if (categoryList.length === 0) {
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
    }
  }, []);
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
          <div className="flex items-center">
            <div className="flex items-center gap-4 justify-center p-4">
              {/* <div className="relative w-full max-w-md">
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
              </div> */}
              <SearchBar
                onChange={handleSearchChange}
                value={searchText}
                onClear={() => setSearchText("")}
              />
              <IconOnlyBtn
                icon={icons.clearFilter}
                tooltipId="clear-filter"
                tooltip="Clear Filter"
                className="top-clr"
                tooltipPlace="top"
                iconSize={26}
                onClick={() => {
                  setSearchText("");
                }}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="me-3">
              <AddSubCategory onSuccess={handleCreateSuccess} />
            </div>
            <div>
              <ExportButton
                label="Export"
                data={subcategoryList}
                filename="Sub Category List"
              />
            </div>
          </div>
        </div>
      </div>

      <ReusableAgGrid
        key={columnDefs.length}
        rowData={subcategoryList}
        columnDefs={columnDefs}
        defaultColDef={{ resizable: false }}
        pagination={false}
        onGridReady={(params) => params.api.sizeColumnsToFit()}
        //  tableWidth="80%"
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
        title="Update SubCategory"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(categoryEditHandler)}>
          <div className="flex flex-col gap-4">
            <FormInput
              label="Sub Category Name"
              placeholder="Enter Sub Category Name"
              register={register}
              id="subcategory_name"
              iconLabel={icons.TbCategoryPlus}
              errors={errors}
              validation={{
                required: "Sub Category name is Required",
                pattern: {
                  value: validationPatterns.textwithNumberOnly,
                  message: "Provide Valid Sub category",
                },
              }}
            />
            <Select
              options={categoryList}
              label="Category"
              id="category_id"
              iconLabel={icons.TbCategory}
              placeholder="Select Category"
              register={register}
              validation={{ required: "Category is required" }}
              errors={errors}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <Button
              label={"Cancel"}
              className="btn_cancel"
              onClick={() => {
                setIsUpdateModal(false);
                reset();
              }}
            />

            <IconButton
              label="Update"
              icon={icons.saveIcon}
              type="submit"
              className="my-3"
              loading={loading}
            />
          </div>
        </form>
      </Modal>
      {/* view */}
      {/* <Modal
        isOpen={isViewModal}
        onClose={() => setIsViewModal(false)}
        title="View Items"
        showHeader
        size="m"
        showFooter={false}
      >
        <div className="space-y-4">
          {selectedUser && (
            <>
              <div className=" p-4 rounded-lg">
                <p className="capitalize">
                  <span className="font-semibold">Category Name:</span>{" "}
                  {selectedUser.category_name}
                </p>
                <p className="capitalize">
                  <span className="font-semibold">Sub Category Name:</span>{" "}
                  {selectedUser.subcategory_name}
                </p>
                <p className="capitalize">
                  <span className="font-semibold"> Brand:</span>{" "}
                  {selectedUser.brand}
                </p>
              </div>
            </>
          )}
        </div>
      </Modal> */}
      {/* <ReactTooltip id="view" place="top" content="View" /> */}
    </>
  );
}
