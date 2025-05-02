import { DEFAULT_STORE_OBJECT } from "../../contents/Common";
import AuthTypes from "./AuthTypes";

const initialState = {
    user: { ...DEFAULT_STORE_OBJECT, loginStatus: false },

}

const AuthReducer = (state = initialState, { type, payload }) => {
    switch (type) {
      case AuthTypes.LOGIN_IN_PROGRESS: {
        return {
          ...state,
          user: {
            ...DEFAULT_STORE_OBJECT,
            loginStatus: false,
            progressing: true,
            ...payload,
          },
          selectedCompany: false,
        };
      }
  
      case AuthTypes.LOGIN_IN_SUCCESS: {
        return {
          ...state,
          user: {
            ...DEFAULT_STORE_OBJECT,
            loginStatus: true,
            success: true,
            ...payload,
          },
        };
      }
  
      case AuthTypes.LOGIN_IN_ERROR: {
        return {
          ...state,
          user: {
            ...DEFAULT_STORE_OBJECT,
            loginStatus: false,
            error: true,
            ...payload,
          },
          selectedCompany: false,
        };
      }

      case AuthTypes.FORGOT_PASSWORD_PROGRESS: {
        return {
          ...state,
          forgotPassword: {
            ...DEFAULT_STORE_OBJECT,
            progressing: true,
            ...payload,
          },
        };
      }
  
      case AuthTypes.FORGOT_PASSWORD_SUCCESS: {
        return {
          ...state,
          forgotPassword: {
            ...DEFAULT_STORE_OBJECT,
            success: true,
            ...payload,
          },
        };
      }
  
      case AuthTypes.FORGOT_PASSWORD_ERROR: {
        return {
          ...state,
          forgotPassword: {
            ...DEFAULT_STORE_OBJECT,
            error: true,
            ...payload,
          },
        };
      }
  
      case AuthTypes.RESET_FORGOT_PASSWORD: {
        return {
          ...state,
          forgotPassword: {
            ...DEFAULT_STORE_OBJECT,
          },
        };
      }

      default:
        return state;
    }

};

export default AuthReducer;