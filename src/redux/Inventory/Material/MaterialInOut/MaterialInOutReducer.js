import {
    MATERIALINOUT_CREATE,
    MATERIALINOUT_UPDATE,
    MATERIALINOUT_FETCH,
    MATERIALINOUT_SUCCESS,
    MATERIALINOUT_FAILURE,
} from "./MaterialInOutTypes";

const initialState = {
  inventory: [],
  pagination: { current_page: 1, last_page: 1, total: 0 },
  error: null,
};

const MaterialInOutReducer = (state = initialState, action) => {
  switch (action.type) {
    case   MATERIALINOUT_CREATE:
    case   MATERIALINOUT_UPDATE:
    case   MATERIALINOUT_FETCH:
      return { ...state };

    case   MATERIALINOUT_SUCCESS:
      return {
        ...state,
        inventory: action.payload?.inventoryData || [], 
        pagination: action.payload?.pagination || { current_page: 1, last_page: 1, total: 0 },
      };

    case   MATERIALINOUT_FAILURE:
      return { 
        ...state, 
        error: action.payload || "Failed to fetch inventory"  
      };

    default:
      return state;
  }
};

export default MaterialInOutReducer;
