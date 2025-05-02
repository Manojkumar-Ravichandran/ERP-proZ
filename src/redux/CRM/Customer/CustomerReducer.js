import { DEFAULT_STORE_OBJECT } from "../../../contents/Common";
import CustomerTypes from "./CustomerTypes";
const initialState = {
    customerList: {
      ...DEFAULT_STORE_OBJECT,
      data: [],
      total: 0,
      per_page: 10,
      from: 1,
      current_page: 1,
      last_page: 0,
    },
    customerDetail: { ...DEFAULT_STORE_OBJECT },

}

const CustomerReducer = (state = initialState, { type, payload }) => {
    switch (type) {

    case CustomerTypes.GET_CUSTOMER_LIST_PROGRESS: {
        return {
          ...state,
          customerList: {
            ...DEFAULT_STORE_OBJECT,
            ...state.leadList,
            progressing: true,
          },
        };
      }
  
      case CustomerTypes.GET_CUSTOMER_LIST_SUCCESS: {
        return {
          ...state,
          customerList: {
            ...DEFAULT_STORE_OBJECT,
            success: true,
            data: payload.data.data.data,
            total: payload.data.data.total,
            per_page: payload.data.data.per_page,
            from: payload.data.data.from,
            current_page: payload.data.data.current_page,
            last_page: payload.data.data.last_page,
          },
        };
      }
  
      case CustomerTypes.GET_CUSTOMER_LIST_ERROR: {
        return {
          ...state,
          customerList: {
            ...DEFAULT_STORE_OBJECT,
            error: true,
            ...payload,
            data: [...state.leadList.data],
          },
        };
      }
  
      case CustomerTypes.SET_CUSTOMER_LIST: {
        return {
          ...state,
          customerList: {
            ...DEFAULT_STORE_OBJECT,
            // totalRecords: 0,
            ...state.leadList,
            ...payload,
          },
        };
      }

      case CustomerTypes.SET_CUSTOMER_DETAIL_PROGRESS: {
        return {
          ...state,
          customerDetail: {
            ...DEFAULT_STORE_OBJECT,
            // totalRecords: 0,
            progressing: true,
            ...payload,
          },
        };
      }
      case CustomerTypes.SET_CUSTOMER_DETAIL_SUCCESS: {
        return {
          ...state,
          customerDetail: {
            ...DEFAULT_STORE_OBJECT,
            // totalRecords: 0,
            data: payload.data.customer,
            leadData:payload?.data?.lead_data,
            success: true,
            paylaod :{...payload.data},
          },
        };
      }
      case CustomerTypes.SET_CUSTOMER_DETAIL_ERROR: {
        return {
          ...state,
          customerDetail: {
            ...DEFAULT_STORE_OBJECT,
            error: true,
            ...payload,
          },
        };
      }
      case CustomerTypes.RESET_CUSTOMER_DETAIL: {
        return {
          ...state,
          customerDetail: {
            ...DEFAULT_STORE_OBJECT,
          },
        };
      }

      case CustomerTypes.GET_TASK_LIST_PROGRESS: {
        return {
          ...state,
          customerList: {
            ...DEFAULT_STORE_OBJECT,
            ...state.leadList,
            progressing: true,
          },
        };
      }
      case CustomerTypes.GET_TASK_LIST_SUCCESS: {
        const { data } = payload; 
        return {
          ...state,
          customerList: {
            ...DEFAULT_STORE_OBJECT,
            success: true,
            data: data.data.data, 
            total: data.data.total,
            per_page: data.data.per_page,
            from: data.data.from,
            current_page: data.data.current_page, 
            last_page: data.data.last_page, 
            to:data.data.to
          },
        };
      }
  
      case CustomerTypes.GET_TASK_LIST_ERROR: {
        return {
          ...state,
          customerList: {
            ...DEFAULT_STORE_OBJECT,
            error: true,
            ...payload,
            data: [...state.leadList.data],
          },
        };
      }
      case CustomerTypes.GET_MYTASK_LIST_PROGRESS: {
        return {
          ...state,
          customerList: {
            ...DEFAULT_STORE_OBJECT,
            ...state.leadList,
            progressing: true,
          },
        };
      }
      case CustomerTypes.GET_MYTASK_LIST_SUCCESS: {
        const { data } = payload; 
        return {
          ...state,
          customerList: {
            ...DEFAULT_STORE_OBJECT,
            success: true,
            data: data.data.data, 
            total: data.data.total,
            per_page: data.data.per_page,
            from: data.data.from,
            current_page: data.data.current_page, 
            last_page: data.data.last_page, 
            to:data.data.to
          },
        };
      }
  
      case CustomerTypes.GET_MYTASK_LIST_ERROR: {
        return {
          ...state,
          customerList: {
            ...DEFAULT_STORE_OBJECT,
            error: true,
            ...payload,
            data: [...state.leadList.data],
          },
        };
      }
  

      default:
        return state;
}    
    
}

export default CustomerReducer;