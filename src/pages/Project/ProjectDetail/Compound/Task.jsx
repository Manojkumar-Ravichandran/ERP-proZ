import React, { useEffect, useState } from 'react';
import { ProjectShowTaskEffect, ProjectShowTaskUpdateEffect, taskAttachmentUpdateEffect, UpdatedTaskList } from '../../../../redux/project/ProjectEffects';
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
import { Button } from 'rsuite';
import TextArea from '../../../../UI/Input/TextArea/TextArea';
import Modal from '../../../../UI/Modal/Modal';
import { useForm } from 'react-hook-form';
import FormInput from '../../../../UI/Input/FormInput/FormInput';
import Select from '../../../../UI/Select/SingleSelect';
import { getEmployeeListEffect } from '../../../../redux/common/CommonEffects';
import SliderInput from './Progress';
import { DevTool } from '@hookform/devtools';
import FileInput from '../../../../UI/Input/FileInput/FileInput';
import MultiSelect from '../../../../UI/Select/MultiSelect';
import MultiSelector from '../../../../UI/Select/MultiSelector';
import MultiSearchableSelect from '../../../../UI/Select/MultiSelector';
import TaskPanel from './CollapePanel';
import { calculateColumnWidth } from '../../../../utils/Table';

const Task = ({ projectDetails }) => {
    const {
        register,
        reset,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
        },
    });

    const [isApproveModal, setIsApproveModal] = useState(false);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [searchText, setSearchText] = useState("");
    const [leadPurpose, setLeadPurpose] = useState([]);
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
    const [selectedLead, setSelectedLead] = useState([]);
    const [itemModal, setItemModal] = useState(false);
    const [UpdateList, setUpdateList] = useState([]);


    const [paginationPageSize, setPaginationPageSize] = useState(10);

    const [filters, setFilters] = useState({

        status: "ALL",
    });
    const StatusFilter = [
        { value: "ALL", label: "All" },
        { value: 1, label: "Not Started" },
        { value: 2, label: "Pending" },
        { value: 3, label: "In Progress" },
        { value: 4, label: "Completed" },
    ];

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = {
                project_uuid: projectDetails?.project_uuid,
                search: searchText, // Include search text
                status: filters.status,
            }; // Pass project_uuid
            const response = await ProjectShowTaskEffect(data);

            setTasks(response.data?.data || []); // Assuming the API returns a `tasks` array
        } catch (err) {

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (projectDetails?.project_uuid) {
            fetchTasks();
        }
    }, [projectDetails?.project_uuid, searchText, filters, paginationCurrentPage, paginationPageSize]);

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


    const columnDefs = [
        {
          headerName: "Task Category",
          field: "category_name",
          unSortIcon: true,
          minWidth: Math.max(calculateColumnWidth("category_name", tasks?.data), 150),
        },
        {
          headerName: "Task name ",
          field: "subtask_name",
          unSortIcon: true,
          minWidth: Math.max(calculateColumnWidth("subtask_name", tasks?.data), 150),
        },
        {
          headerName: "Assigned to",
          field: "assigned_name",
          unSortIcon: true,
          minWidth: Math.max(calculateColumnWidth("assigned_name", tasks?.data), 150),
        },
        {
          headerName: " Planned date",
          field: "planned_date",
          unSortIcon: true,
          minWidth: Math.max(calculateColumnWidth("planned_date", tasks?.data), 150),
        },
        {
          headerName: "Priority ",
          field: "priority",
          unSortIcon: true,
          minWidth: Math.max(calculateColumnWidth("priority", tasks?.data), 150),
        },
        {
          headerName: "Status",
          field: "status",
          sortable: false,
          minWidth: Math.max(calculateColumnWidth("status_label", tasks?.data), 150),
          cellRenderer: (params) => {
            const statusMapping = {
              4: "darkpurple",
              1: "darkRed",
              2: "darkBlue",
              3: "lightgreen",
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
          minWidth: 150,
          cellRenderer: (params) => {
            return (
              <div className={`flex gap-1 items-center ${params?.data?.status !== 1 ? "justify-end" : "justify-center"}`}>
                <span
                  className="top-clr rounded-full border p-2 cursor-pointer"
                  onClick={async () => {
                    try {
                      setUpdateList([]);
                      const response = await UpdatedTaskList({ task_list_id: params?.data?.id });
                      const data = response.data;
                      setUpdateList(data);
                      setItemModal(true);
                    } catch (error) {
                      console.error("Error fetching task details:", error);
                    }
                  }}
                >
                  {React.cloneElement(icons.viewIcon, { size: 18 })}
                </span>
      
                <span
                  className="top-clr rounded-full border p-2 cursor-pointer"
                  data-tooltip-id="edit-notes"
                  onClick={() => {
                    setValue("uuid", params?.data?.uuid);
                    setValue("project_id", params?.data?.project_id);
                    setValue("task_id", params?.data?.id);
                    setIsApproveModal(true);
                  }}
                >
                  {React.cloneElement(icons.editIcon, { size: 18 })}
                </span>
      
                {/* <ActionDropdown /> */}
              </div>
            );
          },
        },
      ];
      

    useEffect(() => {
        (async () => {
            try {
                let { data } = await getEmployeeListEffect();
                data = data.data.map((list) => ({
                    ...list,
                    label: list.name,
                    value: list.id,
                }));
                setLeadPurpose(data);
            } catch (error) {
                setLeadPurpose([]);
            }
        })();
    }, []);

    const handlePageChange = (page) => {
        setPaginationCurrentPage(page);
        fetchTasks();
    };

    const handlePageSizeChange = (pageSize) => {
        setPaginationPageSize(pageSize);
        setPaginationCurrentPage(1);
        fetchTasks();
    };

    // const files = watch("file_url");

    // if (files && files.length > 0) {
    //     const file = files[0];

    // }

    const approveHandler = async (data) => {


        setLoading(true);

        // const formData = new FormData();
        // formData.append('uuid', data.uuid);
        // formData.append("file_url", data.file_url[0]);



        try {

            // const result = taskAttachmentUpdateEffect(formData);
            const remainingData = {
                project_id: data.project_id,
                task_id: data.task_id,
                date: data.date,
                work_done_by: data.work_done_by,
                duration: data.duration,
                duration_type: data.duration_type,
                status: data.status,
                task_complete: data.task_complete,
            };

            await ProjectShowTaskUpdateEffect(remainingData); // Your second API here

        } catch (error) {
            setToastData({
                show: true,
                type: "error",
                message: error?.response?.data?.message || "Something went wrong!",
            });
        } finally {
            setLoading(false);
            fetchTasks(); // Refresh the list
            setIsApproveModal(false); // Close modal
            reset();
        }
    };

    const work_done_by = watch('work_done_by');
    useEffect(() => {
        if (work_done_by) {
            const selectedItemData = leadPurpose?.filter((e) => e.value == work_done_by);

            //   setValue("unit", Number(selectedItemData[0].unit));
        }
    }, [work_done_by]);

    const [previewUrl, setPreviewUrl] = useState(""); // Default to existing image

    // const imageFile = watch("file_url");

    // useEffect(() => {
    //     if (imageFile?.[0]) {
    //         const file = imageFile[0];
    //         const objectUrl = URL.createObjectURL(file);
    //         setPreviewUrl(objectUrl);

    //         return () => URL.revokeObjectURL(objectUrl); // Cleanup old preview URL
    //     }
    // }, [imageFile]);

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
                                    navigate("/user/project/task/add-task", { state: { project_id: projectDetails?.project_no, isperticularproject: true, iscreate_new: true, tabs_Details: { ...projectDetails, tab: 2, pro_id: projectDetails?.project_no } } });
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
            </>

            {!loading && tasks?.data?.length > 0 ? (
                <>
                    <ReusableAgGrid
                        key={columnDefs.length}
                        rowData={tasks?.data}
                        columnDefs={columnDefs}
                        defaultColDef={{ resizable: false }}
                        onGridReady={(params) => params.api.sizeColumnsToFit()}
                        pagination={false}
                        showCheckbox={false}
                    />
                    <Pagination
                        currentPage={paginationCurrentPage}
                        totalPages={tasks?.last_page || 1}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        startItem={tasks?.from || 0}
                        endItem={tasks?.to || 0}
                        totalItems={tasks?.total || 0}
                    />

                </>
            ) : (
                !loading && <div className="bg-white rounded-lg pe-3 flex w-full h- items-center justify-center text-gray-500">
                    No tasks found.</div>
            )}
            <Modal
                isOpen={isApproveModal}
                onClose={() => { setIsApproveModal(false); reset(); }}
                title="Task Update"
                showHeader
                size="m"
                showFooter={false}
            >
                <form onSubmit={handleSubmit(approveHandler)}>
                    <>
                        <input type="hidden" {...register("uuid")} />
                        <input type="hidden" {...register("project_id")} />
                        <input type="hidden" {...register("task_id")} />
                        <div className="grid   gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-3xl 2xl:max-w-4xl">


                            <div className="flex flex-col gap-3 ">
                                <FormInput
                                    id="date"
                                    iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
                                    label="Date "
                                    type="date"
                                    register={register}
                                    errors={errors}
                                    validation={{ required: "date required" }}
                                    showStar={true}

                                    defaultValue={new Date().toISOString().split("T")[0]}

                                    min={new Date().toISOString().split("T")[0]} // Conditionally set min

                                />
                                <MultiSearchableSelect
                                    setValue={setValue}
                                    multiple={true}

                                    options={leadPurpose || []}
                                    label="Assigned To"
                                    id="work_done_by"
                                    iconLabel={icons.user}
                                    placeholder="Select Assigned To"
                                    register={register}
                                    showStar={true}
                                    validation={{
                                        required: "Assigned To is required",
                                    }}
                                    errors={errors}

                                />

                                <div className="flex gap-2 gap-x-2 flex-col md:flex-row">
                                    <FormInput
                                        label="Task Duration"
                                        id="duration"
                                        type="number"
                                        iconLabel={icons.calendarWDate}
                                        placeholder="Task Duration"
                                        register={register}
                                        showStar={true}
                                        validation={{
                                            required: "Duration is required",

                                        }}
                                        errors={errors}
                                    />
                                    <Select
                                        options={[
                                            { label: "Hours", value: "Hours" },
                                            { label: "Days", value: "days" },
                                            // { label: "Month", value: "months" },
                                            // { label: "Year", value: "years" },
                                        ]}
                                        register={register}

                                        setValue={setValue}
                                        label="Duration Type"
                                        id="duration_type"
                                        iconLabel={icons.calendarWDate}
                                        placeholder="Select Duration Type"
                                        showStar={true}

                                        validation={{
                                            required: "Duration type is required",
                                        }}
                                        errors={errors}
                                        value={watch('duration_type')}
                                    />

                                </div>
                                <Select
                                    options={[
                                        { label: "Not Started", value: "1" },
                                        { label: "In Progress", value: "3" },
                                        { label: "Completed", value: "4" },
                                    ]}
                                    register={register}

                                    setValue={setValue}
                                    label="Status"
                                    id="status"
                                    iconLabel={icons.calendarWDate}
                                    placeholder="Select status"
                                    showStar={true}

                                    validation={{
                                        required: "Status is required",
                                    }}
                                    errors={errors}
                                    value={watch('status')}

                                />
                                <SliderInput
                                    name="task_complete"
                                    id="task_complete"
                                    label="Task Progress"
                                    defaultValue={0} // Default slider value
                                    setValue={setValue} // Pass setValue from react-hook-form
                                    register={register} // Pass register from react-hook-form
                                    value={watch('task_complete')}
                                    errors={errors} // Pass errors from react-hook-form
                                />

                                {/* <FileInput
                                    id="file_url"
                                    label="File"
                                    type="file"
                                    iconLabel={icons.filepin}
                                    register={register}
                                    errors={errors}
                                    accept="/*"
                                    showStar={false}
                                    validation={{ required: "false" }}
                                /> */}
                                <TextArea
                                    label="Notes"
                                    id="notes"
                                    placeholder="Notes"
                                    register={register}
                                    validation={{
                                        required: "Please Enter Notes"
                                    }}
                                    errors={errors}
                                />
                            </div>
                        </div>
                        {/* </div> */}
                        <div className="flex mt-4">
                            <IconButton label="Submit" icon={icons.saveIcon} type="submit" loading={loading} />
                        </div>
                    </>
                </form>

            </Modal>
            <Modal
                isOpen={itemModal}
                onClose={() => { setItemModal(false); reset(); }}
                title="View Task Updates List"
                showHeader
                size="m"
                showFooter={false}
            >
                <div className="flex flex-col gap-4 items-center">
                    {UpdateList?.data?.length > 0 ? (
                        UpdateList.data.map((item, index) => (
                            <div className="w-full max-w-[600px]" key={index}>
                                <TaskPanel task={item} />
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-lg font-semibold mt-8">
                            No task updated for this project
                        </div>
                    )}
                </div>


            </Modal>
        </div>
    );
};

export default Task;