import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from 'react-router';
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import Pagination from "../../../UI/AgGridTable/Pagination/Pagination";
import PaginationSmall from "../../../UI/AgGridTable/Pagination/paginationSmall";
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import icons from "../../../contents/Icons";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import ExportButton from "../../../UI/AgGridTable/ExportBtn/ExportBtn";
import DateRangePickerComponent from "../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent";
import Modal from "../../../UI/Modal/Modal";
import ActionDropdown from "../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import { useForm } from "react-hook-form";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Select from "../../../UI/Select/SingleSelect";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import ModalCenter from "../../../UI/ModalCenter/ModalCenter";
import FileInput from "../../../UI/Input/FileInput/FileInput"
import formatDateForDisplay from "../../../UI/Date/DateDisplay";
import formatDateForInput from "../../../UI/Date/Date";
import CreateQuery from "./CreateQuery";
import { fetchActivityQuestionQuery, fetchActivityQuery, updateActivityQuery, addActivityReplay } from "../../../redux/Utils/ActivityQuery/ActivityQueryAction";

const QuestionList = () => {
    const dispatch = useDispatch();
    const { questionData = [], questionPagination = {}, error } = useSelector(
        (state) => state.activityQuery || {}
    );
    const QuestionData = questionData?.data || [];
    
    const { register, formState: { errors }, handleSubmit, setValue, reset } = useForm();
    const [toastData, setToastData] = useState({ show: false });
    const navigate = useNavigate();
    const [isUpdateModal, setIsUpdateModal] = useState(false);
    const [isViewModal, setIsViewModal] = useState(false);
    const [isAddModal, setIsAddModal] = useState(false);
    // Destructure pagination safely
    const current_page = questionPagination?.current_page || 1;
    const total_pages = questionPagination?.last_page || 1;
    const total_items = questionPagination?.total || 0;

    // Component state
    const [paginationPageSize, setPaginationPageSize] = useState(10);
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(current_page);
    const [searchText, setSearchText] = useState("");
    const [isMasterCreateModal, setIsMasterCreateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState();
    const [loading, setLoading] = useState(false);

    // Function to fetch inventory master data
    const fetchDataQues = () => {
        dispatch(fetchActivityQuery({ page: paginationCurrentPage, per_page: paginationPageSize }));
    };
    const fetchData = () => {
        dispatch(fetchActivityQuestionQuery({ page: paginationCurrentPage, per_page: paginationPageSize }));
    };
    useEffect(() => {
        fetchDataQues();
        fetchData();
    }, [dispatch, paginationCurrentPage, paginationPageSize]);

    const handleCreateSuccess = () => {
        fetchDataQues();
        setIsMasterCreateModal(false);
    };

    // Handle pagination
    const handlePageChangeQues = (page) => {
        if (page > 0 && page <= total_pages) {
            setPaginationCurrentPage(page);
        }
    };

    // Handle page size change
    const handlePageSizeChangeQues = (pageSize) => {
        setPaginationPageSize(pageSize);
        setPaginationCurrentPage(1);
    };
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const option = [
        { label: "Edit", action: "edit", icon: icons.pencil },
        { label: "View", action: "view", icon: icons.viewIcon },
        { label: "Add Answer", action: "add", icon: icons.plusIcon },
    ];

    const handleAction = (action, e, master) => {
        const { uuid, id, query_name } = e?.data || {};

        if (action === "edit" && uuid && id) {
            setSelectedUser(e.data);
            setValue("query_name", query_name);
            setValue("uuid", uuid);
            setIsUpdateModal(true);
        }
        if (action === "view" && uuid && id) {
            setSelectedUser(e.data);
            setIsViewModal(true);
        }
        if (action === "add" && uuid && id) {
            setSelectedUser(e.data);
            setIsAddModal(true);

        }
    };


    const columnDefs = [
        { headerName: "Questions", field: "query_name", unSortIcon: true, },
        {
            headerName: "Action", field: "action", sortable: false, pinned: "right", cellRenderer: (params) => {
                return (
                    <div>
                        <ActionDropdown options={option} onAction={(e) => handleAction(e, params, params.data)} />
                    </div>
                );
            },
        }
    ];

    const masterHandler = (response) => {
        
        if (response.success) {
            setToastData({ show: true, message: "Update Successfully", type: "success" });
            setIsUpdateModal(false);
            fetchDataQues();
            fetchData();
        } else {
            setToastData({ show: true, message: response.error, type: "error" });
        }
        setLoading(false);
    };
    const updateHandler = (data) => {
        dispatch(
            updateActivityQuery({
                ...data,
                uuid: data.uuid,
                name: data.query_name,
                callback: masterHandler,
            })
        )
    };
    const addMasterHandler = (data) => {
        dispatch(addActivityReplay({
            ...data,
            name: data.name,
            query_id: selectedUser?.id,
            dropdown_for: "reply",
            callback: masterHandlerAdd
        }));
    };

    const masterHandlerAdd = (response) => {
        if (response.success) {
            setToastData({ show: true, message: response.data.message, type: "success" });
            setIsAddModal(false);
            fetchData();
            fetchDataQues();
            reset();
        } else {
            setToastData({ show: true, message: response.error, type: "error" });
        }
        setLoading(false);
    };
    const toastOnclose = () => {
        setToastData({ ...toastData, show: false });
    };
    return (
        <div>
            {toastData.show && (
                <AlertNotification
                    type={toastData.type}
                    show={toastData.show}
                    message={toastData.message}
                    onClose={toastOnclose}
                />
            )}
            <p className="py-3 font-semibold text-lg">Question List</p>
            <ReusableAgGrid
                key={columnDefs.length}
                rowData={QuestionData}
                columnDefs={columnDefs}
                defaultColDef={{ resizable: true }}
                onGridReady={(params) => {
                    params.api.sizeColumnsToFit();
                }}
                pagination={false}
                showCheckbox={false}
            />
            <PaginationSmall
                currentPage={paginationCurrentPage}
                totalPages={total_pages}
                onPageChange={handlePageChangeQues}
                className="w-full flex justify-between"
            />
            {/* <Pagination
                currentPage={paginationCurrentPage}
                totalPages={total_pages}
                onPageChange={handlePageChangeQues}
                onPageSizeChange={handlePageSizeChangeQues}
                startItem={(paginationCurrentPage - 1) * paginationPageSize + 1}
                endItem={Math.min(paginationCurrentPage * paginationPageSize, total_items)}
                totalItems={total_items}
            /> */}
            <Modal
                isOpen={isUpdateModal}
                onClose={() => setIsUpdateModal(false)}
                title="Update Question"
                showHeader
                size="m"
                showFooter={false}
            >
                <form onSubmit={handleSubmit(updateHandler)}>
                    <input type="hidden" {...register("uuid")} value={selectedUser?.uuid} />
                    <TextArea
                        id="query_name"
                        iconLabel={icons.enquiry}
                        label={"Question"}
                        validation={{ required: "Question is required" }}
                        register={register}
                        className={"text-sm"}
                        errors={errors}
                    />
                    <div className="flex mt-4">
                        <IconButton label="Update" icon={icons.saveIcon} type="submit" loading={loading} />
                    </div>
                </form>
            </Modal>
            {/* view modal */}
            <Modal
                isOpen={isViewModal}
                onClose={() => setIsViewModal(false)}
                title="View"
                showHeader
                size="m"
                showFooter={false}
            >
                <div className="space-y-4">
                    <div className="">
                        <p className="text-sm font-medium text-gray-500 w-32 py-2">
                            <span className="flex gap-1 items-center">{icons.enquiry} Question</span>
                        </p>
                        <p className="text-sm font-normal text-gray-800 ps-4">{selectedUser?.query_name}</p>
                    </div>

                    <div className="">
                        <p className="text-sm font-medium text-gray-500 w-32 py-2">
                            <span className="flex gap-1 items-center">{icons.answerIcon} Answer</span>
                        </p>
                        {selectedUser?.reply_name?.length > 0 ? (
                            <ul className="text-sm font-normal text-gray-800 space-y-1 ps-4">
                                {selectedUser.reply_name.map((answer, index) => (
                                    <li key={index}>
                                        {index + 1}. {answer}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm font-normal text-gray-800">No answers available.</p>
                        )}
                    </div>

                    <div className="flex items-start">
                        <p className="text-sm font-medium text-gray-500 w-32">
                            <span className="flex gap-1 items-center">{icons.employeeIcon} Created By:</span>
                        </p>
                        <p className="text-sm font-normal text-gray-800 capitalize">{selectedUser?.created_by}</p>
                    </div>
                </div>
            </Modal>

            {/* add Answer */}
            <Modal
                isOpen={isAddModal}
                onClose={() => setIsAddModal(false)}
                title="Add Answer"
                showHeader
                size="m"
                showFooter={false}
            >
                <form onSubmit={handleSubmit(addMasterHandler)}>
                    {/* <label htmlFor="">Question</label> */}
                    <p className="py-2">{selectedUser?.query_name}</p>
                    <TextArea
                        id={"name"}
                        iconLabel={icons.answerIcon}
                        label={"Answer"}
                        validation={{ required: "Question is required" }}
                        register={register}
                        errors={errors}
                    />
                    <div className="flex mt-4">
                        <IconButton label="Add" icon={icons.plusIcon} type="submit" loading={loading} />
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default QuestionList;