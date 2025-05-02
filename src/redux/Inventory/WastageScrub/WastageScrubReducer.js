import {
  WASTAGESCRUB_CREATE,
  WASTAGESCRUB_UPDATE,
  WASTAGESCRUB_FETCH,
  WASTAGESCRUB_SUCCESS,
  WASTAGESCRUB_FAILURE,
  WASTAGESCRUB_DELETE
} from "./WastageScrubTypes";

const initialState = {
  inventory: [],
  pagination: { current_page: 1, last_page: 1, total: 0 },
  error: null,
};

const WastageScrubReducer = (state = initialState, action) => {
  switch (action.type) {
    case WASTAGESCRUB_CREATE:
    case WASTAGESCRUB_UPDATE:
    case WASTAGESCRUB_DELETE:
    case WASTAGESCRUB_FETCH:
      return { ...state };

    case WASTAGESCRUB_SUCCESS:
      return {
        ...state,
        inventory: action.payload?.inventoryData || [], 
        pagination: action.payload?.pagination || { current_page: 1, last_page: 1, total: 0 },
      };

    case WASTAGESCRUB_FAILURE:
      return { 
        ...state, 
        error: action.payload || "Failed to fetch inventory"  
      };

    default:
      return state;
  }
};

export default WastageScrubReducer;
