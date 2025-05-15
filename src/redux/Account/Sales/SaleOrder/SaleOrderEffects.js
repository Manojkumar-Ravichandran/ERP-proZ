import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../../Interceptors";
import { getUserLocalStorage } from "../../../../utils/utils";
import { caesarEncrypt } from "../../../../utils/enc_dec";

let leadInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/acc`,
});
leadInstance.defaults.headers.common["Content-Type"] = "application/json";

leadInstance.interceptors.request.use(
  SetTokenInterceptor,
  (config) => new Promise.reject(config)
);

leadInstance.interceptors.response.use(
  (config) => config,
  ExpireTokenInterceptor
);

export const createSaleOrderEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesorder-create",
    method: "post",
    data,
  });
};

let getSaleOrderListEffectCancelToken = () => { };
export const getSaleOrderListEffect = (data) => {
  getSaleOrderListEffectCancelToken();
  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/salesorder-list",
    method: "get",
    params: data,
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
   
  });
};

export const updateSaleOrderEffect = (datas) => {
  getSaleOrderListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));
  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/salesorder-update",
    method: "post",
    data: datas
    });
};
export const rejectSaleOrderEffect = (datas) => {
  getSaleOrderListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesorder-cancel",
    method: "post",
    data: datas
  });
};

export const SQToInvoiceEffect = (datas) => {
  getSaleOrderListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesorder-convertinvoice",
    method: "post",
    data,
  });
};

export const CustomerListEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/customerlist",
    method: "post",
    data,
  });
};

export const WhatsAppShareEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesorder-whatsapppdf",
    method: "post",
    data,
  });
};

export const MailShareEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesquotation-mailpdf",
    method: "post",
    data,
  });
};

export const PdfCustomerEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesorder-pdf",
    method: "post",
    data,
  });
};