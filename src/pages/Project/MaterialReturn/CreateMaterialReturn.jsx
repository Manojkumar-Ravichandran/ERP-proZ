import React, { useCallback, useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import icons from "../../../contents/Icons";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import SearchableSelect from "../../../UI/Select/SearchableSelect";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";

import FormTable from "../../../UI/AgGridFormTable/FormAgTable";
import { useLocation, useNavigate } from "react-router";
import { createSaleQuotationEffect, CustomerListEffect, updateSaleQuotationEffect } from "../../../redux/Account/Sales/SaleQuotation/SaleQuotationEffects";
import SelectSearchable from "../../../UI/Select/Search/SelectSearchable";
import { createSaleReturnEffect, getInvoiceItemEffect, InvoiceDropdownEffect, updateSaleReturnEffect } from "../../../redux/Account/Sales/SaleReturn/SaleReturnEffects";
import { CreateMaterialReturnEffect, projectDropdownEffect, ProjectRequestDropdownEffect, ProjectRequestMaterialDropdownEffect, RequestDropdownEffect } from "../../../redux/project/ProjectEffects";
import Select from "../../../UI/Select/SingleSelect";

export default function CreateMaterialReturn() {
    const navigate = useNavigate();
    const [materialDetailList, setMaterialDetailList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [unitList, setUnitList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [totalAmountList, setTotalAmountList] = useState({});
    const [filteredItemList, setFilteredItemList] = useState([]);
    const [selectedItemList, setSelectedItemList] = useState([]);
    const [leadList, setLeadList] = useState([]);
    const [selectedLead, setSelectedLead] = useState([]);
    const location = useLocation();
    console.log("selectedLead", selectedLead)
    const [selectedInvoice, setSelectedInvoice] = useState([]);


    const mainFormMethods = useForm({
        defaultValues: {
            is_address: true,
            // other default values...
        }
    });
    const itemFormMethods = useForm();

    const { register, formState: { errors }, handleSubmit, setValue, watch, reset, trigger } = mainFormMethods;



    useEffect(() => {
        (async () => {
            try {
                let { data } = await projectDropdownEffect();
                data = data.data.map((list) => ({
                    ...list,
                    label: list.project_id,
                    value: list.id,
                }));
                setMaterialDetailList(data);
            } catch (error) {
                setMaterialDetailList([]);
            }
        })();
    }
        , []);


    const transformData = (data) => {
        return data.map((item) => {
            const withoutTaxCost = parseFloat(item.unit_price) * parseFloat(item.quantity ? item.quantity : 0);
            const taxAmount = (withoutTaxCost * parseFloat(item.gst_slab)) / 100;
            const totalCost = withoutTaxCost + taxAmount;
            return {
                u_id: item.m_uuid || " ",
                id: item.sales_quo_id,
                item_id: item.item_id,
                name: item.material_name,
                quantity: item.quantity || "0",
                total_quantity: parseFloat(item.quantity),
                unit: item.unit,
                unit_name: item.unit_name
            };
        });
    };

    useEffect(() => {
        if (location?.state) {
            
            const lead = location.state;
            setSelectedLead({
                value: lead.request_id,
                label: lead.request_id,
            });
            setValue("uuid", lead?.uuid || "");
            setValue("date", lead?.date);

            setValue("project_id", lead?.project_id || "");
            setValue("request_id", lead?.request_id || "");
            setValue("cust_id", lead?.cust_id || "");

            if (lead?.isperticularproject && !lead?.date) {
                setValue("date", new Date().toISOString().split("T")[0]);
            }
            setValue("cust_name", lead?.cust_name || "");
            setValue("lead_id", lead?.lead_id || "");
            setValue("invoice_date", lead?.invoice_date || "");
            setValue("return_type", lead?.return_type || "");
            setValue("return_reason", lead?.return_reason || "");
            if (location.state.sales_return_material) {
                const transformedData = transformData(location?.state?.sales_return_material);
                setSelectedItemList(transformedData);
            }
            setValue("project_id", location.state.project_id || "");

        } else {
            setValue("date", new Date().toISOString().split("T")[0]); // Set today's date for new entries
        }
    }, [location?.state, setValue]);
    console.log("setSelectedItemList.state", selectedItemList)
    const ReturnType = [
        { value: "partially return", label: "Partially return" },
        { value: "full return", label: "Full return" },
    ];

    const breadcrumbItems = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Return", link: "/user/project/material-return" },
        { id: 3, label: "Create Material Return" }
    ];
    useEffect(() => {
        // Check if location.state.project_id exists and materialDetailList is loaded
        if (location?.state?.project_id && materialDetailList.length > 0) {
            // Set the project_id in the form state
            setValue("project_id", location.state.project_id);

            // Trigger handleProjectChange with the selected project
            const selectedProject = materialDetailList.find(
                (option) => option.value === location.state.project_id
            );
            if (selectedProject) {
                
                handleProjectChange(selectedProject);
            }
        }
    }, [location?.state?.project_id, materialDetailList]);
    console.log("location?.tabs_Details", location?.tabs_Details)
    useEffect(() => {
        if (selectedItemList?.length > 0) {
            setTotalAmountList(calculateTotalAmount());
            const idsToRemove = selectedItemList.map((item) => item.id);

            const updatedItemList = itemList.filter(
                (item) => !idsToRemove.includes(item.id)
            );
            setFilteredItemList(updatedItemList);
        } else {
            setFilteredItemList([...itemList]);
        }
    }, [selectedItemList, itemList]);

    const calculateTotalAmount = () =>
        selectedItemList.reduce(
            (totals, item) => ({
                totalAmount: totals.totalAmount + item.total_cost,
                totalTaxAmount: totals.totalTaxAmount + item.tax_amount,
                totalWithoutTaxAmount: totals.totalWithoutTaxAmount + item.without_tax_cost,
            }),
            { totalAmount: 0, totalTaxAmount: 0, totalWithoutTaxAmount: 0 }
        );

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
    console.log("selectedMaterialId", selectedMaterialId, filteredItemList)
    const handleDeleteItem = (index) => {
        setSelectedItemList((prevList) => prevList.filter((_, i) => i !== index));
    };

    const toastOnclose = () => {
        setToastData(() => ({ ...toastData, show: false }));
    };
    const addMasterHandler = async (data) => {
        const filteredItemList = selectedItemList
            .filter(item => Number(item.quantity) > 0)
            .map(item => ({
                quantity: Number(item.quantity),
                unit: item.unit,
                item_id: item.id,

            }));

        if (filteredItemList.length === 0) {
            setToastData({ show: true, message: "Please add items to the list with quantity greater than 0", type: 'error' });
            return;
        }



        const payload = {

            date: data.date,
            project_id: data?.project_id,
            request_id: data?.request_id,

            items: filteredItemList,
        };

        try {
            setLoading(true);
            const response = await CreateMaterialReturnEffect(payload);
            
            setLoading(false);
            if (response?.data?.status === "success") {
                setToastData({
                    show: true,
                    message: response?.data?.message,
                    type: 'success'
                });
                if (location?.state?.tabs_Details?.project_uuid) {
                    navigate(`/user/project/project-detail/${location.state.tabs_Details.project_uuid}`, {
                        state: { ...location.state.tabs_Details },
                    });
                } else {
                    navigate(-1);
                }
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
                message: 'Failed to save return. Please try again.',
                type: 'error'
            });
            if (location?.state?.tabs_Details?.project_uuid) {
                navigate(`/user/project/project-detail/${location.state.tabs_Details.project_uuid}`, {
                    state: { ...location.state.tabs_Details },
                });
            } else {
                navigate(-1);
            }

        }
    };


    const todayDate = new Date().toISOString().split("T")[0];

    const combinedRowData = [selectedItemList];
    const columnDefs = [
        {
            headerName: "Item Name",
            field: "material_name",
            unSortIcon: true,

            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering

        },

   

        {
            headerName: "Qty",
            field: "total_quantity",

            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering

        },


        {
            headerName: "Qty",
            field: "quantity",

            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering

            cellRenderer: (params) => {
                if (!params.data || params.data.cost === "Total Amount") return "";
                return (
                    <div>
                        <input
                            type="number"
                            value={params.data.quantity || ""}
                            min="0"
                            max={params.data.total_quantity} // Set max to total_quantity

                            //  onBlur={(e) => handleInputBlur(e, params.node.rowIndex, "quantity")}

                            onChange={(e) => {
                                let value = parseInt(e.target.value, 10);
                                if (isNaN(value) || value < 1) {
                                    value = 0;
                                }
                                handleInputChange(e, params.node.rowIndex, "quantity");
                            }}
                            className="w-full p-1 rounded"
                            style={{ height: "2rem" }}
                        />
                    </div>
                );
            },
        },



        {
            headerName: "Unit",
            field: "unit_name",

            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering


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


    const handleInputChange = (e, index, field) => {
        const value = e.target.value;
        setSelectedItemList((prevList) =>
            prevList.map((item, i) => {
                if (i !== index) return item;

                let updatedItem = { ...item, [field]: value };

                if (field === "quantity" || field === "unit") {
                    const { quantity, cost, gst_percentage, total_quantity } = updatedItem;
                    if (Number(quantity) > total_quantity) {
                        setToastData({
                            show: true,
                            message: "Quantity cannot exceed total quantity",
                            type: "error",
                        });
                        updatedItem.quantity = total_quantity;
                    }
                    updatedItem = {
                        ...updatedItem,
                        without_tax_cost: quantity * cost,
                        tax_amount: (quantity * cost * gst_percentage) / 100,
                        total_cost: quantity * cost + (quantity * cost * gst_percentage) / 100,
                    };
                }
                return updatedItem;
            })
        );
    };

    const handleProjectChange = async (selectedProject) => {
        console.log("selectedProject", selectedProject)
        if (!selectedProject || !selectedProject.value) {
            setSelectedInvoice([]); // Reset the request_id dropdown if no project is selected
            return;
        }

        try {
            const { data } = await RequestDropdownEffect({ project_id: selectedProject.value });
            const formattedData = data.data.map((list) => ({
                ...list,
                label: list.request_no,
                value: list.request_id,
            }));
            setSelectedInvoice(formattedData);
            setValue("project_id", selectedProject.value)

        } catch (error) {
            console.error("Error fetching request dropdown data:", error);
            setSelectedInvoice([]);
            setValue("project_id", selectedProject.value)
        }
    };
    console.log("setSelectedInvoice", selectedInvoice)
    const handleInvoiceChange = async (selectedOption) => {
        if (!selectedOption || !selectedOption.value) {
            const currentDateValue = watch("date");
            reset();
            setValue("date", currentDateValue || todayDate);
            setSelectedItemList([]);
            return;
        }

        setValue("request_id", selectedOption.value);
        try {
            const response = await ProjectRequestDropdownEffect({
                request_id: selectedOption.value, "type": "return"
            });
            
            setSelectedItemList(
                response?.data?.data.map((item) => ({
                    ...item,
                    total_quantity: item?.quantity,
                    quantity: "0",
                }))
            );
        } catch (error) {
            console.error("Error fetching invoice data:", error);
        }
    };
    
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
                <div className="rounded-lg pe-3 flex items-center justify-between w-full">
                    <div className="flex items-center p-3  overflow-x-hidden">
                        <div className="relative ">
                            <Breadcrumps items={breadcrumbItems} />
                        </div>
                    </div>
                </div>

                <div className="p-5">
                    <hr className="border-t-1 border-gray-300 pb-5" />

                    <FormProvider {...mainFormMethods}>
                        <form onSubmit={handleSubmit(addMasterHandler)}>
                            <div>
                                <p className='text-lg font-semibold '>Order Return Details</p>
                                <div className="py-5 grid grid-cols-3 gap-x-4 xl:max-w-4xl 2xl:max-w-5xl">
                                {!location?.state?.isperticularproject && (
                                    <SelectSearchable
                                        options={materialDetailList || []}
                                        label="Project Name/ Id"
                                        id="project_id"
                                        iconLabel={icons.user}
                                        placeholder="Select Project"
                                        register={register}
                                        validation={{
                                            required: "Project is required",
                                        }}
                                        errors={errors}
                                        setValue={setValue}
                                        value={materialDetailList.find((option) => option.value === watch("project_id")) || null} // Match value with options
                                        defaultValue={materialDetailList.find((option) => option.value === location?.state?.project_id) || null} // Match defaultValue with options
                                        onChange={handleProjectChange}
                                    />)}

                                    <SelectSearchable
                                        placeholder="Select Request"
                                        options={selectedInvoice}
                                        id="request_id"
                                        //   iconLabel={React.cloneElement(icons.replay, { size: "20px" })}
                                        label="Invoice"
                                        validation={{ required: "Invoice is required" }}
                                        showStar={true}
                                        register={register}
                                        errors={errors}
                                        setValue={setValue}
                                        onChange={handleInvoiceChange}
                                        defaultValue={selectedLead}
                                    />
                                    <FormInput
                                        id="date"
                                        iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
                                        label="Date"
                                        type="date"
                                        register={register}
                                        errors={errors}
                                        validation={{ required: "Date is required" }}
                                        showStar={false}
                                        defaultValue={new Date().toISOString().split("T")[0]}
                                    />

                                </div>


                                {location.state && (
                                    <>
                                        <input type="hidden" {...register("uuid")} />
                                    </>
                                )}
                                 {location?.state?.isperticularproject && (
                                <div className="hidden">
                                    <input
                                        type="hidden"
                                        {...register("project_id")}
                                        value={location?.state?.project_id || ""}
                                    />
                                </div>
                            )}
                            </div>
                        </form>
                    </FormProvider>

                    <div >
                        {selectedItemList.length > 0 && (
                            <div>
                                <FormTable
                                    key={columnDefs.length}
                                    rowData={selectedItemList}
                                    columnDefs={columnDefs}
                                    defaultColDef={{ resizable: true }}
                                    onGridReady={(params) => params.api.sizeColumnsToFit()}
                                    pagination={false}
                                    showCheckbox={false}
                                />
                            </div>
                        )}

                    </div>
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
                                        if (location?.state?.tabs_Details?.project_uuid) {
                                            navigate(`/user/project/project-detail/${location.state.tabs_Details.project_uuid}`, {
                                                state: { ...location.state.tabs_Details },
                                            });
                                        } else {
                                            navigate(-1);
                                        }
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

                </div>
            </div >
        </>
    );
}

