import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../Interceptors";
import { getUserLocalStorage } from "../../utils/utils";
import { caesarEncrypt } from "../../utils/enc_dec";
// import { getUserLocalStorage } from "../../../utils/utils";
// import { caesarEncrypt } from "../../../utils/enc_dec";
// import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../Interceptors";

const customerInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/pro`,
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

  // Encrypt the data if it's not a GET request
  const requestData = method === "get" ? data : JSON.stringify(data);

  return customerInstance.request({
    url,
    method,
    ...(method === "get" ? { params: data } : { data: requestData }),
    headers,
  });
};

/** Customer APIs */
export const getProjectListEffect = (data) => apiRequest("get", "/project-list", data);

export const CreateProjectEffect = (data) => apiRequest("post", "/project-create", data);

export const CreateTaskEffect = (data) => apiRequest("post", "/tasklist-create",data);
export const UpdateTaskEffect = (data) => apiRequest("post", "/tasklist-update",data);

export const getTaskCategorylistEffect = (data) => apiRequest("get", "/taskcategory-list", data);
export const getTasksubCategorylistEffect = (data) => apiRequest("get", "/subtasks-list", data);
export const CreateTaskCategorylistEffect = (data) => apiRequest("post", "/taskcategory-create", data);
export const UpdateTaskCategorylistEffect = (data) => apiRequest("post", "/taskcategory-update", data);
export const SubTasksCreateEffect = (data) => apiRequest("post", "/subtasks-create", data);
export const SubTasksUpdateEffect = (data) => apiRequest("post", "/subtasks-update", data);

export const getTaskListEffect = (data) => apiRequest("get", "/tasklist-list", data);


export const projectDropdownEffect = (data) => apiRequest("post", "/project-dropdown", data);

export const taskSubCategoryDropdownEffect = (data) => apiRequest("post", "/task-sub-category-dropdown", data);

export const taskCategoryDropdownEffect = (data) => apiRequest("post", "/task-category-dropdown", data);

export const CreateMaterialEffect = (data) => apiRequest("post", "/material-request-create",data);

export const UpdateMaterialEffect = (data) => apiRequest("post", "/material-request-update",data);

export const MaterialListEffect = (data) => apiRequest("get", "/material-request-list",data);



export const ApproveTaskCategoryEffect = (data) => apiRequest("post", "/material-request-approve", data);

export const TransitTaskCategoryEffect = (data) => apiRequest("post", "/material-request-transit", data);

export const DeliverTaskCategoryEffect = (data) => apiRequest("post", "/material-request-delivery",data);

export const CancelTaskCategoryEffect = (data) => apiRequest("post", "/material-request-cancel",data);

export const RejectTaskCategoryEffect = (data) => apiRequest("get", "/material-request-decline",data);


export const RequestDropdownEffect = (data) => apiRequest("post", "/request-dropdown", data);
export const ProjectRequestDropdownEffect = (data) => apiRequest("post", "/project-request-material", data);
export const CreateMaterialReturnEffect = (data) => apiRequest("post", "/material-return-create",data);
export const CustomerDropdownEffect = (data) => apiRequest("get", "/customer-dropdown", data);
export const MaterialReturnListEffect = (data) => apiRequest("get", "/material-return-list",data);
export const MaterialReturnUpdateEffect = (data) => apiRequest("post", "/material-return-update",data);
export const MaterialReturnApprovedEffect = (data) => apiRequest("post", "/material-return-approved",data);
export const ProjectShowListEffect = (data) => apiRequest("get", "/project-show-side",data);
export const ProjectOverviewEffect = (data) => apiRequest("get", "/project-overview",data);
export const ProjectShowMaterialEffect = (data) => apiRequest("get", "/project-show-material",data);
export const ProjectShowMaterialReturnEffect = (data) => apiRequest("get", "/project-show-material-return",data);
export const ProjectShowTaskEffect = (data) => apiRequest("get", "/project-show-task",data);
export const ProjectShowMaterialInOutEffect = (data) => apiRequest("get", "/material-request-in-out-list",data);
export const ProjectShowMaterialInOutUpdateEffect = (data) => apiRequest("post", "/material-request-in-out-update",data);
export const ProjectShowMaterialInOutApprovedEffect = (data) => apiRequest("post", "/material-request-in-out-approved",data);
export const ProjectShowMaterialInOutcreateEffect = (data) => apiRequest("post", "/material-request-in-out",data);

export const ProjectShowTaskUpdateEffect = (data) => apiRequest("post", "/task-update",data);
export const ProjectDashboardEffect = (data) => apiRequest("get", "/project-dashboard",data);

export const taskAttachmentUpdateEffect = (data) => apiRequest("post", "/task-attachment-update",data);

export const UpdatedTaskList = (data) => apiRequest("post", "/task-update-list",data);


