import MaterialSubCatTypes from "./SubCategoryTypes";

export const createMatSubCategoryInprogress =(payload)=>{
    return{type:MaterialSubCatTypes.CREATE_MAT_SUBCATEGORY_PROGRESS,payload}
}
export const createMatSubCategoryInSuccess =(payload)=>{
    return{type:MaterialSubCatTypes.CREATE_MAT_SUBCATEGORY_SUCCESS,payload}
}
export const createMatSubCategoryInError =(payload)=>{
    return{type:MaterialSubCatTypes.CREATE_MAT_SUBCATEGORY_ERROR,payload}
}
export const createMatSubCategoryInReset =(payload)=>{
    return{type:MaterialSubCatTypes.CREATE_MAT_SUBCATEGORY_RESET,payload}
}

export const getMatSubCategoryInprogress =(payload)=>{
return{type:MaterialSubCatTypes.GET_MAT_SUBCATEGORY_PROGRESS,payload}
}
export const getMatSubCategoryInSuccess =(payload)=>{
    return{type:MaterialSubCatTypes.GET_MAT_SUBCATEGORY_SUCCESS,payload}
}
export const getMatSubCategoryInError =(payload)=>{
    return{type:MaterialSubCatTypes.GET_MAT_SUBCATEGORY_ERROR,payload}
}

export const updateMatSubCategoryInprogress =(payload)=>{
    console.log(payload)
return{type:MaterialSubCatTypes.UPDATE_MAT_SUBCATEGORY_PROGRESS,payload}
}
export const updateMatSubCategoryInSuccess =(payload)=>{
    return{type:MaterialSubCatTypes.UPDATE_MAT_SUBCATEGORY_SUCCESS,payload}
}
export const updateMatSubCategoryInError =(payload)=>{
    return{type:MaterialSubCatTypes.UPDATE_MAT_SUBCATEGORY_ERROR,payload}
}

export const updateMatSubCategoryInReset =(payload)=>{
    return{type:MaterialSubCatTypes.UPDATE_MAT_SUBCATEGORY_RESET,payload}
}

