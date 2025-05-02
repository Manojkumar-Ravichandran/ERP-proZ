import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";


import { useLocation, useNavigate } from "react-router";
import icons from "../../../../contents/Icons";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";
import Breadcrumps from "../../../../UI/Breadcrumps/Breadcrumps";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import FormTable from "../../../../UI/AgGridFormTable/FormAgTable";
import { CreateMaterialEffect, CreateTaskCategorylistEffect, projectDropdownEffect, ProjectShowMaterialInOutcreateEffect, RequestDropdownEffect, UpdateMaterialEffect } from "../../../../redux/project/ProjectEffects";
import Select from "../../../../UI/Select/SingleSelect";
import SearchableSelect from "../../../../UI/Select/SearchableSelect";
import { getAllItemListEffect, getAllUnitListEffect } from "../../../../redux/common/CommonEffects";

export default function CreateMaterialInOut() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [itemList, setItemList] = useState([]);
    const [filteredItemList, setFilteredItemList] = useState([]);
    const [IsEditMode, setIsEditMode] = useState(false);

    const [unitList, setUnitList] = useState([]);

    const [selectedItemList, setSelectedItemList] = useState([]);
    const location = useLocation();

    const mainFormMethods = useForm({
        defaultValues: {
            date: new Date().toISOString().split("T")[0], // Set default date to today
        }
    });
    const itemFormMethods = useForm();

    const { register, formState: { errors }, handleSubmit, setValue, watch, reset, trigger } = mainFormMethods;
    useEffect(() => {
        if (location?.state) {

            const lead = location.state;

            // setSelectedLead({
            //     value: lead.lead_id,
            //     label: `${lead.cust_name} - ${lead.lead_id}`,
            // });

            setValue("project_id", lead?.project_no || "");
            setValue("type", lead?.type || "");

            // setValue("request_id", lead?.request_id || "");
            // setValue("uuid", lead?.uuid || "");
            // setValue("date", lead?.date || "");
            // setValue("category_name", lead?.cust_name || "");
            // setValue("subtask_id", lead?.subtask_id || "");
            // setValue("subtask_name", lead?.subtask_name);
            // setValue("description", lead?.description || "");
            // setValue("assigned_to", lead?.assigned_to || "");
            // setValue("planned_date", lead?.planned_date || "");
            // setValue("priority", lead?.priority);
            // 
            // setValue("date", lead?.date);
            // if (location.state.request_material) {
            //     // Transform the array to include the `name` property for each object
            //     const transformedData = location.state.request_material.map((item) => ({
            //         ...item,
            //         name: item.item_name, // Add the `name` property using `item_name`
            //     }));

            //     setSelectedItemList(transformedData); // Set the transformed data to `selectedItemList`
            // }
            // setIsEditMode(true)
        } else {

            setValue("date", new Date().toISOString().split("T")[0]); // Set today's date for new entries
        }
    }, [location?.state, setValue]);
    const breadcrumbItems = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Material", link: "/user/project/materials" },
        { id: 3, label: "Create Material" }
    ];

    const [materialDetailList, setMaterialDetailList] = useState([]);

    useEffect(() => {
        if (selectedItemList?.length > 0) {
            const idsToRemove = selectedItemList.map((item) => item.id);

            const updatedItemList = itemList.filter(
                (item) => !idsToRemove.includes(item.id)
            );
            setFilteredItemList(updatedItemList);
        } else {
            setFilteredItemList([...itemList]);
        }
    }, [selectedItemList, itemList]);

    useEffect(() => {
        const fetchData = async () => {
            const [itemData, unitData] = await Promise.all([
                getAllItemListEffect(),
                getAllUnitListEffect(),
            ]);

            setItemList(
                itemData?.data?.data.map((item) => ({
                    label: `${item.material_name} ${item?.material_code ? "-" + item?.material_code : ""}`,
                    value: item.id,
                    ...item,
                }))
            );
            setUnitList(
                unitData?.data?.data.map((unit) => ({
                    label: unit.unit_name,
                    value: unit.id,
                }))
            );
        };

        fetchData();
    }, []);
    useEffect(() => {
        (async () => {
            try {
                const projectId = location?.state?.project_id; // Get project_id from location.state
                let { data } = await RequestDropdownEffect({ project_id: projectId }); // Pass project_id to the API
                data = data.data.map((list) => ({
                    ...list,
                    label: list.request_no,
                    value: list.request_id,
                }));
                setMaterialDetailList(data);
                setValue("project_id", projectId);
                setValue("type", location?.state?.type);

                // Set default value for project_id
            } catch (error) {
                setMaterialDetailList([]);
            }
        })();
    }, [location?.state?.project_id]); // Add project_id as a dependency
    const ItemSubmitHandler = (data) => {
        const selectedItem = itemList.find(
            (item) => Number(item.value) === Number(data.item_id)
        );


        const newItem = {
            ...data,
            material_name: selectedItem?.material_name,
            name: selectedItem.label,
        }
        console.log("label", newItem)
        setSelectedItemList((prevList) => [...prevList, newItem]);
        itemFormMethods.reset();
    };

    const handleDeleteItem = (index) => {
        setSelectedItemList((prevList) => prevList.filter((_, i) => i !== index));
    };

    const toastOnclose = () => {
        setToastData(() => ({ ...toastData, show: false }));
    };
    const addMasterHandler = async (data) => {
        let payload = {
            // uuid: data?.uuid,
            request_id: data?.request_id,
            project_id: data?.project_id,
            type: data?.type,
            date: data?.date,
            items: selectedItemList.map(item => ({
                item_id: item.item_id,
                quantity: item.quantity,
                unit: item.unit,
            })),
        };

        try {
            let response;
            setLoading(true);

            response = await ProjectShowMaterialInOutcreateEffect(payload);

            setLoading(false);
            if (response?.data?.status === "success") {
                setToastData({
                    show: true,
                    message: response?.data?.message,
                    type: 'success'
                });
                navigate(-1, { state: { tab: 2 } });
            } else {
                setToastData({
                    show: true,
                    message: response?.data?.message,
                    type: 'error'
                });
            }
        } catch (error) {
            setLoading(false);
            console.error("Error saving quotation:", error);
            setToastData({
                show: true,
                message: 'Failed to save quotation. Please try again.',
                type: 'error'
            });
        }
    };
    const handleInputChange = (e, index, field) => {
        const value = e.target.value;
        setSelectedItemList((prevList) =>
            prevList.map((item, i) => {
                if (i !== index) return item;

                let updatedItem = { ...item, [field]: value };

                return updatedItem;
            })
        );
    };

    const columnDefs = [
        {
            headerName: "Item Name",
            field: "name",
            unSortIcon: true,
            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering

        },

        {
            headerName: "Quantity",
            field: "quantity",

            unSortIcon: true,
            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering

        },

        {
            headerName: "Unit",
            field: "unit",

            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" },
            cellRenderer: (params) => {
                if (!params.data || params.data.cost === "Total Amount") return "";

                return (
                    <div>
                        <select
                            value={params.data.unit || ""}
                            onChange={(e) => handleInputChange(e, params.node.rowIndex, "unit")}
                            className="w-full border rounded h-8 min-w-16"
                        >
                            {unitList.map((unit) => (
                                <option key={unit.value} value={unit.value}>
                                    {unit.label}
                                </option>
                            ))}

                        </select>
                    </div>
                );
            }

        },

        {
            headerName: "Action",
            field: "action",
            pinned: "right",
            sortable: false,
            cellRenderer: (params) => {
                if (!params.data || params.data.cost === "Total Amount") return "";
                return (
                    <div>
                        <button
                            onClick={() => handleDeleteItem(params.node.rowIndex)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 text-orange-400"
                        >
                            {icons.deleteIcon}
                        </button>

                    </div>
                );
            },
        }

    ];

    const selectedMaterialId = itemFormMethods.watch("item_id");

    useEffect(() => {
        if (selectedMaterialId) {
            const selectedMaterial = filteredItemList.find(
                (item) => item.id == selectedMaterialId
            );

            if (selectedMaterial) {
                itemFormMethods?.setValue("unit", selectedMaterial.unit);
            } else {
                itemFormMethods?.setValue("unit", "");
            }
        }
    }, [selectedMaterialId, setValue, filteredItemList]);
    console.log("selectedItemList", selectedItemList)
    return (
        <>
            {toastData?.show && (
                <AlertNotification
                    show={toastData?.show}
                    message={toastData?.message}
                    type={toastData?.type}
                    onClose={toastOnclose}
                />
            )}
            <div className="py-3 rounded-lg overflow-hidden w-full border-b-5 border-black">

                <div className="p-2 rounded-lg bg-white darkCardBg mb-2">
                    <Breadcrumps items={breadcrumbItems} />
                </div>

                <div className="p-2 mb-2">
                    <FormProvider {...mainFormMethods}>
                        <form onSubmit={handleSubmit(addMasterHandler)}>

                            <div className="py-5 grid grid-cols-5 gap-3  width-3-4">
                                <div className="col-span-2">
                                    <input
                                        type="hidden"
                                        id="project_id"
                                        {...register("project_id")} />
                                    <input
                                        type="hidden"
                                        id="type"
                                        {...register("type")} />
                                    <Select
                                        options={materialDetailList || []}
                                        label="Request Name/ Id"
                                        id="request_id"
                                        // iconLabel={icons.user}
                                        placeholder="Select Request No "
                                        register={register}
                                        validation={{
                                            required: "Request No is required",
                                        }}
                                        errors={errors}
                                        setValue={watch("request_id")}

                                    />

                                </div>
                                <div className="col-span-2">

                                    <FormInput
                                        id="date"
                                        iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
                                        label="Date"
                                        type="date"
                                        register={register}
                                        errors={errors}
                                        validation={{ required: "Date is required" }}
                                        showStar={false}
                                        defaultValue={new Date().toISOString().split("T")[0]} // Set default value to today's date
                                        min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
                                    />
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                    <div>
                        <FormProvider {...itemFormMethods}>
                            <form onSubmit={itemFormMethods.handleSubmit(ItemSubmitHandler)}>
                                <div className="gap-3 my-2 justify-between content-end width-3/4">

                                    <div className="py-5 grid grid-cols-5 gap-3 justify-between content-end width-3-4">
                                        <div className="col-span-2">
                                            <SearchableSelect
                                                options={filteredItemList}
                                                label="Item Name"
                                                id="item_id"
                                                className="w-50"
                                                placeholder="Select Item"
                                                validation={{ required: "Item is Required" }}
                                                register={itemFormMethods.register}
                                                errors={itemFormMethods.formState.errors}
                                                showStar={true}
                                                setValue={itemFormMethods.setValue}
                                                iconLabel={icons.itemBox}
                                            />
                                        </div>
                                        <FormInput
                                            label="Quantity"
                                            type="number"
                                            iconLabel={icons.quotationIcon}
                                            placeholder="Enter Quantity"
                                            register={itemFormMethods.register}
                                            errors={itemFormMethods.formState.errors}
                                            id="quantity"
                                            validation={{ required: "Quantity is Required" }}
                                        />
                                        <Select
                                            options={unitList}
                                            label="Unit"
                                            id="unit"
                                            iconLabel={icons.unitIcon}
                                            placeholder="Select Unit"
                                            register={itemFormMethods.register}
                                            errors={itemFormMethods.formState.errors}
                                            validation={{ required: false }}
                                            disabled={true}
                                            className="mb-1"
                                        />

                                        <div className="flex items-center pt-4">
                                            <IconButton
                                                label="Add "
                                                type="submit"
                                                className="h-9"
                                                icon={icons.plusIcon}
                                            />
                                        </div>

                                    </div>

                                    {selectedItemList.length > 0 && (
                                        <div>
                                            <FormTable
                                                key={columnDefs.length}
                                                rowData={selectedItemList}
                                                columnDefs={columnDefs}
                                                defaultColDef={{ resizable: false }}
                                                onGridReady={(params) => params.api.sizeColumnsToFit()}
                                                pagination={false}
                                                showCheckbox={false}
                                            />
                                        </div>
                                    )}
                                </div>
                            </form>
                        </FormProvider>
                    </div>

                    {/* {selectedItemList.length > 0 && ( */}
                    <FormProvider {...mainFormMethods}>
                        <form onSubmit={handleSubmit(addMasterHandler)}>
                            <div className="flex gap-3 mt-3">
                                <IconButton
                                    type="button"
                                    icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
                                    label="Cancel"
                                    className="px-4 py-2 btn_cancel"
                                    onClick={() => {
                                        reset();
                                        // navigate(`/user/project/project-detail/${ location?.state?.project_uuid}`,
                                        //     { state: { project_uuid: location?.state?.project_uuid, tab: 4 } }                                          )
                                        // }}
                                        navigate(-1, { state: { tab: 2 } });
                                    }}
                                    disabled={loading}
                                />
                                <IconButton
                                    icon={React.cloneElement(icons.plusIcon, { size: "20px" })}
                                    label="Submit"
                                    className="px-4 py-2"
                                    type="submit"
                                    loading={loading}
                                />
                            </div>
                        </form>
                    </FormProvider>
                    {/* )} */}
                </div>
            </div >
        </>
    );
}

