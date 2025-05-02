import React, { useEffect, useState } from "react";
import icons from "../../../../contents/Icons";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import ReusableAgGrid from "../../../../UI/AgGridTable/AgGridTable";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";
import Breadcrumps from "../../../../UI/Breadcrumps/Breadcrumps";
import ExportButton from "../../../../UI/AgGridTable/ExportBtn/ExportBtn";
import DateRangePickerComponent from "../../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent";
import { formatDateToYYYYMMDD } from "../../../../utils/Date";
import {  getDebitListEffect } from "../../../../redux/Account/Transactions/Transaction";
import Loader from "../../../../components/Loader/Loader";
import Pagination from "../../../../UI/AgGridTable/Pagination/Pagination";
import CreateDebit from "./CreateDebit";

export default function Debit() {
  const [searchText, setSearchText] = useState("");
  const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
  const [leadList, setLeadList] = useState([]);
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [loading, setLoading] = useState(true); // Add loading state
  const [isCreateDebitModal, setIsCreateDebitModal] = useState(false);

  const [toastData, setToastData] = useState({ show: false });


  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Debit" },
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
      const response = await getDebitListEffect({
        page: paginationCurrentPage,
        page_size: paginationPageSize,
        search: searchText,
        from_date: filters.startDate
          ? formatDateToYYYYMMDD(filters.startDate)
          : "",
        to_date: filters.endDate ? formatDateToYYYYMMDD(filters.endDate) : "",
        status: filters.status,
      });
      setLeadList(response.data.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };




  

  const [focusedInput, setFocusedInput] = useState(null);

  const columnDefs = [

    { headerName: "Reference No.", field: "reference_no", unSortIcon: true },
    { headerName: "Type", field: "purpose_name", unSortIcon: true },
    {
      headerName: "Name",
      minWidth: 200,
      unSortIcon: true,
      cellRenderer: (params) => {
        const name = params?.data?.receipient_name || "";
        const contact = params?.data?.vendor_id || "";
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
      headerName: "Date",
      field: "date",
      minWidth: 150,
      unSortIcon: true,
    },
    {
      headerName: "Total Amount",
      field: "amount",
      unSortIcon: false,
    },
    {
      headerName: "Payment Mode",
      field: "payment_mode",
      unSortIcon: true,
    },

    {
      headerName: "Action",
      field: "action",
      sortable: false,
      pinned: "right",
      maxWidth: 200,
      minWidth: 150, // Corrected property name
      cellRenderer: (params) => {
        return (
          <div
            className={`flex gap-3 items-center ${params?.data?.status !== 1 ? "justify-end" : "justify-center"
              }`}
          >


            <span
              className="top-clr rounded-full border p-2 cursor-pointer"
              data-tooltip-id="edit-notes"
              onClick={() => handleFileViewClick(params?.data?.attachment)} // Pass the image URL
            >
              {React.cloneElement(icons?.fileview, { size: 18 })}
            </span>
            <span
              className="top-clr rounded-full border p-2 cursor-pointer"
              onClick={() => handleEdit(params.data)} // Pass row data to handleEdit

            >
              {React.cloneElement(icons.editIcon, { size: 18 })}
            </span>
          </div>
        );
      },
    },
  ];



  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    if (!e.target.value) setPaginationCurrentPage(1);
  };

  const handleDateChange = ({ startDate, endDate }) => {
    setFilters((prev) => ({ ...prev, startDate, endDate }));
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

 
  const handleModalClose = () => {
    setIsCreateDebitModal(false)
    setIsUpdate(false)
    setSelectedData(null)
    fetchLeadList()


  };
  const [isUpdate, setIsUpdate] = useState(false); // State to track if it's an update
  const [selectedData, setSelectedData] = useState(null); // State to hold the selected row data

  const handleEdit = (data) => {
    setIsUpdate(true); // Set update mode
    setSelectedData(data); // Pass the selected row data
    setIsCreateDebitModal(true); // Open the modal
  };

  const handleFileViewClick = (imageUrl) => {
    if (imageUrl) {
      window.open(imageUrl, "_blank"); // Open the image URL in a new tab
    } else {
      setToastData({
        show: true,
        message: "No image available to view.",
        type: "error",
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
            <DateRangePickerComponent
              className="darkCardBg"
              focusedInput={focusedInput}
              onFocusChange={setFocusedInput}
              startDate={filters.startDate}
              endDate={filters.endDate}
              onDatesChange={handleDateChange}
            />

            <ExportButton
              label="Export"
              filename="purchase_Quotation_List"
              data={leadList?.data?.map(
                ({ quotation_id, cust_name, contact, date, total_amount }) => ({
                  Quotation_Id: quotation_id,
                  Name: cust_name,
                  Contact: contact,
                  Date: date,
                  Total_Amount: total_amount,
                })
              )}
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
            <IconButton
              label="Create"
              icon={icons.plusIcon}
              onClick={() => {
                setIsCreateDebitModal(true);
              }}
            />

          </div>

        </div>

      </div>
      {leadList?.data?.length > 0 ? (
        <>
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
        </>
      ) : !loading ? (
        <div className="flex justify-center items-center h-40 text-gray-500 text-lg font-semibold">
          No Data Found
        </div>
      ) : (
        <Loader />
      )}
        <CreateDebit
          isCreateDebitModal={isCreateDebitModal}
          setIsCreateDebitModal={setIsCreateDebitModal}
          onClose={handleModalClose}
          setToastData={setToastData}
          IsUpdate={isUpdate} // Pass IsUpdate prop
          data={selectedData}
        />
    </>
  );
}
