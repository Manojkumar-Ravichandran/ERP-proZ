import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../Interceptors";
import { caesarEncrypt } from "../../../utils/enc_dec";
import { getUserLocalStorage } from "../../../utils/utils";
import { handleError } from "../../../utils/ErrorHanler";

const AssetsInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/inv`,
    headers: { "Content-Type": "application/json" },
  });
  
  AssetsInstance.interceptors.request.use(SetTokenInterceptor, (error) =>
    Promise.reject(error)
  );
  AssetsInstance.interceptors.response.use((res) => res, ExpireTokenInterceptor);
  

  export const assetItemDropEffect = async () => {
    try {
      const token = getUserLocalStorage();
      const response = await AssetsInstance.request({
        url: "/asset-assetmaterial",
        method: "post",
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      return response;
    } catch (error) {
      return handleError(error, "assetItemDropEffect");
    }
    // getLeadListEffectCancelToken();
  };