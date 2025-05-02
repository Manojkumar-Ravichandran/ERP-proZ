import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../Interceptors";
import { caesarEncrypt } from "../../../utils/enc_dec";
import { takeLatest, call, put } from "redux-saga/effects";
import { AssetsSuccess, AssetsFailure, returnLendAssets } from "./AssetsAction";
import {
  ASSETS_CREATE,
  ASSETS_UPDATE,
  ASSETS_FETCH,
  ASSETS_DELETE,
  ASSETS_LEND_FETCH,
  ASSETS_LEND_CREATE,
  ASSETS_LEND_RETURN
} from "./AssetsTypes";

const AssetsInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/inv`,
  headers: { "Content-Type": "application/json" },
});

AssetsInstance.interceptors.request.use(SetTokenInterceptor, (error) =>
  Promise.reject(error)
);
AssetsInstance.interceptors.response.use((res) => res, ExpireTokenInterceptor);


function* createAssetsSaga(action) {
  try {
    // const encryptedData = caesarEncrypt(JSON.stringify(action.payload));
    const response = yield call(AssetsInstance.post, "/assets-create", action?.payload);
    yield put(AssetsSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(AssetsFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}
function* updateAssetsSaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload)); 
    const response = yield call(AssetsInstance.post, "/assets-update", encryptedData);
    yield put(AssetsSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(AssetsFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

function* fetchAssetsSaga(action) {
  try {
    const { page, per_page,search } = action.payload; 
    const params = { page, per_page,search }; 
    const response = yield call(AssetsInstance.get, "/assets", { params }); 
    
    if (response.data?.status === "success") {
      yield put(AssetsSuccess({
        inventoryData: response.data.data || [], 
        pagination: {
          current_page: response.data.data?.current_page || 1,
          last_page: response.data.data?.last_page || 1,
          total: response.data.data?.total || 0,
        }
      }));
    } else {
      yield put(AssetsFailure("Failed to fetch inventory data"));
    }
  } catch (error) {
    console.error("Error fetching inventory Assets: ", error);  // Debugging log
    yield put(AssetsFailure(error?.message || "Failed to fetch inventory Assets."));
  }
}

function* fetchLendAssetsSaga(action) {
  try {
    const { page, per_page } = action.payload; 
    const params = { page, per_page }; 
    const response = yield call(AssetsInstance.get, "/assets-lendlist", { params }); 
    
    if (response.data?.status === "success") {
      yield put(AssetsSuccess({
        inventoryData: response.data.data || [], 
        pagination: {
          current_page: response.data.data?.current_page || 1,
          last_page: response.data.data?.last_page || 1,
          total: response.data.data?.total || 0,
        }
      }));
    } else {
      yield put(AssetsFailure("Failed to fetch inventory data"));
    }
  } catch (error) {
    console.error("Error fetching inventory Assets: ", error);  // Debugging log
    yield put(AssetsFailure(error?.message || "Failed to fetch inventory Assets."));
  }
}
function* deleteAssetsSaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload));
    const response = yield call(AssetsInstance.post, "/assets-delete", encryptedData);
    yield put(AssetsSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(AssetsFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}
function* createLendAssetsSaga(action) {
  try {
    const encryptedData = (JSON.stringify(action.payload));
    const response = yield call(AssetsInstance.post, "/assets-lend", encryptedData);
    yield put(AssetsSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(AssetsFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}
function* returnLendAssetsSaga(action) {
  try {
    const encryptedData = (JSON.stringify(action.payload));
    const response = yield call(AssetsInstance.post, "/assets-lendreturn", encryptedData);
    yield put(AssetsSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(AssetsFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}
export default function* AssetsSagas() {
  yield takeLatest(ASSETS_CREATE, createAssetsSaga);
  yield takeLatest(ASSETS_UPDATE, updateAssetsSaga);
  yield takeLatest(ASSETS_LEND_CREATE, createLendAssetsSaga);
  yield takeLatest(ASSETS_LEND_RETURN, returnLendAssetsSaga);
  yield takeLatest(ASSETS_FETCH, fetchAssetsSaga);
  yield takeLatest(ASSETS_LEND_FETCH, fetchLendAssetsSaga);
  yield takeLatest(ASSETS_DELETE, deleteAssetsSaga); 
}
