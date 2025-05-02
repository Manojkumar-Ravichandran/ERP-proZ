import { getUserLocalStorage } from "../utils/utils";
import { initiateLogout } from "./auth/AuthAction";
import store from "./store";
export function ExpireTokenInterceptor(response) {
  if (response?.response?.status === 401) {
    //const notificationAPI = store.getState().common.notificationAPI;
    //   triggerNotification(notificationAPI, {
    //     type: NOTIFICATION_TYPES.ERROR,
    //     title: `Session has expired!, Kindly relogin.`,
    //     key: "SESSION_EXPIRED",
    //   });
    store.dispatch(initiateLogout());
  }
  return Promise.reject(response);
}

export function SetTokenInterceptor(config) {
  const tokenValue = getUserLocalStorage();
  const token = tokenValue.token;
  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }
  return config;
}
