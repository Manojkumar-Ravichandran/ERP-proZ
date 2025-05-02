import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import {
  fetchMaterialRequest,
  updateMaterialRequest,
  deleteMaterialRequest,
  approveMaterialRequest,
  cancelMaterialRequest,
  declineMaterialRequest,
} from "../../../redux/Inventory/MaterialRequest/MaterialRequestAction";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import Pagination from "../../../UI/AgGridTable/Pagination/Pagination";
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import icons from "../../../contents/Icons";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import ExportButton from "../../../UI/AgGridTable/ExportBtn/ExportBtn";
import DateRangePickerComponent from "../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent";
import Modal from "../../../UI/Modal/Modal";
import ActionDropdown from "../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import { useForm, useFieldArray } from "react-hook-form";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import {
  getEmployeeListEffect,
  getAllUnitListEffect,
  getAllItemListEffect,
  getAllInventoryMasterListEffect,
} from "../../../redux/common/CommonEffects";
import Select from "../../../UI/Select/SingleSelect";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import AddMaterialRequest from "./AddMaterialRequest";
import ModalCenter from "../../../UI/ModalCenter/ModalCenter";
import FileInput from "../../../UI/Input/FileInput/FileInput";
import formatDateForDisplay from "../../../UI/Date/DateDisplay";
import formatDateForInput from "../../../UI/Date/Date";
import SearchableSelect from "../../../UI/Select/SearchableSel";
import { getUserLocalStorage } from "../../../utils/utils";
import { formatToINR } from "../../../utils/Rupees";
import { v4 as uuidv4 } from "uuid";
import { validationPatterns } from "../../../utils/Validation";
import StatusManager from "../../../UI/StatusManager/StatusManager";
import { convertDMYtoYMD, convertToIST } from "../../../utils/Date";
import SearchBar from "../../../components/SearchBar/SearchBar.jsx";

const MaterialRequestList = () => {
  const dispatch = useDispatch();
  // Redux state
  const {
    inventory = [],
    pagination = {},
    error,
  } = useSelector((state) => state.MaterialRequest || {});
  const stockEntryData = inventory?.data || [];
  const {
    register,
    control,
    reset,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const {
    register: itemRegister,
    formState: { errors: itemErrors },
    handleSubmit: itemHandleSubmit,
    reset: itemReset,
    setValue: itemSetValue,
    watch: itemWatch,
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items", // ✅ This should match the defaultValues key
  });

  const [toastData, setToastData] = useState({ show: false });
  const navigate = useNavigate();
  const [unitList, setUnitList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [isViewModal, setIsViewModal] = useState(false);
  const [isCancelModal, setIsCancelModal] = useState(false);
  const [isApproveModal, setIsApproveModal] = useState(false);
  const [isDeclineModal, setIsDeclineModal] = useState(false);
  // Destructure pagination safely
  const current_page = pagination?.current_page || 1;
  const total_pages = pagination?.last_page || 1;
  const total_items = pagination?.total || 0;

  // Component state
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [paginationCurrentPage, setPaginationCurrentPage] =
    useState(current_page);
  const [searchText, setSearchText] = useState("");
  const [isMasterCreateModal, setIsMasterCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [loading, setLoading] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [invList, setInvList] = useState([]);
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Material Request List", link: "" },
  ];
  const [logData, setLogData] = useState(null);
  const [filteredItemList, setFilteredItemList] = useState([]);
  const [totalAmountList, setTotalAmountList] = useState({});
  const [fileUrl, setFileUrl] = useState(selectedUser?.photo || null);
  // Function to fetch inventory master data
  const fetchData = () => {
    dispatch(
      fetchMaterialRequest({
        page: paginationCurrentPage,
        per_page: paginationPageSize,
        search:searchText
      })
    );
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, paginationCurrentPage, paginationPageSize,searchText]);

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
    { label: "Edit", action: "edit", icon: icons.pencil },
    { label: "View", action: "view", icon: icons.eyeIcon },
    { label: "Approve", action: "approve", icon: icons.tick },
    { label: "Cancel", action: "cancel", icon: icons.cancelIcon },
    { label: "Decline", action: "decline", icon: icons.cancelIcon },
  ];
  useEffect(() => {
    const logDatas = getUserLocalStorage();
    
    setLogData(logDatas?.userInfo);
  }, []);
  const handleAction = (action, params, master) => {
    setSelectedUser(params?.data);

    const {
      uuid,
      id,
      date,
      item_id,
      inv_id,
      quantity,
      unit,
      unit_name,
      item_name,
      sales_by,
      sales_by_name,
      sales_to,
      scrap_reason,
      sales_rate,
      request_material,
    } = params?.data || {};

    if (action === "edit" && params.data) {
      setSelectedItems([]);
      setValue("uuid", uuid);
      setValue("date", formatDateForInput(date));
      setValue("inv_id", inv_id);
      setValue("item_id", item_id);

      request_material.map((item) => {
        ItemSubmitHandler(item);
      });

      setIsUpdateModal(true);
    } else if (action === "view" && params?.data?.uuid && params?.data?.id) {
      setSelectedRequest(params.data);
      setIsViewModal(true);
    } else if (action === "cancel" && uuid && id) {
      setSelectedMaster(master);
      setIsCancelModal(true);
    } else if (action === "decline" && uuid && id) {
      setSelectedMaster(master);
      setIsDeclineModal(true);
    } else if (action === "approve" && params?.data?.uuid) {
      setSelectedUser(params.data);
      setSelectedMaster(master);
      setIsApproveModal(true);
    }
  };

  const columnDefs = [
    { headerName: "Inventory", field: "inv_name", unSortIcon: true },
    { headerName: "Request ID", field: "request_id", unSortIcon: true },
    { headerName: "Created By", field: "created_by", unSortIcon: true },

    {
      headerName: "Date",
      field: "date",
      unSortIcon: true,
      valueGetter: (params) => {
        return params.data.date ? formatDateForDisplay(params.data.date) : "-";
      },
    },
    {
      headerName: "Status",
      field: "status",
      unSortIcon: true,
      cellRenderer: (params) => {
        if (params.data.status === 1) {
          // return <span className="badge bg-yellow">Pending</span>;
          return <StatusManager message={"Pending"} status="darkpurple" />;
        } else if (params.data.status === 0) {
          return <StatusManager message={"Cancelled"} status="darkpink" />;
        } else if (params.data.status === 2) {
          return <StatusManager message={"Approved"} status="lightgreen" />;
        } else if (params.data.status === 3) {
          return <StatusManager message={"Declined"} status="darkRed" />;
        }
      },
    },

    {
      headerName: "Action",
      field: "action",
      sortable: false,
      pinned: "right",
      cellRenderer: (params) => {
        const fil_options = [
          { label: "View", action: "view", icon: icons.eyeIcon },
          // { label: "Approve", action: "approve", icon: icons.tick },
          // { label: "Cancel", action: "cancel", icon: icons.cancelIcon },
        ];
        if (params?.data?.status === 1) {
          fil_options.push({
            label: "Edit",
            action: "edit",
            icon: icons.pencil,
          });
          if (logData?.role === 100) {
            fil_options.push({
              label: "Approve",
              action: "approve",
              icon: icons.tick,
            });
            fil_options.push({
              label: "Decline",
              action: "decline",
              icon: icons.cancelIcon,
            });
          } else if (logData?.role !== 100 && params?.data?.status === 1) {
            fil_options.push({
              label: "Cancel",
              action: "cancel",
              icon: icons.cancelIcon,
            });
          }
        }

        return (
          <div>
            <ActionDropdown
              options={fil_options}
              onAction={(e) => handleAction(e, params, params.data)}
            />
          </div>
        );
      },
    },
  ];
  const masterHandler = (response) => {
    if (response.success) {
      setToastData({
        show: true,
        message: response.data.message,
        type: "success",
      });
      setIsUpdateModal(false);
      setIsApproveModal(false);
      setIsDeclineModal(false);
      setIsCancelModal(false);
      fetchData();
    } else {
      setToastData({ show: true, message: response.error, type: "error" });
    }
    setLoading(false);
    reset();
  };

  // Submit Handler for Updating Material Request
  const updateHandler = (e) => {
    // const updatedDate = getValues("date") || selectedItems[0]?.date || ""; // Ensure date is not empty

    const payload = {
      uuid: selectedUser?.uuid || "", // UUID of the material request
      date: e?.date,
      inv_id: e?.inv_id,
      total_quantity: selectedItems.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
      ), // Sum of all quantities
      items: selectedItems.map((item) => ({
        item_id: item.item_id,
        quantity: item.quantity,
        unit: item.unit,
        item_name: item.item_name,
      })),
    };
    dispatch(updateMaterialRequest({ ...payload, callback: masterHandler }));
    // dispatch(updateMaterialRequest(payload))
    //   .then((response) => {
    //     
    //     setIsUpdateModal(false); // Close modal
    //   })
    //   .catch((error) => {
    //     console.error("Update failed:", error);
    //   });
  };

  const cancelHandler = (data) => {
    const selectedItem = itemList.find(
      (item) => item.value === Number(data.item_id)
    );
    dispatch(
      cancelMaterialRequest({
        uuid: data.uuid,
        cancel_reason: data.cancel_reason,
        callback: masterHandler,
      })
    );
  };
  const declineHandler = (data) => {
    dispatch(
      declineMaterialRequest({
        uuid: data.uuid,
        decline_reason: data.decline_reason,
        callback: masterHandler,
      })
    );
  };
  const approveHandler = (data) => {
    dispatch(
      approveMaterialRequest({
        uuid: data.uuid,
        approve_reason: data.approve_reason,
        callback: masterHandler,
      })
    );
  };

  const toastOnclose = () => {
    setToastData({ ...toastData, show: false });
  };

  // State for modals and selected master
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState(null);

  // Function to handle delete response
  const deleteHandler = (response) => {
    if (response?.success) {
      setToastData({
        show: true,
        message: response.data.message,
        type: "success",
      });
      setIsDeleteModalOpen(false);
      fetchData();
    } else {
      setToastData({
        show: true,
        message: response?.error || "Error deleting item",
        type: "error",
      });
    }
    setLoading(false);
  };

  // Function to handle delete confirmation
  const confirmDelete = () => {
    setLoading(true);
    if (selectedMaster) {
      try {
        const result = dispatch(
          deleteMaterialRequest({ ...selectedMaster, callback: deleteHandler })
        );
        
      } catch (error) {
        console.error("Error during deletion: ", error);
        setToastData({ show: true, message: "Deletion failed", type: "error" });
      }
    }
  };
  // Function to handle cancel
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

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
        let { data } = await getAllUnitListEffect();
        data = data.data.map((list) => ({
          ...list,

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
  useEffect(() => {
    (async () => {
      try {
        let inventoryData = await getAllInventoryMasterListEffect();

        setInvList(
          inventoryData?.data?.data.map((inv) => ({
            label: inv.name,
            value: inv.id,
          }))
        );
      } catch (error) {
        setInvList([]);
      }
    })();
  }, []);

  // Handle Input Changes
  const handleUpdate = (index, field, value) => {
    const updatedItems = [...selectedItems];
    updatedItems[index][field] = value;
    setSelectedItems(updatedItems);
  };

  // Handle Row Deletion
  const handleDelete = (index) => {
    const updatedItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(updatedItems);
  };

  /* Update Item */
  const handleDeleteItem = (index) => {
    setSelectedItems((prevList) => prevList.filter((_, i) => i !== index));
  };
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
    

    setSelectedItems((prevList) => [...prevList, newItem]);
    itemReset();
    setValue("quantity", 1);
  };

  const handleInputChange = (e, index, field) => {
    const { value } = e.target;

    setSelectedItems((prevList) => {
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
    if (selectedItems?.length > 0) {
      setTotalAmountList(calculateTotalAmount());
      const idsToRemove = selectedItems.map((item) => item.id);

      const updatedItemList = itemList.filter(
        (item) => !idsToRemove.includes(item.id)
      );
      setFilteredItemList(updatedItemList);
    } else {
      setFilteredItemList([...itemList]);
    }
  }, [selectedItems, itemList]);
  const calculateTotalAmount = () => {
    if (selectedItems.length === 0)
      return { totalAmount: 0, totalTaxAmount: 0, totalWithoutTaxAmount: 0 };
    return selectedItems.reduce(
      (totals, item) => ({
        totalAmount: totals.totalAmount + item.total_cost,
        totalTaxAmount: totals.totalTaxAmount + item.tax_amount,
        totalWithoutTaxAmount:
          totals.totalWithoutTaxAmount + item.without_tax_cost,
      }),
      { totalAmount: 0, totalTaxAmount: 0, totalWithoutTaxAmount: 0 }
    );
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
      <div className="rounded-lg p-2 my-2 bg-white darkCardBg">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="bg-white py-3 rounded-lg darkCardBg">
        <div className="bg-white rounded-lg pe-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center p-4">
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
                placeholder="Search..."
                searchText={searchText}
                setSearchText={setSearchText}
                onChange={handleSearchChange}

              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AddMaterialRequest onSuccess={handleCreateSuccess} />
            <ExportButton
              label="Export"
              data={stockEntryData}
              filename="Material Request List"
            />
          </div>
        </div>
      </div>
      <div>
        <ReusableAgGrid
          key={columnDefs.length}
          rowData={stockEntryData}
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
      {/* view */}
      <Modal
        isOpen={isViewModal}
        onClose={() => setIsViewModal(false)}
        title="View Material Request"
        showHeader
        size="xl"
        showFooter={false}
      >
        {selectedRequest && (
          <>
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="flex items-center gap-2">
                <span className ="top-clr">
                  {React.cloneElement(icons?.calendarCheck, { size: 24 })}
                </span>
                <span>{convertToIST(selectedRequest?.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className ="top-clr">
                  {React.cloneElement(icons?.homeIcon, { size: 24 })}
                </span>
                <span>{selectedRequest?.inv_name}</span>
              </div>
            </div>
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-4 py-2 text-left">
                    Item Name
                  </th>
                  <th className="border border-gray-400 px-4 py-2 text-left">
                    Quantity
                  </th>
                  <th className="border border-gray-400 px-4 py-2 text-left">
                    Unit
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedRequest.request_material.map((item) => (
                  <tr key={item.uuid} className="hover:bg-gray-100">
                    <td className="border border-gray-400 px-4 py-2 ">
                      {item.item_name}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {item.unit_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </Modal>

      <Modal
        isOpen={isUpdateModal}
        onClose={() => setIsUpdateModal(false)}
        title="Update Material Request"
        showHeader
        size="xl"
        showFooter={false}
      >
        <form onSubmit={updateHandler}>
          <div className="grid grid-cols-2 gap-3 mb-2">
            <FormInput
              id="date"
              iconLabel={icons.calendarWDate}
              label="Date"
              type="date"
              register={register}
              errors={errors}
            />
            {logData?.role === 100 && (
              <Select
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
              />
            )}
          </div>
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
              {selectedItems.length > 0 && (
                <>
                  {selectedItems.map((item, index) => (
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
        <div className="mt-4 text-right">
          <IconButton
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            label="Save"
            icon={icons?.saveIcon}
            onClick={() => handleSubmit(updateHandler)()}
          />
        </div>
      </Modal>
      <Modal
        isOpen={isCancelModal}
        onClose={() => setIsCancelModal(false)}
        title="Cancel Material Request"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(cancelHandler)}>
          <input
            type="hidden"
            {...register("uuid")}
            defaultValue={selectedUser?.uuid}
          />
          <div>
            <TextArea
              id="cancel_reason"
              iconLabel={icons.replay}
              label="Reason"
              type="text"
              placeholder="Enter the reason"
              register={register}
              errors={errors}
              className="mb-1"
            />
          </div>
          <div className="flex mt-4">
            <IconButton
              label="Submit"
              icon={icons.saveIcon}
              type="submit"
              loading={loading}
            />
          </div>
        </form>
      </Modal>
      {/* deline */}
      <Modal
        isOpen={isDeclineModal}
        onClose={() => setIsDeclineModal(false)}
        title="Decline Material Request"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(declineHandler)}>
          <input
            type="hidden"
            {...register("uuid")}
            defaultValue={selectedUser?.uuid}
          />
          <div>
            <TextArea
              id="decline_reason"
              iconLabel={icons.replay}
              label="Reason"
              type="text"
              placeholder="Enter the reason"
              register={register}
              errors={errors}
              className="mb-1"
            />
          </div>
          <div className="flex mt-4">
            <IconButton
              label="Submit"
              icon={icons.saveIcon}
              type="submit"
              loading={loading}
            />
          </div>
        </form>
      </Modal>
      {/* approve */}
      <Modal
        isOpen={isApproveModal}
        onClose={() => setIsApproveModal(false)}
        title="Approve Material Request"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(approveHandler)}>
          <input
            type="hidden"
            {...register("uuid")}
            defaultValue={selectedUser?.uuid}
          />
          <div>
            <TextArea
              id="approve_reason"
              iconLabel={icons.replay}
              label="Reason"
              type="text"
              placeholder="Enter the reason"
              register={register}
              errors={errors}
              className="mb-1"
            />
          </div>

          {/* Submit Button */}
          <div className="flex mt-4">
            <IconButton
              label="Submit"
              icon={icons.saveIcon}
              type="submit"
              loading={loading}
            />
          </div>
        </form>
      </Modal>

      {/* <Modal
                isOpen={isUpdateModal}
                onClose={() => setIsUpdateModal(false)}
                title="Update Material Request"
                showHeader
                size="m"
                showFooter={false}
            >
                <form onSubmit={handleSubmit(updateHandler)}>
                    <input type="hidden" {...register("uuid")} value={selectedUser?.uuid} />
                    <FormInput
                        id="date"
                        iconLabel={icons.calendarWDate}
                        label="Date"
                        type="date"
                        register={register}
                        errors={errors}
                    />

                    <SearchableSelect
                        options={itemList}
                        label="Item Name"
                        id="item_id"
                        className="w-50"
                        placeholder="Select Item"
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        iconLabel={icons.itemBox}
                    />

                    <Select
                        options={unitList}
                        label="Unit"
                        id="unit"
                        iconLabel={icons.unitIcon}
                        placeholder="Select Unit"
                        register={register}
                        errors={errors}
                        className="mb-1"
                    />

                    <FormInput
                        label="Quantity"
                        type="number"
                        iconLabel={icons.quotationIcon}
                        placeholder="Enter Quantity"
                        register={register}
                        errors={errors}
                        id="quantity"
                    />
                    <div className="flex mt-4">
                        <IconButton label="Update Request" icon={icons.updateIcon} type="submit" loading={loading} />
                    </div>
                </form>
            </Modal> */}

      {/* delete */}
      {isDeleteModalOpen && (
        <div className="delete-modal">
          <div className="modal-content-del darkCardBg">
            <div className="flex items-center justify-between">
              <h4>Confirm Delete</h4>
              <button className="modal-close" onClick={cancelDelete}>
                {" "}
                &times;
              </button>
            </div>
            <hr />
            <p className="pt-4">Are you sure you want to delete this item?</p>
            <div className="modal-actions">
              <button
                onClick={confirmDelete}
                className="btn btn-danger"
                loading={loading}
              >
                Yes, Delete
              </button>
              <button onClick={cancelDelete} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default MaterialRequestList;
