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

export const createNatureOfAccountEffect = (datas) => {
    const data = JSON.stringify(datas);
    return leadInstance.request({
      url: "/natureaccount-create",
      method: "post",
      data,
    });
};
export const updateNatureOfAccountEffect = (datas) => {
    const data = JSON.stringify(datas);
    return leadInstance.request({
      url: "/natureaccount-update",
      method: "post",
      data,
    });
};
export const getNatureOfAccountListEffect = (data) => {
    return leadInstance.request({
      url: "/natureaccount-list",
      method: "post",
      data,
    });
};
export const getNatureOfAccountDropdownEffect = (data) => {
    return leadInstance.request({
      url: "/natureaccount-dropdown",
      method: "post",
      data,
    });
};
export const createMajorHeadEffect = (datas) => {
    const data = JSON.stringify(datas);
    return leadInstance.request({
      url: "/majorhead-create",
      method: "post",
      data,
    });
};
export const updateMajorHeadEffect = (datas) => {
    const data = JSON.stringify(datas);
    return leadInstance.request({
      url: "/majorhead-update",
      method: "post",
      data,
    });
};
export const getMajorHeadListEffect = (data) => {
    return leadInstance.request({
      url: "/majorhead-list",
      method: "post",
      data,
    });
};
export const getMajorHeadDropdownEffect = (data) => {
    return leadInstance.request({
      url: "/majorhead-dropdown",
      method: "post",
      data,
    });
};
export const majorHeadDeleteEffect = (data) => {
    return leadInstance.request({
      url: "/majorhead-delete",
      method: "post",
      data,
    });
};
export const createSubHeadEffect = (datas) => {
    const data = JSON.stringify(datas);
    return leadInstance.request({
      url: "/subhead-create",
      method: "post",
      data,
    });
};
export const updateSubHeadEffect = (datas) => {
    const data = JSON.stringify(datas);
    return leadInstance.request({
      url: "/subhead-update",
      method: "post",
      data,
    });
};
export const getSubHeadListEffect = (data) => {
    return leadInstance.request({
      url: "/subhead-list",
      method: "post",
      data,
    });
};
export const getSubHeadDropdownEffect = (data) => {
    return leadInstance.request({
      url: "/subhead-dropdown",
      method: "post",
      data,
    });
};
export const subHeadDeleteEffect = (data) => {
    return leadInstance.request({
      url: "/subhead-delete",
      method: "post",
      data,
    });
};
export const createAccountMasterEffect = (datas) => {
    const data = JSON.stringify(datas);
    return leadInstance.request({
      url: "/accountsmaster-create",
      method: "post",
      data,
    });
};
export const updateAccountMasterEffect = (datas) => {
    const data = JSON.stringify(datas);
    return leadInstance.request({
      url: "/accountsmaster-update",
      method: "post",
      data,
    });
};
export const getAccountMasterListEffect = (data) => {
    return leadInstance.request({
      url: "/accountsmaster-list",
      method: "post",
      data,
    });
};
export const getAccountMasterDropdownEffect = (data) => {
    return leadInstance.request({
      url: "/accountsmaster-dropdown",
      method: "post",
      data,
    });
};
export const getAccountMasterDeleteEffect = (data) => {
    return leadInstance.request({
      url: "/accountsmaster-delete",
      method: "post",
      data,
    });
};