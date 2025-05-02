import {
  MATERIALREQUEST_CREATE,
  MATERIALREQUEST_UPDATE,
  MATERIALREQUEST_FETCH,
  MATERIALREQUEST_SUCCESS,
  MATERIALREQUEST_FAILURE,
  MATERIALREQUEST_DELETE,
  MATERIALREQUEST_APPROVE,
  MATERIALREQUEST_CANCEL,
  MATERIALREQUEST_DECLINE,
} from "./MaterialRequestTypes";

const initialState = {
  inventory: [],
  pagination: { current_page: 1, last_page: 1, total: 0 },
  error: null,
};

const MaterialRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case MATERIALREQUEST_CREATE:
    case MATERIALREQUEST_APPROVE:
    case MATERIALREQUEST_CANCEL:
    case MATERIALREQUEST_DECLINE:
    case MATERIALREQUEST_UPDATE:
    case MATERIALREQUEST_DELETE:
    case MATERIALREQUEST_FETCH:
      return { ...state };

    case MATERIALREQUEST_SUCCESS:
      return {
        ...state,
        inventory: action.payload?.inventoryData || [], 
        pagination: action.payload?.pagination || { current_page: 1, last_page: 1, total: 0 },
      };

    case MATERIALREQUEST_FAILURE:
      return { 
        ...state, 
        error: action.payload || "Failed to fetch inventory"  
      };

    default:
      return state;
  }
};

export default MaterialRequestReducer;
