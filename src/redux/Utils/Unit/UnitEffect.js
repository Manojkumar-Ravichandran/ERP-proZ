import axios from "axios";
import { caesarEncrypt } from "../../../utils/encryption";
import { getUserLocalStorage } from "../../../utils/utils";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../Interceptors";


let unitInstance = axios.create({
    baseURL:`${process.env.REACT_APP_BACKEND_URL}/api/inv`
});
unitInstance.defaults.headers.common['Content-Type'] = 'application/json';

unitInstance.interceptors.request.use(
    SetTokenInterceptor,
    (config) => new Promise.reject(config)
  );
  
  unitInstance.interceptors.response.use(
    (config) => config,
    ExpireTokenInterceptor
  );
  

export const createUnitEffect =(datas)=>{
    const data = caesarEncrypt(JSON.stringify(datas));
    return  unitInstance.request({
        url:"/unitmaster-create",
        method:"post",
        data
    })
}
export const getUnitEffect =(datas)=>{
    return  unitInstance.request({
        url:"/unitmaster",
        method:"get",
        params:datas,
    })
}
export const updateUnitEffect =(datas)=>{
    console.log(datas)
    const data = caesarEncrypt(JSON.stringify(datas));
    console.log(data)
    const token=  getUserLocalStorage();


    return  unitInstance.request({
        url:"/unitmaster-update",
        method:"post",
        headers: {
            Authorization: `Bearer ${token.token}`,
          },
        data
    })
}
export const createUnitConversionEffect = (datas) => {
    const data = caesarEncrypt(JSON.stringify(datas)); 
    return unitInstance.request({
        url: "/unitconversion-create",
        method: "post",
        data,
    });
};

export const getUnitConversionEffect = (datas) => {
    return unitInstance.request({
        url: "/unitconversion",
        method: "get",
        params: datas, 
    });
};

export const updateUnitConversionEffect =(datas)=>{
    const data = (JSON.stringify(datas));
    const token=  getUserLocalStorage();
    return  unitInstance.request({
        url:"/unitconversion-update",
        method:"post",
        headers: {
            Authorization: `Bearer ${token.token}`,
          },
        data
    })
}


export const deleteUnitConversionEffect =(datas)=>{
    const data = (JSON.stringify(datas));
    return  unitInstance.request({
        url:"/unitconversion-delete",
        method:"post",
        data
    })
}