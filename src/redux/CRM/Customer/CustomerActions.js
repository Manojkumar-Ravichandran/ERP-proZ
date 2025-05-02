import CustomerTypes from "./CustomerTypes";

export const getCustomerListInProgress = (payload) => {
    return { type: CustomerTypes.GET_CUSTOMER_LIST_PROGRESS, payload };
};
  
export const getCustomerListInSuccess = (payload) => {
    return { type: CustomerTypes.GET_CUSTOMER_LIST_SUCCESS, payload };
};
  
export const getCustomerListInError = (payload) => {
    return { type: CustomerTypes.GET_CUSTOMER_LIST_ERROR, payload };
};
  
export const setCustomerList = (payload) => {
    return { type: CustomerTypes.SET_CUSTOMER_LIST, payload };
};


export const setCustomerDetailInprogress = (payload) => {
    return { type: CustomerTypes.SET_CUSTOMER_DETAIL_PROGRESS, payload };
};

export const setCustomerDetailInSuccess= (payload) => {
    return { type: CustomerTypes.SET_CUSTOMER_DETAIL_SUCCESS, payload };
};
  
export const setCustomerDetailInError = (payload) => {
    return { type: CustomerTypes.SET_CUSTOMER_DETAIL_ERROR, payload };
};

export const getTaskListInProgress = (payload) => {
    return { type: CustomerTypes.GET_TASK_LIST_PROGRESS, payload };
};
  
export const getTaskListInSuccess = (payload) => {
    return { type: CustomerTypes.GET_TASK_LIST_SUCCESS, payload };
};
  
export const getTaskListInError = (payload) => {
    return { type: CustomerTypes.GET_TASK_LIST_ERROR, payload };
};

export const getMyTaskListInProgress = (payload) => {
    return { type: CustomerTypes.GET_MYTASK_LIST_PROGRESS, payload };
};
  
export const getMyTaskListInSuccess = (payload) => {
    return { type: CustomerTypes.GET_MYTASK_LIST_SUCCESS, payload };
};
  
export const getMyTaskListInError = (payload) => {
    return { type: CustomerTypes.GET_MYTASK_LIST_ERROR, payload };
};