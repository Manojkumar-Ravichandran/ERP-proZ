import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../../Interceptors";
import { getUserLocalStorage } from "../../../../utils/utils";

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



export const purchaseOrderListEffect = (datas) => { 
  return apiRequest("get", "/purchaseorder-list", datas);
}
export const purchaseOrderConvertInvoiceEffect = (datas) => { 
  return apiRequest("post", "/purchaseorder-convertinvoice", datas);
}
export const purchaseOrderCancelEffect = (datas) => { 
  return apiRequest("post", "/purchaseorder-cancel", datas);
}

export const purchaseOrderCreateEffect = (datas) => {
  return apiRequest("post", "/purchaseorder-create", datas);
}
export const purchaseOrderUpdateEffect = (datas) => {
  return apiRequest("post", "/purchaseorder-update", datas);
}