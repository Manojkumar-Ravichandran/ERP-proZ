import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../../Interceptors";
import { caesarEncrypt } from "../../../../utils/enc_dec";
import { takeLatest, call, put } from "redux-saga/effects";
import { MaterialInOutSuccess, MaterialInOutFailure } from "./MaterialInOutAction";
import {
    MATERIALINOUT_CREATE,
    MATERIALINOUT_UPDATE,
    MATERIALINOUT_FETCH,
} from "./MaterialInOutTypes";

const MasterInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/inv`,
  headers: { "Content-Type": "application/json" },
});

MasterInstance.interceptors.request.use(SetTokenInterceptor, (error) =>
  Promise.reject(error)
);
MasterInstance.interceptors.response.use((res) => res, ExpireTokenInterceptor);


function* createMaterialInOutSaga(action) {
  try {
    const encryptedData = (JSON.stringify(action.payload));
    const response = yield call(MasterInstance.post, "/materialinout-create", encryptedData);
    yield put(MaterialInOutSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(MaterialInOutFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}
function* updateMaterialInOutSaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload)); 
    const response = yield call(MasterInstance.post, "/materialinout-update", encryptedData);
    yield put(MaterialInOutSuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(MaterialInOutFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

// Fetch MaterialInOut Saga
// function* fetchMaterialInOutSaga(action) {
//   try {
//     const { type, page, per_page } = action.payload; // Extract type, page, and per_page from payload
//     const params = { page, per_page };
//     const response = yield call(MasterInstance.get, `/materialinout?type=${type}`, { params });

//     if (response.data?.status === "success") {
//       yield put(
//         MaterialInOutSuccess({
//           inventoryData: response.data.data || [],
//           pagination: {
//             current_page: response.data?.data?.current_page || 1,
//             last_page: response.data?.data?.last_page || 1,
//             total: response.data?.data?.total || 0,
//           },
//         })
//       );
//     } else {
//       yield put(MaterialInOutFailure("Failed to fetch inventory data"));
//     }
//   } catch (error) {
//     const errorMessage = error?.message || "Failed to fetch inventory master.";
//     console.error("Error fetching inventory master: ", error); // Debugging log
//     yield put(MaterialInOutFailure(errorMessage));
//   }
// }
function* fetchMaterialInOutSaga(action) {
  try {
    const { type, page, per_page } = action.payload;
    const params = { page, per_page };
    const response = yield call(MasterInstance.get, `/materialinout?type=${type}`, { params });

    // Destructure response data directly
    const { status, data } = response.data;

    if (status === "success") {
      yield put(MaterialInOutSuccess({
        inventoryData: data || [],
        pagination: {
          current_page: data?.current_page || 1,
          last_page: data?.last_page || 1,
          total: data?.total || 0,
        },
      }));
    } else {
      yield put(MaterialInOutFailure("Failed to fetch inventory data"));
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch inventory master.";
    console.error("Error fetching inventory master: ", error);
    yield put(MaterialInOutFailure(errorMessage));
  }
}


export default function* MaterialInOutSagas() {
  yield takeLatest( MATERIALINOUT_CREATE, createMaterialInOutSaga);
  yield takeLatest( MATERIALINOUT_UPDATE, updateMaterialInOutSaga);
  yield takeLatest( MATERIALINOUT_FETCH, fetchMaterialInOutSaga);
}
