import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import icons from "../../../contents/Icons";
import ExportButton from "../../../UI/AgGridTable/ExportBtn/ExportBtn";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import CreateQuery from "./CreateQuery";
import AnswerList from "./AnswerList";
import QuestionList from "./QuestionList";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivityQuery, fetchActivityQuestionQuery } from "../../../redux/Utils/ActivityQuery/ActivityQueryAction";

const ListQuery = () => {
    const [toastData, setToastData] = useState({ show: false });
    const [searchText, setSearchText] = useState("");
    const dispatch = useDispatch();
    const { replyData = [], replyPagination = {} } = useSelector(state => state.activityQuery || {});
    const { questionData = [], questionPagination = {} } = useSelector(state => state.activityQuery || {});

    const [pagination, setPagination] = useState({ pageSize: 10, currentPage: replyPagination?.current_page || 1 });
    const [paginationQues, setPaginationQues] = useState({ pageSize: 10, currentPage: questionPagination?.current_page || 1 });
    useEffect(() => {
        dispatch(fetchActivityQuery({ page: paginationQues.currentPage, per_page: paginationQues.pageSize }));
        dispatch(fetchActivityQuestionQuery({ page: pagination.currentPage, per_page: pagination.pageSize }));
    }, [dispatch, pagination,paginationQues]);

    const handleCreateSuccess = () => {
        dispatch(fetchActivityQuery({ page: paginationQues.currentPage, per_page: paginationQues.pageSize }));
        dispatch(fetchActivityQuestionQuery({ page: pagination.currentPage, per_page: pagination.pageSize }));
    };

    const handleSearchChange = e => setSearchText(e.target.value);

    return (
        <>
            {toastData.show && (
                <AlertNotification type={toastData.type} show={toastData.show} message={toastData.message} onClose={() => setToastData({ ...toastData, show: false })} />
            )}
            <div className="rounded-lg p-2 my-2 bg-white darkCardBg">
                <Breadcrumb items={[{ id: 1, label: "Home", link: "/user" }, { id: 2, label: "Activity Query List", link: "" }]} />
            </div>
            <div className="bg-white py-3 rounded-lg darkCardBg">
                <div className="flex items-center justify-between bg-white rounded-lg pe-3">
                    {/* <div className="relative w-full max-w-md p-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchText}
                            onChange={handleSearchChange}
                            className="w-full px-4 py-2 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">{icons.searchIcon}</div>
                    </div> */}
                    <div className="relative w-full max-w-md p-4">

                    </div>
                    <div className="flex items-center gap-2">
                        <CreateQuery onSuccess={handleCreateSuccess} />
                        <ExportButton label="Export" filename="Stock Entry List" />
                    </div>
                </div>
            </div>
            <section className="grid grid-cols-2 gap-4 mb-3">
                <QuestionList />
                <AnswerList />
            </section>
        </>
    );
};

export default ListQuery;
