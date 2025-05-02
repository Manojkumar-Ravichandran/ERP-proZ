import axios from "axios";
import {
  ExpireTokenInterceptor,
  SetTokenInterceptor,
} from "../../Interceptors";
import { getUserLocalStorage } from "../../../utils/utils";
import { handleError } from "../../../utils/ErrorHanler";

const DashboardInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/inv`,
  headers: { "Content-Type": "application/json" },
});

DashboardInstance.interceptors.request.use(SetTokenInterceptor, (error) =>
  Promise.reject(error)
);
DashboardInstance.interceptors.response.use(
  (res) => res,
  ExpireTokenInterceptor
);

export const dashboardEffect = async (data) => {
  try {
    const token = getUserLocalStorage();
    const response = await DashboardInstance.request({
      url: "/inventory-dashboard",
      method: "post",
      data: data,
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response;
  } catch (error) {
    return handleError(error, "dashboardEffect");
  }
  // getLeadListEffectCancelToken();
};