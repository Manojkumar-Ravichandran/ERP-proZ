import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../Interceptors";
import { getUserLocalStorage } from "../../utils/utils";
import { caesarEncrypt } from "../../utils/enc_dec";
const customerInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/all`,
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

  return customerInstance.request({
    url,
    method,
    ...(method === "get" ? { params: data } : { data }),
    headers,
  });
};


export const whatsappQrScanEffect = (data) => apiRequest("get", "/whatsapp-qrscan", data);
export const whatsappQrstatusEffect = (data) => apiRequest("get", "/whatsapp-qrstatus", caesarEncrypt(JSON.stringify(data)));

// export const CreateTaskEffect = (data) => apiRequest("post", "/tasklist-create",data);
// export const UpdateTaskEffect = (data) => apiRequest("post", "/tasklist-update",data);

// export const getTaskCategorylistEffect = (data) => apiRequest("get", "/taskcategory-list", data);
// export const getTasksubCategorylistEffect = (data) => apiRequest("get", "/subtasks-list", data);
// export const CreateTaskCategorylistEffect = (data) => apiRequest("post", "/taskcategory-create", data);
// export const UpdateTaskCategorylistEffect = (data) => apiRequest("post", "/taskcategory-update", data);
// export const SubTasksCreateEffect = (data) => apiRequest("post", "/subtasks-create", data);
// export const SubTasksUpdateEffect = (data) => apiRequest("post", "/subtasks-update", data);

// export const getTaskListEffect = (data) => apiRequest("get", "/tasklist-list", data);


// export const projectDropdownEffect = (data) => apiRequest("post", "/project-dropdown", data);

// export const taskSubCategoryDropdownEffect = (data) => apiRequest("post", "/task-sub-category-dropdown", data);

// export const taskCategoryDropdownEffect = (data) => apiRequest("post", "/task-category-dropdown", data);
