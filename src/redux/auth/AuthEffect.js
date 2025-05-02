import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../Interceptors";
import { caesarEncrypt } from "../../utils/enc_dec";

const authInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
  });
  authInstance.defaults.headers.common['Content-Type'] = 'application/json';

  authInstance.interceptors.request.use(
    SetTokenInterceptor,
    (config) => new Promise.reject(config)
  );
  
  authInstance.interceptors.response.use(
    (config) => config,
    ExpireTokenInterceptor
  );
  

export const loginEffect = (datas) => {
  const data = caesarEncrypt(JSON.stringify(datas));
  // const data = JSON.parse(data_en)
    return authInstance.request({
      url: "/login",
      method: "post",
      data: data,
    });
  };

  
  export const forgotPasswordEffect = (datas) => {
    const data = caesarEncrypt(JSON.stringify(datas));

    return authInstance.request({
      url: "/forgot-password",
      method: "post",
      data,
    });
  };

  export const verifyforgotPwdOTPEffect = (datas) => {
    const data = caesarEncrypt(JSON.stringify(datas));
    return authInstance.request({
      url: "/verify-otp",
      method: "post",
      data,
    });
  };
  export const verifyforgotPwdChangeEffect = (datas) => {
    const data = caesarEncrypt(JSON.stringify(datas));
    return authInstance.request({
      url: "/forgotpassword-change",
      method: "post",
      data,
    });
  };