import React, { useEffect, useState } from 'react'
import IconButton from '../../../UI/Buttons/IconButton/IconButton';
import icons from '../../../contents/Icons';
import { useNavigate } from 'react-router';
import { SubTasksCreateEffect, SubTasksUpdateEffect } from '../../../redux/project/ProjectEffects';

import Loader from '../../../components/Loader/Loader';
import ReusableAgGrid from '../../../UI/AgGridTable/AgGridTable';
import { useForm } from 'react-hook-form';

import { getTransactionMatsterListEffect } from '../../../redux/Account/Transactions/Transaction';
import CreateAccountsMaster from './CreateAccountsMaster';
import StaticAccountsData from './StaticAccountsData';

const AccountsDetail = ({ activeCard}) => {
    const {
        register,
        control, reset,
        setValue,
        handleSubmit, getValues,
        formState: { errors },
    } = useForm();
    const [isEditMode, setIsEditMode] = useState(false); // Track whether it's edit mode
    const [searchText, setSearchText] = useState("");
    const [isApproveModal, setIsApproveModal] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [loading, setLoading] = useState(false);
    const [taskSubCategoryList, setTaskSubCategoryList] = useState(false);
    
    const [isUpdate, setIsUpdate] = useState(false); // State to track if it's an update
    const [selectedData, setSelectedData] = useState(null); // State to hold the selected row data
    const handleEdit = (data) => {
        setIsUpdate(true);
        setSelectedData(data);
        setIsApproveModal(true);
    };
    const navigate = useNavigate();
    const columnDefs = [
        { headerName: "Nature of Account", field: "natureofaccount", unSortIcon: true, },
        { headerName: "Major Head", field: "majorHead", unSortIcon: true, },
        { headerName: "Sub Head", field: "subHead", unSortIcon: true, },
        { headerName: "Depreciation", field: "depreciation", unSortIcon: true, },
        { headerName: "TDS", field: "tds", unSortIcon: true, },
        // {
        //     headerName: "Duration",
        //     minWidth: 200,
        //     unSortIcon: true,
        //     cellRenderer: (params) => {
        //         const duration = params?.data?.duration || 0;
        //         const duration_type = params?.data?.duration_type || "days";

        //         return (
        //             <div>
        //                 {duration} {duration_type}
        //             </div>
        //         );
        //     },
        // },

        {
            headerName: "Action",
            field: "action",
            sortable: false,
            pinned: "right",
            maxWidth: 100,
            minWidth: 100, // Corrected property name
            cellRenderer: (params) => {
                return (
                    <div className={`flex gap-1 items-center ${params?.data?.status !== 1 ? "justify-end" : "justify-center"}`}
                    >

                        {/* {params?.data?.status === 1 && */}

                        <span
                            className="top-clr rounded-full border p-2 cursor-pointer"
                            data-tooltip-id="edit-notes"
                            onClick={()=>{handleEdit(params?.data)}}
                        >
                            {React.cloneElement(icons.editIcon, { size: 18 })}
                        </span>
                        {/* } */}
                        {/* {params?.data?.status === 1 && */}
                        {/* <ActionDropdown
                        // options={ActionButton}
                        // onAction={(e) => handleAction(e, params, params.data)}
                        /> */}

                        {/* } */}
                        {/* <ActionDropdown
                      iconClass="top-clr rounded-full border p-2 cursor-pointer"
                      icon={icons.MdShare}
                      // options={ActionDropdowns}
                      // onAction={(e) => handleAction(e, params, params.data)}
                    /> */}
                    </div>
                );
            },
        },
    ];
    useEffect(() => {
        fetchLeadList();
    }, [activeCard, searchText]);

    const fetchLeadList = async () => {
        setLoading(true);
        try {
            const filteredData = StaticAccountsData.filter(item => {
                const matchesType = item.type?.toLowerCase() === activeCard?.toLowerCase();
                const matchesSearch = searchText
                    ? (
                        item.natureofaccount?.toLowerCase().includes(searchText.toLowerCase()) ||
                        item.majorHead?.toLowerCase().includes(searchText.toLowerCase()) ||
                        item.subHead?.toLowerCase().includes(searchText.toLowerCase()) ||
                        item.depreciation?.toLowerCase().includes(searchText.toLowerCase()) ||
                        item.tds?.toLowerCase().includes(searchText.toLowerCase())
                    )
                    : true;
    
                return matchesType && matchesSearch;
            });
    
            setTaskSubCategoryList({ data: filteredData });
        } catch (error) {
            console.error("Failed to fetch account data:", error);
        } finally {
            setLoading(false);
        }
    };
    
    

    const approveHandler = async (data) => {
        setLoading(true);
        try {
            let result;

            if (isEditMode) {
                // Call the update effect if in edit mode
                result = await SubTasksUpdateEffect(data);
            } else {
                // Call the create effect if not in edit mode
                result = await SubTasksCreateEffect(data);
            } setToastData({
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
            fetchLeadList();
            setIsApproveModal(false);
            reset();
            setIsEditMode(false); // Set to edit mode

        }
    };


    const toastOnclose = () => {
        setToastData(() => ({ ...toastData, show: false }));
    };
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        // if (!e.target.value) setPaginationCurrentPage(1);
    };

    const handleModalClose = () => {
        setIsApproveModal(false);
        reset();
        setIsEditMode(false); 
        fetchLeadList(); 
        setSelectedData(null); // Clear selected data
    }
    return (
        <div className="w-full  flex flex-col h-full min-h-0">
            <div className="bg-white pr-2 rounded-lg darkCardBg ">
                <div className="bg-white rounded-lg  flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center p-3">
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
                    <div className="flex items-center">
                        <div className="me-3">
                            <IconButton
                                label="Add"
                                icon={icons.plusIcon}
                                onClick={() => {
                                    setIsApproveModal(true);
                                    setIsUpdate(false); // Set to create mode
                                    setSelectedData(null); // Clear selected data
                                }
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0">
                {taskSubCategoryList?.data?.length > 0 ? (
                    <>
                        <ReusableAgGrid
                            key={columnDefs.length}
                            rowData={taskSubCategoryList?.data}
                            columnDefs={columnDefs}
                            defaultColDef={{ resizable: false }}
                            onGridReady={(params) => params.api.sizeColumnsToFit()}
                            pagination={false}
                            showCheckbox={false}
                        />
                    </>
                ) : !loading ? (
                    <div className="flex justify-center items-center h-40 text-gray-500 text-lg font-semibold">
                        No Data Found
                    </div>
                ) : (
                    <Loader />
                )}
            </div>
            <CreateAccountsMaster
                isCreateModal={isApproveModal}
                setIsCreateModal={setIsApproveModal}
                onClose={handleModalClose}
                setToastData={setToastData}
                IsUpdate={isUpdate}
                data={selectedData}
            />
        </div>
    )
}

export default AccountsDetail
