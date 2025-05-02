import React, { useEffect, useState } from 'react'
import Breadcrumps from '../../../UI/Breadcrumps/Breadcrumps'
import Button from '../../../UI/Buttons/Button/Button';
import { useNavigate } from 'react-router';
import { H5 } from '../../../UI/Heading/Heading';
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import icons from '../../../contents/Icons';
import { useDispatch } from 'react-redux';
import { getUnitInprogress } from "../../../redux/Utils/Unit/UnitAction"
import { Tooltip as ReactTooltip } from "react-tooltip";
import Pagination from "../../../UI/AgGridTable/Pagination/Pagination";
import Modal from "../../../UI/Modal/Modal";
import FormInput from '../../../UI/Input/FormInput/FormInput';
import { validationPatterns } from '../../../utils/Validation';
import SubmitBtn from '../../../UI/Buttons/SubmitBtn/SubmitBtn';
import { useForm } from 'react-hook-form';
import AlertNotification from '../../../UI/AlertNotification/AlertNotification';
import ExportButton from "../../../UI/AgGridTable/ExportBtn/ExportBtn";
import AddUnit from './AddUnit';
import { createUnitInprogress, createUnitInReset, updateUnitInprogress, updateUnitInReset } from '../../../redux/Utils/Unit/UnitAction';
import TextArea from '../../../UI/Input/TextArea/TextArea';
import IconButton from '../../../UI/Buttons/IconButton/IconButton';


export default function Unit() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [unitList, setUnitList] = useState();
  const [searchText, setSearchText] = useState("");
  const [dates, setDates] = useState({ startDate: null, endDate: null });
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState({ show: false });
  const [selectedUser, setSelectedUser] = useState();
  const [unitDatas, setunitDatas] = useState();

  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Unit", },

  ];
  const {
    register,
    formState: { touchedFields, errors },
    control,
    setValue,
    watch,
    reset,
    handleSubmit,
  } = useForm();


  const getUnitList = () => {
    const data = {
      page: paginationCurrentPage,
      pageSize: paginationPageSize,
    };
    dispatch(
      getUnitInprogress({
        ...data,
        callback: handleCategoryList,
      })
    );
  };

  useEffect(() => {
    getUnitList();
  }, [paginationCurrentPage, paginationPageSize]);

  const handleCategoryList = (data) => {
    setunitDatas(data)
    setUnitList(data?.data?.data);
  };

  const columnDefs = [
    { headerName: "Unit Name", field: "unit_name", unSortIcon: true },
    { headerName: "Description", field: "unit_description", unSortIcon: true },
    {
      headerName: "Action",
      field: "action", sortable: false,
      cellRenderer: (params) => {
        return <div className="flex gap-2">
          <button
            className="bg-gray-100  top-clr px-2 py-1 rounded" data-tooltip-id="edit"
            onClick={() => handleAction("edit", params)}
          >
            {icons.pencil}
          </button>
        </div>
      },
    },
  ];

  const handleAction = (action, e) => {
    const { id, unit_name, unit_description } = e?.data || {};

    if (action === "edit" && id) {
      setSelectedUser(e?.data);
      setIsUpdateModal(true);
      reset({ id, unit_name, unit_description });
    }
  };

  const handlePageChange = (page) => {
    setPaginationCurrentPage(page);
    getUnitList();
  };

  const handlePageSizeChange = (pageSize) => {
    setPaginationPageSize(pageSize);
    setPaginationCurrentPage(1);
    getUnitList();
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
    getUnitList();
  };
  // edit
  const categoryEditHandler = (data) => {
    const updatedData = {
      ...data,
      uuid: selectedUser?.uuid,
      id: selectedUser?.id
    };

    setLoading(true);
    dispatch(
      updateUnitInprogress({
        ...updatedData,
        callback: () => {
          setLoading(false);
          setIsUpdateModal(false);
          handleCreateSuccess();
          setToastData({
            show: true,
            message: "Unit updated successfully!",
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
      {toastData?.show === true && <AlertNotification
        show={toastData?.show}
        message={toastData?.message}
        type={toastData?.type}
        onClose={toastOnclose}

      />}
      <div className="rounded-lg p-2 my-2 bg-white darkCardBg">
        <Breadcrumps items={breadcrumbItems} /></div>

      <div className="bg-white py-3 rounded-lg darkCardBg">
        <div className="bg-white rounded-lg pe-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center p-4">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 pr-10 pl-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3  cursor-pointer" >
                  {icons.searchIcon}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="me-3">
              <AddUnit onSuccess={handleCreateSuccess} />
            </div>
            <div>
              <ExportButton label="Export" data={unitList} filename="Unit List" />
            </div>
          </div>
        </div>
      </div>

      {unitList?.length > 0 && (
        <ReusableAgGrid
          key={columnDefs.length}
          rowData={unitList}
          columnDefs={columnDefs}
          onGridReady={(params) => params.api.sizeColumnsToFit()}
          pagination={false}
        />
      )}

      <Pagination
        currentPage={paginationCurrentPage}
        totalPages={unitDatas?.data?.last_page || 1}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        startItem={unitDatas?.data?.from || 0}
        endItem={unitDatas?.data?.to || 0}
        totalItems={unitDatas?.data?.total || 0}
      />
      <ReactTooltip
        id="edit"
        place="top"
        content="Edit Unit"
      />
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
            label="Unit"
            placeholder="Enter Unit"
            register={register}
            id="unit_name"
            iconLabel={icons.unit}
            errors={errors}
            validation={{
              required: "Unit is Required",
              pattern: {
                minlength: 1,
                message: "Provide Valid Unit",
              },
            }}
          />
          <TextArea
            label="Description"
            placeholder="Enter ..."
            register={register}
            id="unit_description"
            iconLabel={icons.note}
            errors={errors}
            validation={{
              required: false
            }}
          />
                    <IconButton label="Update" icon={icons.saveIcon} type="submit" className="my-3" loading={loading} />
                    </form>
      </Modal>
    </>
  )
}
