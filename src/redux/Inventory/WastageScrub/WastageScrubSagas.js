import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../Interceptors";
import { caesarEncrypt } from "../../../utils/enc_dec";
import { takeLatest, call, put } from "redux-saga/effects";
import { WastageScrubSuccess, WastageScrubFailure } from "./WastageScrubAction";
import {
  WASTAGESCRUB_CREATE,
  WASTAGESCRUB_UPDATE,
  WASTAGESCRUB_FETCH,
  WASTAGESCRUB_DELETE,
} from "./WastageScrubTypes";

const WastageScrubInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/inv`,
  headers: { "Content-Type": "application/json" },
});

WastageScrubInstance.interceptors.request.use(SetTokenInterceptor, (error) =>
  Promise.reject(error)
);
WastageScrubInstance.interceptors.response.use((res) => res, ExpireTokenInterceptor);


function* createWastageScrubSaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload));
    const response = yield call(WastageScrubInstance.post, "/wastagescrap-create", encryptedData);
    yield put(WastageScrubSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(WastageScrubFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}
function* updateWastageScrubSaga(action) {
  try {
    const encryptedData = (JSON.stringify(action.payload)); 
    const response = yield call(WastageScrubInstance.post, "/wastagescrap-update", encryptedData);
    yield put(WastageScrubSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(WastageScrubFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

function* fetchWastageScrubSaga(action) {
  try {
    console.log("action.payload",action.payload)
    const { page, per_page,search } = action.payload; 
    console.log(page, per_page,search)
    const params = { page, per_page,search }; 
    const response = yield call(WastageScrubInstance.get, "/wastagescrap", { params }); 
    
    if (response.data?.status === "success") {
      yield put(WastageScrubSuccess({
        inventoryData: response.data.data || [], 
        pagination: {
          current_page: response.data.data?.current_page || 1,
          last_page: response.data.data?.last_page || 1,
          total: response.data.data?.total || 0,
        }
      }));
    } else {
      yield put(WastageScrubFailure("Failed to fetch inventory data"));
    }
  } catch (error) {
    console.error("Error fetching inventory WastageScrub: ", error);  // Debugging log
    yield put(WastageScrubFailure(error?.message || "Failed to fetch inventory WastageScrub."));
  }
}

function* deleteWastageScrubSaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload));
    const response = yield call(WastageScrubInstance.post, "/stockentry-delete", encryptedData);
    yield put(WastageScrubSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(WastageScrubFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

export default function* WastageScrubSagas() {
  yield takeLatest(WASTAGESCRUB_CREATE, createWastageScrubSaga);
  yield takeLatest(WASTAGESCRUB_UPDATE, updateWastageScrubSaga);
  yield takeLatest(WASTAGESCRUB_FETCH, fetchWastageScrubSaga);
  yield takeLatest(WASTAGESCRUB_DELETE, deleteWastageScrubSaga); 
}
