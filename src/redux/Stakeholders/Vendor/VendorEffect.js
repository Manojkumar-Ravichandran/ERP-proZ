import axios from "axios";
import { caesarEncrypt } from "../../../utils/encryption";
import { getUserLocalStorage } from "../../../utils/utils";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../Interceptors";


let vendorInstance = axios.create({
    baseURL:`${process.env.REACT_APP_BACKEND_URL}/api/inv`
});
vendorInstance.defaults.headers.common['Content-Type'] = 'application/json';

vendorInstance.interceptors.request.use(
    SetTokenInterceptor,
    (config) => new Promise.reject(config)
  );
  
  vendorInstance.interceptors.response.use(
    (config) => config,
    ExpireTokenInterceptor
  );
  

export const createVendorEffect =(datas)=>{
    const data = caesarEncrypt(JSON.stringify(datas));
    return  vendorInstance.request({
        url:"/vendor-create",
        method:"post",
        data
    })
}
export const getVendorEffect =(datas)=>{
    return  vendorInstance.request({
        url:"/vendor",
        method:"get",
    })
}
export const updateVendorEffect =(datas)=>{
    console.log(datas)
    const data = caesarEncrypt(JSON.stringify(datas));
    console.log(data)
    const token=  getUserLocalStorage();


    return  vendorInstance.request({
        url:"/vendor-update",
        method:"post",
        headers: {
            Authorization: `Bearer ${token.token}`,
          },
        data
    })
}