import axios from "axios";
import { caesarEncrypt } from "../../../../utils/enc_dec"
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../../Interceptors";
import { getUserLocalStorage } from "../../../../utils/utils";

let subCategoryInstance = axios.create({
    baseURL:`${process.env.REACT_APP_BACKEND_URL}/api/inv`
});
subCategoryInstance.defaults.headers.common['Content-Type'] = 'application/json';

subCategoryInstance.interceptors.request.use(
    SetTokenInterceptor,
    (config) => new Promise.reject(config)
  );
  
  subCategoryInstance.interceptors.response.use(
    (config) => config,
    ExpireTokenInterceptor
  );
  

export const createMaterialSubCategoryEffect =(datas)=>{
    console.log("create",datas)

    const data = caesarEncrypt(JSON.stringify(datas));
    return  subCategoryInstance.request({
        url:"/subcategory-create",
        method:"post",
        data
    })
}
export const getMaterialSubCategoryEffect =(datas)=>{
    return  subCategoryInstance.request({
        url:"/subcategory",
        method:"get",
        params:datas,
    })
}
export const updateMaterialSubCategoryEffect =(datas)=>{
    console.log(datas)
    const data = caesarEncrypt(JSON.stringify(datas));
    console.log(data)
    const token=  getUserLocalStorage();


    return  subCategoryInstance.request({
        url:"/subcategory-update",
        method:"post",
        headers: {
            Authorization: `Bearer ${token.token}`,
          },
        data
    })
}