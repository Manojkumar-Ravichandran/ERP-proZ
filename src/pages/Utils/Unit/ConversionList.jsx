import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import icons from '../../../contents/Icons';
import { useDispatch } from 'react-redux';
import { getUnitConversionInprogress } from "../../../redux/Utils/Unit/UnitAction"
import Modal from "../../../UI/Modal/Modal";
import FormInput from '../../../UI/Input/FormInput/FormInput';
import { validationPatterns } from '../../../utils/Validation';
import { useForm } from 'react-hook-form';
import AlertNotification from '../../../UI/AlertNotification/AlertNotification';
import { updateUnitConversionInprogress, updateUnitConversionInReset ,deleteUnitConversionInprogress} from '../../../redux/Utils/Unit/UnitAction';
import UnitList from './UnitList';
import PaginationSmall from '../../../UI/AgGridTable/Pagination/paginationSmall';
import { getAllUnitListEffect } from "../../../redux/common/CommonEffects";
import Select from "../../../UI/Select/SingleSelect";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";


export default function ConversionList({ onSuccess }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [unitConversionList, setUnitConversionList] = useState();
    const [searchText, setSearchText] = useState("");
    const [dates, setDates] = useState({ startDate: null, endDate: null });
    const [paginationPageSize, setPaginationPageSize] = useState(10);
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
    const [isUpdateModal, setIsUpdateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [selectedUser, setSelectedUser] = useState();
    const [unitDatas, setunitDatas] = useState();
    const [unitLists, setUnitLists] = useState([]);
    const [unitListsData, setunitListsData] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const {
        register,
        formState: { touchedFields, errors },
        control,
        setValue,
        watch,
        reset,
        handleSubmit,
    } = useForm();

    const getUnitConversionList = () => {
        const data = {
            page: paginationCurrentPage,
            pageSize: paginationPageSize,
            startDate: dates.startDate,
            endDate: dates.endDate,
        };
        dispatch(
            getUnitConversionInprogress({
                ...data,
                callback: handleCategoryList,
            })
        );
    };


    useEffect(() => {
        getUnitConversionList();
    }, [paginationCurrentPage, paginationPageSize]);

    const handleCategoryList = (data) => {
        
        setunitDatas(data);
        setUnitConversionList(data?.data?.data);
    };

    const option = [
        // { label: "View", action: "view", icon: icons.viewIcon },
        { label: "Edit", action: "edit", icon: icons.pencil },
        { label: "Delete", action: "delete", icon: icons.deleteIcon },
    ];
    const columnDefs = [
        { headerName: "Units", field: "unit_name" },
        { headerName: "Rate", field: "rate" },
        { headerName: "conversion", field: "conversion" },
        { headerName: "Action", field: "action" },
    ];

    const handleAction = (action, item) => {
        const { id, unit_name, rate, conversion, conversion_id,unit_id, uuid } = item;
    
        if (action === "edit" && id) {
            setSelectedUser(item);
            setIsUpdateModal(true);
            reset(); // Reset previous values
            setValue("unit_name", unit_name);
            setValue("unit_id",unit_id);
            setValue("rate", rate);
            setValue("conversion_id", conversion_id);
            setValue("uuid", uuid);
        }if (action === "delete" && id){
            setSelectedUser(item);
            setIsDeleteModalOpen(true);
        }
    };
    
    const cancelDelete = () => {
        setIsDeleteModalOpen(false); // Close the delete modal without deleting
    };
    
    const confirmDelete = () => {
        setLoading(true);
        const { uuid } = selectedUser; 
    
        dispatch(deleteUnitConversionInprogress({
            uuid,
            callback: () => {
                setLoading(false);
                setIsDeleteModalOpen(false); 
                setToastData({
                    show: true,
                    message: "Unit deleted successfully!",
                    type: "success",
                });
                getUnitConversionList(); 
            },
        }));
    };
    
    const handlePageChange = (page) => {
        setPaginationCurrentPage(page);
        getUnitConversionList();
    };

    const handlePageSizeChange = (pageSize) => {
        setPaginationPageSize(pageSize);
        setPaginationCurrentPage(1);
        getUnitConversionList();
    };
    // Handle search text change
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    // Handle date range change
    const handleDatesChange = ({ startDate, endDate }) => {
        setDates({ startDate, endDate });
    };
    const handleCreateSuccess = () => {
        getUnitConversionList();
    };
    // edit
    const categoryEditHandler = (data) => {
        const selectedUnit = unitListsData.find(unit => unit.value === parseInt(data.conversion_id));
        const updatedData = {
            rate: data.rate,
            conversion_id: data.conversion_id,
            conversion: selectedUnit ? selectedUnit.label : "",
            uuid: selectedUser?.uuid,
        };
        setLoading(true);
        dispatch(
            updateUnitConversionInprogress({
                ...updatedData,
                callback: () => {
                    setLoading(false); // Reset loading state
                    setIsUpdateModal(false); // Close the modal
                    handleCreateSuccess(); // Refresh the list
                    setToastData({
                        show: true,
                        message: "Unit updated successfully!", 
                        type: "success",
                    });
                },
            })
        );
    };

    const toastOnclose = () => {
        setToastData(() => ({ ...toastData, show: false }));
    };
    // Fetch unit lists when the component mounts
    useEffect(() => {
        const fetchUnitLists = async () => {
            try {
                let { data } = await getAllUnitListEffect();
                const formattedData = data.data.map(list => ({
                    label: `1 ${list.unit_description} (${list.unit_name})`,
                    value: list.id,
                }));
                setUnitLists(formattedData);
            } catch (error) {
                console.error("Failed to fetch unit lists:", error);
                setUnitLists([]);
            }
        };

        if (unitLists.length === 0) {
            fetchUnitLists();
        }
    }, [unitLists]);

    useEffect(() => {
        const fetchUnitListsData = async () => {
            try {
                let { data } = await getAllUnitListEffect();
                const formattedData = data.data.map(list => ({
                    label: list.unit_name,
                    value: list.id,
                }));
                setunitListsData(formattedData);
            } catch (error) {
                console.error("Failed to fetch unit lists data:", error);
                setunitListsData([]);
            }
        };

        if (unitListsData.length === 0) {
            fetchUnitListsData();
        }
    }, [unitListsData]);


    return (
        <>
            {toastData?.show === true && <AlertNotification
                show={toastData?.show}
                message={toastData?.message}
                type={toastData?.type}
                onClose={toastOnclose}

            />}
            <div className="rounded-lg p-2 my-2 bg-white darkCardBg">
                <UnitList
                    data={unitConversionList}
                    columns={columnDefs}
                    options={option}
                    onAction={handleAction}
                />
                {/* <PaginationSmall
                    currentPage={paginationCurrentPage}
                    totalPages={unitDatas?.data?.last_page || 1}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    startItem={unitDatas?.data?.from || 0}
                    endItem={unitDatas?.data?.to || 0}
                    totalItems={unitDatas?.data?.total || 0}
                    className="w-full flex justify-between"
                /> */}
            </div>
            <Modal
                isOpen={isUpdateModal}
                onClose={() => setIsUpdateModal(false)}
                title="Update Category"
                showHeader
                size="m"
                showFooter={false}
            >
                <form onSubmit={handleSubmit(categoryEditHandler)}>
                    <Select
                        options={unitLists}
                        label="Unit"
                        id="unit_id"
                        disabled="true"
                        iconLabel={icons.unitIcon}
                        placeholder="Select Unit"
                        register={register}
                        // validation={{ required: "Unit is Required" }}
                        errors={errors}
                    />
                    <FormInput
                        label="Rate"
                        id="rate"
                        type="number"
                        iconLabel={icons.moneyIcon}
                        placeholder="Enter Rate"
                        register={register}
                        validation={{ required: "Rate is required" }}
                        errors={errors}
                    />
                    <Select
                        options={unitListsData}
                        label="Unit"
                        id="conversion_id"
                        iconLabel={icons.unitIcon}
                        placeholder="Select Unit"
                        register={register}
                        validation={{ required: "Unit is Required" }}
                        errors={errors}
                    />
                    <IconButton label="Update" icon={icons.saveIcon} type="submit" className="my-3" loading={loading} />
                </form>
            </Modal>

            {/* delete */}
            {isDeleteModalOpen && (
                <div className="delete-modal">
                    <div className="modal-content-del darkCardBg">
                        <div className="flex items-center justify-between">
                            <h4>Confirm Delete</h4>
                            <button className="modal-close" onClick={cancelDelete} > &times;</button>
                        </div>
                        <hr />
                        <p className="pt-4">Are you sure you want to delete this item?</p>
                        <div className="modal-actions">
                            <button onClick={confirmDelete} className="btn btn-danger" loading={loading} >Yes, Delete</button>
                            <button onClick={cancelDelete} className="btn btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
