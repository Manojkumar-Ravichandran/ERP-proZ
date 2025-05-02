import PurchaseTypes from "./PurchaseOrderTypes"

export const createPurchaseOrderInprogress =(payload)=>{
    return{type:PurchaseTypes.CREATE_PURCHASE_ORDER_PROGRESS,payload}
}
export const createPurchaseOrderInSuccess =(payload)=>{
    return{type:PurchaseTypes.CREATE_PURCHASE_ORDER_SUCCESS,payload}
}
export const createPurchaseOrderInError =(payload)=>{
    return{type:PurchaseTypes.CREATE_PURCHASE_ORDER_ERROR,payload}
}
export const createPurchaseOrderInReset =(payload)=>{
    return{type:PurchaseTypes.CREATE_PURCHASE_ORDER_RESET,payload}
}