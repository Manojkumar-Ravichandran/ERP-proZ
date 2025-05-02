import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../Interceptors";
import { getUserLocalStorage } from "../../../utils/utils";
import { caesarEncrypt } from "../../../utils/enc_dec";


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

export const getCreditListEffect = (data) => {
  return leadInstance.request({
    url: "/credit-list",
    method: "post",
     data,
  });
};

export const createCreditEffect = (datas) => {
  const data = JSON.stringify(datas);
  return leadInstance.request({
    url: "/credit-create",
    method: "post",
    data,
  });
};

export const updateCreditEffect = (datas) => {
  const data = JSON.stringify(datas);
  return leadInstance.request({
    url: "/credit-update",
    method: "post",
    data,
  });
}

export const getCreditMasterDropdownEffect = (data) => {
  return leadInstance.request({
    url: "/creditmaster-dropdown",
    method: "post",
    data,
  });
}

export const createDebitEffect = (datas) => {
  const data = JSON.stringify(datas);
  return leadInstance.request({
    url: "/debit-create",
    method: "post",
    data,
  });
};
export const getDebitListEffect = (data) => {
  return leadInstance.request({
    url: "/debit-list",
    method: "post",
    data,
  });
};
export const getDebitMasterDropdownEffect = (data) => {
  return leadInstance.request({
    url: "/debitmaster-dropdown",
    method: "post",
    data,
  });
}
export const updateDebitEffect = (datas) => {
  const data = JSON.stringify(datas);
  return leadInstance.request({
    url: "/debit-update",
    method: "post",
    data,
  });
};

export const getExpensesListEffect = (data) => {
  return leadInstance.request({
    url: "/expenses-list",
    method: "post",
    data,
  });
};
export const createExpensesEffect = (datas) => {
  const data = JSON.stringify(datas);
  return leadInstance.request({
    url: "/expenses-create",
    method: "post",
    data,
  });
};
export const updateExpensesEffect = (datas) => {
  const data = JSON.stringify(datas);
  return leadInstance.request({
    url: "/expenses-update",
    method: "post",
    data,
  });
};
export const getExpensesMasterDropdownEffect = (data) => {
  return leadInstance.request({
    url: "/expensesmaster-dropdown",
    method: "post",
    data,
  });
}

export const getTransactionMatsterListEffect = (data) => {
  return leadInstance.request({
    url: "/transmaster-list",
    method: "post",
    data,
  });   
}
export const getTransactionMatsterUpdateEffect = (data) => {
  return leadInstance.request({
    url: "/transmaster-update",
    method: "post",
    data,
  });   
}

export const getTransactionMatsterCreateEffect = (data) => {
  return leadInstance.request({
    url: "/transmaster-create",
    method: "post",
    data,
  });   
}