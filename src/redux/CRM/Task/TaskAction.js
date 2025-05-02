import TaskTypes from "./TaskTypes";

export const getTaskListInProgress = (payload) => {
    return { type: TaskTypes.GET_TASK_LIST_PROGRESS, payload };
};
  
export const getTaskListInSuccess = (payload) => {
    return { type: TaskTypes.GET_TASK_LIST_SUCCESS, payload };
};
  
export const getTaskListInError = (payload) => {
    return { type: TaskTypes.GET_TASK_LIST_ERROR, payload };
};
export const getMyTaskListInProgress = (payload) => {
    return { type: TaskTypes.GET_MY_TASK_LIST_PROGRESS, payload };
};
  
export const getMyTaskListInSuccess = (payload) => {
    return { type: TaskTypes.GET_MY_TASK_LIST_SUCCESS, payload };
};
  
export const getMyTaskListInError = (payload) => {
    return { type: TaskTypes.GET_MY_TASK_LIST_ERROR, payload };
};