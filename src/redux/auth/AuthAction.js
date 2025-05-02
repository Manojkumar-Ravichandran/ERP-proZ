import AuthTypes from "./AuthTypes";

export const checkLogin = (payload) =>({
    type: AuthTypes.LOGIN_IN_PROGRESS,
    payload,
  });
  
  export const setLoginSuccess = (payload) => ({
    type: AuthTypes.LOGIN_IN_SUCCESS,
    payload,
  });
  
  export const setLoginError = (payload) => ({
    type: AuthTypes.LOGIN_IN_ERROR,
    payload,
  });

  export const initiateLogout = () => ({
    type: AuthTypes.INITIATE_LOGOUT,
  });
  
  export const forgotPasswordInProgress = (payload) => (
    {
    type: AuthTypes.FORGOT_PASSWORD_PROGRESS,
    payload,
  });
  
  export const forgotPasswordInSuccess = (payload) => ({
    type: AuthTypes.FORGOT_PASSWORD_SUCCESS,
    payload,
  });
  
  export const forgotPasswordInError = (payload) => ({
    type: AuthTypes.FORGOT_PASSWORD_ERROR,
    payload,
  });
  
  export const resetForgotPassword = (payload) => ({
    type: AuthTypes.RESET_FORGOT_PASSWORD,
    payload,
  });
  