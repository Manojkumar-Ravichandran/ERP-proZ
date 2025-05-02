import { DEFAULT_STORE_OBJECT } from "../../../../contents/Common";
import MaterialSubCatTypes from "./SubCategoryTypes";


const initialState = {
  materialSubCategoryList: {
    ...DEFAULT_STORE_OBJECT,
    data: [],
    total: 0,
    per_page: 10,
    from: 1,
    current_page: 1,
    last_page: 0,
  },
  createSubCategory: { ...DEFAULT_STORE_OBJECT },
  updateSubCategory: { ...DEFAULT_STORE_OBJECT },
};

const MaterialSubCategoryReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case MaterialSubCatTypes.CREATE_MAT_SUBCATEGORY_PROGRESS: {
      return {
        ...state,
        createCategory: {
          ...DEFAULT_STORE_OBJECT,
          progressing: true,
          data: {},
        },
      };
    }
    case MaterialSubCatTypes.CREATE_MAT_SUBCATEGORY_SUCCESS: {
      return {
        ...state,
        createCategory: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          ...payload,
        },
      };
    }
    case MaterialSubCatTypes.CREATE_MAT_SUBCATEGORY_ERROR: {
      return {
        ...state,
        createCategory: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
        },
      };
    }
    case MaterialSubCatTypes.CREATE_MAT_SUBCATEGORY_RESET: {
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

      case MaterialSubCatTypes.GET_MAT_SUBCATEGORY_PROGRESS: {
        return {
          ...state,
          materialCategoryList: {
            ...DEFAULT_STORE_OBJECT,
            progressing: true,
            ...state.materialSubCategoryList
          },
        };
      }
      case MaterialSubCatTypes.GET_MAT_SUBCATEGORY_SUCCESS: {
        return {
          ...state,
          materialCategoryList: {
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
      case MaterialSubCatTypes.GET_MAT_SUBCATEGORY_ERROR: {
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
      
      case MaterialSubCatTypes.UPDATE_MAT_SUBCATEGORY_PROGRESS: {
        return {
          ...state,
          updateCategory: {
            ...DEFAULT_STORE_OBJECT,
            progressing: true,
            ...payload
          },
        };
      }
      case MaterialSubCatTypes.UPDATE_MAT_SUBCATEGORY_SUCCESS: {
        return {
          ...state,
          updateCategory: {
            ...DEFAULT_STORE_OBJECT,
            success: true,
          ...payload,
          },
        };
      }
      case MaterialSubCatTypes.UPDATE_MAT_SUBCATEGORY_ERROR: {
        return {
          ...state,
          updateCategory: {
            ...DEFAULT_STORE_OBJECT,
            error: true,
            ...payload,

          },
        };
      }

      case MaterialSubCatTypes.UPDATE_MAT_SUBCATEGORY_RESET: {
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

export default MaterialSubCategoryReducer;
