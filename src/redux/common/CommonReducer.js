import { getCurrentLocation } from "../../utils/location";
import CommonTypes from "./CommonTypes";
const initialState = {
  appLoader: true,
  location: {
    location: getCurrentLocation(),
    error: false,
  },
  shippingAddress: {},
  billingAddress: {},
};
const CommonReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CommonTypes.SET_APP_LOADER: {
      return { ...state, appLoader: payload };
    }
    case CommonTypes.SET_LOCATION: {
      return {
        ...state,
        location: {
          location: payload.location,
          error: false,
        },
      };
    }
    case CommonTypes.RESET_LOCATION: {
      return {
        ...state,
        location: {
          location: getCurrentLocation(),
          error: false,
        },
      };
    }
    default:
      return state;
  }
};

export default CommonReducer;
