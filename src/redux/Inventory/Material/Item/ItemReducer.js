import { DEFAULT_STORE_OBJECT } from "../../../../contents/Common";
import MaterialItemTypes from "./ItemTypes";


const initialState = {
  materialItemList: {
    ...DEFAULT_STORE_OBJECT,
    data: [],
    total: 0,
    per_page: 10,
    from: 1,
    current_page: 1,
    last_page: 0,
  },
  createItem: { ...DEFAULT_STORE_OBJECT },
  updateItem: { ...DEFAULT_STORE_OBJECT },
};

const MaterialItemReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case MaterialItemTypes.CREATE_MAT_ITEM_PROGRESS: {
      return {
        ...state,
        createItem: {
          ...DEFAULT_STORE_OBJECT,
          progressing: true,
          data: {},
        },
      };
    }
    case MaterialItemTypes.CREATE_MAT_ITEM_SUCCESS: {
      return {
        ...state,
        createItem: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          ...payload,
        },
      };
    }
    case MaterialItemTypes.CREATE_MAT_ITEM_ERROR: {
      return {
        ...state,
        createItem: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
        },
      };
    }
    case MaterialItemTypes.CREATE_MAT_ITEM_RESET: {
      return {
        ...state,
        createItem: {
          ...DEFAULT_STORE_OBJECT,
          success: false,
          error: false,
          data: [],
          message:""
        },
      };
    }

      case MaterialItemTypes.GET_MAT_ITEM_PROGRESS: {
        return {
          ...state,
          materialItemList: {
            ...DEFAULT_STORE_OBJECT,
            progressing: true,
            ...state.materialItemList
          },
        };
      }
      case MaterialItemTypes.GET_MAT_ITEM_SUCCESS: {
        return {
          ...state,
          materialItemList: {
            ...DEFAULT_STORE_OBJECT,
            success: true,
            data: [...payload.data.data.data],
            total: payload.data.data.total,
            per_page: payload.data.data.per_page,
            from: payload.data.data.from,
            current_page: payload.data.data.current_page,
            last_page: payload.data.data.last_page,
          },
        };
      }
      case MaterialItemTypes.GET_MAT_ITEM_ERROR: {
        return {
          ...state,
          materialItemList: {
            ...DEFAULT_STORE_OBJECT,
            error: true,
            ...payload,
            data: [...state.data],

          },
        };
      }
      
      case MaterialItemTypes.UPDATE_MAT_ITEM_PROGRESS: {
        return {
          ...state,
          updateItem: {
            ...DEFAULT_STORE_OBJECT,
            progressing: true,
            ...payload
          },
        };
      }
      case MaterialItemTypes.UPDATE_MAT_ITEM_SUCCESS: {
        return {
          ...state,
          updateItem: {
            ...DEFAULT_STORE_OBJECT,
            success: true,
          ...payload,
          },
        };
      }
      case MaterialItemTypes.UPDATE_MAT_ITEM_ERROR: {
        return {
          ...state,
          updateItem: {
            ...DEFAULT_STORE_OBJECT,
            error: true,
            ...payload,

          },
        };
      }

      case MaterialItemTypes.UPDATE_MAT_ITEM_RESET: {
        return {
          ...state,
          updateItem: {
            ...DEFAULT_STORE_OBJECT,
            success: false,
            error: false,
            data: [],
            message:""
          },
        };
      }
      
    default:
      return state;
  }
};

export default MaterialItemReducer;
