import React, { useEffect, useState } from "react";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import icons from "../../../contents/Icons";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import { Loader } from "rsuite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import StaticAccountsData from "../AccountsMaster/StaticAccountsData";
import CreateHeadsData from "./CreateHeadData";
import { H5 } from "../../../UI/Heading/Heading";

const MajorandSubHead = () => {

    const {
        register,
        control, reset,
        setValue,
        handleSubmit, getValues,
        formState: { errors },
    } = useForm();

    const [searchText, setSearchText] = useState("");
    const [isApproveModal, setIsApproveModal] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [loading, setLoading] = useState(false);
    const [headList, setHeadList] = useState({ majorHeads: [], subHeads: [] });
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const navigate = useNavigate();

    const toastOnclose = () => {
        setToastData(() => ({ ...toastData, show: false }));
    };
    const breadcrumbItems = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Major & SubHead" },
    ];

    const handleEdit = (data) => {
        console.log("handleEdit",data);
        
        const headType = data?.subHead ? "sub" : "major";
        setIsUpdate(true);
        setSelectedData({ ...data, headType });
        setIsApproveModal(true);
    };

    const columnDefsMajorHead = [
        { headerName: "Major Head", field: "majorHead", unSortIcon: true },
        {
            headerName: "Action",
            field: "action",
            sortable: false,
            pinned: "right",
            maxWidth: 100,
            minWidth: 100,
            cellRenderer: (params) => (
                <div className="flex gap-1 items-center justify-center">
                    <span
                        className="top-clr rounded-full border p-2 cursor-pointer"
                        data-tooltip-id="edit-notes"
                        onClick={() => handleEdit(params?.data)}
                    >
                        {React.cloneElement(icons.editIcon, { size: 18 })}
                    </span>
                </div>
            ),
        },
    ];
    const columnDefsSubHead = [
            { headerName: "Sub Head", field: "subHead", unSortIcon: true },
            {
                headerName: "Action",
                field: "action",
                sortable: false,
                pinned: "right",
                maxWidth: 100,
                minWidth: 100,
                cellRenderer: (params) => (
                    <div className="flex gap-1 items-center justify-center">
                        <span
                            className="top-clr rounded-full border p-2 cursor-pointer"
                            data-tooltip-id="edit-notes"
                            onClick={() => handleEdit(params?.data)}
                        >
                            {React.cloneElement(icons.editIcon, { size: 18 })}
                        </span>
                    </div>
                ),
            },
        ];

    useEffect(() => {
        fetchLeadList();
    }, [searchText]);

    const fetchLeadList = () => {
        setLoading(true);
        try {
            const matchesSearch = (item) => {
                return searchText
                    ? item.majorHead?.toLowerCase().includes(searchText.toLowerCase()) ||
                      item.subHead?.toLowerCase().includes(searchText.toLowerCase())
                    : true;
            };
    
            const majorHeads = StaticAccountsData.filter(
                item => item.majorHead && matchesSearch(item)
            );
    
            const subHeads = StaticAccountsData.filter(
                item => item.subHead && matchesSearch(item)
            );
    
            setHeadList({ majorHeads, subHeads });
            
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleModalClose = () => {
        setIsApproveModal(false);
        reset();
        setIsUpdate(false);
        setSelectedData(null);
        fetchLeadList();
    };

  return(
    <div className="flex flex-col h-full overflow-hidden">
                {toastData?.show && (
                                <AlertNotification
                                show={toastData.show}
                                message={toastData.message}
                                type={toastData.type}
                                onClose={toastOnclose}
                            />
                )}
                
                <div className="p-2 bg-white darkCardBg mb-2">
                    <Breadcrumps items={breadcrumbItems} />
                </div>
                <div className="w-full flex flex-col h-full min-h-0">
                    <div className="bg-white pr-2 rounded-lg darkCardBg">
                        <div className="bg-white rounded-lg flex items-center justify-between">
                            <div className="flex items-center p-3">
                                <div className="relative w-full max-w-md">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchText}
                                        onChange={handleSearchChange}
                                        className="w-full px-4 py-2 pr-10 pl-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                                        {icons.searchIcon}
                                    </div>
                                </div>
                            </div>
                            <div className="me-3">
                                <IconButton
                                    label="Add"
                                    icon={icons.plusIcon}
                                    onClick={() => {
                                        setIsApproveModal(true);
                                        setIsUpdate(false);
                                        setSelectedData(null);
                                    }}
                                />
                            </div>
                        </div>
                    </div> 
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 p-2 min-h-0 overflow-hidden">
                        {/* Major Head Section */}
                        <div className="flex flex-col bg-white darkCardBg rounded-lg overflow-hidden">
                            <div className="flex justify-center p-2 border-b">
                            <H5 className="subsection-heading">Major Head</H5>
                            </div>
                            <div className="flex-1 overflow-auto p-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {headList.majorHeads.length > 0 ? (
                                <ReusableAgGrid
                                key={columnDefsMajorHead.length}
                                rowData={headList.majorHeads}
                                columnDefs={columnDefsMajorHead}
                                defaultColDef={{ resizable: false }}
                                onGridReady={(params) => params.api.sizeColumnsToFit()}
                                pagination={false}
                                showCheckbox={false}
                                />
                            ) : !loading ? (
                                <div className="flex justify-center items-center h-40 text-gray-500 text-lg font-semibold">
                                No Data Found
                                </div>
                            ) : (
                                <Loader />
                            )}
                            </div>
                        </div>

                        {/* Sub Head Section */}
                        <div className="flex flex-col bg-white darkCardBg rounded-lg overflow-hidden">
                            <div className="flex justify-center p-2 border-b">
                            <H5 className="subsection-heading">Sub Head</H5>
                            </div>
                            <div className="flex-1 overflow-auto p-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {headList.subHeads.length > 0 ? (
                                <ReusableAgGrid
                                key={columnDefsSubHead.length}
                                rowData={headList.subHeads}
                                columnDefs={columnDefsSubHead}
                                defaultColDef={{ resizable: false }}
                                onGridReady={(params) => params.api.sizeColumnsToFit()}
                                pagination={false}
                                showCheckbox={false}
                                />
                            ) : !loading ? (
                                <div className="flex justify-center items-center h-40 text-gray-500 text-lg font-semibold">
                                No Data Found
                                </div>
                            ) : (
                                <Loader />
                            )}
                            </div>
                        </div>
                    </div>
                    <CreateHeadsData
                        isCreateModal={isApproveModal}
                        setIsCreateModal={setIsApproveModal}
                        onClose={handleModalClose}
                        setToastData={setToastData}
                        IsUpdate={isUpdate}
                        data={selectedData}
                    />
                </div>
            </div>
  )
}
export default MajorandSubHead;