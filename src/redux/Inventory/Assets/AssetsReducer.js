import {
  ASSETS_CREATE,
  ASSETS_UPDATE,
  ASSETS_FETCH,
  ASSETS_SUCCESS,
  ASSETS_FAILURE,
  ASSETS_DELETE,
  ASSETS_LEND_FETCH,
  ASSETS_LEND_CREATE,
  ASSETS_LEND_RETURN
} from "./AssetsTypes";

const initialState = {
  inventory: [],
  pagination: { current_page: 1, last_page: 1, total: 0 },
  error: null,
};

const AssetsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ASSETS_CREATE:
    case ASSETS_UPDATE:
    case ASSETS_LEND_CREATE:
    case ASSETS_LEND_RETURN:
    case ASSETS_DELETE:
    case ASSETS_FETCH:
      return { ...state };
      case ASSETS_LEND_FETCH:
        return { ...state };

    case ASSETS_SUCCESS:
      return {
        ...state,
        inventory: action.payload?.inventoryData || [], 
        pagination: action.payload?.pagination || { current_page: 1, last_page: 1, total: 0 },
      };

    case ASSETS_FAILURE:
      return { 
        ...state, 
        error: action.payload || "Failed to fetch inventory"  
      };

    default:
      return state;
  }
};

export default AssetsReducer;
