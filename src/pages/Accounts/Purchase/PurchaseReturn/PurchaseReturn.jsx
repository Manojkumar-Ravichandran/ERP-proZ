import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, Pagination } from "rsuite";
import icons from "../../../../contents/Icons";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import ReusableAgGrid from "../../../../UI/AgGridTable/AgGridTable";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";
import Breadcrumps from "../../../../UI/Breadcrumps/Breadcrumps";
import ExportButton from "../../../../UI/AgGridTable/ExportBtn/ExportBtn";
import AddAssets from "../../../Inventory/Assets/AddAssets";
import FilterDropdown from "../../../../components/DropdownFilter/FilterDropdown";
import { accountStatus, socialMediaList } from "../../../../contents/DropdownList";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import { useForm } from "react-hook-form";
import DateRangePickerComponent from "../../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent";
import ActionDropdown from "../../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import formatDateForDisplay from "../../../../UI/Date/DateDisplay";
import StatusManager from "../../../../UI/StatusManager/StatusManager";
import { formatDateToYYYYMMDD } from "../../../../utils/Date";
import { useDispatch, useSelector } from "react-redux";
import { getLeadListInProgress } from "../../../../redux/CRM/lead/LeadActions";
import { getSaleQuotationListEffect, rejectSaleQuotationEffect, SQToOrderEffect } from "../../../../redux/Account/Sales/SaleQuotation/SaleQuotationEffects";
import Modal from "../../../../UI/Modal/Modal";
import TextArea from "../../../../UI/Input/TextArea/TextArea";
import { getSaleReturnListEffect } from "../../../../redux/Account/Sales/SaleReturn/SaleReturnEffects";
import { purchaseReturnListEffect } from "../../../../redux/Account/Purchase/PurchaseReturn/PurchaseReturnEffects";


export default function PurchaseReturn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dataSale = useSelector((state) => state.lead);
  const [searchText, setSearchText] = useState("");
  const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
  const [leadList, setLeadList] = useState([]);
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [loading, setLoading] = useState(true); // Add loading state
  const [leadDatas, setLeadDatas] = useState();
      const [selectedUser, setSelectedUser] = useState();
      const [isCancelModal, setIsCancelModal] = useState(false);

  console.log("list1s", leadList)
  const [toastData, setToastData] = useState({ show: false });
  const { register, formState: { errors }, handleSubmit, setValue } = useForm();

  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Purchase Return" }
  ];
  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
  };


  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    status: "",
  });

  
  useEffect(() => {
    fetchLeadList();
}, [paginationPageSize, paginationCurrentPage, filters,searchText]);

  const fetchLeadList = async () => {
    setLoading(true);
    try {
      const response = await purchaseReturnListEffect({
        page: paginationCurrentPage,
        page_size: paginationPageSize,
        search: searchText,
        from_date: filters.startDate ? formatDateToYYYYMMDD(filters.startDate) : "",
        to_date: filters.endDate ? formatDateToYYYYMMDD(filters.endDate) : "",
        status: filters.status,
      });
      setLeadList(response.data.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const [dates, setDates] = useState({
    startDate: null,
    endDate: null
  });

  const StatusFilter = [
    { value: "pending", label: "Pending" },
    { value: "converted", label: "Converted" },
    { value: "rejected", label: "Rejected" },
  ];

  const ActionDropdowns = [
    {
      value: "Pending",
      label: "Whatsapp",
      iconClass: "top-clr rounded-full border p-1 cursor-pointer",
      icon: icons.whatsapp
    },
    {
      value: "Rejected", label: "Mail",
      iconClass: "top-clr rounded-full border p-1 cursor-pointer",
      icon: icons.mail
    },
    {
      value: "Converted", label: "PDF",
      iconClass: "top-clr rounded-full border p-1 cursor-pointer",
      icon: icons.pdf

    },
  ];

  const ActionButton = [
    { action: "order", label: "Convert To Order", icon: icons.tick, iconClass: "text-green-200 cursor-pointer", },
    { action: "invoice" ,label: "Convert To Invoice", icon: icons.tick, iconClass: "text-green-200 cursor-pointer", },
    { action: "cancel", label: "Reject", icon: icons.cancelIcon, iconClass: "text-red-200 cursor-pointer ", },
  ];

  // State to manage focus
  const [focusedInput, setFocusedInput] = useState(null);

  // Function to handle date changes
  

  const columnDefs = [
    { headerName: "Return Number", field: "return_id", unSortIcon: true, },
    { headerName: "Date", field: "date", unSortIcon: true },
    { headerName: "Invoice No", field: "invoice_id", unSortIcon: true },

    // { headerName: "Customer Details", field: "return_by_name", unSortIcon: true, },
    {
      headerName: "Vendor",
      minWidth: 200,
      unSortIcon: true,
      cellRenderer: (params) => {
        const name = params?.data?.vendor_name || "";

        return (
          <div>
            <button
              className="top-clr underline"
              // onClick={() =>
              //   navigate(`/user/crm/customer/customer-view/${uuid}`, {
              //     state: { ...params.data }, // Pass leadId in state
              //   })
              // }
              title="View Customer Details"
            >
              {name}
            </button>
          </div>
        );
      },
    },

    {
      headerName: "Amount", field: "total_amount", unSortIcon: false,
    },


    {
      headerName: "Reason", field: "return_reason", unSortIcon: false,
    },
    {
      headerName: "Action",
      field: "action",
      sortable: false,
      // pinned: "right",
      maxWidth: 120,
      minWidth: 100, // Corrected property name
      cellRenderer: (params) => {
        return (
          <div className={`flex gap-1 items-center ${params?.data?.status !== 1 ? "justify-end" : "justify-center"}`}
          >

{/* 
            {params?.data?.status === 1 &&
              <ActionDropdown

                options={ActionButton}
              onAction={(e) => handleAction(e, params, params.data)} 
              />

            } */}


             
              
              <span
                className="top-clr rounded-full border p-2 cursor-pointer"
                // data-tooltip-id="edit-notes"
                // onClick={() => {
                //   navigate("/user/accounts/sale/create-sale-return", { state: { ...params.data } });
                // }}
              >
                {React.cloneElement(icons.pdf, { size: 18 })}
              </span>
            
              <span
                className="top-clr rounded-full border p-2 cursor-pointer"
                data-tooltip-id="edit-notes"
                onClick={() => {
                  navigate("/user/accounts/purchase/create-purchase-return", { state: { ...params.data } });
                }}
              >
                {React.cloneElement(icons.editIcon, { size: 18 })}
              </span>

            {/* <ActionDropdown
              iconClass="top-clr rounded-full border p-2 cursor-pointer"
              icon={icons.pdf}
              options={ActionDropdowns}
            onAction={(e) => handleAction(e, params, params.data)} 
            /> */}
          </div>
        );
      },
    },
  ];

 
 const handleAction = async(action, params, master) => {
        // const { uuid, id, date, item_id, quantity, unit, unit_name, item_name, sales_by, sales_by_name, sales_to, scrap_reason, sales_rate } = params?.data || {};

        if (action === "order" && params.data) {
          try {
            const response = await SQToOrderEffect({ uuid: params.data.uuid });
            console.log("respone",response) // Replace with your actual API endpoint
            setToastData({
                show: true,
                message: 'Quotation converted to order successfully!',
                type: 'success'
            });
            fetchLeadList();
        } catch (error) {
            console.error("Error converting quotation to order:", error);
            setToastData({
                show: true,
                message: 'Failed to convert quotation to order. Please try again.',
                type: 'error'
            });
        }
          
          
        } else if (action === "view" && params?.data?.uuid && params?.data?.id) {
            // setSelectedRequest(params.data);
            // setIsViewModal(true);
        }
        else if (action === "cancel") {
          setSelectedUser(params.data);
            setIsCancelModal(true);
        }
    }

  
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    if (!e.target.value) setPaginationCurrentPage(1);
  };


  const handleDateChange = ({ startDate, endDate }) => {
   
      setFilters((prev) => ({ ...prev, startDate, endDate }));
    
  };
  

  /** Handle Status Filter Change */
  const handleStatusChange = (selectedOption) => {
    setFilters((prev) => ({ ...prev, status: selectedOption || "" }));
  };


  const handlePageChange = (page) => {
    setPaginationCurrentPage(page);
    fetchLeadList();
  };

  const handlePageSizeChange = (pageSize) => {
    setPaginationPageSize(pageSize);
    setPaginationCurrentPage(1);
    fetchLeadList();
  };

  const cancelHandler = async (data) => {
    
    try {
        const response = await rejectSaleQuotationEffect(data); // Replace with your actual API endpoint
        setToastData({
            show: true,
            message: 'Quotation cancelled successfully!',
            type: 'success'
        });
        setIsCancelModal(false);
        fetchLeadList();
        setSelectedUser(null);
    } catch (error) {
        console.error("Error cancelling quotation:", error);
        setToastData({
            show: true,
            message: 'Failed to cancel quotation. Please try again.',
            type: 'error'
        });
    }
};

  return (
    <>
      {toastData?.show && (
        <AlertNotification
          show={toastData?.show}
          message={toastData?.message}
          onClose={toastOnclose}
        />
      )}


      <div className="py-3 rounded-lg  w-full border-b-5 border-black">
        <div className="rounded-lg pe-3 flex items-center justify-between w-full">
          <div className="flex items-center p-4  overflow-x-hidden">
            <div className="relative ">
              <Breadcrumps items={breadcrumbItems} />
            </div>
          </div>

          {/* Right Section: Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <DateRangePickerComponent className="darkCardBg"

              focusedInput={focusedInput}
              onFocusChange={setFocusedInput}
              startDate={filters.startDate}
              endDate={filters.endDate}
              onDatesChange={handleDateChange}
            />
            {/* <FilterDropdown
              options={StatusFilter}
              showClearButton={true}
            //   onFilter={handleTraceabilityFilterChange}
            /> */}

            <ExportButton
              label="Export"
              filename="Sale_Quotation_List"
              data={leadList?.data?.map(({
                quotation_id, cust_name, contact, date,
                total_amount,
                // address, incharge_name, 
                // stage_name, overdue_days, next_followup 
              }) => ({
                Quotation_Id: quotation_id,
                Name: cust_name,
                Contact: contact,
                Date: date,
                Total_Amount: total_amount,
                // Address: address,
                // Incharge: incharge_name,
                // Stage: stage_name,
                // Overdue_Date: overdue_days,
                // Next_Update_Date: next_followup
              }))}
            />
          </div>
        </div>
      </div>
      <hr className="border-t-1 border-gray-300" />
    
      <div className=" py-3 rounded-lg ">
        <div className=" rounded-lg pe-3 flex items-center justify-between">
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
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-3  cursor-pointer"
                // onClick={handleFilterChange}
                >
                  {icons.searchIcon}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">

            {/* <DateRangePickers onChange={handleDateChange} /> */}

            <FilterDropdown
              options={StatusFilter}
              placeholder="Status"
              showClearButton={true}
              onFilter={handleStatusChange}

            //   onFilter={handleTraceabilityFilterChange}
            />
            {/* <AddAssets
                        // onSuccess={handleCreateSuccess} 
                        /> */}

            <IconButton
              label="Create"
              icon={icons.plusIcon}
              onClick={() => {
                navigate("/user/accounts/purchase/create-purchase-return");
              }}
            // onClick={() => navigate("/user/crm/lead/create-lead")}
            />
          </div>
        </div>
      </div>
    

      <ReusableAgGrid
        key={columnDefs.length}
        rowData={leadList?.data}
        columnDefs={columnDefs}
        defaultColDef={{ resizable: false }}
        onGridReady={(params) => params.api.sizeColumnsToFit()}
        pagination={false}
        showCheckbox={false}
      />
      <Pagination
        currentPage={paginationCurrentPage}
        totalPages={leadList?.last_page || 1}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        startItem={leadList?.from || 0}
        endItem={leadList?.to || 0}
        totalItems={leadList?.total || 0}
      />
        <Modal
                      isOpen={isCancelModal}
                      onClose={() => setIsCancelModal(false)}
                      title="Cancel Material Request"
                      showHeader
                      size="m"
                      showFooter={false}
                  >
                      <form onSubmit={handleSubmit(cancelHandler)}>
                          <input type="hidden" {...register("uuid")} defaultValue={selectedUser?.uuid} />
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
                              <IconButton label="Submit" icon={icons.saveIcon} type="submit" loading={loading} />
                          </div>
                      </form></Modal>
    </>
  );
}
