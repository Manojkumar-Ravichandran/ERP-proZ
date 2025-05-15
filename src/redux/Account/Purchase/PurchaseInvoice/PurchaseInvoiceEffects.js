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

  // Encrypt the data if it's not a GET request
  const requestData = method === "get" ? data : JSON.stringify(data);

  return customerInstance.request({
    url,
    method,
    ...(method === "get" ? { params: data } : { data: requestData }),
    headers,
  });
};

export const createPurchaseInvoiceEffect = (datas) => {
  return apiRequest("post", "/purchaseinvoice-create", datas);
};

export const updateSalesOrderEffect = (datas) => {
  return apiRequest("post", "/salesorder-update", datas);
};


export const cancelSalesOrderEffect = (datas) => {
  return apiRequest("post", "/salesorder-cancel", datas);
};


export const pdfCustomerEffect = (datas) => {
  return apiRequest("post", "/purchaseinvoice-pdf", datas, true);
};


export const pdfWhatsappCustomerEffect = (datas) => {
  return apiRequest("post", "/purchaseinvoice-whatsapppdf", datas, true);
};


export const pdfMailCustomerEffect = (datas) => {
  return apiRequest("post", "/purchaseinvoice-mailpdf", datas, true);
};


export const listPurchaseInvoiceEffect = (datas) => {
  return apiRequest("get", "/purchaseinvoice-list", datas);
};