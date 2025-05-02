import MaterialCatTypes from "./CategoryTypes";

export const createMatCategoryInprogress =(payload)=>{
    return{type:MaterialCatTypes.CREATE_MAT_CATEGORY_PROGRESS,payload}
}
export const createMatCategoryInSuccess =(payload)=>{
    return{type:MaterialCatTypes.CREATE_MAT_CATEGORY_SUCCESS,payload}
}
export const createMatCategoryInError =(payload)=>{
    return{type:MaterialCatTypes.CREATE_MAT_CATEGORY_ERROR,payload}
}
export const createMatCategoryInReset =(payload)=>{
    return{type:MaterialCatTypes.CREATE_MAT_CATEGORY_RESET,payload}
}

export const getMatCategoryInprogress =(payload)=>{
return{type:MaterialCatTypes.GET_MAT_CATEGORY_PROGRESS,payload}
}
export const getMatCategoryInSuccess =(payload)=>{
    return{type:MaterialCatTypes.GET_MAT_CATEGORY_SUCCESS,payload}
}
export const getMatCategoryInError =(payload)=>{
    return{type:MaterialCatTypes.GET_MAT_CATEGORY_ERROR,payload}
}

export const updateMatCategoryInprogress =(payload)=>{
    console.log(payload)
return{type:MaterialCatTypes.UPDATE_MAT_CATEGORY_PROGRESS,payload}
}
export const updateMatCategoryInSuccess =(payload)=>{
    return{type:MaterialCatTypes.UPDATE_MAT_CATEGORY_SUCCESS,payload}
}
export const updateMatCategoryInError =(payload)=>{
    return{type:MaterialCatTypes.UPDATE_MAT_CATEGORY_ERROR,payload}
}

export const updateMatCategoryInReset =(payload)=>{
    return{type:MaterialCatTypes.UPDATE_MAT_CATEGORY_RESET,payload}
}

