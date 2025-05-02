import { DEFAULT_STORE_OBJECT } from "../../../../contents/Common";
import MaterialCatTypes from "./CategoryTypes";

const initialState = {
  materialCategoryList: {
    ...DEFAULT_STORE_OBJECT,
    data: [],
    total: 0,
    per_page: 10,
    from: 1,
    current_page: 1,
    last_page: 0,
  },
  createCategory: { ...DEFAULT_STORE_OBJECT },
  updateCategory: { ...DEFAULT_STORE_OBJECT },
};

const MaterialCategoryReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case MaterialCatTypes.CREATE_MAT_CATEGORY_PROGRESS: {
      return {
        ...state,
        createCategory: {
          ...DEFAULT_STORE_OBJECT,
          progressing: true,
          data: {},
        },
      };
    }
    case MaterialCatTypes.CREATE_MAT_CATEGORY_SUCCESS: {
      return {
        ...state,
        createCategory: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          ...payload,
        },
      };
    }
    case MaterialCatTypes.CREATE_MAT_CATEGORY_ERROR: {
      return {
        ...state,
        createCategory: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
        },
      };
    }
    case MaterialCatTypes.CREATE_MAT_CATEGORY_RESET: {
      return {
        ...state,
        createCategory: {
          ...DEFAULT_STORE_OBJECT,
          success: false,
          error: false,
          data: [],
          message:""
        },
      };
    }

      case MaterialCatTypes.GET_MAT_CATEGORY_PROGRESS: {
        return {
          ...state,
          materialCategoryList: {
            ...DEFAULT_STORE_OBJECT,
            progressing: true,
            ...state.materialCategoryList
          },
        };
      }
      case MaterialCatTypes.GET_MAT_CATEGORY_SUCCESS: {
        return {
          ...state,
          materialCategoryList: {
            ...DEFAULT_STORE_OBJECT,
            success: true,
            data: [...payload?.data?.data?.data] || [],
            total: payload?.data?.data?.total || 0,
            per_page: payload?.data?.data?.per_page || 10,
            from: payload?.data?.data?.from || 1,
            current_page: payload?.data?.data?.current_page ||1,
            last_page: payload?.data?.data?.last_page||1,
          },
        };
      }
      case MaterialCatTypes.GET_MAT_CATEGORY_ERROR: {
        return {
          ...state,
          materialCategoryList: {
            ...DEFAULT_STORE_OBJECT,
            error: true,
            ...payload,
            data: [...state.data],

          },
        };
      }
      
      case MaterialCatTypes.UPDATE_MAT_CATEGORY_PROGRESS: {
        return {
          ...state,
          updateCategory: {
            ...DEFAULT_STORE_OBJECT,
            progressing: true,
            ...payload
          },
        };
      }
      case MaterialCatTypes.UPDATE_MAT_CATEGORY_SUCCESS: {
        return {
          ...state,
          updateCategory: {
            ...DEFAULT_STORE_OBJECT,
            success: true,
          ...payload,
          },
        };
      }
      case MaterialCatTypes.UPDATE_MAT_CATEGORY_ERROR: {
        return {
          ...state,
          updateCategory: {
            ...DEFAULT_STORE_OBJECT,
            error: true,
            ...payload,

          },
        };
      }

      case MaterialCatTypes.UPDATE_MAT_CATEGORY_RESET: {
        return {
          ...state,
          updateCategory: {
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

export default MaterialCategoryReducer;
