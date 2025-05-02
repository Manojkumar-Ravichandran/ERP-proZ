import VendorTypes from "./VendorTypes"



export const createVendorInprogress =(payload)=>{
    return{type:VendorTypes.CREATE_VENDOR_PROGRESS,payload}
}
export const createVendorInSuccess =(payload)=>{
    return{type:VendorTypes.CREATE_VENDOR_SUCCESS,payload}
}
export const createVendorInError =(payload)=>{
    return{type:VendorTypes.CREATE_VENDOR_ERROR,payload}
}
export const createVendorInReset =(payload)=>{
    return{type:VendorTypes.CREATE_VENDOR_RESET,payload}
}

export const getVendorInprogress =(payload)=>{
return{type:VendorTypes.GET_VENDOR_PROGRESS,payload}
}
export const getVendorInSuccess =(payload)=>{
    console.log(payload)

    return{type:VendorTypes.GET_VENDOR_SUCCESS,payload}
}
export const getVendorInError =(payload)=>{
    return{type:VendorTypes.GET_VENDOR_ERROR,payload}
}

export const updateVendorInprogress =(payload)=>{
    console.log(payload)
return{type:VendorTypes.UPDATE_VENDOR_PROGRESS,payload}
}
export const updateVendorInSuccess =(payload)=>{
    return{type:VendorTypes.UPDATE_VENDOR_SUCCESS,payload}
}
export const updateVendorInError =(payload)=>{
    return{type:VendorTypes.UPDATE_VENDOR_ERROR,payload}
}

export const updateVendorInReset =(payload)=>{
    return{type:VendorTypes.UPDATE_VENDOR_RESET,payload}
}

