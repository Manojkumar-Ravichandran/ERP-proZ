import React, { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Breadcrumps from "../../../../UI/Breadcrumps/Breadcrumps";
import ReusableAgGrid from "../../../../UI/AgGridTable/AgGridTable";
import { getMatCategoryInprogress } from "../../../../redux/Inventory/Material/Category/CategoryAction";
import icons from "../../../../contents/Icons";
import ActionDropdown from "../../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import DateRangePickerComponent from "../../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent";
import ExportButton from "../../../../UI/AgGridTable/ExportBtn/ExportBtn";
import "./AddCategory.jsx";
import AddCategory from "./AddCategory.jsx";
import Pagination from "../../../../UI/AgGridTable/Pagination/Pagination";
import Modal from "../../../../UI/Modal/Modal";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import { validationPatterns } from "../../../../utils/Validation";
import SubmitBtn from "../../../../UI/Buttons/SubmitBtn/SubmitBtn";
import FormCard from "../../../../UI/Card/FormCard/FormCard";
import { useForm } from "react-hook-form";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";
import {
  updateMatCategoryInprogress,
  updateMatCategoryInReset,
} from "../../../../redux/Inventory/Material/Category/CategoryAction";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../../UI/Buttons/Button/Button";
import IconOnlyBtn from "../../../../UI/Buttons/IconOnlyBtn/IconOnlyBtn.jsx";
import SearchBar from "../../../../components/SearchBar/SearchBar.jsx";

export default function Category() {
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Category" },
  ];
  const dispatch = useDispatch();
  const [categoryList, setCategoryList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dates, setDates] = useState({ startDate: null, endDate: null });
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
  const [categoryDatas, setcategoryDatas] = useState();
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState({ show: false });
  const { updateCategory } = useSelector((state) => state.materialCategory);
  const [selectedUser, setSelectedUser] = useState();
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

  const getCategoryList = () => {
    const data = {
      page: paginationCurrentPage,
      pageSize: paginationPageSize,
      startDate: dates.startDate,
      endDate: dates.endDate,
      search: searchText.trim(), // Ensure no unnecessary spaces
    };
  
    dispatch(
      getMatCategoryInprogress({
        ...data,
        callback: handleCategoryList,
      })
    );
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getCategoryList();
    }, 500); // Add a debounce effect to prevent unnecessary API calls
  
    // return () => clearTimeout(delayDebounceFn);
  }, [paginationCurrentPage, paginationPageSize, searchText]);
  const handleCategoryList = (data) => {
    let filteredData = data?.data?.data || [];
  
    if (searchText) {
      filteredData = filteredData.filter((item) =>
        item.category_name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  
    setcategoryDatas(data);
    setCategoryList(filteredData);
  };
  
  const option = [
    { label: "View", action: "view", icon: icons.viewIcon },
    { label: "Edit", action: "edit", icon: icons.pencil },
  ];
  const columnDefs = [
    { headerName: "Category Name", field: "category_name", unSortIcon: true },
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
  const handleAction = (action, e) => {
    setSelectedUser(e.data);
    const { uuid, category_name } = e?.data || {};

    if (action === "edit" && uuid) {
      setIsUpdateModal(true);
      reset({ category_name }); // Pre-fill the form in the modal with existing data
    }
    if (action === "view" && uuid) {
      setIsViewModal(true);
    }
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
  // Handle search text change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Handle date range change
  const handleDatesChange = ({ startDate, endDate }) => {
    setDates({ startDate, endDate });
  };
  const handleCreateSuccess = () => {
    getCategoryList();
  };
  // edit
  const categoryEditHandler = (data) => {
    const updatedData = {
      ...data,
      uuid: selectedUser?.uuid, // Pass the uuid of the selected category
    };

    setLoading(true);
    dispatch(
      updateMatCategoryInprogress({
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
            
            <div>
              <SearchBar onChange={handleSearchChange} value={searchText} onClear={()=>setSearchText('')} />
            </div>
            
            {/* <div>
              <DateRangePickerComponent
                className="darkCardBg"
                startDate={dates.startDate}
                endDate={dates.endDate}
                onDatesChange={handleDatesChange}
              />
            </div> */}
          </div>
          <div className="flex items-center gap-3">
            <div className="me-3">
              <AddCategory onSuccess={handleCreateSuccess} />
            </div>
            <div>
              <ExportButton
                label="Export"
                data={categoryList}
                filename="Inventory Master List"
              />
            </div>
            <button
              className="chips text-white px-1 py-1 rounded transition gap-2"
              onClick={() => {
                setSearchText("");
              }}
              >
              <span>{icons.clear}</span> Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* {categoryList?.length > 0 && ( */}
        <ReusableAgGrid
          key={columnDefs.length}
          rowData={categoryList}
          columnDefs={columnDefs}
          onGridReady={(params) => params.api.sizeColumnsToFit()}
          pagination={false}
        />
      {/* )} */}

      <Pagination
        currentPage={paginationCurrentPage}
        totalPages={categoryDatas?.data?.last_page || 1}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        startItem={categoryDatas?.data?.from || 0}
        endItem={categoryDatas?.data?.to || 0}
        totalItems={categoryDatas?.data?.total || 0}
      />
      {/* <ReactTooltip
        id="edit-category-btn"
        place="bottom"
        content="Edit Customer"
      /> */}
      <Modal
        isOpen={isUpdateModal}
        onClose={() => setIsUpdateModal(false)}
        title="Update Category"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(categoryEditHandler)}>
          <FormInput
            label="Category Name"
            placeholder="Enter Category Name"
            register={register}
            id="category_name"
            iconLabel={icons.TbCategory}
            errors={errors}
            validation={{
              required: "Category name is Required",
              pattern: {
                value: validationPatterns.textwithNumberOnly,
                message: "Provide Valid Name",
              },
            }}
          />
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
              </div>
            </>
          )}
        </div>
      </Modal>
      <ReactTooltip id="view" place="top" content="View" />
    </>
  );
}
