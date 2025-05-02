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

export const createSaleQuotationEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesquotation-create",
    method: "post",
    data,
  });
};

let getSaleQuotationListEffectCancelToken = () => { };
export const getSaleQuotationListEffect = (data) => {
  getSaleQuotationListEffectCancelToken();
  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/salesquotation-list",
    method: "get",
    params: data,
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
   
  });
};

export const updateSaleQuotationEffect = (datas) => {
  getSaleQuotationListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));
  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/salesquotation-update",
    method: "post",
    data,
  });
};

export const rejectSaleQuotationEffect = (datas) => {
  getSaleQuotationListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesquotation-reject",
    method: "post",
    data,
  });
};

export const SQToOrderEffect = (datas) => {
  getSaleQuotationListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesquotation-convertorder",
    method: "post",
    data,
  });
};

export const SQToInvoiceEffect = (datas) => {
  getSaleQuotationListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/salesquotation-convertinvoice",
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
    url: "/salesquotation-whatsapppdf",
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
    url: "/salesquotation-pdf",
    method: "post",
    data,
  });
};