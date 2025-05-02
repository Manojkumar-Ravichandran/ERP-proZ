import { DEFAULT_STORE_OBJECT } from "../../../contents/Common";
import PurchaseTypes from "./PurchaseOrderTypes";

const initialState = {
    purchaseOrderList: {
      ...DEFAULT_STORE_OBJECT,
      data: [],
      total: 0,
      per_page: 10,
      from: 1,
      current_page: 1,
      last_page: 0,
    },
    createPurchaseOrder: { ...DEFAULT_STORE_OBJECT },
    updatePurchaseOrder: { ...DEFAULT_STORE_OBJECT },
  };
  

const PurchaseReducer =(state =initialState,{type,payload})=>{
    switch(type){
        case PurchaseTypes.CREATE_PURCHASE_ORDER_PROGRESS: {
            return {
              ...state,
              createPurchaseOrder: {
                ...DEFAULT_STORE_OBJECT,
                progressing: true,
                data: {},
              },
            };
          }
          case PurchaseTypes.CREATE_PURCHASE_ORDER_SUCCESS: {
            return {
              ...state,
              createPurchaseOrder: {
                ...DEFAULT_STORE_OBJECT,
                success: true,
                ...payload,
              },
            };
          }
          case PurchaseTypes.CREATE_PURCHASE_ORDER_ERROR: {
            return {
              ...state,
              createPurchaseOrder: {
                ...DEFAULT_STORE_OBJECT,
                error: true,
                ...payload,
              },
            };
          }
          case PurchaseTypes.CREATE_PURCHASE_ORDER_RESET: {
            return {
              ...state,
              createPurchaseOrder: {
                ...DEFAULT_STORE_OBJECT,
                success: false,
                error: false,
                data: [],
                message:""
              },
            };
          }

        default:
        return state;
    }
}