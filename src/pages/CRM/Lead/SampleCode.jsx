import React, { useEffect, useRef, useState } from "react";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import "./Lead.css";
import icons from "../../../contents/Icons";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { Controller, useForm } from "react-hook-form";
import ToggleSwitch from "../../../UI/Input/ToggleSwitch/ToggleSwitch";
import SubmitBtn from "../../../UI/Buttons/SubmitBtn/SubmitBtn";
import { validationPatterns } from "../../../utils/Validation";
import MultiSelect from "../../../UI/Select/MultiSelect";
import Select from "../../../UI/Select/SingleSelect";
import { getleadTypeListEffect, verifyLeadMobileEffect, getleadPropertyTypeListEffect, getFabricatorListEffect, fabricatorDetails } from "../../../redux/CRM/lead/LeadEffects";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Modal from "../../../UI/Modal/Modal";
import SingleSearchableSelect from "../../../UI/Select/SingleSearchableSelect";
import formatDateForInput from "../../../UI/Date/Date";
import { getActivityQueryListEffect, getActivityReplayListEffect, getEmployeeListCountEffect } from "../../../redux/common/CommonEffects";
import {
  getAllDistrictListEffect,
  getAllStateListEffect,
  getEmployeeListEffect,
  getAllUnitListEffect,
  getAllItemListEffect,
  getrefernceTypeListEffect,
  getrefernceListEffect,
  addRefernceEffect, getMaterialDetailEffect, getLeadPurposeEffect
} from "../../../redux/common/CommonEffects";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import { DevTool } from "@hookform/devtools";
import RadioInput from "../../../UI/Input/RadioInput/RadioInput";
import { useDispatch, useSelector } from "react-redux";
import {
  genderList,
  localityList,
  referralList,
  socialMediaList,
} from "../../../contents/DropdownList";
import {
  createLeadInprogress,
  createLeadReset,
  leadContactVerifyInprogress,
} from "../../../redux/CRM/lead/LeadActions";
import { getLeadStageListEffect, referenceDetails, getReferenceList, getCustomerTypeListEffect } from "../../../redux/CRM/lead/LeadEffects";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import { useLocation, useNavigate } from "react-router";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import IconFormInput from "../../../UI/Input/FormInput/IconFormInput/IconFormInput";
import CheckBoxInput from "../../../UI/Input/CheckBoxInput/CheckBoxInput";
import SingleCheckbox from "../../../UI/Input/CheckBoxInput/SingleCheckbox";
import { createVendorInReset } from "../../../redux/Stakeholders/Vendor/VendorAction";
import SearchableSelect from "../../../UI/Select/SearchableSelect";
import { getRandom, getUserLocalStorage } from "../../../utils/utils";
import { profileColorList } from "../../../contents/Colors";
import GeoMap from "../../../UI/GeoLocation/GeoMap/GeoMap";
import FileInput from "../../../UI/Input/FileInput/FileInput";
import CustomSelect from "../../../UI/Select/SelectReact";

export default function CreateLead() {
  const [toastData, setToastData] = useState({ show: false });
  const [districtList, setDistrictList] = useState([]);
  const [userData, setUserData] = useState();
  const [primaryOption, setPrimaryOption] = useState("Enquiry");
  const [enquiryOption, setEnquiryOption] = useState("WhatsApp");
  // const [leadSourceList, setLeadSourceList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [customerTypeList, setcustomerTypeList] = useState([])
  const [itemList, setItemList] = useState([]);
  const [materialDetailList, setMaterialDetailList] = useState([]);
  const [leadPurpose, setLeadPurpose] = useState([]);
  const [refTypeList, setRefTypeList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeCountList, setEmployeeCountList] = useState([]);
  const [stageList, setStageList] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [showFields, setShowFields] = useState(false);
  const [showFieldsPro, setShowFieldsPro] = useState(false);
  const [showFieldsAct, setShowFieldsAct] = useState(false);
  const [showFieldsSch, setShowFieldsSch] = useState(false);
  
  // const handleSelectChange = (e) => {
  //   const selected = e.target.value;
  //   setSelectedValue(selected);

  //   const selectedOption = stageList.find(option => option.value == selected);
  //   
  //   
  // }

  const [formValues, setFormValues] = useState({
    is_contact: true,
    unit: 16,
    reference_type: "",
    is_address: true,
  });
  const leadVerifyData = useSelector((state) => state?.lead?.leadVerify);
  const createLead = useSelector((state) => state?.lead?.createLead);
  const [referList, setReferList] = useState([]);
  const [referelIsModel, setReferelIsModel] = useState(false);
  const [fabIsModel, setFabIsModel] = useState(false);
  const [referelLoading, setReferelLoading] = useState(false);
  const [engineerList, setEngineerList] = useState([]);
  const [architectList, setArchitectList] = useState([]);
  const [referelMode, setReferelMode] = useState("");
  const [leadTypeList, setLeadTypeList] = useState([]);
  const [leadPropertyTypeList, setLeadPropertyTypeList] = useState([]);
  const [fabricatorList, setFabricatorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [replyList, setReplyList] = useState([]);
  const [queryList, setQueryList] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null); // Track selected query
  const [selectedQueryLabel, setSelectedQueryLabel] = useState("");
  const [selectedReplayLabel, setSelectedReplayLabel] = useState("");
  const [showAreaMeasurement, setShowAreaMeasurement] = useState(false);
  const areaList = [
    { label: 'Actual', value: 'actual' },
    { label: 'Approximate', value: 'approximate' },
  ];
  useEffect(() => {
    if (replyList.length === 0) {
      (async () => {
        try {
          let { data } = await getActivityReplayListEffect();
          data = data.data.map((list) => ({
            ...list,
            label: list.name,
            value: list.id,
          }));
          setReplyList(data);
        } catch (error) {
          setReplyList([]);
        }
      })();
    }
  }, [replyList]);

  useEffect(() => {
      (async () => {
        try {
          let { data } = await getActivityQueryListEffect();
          data = data.data.map((list) => ({
            ...list,
            label: list.name,
            value: list.id,
          }));
          setQueryList(data);
        } catch (error) {
          setQueryList([]);
        }
      })();
    }
  , []);

  // Filter replyList based on selected query
  const filteredReplyList = replyList.filter((reply) => {
    return reply.query_id === selectedQuery;
  });
  

  const {
    register,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
    handleSubmit,
    trigger
  } = useForm({ defaultValues: formValues });

  const {
    register: referlRegister,
    formState: { errors: referelError },
    control: referelControl,
    setValue: referelSetValue,
    watch: referelWatch,
    reset: referelReset,
    handleSubmit: referelHandleSubmit,
  } = useForm();
  const {
    register: fabRegister,
    formState: { errors: fabError },
    control: fabControl,
    setValue: fabSetValue,
    watch: fabWatch,
    reset: fabReset,
    handleSubmit: fabHandleSubmit,
  } = useForm();
  const isContact = watch("is_contact");
  const contactNumber = watch("contact");
  const referalType = watch("reference_type");
  const selectedItem = watch("product_name");
  const isAddress = watch("is_address");
  const addressValue = watch("address");

  useEffect(() => {
    if (location?.state?.contact) {
      setValue("contact", location?.state?.contact);
      mobileNumberUserCheck()
    }
  }, [location?.state])

  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
  };
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Lead", link: "/user/crm/lead/" },
    { id: 3, label: "Add Lead" },
  ];
  const leadSourceList = [
    { label: "Phone", value: "7" },
    { label: "WhatsApp", value: "8" },
    { label: "Email", value: "5" },
    { label: "Direct", value: "6" }
  ];
  const [singleSelected, setSingleSelected] = useState([]);
  const [multiSelected, setMultiSelected] = useState([]);
  const options = [
    { label: 'Image', value: 'image' },
    { label: 'Video', value: 'video' },
    { label: 'Brouch', value: 'brouch' }
  ];
  useEffect(() => {
    getDistrictList();
    const { token, userInfo } = getUserLocalStorage();
    setUserData(userInfo);

  }, []);
  // const isAddress = watch("is_address");
  // const addressValue = watch("address");
  const pincodeValue = watch("pincode");
  const districtValue = watch("district");
  const talukValue = watch("taluk");
  setValue("area_type", "actual");

  useEffect(() => {
    if (isAddress) {
      setValue("site_address", addressValue);
      setValue("site_address_pincode", pincodeValue);
      setValue("site_address_taluk", talukValue);
      setValue("site_address_district", districtValue);
    } else {
      setValue("site_address", "");
      setValue("site_address_pincode", "");
      setValue("site_address_taluk", "");
      setValue("site_address_district", "");
    }
  }, [isAddress, addressValue, pincodeValue, districtValue, talukValue, setValue]);


  const getDistrictList = async (state_code = 31) => {
    let { data } = await getAllDistrictListEffect({ state_code });
    data = data.data.map((list) => ({
      label: list.city_name,
      value: list.city_code,
    }));
    setDistrictList(data);
  };
  useEffect(() => {
    if (stageList.length === 0) {
      (async () => {
        try {
          let { data } = await getLeadStageListEffect();
          data = data.data.map((list) => ({
            label: list.name, // Display label
            value: list.id,   // Passed value
          }));
          setStageList(data);
        } catch (error) {
          setStageList([]);
        }
      })();
    }
  }, [stageList]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    
  };
  useEffect(() => {
    if (customerTypeList.length === 0) {
      (async () => {
        try {
          let { data } = await getCustomerTypeListEffect();
          data = data.data.map((list) => ({
            label: list.unit_name,
            value: list.id,
          }));
          setcustomerTypeList(data);
          setValue("unit", 16);
        } catch (error) {
          setcustomerTypeList([]);
        }
      })();
    }
  }, []);
  //////
  useEffect(() => {
    if (unitList.length === 0) {
      (async () => {
        try {
          let { data } = await getAllUnitListEffect();
          data = data.data.map((list) => ({
            label: list.unit_name,
            value: list.id,
          }));
          setUnitList(data);
          setValue("unit", 16);
        } catch (error) {
          setUnitList([]);
        }
      })();
    }
  }, [unitList]);
  useEffect(() => {
    if (itemList.length === 0) {
      (async () => {
        try {
          let { data } = await getAllItemListEffect();
          data = data.data.map((list) => ({
            ...list,
            label: list.material_name,
            value: list.id,
          }));
          setItemList(data);
        } catch (error) {
          setItemList([]);
        }
      })();
    }
  }, [itemList]);
  useEffect(() => {
    if (materialDetailList.length === 0) {
      (async () => {
        try {
          let { data } = await getMaterialDetailEffect();
          data = data.data.map((list) => ({
            ...list,
            label: list.name,
            value: list.id,
          }));
          setMaterialDetailList(data);
        } catch (error) {
          setMaterialDetailList([]);
        }
      })();
    }
    setValue("material_details", "");
  }, [materialDetailList]);
  useEffect(() => {
    if (leadPurpose.length === 0) {
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
    } setValue("lead_purpose", "");
  }, [leadPurpose]);
  useEffect(() => {
    (async () => {
      try {
        let { data } = await getEmployeeListEffect();
        data = data.data.map((list) => ({
          label: list.name,
          value: list.id,
        }));
        setEmployeeList(data);
      } catch (error) {
        setEmployeeList([]);
      }
    })();
    // setValue("incharge", "");
    setValue("reference_type", "");
    setValue("referal_employee", "");
    setValue("schedule_assignee", "");
    setValue("secondary_incharge", "")
  }, []);
  useEffect(() => {
    (async () => {
      try {
        let { data } = await getrefernceTypeListEffect();
        data = data.data.map((list) => ({
          label: list.name.charAt(0).toUpperCase() + list.name.slice(1),
          value: list.name.toLowerCase(),
        }));
        setRefTypeList(data);
      } catch (error) {
        setRefTypeList([]);
      }
    })();
    // setValue("incharge", "");
    setValue("reference_type", "");
    setValue("lead_type", "");
    setValue("secondary_incharge", "")
  }, []);
  const [selectedIncharge, setSelectedIncharge] = useState("");
  const [selectedSecondaryIncharge, setSelectedSecondaryIncharge] = useState("");

  useEffect(() => {
    (async () => {
      try {
        let { data } = await getEmployeeListCountEffect();
        data = data.data.map((list) => ({
          label: list.name,
          value: list.id,
          count: list.count,
          sec_count: list.sec_count, // Ensure sec_count is included
        }));

        setEmployeeCountList(data);

        // **Logic for "incharge"**
        const minCount = Math.min(...data.map((item) => item.count));
        const leastCountEmployees = data.filter((item) => item.count === minCount);
        const randomEmployee = leastCountEmployees[Math.floor(Math.random() * leastCountEmployees.length)];

        if (randomEmployee) {
          setSelectedIncharge(randomEmployee.value);
        }

        // **Logic for "secondary_incharge"**
        const minSecCount = Math.min(...data.map((item) => item.sec_count));
        let leastSecCountEmployees = data.filter((item) => item.sec_count === minSecCount);

        // Ensure "secondary_incharge" is different from "incharge"
        leastSecCountEmployees = leastSecCountEmployees.filter((emp) => emp.value !== randomEmployee?.value);

        // If all employees with the least sec_count are already selected as incharge, keep one
        const randomSecEmployee =
          leastSecCountEmployees.length > 0
            ? leastSecCountEmployees[Math.floor(Math.random() * leastSecCountEmployees.length)]
            : randomEmployee; // Fallback to randomEmployee if no other option

        if (randomSecEmployee) {
          setSelectedSecondaryIncharge(randomSecEmployee.value);
        }

      } catch (error) {
        setEmployeeCountList([]);
      }
    })();
  }, []);

  useEffect(() => {
    setValue("incharge", selectedIncharge);
  }, [selectedIncharge, setValue]);

  useEffect(() => {
    setValue("secondary_incharge", selectedSecondaryIncharge);
  }, [selectedSecondaryIncharge, setValue]);
  // const [selectedIncharge, setSelectedIncharge] = useState("");

  // // useEffect(() => {
  // //   (async () => {
  // //     try {
  // //       let { data } = await getEmployeeListCountEffect();
  // //       data = data.data.map((list) => ({
  // //         label: list.name,
  // //         value: list.id,
  // //         count: list.count,
  // //       }));


  // //       // Find the least count
  // //       const minCount = Math.min(...data.map((item) => item.count));

  // //       // Get all employees with the least count
  // //       const leastCountEmployees = data.filter((item) => item.count === minCount);

  // //       // Pick a random employee from the least count group
  // //       const randomEmployee = leastCountEmployees[Math.floor(Math.random() * leastCountEmployees.length)];

  // //       // Set the initial value if we have a valid employee
  // //       console.log("randomEmployee",randomEmployee)
  // //       if (randomEmployee) {
  // //         setValue("incharge", randomEmployee.value);
  // //       }

  // //       setEmployeeCountList(data);


  // //     } catch (error) {
  // //       setEmployeeCountList([]);
  // //     }
  // //   })();

  // //   // setValue("incharge", "");
  // //   setValue("reference_type", "");
  // //   setValue("referal_employee", "");
  // //   setValue("schedule_assignee", "");
  // //   setValue("secondary_incharge", "");
  // // }, []);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       let { data } = await getEmployeeListCountEffect();
  //       data = data.data.map((list) => ({
  //         label: list.name,
  //         value: list.id,
  //         count: list.count,
  //       }));

  //       setEmployeeCountList(data);

  //       // Find Minimum Count
  //       const minCount = Math.min(...data.map((item) => item.count));

  //       // Get All Employees with the Least Count
  //       const leastCountEmployees = data.filter((item) => item.count === minCount);

  //       // Pick a Random Employee
  //       const randomEmployee = leastCountEmployees[Math.floor(Math.random() * leastCountEmployees.length)];

  //       if (randomEmployee) {
  //         setSelectedIncharge(randomEmployee.value); // Store in state first
  //       }

  //     } catch (error) {
  //       setEmployeeCountList([]);
  //     }
  //   })();
  // }, []);

  // useEffect(() => {
  //   setValue("incharge", selectedIncharge); // Set value only when the selected employee is updated
  // }, [selectedIncharge, setValue]);
  useEffect(() => {
    (async () => {
      try {
        let { data } = await getleadTypeListEffect();
        

        data = data.data.map((list) => ({
          label: list?.name, // Name for dropdown display
          value: list?.name, // Store name in the form instead of ID
          id: Number(list?.id),  // Store ID for internal use
        }));

        setLeadTypeList(data);
      } catch (error) {
        setLeadTypeList([]);
      }
    })();
  }, []);

  const selectedLeadTypeName = watch("lead_type") || "";
  const selectedLeadTypeItem = leadTypeList.find((item) => item.value === selectedLeadTypeName);
  const selectedLeadTypeId = selectedLeadTypeItem?.id || null;  // Extract ID


  useEffect(() => {
    (async () => {
      try {
        let { data } = await getleadPropertyTypeListEffect();
        console.log(data)
        data = data.data.map((list) => ({
          label: list?.name,
          value: list?.id,
        }));
        setLeadPropertyTypeList(data);
      } catch (error) {
        setLeadPropertyTypeList([]);
      }
    })();
    setValue("lead_property_type", "")
  }, [])

  useEffect(() => {
    const c_number = contactNumber;
    setValue("reference_type", "");

    if (leadVerifyData?.data?.data) {
      Object.entries(leadVerifyData?.data?.data).forEach(([key, value]) => {
        setValue(key, value); // Dynamically set each field
      });
    } else {
      reset();
      setValue("contact", c_number);
      setValue("is_contact", true);
      // setValue("incharge", "");
      setValue("reference_type", "");
      setValue("secondary_incharge", "")
    }
  }, [leadVerifyData]);
  const mobileNumberUserCheck = () => {
    let payload = {
      lead_contact: contactNumber,
    };
    if (location?.state?.contact) {
      payload = {
        lead_contact: location?.state?.contact,
      };
    }

    dispatch(leadContactVerifyInprogress({ ...payload }));
    // const {data} = verifyLeadMobileEffect({...payload})
  };

  useEffect(() => {
    if (selectedItem) {
      const selectedItemData = itemList?.filter((e) => e.value == selectedItem);
      setValue("unit", Number(selectedItemData[0].unit));
    }
  }, [selectedItem]);

  const activityModeMap = {
    Call: "7",
    WhatsApp: "8",
    Mail: "5",
  };
  const primaryModeMap = {
    "Enquiry": "2",
    "Field Visit": "3",
    "Quotation": "4",
  };
  const addLeadHandler = (data) => {
    const is_scheduleFilled =
      data.schedule_pipeline_id ||
      data.schedule_mode_communication ||
      data.schedule_notes ||
      data.schedule_date ||
      data.schedule_assignee;

    const isActivityFilled =
      data.activity_pipeline_id ||
      data.activity_mode_communication ||
      data.activity_content_reply ||
      data.activity_customer_reply ||
      data.activity_notes ||
      data.activity_date ||
      data.activity_assignee;
    const payload = {
      ...data,
      lead_value: data.lead_value || null,
      length: data?.length || null,
      width: data?.width || null,
      height: data?.height || null,
      colour_code: getRandom(profileColorList),
      activity_mode_communication: enquiryOption ? activityModeMap[enquiryOption] : null,
      activity_pipeline_id: primaryOption ? primaryModeMap[primaryOption] : null,
      is_activity: isActivityFilled ? 1 : 0,
      is_schedule: is_scheduleFilled ? 1 : 0,
      activity_send_msg: data?.activity_send_msg ? 1 : 0,
      activity_customer_reply: selectedQuery,
      activity_content_reply: selectedReplayLabel,
      file_url: data?.file_url?.[0] || null,

    };
    setLoading(true);
    console.log("payload", { ...payload })
    dispatch(createLeadInprogress({ ...payload }));
  };

  useEffect(() => {
    reset();
    setLoading(false);
    if (createLead.success === true) {
      setToastData({
        show: true,
        message: createLead?.data.message,
        type: "success",
      });
      const leads = createLead
      console.log("leads", leads)
      dispatch(createLeadReset());
      setTimeout(() => {
        navigate("/user/crm/lead");
      }, 2000);
      // setTimeout(() => {
      //   navigate("/user/crm/lead", { state: { setIsModalOpenActivity: true, id: leads?.data?.id } });
      // }, 2000);
    } else if (createLead.error === true) {
      setToastData({ show: true, message: createLead?.message, type: "error" });
      dispatch(createLeadReset());
    }
  }, [createLead]);

  useEffect(() => {
    fetchFabricatorList();
  }, []);

  const fetchFabricatorList = async () => {
    try {
      let { data } = await getFabricatorListEffect();
      
      const formattedData = data.data.map((list) => ({
        label: list?.name,
        value: list?.id,
      }));
      setFabricatorList(formattedData);
    } catch (error) {
      console.error("Error fetching fabricator list:", error);
      setFabricatorList([]);
    }
  };
  const fabHandler = async (data) => {
    try {
      const response = await fabricatorDetails(data);
      setToastData({
        show: true,
        type: "success",
        message: "Fabricator details saved successfully!",
      });
      setFabIsModel(false);
      const newFabricator = {
        label: response.data.name,
        value: response.data.id,
      };
      setFabricatorList((prevList) => [...prevList, newFabricator]);
      await fetchFabricatorList(); // Refresh fabricator list
    } catch (error) {
      setToastData({
        show: true,
        type: "error",
        message: error?.response?.data?.message || "Failed to save fabricator details!",
      });
    }
  };

  const referelHandler = async (data) => {
    const payload = {
      ...data,
      reference_type: referelMode,
    };
    try {
      let { data } = await referenceDetails(payload);
      setToastData({
        show: true,
        type: "success",
        message: "Reference details saved successfully!",
      });
    } catch (error) {
      setToastData({
        show: true,
        type: "error",
        message: error?.response?.data?.message || "Failed to save reference details!",
      });

    } finally {
      setReferelIsModel(false);
      referelReset();
      setReferelLoading(false);
      getEngineerList(referelMode);
    }
  };

  const getArchitectList = async () => {
    const payload = {
      search: "architect",
    };
    try {
      let { data } = await getrefernceListEffect(payload);
      data = data.data.map((list) => ({
        label: list.name.charAt(0).toUpperCase() + list.name.slice(1),
        value: list.id,
      }));
      setArchitectList(data);

    } catch (error) {
      setArchitectList([]);
    }
  };
  const getEngineerList = async (search) => {
    const payload = {
      search,
    };
    try {
      let { data } = await getReferenceList(payload, search); // Pass search as referenceType
      data = data.data.data.map((list) => ({
        label: list.name.charAt(0).toUpperCase() + list.name.slice(1),
        value: list.id,
      }));
      if (search === "architect") {
        setArchitectList(data);
      } else {
        setEngineerList(data);
      }
    } catch (error) {
      if (search === "architect") {
        setArchitectList([]);
      } else {
        setEngineerList([]);
      }
    }
  };

  // Call API when referalType changes
  useEffect(() => {
    if (referalType === "architect" || referalType === "engineer") {
      getEngineerList(referalType);
    }
  }, [referalType]);

  ///////////////////////////////////////////
  setValue("schedule_time", formatDateForInput(new Date()));
  setValue("schedule_date", formatDateForInput(new Date()));
  setValue("activity_time", formatDateForInput(new Date()));
  setValue("activity_date", formatDateForInput(new Date()));
  setValue("activity_schedule_time", formatDateForInput(new Date()));

  const FeedbackForm = (

    <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-4xl 2xl:max-w-5xl">
      <SearchableSelect
        options={queryList}
        id="activity_customer_reply"
        iconLabel={React.cloneElement(icons.textarea, { size: 20 })}
        label="Lead Insights / Inquiries"
        register={register}
        errors={errors}
        showStar={false}
        validation={{ required: false }}
        setValue={setValue}
        onChange={(selectedOption1) => {
          setSelectedQueryLabel(selectedOption1.label); // Store the label here
          setSelectedQuery(selectedOption1.value);
        }}
      />
      <SearchableSelect
        options={filteredReplyList}
        label="Our Reply"
        id="activity_content_reply"
        iconLabel={React.cloneElement(icons.replay, { size: "20px" })}
        register={register}
        errors={errors}
        showStar={false}
        validation={{ required: false }}
        setValue={setValue}
        onChange={(selectedOption) => {
          setSelectedReplayLabel(selectedOption.value);
        }}
      />
      <FormInput
        id="activity_date"
        iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
        label="Date"
        type="date"
        register={register}
        showStar={false}
        errors={errors}
        validation={{ required: false }}
        defaultValue={new Date().toISOString().slice(0, 16)}
      />
      <TextArea
        id="activity_notes"
        iconLabel={icons.note}
        label="Notes"
        validation={{ required: false }}
        register={register}
        errors={errors}
        showStar={false}
      />
      {/* <div> */}
      <FileInput
        id="file_url"
        label="File"
        iconLabel={icons.filepin}
        type="file"
        register={register}
        showStar={false}
        errors={errors}
        validation={{ required: false }}
      />
      <Select
        options={employeeList}
        label="Assignee"
        id="activity_assignee"
        placeholder="Select Employee"
        iconLabel={React.cloneElement(icons.referenceIcon, { size: 20 })}
        register={register}
        errors={errors}
        showStar={false}
        validation={{ required: false }} />

      <SingleCheckbox
        id="activity_send_msg"
        label="Send Message"
        register={register}
        showStar={false}
        errors={errors}
        validation={{ required: false }}
        className="-mt-2"
      />
      <div>
        <label>Sample</label>
        <CheckBoxInput
          options={options}
          selectedValues={singleSelected}
          onChange={setSingleSelected}
          isMultiSelect={false}
          validation={{ required: false }}
          register={register}
          errors={errors}
          id="singleselect"
          className="flex gap-3 -mt-2"
        /> </div>

      <FormInput
        id="activity_schedule_time"
        iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
        label="Next Schedule Date"
        type="date"
        register={register}
        errors={errors}
        validation={{ required: false }}
        defaultValue={new Date().toISOString().slice(0, 16)}
        showStar={false}

      />
      {/* </div> */}
    </div>
  );
  const FORM_CONFIG = {
    Enquiry: {
      Call: FeedbackForm,
      WhatsApp: FeedbackForm,
      Mail: FeedbackForm,
      Direct: FeedbackForm,
    },
    "Field Visit": [
      FeedbackForm,
      <label>Area Measurement</label>,
      <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-4xl 2xl:max-w-5xl">
        {["length", "width", "height"].map((id) => (
          <div key={id}>
            <FormInput
              id={id}
              label={id[0].toUpperCase() + id.slice(1)}
              type="number"
              iconLabel={icons[`${id}ScaleIcon`]}
              register={register}
              errors={errors}
              showStar={false}
              validation={{ required: false }}
            />
          </div>
        ))}
        {/* <div className="col-span-6"> */}
        <Select
          options={unitList}
          label="Unit"
          id="unit"
          placeholder="Select Unit"
          iconLabel={icons.unit}
          register={register}
          errors={errors}
          showStar={false}
          validation={{ required: false }}
        />
        {/* <Select
          options={employeeList}
          label="Assignee"
          id="activity_assignee"
          placeholder="Select Employee"
          iconLabel={React.cloneElement(icons.referenceIcon, { size: 20 })}
          register={register}
          errors={errors}
          showStar={false}
          validation={{ required: false }} /> */}
      </div>
      // </div>,
    ],
    Quotation: {
      WhatsApp: [
        FeedbackForm,
        <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-4xl 2xl:max-w-5xl">
          {/* <Select
            options={employeeList}
            label="Assignee"
            id="activity_assignee"
            placeholder="Select Employee"
            iconLabel={React.cloneElement(icons.referenceIcon, { size: 20 })}
            register={register}
            errors={errors}
            showStar={false}
            validation={{ required: false }}
          />
          <FileInput
            id="file_url"
            label="File"
            iconLabel={icons.filepin}
            type="file"
            register={register}
            errors={errors}
            showStar={false}
            validation={{ required: false }}
          /> */}
        </div>
      ],
      Mail: [
        FeedbackForm,
        <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-4xl 2xl:max-w-5xl">
          {/* <Select
            options={employeeList}
            label="Assignee"
            id="activity_assignee"
            placeholder="Select Employee"
            iconLabel={React.cloneElement(icons.referenceIcon, { size: 20 })}
            register={register}
            errors={errors}
            showStar={false}
            validation={{ required: false }} />
          <FileInput
            id="file_url"
            label="File"
            type="file"
            iconLabel={icons.filepin}
            register={register}
            errors={errors}
            showStar={false}
            validation={{ required: false }}
          /> */}
        </div>
      ],
    },
  };
  const renderForm = (primaryOption, enquiryOption) =>
    Array.isArray(FORM_CONFIG[primaryOption])
      ? FORM_CONFIG[primaryOption]
      : FORM_CONFIG[primaryOption]?.[enquiryOption] || null;

  const length = watch("length") || 0;
  const width = watch("width") || 0;
  const area_vol = length * width;
  useEffect(() => {
    setValue("area_vol", area_vol);
  }, [length, width, area_vol, setValue]);

      const inchargeValue = watch("incharge");

      // useEffect(() => {
      //   if (watch("incharge") && watch("secondary_incharge")) {
      //     trigger("secondary_incharge"); // Force validation on initial render
      //   }
      // }, [watch("incharge"), watch("secondary_incharge"), trigger]);

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
      <Breadcrumps items={breadcrumbItems} />
      <div className="card rounded shadow-sm  darkCardBg p-5">
        <form onSubmit={handleSubmit(addLeadHandler)}>
          <p className="text-lg form-heading font-medium flex items-center gap-2">
            Lead Details
          </p>

          <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-4xl 2xl:max-w-5xl">
            <div>
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
                    message: "Provide Valid Contact Number",
                  },
                }}
                onBlur={mobileNumberUserCheck}
                errors={errors}
                icon={icons.searchIcon} // Pass the search icon here
                onClick={(e) => {
                  mobileNumberUserCheck();
                }}
                max={10}
                allowNumbersOnly={true}
              />
              <SingleCheckbox
                id="is_contact"
                label="Same For WhatsApp Number"
                register={register}
                errors={errors}
                validation={{
                  required: false,
                }}
              />
            </div>
            {!isContact && (
              <FormInput
                label="WhatsApp"
                id="whatsapp"
                iconLabel={icons.whatsapp}
                placeholder="Enter your WhatsApp Number"
                register={register}
                validation={{
                  required: "WhatsApp Number is required",
                  pattern: {
                    value: validationPatterns.contactNumber,
                    message: "Provide Valid WhatsApp Number",
                  },
                }}
                errors={errors}
                showStar={false}
                max={10}
                allowNumbersOnly={true}
              />
            )}
            <FormInput
              label="Name"
              id="name"
              iconLabel={icons.name}
              placeholder="Lead Name"
              register={register}
              validation={{
                required: "Lead name is required",
                pattern: {
                  value: validationPatterns.textOnly,
                  message: "Provide Valid Name",
                },
              }}
              errors={errors}
            />
            <FormInput
              label="Email"
              id="email"
              iconLabel={icons.mail}
              placeholder="Enter your email id"
              register={register}
              showStar={false}
              validation={{
                required: false,
              }}
              errors={errors}
            />
            <SearchableSelect
              options={customerTypeList}
              label="Customer Type"
              id="customer_type"
              iconLabel={icons.district}
              placeholder="Select Customer Type"
              register={register}
              validation={{ required: "please select Customer Type" }}
              errors={errors}
              setValue={setValue}
            />
            <div>
              <TextArea
                id="address"
                label="Address"
                iconLabel={icons.address}
                placeholder="Enter Address ..."
                register={register}
                validation={{
                  required: false,
                }}
                errors={errors}
                className="col-span-8 lg:col-span-8"
              />
              <SingleCheckbox
                id="is_address"
                label="Same For Site Address"
                register={register}
                errors={errors}
                validation={{
                  required: false,
                }}
              />
            </div>
            <FormInput
              label="Postal Code"
              id="pincode"
              iconLabel={icons.pincode}
              placeholder="Enter your Pincode"
              register={register}
              validation={{
                required: "Required pincode"

              }}
              errors={errors}
              max={6}
              allowNumbersOnly={true}
            />
            <SearchableSelect
              options={districtList}
              label="District"
              id="district"
              iconLabel={icons.district}
              placeholder="Select District"
              register={register}
              validation={{ required: "please select district" }}
              errors={errors}
              setValue={setValue}
              defaultValue={601}
            />
            <FormInput
              label="Taluk"
              id="taluk"
              iconLabel={icons.district}
              placeholder="Enter Taluk"
              register={register}
              validation={{ required: "Please Select Taluk" }}
              errors={errors}
              setValue={setValue}
            />

          </div>
          {!isAddress && (
            <>
              <p className="text-lg form-heading font-medium flex items-center gap-2">
                Site Address
              </p>
              <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-4xl 2xl:max-w-5xl">

                <TextArea
                  id="site_address"
                  label="Site Address"
                  iconLabel={icons.address}
                  placeholder="Enter Address ..."
                  register={register}
                  validation={{
                    required: false,
                  }}
                  errors={errors}
                  showStar={false}
                  className="col-span-8 lg:col-span-8"
                />
                <FormInput
                  label="Postal Code"
                  id="site_address_pincode"
                  iconLabel={icons.pincode}
                  placeholder="Enter your Pincode"
                  register={register}
                  validation={{
                    required: false

                  }}
                  errors={errors}
                  max={6}
                  allowNumbersOnly={true}
                />
                <SearchableSelect
                  options={districtList}
                  label="District"
                  id="site_address_district"
                  iconLabel={icons.district}
                  placeholder="Select District"
                  register={register}
                  validation={{ required: false }}
                  errors={errors}
                  setValue={setValue}
                  defaultValue={601}
                />
                <SearchableSelect
                  options={districtList}
                  label="Taluk"
                  id="site_address_taluk"
                  iconLabel={icons.district}
                  placeholder="Enter Taluk"
                  register={register}
                  validation={{ required: false }}
                  errors={errors}
                  setValue={setValue}
                  defaultValue={601}
                />
              </div>
            </>
          )}
          <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-4xl 2xl:max-w-5xl">

            <Select
              options={localityList}
              label="Village/Area"
              id="locality"
              iconLabel={icons.homeIcon}
              placeholder="Select Village/Area"
              register={register}
              validation={{ required: false }}
              errors={errors}
            />
            <FormInput
              label="Landmark"
              id="landmark"
              iconLabel={icons.locationIcon}
              placeholder="E.g. Near Library"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />
            <FormInput
              label="Lead Profession"
              id="lead_profession"
              iconLabel={React.cloneElement(icons.user, { size: 14 })}
              placeholder="Enter Lead Profession "
              register={register}
              validation={{
                required: false,
              }}
              showStar={false}
              errors={errors}
            />
            <Select
              options={leadPropertyTypeList}
              label="Lead Property Type"
              id="lead_property_type"
              iconLabel={icons?.threeUsers}
              placeholder="Select Lead Property Type"
              register={register}
              validation={{ required: "false" }}
              errors={errors}
              showStar={false}
            />


          </div>
          {/* <p className="py-3">
            <hr />
          </p>
          <p className="text-lg form-heading font-medium flex items-center gap-2 mt-3">
            Profession Details
            <button
              type="button"
              className="ml-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowFieldsPro(!showFieldsPro)}
            >
              {showFieldsPro ? (
                React.cloneElement(icons?.minusIcon, { size: 20 }) // Hide icon
              ) : (
                React.cloneElement(icons?.plusIcon, { size: 20 }) // Show icon
              )}
            </button>
          </p>
          {showFieldsPro && ( */}

          {/* <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-4xl 2xl:max-w-5xl">
             
            </div>
          )} */}
          <p className="py-3">
            <hr />
          </p>
          <p className="text-lg form-heading font-medium flex items-center gap-2 mt-3">
            Product Details
            <button
              type="button"
              className="ml-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowFields(!showFields)}
            >
              {showFields ? (
                React.cloneElement(icons?.minusIcon, { size: 20 }) // Hide icon
              ) : (
                React.cloneElement(icons?.plusIcon, { size: 20 }) // Show icon
              )}
            </button>
          </p>
          {showFields && (
            <>
              <div className="grid grid-cols-3  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-4xl 2xl:max-w-5xl">
                <Select
                  options={leadTypeList}
                  label="Lead Type"
                  id="lead_type"
                  iconLabel={icons?.threeUsers}
                  placeholder="Select Lead Type"
                  register={register}
                  validation={{ required: "Lead Type is Required" }}
                  errors={errors}
                  showStar={false}
                />
                {selectedLeadTypeItem?.id === 19 ? (
                  <div>
                    <Select
                      options={fabricatorList}
                      label="Fabricator"
                      id="fabricator_id"
                      iconLabel={icons?.threeUsers}
                      placeholder="Select Fabricator"
                      register={register}
                      validation={{ required: "Fabricator is Required" }}
                      errors={errors}
                    />
                    <button
                      className="top-clr text-sm"
                      type="button"
                      onClick={() => setFabIsModel(true)}
                    >
                      Add Fabricator
                    </button>
                  </div>
                ) : (
                  <SearchableSelect
                    options={materialDetailList}
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
                    setValue={setValue}
                  />
                )}

                <SearchableSelect
                  options={leadPurpose}
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
                />
              </div>
              <div className="grid grid-cols-4  gap-x-4 gap-y-2 my-2  mb-4  xl:max-w-4xl 2xl:max-w-5xl">
                <div className="col-span-2">
                  <MultiSelect
                    options={itemList}
                    label="Item Name "
                    id="product_name"
                    iconLabel={icons.roofIcon}
                    placeholder="Enter Product Name "
                    register={register}
                    validation={{
                      required: false,
                    }}
                    showStar={false}
                    errors={errors}
                    setValue={setValue}
                  />
                </div>
                <FormInput
                  label="Budget (Rs.)"
                  id="lead_value"
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
                {/* <Select
                  options={areaList}
                  label="Area Type"
                  id="area_type"
                  iconLabel={React.cloneElement(icons.area, { size: 14 })}
                  placeholder="Enter Area Type"
                  register={register}
                  validation={{
                    required: false,
                  }}
                  showStar={false}
                  errors={errors}
                  setValue={setValue}
                /> */}
                {/* <FormInput
                label="Area Type"
                id="area_type"
                iconLabel={React.cloneElement(icons.area, { size: 14 })}
                placeholder="Enter Area Type"
                register={register}
                validation={{
                  required: false,
                }}
                showStar={false}
                errors={errors}
              /> */}
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
                <FormInput
                  label="Area Volume"
                  id="area_vol"
                  iconLabel={icons.alllist}
                  placeholder="Area Volume"
                  register={register}
                  validation={{ required: false }}
                  errors={errors}
                  disabled
                />
                {/* <FormInput
                  label="Height"
                  id="height"
                  iconLabel={icons.widthScaleIcon}
                  placeholder="Enter Height"
                  register={register}
                  validation={{ required: false }}
                  errors={errors}
                  showStar={false}
                  max={10}
                  allowNumbersOnly={true}
                /> */}
                <Select
                  options={unitList}
                  label="Unit"
                  id="unit"
                  iconLabel={icons.unit}
                  placeholder="Select Unit"
                  register={register}
                  validation={{ required: "Unit is Required" }}
                  errors={errors}
                  showStar={false}
                  disabled
                />

              </div>
            </>
          )}

          <p className="py-3">
            <hr />
          </p>
          <p className="text-lg form-heading font-medium flex items-center gap-2 mt-3">
            Activity
            <button
              type="button"
              className="ml-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowFieldsAct(!showFieldsAct)}
            >
              {showFieldsAct ? (
                React.cloneElement(icons?.minusIcon, { size: 20 }) // Hide icon
              ) : (
                React.cloneElement(icons?.plusIcon, { size: 20 }) // Show icon
              )}
            </button>
          </p>
          {showFieldsAct && (

            <div>
              <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-4xl 2xl:max-w-5xl">
                <div>
                  <label className="flex items-center gap-2">
                    {React.cloneElement(icons.addActivity, { size: 20 })}
                    Purpose
                  </label>
                  <select
                    value={primaryOption}
                    onChange={(e) => setPrimaryOption(e.target.value)}
                    className="p-2 w-full border rounded">
                    {/* <option value="2">Enquiry</option>
                  <option value="3">Field Visit</option>
                  <option value="4">Quotation</option> */}
                    <option value="Enquiry">Enquiry</option>
                    <option value="Field Visit">Field Visit</option>
                    <option value="Quotation">Quotation</option>
                  </select>
                </div>
                <div className="mt-7">
                  {primaryOption !== "Field Visit" && (
                    <div className="chips-container flex gap-2 mb-4">
                      {(primaryOption === "Enquiry"
                        ? ["Call", "WhatsApp", "Mail", "Direct"]
                        : ["WhatsApp", "Mail"]
                      ).map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`chip ${enquiryOption === option ? "active" : ""}`}
                          onClick={() => setEnquiryOption(option)}>
                          {icons[option.toLowerCase()]}
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {renderForm(primaryOption, enquiryOption)}
            </div>
          )}
          <p className="py-3">
            <hr />
          </p>
          <p className="text-lg form-heading font-medium flex items-center gap-2 mt-3">
            Schedule Details
            <button
              type="button"
              className="ml-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowFieldsSch(!showFieldsSch)}
            >
              {showFieldsSch ? (
                React.cloneElement(icons?.minusIcon, { size: 20 }) // Hide icon
              ) : (
                React.cloneElement(icons?.plusIcon, { size: 20 }) // Show icon
              )}
            </button>
          </p>
          {showFieldsSch && (
            <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-4xl 2xl:max-w-5xl">
              <FormInput
                id="schedule_date"
                iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
                label="Date"
                type="date"
                register={register}
                errors={errors}
                validation={{ required: false }}
                defaultValue={new Date().toISOString().slice(0, 16)}
                showStar={false}

              />
              <span>
                <label htmlFor="schedule_pipeline_id">
                  {React.cloneElement(icons.tag, { size: 20 })} Purpose
                </label>
                <select
                  id="schedule_pipeline_id"
                  value={selectedValue}
                  onChange={handleSelectChange}
                  className="form-select border w-full p-2 rounded"
                >
                  <option value="" disabled>Select Purpose</option>
                  {stageList.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </span>
              <Select
                options={leadSourceList}
                label="Mode of Communication"
                id="schedule_mode_communication"
                register={register}
                errors={errors}
                placeholder="Select Stage"
                iconLabel={React.cloneElement(icons.tag, { size: 20 })}
                showStar={false}
                validation={{ required: false }}
              />

              <TextArea
                id="schedule_notes"
                iconLabel={icons.note}
                label="Notes"
                register={register}
                errors={errors}
                showStar={false}
                validation={{ required: false }}
              />
              <Select
                options={employeeList}
                label="Assignee"
                id="schedule_assignee"
                placeholder="Select Assignee"
                iconLabel={React.cloneElement(icons.referenceIcon, { size: 20 })}
                register={register}
                errors={errors}
                showStar={false}
                validation={{ required: false }}
              />








              {/*  */}
            </div>
          )}
          <p className="py-3">
            <hr />
          </p>
          <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-4xl 2xl:max-w-5xl">
            {userData?.role == 100 && (
              <Select
                options={employeeCountList}
                label="Incharge"
                id="incharge"
                iconLabel={icons.referenceIcon}
                placeholder="Select Employee"
                register={register}
                showStar={false}
                validation={{ required: false }}
                errors={errors}
                disabled={true}
              />

            )}



{/* <Controller
          name="incharge"
          control={control}
          rules={{ required: "Please select a category" }}
          render={({ field }) => (
            <CustomSelect
              {...field}
              id="incharge"
              label="incharge"
              options={employeeCountList}
              placeholder="Select Category"
              isSearchable
              errors={errors}
              onChange={(value) => field.onChange(value)}
            />
          )}
        /> */}

{/* <Controller
  name="incharge"
  control={control}
  rules={{ required: "Please select a category" }}
  render={({ field }) => (
    <CustomSelect
      {...field}
      id="incharge"
      label="Incharge"
      options={employeeCountList}
      placeholder="Select Category"
      isSearchable
      errors={errors}
      onChange={(value) => {
        field.onChange(value); // Update incharge value
        setValue("secondary_incharge", null); // Reset secondary_incharge
        trigger("secondary_incharge"); // Revalidate secondary_incharge if needed
      }}
    />
  )}
/> */}
{/* 
 <Controller
  name="secondary_incharge"
  control={control}
  rules={{
    required: "Please select an item",
    validate: (value) =>
      value !== inchargeValue || "Secondary Incharge cannot be the same as Incharge",
  }}
  render={({ field }) => (
    <CustomSelect
      {...field}
      id="secondary_incharge"
      label="Secondary Incharge"
      options={employeeCountList}
      placeholder="Select Item"
      isSearchable
      errors={errors}
      disabled={!inchargeValue}
      onChange={(value) => {
        field.onChange(value); // Update field value
        trigger("secondary_incharge"); // Trigger validation on selection
      }}
    />
  )}
/> */}

{/* <Controller
  name="secondary_incharge"
  control={control}
  rules={{
    required: "Please select an item",
    validate: (value) =>
      value !== watch("incharge") || "Secondary Incharge cannot be the same as Incharge",
  }}
  render={({ field }) => (
    <CustomSelect
      {...field}
      id="secondary_incharge"
      label="Secondary Incharge"
      options={employeeCountList}
      placeholder="Select Item"
      isSearchable
      errors={errors}
      disabled={!watch("incharge")} // Disable if Incharge is not selected
      onChange={(value) => {
        field.onChange(value); // Update field value
        trigger("secondary_incharge"); // Trigger validation on selection
      }}
    />
  )}
/> */}





          

            <Select
              options={employeeCountList}
              label="Secondary Incharge"
              id="secondary_incharge"
              iconLabel={icons.referenceIcon}
              placeholder="Select Employee"
              showStar={false}
              validation={{ required: false }}
              errors={errors}
              disabled={true}
            />
            
            <Select
              options={refTypeList}
              label="Referral Source"
              id="reference_type"
              iconLabel={icons.socialmedia}
              placeholder="Select Reference Type"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            // onChange={handleReferenceTypeChange}
            />
            {referalType.toLowerCase() == "social media" && (
              <Select
                options={socialMediaList}
                label="Social Media Platform"
                id="referal_platform"
                iconLabel={icons.social}
                placeholder="Select Social Media Platform"
                register={register}
                showStar={false}
                validation={{ required: false }}
                errors={errors}
              />
            )}
            {referalType == "employee" && (
              <Select
                options={employeeList}
                label="Referred Employee"
                id="referal_employee"
                iconLabel={icons.referenceIcon}
                placeholder="Select Employee"
                register={register}
                showStar={false}
                validation={{ required: false }}
                errors={errors}
              />
            )}
            {referalType == "architect" && (
              <div>
                <Select
                  options={architectList}
                  label="Referred Architect"
                  id="referal_employee"
                  iconLabel={icons.referenceIcon}
                  placeholder="Select Architect"
                  register={register}
                  showStar={false}
                  validation={{ required: false }}
                  errors={errors}
                />
                <button
                  className="top-clr text-sm"
                  type="button"
                  onClick={() => {
                    setReferelMode("architect");
                    setReferelIsModel(true);
                  }}
                >
                  Add Architect
                </button>
              </div>
            )}
            {referalType == "engineer" && (
              <div>
                <Select
                  options={engineerList}
                  label="Referred Engineer"
                  id="referal_employee"
                  iconLabel={icons.referenceIcon}
                  placeholder="Select Engineer"
                  register={register}
                  showStar={false}
                  validation={{ required: false }}
                  errors={errors}
                />
                <button
                  className="top-clr text-sm"
                  type="button"
                  onClick={() => {
                    setReferelMode("engineer")
                    setReferelIsModel(true);
                  }}
                >
                  Add Engineer
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <IconButton
              disabled={loading}
              type="button"
              icon={React.cloneElement(icons?.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
              onClick={() => navigate("/user/crm/lead")}
            />
            <IconButton
              type="submit"
              icon={React.cloneElement(icons?.plusIcon, { size: "20px" })}
              label="Create"
              className="px-4 py-2 "
              loading={loading}
            />
          </div>
        </form>
        {/* <DevTool control={control} /> */}
      </div>
      <Modal
        isOpen={referelIsModel}
        onClose={() => setReferelIsModel(false)}
        title="Add Referral Details"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={referelHandleSubmit(referelHandler)}>
          <div className="grid  gap-3">
            <FormInput
              id="name"
              iconLabel={React.cloneElement(icons.name, {
                size: 20,
              })}
              label="Name"
              register={referlRegister}
              errors={referelError}
              validation={{
                required: "Name is required",
                pattern: {
                  value: validationPatterns.textOnly,
                  message: "Provide Valid Name",
                },
              }}
            />

            <FormInput
              id="company_name"
              iconLabel={React.cloneElement(icons.name, {
                size: 20,
              })}
              label="Company Name"
              register={referlRegister}
              errors={referelError}
              validation={{
                required: "Company Name is required",
                pattern: {
                  value: validationPatterns.spacePattern,
                  message: "Provide Valid Name",
                },
              }}
            />
            <FormInput
              label="Contact"
              id="contact"
              iconLabel={icons.call}
              placeholder="Enter your Contact Number"
              register={referlRegister}
              validation={{
                required: "Contact Number is required",
                pattern: {
                  value: validationPatterns.contactNumber,
                  message: "Provide Valid Contact Number",
                },
              }}
              errors={referelError}
              showStar={true}
              max={10}
              allowNumbersOnly={true}
            />
            <FormInput
              label="Email"
              id="email"
              iconLabel={icons.call}
              placeholder="Enter your Email"
              register={referlRegister}
              validation={{
                required: false
              }}
              errors={referelError}
              showStar={false}
            />
            <TextArea
              id="address"
              label="Address"
              iconLabel={icons.address}
              placeholder="Enter Address ..."
              register={referlRegister}
              validation={{ required: "Address Required" }}
              errors={referelError}
              className="col-span-8 lg:col-span-8"
            />
            {/* <div>
              <GeoMap lat={location.lat} lng={location.lng} />
            </div> */}
          </div>
          <div className="flex gap-3 mt-3">
            <IconButton
              type="button"
              icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
              onClick={() => {
                setReferelIsModel(false);
                referelReset();
              }}
              disabled={referelLoading}
            />
            <IconButton
              type="submit"
              icon={React.cloneElement(icons.plusIcon, { size: "20px" })}
              label="Add "
              className="px-4 py-2"
              loading={referelLoading}
            />
          </div>
        </form>
      </Modal>

      {/* fab */}
      <Modal
        isOpen={fabIsModel}
        onClose={() => setFabIsModel(false)}
        title="Add Fabricator Details"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={fabHandleSubmit(fabHandler)}>
          <div className="grid  gap-3">
            <FormInput
              id="name"
              iconLabel={React.cloneElement(icons.name, {
                size: 20,
              })}
              label="Name"
              register={fabRegister}
              errors={referelError}
              validation={{
                required: "Name is required",
                pattern: {
                  value: validationPatterns.textOnly,
                  message: "Provide Valid Name",
                },
              }}
            />
            <FormInput
              label="Contact"
              id="contact"
              iconLabel={icons.call}
              placeholder="Enter your Contact Number"
              register={fabRegister}
              validation={{
                required: "Contact Number is required",
                pattern: {
                  value: validationPatterns.contactNumber,
                  message: "Provide Valid Contact Number",
                },
              }}
              errors={referelError}
              showStar={true}
              max={10}
              allowNumbersOnly={true}
            />
          </div>
          <div className="flex gap-3 mt-3">
            <IconButton
              type="button"
              icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
              onClick={() => {
                setReferelIsModel(false);
                referelReset();
              }}
              disabled={referelLoading}
            />
            <IconButton
              type="submit"
              icon={React.cloneElement(icons.plusIcon, { size: "20px" })}
              label="Add "
              className="px-4 py-2"
              loading={referelLoading}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}
