import { DEFAULT_STORE_OBJECT } from "../../../contents/Common";
import VendorTypes from "./VendorTypes";

const initialState = {
    vendorList: {
      ...DEFAULT_STORE_OBJECT,
      data: [],
      total: 0,
      per_page: 10,
      from: 1,
      current_page: 1,
      last_page: 0,
    },
    createVendor: { ...DEFAULT_STORE_OBJECT },
    updateVendor: { ...DEFAULT_STORE_OBJECT },
  };

  const VendorReducer = (state = initialState, { type, payload }) => {
    switch (type) {
      case VendorTypes.CREATE_VENDOR_PROGRESS: {
        return {
          ...state,
          createVendor: {
            ...DEFAULT_STORE_OBJECT,
            progressing: true,
            data: {},
          },
        };
      }
      case VendorTypes.CREATE_VENDOR_SUCCESS: {
        return {
          ...state,
          createVendor: {
            ...DEFAULT_STORE_OBJECT,
            success: true,
            ...payload,
          },
        };
      }
      case VendorTypes.CREATE_VENDOR_ERROR: {
        return {
          ...state,
          createVendor: {
            ...DEFAULT_STORE_OBJECT,
            error: true,
            ...payload,
          },
        };
      }
      case VendorTypes.CREATE_VENDOR_RESET: {
        return {
          ...state,
          createVendor: {
            ...DEFAULT_STORE_OBJECT,
            success: false,
            error: false,
            data: [],
            message:""
          },
        };
      }
  
        case VendorTypes.GET_VENDOR_PROGRESS: {
          return {
            ...state,
            vendorList: {
              ...DEFAULT_STORE_OBJECT,
              progressing: true,
              ...state.vendorList
            },
          };
        }
        case VendorTypes.GET_VENDOR_SUCCESS: {
          return {
            ...state,
            vendorList: {
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
        case VendorTypes.GET_VENDOR_ERROR: {
          return {
            ...state,
            vendorList: {
              ...DEFAULT_STORE_OBJECT,
              error: true,
              ...payload,
              data: [...state.data],
  
            },
          };
        }
        
        case VendorTypes.UPDATE_VENDOR_PROGRESS: {
          return {
            ...state,
            updateVendor: {
              ...DEFAULT_STORE_OBJECT,
              progressing: true,
              ...payload
            },
          };
        }
        case VendorTypes.UPDATE_VENDOR_SUCCESS: {
          return {
            ...state,
            updateVendor: {
              ...DEFAULT_STORE_OBJECT,
              success: true,
            ...payload,
            },
          };
        }
        case VendorTypes.UPDATE_VENDOR_ERROR: {
          return {
            ...state,
            updateVendor: {
              ...DEFAULT_STORE_OBJECT,
              error: true,
              ...payload,
  
            },
          };
        }
  
        case VendorTypes.UPDATE_VENDOR_RESET: {
          return {
            ...state,
            updateVendor: {
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
  
  export default VendorReducer;
  