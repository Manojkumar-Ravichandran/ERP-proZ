import { all } from "redux-saga/effects";
import authSaga from "./auth/AuthSagas";
import commonSaga from "./common/CommonSagas";
import leadSaga from "./CRM/lead/LeadSagas";
import materialCategorySaga from "./Inventory/Material/Category/CategorySagas";
import materialSubCategorySaga from "./Inventory/Material/SubCategory/SubCategorySagas";
import materialItemSaga from "./Inventory/Material/Item/ItemSagas";
import unitSaga from "./Utils/Unit/UnitSagas";
import vendorSaga from "./Stakeholders/Vendor/VendorSagas";
import MasterSaga from "./Inventory/Master/MasterSagas";
import AddressSaga from "./Address/AddressSagas";
import MaterialInOutSagas from "./Inventory/Material/MaterialInOut/MaterialInOutSagas";
import StockEntrySagas from "./Inventory/StockEntry/StockEntrySagas";
import AssetsSagas from "./Inventory/Assets/AssetsSagas";
import MaterialTransferSagas from "./Inventory/MaterialTransfer/MaterialTransferSagas";
import customerSaga from "./CRM/Customer/CustomerSagas";
import ActivityQuerySagas from "./Utils/ActivityQuery/ActivityQuerySagas";
import ReasonSagas from "./Utils/Reason/ReasonSagas";
import WastageScrubSagas from "./Inventory/WastageScrub/WastageScrubSagas";
import MaterialRequestSagas from "./Inventory/MaterialRequest/MaterialRequestSagas";
import crmTaskSaga from "./CRM/Task/TaskSagas";
// import saleQuotationSaga from "./Account/Sales/SaleQuotation/SaleQuotationSagas";

export default function* rootSaga(){
    yield all([
        commonSaga(),
        authSaga(),
        crmTaskSaga(),
        leadSaga(),
        customerSaga(),
        materialCategorySaga(),
        materialSubCategorySaga(),
        materialItemSaga(),
        unitSaga(),
        vendorSaga(),
        MasterSaga(),
        AddressSaga(),
        MaterialInOutSagas(),
        StockEntrySagas(),
        AssetsSagas(),
        MaterialTransferSagas(),
        ActivityQuerySagas(),
        ReasonSagas(),
        WastageScrubSagas(),
        MaterialRequestSagas(),
        // saleQuotationSaga()
    ])
}