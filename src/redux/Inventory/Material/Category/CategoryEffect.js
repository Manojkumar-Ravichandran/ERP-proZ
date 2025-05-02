import axios from "axios";
import { caesarEncrypt } from "../../../../utils/enc_dec"
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../../Interceptors";
import { getUserLocalStorage } from "../../../../utils/utils";

let categoryInstance = axios.create({
    baseURL:`${process.env.REACT_APP_BACKEND_URL}/api/inv`
});
categoryInstance.defaults.headers.common['Content-Type'] = 'application/json';

categoryInstance.interceptors.request.use(
    SetTokenInterceptor,
    (config) => new Promise.reject(config)
  );
  
  categoryInstance.interceptors.response.use(
    (config) => config,
    ExpireTokenInterceptor
  );
  

export const createMaterialCategoryEffect =(datas)=>{
    const data = caesarEncrypt(JSON.stringify(datas));
    return  categoryInstance.request({
        url:"/category-create",
        method:"post",
        data
    })
}
export const getMaterialCategoryEffect =(datas)=>{
    return  categoryInstance.request({
        url:"/category",
        method:"get",
        params:datas,
    })
}
export const updateMaterialCategoryEffect =(datas)=>{
    console.log(datas)
    const data = caesarEncrypt(JSON.stringify(datas));
    console.log(data)
    const token=  getUserLocalStorage();


    return  categoryInstance.request({
        url:"/category-update",
        method:"post",
        headers: {
            Authorization: `Bearer ${token.token}`,
          },
        data
    })
}