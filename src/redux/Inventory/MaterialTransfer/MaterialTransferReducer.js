import {
  MATERIALTRANSFER_CREATE,
  MATERIALTRANSFER_UPDATE,
  MATERIALTRANSFER_FETCH,
  MATERIALTRANSFER_SUCCESS,
  MATERIALTRANSFER_FAILURE,
  MATERIALTRANSFER_DELETE
} from "./MaterialTransferTypes";

const initialState = {
  inventory: [],
  pagination: { current_page: 1, last_page: 1, total: 0 },
  error: null,
};

const MaterialTransferReducer = (state = initialState, action) => {
  switch (action.type) {
    case MATERIALTRANSFER_CREATE:
    case MATERIALTRANSFER_UPDATE:
    // case MATERIALTRANSFER_DELETE:
    case MATERIALTRANSFER_FETCH:
      return { ...state };

    case MATERIALTRANSFER_SUCCESS:
      return {
        ...state,
        inventory: action.payload?.inventoryData || [], 
        pagination: action.payload?.pagination || { current_page: 1, last_page: 1, total: 0 },
      };

    case MATERIALTRANSFER_FAILURE:
      return { 
        ...state, 
        error: action.payload || "Failed to fetch inventory"  
      };

    default:
      return state;
  }
};

export default MaterialTransferReducer;
