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

export const createPurchaseQuotationEffect = (datas) => {
  return apiRequest("post", "/purchasequotation-create", datas);
};

export const updatePurchaseQuotationEffect = (datas) => {
  return apiRequest("post", "/purchasequotation-update", datas);
};

export const cancelPurchaseOrderEffect = (datas) => {
  return apiRequest("post", "/purchasequotation-reject", datas);
};




export const listPurchaseQuotationEffect = (datas) => {
  return apiRequest("get", "/purchasequotation-list", datas);
};

export const purchaseQuotationConvertOrderEffect = (datas) => {
  return apiRequest("post", "/purchasequotation-convertorder", datas);
};


export const purchaseQuotationConvertInvoiceEffect = (datas) => {
  return apiRequest("post", "/purchasequotation-convertinvoice", datas);
};

