import {
  INVENTORYMASTER_CREATE,
  INVENTORYMASTER_UPDATE,
  INVENTORYMASTER_FETCH,
  INVENTORYMASTER_SUCCESS,
  INVENTORYMASTER_FAILURE,
  INVENTORYMASTER_DELETE
} from "./MasterTypes";

const initialState = {
  inventory: [],
  pagination: { current_page: 1, last_page: 1, total: 0 },
  error: null,
};

const MasterReducer = (state = initialState, action) => {
  switch (action.type) {
    case INVENTORYMASTER_CREATE:
    case INVENTORYMASTER_UPDATE:
    case INVENTORYMASTER_DELETE:
    case INVENTORYMASTER_FETCH:
      return { ...state };

    case INVENTORYMASTER_SUCCESS:
      return {
        ...state,
        inventory: action.payload?.inventoryData || [], 
        pagination: action.payload?.pagination || { current_page: 1, last_page: 1, total: 0 },
      };

    case INVENTORYMASTER_FAILURE:
      return { 
        ...state, 
        error: action.payload || "Failed to fetch inventory"  
      };

    default:
      return state;
  }
};

export default MasterReducer;
