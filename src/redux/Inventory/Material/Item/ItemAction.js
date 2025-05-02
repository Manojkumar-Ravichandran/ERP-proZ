import MaterialCatTypes from "./ItemTypes";

export const createMatItemInprogress =(payload)=>{
    return{type:MaterialCatTypes.CREATE_MAT_ITEM_PROGRESS,payload}
}
export const createMatItemInSuccess =(payload)=>{
    return{type:MaterialCatTypes.CREATE_MAT_ITEM_SUCCESS,payload}
}
export const createMatItemInError =(payload)=>{
    return{type:MaterialCatTypes.CREATE_MAT_ITEM_ERROR,payload}
}
export const createMatItemInReset =(payload)=>{
    return{type:MaterialCatTypes.CREATE_MAT_ITEM_RESET,payload}
}

export const getMatItemInprogress =(payload)=>{
return{type:MaterialCatTypes.GET_MAT_ITEM_PROGRESS,payload}
}
export const getMatItemInSuccess =(payload)=>{
    return{type:MaterialCatTypes.GET_MAT_ITEM_SUCCESS,payload}
}
export const getMatItemInError =(payload)=>{
    return{type:MaterialCatTypes.GET_MAT_ITEM_ERROR,payload}
}

export const updateMatItemInprogress =(payload)=>{
    console.log(payload)
return{type:MaterialCatTypes.UPDATE_MAT_ITEM_PROGRESS,payload}
}
export const updateMatItemInSuccess =(payload)=>{
    return{type:MaterialCatTypes.UPDATE_MAT_ITEM_SUCCESS,payload}
}
export const updateMatItemInError =(payload)=>{
    return{type:MaterialCatTypes.UPDATE_MAT_ITEM_ERROR,payload}
}

export const updateMatItemInReset =(payload)=>{
    return{type:MaterialCatTypes.UPDATE_MAT_ITEM_RESET,payload}
}

