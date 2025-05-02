import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../Interceptors";


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
export const pdfWhatsappQuotationEffect = (datas) => {
    const data = (JSON.stringify(datas));
    return leadInstance.request({
      url: "/purchasequotation-whatsapppdf",
      method: "post",
      data,
    });
  };
  
  export const pdfMailQuotationEffect = (datas) => {
    const data = (JSON.stringify(datas));
    return leadInstance.request({
      url: "/purchasequotation-mailpdf",
      method: "post",
      data,
    });
  };
  
  export const purchaseQuotationPdfEffect = (datas) => {
    const data = (JSON.stringify(datas));
    return leadInstance.request({
      url: "/purchasequotation-pdf",
      method: "post",
      data,
    });
  };


export const purchaseOrderPdfWhatsappEffect = (datas) => {
    const data = (JSON.stringify(datas));
    return leadInstance.request({
      url: "/purchaseorder-whatsapppdf",
      method: "post",
      data,
    });
  };
  
  export const purchaseOrderMailPdfEffect = (datas) => {
    const data = (JSON.stringify(datas));
    return leadInstance.request({
      url: "/purchaseorder-mailpdf",
      method: "post",
      data,
    });
  };
  
  export const purchaseOrderPdfEffect = (datas) => {
    const data = (JSON.stringify(datas));
    return leadInstance.request({
      url: "/purchaseorder-pdf",
      method: "post",
      data,
    });
  };
