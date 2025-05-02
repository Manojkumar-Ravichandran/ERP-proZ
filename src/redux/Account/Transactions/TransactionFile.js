import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../Interceptors";
import { getUserLocalStorage } from "../../../utils/utils";
import { handleError } from "../../../utils/ErrorHanler";

const WastageScrubInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/acc`,
    headers: { "Content-Type": "application/json" },
  });
  
  WastageScrubInstance.interceptors.request.use(SetTokenInterceptor, (error) =>
    Promise.reject(error)
  );
  WastageScrubInstance.interceptors.response.use((res) => res, ExpireTokenInterceptor);


  export const CreditUpload= async (data) => {
    try {
      const token = getUserLocalStorage();
      const response = await WastageScrubInstance.request({
        url: "/credit-imageupload",
        method: "post",
        data: data,
        headers: {
          Authorization: `Bearer ${token.token}`,
          "Content-Type": "multipart/form-data", // Axios handles this automatically, but adding it explicitly is good practice
        },
      });
      return response;
    } catch (error) {
      return handleError(error, "updateInventoryMasterEffect");
    }
  };
    export const DebitUpload= async (data) => {
        try {
        const token = getUserLocalStorage();
        const response = await WastageScrubInstance.request({
            url: "/debit-imageupload",
            method: "post",
            data: data,
            headers: {
            Authorization: `Bearer ${token.token}`,
            "Content-Type": "multipart/form-data", // Axios handles this automatically, but adding it explicitly is good practice
            },
        });
        return response;
        } catch (error) {
        return handleError(error, "updateInventoryMasterEffect");
        }
    };
    export const ExpensesUpload= async (data) => {
        try {
        const token = getUserLocalStorage();
        const response = await WastageScrubInstance.request({
            url: "/expenses-imageupload",
            method: "post",
            data: data,
            headers: {
            Authorization: `Bearer ${token.token}`,
            "Content-Type": "multipart/form-data", // Axios handles this automatically, but adding it explicitly is good practice
            },
        });
        return response;
        } catch (error) {
        return handleError(error, "updateInventoryMasterEffect");
        }
    };