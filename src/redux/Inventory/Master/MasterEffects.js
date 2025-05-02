import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../Interceptors";
import { handleError } from "../../../utils/ErrorHanler";
import { getUserLocalStorage } from "../../../utils/utils";

const MasterInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/inv`,
    headers: { "Content-Type": "application/json" },
  });
  
  MasterInstance.interceptors.request.use(SetTokenInterceptor, (error) =>
    Promise.reject(error)
  );
  MasterInstance.interceptors.response.use((res) => res, ExpireTokenInterceptor);

  export const getMaterialRequestEffect = async (data) => {
    
    try {
        const token = getUserLocalStorage();
        const response = await MasterInstance.request({
          url: "/inventorymaster-detailsrequest",
          method: "post",
          data: data,
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        });
        return response;
      } catch (error) {
        return handleError(error, "getMaterialRequestEffect");
      }
}

export const getTransactionEffect = async (data) => {
    
    try {
        const token = getUserLocalStorage();
        const response = await MasterInstance.request({
          url: "/inventorymaster-detailstransaction",
          method: "post",
          data: data,
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        });
        return response;
      } catch (error) {
        return handleError(error, "getTransactionEffect");
      }
}