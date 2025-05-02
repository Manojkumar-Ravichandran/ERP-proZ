import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../Interceptors";
import { caesarEncrypt } from "../../../utils/enc_dec";
import { takeLatest, call, put } from "redux-saga/effects";
import { ReasonSuccess, ReasonFailure } from "./ReasonAction";
import {
  REASON_CREATE,
  REASON_UPDATE,
  REASON_FETCH,
  REASON_DELETE,
} from "./ReasonTypes";

const ReasonInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/crm`,
  headers: { "Content-Type": "application/json" },
});

ReasonInstance.interceptors.request.use(SetTokenInterceptor, (error) =>
  Promise.reject(error)
);
ReasonInstance.interceptors.response.use((res) => res, ExpireTokenInterceptor);


function* createReasonSaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload));
    const response = yield call(ReasonInstance.post, "/reason-create", encryptedData);
    yield put(ReasonSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(ReasonFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}
function* updateReasonSaga(action) {
  try {
    const encryptedData = (JSON.stringify(action.payload)); 
    const response = yield call(ReasonInstance.post, "/reason-update", encryptedData);
    yield put(ReasonSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(ReasonFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

function* fetchReasonSaga(action) {
  try {
    const { page, per_page } = action.payload; 
    const params = { page, per_page }; 
    const response = yield call(ReasonInstance.post, "/reason-list", { params }); 
    
    if (response.data?.status === "success") {
      yield put(ReasonSuccess({
        inventoryData: response.data.data || [], 
        pagination: {
          current_page: response.data.data?.current_page || 1,
          last_page: response.data.data?.last_page || 1,
          total: response.data.data?.total || 0,
        }
      }));
    } else {
      yield put(ReasonFailure("Failed to fetch inventory data"));
    }
  } catch (error) {
    console.error("Error fetching inventory Reason: ", error);  // Debugging log
    yield put(ReasonFailure(error?.message || "Failed to fetch inventory Reason."));
  }
}

function* deleteReasonSaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload));
    const response = yield call(ReasonInstance.post, "/reason-delete", encryptedData);
    yield put(ReasonSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(ReasonFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

export default function* ReasonSagas() {
  yield takeLatest(REASON_CREATE, createReasonSaga);
  yield takeLatest(REASON_UPDATE, updateReasonSaga);
  yield takeLatest(REASON_FETCH, fetchReasonSaga);
  yield takeLatest(REASON_DELETE, deleteReasonSaga); 
}
