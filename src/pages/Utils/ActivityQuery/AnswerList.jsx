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
import { getEmployeeListEffect, getAllUnitListEffect, getAllItemListEffect } from "../../../redux/common/CommonEffects";
import { fetchActivityQuery, fetchActivityQuestionQuery, updateActivityQuery } from "../../../redux/Utils/ActivityQuery/ActivityQueryAction";
import Select from "../../../UI/Select/SingleSelect";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import ModalCenter from "../../../UI/ModalCenter/ModalCenter";
import FileInput from "../../../UI/Input/FileInput/FileInput"
import formatDateForDisplay from "../../../UI/Date/DateDisplay";
import formatDateForInput from "../../../UI/Date/Date";

const AnswerList = () => {
    const dispatch = useDispatch();
    // Redux state
    const { replyData = [], replyPagination = {}, error } = useSelector(
        (state) => state.activityQuery || {}
    );
    const answerData = replyData?.data || [];
    const { register, formState: { errors }, handleSubmit, setValue } = useForm();
    const [toastData, setToastData] = useState({ show: false });
    const navigate = useNavigate();
    const [isUpdateModal, setIsUpdateModal] = useState(false);
    const current_page = replyPagination?.current_page || 1;
    const total_pages = replyPagination?.last_page || 1;
    const total_items = replyPagination?.total || 0;
    const [paginationPageSizeAns, setPaginationPageSizeAns] = useState(10);
    const [paginationCurrentPageAns, setPaginationCurrentPageAns] = useState(current_page);
    const [searchText, setSearchText] = useState("");
    const [isMasterCreateModal, setIsMasterCreateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState();
    const [loading, setLoading] = useState(false);
    const [isViewModal, setIsViewModal] = useState(false);
    const [paginationPageSize, setPaginationPageSize] = useState(10);
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(current_page);
    // Function to fetch inventory master data
    const fetchData = () => {
        dispatch(fetchActivityQuestionQuery({ page: paginationCurrentPageAns, per_page: paginationPageSizeAns }));
    };
    const fetchDataQues = () => {
        dispatch(fetchActivityQuery({ page: paginationCurrentPage, per_page: paginationPageSize }));
    };

    useEffect(() => {
        fetchData();
        fetchDataQues();

    }, [dispatch, paginationCurrentPageAns, paginationPageSizeAns]);

    const handleCreateSuccess = () => {
        fetchData();
        setIsMasterCreateModal(false);
    };


    // Handle pagination
    const handlePageChangeAns = (page) => {
        if (page > 0 && page <= total_pages) {
            setPaginationCurrentPageAns(page);
        }
    };

    // Handle page size change
    const handlePageSizeChangeAns = (pageSize) => {
        setPaginationPageSizeAns(pageSize);
        setPaginationCurrentPageAns(1);
    };

    // Handle search text change
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const option = [
        { label: "Edit", action: "edit", icon: icons.pencil },
        { label: "View", action: "view", icon: icons.eyeIcon },
        // { label: "Delete", action: "delete", icon: icons.deleteIcon },
    ];

    const handleAction = (action, e, master) => {
        setSelectedUser(e.data);
        const { uuid, id, reply_name
        } = e?.data || {};
        if (action === "edit" && uuid && id) {
            setValue("reply_name", reply_name);
            setValue("uuid", uuid);
            setIsUpdateModal(true);
        } else if (action === "view" && uuid && id) {
            setSelectedUser(e.data);
            setIsViewModal(true);

        }
    };
    

    const columnDefs = [
        { headerName: "Answers", field: "reply_name", unSortIcon: true, },
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
            fetchData();
            fetchDataQues();
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
                name: data.reply_name,
                callback: masterHandler,
            })
        )
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
            <p className="py-3 font-semibold text-lg">Answer List</p>
            <ReusableAgGrid
                key={columnDefs.length}
                rowData={answerData}
                columnDefs={columnDefs}
                defaultColDef={{ resizable: true }}
                onGridReady={(params) => {
                    params.api.sizeColumnsToFit();
                }}
                pagination={false}
                showCheckbox={false}
            />
            <PaginationSmall
                currentPage={paginationCurrentPageAns}
                totalPages={total_pages}
                onPageChange={handlePageChangeAns}
                className="w-full flex justify-between"
            />
            {/* <Pagination
                currentPage={paginationCurrentPageAns}
                totalPages={total_pages}
                onPageChange={handlePageChangeAns}
                onPageSizeChange={handlePageSizeChangeAns}
                startItem={(paginationCurrentPageAns - 1) * paginationPageSizeAns + 1}
                endItem={Math.min(paginationCurrentPageAns * paginationPageSizeAns, total_items)}
                totalItems={total_items}
            /> */}
            <Modal
                isOpen={isUpdateModal}
                onClose={() => setIsUpdateModal(false)}
                title="Update Answer"
                showHeader
                size="m"
                showFooter={false}
            >
                <form onSubmit={handleSubmit(updateHandler)}>
                    <input type="hidden" {...register("uuid")} value={selectedUser?.uuid} />
                    <div className="py-2">
                        <p className="text-base">{selectedUser?.query_name}</p>
                    </div>
                    <TextArea
                        id="reply_name"
                        iconLabel={icons.answerIcon}
                        label={"Answer"}
                        validation={{ required: "Question is required" }}
                        register={register}
                        errors={errors}
                        className={"text-sm"}
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
                title="View Answers"
                showHeader
                size="m"
                showFooter={false}
            >
                <div className="space-y-4">
                    <div className="">
                        <p className="text-sm font-medium text-gray-500 w-32 py-2">
                            <span className="flex gap-1 items-center">{icons.enquiry} Question</span></p>
                        <p className="text-sm font-normal text-gray-800 ps-4">{selectedUser?.query_name}</p>
                    </div>
                    <div className="">
                        <p className="text-sm font-medium text-gray-500 w-32 py-2"><span className="flex gap-1 items-center">{icons.answerIcon} Answer</span></p>
                        <p className="text-sm font-normal text-gray-800 ps-4">{selectedUser?.reply_name}</p>
                    </div>
                    <div className="flex items-start">
                        <p className="text-sm font-medium text-gray-500 w-32">
                            <span className="flex gap-1 items-center">{icons.employeeIcon} Created By:</span> </p>
                        <p className="text-sm font-normal text-gray-800 capitalize">{selectedUser?.created_by}</p>
                    </div>
                </div>

            </Modal>
        </div>
    );
};

export default AnswerList;