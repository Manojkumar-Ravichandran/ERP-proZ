import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../Interceptors";
import { caesarEncrypt } from "../../../utils/enc_dec";
import { takeLatest, call, put } from "redux-saga/effects";
import { MaterialRequestSuccess, MaterialRequestFailure } from "./MaterialRequestAction";
import {
  MATERIALREQUEST_CREATE,
  MATERIALREQUEST_UPDATE,
  MATERIALREQUEST_FETCH,
  MATERIALREQUEST_DELETE, MATERIALREQUEST_APPROVE, MATERIALREQUEST_CANCEL,
  MATERIALREQUEST_DECLINE,
} from "./MaterialRequestTypes";

const MaterialRequestInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/inv`,
  headers: { "Content-Type": "application/json" },
});

MaterialRequestInstance.interceptors.request.use(SetTokenInterceptor, (error) =>
  Promise.reject(error)
);
MaterialRequestInstance.interceptors.response.use((res) => res, ExpireTokenInterceptor);


function* createMaterialRequestSaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload));
    const response = yield call(MaterialRequestInstance.post, "/materialrequest-create", encryptedData);
    yield put(MaterialRequestSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(MaterialRequestFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}
function* updateMaterialRequestSaga(action) {
  try {
    const encryptedData = (JSON.stringify(action.payload));
    const response = yield call(MaterialRequestInstance.post, "/materialrequest-update", encryptedData);
    yield put(MaterialRequestSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(MaterialRequestFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

function* fetchMaterialRequestSaga(action) {
  try {
    const { page, per_page,search } = action.payload;
    const params = { page, per_page,search };
    const response = yield call(MaterialRequestInstance.get, "/materialrequest", { params });

    if (response.data?.status === "success") {
      yield put(MaterialRequestSuccess({
        inventoryData: response.data.data || [],
        pagination: {
          current_page: response.data.data?.current_page || 1,
          last_page: response.data.data?.last_page || 1,
          total: response.data.data?.total || 0,
        }
      }));
    } else {
      yield put(MaterialRequestFailure("Failed to fetch inventory data"));
    }
  } catch (error) {
    console.error("Error fetching inventory MaterialRequest: ", error);  // Debugging log
    yield put(MaterialRequestFailure(error?.message || "Failed to fetch inventory MaterialRequest."));
  }
}

function* deleteMaterialRequestSaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload));
    const response = yield call(MaterialRequestInstance.post, "/stockentry-delete", encryptedData);
    yield put(MaterialRequestSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(MaterialRequestFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

function* approveMaterialRequestSaga(action) {
  try {
    const encryptedData = (JSON.stringify(action.payload));
    const response = yield call(MaterialRequestInstance.post, "/materialrequest-approve", encryptedData);
    yield put(MaterialRequestSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(MaterialRequestFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

function* cancelMaterialRequestSaga(action) {
  try {
    const encryptedData = (JSON.stringify(action.payload));
    const response = yield call(MaterialRequestInstance.post, "/materialrequest-cancel", encryptedData);
    yield put(MaterialRequestSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(MaterialRequestFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

function* declineMaterialRequestSaga(action) {
  try {
    const encryptedData = (JSON.stringify(action.payload));
    const response = yield call(MaterialRequestInstance.post, "/materialrequest-decline", encryptedData);
    yield put(MaterialRequestSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(MaterialRequestFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}
export default function* MaterialRequestSagas() {
  yield takeLatest(MATERIALREQUEST_CREATE, createMaterialRequestSaga);
  yield takeLatest(MATERIALREQUEST_UPDATE, updateMaterialRequestSaga);
  yield takeLatest(MATERIALREQUEST_FETCH, fetchMaterialRequestSaga);
  yield takeLatest(MATERIALREQUEST_DELETE, deleteMaterialRequestSaga);
  yield takeLatest(MATERIALREQUEST_APPROVE, approveMaterialRequestSaga);
  yield takeLatest(MATERIALREQUEST_CANCEL, cancelMaterialRequestSaga);
  yield takeLatest(MATERIALREQUEST_DECLINE, declineMaterialRequestSaga);
}
