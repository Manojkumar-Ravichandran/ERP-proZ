import { DEFAULT_STORE_OBJECT } from "../../../contents/Common";
import TaskTypes from "./TaskTypes";

const initialState = {
  taskList: {
    ...DEFAULT_STORE_OBJECT,
    data: [],
    total: 0,
    per_page: 10,
    from: 1,
    current_page: 1,
    last_page: 0,
  },
  myTaskList: {
    ...DEFAULT_STORE_OBJECT,
    data: [],
    total: 0,
    per_page: 10,
    from: 1,
    current_page: 1,
    last_page: 0,
  },
};

const CRMTaskReducer = (state = initialState, { type, payload }) => {
  console.log( type, payload);
  console.log(payload?.data?.data?.data);
  switch (type) {
    case TaskTypes.GET_TASK_LIST_PROGRESS: {
      return {
        ...state,
        taskList: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          data: payload?.data?.data?.data,
          total: payload?.data?.data?.total,
          per_page: payload?.data?.data?.per_page,
          from: payload?.data?.data?.from,
          current_page: payload?.data?.data?.current_page,
          last_page: payload?.data?.data?.last_page,
        },
      };
    }
    case TaskTypes.GET_TASK_LIST_SUCCESS: {
      return {
        ...state,
        taskList: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          data: payload?.data?.data?.data,
          total: payload?.data?.data?.total,
          per_page: payload?.data?.data?.per_page,
          from: payload?.data?.data?.from,
          current_page: payload?.data?.data?.current_page,
          last_page: payload?.data?.data?.last_page,
        },
      };
    }

    case TaskTypes.GET_TASK_LIST_ERROR: {
      return {
        ...state,
        taskList: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
          data: [...state?.taskList?.data],
        },
      };
    }
    case TaskTypes.GET_MY_TASK_LIST_PROGRESS: {
      return {
        ...state,
        myTaskList: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          data: payload?.data?.data?.data,
          total: payload?.data?.data?.total,
          per_page: payload?.data?.data?.per_page,
          from: payload?.data?.data?.from,
          current_page: payload?.data?.data?.current_page,
          last_page: payload?.data?.data?.last_page,
        },
      };
    }
    case TaskTypes.GET_MY_TASK_LIST_SUCCESS: {
      return {
        ...state,
        myTaskList: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          data: payload?.data?.data?.data,
          total: payload?.data?.data?.total,
          per_page: payload?.data?.data?.per_page,
          from: payload?.data?.data?.from,
          current_page: payload?.data?.data?.current_page,
          last_page: payload?.data?.data?.last_page,
        },
      };
    }

    case TaskTypes.GET_MY_TASK_LIST_ERROR: {
      return {
        ...state,
        myTaskList: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
          data: [...state?.myTaskList?.data],
        },
      };
    }
    default:
      return state;
  }
};

export default CRMTaskReducer;
