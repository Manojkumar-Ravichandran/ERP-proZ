import React, { useEffect, useState } from "react";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import icons from "../../../contents/Icons";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import { Loader } from "rsuite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import CreateHeadsData from "./CreateHeadData";
import { H4, H5 } from "../../../UI/Heading/Heading";
import { getMajorHeadListEffect, getSubHeadListEffect } from "../../../redux/Account/Accounts/AccountsEffects";

const MajorandSubHead = () => {

    const {
        reset,
    } = useForm();

    const [majorSearchText, setMajorSearchText] = useState("");
    const [subSearchText, setSubSearchText] = useState("");
    const [isApproveModal, setIsApproveModal] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [loading, setLoading] = useState(false);
    const [majorHeadList, setMajorHeadList] = useState([]);
    const [subHeadList, setSubHeadList] = useState([]);
    console.log("majorHeadList",majorHeadList);
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [sectionList, setSectionList] = useState([]);
    const [natureaccountList, setNatureaccountList] = useState([]);
    const [majorHedList, setMajorHedList] = useState([]);
    const [majorSelectedSection, setMajorSelectedSection] = useState();
    const [subSelectedSection, setSubSelectedSection] = useState();
    const [majorSelectednatureaccount, setMajorSelectednatureaccount] = useState();
    const [subSelectednatureaccount, setSubSelectednatureaccount] = useState();
    const [selectedMajorHead, setSelectedMajorHead] = useState();
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);


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
        
        const headType = data?.majorhead_name  ? "sub" : "major";
        setIsUpdate(true);
        setSelectedData({ ...data, headType });
        setIsApproveModal(true);
    };

    const columnDefsMajorHead = [
        { headerName: "Section", field: "section", unSortIcon: true },
        { headerName: "Nature Of Account", field: "natureaccount_name", unSortIcon: true },
        { headerName: "Major Head", field: "name", unSortIcon: true },
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
            { headerName: "Section", field: "section", unSortIcon: true },
            { headerName: "Nature Of Account", field: "natureaccount_name", unSortIcon: true },
            { headerName: "Major Head", field: "majorhead_name", unSortIcon: true },
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
                            onClick={() => handleEdit(params?.data)}
                        >
                            {React.cloneElement(icons.editIcon, { size: 18 })}
                        </span>
                    </div>
                ),
            },
        ];

    useEffect(() => {
        fetchHeadList();
        getSectionList();
        getSubheadList();
    }, [majorSearchText,subSearchText, paginationCurrentPage,majorSelectedSection,subSelectedSection,majorSelectednatureaccount,subSelectednatureaccount,selectedMajorHead]);

    const fetchHeadList = async() => {
        setLoading(true);
        try {
            const payload = {
                section:majorSelectedSection || "",
                natureaccount:majorSelectednatureaccount || "",
            };
            const subHeadPayload = {
                section:subSelectedSection || "",
                natureaccount:subSelectednatureaccount || "",
                majorhead: selectedMajorHead || "",
            };
            const majorHeadResponse = await getMajorHeadListEffect(payload);
            const subHeadResponse = await getSubHeadListEffect(subHeadPayload);

            console.log("getMajorHeadListEffect",majorHeadResponse);
            console.log("getSubHeadListEffect",subHeadResponse);
            
            const majorHeads = majorHeadResponse?.data?.data?.data?.map(item => ({
                id: item.id,
                name: item.name,
                section:item.section,
                natureaccount_name:item.natureaccount_name,
            })) || [];
            // console.log("majorHeads",majorHeads);
    
            const subHeads = subHeadResponse?.data?.data?.data?.map(item => ({
                uuid: item.uuid,
                name: item.name,
                section: item.section,
                natureaccount_name: item.natureaccount_name,
                majorhead_name: item.majorhead_name,
            })) || [];
            console.log("subHeads",subHeads);

            // const matchesSearch = (item) => {
            //     return searchText
            //         ? item.majorHead?.toLowerCase().includes(searchText.toLowerCase()) ||
            //           item.subHead?.toLowerCase().includes(searchText.toLowerCase())
            //         : true;
            // };
            // console.log("matchesSearch",matchesSearch);
    
            setMajorHeadList(majorHeads);
            setSubHeadList(subHeads);

            // setMajorHedList(
            //     majorHeads.map((item) => ({
            //         label: item.name,
            //         value: item.name,
            //     }))
            // );
            
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };
    const getSectionList = async () => {
            let { data } = await getMajorHeadListEffect();
            
            const sectionData = data.data.data.map((list) => ({
              label: list.section,
              value: list.section,
            }));
            const natureaccountData = data.data.data.map((list) => ({
              label: list.natureaccount_name,
              value: list.natureaccount_name,
            }));
    
            setSectionList(sectionData);
            setNatureaccountList(natureaccountData);
    };
    const getSubheadList = async () => {
            let { data } = await getSubHeadListEffect();
            const majorHeadData = data.data.data.map((list) => ({
              label: list.majorhead_name,
              value: list.majorhead_name,
            }));
            setMajorHedList(majorHeadData);
    };
    const handleMajorSectionChange = (e) => {
        const selectedValue = e.target.value;
        setMajorSelectedSection(selectedValue);
        setPaginationCurrentPage(1); // Reset to first page on section change
    };
    const handleSubSectionChange = (e) => {
        const selectedValue = e.target.value;
        setSubSelectedSection(selectedValue);
        setPaginationCurrentPage(1); // Reset to first page on section change
    };
    
    const handleMajorNatureAccountChange = (e) => {
        const selectedValue = e.target.value;
        setMajorSelectednatureaccount(selectedValue);
        setPaginationCurrentPage(1); // Reset to first page on natureaccount change
    };
    const handleSubNatureAccountChange = (e) => {
        const selectedValue = e.target.value;
        setSubSelectednatureaccount(selectedValue);
        setPaginationCurrentPage(1); // Reset to first page on natureaccount change
    };
    const handleMajorAccountChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedMajorHead(selectedValue);
        setPaginationCurrentPage(1); // Reset to first page on natureaccount change
    };
    const handleMajorHeadClearFilters = () => {
        setMajorSearchText('')
        setMajorSelectedSection(null);
        setMajorSelectednatureaccount(null);
    };
    const handleSubHeadClearFilters = () => {
        setSubSearchText('')
        setSubSelectedSection('');
        setSubSelectednatureaccount("");
        setSelectedMajorHead("");
    };

    const handleMajorSearchChange = (e) => {
        setMajorSearchText(e.target.value);
    };
    const handleSubSearchChange = (e) => {
        setSubSearchText(e.target.value);
    };

    const handleModalClose = () => {
        setIsApproveModal(false);
        reset();
        setIsUpdate(false);
        setSelectedData(null);
        fetchHeadList();
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
                            
                        </div>
                    </div> 
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 p-2 min-h-0 overflow-hidden">
                        {/* Major Head Section */}
                        <div className="flex flex-col bg-white darkCardBg rounded-lg overflow-hidden">
                            <div className="">
                                <H4 className="subsection-heading flex justify-center">Major Head</H4>
                                    <div className="flex items-center justify-between p-2 border-b">
                                    <div className="flex items-center p-3">
                                        <div className="relative w-full max-w-md">
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                value={majorSearchText}
                                                onChange={handleMajorSearchChange}
                                                className="w-full px-4 py-2 pr-10 pl-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                                                {icons.searchIcon}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="chips-container flex justify-between px-4 py-3 ">
        <div className="">
            <select className="chips" onChange={handleMajorSectionChange}>
            {sectionList.map((list) => (
                <option
                className="darkCardBg"
                key={list.value}
                value={list.value}
                >
                {list.label}
                </option>
            ))}
            </select>
        </div>
        <div className="">
            <select className="chips" onChange={handleMajorNatureAccountChange}>
            {natureaccountList.map((list) => (
                <option
                className="darkCardBg"
                key={list.value}
                value={list.value}
                >
                {list.label}
                </option>
            ))}
            </select>
        </div>
        <div>
          <button
            className="chips text-white px-1 py-1 rounded transition float-end gap-2"
            onClick={handleMajorHeadClearFilters}
          >
            <span>{icons.clear}</span> Clear Filters
          </button>
        </div>
      </div>
                                    <div>
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
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto p-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {majorHeadList.length > 0 ? (
                                <ReusableAgGrid
                                key={columnDefsMajorHead.length}
                                rowData={majorHeadList}
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
                            <div className="">
                            <H4 className="subsection-heading flex justify-center">Sub Head</H4>
                            <div className="flex items-center justify-between p-2 border-b">
                            <div className="flex items-center p-3">
                                <div className="relative w-full max-w-md">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={subSearchText}
                                        onChange={handleSubSearchChange}
                                        className="w-full px-4 py-2 pr-10 pl-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                                        {icons.searchIcon}
                                    </div>
                                </div>
                            </div>
                            <div className="chips-container flex justify-between px-4 py-3 ">
        <div className="">
            <select className="chips" onChange={handleSubSectionChange}>
            {sectionList.map((list) => (
                <option
                className="darkCardBg"
                key={list.value}
                value={list.value}
                >
                {list.label}
                </option>
            ))}
            </select>
        </div>
        <div className="">
            <select className="chips" onChange={handleSubNatureAccountChange}>
            {natureaccountList.map((list) => (
                <option
                className="darkCardBg"
                key={list.value}
                value={list.value}
                >
                {list.label}
                </option>
            ))}
            </select>
        </div>
        <div className="">
            <select className="chips" onChange={handleMajorAccountChange}>
            {majorHedList.map((list) => (
                <option
                className="darkCardBg"
                key={list.value}
                value={list.value}
                >
                {list.label}
                </option>
            ))}
            </select>
        </div>
        <div>
          <button
            className="chips text-white px-1 py-1 rounded transition float-end gap-2"
            onClick={handleSubHeadClearFilters}
          >
            <span>{icons.clear}</span> Clear Filters
          </button>
        </div>
      </div>
                            <div>
                                <IconButton
                                    label="Add"
                                    icon={icons.plusIcon}
                                    onClick={() => {
                                        setIsApproveModal(true);
                                        setIsUpdate(false);
                                        setSelectedData({ headType: "sub" });
                                    }}
                                />
                            </div>
                            </div>
                            </div>
                            <div className="flex-1 overflow-auto p-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {subHeadList.length > 0 ? (
                                <ReusableAgGrid
                                key={columnDefsSubHead.length}
                                rowData={subHeadList}
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