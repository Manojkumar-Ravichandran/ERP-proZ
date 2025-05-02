import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../Interceptors";
import { caesarEncrypt } from "../../../utils/enc_dec";
import { takeLatest, call, put } from "redux-saga/effects";
import { StockEntrySuccess, StockEntryFailure } from "./StockEntryAction";
import {
  STOCKENTRY_CREATE,
  STOCKENTRY_UPDATE,
  STOCKENTRY_FETCH,
  STOCKENTRY_DELETE,
} from "./StockEntryTypes";

const StockEntryInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/inv`,
  headers: { "Content-Type": "application/json" },
});

StockEntryInstance.interceptors.request.use(SetTokenInterceptor, (error) =>
  Promise.reject(error)
);
StockEntryInstance.interceptors.response.use((res) => res, ExpireTokenInterceptor);


function* createStockEntrySaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload));
    const response = yield call(StockEntryInstance.post, "/stockentry-create", encryptedData);
    yield put(StockEntrySuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(StockEntryFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}
function* updateStockEntrySaga(action) {
  try {
    const encryptedData = (JSON.stringify(action.payload)); 
    const response = yield call(StockEntryInstance.post, "/stockentry-update", encryptedData);
    yield put(StockEntrySuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(StockEntryFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

function* fetchStockEntrySaga(action) {
  try {
    const { page, per_page,search } = action.payload; 
    const params = { page, per_page,search }; 
    const response = yield call(StockEntryInstance.get, "/stockentry", { params }); 
    
    if (response.data?.status === "success") {
      yield put(StockEntrySuccess({
        inventoryData: response.data.data || [], 
        pagination: {
          current_page: response.data.data?.current_page || 1,
          last_page: response.data.data?.last_page || 1,
          total: response.data.data?.total || 0,
        }
      }));
    } else {
      yield put(StockEntryFailure("Failed to fetch inventory data"));
    }
  } catch (error) {
    console.error("Error fetching inventory StockEntry: ", error);  // Debugging log
    yield put(StockEntryFailure(error?.message || "Failed to fetch inventory StockEntry."));
  }
}

function* deleteStockEntrySaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload));
    const response = yield call(StockEntryInstance.post, "/stockentry-delete", encryptedData);
    yield put(StockEntrySuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(StockEntryFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

export default function* StockEntrySagas() {
  yield takeLatest(STOCKENTRY_CREATE, createStockEntrySaga);
  yield takeLatest(STOCKENTRY_UPDATE, updateStockEntrySaga);
  yield takeLatest(STOCKENTRY_FETCH, fetchStockEntrySaga);
  yield takeLatest(STOCKENTRY_DELETE, deleteStockEntrySaga); 
}
