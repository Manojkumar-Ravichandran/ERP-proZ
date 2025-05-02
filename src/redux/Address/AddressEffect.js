import axios from "axios";
import { caesarEncrypt } from "../../utils/enc_dec";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../Interceptors";
import { getUserLocalStorage } from "../../utils/utils";

let addressInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
});
addressInstance.defaults.headers.common["Content-Type"] = "application/json";

addressInstance.interceptors.request.use(
  SetTokenInterceptor,
  (config) => new Promise.reject(config)
);

addressInstance.interceptors.response.use(
  (config) => config,
  ExpireTokenInterceptor
);

export const createBillingAddressEffect = (datas) => {
  const data = caesarEncrypt(JSON.stringify(datas));
  return addressInstance.request({
    url: "/address-create",
    method: "post",
    data,
  });
};

export const getBillingAddressEffect = (datas) => {
  return addressInstance.request({
    url: "/billaddress",
    method: "get",
  });
};
export const getShippingAddressEffect = (datas) => {
  return addressInstance.request({
    url: "/shipaddress",
    method: "get",
  });
};
