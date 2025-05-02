import axios from "axios";
import { caesarEncrypt } from "../../../../utils/enc_dec"
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../../Interceptors";
import { getUserLocalStorage } from "../../../../utils/utils";

let itemInstance = axios.create({
    baseURL:`${process.env.REACT_APP_BACKEND_URL}/api/inv`
});
itemInstance.defaults.headers.common['Content-Type'] = 'application/json';

itemInstance.interceptors.request.use(
    SetTokenInterceptor,
    (config) => new Promise.reject(config)
  );
  
  itemInstance.interceptors.response.use(
    (config) => config,
    ExpireTokenInterceptor
  );
  

export const createMaterialItemEffect =(datas)=>{
    // const data = caesarEncrypt(JSON.stringify(datas));
    return  itemInstance.request({
        url:"/material-create",
        method:"post",
        data:datas
    })
}
export const getMaterialItemEffect =(datas)=>{
    return  itemInstance.request({
        url:"/material",
        method:"get",
        params:datas,
    })
}
export const updateMaterialItemEffect =(datas)=>{
    console.log(datas)
    const data = caesarEncrypt(JSON.stringify(datas));
    console.log(data)
    const token=  getUserLocalStorage();


    return  itemInstance.request({
        url:"/material-update",
        method:"post",
        headers: {
            Authorization: `Bearer ${token.token}`,
          },
        data
    })
}