import { Loader } from "rsuite";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import icons from "../../../contents/Icons";
import { useForm } from "react-hook-form";
import { getMajorHeadListEffect, getSubHeadListEffect, majorHeadDeleteEffect, subHeadDeleteEffect } from "../../../redux/Account/Accounts/AccountsEffects";
import React, { useEffect, useState } from "react";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import CreateMajorandSubHead from "./CreateMajorandSubHead";

const AccountMaster = () => {
    const {reset} = useForm();
    const [masterList, setMasterList] = useState({ data: [] });
    const [currentMajorHead, setCurrentMajorHead] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [isApproveModal, setIsApproveModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [activeTab, setActiveTab] = useState("assets");
    const [activeCard, setActiveCard] = useState(null);
    const [activeType, setActiveType] = useState(null);
    const [selectedSection, setSelectedSection] = useState();
    const [majorHeadList, setMajorHeadList] = useState([]);
    const [subHeadList, setSubHeadList] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    

    const toastOnclose = () => {
        setToastData(() => ({ ...toastData, show: false }));
    };
    const breadcrumbItems = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Account Master" },
    ];
    const handleMajorEdit = (data) => {
        setIsUpdate(true);
        setSelectedData(data);
        setIsApproveModal(true);
    };
    const handleSubEdit = (data) => {
        
        setIsUpdate(true);
        setSelectedData({ ...data, headType: "sub" });
        setIsApproveModal(true);
    };
    const tabs = [
        { id: "assets", label: "Assets" },
        { id: "liability", label: " Liability" },
        { id: "expenses", label: "Expenses" },
        { id: "income", label: "Income" },
    ];
    const columnDefs = [
            { headerName: "Sub Head", field: "name", unSortIcon: true },
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
                            onClick={() => handleSubEdit(params?.data)}
                        >
                            {React.cloneElement(icons.editIcon, { size: 18 })}
                        </span>
                        <span
                            className="top-clr rounded-full border p-2 cursor-pointer"
                            data-tooltip-id="delete"
                            onClick={() => openDeleteModal(params?.data)}
                        >
                            {React.cloneElement(icons.deleteIcon, { size: 18,color: "#eb8934" })}
                        </span>
                    </div>
                ),
            },
        ];
    useEffect(() => {
        fetchMajorHeadList(activeTab);
        fetchSubHeadList(activeTab, activeCard,searchText);
        }, [searchText,activeTab,selectedSection,activeCard]);

    const fetchSubHeadList = async (section = "", majorhead = "", search = "") => {
    setLoading(true);
    try {
        const payload = {
            section,
            majorhead,
        };

        const response = await getSubHeadListEffect(payload);

        const data = response?.data?.data?.data || [];

        const searchText = search.toLowerCase();
        const filteredData = data.filter(item => 
            item.name?.toLowerCase().includes(searchText)
        );

        const formattedData = filteredData.map(item => ({
            uuid: item.uuid,
            name: item.name,
            section: item.section,
            majorhead: item.majorhead_name || majorhead,
        }));

        setSubHeadList({ data: formattedData });

    } catch (error) {
        console.error("Failed to fetch data:", error);
    } finally {
        setLoading(false);
    }
};

    const fetchMajorHeadList = async (section = "") => {
    setLoading(true);
    try {
        const payload = {
            section: section
        };
        const response = await getMajorHeadListEffect(payload);
        
        const data = response?.data?.data?.data || [];

        const formattedData = data.map(item => ({
            id: item.id,
            uuid:item.uuid,
            name: item.name,
            section: item.section,
        }));

        setMajorHeadList({ data: formattedData });
        if (formattedData.length > 0 && !activeCard) {
            const firstCard = formattedData[0];
            setActiveCard(firstCard.id);
            setCurrentMajorHead(firstCard);
        }
    } catch (error) {
        console.error("Failed to fetch data:", error);
    } finally {
        setLoading(false);
    }
};

const openDeleteModal = (data) => {
        setIsDeleteModalOpen(true);
    };
const handleDelete = async (data) => {

        setLoading(true);
        try {
            const payload = {
                uuid:data.uuid
            }
            let response;
            if (data.headType === "major") {
                response = await majorHeadDeleteEffect(payload);
            } else {
                response = await subHeadDeleteEffect(payload);
            }

            if (response?.status === 200) {
                setToastData({
                    type: "success",
                    message: `${data.headType === "major" ? "Major Head" : "Sub Head"} Deleted successfully`,
                })
            }
             if (data.headType === "major") {
                    fetchMajorHeadList(activeTab); 
                } else {
                    fetchSubHeadList(currentMajorHead.section, currentMajorHead.name, searchText); 
                }
        } catch (error) {
            console.error("Failed to delete:", error);
            setToastData({
                type: "error",
                message: error?.response?.data?.message || error.message || "An error occurred",
            });
            setIsDeleteModalOpen(false);
        } finally {
            setLoading(false);
            reset();
        }
}
const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };
    const handleClearFilters = () => {
        setSearchText('')
        setSelectedSection(null);
        setActiveTab("liability");
    };
    const handleCardClick = (card) => {
        setActiveCard(card.id);
        setCurrentMajorHead(card);
        setSelectedData({ headType: "major", majorhead: card.name, section: card.section, id:card.id });
        
        fetchSubHeadList(card.section, card.name);
    };
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };
    const handleModalClose = () => {
        setIsApproveModal(false);
        reset();
        setIsUpdate(false);
        setSelectedData(null);
        fetchMajorHeadList(activeTab);
        if (currentMajorHead) {
        fetchSubHeadList(currentMajorHead.section, currentMajorHead.name, searchText);
        }
    };
    return(
        <>
        <div className="flex flex-col h-full overflow-hidden">
            {toastData?.show && (
                <AlertNotification
                show={toastData.show}
                message={toastData.message}
                type={toastData.type}
                onClose={toastOnclose}
            />
            )}
            <div className="rounded-lg p-2 my-2 bg-white darkCardBg">
                <Breadcrumps items={breadcrumbItems} />
            </div>
            <div className="p-1 bg-white border-b mb-2">
                <div className="flex">
                    {tabs.map((tab) => (
                        <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2 -mb-px ${activeTab === tab.id ? "tab-active" : ""}`}
                        >
                        {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            {/* Major Head */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-[1fr,2fr] gap-3 min-h-0">
            <div className=" w-full bg-white rounded-lg shadow-md border border-gray-300 flex flex-col h-full min-h-0">
                        <div className="p-3 border-b border-gray-300 bg-white rounded-t-lg darkCardBg flex justify-between items-center">
                            <h3 className="px-2 text-xl font-semibold">Major Head List</h3>
                            <IconButton
                                label="Add"
                                icon={icons.plusIcon}
                                onClick={() => {
                                    setIsApproveModal(true);
                                    setIsUpdate(false);
                                    setSelectedData({ headType: "major" });
                                }}
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0">
                            {majorHeadList?.data?.map((card) => (
                                <div
                                    key={card.id}
                                    onClick={() => handleCardClick(card)}
                                    className={`rounded-lg p-2 my-1 bg-white darkCardBg shadow-lg flex justify-between items-center cursor-pointer 
                                ${activeCard === card.id ? "border-b-[7px]" : "border-b border-gray-300"}`}
                                    style={{
                                        borderColor: activeCard === card.id ? "var(--primary-color)" : undefined,
                                    }}
                                >
                                    <span>{card.name}</span>
                                    <div className="flex gap-1 items-center justify-center">
                        <span
                            className="top-clr rounded-full border p-2 cursor-pointer"
                            data-tooltip-id="edit-notes"
                            onClick={(e) => {
                                e.stopPropagation();  
                                handleMajorEdit(card);     
                    }}
                        >
                            {React.cloneElement(icons.editIcon, { size: 18 })}
                        </span>
                        <span
                            className="top-clr rounded-full border p-2 cursor-pointer"
                            data-tooltip-id="delete"
                            onClick={() => openDeleteModal({...card, headType: "major"})}
                        >
                            {React.cloneElement(icons.deleteIcon, { size: 18, color: "#eb8934" })}
                        </span>
                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Sub Head */}
                <div className="w-full  flex flex-col h-full min-h-0">
                    <div className="bg-white pr-2 rounded-lg ">
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
                                            // disabled={!currentMajorHead}
                                            onClick={() => {
                                                if (currentMajorHead) {
                                                    setIsApproveModal(true);
                                                    setIsUpdate(false); 
                                                    setSelectedData({
                                                        headType: "sub",
                                                        section: currentMajorHead.section,
                                                        majorhead: currentMajorHead.name,
                                                        id:currentMajorHead.id
                                                    });
                                                }
                                            }}
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0">
                        {subHeadList?.data?.length > 0 ? (
                            <>
                                <ReusableAgGrid
                                    key={columnDefs.length}
                                    rowData={subHeadList?.data}
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
                    <CreateMajorandSubHead
                        isCreateModal={isApproveModal}
                        setIsCreateModal={setIsApproveModal}
                        onClose={handleModalClose}
                        setToastData={setToastData}
                        IsUpdate={isUpdate}
                        data={selectedData}
                        activeTab={activeTab}
                    />
                </div>
                {/* delete */}
      {isDeleteModalOpen && (
        <div className="delete-modal">
          <div className="modal-content-del darkCardBg">
            <div className="flex items-center justify-between">
              <h4>Confirm Delete</h4>
              <button className="modal-close" onClick={cancelDelete}>
                {" "}
                &times;
              </button>
            </div>
            <hr />
            <p className="pt-4">Are you sure you want to delete this item?</p>
            <div className="modal-actions">
              <button
                onClick={handleDelete}
                className="btn btn-danger"
                loading={loading}
              >
                Yes, Delete
              </button>
              <button onClick={cancelDelete} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
            </div>  
        </div>

        </>
    )
}
export default AccountMaster;