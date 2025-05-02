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

export const createSaleInvoiceEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesinvoice-create",
    method: "post",
    data,
  });
};

let getSaleInvoiceListEffectCancelToken = () => { };
export const getSaleInvoiceListEffect = (data) => {
  getSaleInvoiceListEffectCancelToken();
  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/salesinvoice-list",
    method: "get",
    params: data,
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
   
  });
};

export const updateSaleInvoiceEffect = (datas) => {
  getSaleInvoiceListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));
  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/salesinvoice-update",
    method: "post",
    data,
  });
};
export const rejectSaleInvoiceEffect = (datas) => {
  getSaleInvoiceListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesquotation-reject",
    method: "post",
    data,
  });
};

export const SQToInvoiceEffect = (datas) => {
  getSaleInvoiceListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesquotation-convertInvoice",
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

export const WhatsAppiShareEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesinvoice-whatsapppdf",
    method: "post",
    data,
  });
};

export const MailiShareEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesinvoice-mailpdf",
    method: "post",
    data,
  });
};

export const PdfiCustomerEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesinvoice-pdf",
    method: "post",
    data,
  });
};