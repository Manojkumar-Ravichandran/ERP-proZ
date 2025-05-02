import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../Interceptors";
import { caesarEncrypt } from "../../../utils/enc_dec";
import { takeLatest, call, put } from "redux-saga/effects";
import { MaterialTransferSuccess, MaterialTransferFailure } from "./MaterialTransferAction";
import {
  MATERIALTRANSFER_CREATE,
  MATERIALTRANSFER_UPDATE,
  MATERIALTRANSFER_FETCH,
  MATERIALTRANSFER_DELETE,
} from "./MaterialTransferTypes";

const MaterialTransferInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/inv`,
  headers: { "Content-Type": "application/json" },
});

MaterialTransferInstance.interceptors.request.use(SetTokenInterceptor, (error) =>
  Promise.reject(error)
);
MaterialTransferInstance.interceptors.response.use((res) => res, ExpireTokenInterceptor);


function* createMaterialTransferSaga(action) {
  try {
    const encryptedData = (JSON.stringify(action.payload));
    const response = yield call(MaterialTransferInstance.post, "/materialtransfer-create", encryptedData);
    yield put(MaterialTransferSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(MaterialTransferFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}
function* updateMaterialTransferSaga(action) {
  try {
    // const encryptedData = caesarEncrypt(JSON.stringify(action.payload)); 
    const response = yield call(MaterialTransferInstance.post, "/materialtransfer-update", action.payload);
    yield put(MaterialTransferSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(MaterialTransferFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

function* fetchMaterialTransferSaga(action) {
  try {
    const { page, per_page } = action.payload; 
    const params = { page, per_page }; 
    const response = yield call(MaterialTransferInstance.get, "/materialtransfer", { params }); 
    if (response.data?.status === "success") {
      yield put(MaterialTransferSuccess({
        inventoryData: response.data.data || [], 
        pagination: {
          current_page: response.data.data?.current_page || 1,
          last_page: response.data.data?.last_page || 1,
          total: response.data.data?.total || 0,
        }
      }));
    } else {
      yield put(MaterialTransferFailure("Failed to fetch inventory data"));
    }
  } catch (error) {
    console.error("Error fetching inventory master: ", error);  // Debugging log
    yield put(MaterialTransferFailure(error?.message || "Failed to fetch inventory master."));
  }
}

// function* deleteMaterialTransferSaga(action) {
//   try {
//     const encryptedData = caesarEncrypt(JSON.stringify(action.payload));
//     const response = yield call(MaterialTransferInstance.post, "/MaterialTransfer-delete", encryptedData);
//     yield put(MaterialTransferSuccess(response.data));

//     if (action.payload.callback) {
//       action.payload.callback({ success: true, data: response.data });
//     }
//   } catch (error) {
//     const errorMessage = error?.response?.data?.message;
//     yield put(MaterialTransferFailure(errorMessage));
//     if (action.payload.callback) {
//       action.payload.callback({ success: false, error: errorMessage });
//     }
//   }
// }

export default function* MaterialTransferSagas() {
  yield takeLatest(MATERIALTRANSFER_CREATE, createMaterialTransferSaga);
  yield takeLatest(MATERIALTRANSFER_UPDATE, updateMaterialTransferSaga);
  yield takeLatest(MATERIALTRANSFER_FETCH, fetchMaterialTransferSaga);
  // yield takeLatest(MATERIALTRANSFER_DELETE, deleteMaterialTransferSaga); 
}
