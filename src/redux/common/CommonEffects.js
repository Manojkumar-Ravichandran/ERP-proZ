import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../Interceptors";
import { getUserLocalStorage } from "../../utils/utils";
import { caesarEncrypt } from "../../utils/enc_dec";

const authInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
});
const tokenValue = getUserLocalStorage();
authInstance.defaults.headers.common["Content-Type"] = "application/json";
authInstance.interceptors.request.use(
  SetTokenInterceptor,
  (config) => new Promise.reject(config)
);

authInstance.interceptors.response.use(
  (config) => config,
  ExpireTokenInterceptor
);

/* GET STATE LIST */
export const getAllStateListEffect = () => {
  return authInstance.request({
    url: "/crm/state-dropdown",
    method: "get",
  });
};
/* GET DISTRICT LIST */
export const getAllDistrictListEffect = (data) => {
  return authInstance.request({
    url: "/crm/district-dropdown",
    method: "post",
    data,
  });
};

/* GET ALL CATEGORY */
export const getAllCategoryListEffect = (data) => {
  return authInstance.request({
    url: "/crm/categorylist",
    method: "get",
  });
};

/* GET SUB CATEGORY LIST */
export const getAllSubCategoryListEffect = (data) => {
  return authInstance.request({
    url: "/crm/subcategorylist",
    method: "post",
    data,
  });
};
/* GET SUB CATEGORY LIST */
export const getAllItemListEffect = (datas) => {
  let data;
  if (datas) {
    data = caesarEncrypt(JSON.stringify(datas?.datas));
  }
  return authInstance.request({
    url: "/crm/materiallist",
    method: "post",
    data,
  });
};

export const getAllProductListEffect = (datas) => {
  let data;
  if (datas) {
    data = caesarEncrypt(JSON.stringify(datas?.datas));
  }
  return authInstance.request({
    url: "/crm/productlist",
    method: "post",
    data,
  });
};


/* GET UNIT LIST */
export const getAllUnitListEffect = () => {
  return authInstance.request({
    url: "/crm/unit_master",
    method: "get",
  });
};

/* GET VENDOR LIST */
export const getAllVendorListEffect = () => {
  return authInstance.request({
    url: "/crm/vendorlist",
    method: "post",
  });
};

/* EMPLOYEE LIST */
export const getEmployeeListEffect = () => {
  return authInstance.request({
    url: "/crm/employeelist",
    method: "post",
  });
};

/* BILLING ADDRESS */
export const getAllBillAddListEffect = () => {
  return authInstance.request({
    url: "/crm/billaddress",
    method: "get",
  });
};

/* SHIPPING ADDRESS */
export const getAllShippingAddListEffect = () => {
  return authInstance.request({
    url: "/crm/shipaddress",
    method: "get",
  });
}

/* getReferenceList */
export const getrefernceListEffect =(datas)=>{
  console.log("datas",datas)
  let data ;
  if(datas){
     data = caesarEncrypt(JSON.stringify(datas));

  }
  return authInstance.request({
    url: "/crm/address-create",
    method: "post",
    data,
  });
}

/* ADD REFERENCE */
export const addRefernceEffect =(datas)=>{
  let data ;
  if(datas){
     data = caesarEncrypt(JSON.stringify(datas));

  }
  return authInstance.request({
    url: "/inv/inventorymaster-dropdown",
    method: "post",
    data,
  });
};
export const addAddressEffect = (datas) => {
  const data = caesarEncrypt(JSON.stringify(datas));
  return authInstance.request({
    url: "/crm/address-create",
    method: "post",
    data,
  });
};

export const getAllInventoryMasterListEffect = (datas) => {
  let data;
  if (datas) {
    data = caesarEncrypt(JSON.stringify(datas?.datas));
  }
  return authInstance.request({
    url: "/inv/inventorymaster-dropdown",
    method: "post",
    data,
  });
};

/* getReferenceType */
export const getrefernceTypeListEffect =()=>{
  return authInstance.request({
    url: "/crm/referencetype",
    method: "post",
    
  });
}

export const getLeadPurposeEffect = (datas) => {
  let data;
  if (datas) {
    data = caesarEncrypt(JSON.stringify(datas?.datas));
  }
  return authInstance.request({
    url: "/crm/leadpurpose",
    method: "post",
    data,
  });
};
export const getMaterialDetailEffect = (datas) => {
  let data;
  if (datas) {
    data = caesarEncrypt(JSON.stringify(datas?.datas));
  }
  return authInstance.request({
    url: "/crm/leadmaterialdetails",
    method: "post",
    data,
  });
};

export const getReasonListEffect = (datas) => {
  let data;
  if (datas) {
    data = caesarEncrypt(JSON.stringify(datas?.datas));
  }
  return authInstance.request({
    url: "/crm/reasondropdown-list",
    method: "post",
    data,
  });
};

export const getActivityReplayListEffect = (datas) => {
  let data;
  if (datas) {
    data = caesarEncrypt(JSON.stringify(datas?.datas));
  }
  return authInstance.request({
    url: "/crm/activityreplydropdown-list",
    method: "post",
    data,
  });
};

export const getActivityQueryListEffect = (datas) => {
  let data;
  if (datas) {
    data = caesarEncrypt(JSON.stringify(datas?.datas));
  }
  return authInstance.request({
    url: "/crm/activityquerydropdown-list",
    method: "post",
    data,
  });
};

export const getEmployeeListCountEffect = () => {
  return authInstance.request({
    url: "/crm/inchargelist-count",
    method: "post",
  });
};