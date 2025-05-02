import { combineReducers } from "redux";
import AuthReducer from "./auth/AuthReducer";
import CommonReducer from "./common/CommonReducer";
import LeadReducer from "./CRM/lead/LeadReducer";
import MaterialCategoryReducer from "./Inventory/Material/Category/CategoryReducer";
import MaterialSubCategoryReducer from "./Inventory/Material/SubCategory/SubCategoryReducer";
import MaterialItemReducer from "./Inventory/Material/Item/ItemReducer";
import UnitReducer from "./Utils/Unit/UnitReducer";
import VendorReducer from "./Stakeholders/Vendor/VendorReducer";
import MasterReducer from "./Inventory/Master/MasterReducer";
import AddressReducer from "./Address/AddressReducer";
import MaterialInOutReducer from "./Inventory/Material/MaterialInOut/MaterialInOutReducer";
import StockEntryReducer from "./Inventory/StockEntry/StockEntryReducer";
import AssetsReducer from "./Inventory/Assets/AssetsReducer";
import MaterialTransferReducer from "./Inventory/MaterialTransfer/MaterialTransferReducer";
import CustomerReducer from "./CRM/Customer/CustomerReducer";
import ActivityQueryReducer from "./Utils/ActivityQuery/ActivityQueryReducer";
import ReasonReducer from "./Utils/Reason/ReasonReducer";
import WastageScrubReducer from "./Inventory/WastageScrub/WastageScrubReducer";
import MaterialRequestReducer from "./Inventory/MaterialRequest/MaterialRequestReducer";
import CRMTaskReducer from "./CRM/Task/TaskReducer";
// import SaleQuotationReducer from "./Account/Sales/SaleQuotation/SaleQuotationReducer";
const appReducer =combineReducers({
    common:CommonReducer,
    auth:AuthReducer,
    crmTask:CRMTaskReducer,
    lead:LeadReducer,
    customer:CustomerReducer,
    materialCategory:MaterialCategoryReducer,
    materialSubCategory:MaterialSubCategoryReducer,
    materialItem:MaterialItemReducer,
    unitMaster:UnitReducer,
    vendor:VendorReducer,
    inventoryMaster:MasterReducer,
    address:AddressReducer,
    materialInOut:MaterialInOutReducer,
    stockEntry:StockEntryReducer,
    assets:AssetsReducer,
    MaterialTransfer:MaterialTransferReducer,
    activityQuery: ActivityQueryReducer,
    reason: ReasonReducer,
    WastageScrub: WastageScrubReducer,
    MaterialRequest:MaterialRequestReducer,
    // saleQuotation:SaleQuotationReducer
  
});
const rootReducer = (state, action) => {
    if (action.type === "AUTH_TYPES.INITIATE_LOGOUT") {
      return appReducer(undefined, action);
    }
  
    return appReducer(state, action);
  };

  export default rootReducer;   