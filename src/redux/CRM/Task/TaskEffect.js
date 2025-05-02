import axios from "axios";
import { getUserLocalStorage } from "../../../utils/utils";
import {
  ExpireTokenInterceptor,
  SetTokenInterceptor,
} from "../../Interceptors";
import { handleError } from "../../../utils/ErrorHanler";

let customerInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/crm`,
});
customerInstance.defaults.headers.common["Content-Type"] = "application/json";

customerInstance.interceptors.request.use(
  SetTokenInterceptor,
  (config) => new Promise.reject(config)
);
customerInstance.interceptors.response.use(
  (config) => config,
  ExpireTokenInterceptor
);

export const getTaskListEffect = (data) => {
  // getLeadListEffectCancelToken();
  const token = getUserLocalStorage();
  return customerInstance.request({
    url: "/crmtask-list",
    method: "POST",
    data,
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
  });
};
export const getMyTaskListEffect = (data) => {
  // getLeadListEffectCancelToken();
  const token = getUserLocalStorage();
  return customerInstance.request({
    url: "/crmtask-mylist",
    method: "POST",
    data,
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
  });
};

export const addTaskListEffect = async (data) => {
  try {
    // getLeadListEffectCancelToken();
    const token = getUserLocalStorage();
    const response = await customerInstance.request({
      url: "/crmtask-create",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response;
  } catch (error) {
    return handleError(error, "assetItemDropEffect");
  }
};
export const editTaskListEffect = async (data) => {
  try {
    // getLeadListEffectCancelToken();
    const token = getUserLocalStorage();
    const response = await customerInstance.request({
      url: "/crmtask-update",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response;
  } catch (error) {
    return handleError(error, "assetItemDropEffect");
  }
};
export const updateTaskListEffect = async (data) => {
  try {
    // getLeadListEffectCancelToken();
    const token = getUserLocalStorage();
    const response = await customerInstance.request({
      url: "/crmtaskupdate-create",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response;
  } catch (error) {
    return handleError(error, "assetItemDropEffect");
  }
};

export const deleteTaskEffect = async (data) => {
  try {
    // getLeadListEffectCancelToken();
    const token = getUserLocalStorage();
    const response = await customerInstance.request({
      url: "/crmtask-delete",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response;
  } catch (error) {
    return handleError(error, "assetItemDropEffect");
  }
};
export const updateTaskImageUploadEffect = async (data) => {
  try {
    // getLeadListEffectCancelToken();
    const token = getUserLocalStorage();
    const response = await customerInstance.request({
      url: "/crmtaskupdate-image",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "multipart/form-data", // Axios handles this automatically, but adding it explicitly is good practice

      },
    });
    return response;
  } catch (error) {
    return handleError(error, "assetItemDropEffect");
  }
};


export const employeeDasboardDataEffect = async (data) => {
  try {
    // getLeadListEffectCancelToken();
    const token = getUserLocalStorage();
    const response = await customerInstance.request({
      url: "/employeedashboard",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response;
  } catch (error) {
    return handleError(error, "employeeDasboardDataEffect");
  }
}