import React, { useCallback, useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import icons from "../../../../contents/Icons";
import TextArea from "../../../../UI/Input/TextArea/TextArea";
import Breadcrumps from "../../../../UI/Breadcrumps/Breadcrumps";
import SearchableSelect from "../../../../UI/Select/SearchableSelect";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import { getAllItemListEffect, getAllUnitListEffect } from "../../../../redux/common/CommonEffects";
import { v4 as uuidv4 } from "uuid";
import { formatToINR } from "../../../../utils/Rupees";
import FormTable from "../../../../UI/AgGridFormTable/FormAgTable";
import { useLocation, useNavigate } from "react-router";
import { createSaleQuotationEffect, CustomerListEffect, updateSaleQuotationEffect } from "../../../../redux/Account/Sales/SaleQuotation/SaleQuotationEffects";
import SelectSearchable from "../../../../UI/Select/Search/SelectSearchable";
import SingleCheckbox from "../../../../UI/Input/CheckBoxInput/SingleCheckbox";
import { createSaleReturnEffect, getInvoiceItemEffect, InvoiceDropdownEffect, updateSaleReturnEffect } from "../../../../redux/Account/Sales/SaleReturn/SaleReturnEffects";
import { set } from "date-fns";

export default function CreateSalesReturn() {
    const navigate = useNavigate();

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

    const contactNumber = watch("contact");
    const isAddress = watch("is_address");


    // const transformData = (data) => {

    //     return data.map((item) => {
    //         const withoutTaxCost = parseFloat(item.unit_price) * parseFloat(0);
    //         const taxAmount = (withoutTaxCost * parseFloat(item.gst_slab)) / 100;
    //         const totalCost = withoutTaxCost + taxAmount;

    //         
    //         return {
    //             u_id: item.m_uuid,
    //             id: item.sales_quo_id,
    //             item_id: item.item_id,
    //             name: item.item_name,
    //             quantity: "0",
    //             total_quantity: parseFloat(item.quantity),
    //             unit: item.unit,
    //             unit_name: item.unit_name,
    //             cost: parseFloat(item.unit_price),
    //             total_cost: totalCost,
    //             gst_percentage: parseFloat(item.gst_slab),
    //             hsn_code: item.hsncode,
    //             tax_amount: taxAmount,
    //             total_tax_amount: totalCost,
    //             created_by: item.created_by,
    //             without_tax_cost: withoutTaxCost,
    //         };
    //     });
    // };

    const transformData = (data) => {
        return data.map((item) => {
          const withoutTaxCost = parseFloat(item.unit_price) * parseFloat(item.quantity?item.quantity:0);
          const taxAmount = (withoutTaxCost * parseFloat(item.gst_slab)) / 100;
          const totalCost = withoutTaxCost + taxAmount;
          return {
            u_id: item.m_uuid || " ",
            id: item.sales_quo_id,
            item_id: item.item_id,
            name: item.item_name,
            quantity: item.quantity || "0", 
            total_quantity: parseFloat(item.total_quantity),
            unit: item.unit,
            unit_name: item.unit_name,
            cost: parseFloat(item.unit_price),
            total_cost: totalCost,
            gst_percentage: parseFloat(item.gst_slab),
            hsn_code: item.hsncode,
            tax_amount: taxAmount,
            total_tax_amount: totalCost,
            created_by: item.created_by,
            without_tax_cost: withoutTaxCost,
          };
        });
      };

    useEffect(() => {
        if (location?.state) {
            
            const lead = location.state;
            setSelectedLead({
                value: lead.invoice_id,
                label: lead.invoice_id,
            });
            setValue("uuid", lead?.uuid || "");
            setValue("invoice_id", lead?.invoice_id || "");
            setValue("cust_id", lead?.cust_id || "");
            setValue("cust_name", lead?.cust_name || "");
            setValue("lead_id", lead?.lead_id || "");
            setValue("invoice_date", lead?.invoice_date || "");
          setValue("return_type", lead?.return_type || "");
          setValue("return_reason", lead?.return_reason || "");
            setValue("date", lead?.date);
             if (location.state.sales_return_material) {
                const transformedData = transformData(location?.state?.sales_return_material);
                setSelectedItemList(transformedData);
            }
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
        { id: 2, label: "Return", link: "/user/accounts/sale/sale-return" },
        { id: 3, label: "Create Sale Return" }
    ];

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

    const fetchItemList = async () => {
        try {
            const { data } = await getAllItemListEffect();
            setItemList(
                data.data.map((list) => ({
                    label: list.material_name,
                    value: list.id
                }))
            );
        } catch {
            setItemList([]);
        }
    };

    useEffect(() => {
        if (itemList.length === 0) {
            fetchItemList();
        }
    }, []);

    useEffect(() => {
        if (isAddress) {
            setValue("shipping_address", watch("billing_address"));
        }
    }, [isAddress, watch("billing_address"), setValue]);

    const ItemSubmitHandler = (data) => {
        const selectedItem = itemList.find(
            (item) => Number(item.value) === Number(data.item_id)
        );

        if (!selectedItem) {
            console.error("Selected item not found");
            return;
        }
        

        const withoutTaxCost = data.quantity * selectedItem.comp_cost;
        const taxAmount = (withoutTaxCost * selectedItem.gst_percentage) / 100;
        const totalCost = withoutTaxCost + taxAmount;

        const newItem = {
            ...data,
            id: selectedItem.id,
            material_name: selectedItem?.material_name,
            u_id: uuidv4(),
            name: selectedItem.label,
            hsn_code: selectedItem.hsn_code,
            cost: selectedItem.comp_cost,
            gst_percentage: selectedItem.gst_percentage,
            without_tax_cost: withoutTaxCost,
            tax_amount: taxAmount,
            total_cost: totalCost,
        };

        setSelectedItemList((prevList) => [...prevList, newItem]);
        itemFormMethods.reset();
        setValue("quantity", 0);
    };

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
    const mobileNumberUserCheck = useCallback(async () => {
        if (!contactNumber) return;

        let payload = location?.state?.contact
            ? { lead_contact: location?.state?.contact }
            : { mobile_no: contactNumber };

        try {
            const { data } = await CustomerListEffect(payload);

            if (data?.lead?.length > 0) {
                const firstLead = data.lead[0]; // Select first lead
                

                setLeadList(
                    data.lead.map(list => ({
                        ...list,
                        label: `${list?.name} - ${list?.lead_id}`,
                        value: list?.id,
                    }))
                );

                const formattedLead = {
                    value: firstLead.id,
                    label: `${firstLead.name} - ${firstLead.lead_id}`,
                };
                setValue("cust_id", data?.data?.customer_id
                    || "");
                setValue("lead_id", firstLead?.lead_id || "");
                setSelectedLead(formattedLead);
                setValue("lead", formattedLead);
                setValue("name", firstLead.name);
                setValue("shipping_address", firstLead.site_address
                    || "");
                setValue("billing_address", firstLead.address || "");
            } else {
                // Reset fields if no lead found
                setLeadList([]);
                setSelectedLead(null);
                reset({
                    lead: "",
                    name: "",
                    shipping_address: "",
                    billing_address: "",
                });
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
            setLeadList([]);
            setSelectedLead(null);
            reset({
                lead: "",
                name: "",
                shipping_address: "",
                billing_address: "",
            });
        }
    }, [contactNumber, location?.state?.contact, setValue, reset]);

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
        // Filter out items with quantity of 0 and convert quantities to numbers
        const filteredItemList = selectedItemList
            .filter(item => Number(item.quantity) > 0)
            .map(item => ({
                ...item,
                quantity: Number(item.quantity),
                unit: item.unit,
                material_id: item.id,
                id: item.id,
                u_id: item.u_id,
                name: item.name,
                hsn_code: item.hsn_code,
                cost: item.cost,
                gst_percentage: item.gst_percentage,
                without_tax_cost: item.without_tax_cost,
                tax_amount: item.tax_amount,
                total_cost: item.total_cost,
            }));
    
        if (filteredItemList.length === 0) {
            setToastData({ show: true, message: "Please add items to the list with quantity greater than 0", type: 'error' });
            return;
        }
    
        let apiEndpoint; // Declare apiEndpoint before use
    
        if (!totalAmountList || !totalAmountList.totalAmount) {
            console.error("Total amount list is missing or invalid");
            return;
        }
    console.log("data", data)
        if (location.state) {
            let payload = {
                uuid: data?.uuid || "",
                date: data.date,
                return_type: data.return_type,
                return_reason: data.return_reason,
                total_amount: totalAmountList.totalAmount,
                sales_return_material: filteredItemList,
            };
            
            apiEndpoint = updateSaleReturnEffect(payload); // Ensure this function is available
        } else {
            const payload = {
                cust_id: data?.cust_id || "",
                lead_id: data?.lead_id || "",
                date: data.date,
                invoice_date: data.invoice_date,
                return_type: data.return_type,
                return_reason: data.return_reason,
                cust_name: data.cust_name,
                invoice_id: data.invoice_id,
                total_amount: totalAmountList.totalAmount,
                sales_return_material: filteredItemList,
            };
            
            apiEndpoint = createSaleReturnEffect(payload);
        }
    
        try {
            setLoading(true);
            const response = await apiEndpoint;
            
            setLoading(false);
            if (response?.data?.status === "success") {
                setToastData({
                    show: true,
                    message: response?.data?.message,
                    type: 'success'
                });
                navigate('/user/accounts/sale/sale-return');
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
        }
    };


    const todayDate = new Date().toISOString().split("T")[0];

    const footerRow = {
        cost: "Total Amount",
        lead_name: "Leads Summary",
        gst_percentage: formatToINR(totalAmountList.totalWithoutTaxAmount),
        total_cost: formatToINR(totalAmountList.totalAmount),
        tax_amount: formatToINR(totalAmountList.totalTaxAmount),
    };

    const combinedRowData = [...selectedItemList, footerRow];

    const columnDefs = [
        {
            headerName: "Item Name",
            field: "name",
            unSortIcon: true,
            minWidth: 150,
            maxWidth: 170,
            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering

        },

        {
            headerName: "HSN code",
            field: "hsn_code",
            minWidth: 50,
            maxWidth: 80,
            unSortIcon: true,
            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering

        },

        {
            headerName: "Qty",
            field: "total_quantity",
            minWidth: 100,
            maxWidth: 100,
            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering

            // cellRenderer: (params) => {
            //     if (!params.data || params.data.cost === "Total Amount") return "";
            //     return (
            //         <div>
            //             <input
            //                 type="number"
            //                 value={params.data.quantity || ""}
            //                 min="1"
            //                 onChange={(e) => {
            //                     let value = parseInt(e.target.value, 10);
            //                     if (isNaN(value) || value < 1) {
            //                         value = 1;
            //                     }
            //                     handleInputChange(e, params.node.rowIndex, "quantity");
            //                 }}
            //                 className="w-full p-1 rounded"
            //                 style={{ height: "2rem" }}
            //             />
            //         </div>
            //     );
            // }
        },

        // {
        //     headerName: "Qty",
        //     field: "quantity",
        //     minWidth: 100,
        //     maxWidth: 100,
        //     cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering

        //     cellRenderer: (params) => {
        //         if (!params.data || params.data.cost === "Total Amount") return "";
        //         return (
        //             <div>
        //                 <input
        //                     type="number"
        //                     value={params.data.quantity || ""}
        //                     min="0"
        //                     onChange={(e) => {
        //                         let value = parseInt(e.target.value, 10);
        //                         if (isNaN(value) || value < 1) {
        //                             value = 1;
        //                         }
        //                         handleInputChange(e, params.node.rowIndex, "quantity");
        //                     }}
        //                     className="w-full p-1 rounded"
        //                     style={{ height: "2rem" }}
        //                 />
        //             </div>
        //         );
        //     }
        // },
        {
            headerName: "Qty",
            field: "quantity",
            minWidth: 100,
            maxWidth: 100,
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
            minWidth: 100,
            maxWidth: 100,
            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering

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
            headerName: "Amount per unit",
            field: "cost",
            minWidth: 150,
            maxWidth: 150,
            // unSortIcon: true,
            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering
        },

        {
            headerName: "GST %",
            field: "gst_percentage",
            minWidth: 100,
            maxWidth: 100,
            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering

        },

        {
            headerName: "Tax Amount",
            field: "tax_amount",
            minWidth: 120,
            maxWidth: 120,
            sortable: false,
            cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" }, // Ensures proper centering

        },
        {
            headerName: "Total Amount",
            field: "total_cost",
            flex: 1,
            minWidth: 150,
            maxWidth: 150,
            unSortIcon: true,
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

    // const handleInputChange = (e, index, field) => {
    //     const value = e.target.value;
    //     setSelectedItemList((prevList) =>
    //         prevList.map((item, i) => {
    //             if (i !== index) return item;

    //             let updatedItem = { ...item, [field]: value };

    //             if (field === "quantity" || field === "unit") {
    //                 const { quantity, cost, gst_percentage } = updatedItem;
    //                 updatedItem = {
    //                     ...updatedItem,
    //                     without_tax_cost: quantity * cost,
    //                     tax_amount: (quantity * cost * gst_percentage) / 100,
    //                     total_cost: quantity * cost + (quantity * cost * gst_percentage) / 100,
    //                 };
    //             }
    //             return updatedItem;
    //         })
    //     );
    // };
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
                updatedItem.quantity = total_quantity; // Set quantity to total_quantity if it exceeds
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
      

      
    useEffect(() => {
        (async () => {
            try {
                let { data } = await InvoiceDropdownEffect();
                data = data.data.map((list) => ({
                    ...list,
                    label: list.invoice_id,
                    value: list.invoice_id,
                }));
                setSelectedInvoice(data);

            } catch (error) {
                setSelectedInvoice([]);
            }
        })();
    }
        , []);
    console.log("setSelectedInvoice", selectedInvoice)

    //   const handleInvoiceChange = async (selectedOption) => {
    //     
    //     // setValue("date", selectedOption.date);
    //     setValue("cust_id", selectedOption.cust_id);
    //     setValue("cust_name", selectedOption.cust_id|| "");
    //     setValue("invoice_date", selectedOption.date);
    //     setValue("lead_id", selectedOption.lead_id);
    //     try {
    //       const response = await getInvoiceItemEffect({ invoice_id:selectedOption.value});
    //       
    //       // Handle the response as needed  

    //       setSelectedItemList( transformData(response?.data?.data));

    //     } catch (error) {
    //       console.error("Error fetching invoice data:", error);
    //     }
    //   };

    const handleInvoiceChange = async (selectedOption) => {
        if (!selectedOption || !selectedOption.value) {
            // Reset the form and set selectedItemList to an empty array
            const currentDateValue = watch("date");
            reset();
            setValue("date", currentDateValue || todayDate);
            setSelectedItemList([]);
            return;
        }

        
        setValue("cust_id", selectedOption.cust_id);
        setValue("cust_name", selectedOption.cust_name || "");
        setValue("invoice_date", selectedOption.date);
        setValue("lead_id", selectedOption.lead_id);
        setValue("invoice_id", selectedOption.value);
        try {
            const response = await getInvoiceItemEffect({ invoice_id: selectedOption.value });
            
            // Handle the response as needed  
            setSelectedItemList(transformData(response?.data?.data));
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

                                    <SelectSearchable
                                        options={selectedInvoice}
                                        id="invoice_id"
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
                                        label="client"
                                        id="cust_name"
                                        iconLabel={icons.name}
                                        placeholder="client Name"
                                        register={register}
                                        showStar={false}
                                        validation={{
                                            required: false,
                                            // pattern: {
                                            //     value: validationPatterns.textOnly,
                                            //     message: "Provide Valid Name",
                                            // },
                                        }}
                                        errors={errors}
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
                                <div className="grid grid-cols-3 gap-x-4 gap-y-2 my-2 mb-4 xl:max-w-4xl 2xl:max-w-5xl">
                                <TextArea
                                        id="return_reason"  
                                        // iconLabel={icons.address}
                                        label="Return Reason"   
                                        register={register}
                                        errors={errors} 
                                        showStar={false}
                                        validation={{ required: false }}
                                        defaultValue={watch("return_reason")}           
                                    />
                                    <FormInput
                                        id="invoice_date"
                                        iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
                                        label="Invoice Date"
                                        type="date"
                                        placeholder={"Select Date"}
                                        register={register}
                                        errors={errors}
                                        validation={{ required: false }}
                                        showStar={false}
                                        defaultValue={new Date().toISOString().split("T")[0]}
                                    />

                                    <SelectSearchable
                                        options={ReturnType}
                                        id="return_type"
                                        iconLabel={React.cloneElement(icons.replay, { size: "20px" })}
                                        label="Return Type"
                                        validation={{ required: false }}
                                        register={register}
                                        errors={errors}
                                        setValue={setValue}
                                        // onChange={handleInvoiceChange}
                                    />

                                </div>
                                {/* <div className="grid grid-cols-5 gap-x-4 gap-y-2 my-2 mb-4 xl:max-w-4xl 2xl:max-w-5xl">
                                    <div className="col-span-2">
                                        <TextArea
                                            id="billing_address"
                                            iconLabel={icons.address}
                                            label="Billing Address"
                                            register={register}
                                            errors={errors}
                                            showStar={false}
                                            showIcon={true}
                                            defaultValue={watch("billing_address")}
                                            validation={{ required: "Billing Address required" }}
                                        />

                                        <SingleCheckbox
                                            id="is_address"
                                            label="Same For Shipping Address"
                                            register={register}
                                            errors={errors}
                                            validation={{
                                                required: false,
                                            }}
                                        />

                                    </div>
                                    <div className="col-span-2">

                                        {!isAddress && (
                                            <TextArea
                                                id="shipping_address"
                                                iconLabel={icons.address}
                                                label="Shipping Address"
                                                register={register}
                                                validation={{ required: false }}
                                                errors={errors}
                                                showStar={false}
                                                defaultValue={watch("shipping_address")}
                                            />
                                        )}

                                    </div>
                                </div> */}
                                {!location.state && (
                                    <>
                                        <input type="hidden" {...register("cust_id")} />
                                        <input type="hidden" {...register("lead_id")} />
                                    </>
                                )}
                                {location.state && (
                                    <>
                                        <input type="hidden" {...register("uuid")} />
                                    </>
                                )}
                            </div>
                        </form>
                    </FormProvider>

                    <div>
                        {selectedItemList.length > 0 && (
                            <div>
                                <FormTable
                                    key={columnDefs.length}
                                    rowData={combinedRowData}
                                    columnDefs={columnDefs}
                                    defaultColDef={{ resizable: false }}
                                    onGridReady={(params) => params.api.sizeColumnsToFit()}
                                    pagination={false}
                                    showCheckbox={false}    
                                />
                            </div>
                        )}
                        {/* <FormProvider {...itemFormMethods}>
                            <form onSubmit={itemFormMethods.handleSubmit(ItemSubmitHandler)}>
                                <div className="gap-3 my-3 justify-between content-end width-3/4">
                                    <p className='text-lg font-semibold py-4'>Item Details</p>
                                    <hr className="border-t-1 border-gray-300" />

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
                                                dropdownClassName="select-dropdown" // Add this line

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
                                        <div className="flex items-start pt-4">
                                            <IconButton
                                                label="Add Item"
                                                type="submit"
                                                className="h-8"
                                                icon={icons.plusIcon}
                                            />
                                        </div>
                                    </div>

                                    {selectedItemList.length > 0 && (
                                        <div>
                                            <FormTable
                                                key={columnDefs.length}
                                                rowData={combinedRowData}
                                                columnDefs={columnDefs}
                                                defaultColDef={{ resizable: false }}
                                                onGridReady={(params) => params.api.sizeColumnsToFit()}
                                                pagination={false}
                                            />
                                        </div>
                                    )}

                                    <hr className="border-t-1 border-gray-300 mt-4" />
                                </div>
                            </form>
                        </FormProvider> */}
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
                                        navigate("/user/accounts/sale/sale-return");
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

