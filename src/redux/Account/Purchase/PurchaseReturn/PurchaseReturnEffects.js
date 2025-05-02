// import axios from "axios";
// import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../../Interceptors";
// import { getUserLocalStorage } from "../../../../utils/utils";
// import { caesarEncrypt } from "../../../../utils/enc_dec";

// let leadInstance = axios.create({
//   baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/acc`,
// });
// leadInstance.defaults.headers.common["Content-Type"] = "application/json";

// leadInstance.interceptors.request.use(
//   SetTokenInterceptor,
//   (config) => new Promise.reject(config)
// );

// leadInstance.interceptors.response.use(
//   (config) => config,
//   ExpireTokenInterceptor
// );

// export const createSaleReturnEffect = (datas) => {
//   const data = (JSON.stringify(datas));
//   return leadInstance.request({
//     url: "/salesreturn-create",
//     method: "post",
//     data,
//   });
// };

// let getSaleReturnListEffectCancelToken = () => { };
// export const getSaleReturnListEffect = (data) => {
//   getSaleReturnListEffectCancelToken();
//   const token = getUserLocalStorage();
//   return leadInstance.request({
//     url: "/salesreturn-list",
//     method: "get",
//     params: data,
//     headers: {
//       Authorization: `Bearer ${token.token}`,
//     },
   
//   });
// };

// export const updateSaleReturnEffect = (datas) => {
//   getSaleReturnListEffectCancelToken();
//   const data = caesarEncrypt(JSON.stringify(datas));
//   const token = getUserLocalStorage();
//   return leadInstance.request({
//     url: "/salesreturn-update",
//     method: "post",
//     data,
//   });
// };
// export const rejectSaleReturnEffect = (datas) => {
//   getSaleReturnListEffectCancelToken();
//   const data = caesarEncrypt(JSON.stringify(datas));
//   return leadInstance.request({
//     url: "/salesquotation-reject",
//     method: "post",
//     data,
//   });
// };

// export const getInvoiceItemEffect = (datas) => {
//   getSaleReturnListEffectCancelToken();
//   const data = caesarEncrypt(JSON.stringify(datas));
//   return leadInstance.request({
//     url: "/sales-invoiceitem",
//     method: "post",
//     data,
//   });
// };

// export const InvoiceDropdownEffect = (datas) => {
//   const data = (JSON.stringify(datas));
//   return leadInstance.request({
//     url: "/sales-invoicedropdown",
//     method: "post",
//     data,
//   });
// };

import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../../Interceptors";
import { getUserLocalStorage } from "../../../../utils/utils";

// import { ExpireTokenInterceptor, SetTokenInterceptor } from "../Interceptors";
// import { getUserLocalStorage } from "../../utils/utils";
// import { caesarEncrypt } from "../../utils/enc_dec";


const customerInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/acc`,
});

customerInstance.defaults.headers.common["Content-Type"] = "application/json";

customerInstance.interceptors.request.use(
  SetTokenInterceptor,
  (config) => Promise.reject(config)
);

customerInstance.interceptors.response.use(
  (config) => config,
  ExpireTokenInterceptor
);

/** 
 * Generic API request function
 * @param {string} method - HTTP method ("get" or "post")
 * @param {string} url - API endpoint
 * @param {object} [data] - Request body or params
 * @param {boolean} [isFormData] - If true, sets Content-Type to multipart/form-data
 * @returns {Promise} - Axios request promise
 */
export const apiRequest = (method, url, data = {}, isFormData = false) => {
  const token = getUserLocalStorage();
  const headers = {
    Authorization: `Bearer ${token?.token || token}`,
  };

  if (isFormData) {
    headers["Content-Type"] = "multipart/form-data";
  }


  const requestData = method === "get" ? data : JSON.stringify(data);

  return customerInstance.request({
    url,
    method,
    ...(method === "get" ? { params: data } : { data: requestData }),
    headers,
  });
};

export const purchaseReturnListEffect = (datas) => {
  return apiRequest("get", "/purchasereturn-list", datas);
}


export const purchaseReturnCreateEffect = (datas) => {
  return apiRequest("post", "/purchasereturn-create", datas);
}

export const purchaseReturnUpdateEffect = (datas) => {
  return apiRequest("post", "/purchasereturn-update", datas);
}
export const purchaseReturnInvoiceItemEffect = (datas) => {
  return apiRequest("post", "/purchase-invoiceitem", datas);
}
export const purchaseReturnInvoiceDropdownEffect = (datas) => {
  return apiRequest("post", "/purchase-invoicedropdown", datas);
}