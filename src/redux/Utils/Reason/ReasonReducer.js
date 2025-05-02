import {
  REASON_CREATE,
  REASON_UPDATE,
  REASON_FETCH,
  REASON_SUCCESS,
  REASON_FAILURE,
  REASON_DELETE
} from "./ReasonTypes";

const initialState = {
  inventory: [],
  pagination: { current_page: 1, last_page: 1, total: 0 },
  error: null,
};

const ReasonReducer = (state = initialState, action) => {
  switch (action.type) {
    case REASON_CREATE:
    case REASON_UPDATE:
    case REASON_DELETE:
    case REASON_FETCH:
      return { ...state };

    case REASON_SUCCESS:
      return {
        ...state,
        inventory: action.payload?.inventoryData || [], 
        pagination: action.payload?.pagination || { current_page: 1, last_page: 1, total: 0 },
      };

    case REASON_FAILURE:
      return { 
        ...state, 
        error: action.payload || "Failed to fetch inventory"  
      };

    default:
      return state;
  }
};

export default ReasonReducer;
