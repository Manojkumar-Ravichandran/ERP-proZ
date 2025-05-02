import axios from "axios";
import { getUserLocalStorage } from "../../../utils/utils";
import { caesarEncrypt } from "../../../utils/enc_dec";
import {
  ExpireTokenInterceptor,
  SetTokenInterceptor,
} from "../../Interceptors";
import { handleError } from "../../../utils/ErrorHanler";

let inventoryInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/inv`,
});
inventoryInstance.defaults.headers.common["Content-Type"] = "application/json";

inventoryInstance.interceptors.request.use(
  SetTokenInterceptor,
  (config) => new Promise.reject(config)
);
inventoryInstance.interceptors.response.use(
  (config) => config,
  ExpireTokenInterceptor
);

export const updateInventoryMasterEffect = async (data) => {
  try {
    const token = getUserLocalStorage();
    const response = await inventoryInstance.request({
      url: "/inventorymaster-update",
      method: "post",
      data: data,
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response;
  } catch (error) {
    return handleError(error, "updateInventoryMasterEffect");
  }
  // getLeadListEffectCancelToken();
};
export const updateInventoryInchargeEffect = async (data) => {
  try {
    const token = getUserLocalStorage();
    const response = await inventoryInstance.request({
      url: "/inventorymaster-inchargetransfer",
      method: "post",
      data: data,
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response;
  } catch (error) {
    return handleError(error, "updateInventoryInchargeEffect");
  }
  // getLeadListEffectCancelToken();
};
export const updateInventoryImageEffect = async (data) => {
  try {
    const token = getUserLocalStorage();
    const response = await inventoryInstance.request({
      url: "/inventorymaster-imageupload",
      method: "post",
      data: data,
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "multipart/form-data", // Axios handles this automatically, but adding it explicitly is good practice
      },
    });
    return response;
  } catch (error) {
    return handleError(error, "updateInventoryImageEffect");
  }
  // getLeadListEffectCancelToken();
};
