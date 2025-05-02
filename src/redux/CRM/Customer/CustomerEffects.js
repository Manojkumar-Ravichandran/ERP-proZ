import axios from "axios";
import { getUserLocalStorage } from "../../../utils/utils";
import { caesarEncrypt } from "../../../utils/enc_dec";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../Interceptors";

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
export const getCustomerListEffect = (data) => {
  // getLeadListEffectCancelToken();
  const token = getUserLocalStorage();
  return customerInstance.request({
    url: "/customer",
    method: "get",
    params: data,
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
  });
};
let getCustomerEffectCancelToken = () => {};

/* CUSTOMER VIEW */
export const customerDetailsEffect = (datas) => {
  
 
  const data = caesarEncrypt(JSON.stringify(datas));
  return customerInstance.request({
    url: "/customer-profile",
    method: "post",
    data,
   
  });
};

/* CUSTOMER MESSAGE */
// export const customerMessageEffect = (datas) => {
//   
 
//   // const data = JSON.stringify(datas);
//   const token = getUserLocalStorage();
//   return customerInstance.request({
//     url: "/customer-msg",
//     method: "post",
//     data:datas,
   
//   });
// };
export const customerMessageEffect = (datas) => {
  // Debug FormData

  const token = getUserLocalStorage();
  return customerInstance.request({
    url: "/customer-msg",
    method: "post",
    data: datas,
    headers: {
      "Content-Type": "multipart/form-data", // Ensure correct form encoding
      Authorization: `Bearer ${token}`, // If authentication is needed
    },
  });
};

/* CUSTOMER MESSAGE */
export const customerNotesEffect = (datas) => {
  
 
  // const data = JSON.stringify(datas);
  const token = getUserLocalStorage();
  return customerInstance.request({
    url: "/customer-notes",
    method: "post",
    data:datas,
   
  });
};
export const customerCommunicationEffect = (datas) => {
  
 
  // const data = JSON.stringify(datas);
  const token = getUserLocalStorage();
  return customerInstance.request({
    url: "/customer-communication",
    method: "post",
    data:datas,

});
}

export const customerOverviewEffect = (datas) => { 
  const token = getUserLocalStorage();
  return customerInstance.request({
    url: "/customer-overview",
    method: "post",
    data:datas,
   
  });

}

export const getTaskListEffect = (datas) => {
  const token = getUserLocalStorage();
  return customerInstance.request({
    url: "/task-list",
    method: "post",
    data:datas
  });
};

export const getMyTaskListEffect = (datas) => {
  const token = getUserLocalStorage();
  return customerInstance.request({
    url: "/mytask-list",
    method: "post",
    data:datas
  });
};

export const customerUpdateEffect = (datas) => {
  
 
  // const data = JSON.stringify(datas);
  const token = getUserLocalStorage();
  return customerInstance.request({
    url: "/customer-edit",
    method: "post",
    data:datas,
   
  });
};