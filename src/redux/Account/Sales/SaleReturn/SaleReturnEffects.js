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

export const createSaleReturnEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesreturn-create",
    method: "post",
    data,
  });
};

let getSaleReturnListEffectCancelToken = () => { };
export const getSaleReturnListEffect = (data) => {
  getSaleReturnListEffectCancelToken();
  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/salesreturn-list",
    method: "get",
    params: data,
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
   
  });
};

export const updateSaleReturnEffect = (datas) => {
  getSaleReturnListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));
  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/salesreturn-update",
    method: "post",
    data,
  });
};
export const rejectSaleReturnEffect = (datas) => {
  getSaleReturnListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesquotation-reject",
    method: "post",
    data,
  });
};

export const getInvoiceItemEffect = (datas) => {
  getSaleReturnListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/sales-invoiceitem",
    method: "post",
    data,
  });
};

export const InvoiceDropdownEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/sales-invoicedropdown",
    method: "post",
    data,
  });
};