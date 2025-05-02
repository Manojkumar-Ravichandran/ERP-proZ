import React, { useEffect, useState } from 'react';
import { ApproveTaskCategoryEffect, CancelTaskCategoryEffect, DeliverTaskCategoryEffect, ProjectShowMaterialEffect, ProjectShowTaskEffect, RejectTaskCategoryEffect, TransitTaskCategoryEffect } from '../../../../redux/project/ProjectEffects';
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
import { calculateColumnWidth } from '../../../../utils/Table';

const MaterialRequest = ({ projectDetails }) => {
    const navigate = useNavigate();
    const {
        register,
        control, reset,
        setValue,
        handleSubmit, getValues,
        formState: { errors },
    } = useForm();
    const [materialRequest, setMaterialRequest] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [searchText, setSearchText] = useState("");
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
    const [isApproveModal, setIsApproveModal] = useState(false);
    const [itemModal, setItemModal] = useState(false);
    const [itemList, setItemList] = useState(false);

    const [paginationPageSize, setPaginationPageSize] = useState(10);
    
    const [filters, setFilters] = useState({

        status: "ALL",
    });


    const fetchMaterialRequest = async () => {
        setLoading(true);
        try {
            const data = {
                project_uuid: projectDetails?.project_uuid,
                search: searchText, // Include search text
                status: filters.status,
            }; // Pass project_uuid
            const response = await ProjectShowMaterialEffect(data);
            
            setMaterialRequest(response.data?.data || []); // Assuming the API returns a `materialRequest` array
        } catch (err) {

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectDetails?.project_uuid) {
            fetchMaterialRequest();
        }
    }, [projectDetails?.project_uuid, searchText, filters,paginationCurrentPage, paginationPageSize]);

    const handleStatusChange = (selectedOption) => {
        setFilters((prev) => ({ ...prev, status: selectedOption || "" }));
    };

    const toastOnclose = () => {
        setToastData({ ...toastData, show: false });
    };
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        // if (!e.target.value) setPaginationCurrentPage(1);
    };
    




    const handlePageChange = (page) => {
        setPaginationCurrentPage(page);
        fetchMaterialRequest();
    };

    const handlePageSizeChange = (pageSize) => {
        setPaginationPageSize(pageSize);
        setPaginationCurrentPage(1);
        fetchMaterialRequest();
    };

    const StatusFilter = [
        { value: "ALL", label: "ALL" },
        { value: 1, label: "Pending" },
        { value: 0, label: "Cancel" },
        { value: 2, label: "Approved" },
        { value: 3, label: "Reject" },
        { value: 4, label: "Transit" },
        { value: 5, label: "Delivered" },
    ];

    const ActionButton = [
        // { action: "Pending", label: "Pending", icon: icons.tick, iconClass: "text-green-200 cursor-pointer", },
        { action: "Approved", label: "Approved", icon: icons.cancelIcon, iconClass: "text-green-200 cursor-pointer ", },
        { action: "Transit", label: "Transit", icon: icons.tick, iconClass: "text-green-200 cursor-pointer", },
        { action: "Delivered", label: "Delivered", icon: icons.cancelIcon, iconClass: "text-green-200 cursor-pointer ", },
        { action: "Cancel", label: "Cancel", icon: icons.tick, iconClass: " text-red-200 cursor-pointer", },
        { action: "Reject", label: "Reject", icon: icons.tick, iconClass: "text-red-200 cursor-pointer", },

    ];

    // const columnDefs = [
    //     // { headerName: "Project Number", field: "project_no", unSortIcon: true, },
    //     { headerName: "Material Request ID", field: "request_no", unSortIcon: true },
    //     // { headerName: "Item name ", field: "subtask_name", unSortIcon: true, },
    //     // { headerName: "Assigned to", field: "assigned_to", unSortIcon: true },
    //     // { headerName: " Planned date", field: "planned_date", unSortIcon: true, },
    //     // { headerName: "Priority ", field: "priority", unSortIcon: true, },
    //     {
    //         headerName: "Status",
    //         field: "status",
    //         sortable: false,
    //         cellRenderer: (params) => {
    //             const statusMapping = {
    //                 1: "darkpurple",
    //                 0: "darkRed",
    //                 2: "lightgreen",
    //                 5: "darkBlue",
    //                 4: "warning",
    //                 3: "darkpink",

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
    //                         />            </div>
    //                 </div>

    //             );
    //         },
    //     },
    //     {
    //         headerName: "Action",
    //         field: "action",
    //         sortable: false,
    //         pinned: "right",
    //         maxWidth: 200,
    //         minWidth: 150,
    //         cellRenderer: (params) => {
    //             const filteredActions = ActionButton.filter((action) => {
    //                 if (params?.data?.status === 1) {
    //                     return ["Approved", "Cancel", "Reject"].includes(action.action);
    //                 }
    //                 if (params?.data?.status === 2) {
    //                     return ["Transit"].includes(action.action);
    //                 }
    //                 if (params?.data?.status === 4) {
    //                     return ["Delivered"].includes(action.action);
    //                 }
    //                 return false; // Exclude actions for other statuses
    //             });
    //             return (
    //                 <div className={`flex gap-1 items-center ${params?.data?.status !== 1 ? "justify-end" : "justify-center"}`}
    //                 >
    //                     <span
    //                         className="top-clr rounded-full border p-2 cursor-pointer"
    //                         // data-tooltip-id="edit-notes"
    //                         onClick={() => {
    //                             // setValue("uuid", params?.data?.uuid);
    //                             setItemList(params?.data);
    //                             // setValue("sub_tasks_name", params?.data?.name);
    //                             // setValue("duration", params?.data?.duration);
    //                             // setValue("duration_type", params?.data?.duration_type);
    //                             setItemModal(true); // Open the modal
    //                         }}
    //                     >
    //                         {React.cloneElement(icons.viewIcon, { size: 18 })}
    //                     </span>

    //                     <span
    //                         className="top-clr rounded-full border p-2 cursor-pointer"
    //                         data-tooltip-id="edit-notes"
    //                         onClick={() => {

    //                             navigate("/user/project/materials/add-material", { state: { ...params.data, isperticularproject: true, tabs_Details: { ...projectDetails, tab: 4, pro_id: projectDetails?.project_no } } });

    //                             // navigate("/user/accounts/sale/create-sale-quotation", { state: { ...params.data } });
    //                         }}
    //                     >
    //                         {React.cloneElement(icons.editIcon, { size: 18 })}
    //                     </span>
    //                     {params?.data?.status !== 0 && params?.data?.status !== 5 && params?.data?.status !== 3 && (

    //                         <ActionDropdown
    //                             options={filteredActions}
    //                             onAction={(e) => handleAction(e, params, params.data)}
    //                         />
    //                     )}
    //                     {/* } */}
    //                     {/* <ActionDropdown
    //               iconClass="top-clr rounded-full border p-2 cursor-pointer"
    //               icon={icons.MdShare}
    //               // options={ActionDropdowns}
    //               // onAction={(e) => handleAction(e, params, params.data)}
    //             /> */}
    //                 </div>
    //             );
    //         },
    //     },
    // ];
  
    const columnDefs = [
        {
          headerName: "Material Request ID",
          field: "request_no",
          unSortIcon: true,
          minWidth: Math.max(calculateColumnWidth("request_no", materialRequest?.data), 150),
        },
        {
          headerName: "Status",
          field: "status",
          sortable: false,
          minWidth: Math.max(calculateColumnWidth("status_label", materialRequest?.data), 150),
          cellRenderer: (params) => {
            const statusMapping = {
              1: "darkpurple",
              0: "darkRed",
              2: "lightgreen",
              5: "darkBlue",
              4: "warning",
              3: "darkpink",
            };
            const status = statusMapping[params?.data?.status];
            return (
              <div className="flex justify-center items-center w-100">
                <div className="flex justify-center">
                  <StatusManager
                    status={status}
                    message={params?.data?.status_label}
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
          minWidth: Math.max(calculateColumnWidth("action", materialRequest?.data), 150),
          cellRenderer: (params) => {
            const filteredActions = ActionButton.filter((action) => {
              if (params?.data?.status === 1) {
                return ["Approved", "Cancel", "Reject"].includes(action.action);
              }
              if (params?.data?.status === 2) {
                return ["Transit"].includes(action.action);
              }
              if (params?.data?.status === 4) {
                return ["Delivered"].includes(action.action);
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
                  onClick={() => {
                    setItemList(params?.data);
                    setItemModal(true);
                  }}
                >
                  {React.cloneElement(icons.viewIcon, { size: 18 })}
                </span>
      
                <span
                  className="top-clr rounded-full border p-2 cursor-pointer"
                  data-tooltip-id="edit-notes"
                  onClick={() => {
                    navigate("/user/project/materials/add-material", {
                      state: {
                        ...params.data,
                        isperticularproject: true,
                        tabs_Details: {
                          ...projectDetails,
                          tab: 4,
                          pro_id: projectDetails?.project_no,
                        },
                      },
                    });
                  }}
                >
                  {React.cloneElement(icons.editIcon, { size: 18 })}
                </span>
      
                {![0, 5, 3].includes(params?.data?.status) && (
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
      
    const handleAction = async (action, params, master) => {
        const actionConfig = {
            // Pending: "reason",
            Approved: "approve_reason",
            Transit: "transit_reason",
            Delivered: "delivery_reason",
            Cancel: "cancel_reason",
            Reject: "decline_reason",
        };

        const fieldKey = actionConfig[action];
        if (!fieldKey) {
            console.error(`No field key found for action type: ${action}`);
            return;
        }

        setValue("action_type", action); // Set the action type
        setValue("uuid", params.data.uuid); // Set the UUID
        setValue(fieldKey, ""); // Dynamically set the field key in the form
        setIsApproveModal(true); // Open the modal
    };


    const handleDateChange = ({ startDate, endDate }) => {
        setFilters((prev) => ({ ...prev, startDate, endDate }));
    };
    const approveHandler = async (data) => {
        setLoading(true);

        // Define a mapping of actions to their corresponding effects and field keys
        const actionConfig = {
            Approved: {
                effect: ApproveTaskCategoryEffect,
                fieldKey: "approval_reason",
            },
            Transit: {
                effect: TransitTaskCategoryEffect,
                fieldKey: "transit_reason",
            },
            Delivered: {
                effect: DeliverTaskCategoryEffect,
                fieldKey: "delivery_reason",
            },
            Cancel: {
                effect: CancelTaskCategoryEffect,
                fieldKey: "cancel_reason",
            },
            Reject: {
                effect: RejectTaskCategoryEffect,
                fieldKey: "rejection_reason",
            },
        };

        try {
            

            // Get the configuration for the current action type
            const config = actionConfig[data.action_type];
            if (!config) {
                throw new Error(`No configuration found for action type: ${data.action_type}`);
            }

            // Dynamically call the effect
            const result = await config.effect(data);
            

            // Optionally show a success toast
            setToastData({
                show: true,
                type: "success",
                message: result?.data?.message || "Action completed successfully!",
            });
        } catch (error) {
            // Handle errors and show an error toast
            console.error("Error handling action:", error);
            setToastData({
                show: true,
                type: "error",
                message: error?.response?.data?.message || "Something went wrong!",
            });
        } finally {
            setLoading(false);
            fetchMaterialRequest(); // Refresh the list
            setIsApproveModal(false); // Close the modal
            reset(); // Reset the form
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

                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <FilterDropdown
                                options={StatusFilter}
                                placeholder="Status"
                                // showClearButton={true}
                                onFilter={handleStatusChange}
                                value={filters.status} // Bind the value to the filters.status state
                            />
                            <div className="me-3">
                                <IconButton
                                    label="Create"
                                    icon={icons.plusIcon}

                                    onClick={() => {
                                        navigate("/user/project/materials/add-material", { state: { project_id: projectDetails?.project_no, isperticularproject: true, iscreate_new: true, tabs_Details: { ...projectDetails, tab: 4, pro_id: projectDetails?.project_no } } });
                                    }}
                                />
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
                </div>
            </>

            {!loading && materialRequest?.data?.length > 0 ? (
                <>
                    <ReusableAgGrid
                        key={columnDefs.length}
                        rowData={materialRequest?.data}
                        columnDefs={columnDefs}
                        defaultColDef={{ resizable: false }}
                        onGridReady={(params) => params.api.sizeColumnsToFit()}
                        pagination={false}
                        showCheckbox={false}
                    />
                    <Pagination
                        currentPage={paginationCurrentPage}
                        totalPages={materialRequest?.last_page || 1}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        startItem={materialRequest?.from || 0}
                        endItem={materialRequest?.to || 0}
                        totalItems={materialRequest?.total || 0}
                    />

                </>
            ) : (
                !loading && <div className="bg-white rounded-lg pe-3 flex w-full h- items-center justify-center text-gray-500">
                    No materialRequest found.</div>
            )}
            <Modal
                isOpen={isApproveModal}
                onClose={() => { setIsApproveModal(false); reset(); }}
                title="edit Task Category"
                showHeader
                size="m"
                showFooter={false}
            >
                <form onSubmit={handleSubmit(approveHandler)}>
                    <input type="hidden" {...register("uuid")} />
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
                {/* {projectList?.data?. && (
                                <>
                               
                                <table className="w-full border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border border-gray-400 px-4 py-2 text-left">Item Name</th>
                                            <th className="border border-gray-400 px-4 py-2 text-left">Quantity</th>
                                            <th className="border border-gray-400 px-4 py-2 text-left">Unit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedRequest.request_material.map((item) => (
                                            <tr key={item.uuid} className="hover:bg-gray-100">
                                                <td className="border border-gray-400 px-4 py-2 ">{item.item_name}</td>
                                                <td className="border border-gray-400 px-4 py-2">{item.quantity}</td>
                                                <td className="border border-gray-400 px-4 py-2">{item.unit_name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </>
                            )} */}
            </Modal>
            <Modal
                isOpen={itemModal}
                onClose={() => { setItemModal(false); reset(); }}
                title="View Item"
                showHeader
                size="m"
                showFooter={false}
            >

                {itemList && (
                    <>

                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-400 px-4 py-2 text-left">Item Name</th>
                                    <th className="border border-gray-400 px-4 py-2 text-left">Quantity</th>
                                    <th className="border border-gray-400 px-4 py-2 text-left">Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemList.request_material.map((item) => (
                                    <tr key={item.uuid} className="hover:bg-gray-100">
                                        <td className="border border-gray-400 px-4 py-2 ">{item.item_name}</td>
                                        <td className="border border-gray-400 px-4 py-2">{item.quantity}</td>
                                        <td className="border border-gray-400 px-4 py-2">{item.unit_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default MaterialRequest;