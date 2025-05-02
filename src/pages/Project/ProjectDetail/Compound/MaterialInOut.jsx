import React, { useEffect, useState } from 'react';
import { ProjectShowMaterialInOutApprovedEffect, ProjectShowMaterialInOutEffect, ProjectShowMaterialInOutUpdateEffect } from '../../../../redux/project/ProjectEffects';
import Loader from '../../../../components/Loader/Loader';
import IconButton from '../../../../UI/Buttons/IconButton/IconButton';
import icons from '../../../../contents/Icons';
import AlertNotification from '../../../../UI/AlertNotification/AlertNotification';
import FilterDropdown from '../../../../components/DropdownFilter/FilterDropdown';
import { useNavigate } from 'react-router';
import ReusableAgGrid from '../../../../UI/AgGridTable/AgGridTable';
import ActionDropdown from '../../../../UI/AgGridTable/ActionDropdown/ActionDropdown';
import StatusManager from '../../../../UI/StatusManager/StatusManager';
import Pagination from "../../../../UI/AgGridTable/Pagination/Pagination";
import { useForm } from 'react-hook-form';
import Modal from '../../../../UI/Modal/Modal';
import TextArea from '../../../../UI/Input/TextArea/TextArea';
import FormInput from '../../../../UI/Input/FormInput/FormInput';
import FilterDropdownButton from '../../../../components/DropdownFilter/FilterDropDownButton';
import { calculateColumnWidth } from '../../../../utils/Table';

const MaterialInOut = ({ projectDetails }) => {
    const navigate = useNavigate();
    const {
        register,
        control, reset,
        setValue,
        handleSubmit, getValues,
        formState: { errors },
    } = useForm();
    const [MaterialInOut, setMaterialInOut] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [searchText, setSearchText] = useState("");
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);

    const [paginationPageSize, setPaginationPageSize] = useState(10);
    
    const [filters, setFilters] = useState({

        status: "ALL",
        type: "ALL",
    });
    const StatusFilter = [
        { value: "ALL", label: "All" },
        { value: 2, label: "Receive" },
        { value: 1, label: "Pending" },
        { value: 3, label: "Issueed" },
        { value: 4, label: "Return" },
    ];
    const TypeFilter = [
        { value: "ALL", label: "All" },
        { value: "in", label: "Material In" },
        { value: "out", label: "Material Out" },]
    const CreateFilter = [
        { value: "in", label: "Material In" },
        { value: "out", label: "Material Out" },]



    const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = {
                project_uuid: projectDetails?.project_uuid,
                search: searchText, // Include search text
                status: filters.status,
                type: filters.type,
            };
            const response = await ProjectShowMaterialInOutEffect(data);
            
            setMaterialInOut(response.data?.data || []); // Assuming the API returns a `MaterialInOut` array
        } catch (err) {
            setToastData({ show: true, message: err?.response?.data?.message || "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectDetails?.project_uuid) {
            fetchTasks();
        }
    }, [projectDetails?.project_uuid, searchText, filters,paginationCurrentPage, paginationPageSize]);

    const handleStatusChange = (selectedOption) => {
        setFilters((prev) => ({ ...prev, status: selectedOption || "" }));
    };

    const handleCreateChange = (selectedOption) => {
        
        navigate("/user/project/project-detail/create-material-in-out", { state: { project_id: projectDetails?.project_no, project_uuid: projectDetails?.project_uuid, type:selectedOption } });

        // setFilters((prev) => ({ ...prev, status: selectedOption || "" }));
    };
    const handleTypeChange = (selectedOption) => {
        setFilters((prev) => ({ ...prev, type: selectedOption || "" }));
    };
    const toastOnclose = () => {
        setToastData({ ...toastData, show: false });
    };
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        // if (!e.target.value) setPaginationCurrentPage(1);
    };
    

    // const columnDefs = [

    //     { headerName: "Request No ", field: "request_no", unSortIcon: true, },
    //     { headerName: " Date", field: "date", unSortIcon: true, },
    //     { headerName: "Material Name", field: "material_name", unSortIcon: true },
    //     { headerName: "quantity ", field: "quantity", unSortIcon: true, },
    //     { headerName: "Unit", field: "unit_name", unSortIcon: true },
    //     { headerName: " Material Flow ", field: "type", unSortIcon: true },

    //     {
    //         headerName: "Status",
    //         field: "status",
    //         sortable: false,
    //         cellRenderer: (params) => {
    //             const statusMapping = {
    //                 1: "darkpurple",
    //                 0: "darkRed",
    //                 2: "darkBlue",
    //                 3: "lightgreen",
    //                 4: "darkRed",

    //             };

    //             const status = statusMapping[params?.data?.status];
    //             return (
    //                 <div className="flex justify-center items-center w-100">
    //                     <div className="flex justify-center">
    //                         <StatusManager
    //                             status={status}
    //                             message={
    //                                 params?.data?.status_label
    //                             }
    //                             tooltipMessage="This is a success message"
    //                             tooltipPosition="right"
    //                             tooltipId={params?.data?.quotation_id}  // Unique ID for this status

    //                         />            </div>
    //                 </div>

    //             );
    //         },
    //     }
    //     ,

    //     {
    //         headerName: "Action",
    //         field: "action",
    //         sortable: false,
    //         maxWidth: 200,
    //         pinned: "right",
    //         minWidth: 150,
    //         cellRenderer: (params) => {
    //             const filteredActions = ActionButton.filter((action) => {
    //                 if (params?.data?.status === 1 && params?.data?.type === "in") {
    //                     return ["received"].includes(action.action);
    //                 }
    //                 if (params?.data?.status === 1 && params?.data?.type === "out") {
    //                     return ["issueed", "return"].includes(action.action);
    //                 }
    //                 return false;
    //             });
    //             return (
    //                 <div className={`flex gap-1 items-center ${params?.data?.status !== 1 ? "justify-end" : "justify-center"}`}
    //                 >
    //                     <span
    //                         className="top-clr rounded-full border p-2 cursor-pointer"
    //                         data-tooltip-id="edit-notes"
    //                         onClick={() => {
    //                             setValue("uuid", params?.data?.uuid);
    //                             setValue("date", params?.data?.date);
    //                             setValue("quantity", params?.data?.quantity);
    //                             setItemModal(true);
    //                         }}
    //                     >
    //                         {React.cloneElement(icons.editIcon, { size: 18 })}
    //                     </span>
    //                     {params?.data?.status !== 2 && params?.data?.status !== 3 && params?.data?.status !== 4 && (
    //                         <ActionDropdown
    //                             options={filteredActions}
    //                             onAction={(e) => handleAction(e, params, params.data)}
    //                         />
    //                     )}
    //                 </div>
    //             );
    //         },
    //     },
    // ];

    const columnDefs = [
        {
          headerName: "Request No",
          field: "request_no",
          unSortIcon: true,
          minWidth: Math.max(calculateColumnWidth("request_no", MaterialInOut?.data), 150),
        },
        {
          headerName: "Date",
          field: "date",
          unSortIcon: true,
          minWidth: Math.max(calculateColumnWidth("date", MaterialInOut?.data), 150),
        },
        {
          headerName: "Material Name",
          field: "material_name",
          unSortIcon: true,
          minWidth: Math.max(calculateColumnWidth("material_name", MaterialInOut?.data), 150),
        },
        {
          headerName: "Quantity",
          field: "quantity",
          unSortIcon: true,
          minWidth: Math.max(calculateColumnWidth("quantity", MaterialInOut?.data), 150),
        },
        {
          headerName: "Unit",
          field: "unit_name",
          unSortIcon: true,
          minWidth: Math.max(calculateColumnWidth("unit_name", MaterialInOut?.data), 150),
        },
        {
          headerName: "Material Flow",
          field: "type",
          unSortIcon: true,
          minWidth: Math.max(calculateColumnWidth("type", MaterialInOut?.data), 150),
        },
        {
          headerName: "Status",
          field: "status",
          sortable: false,
          minWidth: Math.max(calculateColumnWidth("status_label", MaterialInOut?.data), 150),
          cellRenderer: (params) => {
            const statusMapping = {
              1: "darkpurple",
              0: "darkRed",
              2: "darkBlue",
              3: "lightgreen",
              4: "darkRed",
            };
            const status = statusMapping[params?.data?.status];
            return (
              <div className="flex justify-center items-center w-100">
                <div className="flex justify-center">
                  <StatusManager
                    status={status}
                    message={params?.data?.status_label}
                    tooltipMessage="This is a success message"
                    tooltipPosition="right"
                    tooltipId={params?.data?.quotation_id}
                  />
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Action",
          field: "action",
          sortable: false,
          pinned: "right",
          maxWidth: 200,
          minWidth: Math.max(calculateColumnWidth("action", MaterialInOut?.data), 150),
          cellRenderer: (params) => {
            const filteredActions = ActionButton.filter((action) => {
              if (params?.data?.status === 1 && params?.data?.type === "in") {
                return ["received"].includes(action.action);
              }
              if (params?.data?.status === 1 && params?.data?.type === "out") {
                return ["issueed", "return"].includes(action.action);
              }
              return false;
            });
      
            return (
              <div
                className={`flex gap-1 items-center ${
                  params?.data?.status !== 1 ? "justify-end" : "justify-center"
                }`}
              >
                <span
                  className="top-clr rounded-full border p-2 cursor-pointer"
                  data-tooltip-id="edit-notes"
                  onClick={() => {
                    setValue("uuid", params?.data?.uuid);
                    setValue("date", params?.data?.date);
                    setValue("quantity", params?.data?.quantity);
                    setItemModal(true);
                  }}
                >
                  {React.cloneElement(icons.editIcon, { size: 18 })}
                </span>
      
                {![2, 3, 4].includes(params?.data?.status) && (
                  <ActionDropdown
                    options={filteredActions}
                    onAction={(e) => handleAction(e, params, params.data)}
                  />
                )}
              </div>
            );
          },
        },
      ];
      
    const handlePageChange = (page) => {
        setPaginationCurrentPage(page);
        fetchTasks();
    };

    const handlePageSizeChange = (pageSize) => {
        setPaginationPageSize(pageSize);
        setPaginationCurrentPage(1);
        fetchTasks();
    };


    const [isApproveModal, setIsApproveModal] = useState(false);
    const [itemModal, setItemModal] = useState(false);



    const ActionButton = [
        { action: "received", label: "received", icon: icons.cancelIcon, iconClass: "text-green-200 cursor-pointer ", },
        { action: "issueed", label: "issueed", icon: icons.tick, iconClass: "text-green-200 cursor-pointer", },
        { action: "return", label: "return", icon: icons.cancelIcon, iconClass: "text-green-200 cursor-pointer ", },
    ];

    const handleAction = async (action, params, master) => {
        const actionTypeMapping = {
            received: 2,
            return: 4,
            //   Delivered: 5,
            //   Cancel: "0",
            issueed: 3,
        };

        // Get the action type number based on the action name
        const actionType = actionTypeMapping[action] || null;
        setValue("status", Number(actionType)); // Convert actionType to a number
        setValue("uuid", params.data.uuid); // Set the UUID
        setValue("type", params.data.type);
        setIsApproveModal(true); // Open the modal
    };
    const updateItem = async (data) => {
        setLoading(true);
        try {
            const result = await ProjectShowMaterialInOutUpdateEffect(data);
            setToastData({
                show: true,
                type: result.data.status,
                message: result.data.message,
            });
        } catch (error) {
            setToastData({
                show: true,
                type: "error",
                message: error?.response?.data?.message || "Something went wrong!",
            });
        } finally {
            setLoading(false);
            fetchTasks();
            setItemModal(false);
            reset();

        }
    };

    const approveHandler = async (data) => {

        setLoading(true);
        try {
            const result = await ProjectShowMaterialInOutApprovedEffect(data);
            
            setToastData({
                show: true,
                type: result.data.status,
                message: result.data.message,
            });
        } catch (error) {
            setToastData({
                show: true,
                type: "error",
                message: error?.response?.data?.message || "Something went wrong!",
            });
        } finally {
            setLoading(false);
            fetchTasks(); // Refresh the list
            setIsApproveModal(false); // Close the modal
            reset();
        }


    };



    return (
        <div >
            {toastData?.show && (
                <AlertNotification
                    show={toastData?.show}
                    message={toastData?.message}
                    onClose={toastOnclose}
                />
            )}
            {loading && (
                <Loader />
            )}
            <>
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
                        {/* <div>
              <DateRangePickerComponent
                className="darkCardBg"
                startDate={dates.startDate}
                endDate={dates.endDate}
                onDatesChange={handleDatesChange}
                focusedInput={focusedInput}
                onFocusChange={setFocusedInput}
              />
            </div> */}
                    </div>

                    <div className="flex items-center gap-3">
                        <FilterDropdown
                            options={TypeFilter}
                            placeholder=" Material Type"
                            onFilter={handleTypeChange}
                            value={filters.type} // Bind the value to the filters.status state
                        />

                        <FilterDropdown
                            options={StatusFilter}
                            placeholder="Status"
                            // showClearButton={true}
                            onFilter={handleStatusChange}
                            value={filters.status}
                        // Bind the value to the filters.status state
                        />
                        <div className="me-3">
                            <  FilterDropdownButton
                                isDropDownButtonStyles={true}
                                options={CreateFilter}
                                placeholder="Create"
                                onFilter={handleCreateChange}
                            // value={filters.status}

                            />
                            {/* <FilterDropdownButton
                                isDropDownButtonStyles={true}
                                label="Create"
                                icon={icons.plusIcon}

                                onClick={() => {
                                    navigate("/user/project/project-detail/create-material-in-out", { state: { project_id: projectDetails?.project_no, project_uuid: projectDetails?.project_uuid } });
                                }}
                            /> */}
                        </div>
                        {/* <div>
              <ExportButton
                label="Export"
                // data={projectList.map(({
                //   lead_id,
                //   lead_name,
                //   lead_contact,
                //   district_name,
                //   p_village_town, // Assuming taluk is stored in p_village_town
                //   address,
                //   incharge_name,
                //   stage_name,
                //   overdue_days,
                //   next_followup
                // }) => ({
                //   Lead_ID: lead_id,
                //   Name: lead_name,
                //   Contact: lead_contact,
                //   District: district_name,
                //   Taluk: p_village_town,
                //   Address: address,
                //   Incharge: incharge_name,
                //   Stage: stage_name,
                //   Overdue_Date: overdue_days,
                //   Next_Update_Date: next_followup
                // }))}
                filename="Project_List"
              />
            </div> */}
                    </div>
                </div>
            </>

            {!loading && MaterialInOut?.data?.length > 0 ? (
                <>
                    <ReusableAgGrid
                        key={columnDefs.length}
                        rowData={MaterialInOut?.data}
                        columnDefs={columnDefs}
                        defaultColDef={{ resizable: false }}
                        onGridReady={(params) => params.api.sizeColumnsToFit()}
                        pagination={false}
                        showCheckbox={false}
                    />
                    <Pagination
                        currentPage={paginationCurrentPage}
                        totalPages={MaterialInOut?.last_page || 1}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        startItem={MaterialInOut?.from || 0}
                        endItem={MaterialInOut?.to || 0}
                        totalItems={MaterialInOut?.total || 0}
                    />

                </>
            ) : (
                !loading && <div className="bg-white rounded-lg pe-3 flex w-full h- items-center justify-center text-gray-500">
                    No MaterialInOut found.</div>
            )}

            <Modal
                isOpen={isApproveModal}
                onClose={() => { setIsApproveModal(false); reset(); }}
                title="approve Material Return"
                showHeader
                size="m"
                showFooter={false}
            >
                <form onSubmit={handleSubmit(approveHandler)}>
                    <input type="hidden" {...register("uuid")} />
                    <input type="hidden" {...register("status")} />
                    <input type="hidden" {...register("type")} />
                    <div>
                        <TextArea
                            label="reason"
                            id="reason"
                            placeholder="reason"
                            register={register}
                            validation={{
                                required: "Please Enter reason"
                            }}
                            errors={errors}
                        />

                    </div>

                    <div className="flex mt-4">
                        <IconButton label="Submit" icon={icons.saveIcon} type="submit" loading={loading} />
                    </div>
                </form>

            </Modal>
            <Modal
                isOpen={itemModal}
                onClose={() => { setItemModal(false); reset(); }}
                title="Update Material Return"
                showHeader
                size="m"
                showFooter={false}
            >

                <form onSubmit={handleSubmit(updateItem)}>
                    <input type="hidden" {...register("uuid")} />
                    <input type="hidden" {...register("date")} />

                    <div>
                        <FormInput
                            label="Quantity"
                            id="quantity"
                            placeholder="quantity"
                            type="number"
                            min={0}
                            register={register}
                            validation={{
                                required: "Please Enter quantity"
                            }}
                            errors={errors}
                        />

                    </div>

                    <div className="flex mt-4">
                        <IconButton label="Submit" icon={icons.saveIcon} type="submit" loading={loading} />
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default MaterialInOut;