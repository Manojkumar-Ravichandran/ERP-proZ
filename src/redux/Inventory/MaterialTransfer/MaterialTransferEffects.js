import axios from "axios";
import {
  ExpireTokenInterceptor,
  SetTokenInterceptor,
} from "../../Interceptors";
import { getUserLocalStorage } from "../../../utils/utils";
import { handleError } from "../../../utils/ErrorHanler";

const MaterialTransferInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/inv`,
    headers: { "Content-Type": "application/json" },
  });
  
  MaterialTransferInstance.interceptors.request.use(SetTokenInterceptor, (error) =>
    Promise.reject(error)
  );
  MaterialTransferInstance.interceptors.response.use((res) => res, ExpireTokenInterceptor);
  
  

  export const materialTransferImageUploadEffect = async (data) => {
    try {
      const token = getUserLocalStorage();
      const response = await MaterialTransferInstance.request({
        url: "/materialtransfer-imageupload",
        method: "post",
        data: data,
        headers: {
          Authorization: `Bearer ${token.token}`,
          "Content-Type": "multipart/form-data", // Axios handles this automatically, but adding it explicitly is good practice
        },
      });
      return response;
    } catch (error) {
      return handleError(error, "materialTransferImageUploadEffect");
    }
    // getLeadListEffectCancelToken();
  };
  