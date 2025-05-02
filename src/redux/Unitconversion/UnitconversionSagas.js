import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../Interceptors";
import { caesarEncrypt } from "../../../utils/enc_dec";
import { takeLatest, call, put } from "redux-saga/effects";
import { inventoryMasterSuccess, inventoryMasterFailure } from "./MasterAction";
import {
  INVENTORYMASTER_CREATE,
  INVENTORYMASTER_UPDATE,
  INVENTORYMASTER_FETCH,
  INVENTORYMASTER_DELETE,
} from "./MasterTypes";

const MasterInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/inv`,
  headers: { "Content-Type": "application/json" },
});

MasterInstance.interceptors.request.use(SetTokenInterceptor, (error) =>
  Promise.reject(error)
);
MasterInstance.interceptors.response.use((res) => res, ExpireTokenInterceptor);


function* createInventoryMasterSaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload));
    const response = yield call(MasterInstance.post, "/inventorymaster-create", encryptedData);
    yield put(inventoryMasterSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(inventoryMasterFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}
function* updateInventoryMasterSaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload)); 
    const response = yield call(MasterInstance.post, "/inventorymaster-update", encryptedData);
    yield put(inventoryMasterSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(inventoryMasterFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

function* fetchInventoryMasterSaga(action) {
  try {
    const { page, per_page } = action.payload; 
    const params = { page, per_page }; 
    const response = yield call(MasterInstance.get, "/inventorymaster", { params }); 
    
    if (response.data?.status === "success") {
      yield put(inventoryMasterSuccess({
        inventoryData: response.data.data || [], 
        pagination: {
          current_page: response.data.data?.current_page || 1,
          last_page: response.data.data?.last_page || 1,
          total: response.data.data?.total || 0,
        }
      }));
    } else {
      yield put(inventoryMasterFailure("Failed to fetch inventory data"));
    }
  } catch (error) {
    console.error("Error fetching inventory master: ", error);  // Debugging log
    yield put(inventoryMasterFailure(error?.message || "Failed to fetch inventory master."));
  }
}

function* deleteInventoryMasterSaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload));
    const response = yield call(MasterInstance.post, "/inventorymaster-delete", encryptedData);
    yield put(inventoryMasterSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(inventoryMasterFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

export default function* inventoryMasterSagas() {
  yield takeLatest(INVENTORYMASTER_CREATE, createInventoryMasterSaga);
  yield takeLatest(INVENTORYMASTER_UPDATE, updateInventoryMasterSaga);
  yield takeLatest(INVENTORYMASTER_FETCH, fetchInventoryMasterSaga);
  yield takeLatest(INVENTORYMASTER_DELETE, deleteInventoryMasterSaga); 
}
