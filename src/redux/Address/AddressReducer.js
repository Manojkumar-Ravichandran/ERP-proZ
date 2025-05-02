import { DEFAULT_STORE_OBJECT } from "../../contents/Common";
import AddressTypes from "./AddressTypes";

const initialState = {
  shippingAddressList: {
    ...DEFAULT_STORE_OBJECT,
    data: [],
    total: 0,
    per_page: 10,
    from: 1,
    current_page: 1,
    last_page: 0,
  },
  createShippingAddress: { ...DEFAULT_STORE_OBJECT },
  updateShippingAddress: { ...DEFAULT_STORE_OBJECT },
  billingAddressList: {
    ...DEFAULT_STORE_OBJECT,
    data: [],
    total: 0,
    per_page: 10,
    from: 1,
    current_page: 1,
    last_page: 0,
  },
  createBillingAddress: { ...DEFAULT_STORE_OBJECT },
  updateBillingAddress: { ...DEFAULT_STORE_OBJECT },
};

const AddressReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case AddressTypes.CREATE_SHIPPING_ADDRESS_PROGRESS: {
      return {
        ...state,
        createShippingAddress: {
          ...DEFAULT_STORE_OBJECT,
          progressing: true,
          data: {},
        },
      };
    }
    case AddressTypes.CREATE_SHIPPING_ADDRESS_SUCCESS: {
      return {
        ...state,
        createShippingAddress: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          ...payload,
        },
      };
    }
    case AddressTypes.CREATE_SHIPPING_ADDRESS_ERROR: {
      return {
        ...state,
        createShippingAddress: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
        },
      };
    }
    case AddressTypes.CREATE_SHIPPING_ADDRESS_RESET: {
      return {
        ...state,
        createShippingAddress: {
          ...DEFAULT_STORE_OBJECT,
          success: false,
          error: false,
          data: [],
          message: "",
        },
      };
    }
    case AddressTypes.GET_SHIPPING_ADDRESS_PROGRESS: {
      return {
        ...state,
        shippingAddressList: {
          ...DEFAULT_STORE_OBJECT,
          progressing: true,
          ...state.shippingAddressList,
        },
      };
    }
    case AddressTypes.GET_SHIPPING_ADDRESS_SUCCESS: {
      return {
        ...state,
        shippingAddressList: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          data: [...payload?.data?.data],
          total: payload?.data?.total,
          per_page: payload?.data?.per_page,
          from: payload?.data?.from,
          current_page: payload?.data?.current_page,
          last_page: payload?.data?.last_page,
        },
      };
    }
    case AddressTypes.GET_SHIPPING_ADDRESS_ERROR: {
      return {
        ...state,
        shippingAddressList: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
          data: state?.data,
        },
      };
    }
    case AddressTypes.UPDATE_SHIPPING_ADDRESS_PROGRESS: {
      return {
        ...state,
        updateShippingAddress: {
          ...DEFAULT_STORE_OBJECT,
          progressing: true,
          ...payload,
        },
      };
    }
    case AddressTypes.UPDATE_SHIPPING_ADDRESS_SUCCESS: {
      return {
        ...state,
        updateShippingAddress: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          ...payload,
        },
      };
    }
    case AddressTypes.UPDATE_SHIPPING_ADDRESS_ERROR: {
      return {
        ...state,
        updateShippingAddress: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
        },
      };
    }
    case AddressTypes.UPDATE_SHIPPING_ADDRESS_RESET: {
      return {
        ...state,
        updateShippingAddress: {
          ...DEFAULT_STORE_OBJECT,
          success: false,
          error: false,
          data: [],
          message: "",
        },
      };
    }

    case AddressTypes.CREATE_BILLING_ADDRESS_PROGRESS: {
      return {
        ...state,
        createBillingAddress: {
          ...DEFAULT_STORE_OBJECT,
          progressing: true,
          data: {},
        },
      };
    }
    case AddressTypes.CREATE_BILLING_ADDRESS_SUCCESS: {
      return {
        ...state,
        createBillingAddress: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          ...payload,
        },
      };
    }
    case AddressTypes.CREATE_BILLING_ADDRESS_ERROR: {
      return {
        ...state,
        createBillingAddress: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
        },
      };
    }
    case AddressTypes.CREATE_BILLING_ADDRESS_RESET: {
      return {
        ...state,
        createBillingAddress: {
          ...DEFAULT_STORE_OBJECT,
          success: false,
          error: false,
          data: [],
          message: "",
        },
      };
    }
    case AddressTypes.GET_BILLING_ADDRESS_PROGRESS: {
      return {
        ...state,
        billingAddressList: {
          ...DEFAULT_STORE_OBJECT,
          progressing: true,
          ...state.shippingAddressList,
        },
      };
    }
    case AddressTypes.GET_BILLING_ADDRESS_SUCCESS: {
      return {
        ...state,
        billingAddressList: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          data: [...payload?.data?.data],
          total: payload?.data?.total,
          per_page: payload?.data?.per_page,
          from: payload?.data?.from,
          current_page: payload?.data?.current_page,
          last_page: payload?.data?.last_page,
        },
      };
    }
    case AddressTypes.GET_BILLING_ADDRESS_ERROR: {
      return {
        ...state,
        billingAddressList: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
          data: [...state?.data],
        },
      };
    }
    case AddressTypes.UPDATE_BILLING_ADDRESS_PROGRESS: {
      return {
        ...state,
        updateBillingAddress: {
          ...DEFAULT_STORE_OBJECT,
          progressing: true,
          ...payload,
        },
      };
    }
    case AddressTypes.UPDATE_BILLING_ADDRESS_SUCCESS: {
      return {
        ...state,
        updateBillingAddress: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          ...payload,
        },
      };
    }
    case AddressTypes.UPDATE_BILLING_ADDRESS_ERROR: {
      return {
        ...state,
        updateBillingAddress: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
        },
      };
    }
    case AddressTypes.UPDATE_BILLING_ADDRESS_RESET: {
      return {
        ...state,
        updateBillingAddress: {
          ...DEFAULT_STORE_OBJECT,
          success: false,
          error: false,
          data: [],
          message: "",
        },
      };
    }

    default:
      return state;
  }
};

export default AddressReducer;
