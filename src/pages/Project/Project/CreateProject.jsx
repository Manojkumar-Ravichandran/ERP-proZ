
import React, { useCallback, useEffect, useState } from 'react'
import AlertNotification from '../../../UI/AlertNotification/AlertNotification'
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import { useLocation, useNavigate } from 'react-router';

import icons from '../../../contents/Icons';
import FormInput from '../../../UI/Input/FormInput/FormInput';
import RadioInput from '../../../UI/Input/RadioInput/RadioInput';
import Select from '../../../UI/Select/SingleSelect';
import { getAllProductListEffect, getAllUnitListEffect, getEmployeeListEffect, getLeadPurposeEffect, getMaterialDetailEffect } from '../../../redux/common/CommonEffects';
import { useForm } from 'react-hook-form';
import TextArea from '../../../UI/Input/TextArea/TextArea';

import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import { CreateProjectEffect, CustomerDropdownEffect } from "../../../redux/project/ProjectEffects";
import { DevTool } from '@hookform/devtools';
import { CustomerListEffect } from '../../../redux/Account/Sales/SaleQuotation/SaleQuotationEffects';
import IconFormInput from '../../../UI/Input/FormInput/IconFormInput/IconFormInput';

const CreateProject = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [leadList, setLeadList] = useState([]);

    const [formValues, setFormValues] = useState({
        // unit: 16,
        area_type: "approximate", // Set a default value for area_type
        length: "",
        width: "",
    });
    const {
        register,
        formState: { errors },
        control,
        setValue,
        watch,
        reset,
        handleSubmit,
    } = useForm(formValues);
    const [materialDetailList, setMaterialDetailList] = useState([]);
    const [custList, setCustList] = useState([]);
    useEffect(() => {
        if (location?.state) {
            const locationState = location?.state;
            setValue("cust_id", locationState.cust_id || "");
            
            setValue("cust_contact", locationState.cust_contact || "");
            setValue("lead_id", locationState.lead_id || "");
            setValue("incharge", locationState.incharge);
            setValue("description", locationState.description || "");
            setValue("start_date", locationState.start_date || new Date().toISOString().split("T")[0]);
            setValue("duration", locationState.duration || 0);
            setValue("duration_type", locationState.duration_type || "days");
            setValue("location", locationState.location || "");

            setValue("material_details", locationState.material_details || "");
            setValue("lead_purpose", locationState.purpose || "");
            setValue("product_name", locationState.product_name || "");

            setValue("lead_value", locationState.lead_value || "");
            setValue("area_type", locationState.area_type || "approximate");
            setValue("length", locationState.length || "");
            setValue("width", locationState.width || "");

            setValue("area", locationState.area || "");
            setValue("unit", locationState.unit || 16);
            setValue("contact", locationState.cust_contact || "");
            setValue("pro_value", locationState.pro_value || "");


        } else {
            setValue("area_type", "approximate");
            // setValue("unit",16)
        }
    }, [location?.state, setValue]);
 
    const [leadPurpose, setLeadPurpose] = useState([]);
    const [productList, setProductList] = useState([]);
    const [customerList, setCustomerList] = useState([]);


    const [unitList, setUnitList] = useState([]);
    const [toastData, setToastData] = useState({ show: false });
    const breadcrumbItems = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Project List", link: "/user/project" },
        { id: 3, label: "create project", link: "" }
    ];
    const areaList = [
        { label: 'Approximate', value: 'approximate' },
        { label: 'Actual', value: 'actual' },
    ];
    useEffect(() => {
        (async () => {
            try {
                let { data } = await getMaterialDetailEffect();
                data = data.data.map((list) => ({
                    ...list,
                    label: list.name,
                    value: list.id,
                }));
                setMaterialDetailList(data);
                // if (data.length > 0) {

                //     setValue("material_details", data[0].value); // Set the first item as the default value
                // }
            } catch (error) {
                setMaterialDetailList([]);
            }
        })();
    }
        , []);
    useEffect(() => {
        (async () => {
            try {
                let { data } = await getEmployeeListEffect();
                data = data.data.map((list) => ({
                    ...list,
                    label: list.name,
                    value: list.id,
                }));
                console.log("dta", data)
                setCustList(data);
            } catch (error) {
                console.error("Error fetching customer list:", error);
                setCustList([]); // Set an empty array in case of an error
            }
        })();

    }, []);
    useEffect(() => {
        
    }, [custList]);

    useEffect(() => {
        (async () => {
            try {
                let { data } = await getLeadPurposeEffect();
                data = data.data.map((list) => ({
                    ...list,
                    label: list.name,
                    value: list.id,
                }));
                setLeadPurpose(data);
            } catch (error) {
                setLeadPurpose([]);
            }
        })();
    }
        , []);

    useEffect(() => {
        (async () => {
            try {
                let { data } = await CustomerDropdownEffect();
                data = data.data.map((list) => ({
                    ...list,
                    label: list.name,
                    value: list.customer_id,
                }));
                setCustomerList(data);
            } catch (error) {
                setCustomerList([]);
            }
        })();
    }
        , []);


    useEffect(() => {
        (async () => {
            try {
                let { data } = await getAllProductListEffect();
                data = data.data.map((list) => ({
                    ...list,
                    label: list.product_name,
                    value: list.id,
                }));
                setProductList(data);
            } catch (error) {
                setProductList([]);

            }
        })();
    }
        , []);

    const toastOnclose = () => {
        setToastData({ ...toastData, show: false });
    };

    const areaType = watch("area_type");

    useEffect(() => {
        if (areaType === "approximate") {
            setValue("length", ""); // Clear length when switching to approximate
            setValue("width", "");
        }
    }, [areaType, setValue]); // Only run when areaType changes

    useEffect(() => {
        (async () => {
            try {
                let { data } = await getAllUnitListEffect();
                data = data.data.map((list) => ({
                    label: list.unit_name,
                    value: list.id,
                }));
                setUnitList(data);
                if (data.length > 0) {

                    setValue("unit", 16); // Set the first item as the default value
                }
            } catch (error) {
                setUnitList([]);
            }
        })();
    }

 , []);



    const length = watch("length") || 0;
    const width = watch("width") || 0;

    const area = length * width;
    useEffect(() => {
        setValue("area", area);
    }, [length, width, area, setValue]);


    const submitFormHandler = async (data) => {
        setLoading(true);
        try {
            const result = await CreateProjectEffect(data);

            setToastData({
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
            reset();

            navigate("/user/project");

            //   dispatch(setLeadDetailInprogress({ uuid: leadData.uuid, stages: "", is_schedule: 0 }));
        }
    };

    const duration = watch("duration") || 0;
    const durationType = watch("duration_type");


    useEffect(() => {
        if (durationType === "days" && duration > 365) {
            setValue("duration", 365); // Limit to max 365 for days
        } else if (durationType === "month" && duration > 12) {
            setValue("duration", 12); // Limit to max 12 for months
        } else if (duration < 0) {
            setValue("duration", 0); // Ensure duration is not negative
        }
    }, [duration, durationType, setValue]);

    const contactNumber = watch("contact");

    const mobileNumberUserCheck = useCallback(async () => {
        if (!contactNumber) return;

        let payload = location?.state?.contact
            ? { lead_contact: location?.state?.contact }
            : { mobile_no: contactNumber };

        try {
            const { data } = await CustomerListEffect(payload);
            setValue("shipping_address", data.customer_id
                || ""); 
                if (data?.lead?.length > 0) {
                    const firstLead = data.lead[0]; // Select first lead
                    

                    setLeadList(
                        data.lead.map(list => ({
                            ...list,
                            label: `${list?.lead_id}`,
                            value: list?.lead_id,
                        }))
                    );

                    const formattedLead = {
                        value: firstLead.id,
                        label: `${firstLead.name} - ${firstLead.lead_id}`,
                    };
                    setValue("cust_id", data?.data?.customer_id    || "");
            
                                   } else {
                setLeadList([]);
                reset(
                 
                );
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
            setLeadList([]);
            // setSelectedLead(null);
            reset();
        }
    }, [contactNumber, location?.state?.contact, setValue, reset]);


    // useEffect(() => {
    //     setValue('incharge',{ label: "VISHNUPRIYA.R", value: "6" }  ); // Set default value
    // }, [setValue]);
    return (
        <div>
            {toastData?.show && (
                <AlertNotification
                    show={toastData?.show}
                    message={toastData?.message}
                    onClose={toastOnclose}
                />
            )}
            <div className=" rounded-lg p-2 my-2 bg-white darkCardBg">
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <form
                onSubmit={handleSubmit(submitFormHandler)}
            >
                <>

                <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-3xl 2xl:max-w-4xl">
             
                <div >
                        <IconFormInput
                            id="contact"
                            label="Contact"
                            placeholder="Contact Number"
                            type="search"
                            iconLabel={icons.call}
                            register={register}
                            validation={{
                                required: "Contact is required",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Provide a valid Contact Number",
                                },
                            }}
                            onBlur={mobileNumberUserCheck}
                            errors={errors}
                            icon={icons.searchIcon}
                            onClick={() => mobileNumberUserCheck()}
                            max={10}
                            allowNumbersOnly={true}
                        />
                    </div>
                    <div >

                    <Select
                            options={customerList || []}

                            label="Client"
                            id="cust_id"
                            iconLabel={icons.user}
                            placeholder="Select Client"
                            register={register}
                            validation={{
                                required: "Client is required",
                            }}
                            errors={errors}

                            value={watch('cust_id')}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-3xl 2xl:max-w-4xl">
                       
                   

                           <Select
                            options={leadList || []}
                            label="lead"
                            id="lead_id"
                            iconLabel={icons.user}
                            placeholder="Select lead"
                            register={register}
                            validation={{
                                required: false,
                            }}
                            errors={errors}
                            setValue={setValue}
                            value={watch('lead_id')}
                        /> 
                            {/* <div className="flex items-end justify-end">
                                <button
                                    onClick={() => {
                                        navigate("/user/crm/lead/create-lead");
                                    }}
                                    className="top-clr  "

                                    title="View Customer Details"
                                >
                                    Add New Client
                                </button>
                            </div> */}
                        <Select

                            options={custList || []}
                            label="Project Incharge"
                            id="incharge"
                            iconLabel={icons.user}
                            placeholder="Enter Project Incharge"
                            register={register}
                            validation={{
                                required: "Project Incharge required",
                            }}
                            errors={errors}

                            value={watch('incharge')}
                        // setValue={setValue}
                        // defaultValue={ { label: "VISHNUPRIYA.R", value: "6" }}
                        />
                    </div>
                    <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-3xl 2xl:max-w-4xl">

                        
                        {/*                         
                        <SelectSearchable

                            options={custList || []}
                            label="Project Incharge"
                            id="incharge"
                            iconLabel={icons.user}
                            placeholder="Enter Project Incharge"
                            register={register}
                            validation={{
                                required: "Project Incharge required",
                            }}
                            errors={errors}

                            value={custList.find((opt) => opt.value === watch('incharge')?.value)} // Ensure value matches options
                            onChange={(value) => setValue('incharge', value)} // Update the value in react-hook-form
                        /> */}
                       

                    </div>
                    <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-3xl 2xl:max-w-4xl">
                        <div className="col-span-2"
                        >
                            <TextArea
                                id="description"
                                iconLabel={icons.note}
                                label="Project Description"
                                type="text"
                                placeholder="Enter the Project Description"
                                register={register}
                                errors={errors}
                                className=" col-span-2"
                                showStar={false}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-3xl 2xl:max-w-4xl">

                        <FormInput
                            id="start_date"
                            iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
                            label="Start Date "
                            type="date"
                            register={register}
                            errors={errors}
                            validation={{ required: "start date required" }}
                            showStar={true}
                            defaultValue={new Date().toISOString().split("T")[0]}
                        />
  <div className='flex  gap-2 '>
  <FormInput
                                label="Project Duration"
                                id="duration"
                                type="number"
                                iconLabel={icons.calendarWDate}
                                placeholder="Project Duration"
                                register={register}
                                showStar={false}
                                validation={{
                                    required: false,
                                    validate: (value) => {
                                        if (durationType === "days" && value > 365) {
                                            console.log("value", value)
                                            return "Duration cannot exceed 365 days";
                                        }
                                        if (durationType === "month" && value > 12) {
                                            return "Duration cannot exceed 12 months";
                                        }
                                        if (value < 0) {
                                            return "Duration cannot be negative";
                                        }
                                        return true;
                                    },
                                }}
                                errors={errors}
                            />

                           
                       <div className='w-full'>
                       <Select
                                options={[
                                    { label: "Hours", value: "Hours" },
                                    { label: "Days", value: "days" },
                                    { label: "Month", value: "months" },
                                    { label: "Year", value: "years" },

                                ]}
                                register={register}

                                setValue={setValue}
                                label="Duration Type"
                                id="duration_type"
                                iconLabel={icons.calendarWDate}
                                placeholder="Select Duration Type"
                                showStar={false}
                                validation={{
                                    required: "Duration type is required",
                                }}
                                errors={errors}

                                value={watch('duration_type')}

                            />
                        </div>
                    </div>
                        {/* <div className='flex gap-2'>
                        <FormInput
                            label="Project Duration"
                            id="duration"
                            type='number'
                            iconLabel={icons.calendarWDate}
                            placeholder="Project Duration"
                            register={register}
                            showStar={false}
                            validation={{
                                required: false,
                                pattern: {
                                    value: validationPatterns.numberOnly,
                                    message: "Provide Valid Name",
                                },
                            }}
                            errors={errors}
                        />
                         <SearchableSelect
                            label="Duration type"
                            id="duration_type"
                            iconLabel={icons.calendarWDate}
                            placeholder="Project Duration"
                            register={register}
                            showStar={false}
                            validation={{
                                required: false,
                                pattern: {
                                    value: validationPatterns.numberOnly,
                                    message: "Provide Valid Name",
                                },
                            }}
                            errors={errors}
                        />
                        </div> */}
                    </div>
                    <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-3xl 2xl:max-w-4xl">
                        <div className='col-span-2'>
                            <TextArea
                                label="Project Location"
                                id="location"
                                iconLabel={icons.locationIcon}
                                placeholder="Project Location"
                                register={register}
                                showStar={false}
                                validation={{
                                    required: "required project Location",
                                }}
                                errors={errors}
                            />
                        </div>
                        {/* <FormInput 
                    type='number'
                    label={"Project Duration"}
                    register={register}
                    errors={errors}
                    validation={{ required: false }}
                    /> */}
                    </div>
                </>
                <>
                    <p className="text-lg form-heading font-medium flex items-center gap-2 mt-3">
                        Product Details
                    </p>
                    <hr />

                    <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  my-4 xl:max-w-3xl 2xl:max-w-4xl">

                        <Select
                            options={materialDetailList || []}
                            label="Material Details"
                            id="material_details"
                            iconLabel={icons.materialToolIcon}
                            placeholder="Enter Material Details"
                            register={register}
                            validation={{
                                required: false,
                            }}
                            showStar={false}
                            errors={errors}

                            value={watch('material_details')}

                        />

                        <Select

                            options={leadPurpose || []}
                            label="Purpose"
                            id="lead_purpose"
                            iconLabel={icons.projectIcon}
                            placeholder="Enter Purpose Details"
                            register={register}
                            validation={{
                                required: false,
                            }}
                            showStar={false}
                            errors={errors}
                            setValue={setValue}

                            value={watch('lead_purpose')}

                        />
                    </div>
                    <div className="grid grid-cols-4  gap-x-4 gap-y-2 my-2  mb-4  xl:max-w-3xl 2xl:max-w-4xl">
                        <div className="col-span-2">

                            <Select

                                options={productList}
                                label="Roofing type"
                                id="product_name"
                                iconLabel={icons.roofIcon}
                                placeholder="Enter Roofing type "
                                register={register}
                                validation={{
                                    required: false,
                                }}
                                showStar={false}
                                errors={errors}
                                setValue={setValue}

                                value={watch('product_name')}

                            />
                        </div>
                        <FormInput
                            label="Budget (Rs.)"

                            id="pro_value"

                            iconLabel={React.cloneElement(icons.moneyIcon, { size: 20 })}
                            placeholder="Enter Value "
                            register={register}
                            validation={{
                                required: false,
                            }}
                            showStar={false}
                            errors={errors}
                            allowNumbersOnly={true}
                        />
                        <RadioInput
                            options={areaList}
                            label="Area Type"
                            id="area_type"
                            register={register}
                            validation={{
                                required: false,
                            }}
                            errors={errors}
                        />



                        {areaType !== "approximate" && (
                            <>
                                <FormInput
                                    label="Length"
                                    id="length"
                                    iconLabel={icons.widthScaleIcon}
                                    placeholder="Enter Length"
                                    register={register}
                                    validation={{ required: false }}
                                    errors={errors}
                                    showStar={false}
                                    max={10}
                                    allowNumbersOnly={true}
                                />
                                <FormInput
                                    label="Width"
                                    id="width"
                                    iconLabel={icons.widthScaleIcon}
                                    placeholder="Enter Width"
                                    register={register}
                                    validation={{ required: false }}
                                    errors={errors}
                                    showStar={false}
                                    max={10}
                                    allowNumbersOnly={true}
                                />
                            </>
                        )}

                        <FormInput
                            label="Area Volume"

                            id="area"

                            iconLabel={icons.alllist}
                            placeholder="Area Volume"
                            register={register}
                            validation={{ required: false }}
                            errors={errors}
                            disabled={areaType !== "approximate"}
                            setValue={setValue}

                        />

                        <Select

                            options={unitList || []}

                            label="Unit"
                            id="unit"
                            iconLabel={icons.unit}
                            placeholder="Select Unit"
                            register={register}
                            validation={{ required: "Unit is Required" }}
                            errors={errors}
                            showStar={false}
                            disabled

                            value={watch("unit")} // Ensure value matches options
                            onChange={(value) => setValue("unit", value.value)} // Update the value in react-hook-form

                        />

                    </div>
                </>
                <div className="flex gap-3 mt-3">
                    <IconButton
                        type="button"
                        icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
                        label="Cancel"
                        className="px-4 py-2 btn_cancel"
                        onClick={() => {
                            reset();

                            navigate("/user/project");

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

            {/* <DevTool control={control} /> */}


        </div>
    )
}

export default CreateProject
