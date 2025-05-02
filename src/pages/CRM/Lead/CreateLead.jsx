import React, { useEffect, useState } from "react";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import "./Lead.css";
import icons from "../../../contents/Icons";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { useForm } from "react-hook-form";
import ToggleSwitch from "../../../UI/Input/ToggleSwitch/ToggleSwitch";
import SubmitBtn from "../../../UI/Buttons/SubmitBtn/SubmitBtn";
import { validationPatterns } from "../../../utils/Validation";
import MultiSelect from "../../../UI/Select/MultiSelect";
import Select from "../../../UI/Select/SingleSelect";
import { getleadTypeListEffect, verifyLeadMobileEffect, getleadPropertyTypeListEffect, getFabricatorListEffect, fabricatorDetails, getLeadCategoryListEffect } from "../../../redux/CRM/lead/LeadEffects";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Modal from "../../../UI/Modal/Modal";
import SingleSearchableSelect from "../../../UI/Select/SingleSearchableSelect";
import formatDateForInput from "../../../UI/Date/Date";
import { getActivityQueryListEffect, getActivityReplayListEffect, getAllProductListEffect, getEmployeeListCountEffect } from "../../../redux/common/CommonEffects";
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
import SearchableSelect from "../../../UI/Select/SearchableSelect";
import { getRandom, getUserLocalStorage } from "../../../utils/utils";
import { profileColorList } from "../../../contents/Colors";
import FileInput from "../../../UI/Input/FileInput/FileInput";
import { search } from 'india-pincode-search';
import SelectSearchable from "../../../UI/Select/Search/SelectSearchable";
import { getDefaultDate, getDefaultDateTime } from "../../../utils/Data";
import { CustomerDropdownEffect } from "../../../redux/project/ProjectEffects";
import SearchableSelector from "../../../UI/Select/selectBox";
import PhoneNumberInput from "../../../UI/Input/Phonenumber/PhoneNumber";
import {  parsePhoneNumber } from "react-phone-number-input";
export default function CreateLead() {
  const [district, setDistrict] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const [leadCategoryList, setLeadCategoryList] = useState([]);


  const [toastData, setToastData] = useState({ show: false });
  const [districtList, setDistrictList] = useState([]);
  const [userData, setUserData] = useState();
  const [primaryOption, setPrimaryOption] = useState("Enquiry");
  const [enquiryOption, setEnquiryOption] = useState("Call");
  // const [leadSourceList, setLeadSourceList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [customerTypeList, setcustomerTypeList] = useState([])
  const [itemList, setItemList] = useState([]);
  const [productList, setProductList] = useState([]);

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
    area_type: "approximate", // Set a default value for area_type
    length: "",
    width: "",
    is_next_schedule: "0"
  });
  const leadVerifyData = useSelector((state) => state?.lead?.leadVerify);
  const createLead = useSelector((state) => state?.lead?.createLead);
  const [referList, setReferList] = useState([]);
  const [referelIsModel, setReferelIsModel] = useState(false);
  const [fabIsModel, setFabIsModel] = useState(false);
  const [referelLoading, setReferelLoading] = useState(false);
  const [engineerList, setEngineerList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
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
  const [selectedReplayLabel, setSelectedReplayLabel] = useState("");

  const areaList = [
    { label: 'Approximate', value: 'approximate' },
    { label: 'Actual', value: 'actual' },
  ];
  const Schedule = [
    { label: 'Yes', value: '1' },
    { label: 'No', value: '0' },
  ];
  // useEffect(() => {
  //   if (replyList.length === 0) {
  //     (async () => {
  //       try {
  //         let { data } = await getActivityReplayListEffect();
  //         data = data.data.map((list) => ({
  //           ...list,
  //           label: list.name,
  //           value: list.id,
  //         }));
  //         setReplyList(data);
  //       } catch (error) {
  //         setReplyList([]);
  //       }
  //     })();
  //   }
  // }, [replyList]);

  useEffect(() => {
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
  }, []);

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
    trigger,
    getValues,
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
  const is_next_schedule = watch("is_next_schedule");
  const pincode = watch("site_address_pincode");

  // Make sure useForm is initialized properly

  const areaType = watch("area_type"); // Default to 'actual'

  // Ensure `setValue` is only called inside `useEffect`
  useEffect(() => {
    if (areaType === "approximate") {
      setValue("length", ""); // Clear length when switching to approximate
      setValue("width", "");
    }
  }, [areaType, setValue]); // Only run when areaType changes

  const { token, userInfo } = getUserLocalStorage();

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
    { label: 'Images', value: 'image' },
    { label: 'Videos', value: 'video' },
    { label: 'Brochure', value: 'brouch' }
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
  useEffect(() => {
    setValue("area_type", "approximate");
  }, []);

  useEffect(() => {
    setValue("is_next_schedule", "0");
  }, []);

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
            label: list.name,
            value: list.id,
          }));
          setcustomerTypeList(data);
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
    if (productList.length === 0) {
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

          // setItemList([]);
        }
      })();
    }
  }, [productList]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       let { data } = await getAllProductListEffect();
  //       data = data.data.map((list) => ({
  //         ...list,
  //         label: list.material_name,
  //         value: list.id,
  //       }));
  //       setProductList(data);
  //     } catch (error) {
  //       setProductList([]);
  //     }
  //   })();
  // }, []);

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
    // setValue("incharge", "");Add Activity
    setValue("reference_type", "");
    setValue("referal_employee", "");
    setValue("schedule_assignee", "");
    // setValue("secondary_incharge", "")
  }, []);
  useEffect(() => {
    (async () => {
      try {
        let { data } = await getrefernceTypeListEffect();
        data = data.data.map((list) => ({
          label: list.name.charAt(0).toUpperCase() + list.name.slice(1),
          value: list?.name?.toLowerCase(),
        }));
        setRefTypeList(data);
      } catch (error) {
        setRefTypeList([]);
      }
    })();

    setValue("reference_type", "");
    setValue("lead_type", "");
    // setValue("secondary_incharge", "")
  }, []);
  const [selectedIncharge, setSelectedIncharge] = useState("");
  const [selectedSecondaryIncharge, setSelectedSecondaryIncharge] = useState("");

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       let { data } = await getEmployeeListCountEffect();
  //       data = data.data.map((list) => ({
  //         label: list.name,
  //         value: list.id,
  //         count: list.count,
  //         sec_count: list.sec_count, // Ensure sec_count is included
  //       }));

  //       setEmployeeCountList(data);

  //       // **Logic for "incharge"**
  //       const minCount = Math.min(...data.map((item) => item.count));
  //       const leastCountEmployees = data.filter((item) => item.count === minCount);
  //       const randomEmployee = leastCountEmployees[Math.floor(Math.random() * leastCountEmployees.length)];

  //       if (randomEmployee) {
  //         setSelectedIncharge(randomEmployee.value);
  //       }

  //       // **Logic for "secondary_incharge"**
  //       const minSecCount = Math.min(...data.map((item) => item.sec_count));
  //       let leastSecCountEmployees = data.filter((item) => item.sec_count === minSecCount);

  //       // Ensure "secondary_incharge" is different from "incharge"
  //       leastSecCountEmployees = leastSecCountEmployees.filter((emp) => emp.value !== randomEmployee?.value);

  //       // If all employees with the least sec_count are already selected as incharge, keep one
  //       const randomSecEmployee =
  //         leastSecCountEmployees.length > 0
  //           ? leastSecCountEmployees[Math.floor(Math.random() * leastSecCountEmployees.length)]
  //           : randomEmployee; // Fallback to randomEmployee if no other option

  //       if (randomSecEmployee) {
  //         setSelectedSecondaryIncharge(randomSecEmployee.value);
  //       }

  //     } catch (error) {
  //       setEmployeeCountList([]);
  //     }
  //   })();
  // }, []);

  // useEffect(() => {
  //   setValue("incharge", selectedIncharge);
  // }, [selectedIncharge, setValue]);

  // useEffect(() => {
  //   setValue("secondary_incharge", selectedSecondaryIncharge);
  // }, [selectedSecondaryIncharge, setValue]);


  useEffect(() => {
    const fetchLeadTypes = async () => {
      try {
        let { data } = await getleadTypeListEffect();

        const formattedData = data.data.map((list) => ({
          label: list?.name, // Display Name
          value: list?.name, // Store Name as Value
          id: Number(list?.id), // ID for internal logic
        }));

        setLeadTypeList(formattedData);

        // Set default value to "product" if it exists
        const defaultOption = formattedData.find((item) => item.value === "product");
        if (defaultOption) {
          setValue("lead_type", "product"); // Force "product" as default
        }
      } catch (error) {
        console.error("Error fetching lead types:", error);
        setLeadTypeList([]);
      }
    };

    fetchLeadTypes();
  }, []);

  const selectedLeadTypeName = watch("lead_type") || "";
  const selectedLeadTypeItem = leadTypeList.find((item) => item.value === selectedLeadTypeName);
  const selectedLeadTypeId = selectedLeadTypeItem?.id || null;  // Extract ID


  useEffect(() => {
    (async () => {
      try {
        let { data } = await getleadPropertyTypeListEffect();
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
    if (leadPropertyTypeList.length > 1) {
      setValue("lead_property_type", 20);
    }
  }, [leadPropertyTypeList, setValue]);

  useEffect(() => {
    const c_number = contactNumber;
    setValue("reference_type", "");

    if (leadVerifyData?.data?.data) {
      Object.entries(leadVerifyData?.data?.data).forEach(([key, value]) => {
        setValue(key, value); // Dynamically set each field
      });
    } else {
      // reset();
      setValue("contact", c_number);
      setValue("is_contact", true);
      setValue("reference_type", "");
    }
  }, [leadVerifyData]);
  const mobileNumberUserCheck = () => {
    console.log(contactNumber);
    let payload = {
      lead_contact: contactNumber,
    };
    if (location?.state?.contact) {
      payload = {
        lead_contact: location?.state?.contact,
      };
    }
    // const phoneNumber = parsePhoneNumber(contactNumber);
    // if (phoneNumber) {
    //   const result = {
    //     raw: contactNumber,
    //     country: phoneNumber.country, // ISO code (e.g., 'IN')
    //     countryCallingCode: phoneNumber.countryCallingCode, // e.g., '91'
    //     nationalNumber: phoneNumber.nationalNumber // e.g., '9876543210'
    //   };
    //   console.log("result",result);
    // }
    dispatch(leadContactVerifyInprogress({ ...payload }));
    // const {data} = verifyLeadMobileEffect({...payload})

    // if (leadVerifyData?.data?.data?.customer_type_id) {
    //   const customerType = customerTypeList.find(
    //     (type) => type.value === leadVerifyData.data.data.customer_type_id
    //   );
    //   if (customerType) {
    //     setValue("customer_type", customerType);
    //   }
    // }
  };
  useEffect(() => {
    (async () => {
      try {
        let { data } = await getLeadCategoryListEffect();
        data = data.data.map((list) => ({
          ...list,
          label: list.name,
          value: list.id,
        }));
        // data.unshift({ label: "ALL", value: "ALL" });
        setLeadCategoryList(data);
      } catch (error) {
        setLeadCategoryList([]);

        // setItemList([]);
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
          value: list.id,
        }));
        setCustomerList(data);
      } catch (error) {
        setCustomerList([]);
      }
    })();
  }
    , []);
  const pincodeNumberUserCheck = async () => {
    let payload = {
      lead_contact: pincode,
    };
    if (location?.state?.contact) {
      payload = {
        lead_contact: location?.state?.contact,
      };
    }
    try {
      const result = await search(pincode); // Use the `search` function
      if (result && result.length > 0) {
        setDistrict(result[0].district); // Access the district from the result
      } else {
        setDistrict('District not found');
      }
    } catch (error) {
      console.error('Error fetching district:', error);
      setDistrict('Error fetching district');
    }
    // dispatch(leadContactVerifyInprogress({ ...payload }));
    // const {data} = verifyLeadMobileEffect({...payload})
  };


  // useEffect(() => {
  //   if (selectedItem) {
  //     const selectedItemData = itemList?.filter((e) => e.value == selectedItem);
  //     setValue("unit", Number(selectedItemData[0].unit));
  //   }
  // }, [selectedItem]);

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
      is_schedule: is_next_schedule,
      activity_send_msg: data?.activity_send_msg ? 1 : 0,
      activity_customer_reply: selectedQuery,
      activity_content_reply: selectedReplayLabel,
      file_url: data?.file_url?.[0] || null,
      district: typeof data?.district === "object" ? data?.district?.value : data?.district,
      site_address_district: typeof data?.site_address_district === "object" ? data?.site_address_district?.value : data?.site_address_district,
    };

    setLoading(true);
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
    (async () => {
      try {
        let { data } = await CustomerDropdownEffect();
        data = data.data.map((list) => ({
          ...list,
          label: list.name,
          value: list.id,
        }));
        setCustomerList(data);
      } catch (error) {
        setCustomerList([]);
      }
    })();
  }
    , []);

  useEffect(() => {
    fetchFabricatorList();
  }, []);

  const handleIconClick = (phoneNumber) => {
    console.log('Valid phone number:', phoneNumber);
    // Add your custom logic here, e.g., API call
  };
  
  const fetchFabricatorList = async () => {
    try {
      let { data } = await getFabricatorListEffect();
      const formattedData = data.data.map((list) => ({
        label: list?.name,
        value: list?.id,
      }));
      setFabricatorList(formattedData);
    } catch (error) {
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
  // setValue("schedule_date", formatDateForInput(new Date()));
  setValue("activity_time", formatDateForInput(new Date()));
  // setValue("activity_date", formatDateForInput(new Date()));
  setValue("activity_date", getDefaultDateTime());
  // setValue("schedule_date", getDefaultDateTime());
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
      {/* <FormInput
        id="date"
        iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
        label="Date & Time"
        type="datetime-local"
        register={register}
        errors={errors}
        validation={{ required: "Schedule Date & Time is required" }}
        max={getDefaultDateTime()}
        min={getDefaultDateTime(2)}
      /> */}
      <FormInput
        id="activity_date"
        iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
        label="Date & Time"
        type="datetime-local"
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
        label="Attachment"
        iconLabel={icons.filepin}
        type="file"
        register={register}
        showStar={false}
        errors={errors}
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

      <div className="flex gap-3 ">
        <SingleCheckbox
          id="activity_send_msg"
          label="Send Message"
          register={register}
          showStar={false}
          errors={errors}
          validation={{ required: false }}
          className="mt-5 flex "
        />
      </div>
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

      {/* <FormInput
        id="activity_schedule_time"
        iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
        label="Next Schedule Date"
        type="date"
        register={register}
        errors={errors}
        validation={{ required: false }}
        defaultValue={new Date().toISOString().slice(0, 16)}
        showStar={false}

      /> */}
      <RadioInput
        options={Schedule}
        label="Next Schedule"
        id="is_next_schedule"
        register={register}
        validation={{
          required: false,
        }}
        errors={errors}
        d
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
          // options={unitList}
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


  useEffect(() => {
    setShowFieldsSch(is_next_schedule == "1");
  }, [is_next_schedule]);


  useEffect(() => {
    const matchingDistrict = districtList.find(d => d?.label === district);
    if (matchingDistrict) {
      setSelectedDistrict(matchingDistrict);
      setValue("district", matchingDistrict);
    }
  }, [district, districtList, setValue]);


  const handleSelection = (selected) => {
    setSelectedDistrict(selected);
    setValue("pincode", "");

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
      <Breadcrumps items={breadcrumbItems} />
      <div className="card rounded shadow-sm  darkCardBg p-5">
        <form onSubmit={handleSubmit(addLeadHandler)}>
          <p className="text-lg form-heading font-medium flex items-center gap-2">
            Lead Details
          </p>
    
          <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-4xl 2xl:max-w-5xl">
           
       
        <div>
        <PhoneNumberInput
            id="contact"
            label="Phone Number"
            placeholder="Enter mobile number"
            defaultCountry="IN"
            register={register}
            setValue={setValue}
            trigger={trigger}
            getValues={getValues} 
            errors={errors}
            icon={icons.searchIcon} // Pass the search icon here
            onIconClick={mobileNumberUserCheck} // Pass the function to handle icon click
          />
              {/* <IconFormInput
                id="contact"
                label="Contact"
                placeholder="Contact Number"
                type="search"
                iconLabel={icons.call}
                register={register}
                validation={{
                  required: "Contact is required",
                }}
                onBlur={mobileNumberUserCheck}
                errors={errors}
                icon={icons.searchIcon} // Pass the search icon here
                onClick={(e) => {
                  mobileNumberUserCheck();
                }}
                // max={15}
                // allowNumbersOnly={true}
              /> */}            
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
            <IconFormInput
              id="pincode"
              label="Postal Code"
              placeholder="Enter your Pincode"
              type="search"
              iconLabel={icons.call}
              register={register}
              showStar={false}
              validation={{
                required: false,
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Provide Valid Pincode Number",
                },
              }}
              onBlur={pincodeNumberUserCheck}
              errors={errors}
              icon={icons.searchIcon} // Pass the search icon here
              onClick={(e) => {
                pincodeNumberUserCheck();
              }}
              max={10}
              allowNumbersOnly={true}
            />
            <SelectSearchable
              options={districtList}
              onChange={handleSelection}
              label="District"
              id="district"
              iconLabel={icons.district}
              placeholder="Select District"
              register={register}
              validation={{ required: "please select district" }}
              errors={errors}
              setValue={setValue}
              showStar={true}
              defaultValue={selectedDistrict}
            />

            <FormInput
              label="Taluk"
              id="taluk"
              iconLabel={icons.district}
              placeholder="Enter Taluk"
              register={register}
              validation={{
                required: "Taluk is required",
                pattern: {
                  value: validationPatterns.textOnly,
                  message: "Taluk only contains letters",
                },
              }}
              errors={errors}
              setValue={setValue}
              showStar={true}
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
                  showStar={false}
                />
              </div>
            </>
          )}
          <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-4xl 2xl:max-w-5xl">

            {/* <Select
              options={localityList}
              label="Village/Area"
              id="locality"
              iconLabel={icons.homeIcon}
              placeholder="Select Village/Area"
              register={register}
              validation={{ required: false }}
              errors={errors}
            /> */}
            <FormInput
              label="Village/Area"
              id="locality"
              iconLabel={icons.homeIcon}
              placeholder="Enter Village/Area"
              register={register}
              showStar={false}
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
              validation={{ required: "lead_property_type" }}
              errors={errors}
              showStar={true}
            />
            <Select
              options={leadTypeList}
              label="Lead Type"
              id="lead_type"
              iconLabel={icons?.threeUsers}
              placeholder="Select Lead Type"
              register={register}
              validation={{ required: "Lead Type is Required" }}
              errors={errors}
              showStar={true}
              defaultValue={"product"}
            />
            <Select
              options={leadCategoryList}
              label="Lead Category"
              id="lead_category"
              // iconLabel={icons?.threeUsers}
              placeholder="Select Lead Category"
              register={register}
              validation={{ required: "Lead Category is Required" }}
              errors={errors}
              showStar={true}
            // defaultValue={"product"}
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
                    options={materialDetailList || []} // Ensure it's an array
                    label="Material Details"
                    id="material_details"
                    iconLabel={icons.materialToolIcon}
                    placeholder="Enter Material Details"
                    register={register}
                    validation={{
                      required: "Material Details is required",
                    }}
                    showStar={true}
                    errors={errors}
                    setValue={setValue}
                    value={watch('material_details')}
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
                    required: "Lead Purpose is required",
                  }}
                  showStar={true}
                  errors={errors}
                  setValue={setValue}
                  value={watch('lead_purpose')}
                />
              </div>
              <div className="grid grid-cols-4  gap-x-4 gap-y-2 my-2  mb-4  xl:max-w-4xl 2xl:max-w-5xl">
                <div className="col-span-2">
                  <SearchableSelect
                    options={productList}
                    label="Roofing type"
                    id="product_name"
                    iconLabel={icons.roofIcon}
                    placeholder="Enter Roofing type "
                    register={register}
                    validation={{
                      required: "Roofing type is required",
                    }}
                    showStar={true}
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
                    required: "Area Type is required",
                  }}
                  showStar={true}
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
                  id="area_vol"
                  type="number"
                  iconLabel={icons.alllist}
                  placeholder="Area Volume"
                  register={register}
                  validation={{ required: "Area volume required" }}
                  errors={errors}
                  showStar={true}
                  disabled={areaType !== "approximate"}
                />


                {/* <FormInput
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
                */}
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
                          {icons[option?.toLowerCase()]}
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
          {is_next_schedule === "1" && (
            <>
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
                    label="Schedule Date"
                    type="date"
                    register={register}
                    errors={errors}
                    validation={{ required: "Next schedule date required " }}
                    // defaultValue={new Date().toISOString().slice(0, 16)}
                    showStar={true}
                    min={getDefaultDate()}
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
                    showStar={true}
                    validation={{ required: "mode of Communication required" }}
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
                  {/* {token === 100 && ( */}
                  {/* {userData?.role == 100 && (
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
              )} */}
                  {/* )} */}


                  {/*  */}

                </div>
              )}
              <p className="py-3">
                <hr />
              </p>
            </>
          )}
          <div className="grid grid-cols-2  gap-x-4 gap-y-2 my-2  mb-4 xl:max-w-4xl 2xl:max-w-5xl">
            {/* {userData?.role == 100 && (
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
            <Select
              options={employeeCountList}
              label="Secondary Incharge"
              id="secondary_incharge"
              iconLabel={icons.referenceIcon}
              placeholder="Select Employee"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
              disabled={true}
            /> */}
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
            {referalType?.toLowerCase() == "social media" && (
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
            {referalType == "customer" && (
              <SearchableSelector
                errors={errors}
                label="Referred Customer"
                id="referal_employee"
                options={customerList}
                placeholder="Select referal employee"
                onChange={handleSelection}
                error={false}
                searchable={true}
                register={register}
                validation={{ required: "customer is Required" }}
                setValue={setValue}
                defaultid={watch('referal_employee')}                                            // defaultValue={vendorList?.find((vendor) => vendor?.value === watch('vendor'))} // Match the value
                defaultValue={watch('referal_employee')} // Match the value)} // Match the value
              />

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
