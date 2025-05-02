import {
  STOCKENTRY_CREATE,
  STOCKENTRY_UPDATE,
  STOCKENTRY_FETCH,
  STOCKENTRY_SUCCESS,
  STOCKENTRY_FAILURE,
  STOCKENTRY_DELETE
} from "./StockEntryTypes";

const initialState = {
  inventory: [],
  pagination: { current_page: 1, last_page: 1, total: 0 },
  error: null,
};

const StockEntryReducer = (state = initialState, action) => {
  switch (action.type) {
    case STOCKENTRY_CREATE:
    case STOCKENTRY_UPDATE:
    case STOCKENTRY_DELETE:
    case STOCKENTRY_FETCH:
      return { ...state };

    case STOCKENTRY_SUCCESS:
      return {
        ...state,
        inventory: action.payload?.inventoryData || [], 
        pagination: action.payload?.pagination || { current_page: 1, last_page: 1, total: 0 },
      };

    case STOCKENTRY_FAILURE:
      return { 
        ...state, 
        error: action.payload || "Failed to fetch inventory"  
      };

    default:
      return state;
  }
};

export default StockEntryReducer;
