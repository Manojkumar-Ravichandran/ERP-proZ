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
import { getSaleInvoiceListEffect, MailiShareEffect, PdfiCustomerEffect, WhatsAppiShareEffect } from "../../../../redux/Account/Sales/SaleInvoice/SaleInvoiceEffects";

export default function SaleInvoice() {
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
    { id: 2, label: "Sale Invoice" }
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
  }, [paginationPageSize, paginationCurrentPage, filters, searchText]);

  const fetchLeadList = async () => {
    setLoading(true);
    try {
      const response = await getSaleInvoiceListEffect({
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
    { value: "cancelled", label: "Cancelled" },
    { value: "paid", label: "Paid" },
    { value: "returned", label: "Returned" },
  ];

  const ActionDropdowns = [
    {
      action:"whatsapp",
      value: "Pending",
      label: "Whatsapp",
      iconClass: "top-clr rounded-full border p-1 cursor-pointer",
      icon: icons.whatsapp
    },
    {
      action:"mail",
      value: "Rejected", label: "Mail",
      iconClass: "top-clr rounded-full border p-1 cursor-pointer",
      icon: icons.mail
    },
    {
      action:"pdf",
      value: "Converted", label: "PDF",
      iconClass: "top-clr rounded-full border p-1 cursor-pointer",
      icon: icons.pdf
    },
  ];


  // const ActionButton = [
  //   { action: "order", label: "Convert To Order", icon: icons.tick, iconClass: "text-green-200 cursor-pointer", },
  //   { action: "invoice" ,label: "Convert To Invoice", icon: icons.tick, iconClass: "text-green-200 cursor-pointer", },
  //   { action: "cancel", label: "Reject", icon: icons.cancelIcon, iconClass: "text-red-200 cursor-pointer ", },
  // ];

  // State to manage focus
  const [focusedInput, setFocusedInput] = useState(null);

  // Function to handle date changes


  const columnDefs = [
    { headerName: "Invoice Number", field: "invoice_id", unSortIcon: true, },
    { headerName: "Date", field: "date", unSortIcon: true },
    // { headerName: "Customer Details", field: "return_by_name", unSortIcon: true, },
    {
      headerName: "Customer Details",
      minWidth: 200,
      unSortIcon: true,
      cellRenderer: (params) => {
        const name = params?.data?.cust_name || "";
        const contact = params?.data?.contact || "";

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
              {name}-{contact}
            </button>
          </div>
        );
      },
    },

    {
      headerName: "Total Amount", field: "total_amount", unSortIcon: false,
    },

    {
      headerName: "Due Amount", field: "due_amount", unSortIcon: false,
    },
    {
      headerName: "Status",
      field: "unit_description",
      sortable: false,
      cellRenderer: (params) => {
        const statusMapping = {
          1: "darkpurple",
          0: "darkpink",
          2: "lightgreen",
          3: "darkpink",
        };
        const status = statusMapping[params?.data?.status];
        return (
          <div className="flex justify-center items-center w-100">
            {/* {params?.data?.status === 2 || params?.data?.status === 3 ? (
              <div className="flex justify-center items-center">
                <button
                  className="top-clr underline text-center"
                  title={params.data?.status === 3 ? 'Order' : 'Invoice'}
                >
                  Converted...
                </button>
              </div>
            ) : ( */}
            <div className="flex justify-center">
              <StatusManager
                status={status}
                message={
                  params?.data?.status === 1
                    ? 'Pending'
                    : params?.data?.status === 0
                      ? 'Cancelled'
                      : params?.data?.status === 2
                        ? 'Paid' : params?.data?.status === 3
                          ? 'Returned'
                          : ""
                }
                tooltipMessage="This is a success message"
                tooltipPosition="right"
                tooltipId={params?.data?.quotation_id}  // Unique ID for this status

              />
            </div>
            {/* )} */}
          </div>

        );
      },
    }
    ,

    {
      headerName: "Action",
      field: "action",
      sortable: false,
      pinned: "right",
      maxWidth: 200,
      minWidth: 120,
      cellRenderer: (params) => {
        return (
          <div className={`flex gap-1 items-center ${params?.data?.status !== 1 ? "justify-end" : "justify-center"}`}
          >


            {/* {params?.data?.status === 1 &&
              <ActionDropdown

                options={ActionButton}
              onAction={(e) => handleAction(e, params, params.data)} 
              />

            } */}

            {params?.data?.status === 1 &&

              <span
                className="top-clr rounded-full border p-2 cursor-pointer"
                data-tooltip-id="edit-notes"
                onClick={() => {
                  navigate("/user/accounts/sale/create-sale-invoice", { state: { ...params.data } });
                }}
              >
                {React.cloneElement(icons.editIcon, { size: 18 })}
              </span>
            }
            <ActionDropdown
              iconClass="top-clr rounded-full border p-2 cursor-pointer"
              icon={icons.MdShare}
              options={ActionDropdowns}
              onAction={(e) => handleAction(e, params, params.data)}
            />
          </div>
        );
      },
    },
  ];


  const handleAction = async (action, params, master) => {
    if (action === "order" && params.data) {
      try {
        const response = await SQToOrderEffect({ uuid: params.data.uuid });
        console.log("respone", response) 
        setToastData({
          show: true,
          message: response?.data?.message ,
          type: response?.data?.status
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

     else if (action === "whatsapp" && params?.data?.uuid) {
          try {
            const response = await WhatsAppiShareEffect({ uuid: params.data.uuid });
            setToastData({
              show: true,
              message: response?.data?.message,
              type: response?.data?.status
            });
            fetchLeadList();
          } catch (error) {
            setToastData({
              show: true,
              message: 'Failed to Share Whatsapp. Please try again.',
              type: 'error'
            });
          }
        }
        else if (action === "mail" && params?.data?.uuid) {
          try {
            const response = await MailiShareEffect({ uuid: params.data.uuid });
            setToastData({
              show: true,
              message: response?.data?.message,
              type: response?.data?.status
            });
            fetchLeadList();
          } catch (error) {
            setToastData({
              show: true,
              message: 'Failed to Share Mail. Please try again.',
              type: 'error'
            });
          }
        }
        else if (action === "pdf" && params?.data?.uuid) {
          try {
            const response = await PdfiCustomerEffect({ uuid: params.data.uuid });
    
            // if (response?.data?.data) {
            //   window.open(response?.data?.data, "_blank");
            // }
            // else {
            //   setToastData({
            //     show: true,
            //     message: response?.data?.message,
            //     type: response?.data?.status
            //   });
    
            // }
            const pdfLink = response?.data?.data || response?.data?.message;

            if (pdfLink && /^https?:\/\/\S+\.\w+/.test(pdfLink)) {
              window.open(pdfLink, "_blank");
            } else {
              setToastData({
                show: true,
                message: response?.data?.message || "Failed to open PDF.",
                type: response?.data?.status || "error"
              });
            }
            fetchLeadList();
          } catch (error) {
            setToastData({
              show: true,
              message: 'Failed to Share Pdf. Please try again.',
              type: 'error'
            });
          }
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
      const response = await rejectSaleQuotationEffect({...data,uuid:selectedUser?.uuid}); // Replace with your actual API endpoint
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
                >
                  {icons.searchIcon}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">


            <FilterDropdown
              options={StatusFilter}
              placeholder="Status"
              showClearButton={true}
              onFilter={handleStatusChange}

            />
            <IconButton
              label="Create"
              icon={icons.plusIcon}
              onClick={() => {
                navigate("/user/accounts/sale/create-sale-invoice");
              }}
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
          {/* <input type="hidden" {...register("uuid")} defaultValue={selectedUser?.uuid} /> */}
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
