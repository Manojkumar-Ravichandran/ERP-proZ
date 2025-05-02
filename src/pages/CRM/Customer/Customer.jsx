import React, { useEffect, useState } from "react";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerListInProgress } from "../../../redux/CRM/Customer/CustomerActions";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import { useNavigate } from "react-router";
import ActionDropdown from "../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import icons from "../../../contents/Icons";
import Pagination from "../../../UI/AgGridTable/Pagination/Pagination";
import CustomerActionDropdown from "./Component/CustomerActionDropdown";
import Modal from "../../../UI/Modal/Modal";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import { useForm } from "react-hook-form";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import { customerMessageEffect } from "../../../redux/CRM/Customer/CustomerEffects";
import "./Customer.css";
import Loader from "../../../components/Loader/Loader";
import FileInput from "../../../UI/Input/FileInput/FileInput";
import ExportButton from "../../../UI/AgGridTable/ExportBtn/ExportBtn";

export default function Customer() {
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Customer" },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customerDatas = useSelector((state) => state?.customer?.customerList);
  console.log("dsaz", customerDatas)
  const [toastData, setToastData] = useState({ show: false });
  const [customerList, setCustomerList] = useState([]);
  const [customerData, setCustomerData] = useState();
  const [paginationCurrentPage, setPaginationCurrentPage] = useState(1); // Initial current page
  const [paginationPageSize, setPaginationPageSize] = useState(10); // Default page size
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [payload, setPayload] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false); // General loading state
  const [searchLoading, setSearchLoading] = useState(false); 
  const [whatsappData, setWhatsAppData] = useState({
    show: false,
    loading: false,
    data: {},
  });
  const [mailData, setMailData] = useState({
    show: false,
    loading: false,
    data: {},
  });

  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
  };

  useEffect(() => {
    getCustomerList();
  }, []);

  const getCustomerList = (payload = {}) => {
    dispatch(getCustomerListInProgress(payload));
  };
  useEffect(() => {
    setCustomerData(customerDatas);
    if (customerDatas?.data?.length > 0) {
      setCustomerList([...customerDatas?.data]);

setLoading(false); // Set loading to false when data is available
    } else {
      setCustomerList([]);
      setLoading(false);
    }
  }, [customerDatas]);
  const {
    register: whatsappRegister,
    formState: { errors: whatsappError },
    handleSubmit: whatsappHandleSubmit,
    setValue: whatsappSetValue,
    watch: whatsappWatch,
    reset: whatsappReset,
  } = useForm();
  const {
    register: mailRegister,
    formState: { errors: mailError },
    handleSubmit: mailHandleSubmit,
    setValue: mailSetValue,
    watch: mailActivity,
    reset: mailReset,
  } = useForm();

  const option = [
    {
      label: "Add Lead",
      action: "addLead",
      icon: React.cloneElement(icons.plusIcon, { size: 20 }),
    },
    {
      label: "WhatsApp Message",
      action: "whatsAppChat",
      icon: React.cloneElement(icons.whatsapp, { size: 20 }),
    },
    {
      label: "Mail Message",
      action: "mailChat",
      icon: React.cloneElement(icons.mail, { size: 20 }),
    },
  ];
  const handleAction = (action, e) => {
    // setSelectedUser(e.data);
    const {
      uuid,
      lead_name: name,
      email,
      contact: contactNumber,
      whatsapp_contact: whatsappNumber,
      last_followup: lastFollowup,
      incharge_name: incharge,
      stage_name: stage,
      lead_id: id,
      status,
    } = e?.data || {};
    setSelectedCustomer(e?.data);
    if (action === "addLead" && uuid) {
      navigate(`/user/crm/lead/create-lead/`, {
        state: { contact: e?.data?.contact }, // Pass leadId in state
      });
    } else if (action === "whatsAppChat" && uuid) {
      if (!whatsappNumber) {
        setToastData({
          show: true,
          type: "error",
          message: "Kindly Provide WhatsApp Number",
        });
        return;
      }
      setWhatsAppData({ ...whatsappData, show: true });
    } else if (action === "mailChat") {
      if (!email) {
        setToastData({
          show: true,
          type: "error",
          message: "Kindly Provide Email Id",
        });
        return;
      }
      setMailData({ ...whatsappData, show: true });
    } else {
      
    }
  };
  const columnDefs = [
    // { headerName: 'Lead Id', field: 'lead_id', minWidth: 120, maxWidth: 120, unSortIcon: true },
    {
      headerName: "Name",
      minWidth: 200,
      unSortIcon: true,
      cellRenderer: (params) => {
        const uuid = params.data.uuid;
        const id = params.data.id || "";
        const name = params.data.name || "";

        return (
          <div>
            <button
              className="top-clr underline"
              onClick={() =>
                navigate(`/user/crm/customer/customer-view/${uuid}`, {
                  state: { ...params.data }, // Pass leadId in state
                })
              }
              title="View Lead Details"
            >
              {name}
            </button>
          </div>
        );
      },
    },

    {
      headerName: "Contact",
      field: "contact",
      minWidth: 200,
      unSortIcon: true,
    },
    {
      headerName: "Email",
      field: "email",
      minWidth: 200,
      unSortIcon: true,
    },
    {
      headerName: "Type",
      field: "customer_type_name",
      minWidth: 200,
      unSortIcon: true,
    },
    {
      headerName: "Action",
      field: "action",
      minWidth: 100,
      maxWidth: 100,
      sortable: false,
      pinned: "right",
      cellRenderer: (params) => (
        <div className="">
          <ActionDropdown
            options={option}
            onAction={(e) => handleAction(e, params)}
          />
        </div>
      ),
    },
  ];
  /* PAGEINATION */
  const handlePageChange = (page) => {
    setPaginationCurrentPage(page);
    getCustomerList();
  };
  const handlePageSizeChange = (pageSize) => {
    setPaginationPageSize(pageSize);
    setPaginationCurrentPage(1);
    getCustomerList();
  };

  /* Form handle */
  const whatsAppHandler = async (data) => {
    setWhatsAppData({ ...whatsappData, loading: true });

    const payload = {
      ...data,
      uuid: selectedCustomer?.uuid,
      type: 8,
      send_msg: 1,
      message_for: "customer",
      file_url: null,
    };
    // Ensure file_url is a string
    if (payload.file_url === null) {
      payload.file_url = "";
    }

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const result = await customerMessageEffect(formData);
      if (result.data.status === "success") {
        setToastData({
          show: true,
          type: result?.data?.status,
          message: result?.data?.message,
        });
      }
    } catch (error) {
      setToastData({
        show: true,
        type: error?.data?.status,
        message: error?.data?.message,
      });
    } finally {
      whatsappReset();
      setWhatsAppData({ ...whatsappData, loading: false, show: false });
    }
  };
  const mailHandler = async (data) => {
    setMailData({ ...mailData, loading: true });

    

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      

      if (key === "send_msg") {
        formData.append(key, value ? 1 : 0);
      } else if (key === "file_url" && value) {
        if (value instanceof FileList && value.length > 0) {
          
          formData.append(key, value[0]); // Append only the first file
        } else if (value instanceof File) {
          
          formData.append(key, value);
        } else {
          
        }
      } else {
        formData.append(key, value);
      }
    });

    formData.append("uuid", selectedCustomer?.uuid || "");
    formData.append("type", 5);
    formData.append("send_msg", 1);
    formData.append("message_for", "customer");
    formData.append("reference_id", 1);

    // ✅ Extract the file name properly and pass it in the payload
    let fileName = null;
    if (data.file_url instanceof FileList && data.file_url.length > 0) {
      fileName = data.file_url[0].name;
    } else if (data.file_url instanceof File) {
      fileName = data.file_url.name;
    }

    const payload = {
      ...data,
      file_url: fileName ? { name: fileName } : null, // Pass file name inside {}
    };

    
    setPayload(payload);

    // Debugging: Check formData values before sending
    
    for (let pair of formData.entries()) {
      
    }

    try {
      const result = await customerMessageEffect(formData);
      

      if (result?.data?.status === "success") {
        setToastData({
          show: true,
          type: "success",
          message: result?.data?.message || "Mail sent successfully!",
        });
        setMailData((prev) => ({ ...prev, show: false }));
        mailReset();
        // setMailData({ ...mailData, show: false });
      }
    } catch (error) {
      console.error("API Error:", error);
      setToastData({
        show: true,
        type: "error",
        message: error?.response?.data?.message || "Failed to send mail!",
      });
    } finally {
      setMailData((prev) => ({ ...prev, show: false }));
    }
  };
  //search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setPaginationCurrentPage(1);
    // setSearchLoading(false); 
    // getCustomerList({ search: value }, false); 
  };
  const handleFilterChange = () => {
    setPaginationCurrentPage(1);
    getCustomerList({ search: searchText }, false);
    setLoading(true);
  };
  return (
    <>
      {toastData?.show && (
        <AlertNotification
          show={toastData?.show}
          message={toastData?.message}
          type={toastData?.type}
          onClose={toastOnclose}
        />
      )}
      <div className=" rounded-lg p-2 my-2 bg-white darkCardBg">
        <Breadcrumps items={breadcrumbItems} />
      </div>

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
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3  cursor-pointer"
                      onClick={handleFilterChange}
                    >
                      {icons.searchIcon}
                    </div>
                  </div>
                </div>

              </div>
              <div>
                <ExportButton
                  label="Export"
                  filename="customer_List"
                />
              </div>
            </div>
          </div>
          {customerList?.length > 0 ? (
<>
          <ReusableAgGrid
            key={columnDefs.length}
            rowData={customerList}
            columnDefs={columnDefs}
            defaultColDef={{ resizable: false }}
            onGridReady={(params) => params.api.sizeColumnsToFit()}
            pagination={false}
            showCheckbox={false}
            excludeFromCapitalization={["email"]} // Exclude email field from capitalization

          />
          <Pagination
            currentPage={paginationCurrentPage}
            totalPages={customerData?.last_page || 1}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            startItem={customerData?.from || 0}
            endItem={customerData?.to || 0}
            totalItems={customerData?.total || 0}
          />
          </>
      ): customerList.length === 0 && !loading ? (
        <div className="flex justify-center items-center h-40 text-gray-500 text-lg font-semibold">
          No Data Found
        </div>
      ) : 
      (
        <Loader />
      )}
      <Modal
        isOpen={whatsappData?.show}
        onClose={() => {
          setWhatsAppData({ ...whatsappData, show: false });
          whatsappReset();
        }}
        title="WhatsApp Message"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={whatsappHandleSubmit(whatsAppHandler)}>
          <TextArea
            id="content"
            iconLabel={icons.textarea}
            label="Message"
            validation={{ required: "Message is required" }}
            register={whatsappRegister}
            errors={whatsappError}
          />
          <div className="flex gap-3 mt-3">
            <IconButton
              type="button"
              icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
              onClick={() => {
                // setIsModalOpenWhatsapp(false);
                whatsappReset();
                setWhatsAppData({ ...whatsappData, show: false });
              }}
            // disabled={whatsappLoading}
            />
            <IconButton
              type="submit"
              icon={React.cloneElement(icons.whatsapp, { size: "20px" })}
              label="Send"
              className="px-4 py-2"
              loading={whatsappData?.loading}
            />
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={mailData?.show}
        onClose={() => {
          setMailData({ ...mailData, show: false });
          mailReset();
        }}
        title="Mail Message"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={mailHandleSubmit(mailHandler)}>
          <TextArea
            id="subject"
            iconLabel={icons.textarea}
            label="Subject"
            validation={{ required: "Subject is required" }}
            register={mailRegister}
            errors={mailError}
          />
          <TextArea
            id="content"
            iconLabel={icons.textarea}
            label="Message"
            validation={{ required: "Message is required" }}
            register={mailRegister}
            errors={mailError}
          />

          <FileInput
            id="file_url"
            label="File"
            type="file"
            iconLabel={icons.filepin}
            register={mailRegister}
            errors={mailError}
            showStar={false}
            validation={{ required: false }}
          />
          <div className="flex gap-3 mt-3">
            <IconButton
              type="button"
              icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
              onClick={() => {
                // setIsModalOpenWhatsapp(false);
                mailReset();
                setMailData({ ...mailData, show: false });
              }}
            />
            <IconButton
              type="submit"
              icon={React.cloneElement(icons.mail, { size: "20px" })}
              label="Send"
              className="px-4 py-2"
              loading={mailData?.loading}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}
