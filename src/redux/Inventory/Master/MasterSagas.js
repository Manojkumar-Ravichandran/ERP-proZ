import axios from "axios";
import {
  ExpireTokenInterceptor,
  SetTokenInterceptor,
} from "../../Interceptors";
import { caesarEncrypt } from "../../../utils/enc_dec";
import { takeLatest, call, put, take } from "redux-saga/effects";
import { inventoryMasterSuccess, inventoryMasterFailure } from "./MasterAction";
import {
  INVENTORYMASTER_CREATE,
  INVENTORYMASTER_OVERVIEWITEMLIST,
  INVENTORYMASTER_UPDATE,
  INVENTORYMASTER_FETCH,
  INVENTORYMASTER_OVERVIEWMATERIALLIST,
  INVENTORYMASTER_DELETE,
  INVENTORYMASTER_OVERVIEWASSETSLIST,
  INVENTORYMASTER_DETAIL,
  INVENTORYMASTER_OVERVIEWDETAIL,
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
    const encryptedData = JSON.stringify(action.payload);
    const response = yield call(
      MasterInstance.post,
      "/inventorymaster-create",
      encryptedData
    );
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
    const encryptedData = JSON.stringify(action.payload);
    const response = yield call(
      MasterInstance.post,
      "/inventorymaster-update",
      encryptedData
    );
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
    const { page, per_page,search } = action.payload;
    const params = { page, per_page,search };
    const response = yield call(MasterInstance.get, "/inventorymaster", {
      params,
    });

    if (response.data?.status === "success") {
      
      yield put(
        inventoryMasterSuccess({
          inventoryData: response.data.data || [],
          pagination: {
            current_page: response.data.data?.current_page || 1,
            last_page: response.data.data?.last_page || 1,
            total: response.data.data?.total || 0,
          },
          no_inventory: response?.data?.no_inventory,
          volume_occupied: response?.data?.volume_occupied,
          material_in: response?.data?.material_in,
          material_out: response?.data?.material_out,
          asset_count: response?.data?.asset_count,
        })
      );
    } else {
      yield put(inventoryMasterFailure("Failed to fetch inventory data"));
    }
  } catch (error) {
    console.error("Error fetching inventory master: ", error); // Debugging log
    yield put(
      inventoryMasterFailure(
        error?.message || "Failed to fetch inventory master."
      )
    );
  }
}

function* deleteInventoryMasterSaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload));
    const response = yield call(
      MasterInstance.post,
      "/inventorymaster-delete",
      encryptedData
    );
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
function* inventoryDetailMasterSaga(action) {
  try {
    const uuid = action.payload.uuid;
    if (!uuid) {
      return;
    }
    const response = yield call(
      MasterInstance.post,
      "/inventorymaster-details",
      { uuid }
    );
    yield put({
      type: INVENTORYMASTER_DETAIL,
      payload: response.data,
    });
    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong";
    yield put(inventoryMasterFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

function* inventoryOverViewMasterSaga(action) {
  try {
    const uuid = action.payload.uuid;
    if (!uuid) {
      return;
    }
    const response = yield call(
      MasterInstance.post,
      "/inventorymaster-detailsoverview",
      { uuid }
    );
    yield put({
      type: INVENTORYMASTER_OVERVIEWDETAIL,
      payload: response.data,
    });
    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong";
    yield put(inventoryMasterFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

function* inventoryOverviewItemListMasterSaga(action) {
  try {
    const { uuid, callback } = action.payload;

    if (!uuid) {
      if (callback) callback({ success: false, error: "UUID is required" });
      return;
    }

    const response = yield call(
      MasterInstance.post,
      "/inventorymaster-detailsitem",
      { uuid }
    );

    // Ensure the API returns the expected structure
    if (
      response.data?.status === "success" &&
      Array.isArray(response.data.data?.data)
    ) {
      yield put({
        type: INVENTORYMASTER_OVERVIEWITEMLIST,
        payload: response.data.data.data, // sending only the array of items
      });

      if (callback) {
        callback({ success: true, data: response.data.data.data }); // Pass data back
      }
    } else {
      throw new Error("Invalid API response structure");
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || error.message || "Something went wrong";

    yield put(inventoryMasterFailure(errorMessage));

    if (action.payload?.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

function* inventoryOverviewAssetsListMasterSaga(action) {
  try {
    const { uuid, callback } = action.payload;

    if (!uuid) {
      if (callback) callback({ success: false, error: "UUID is required" });
      return;
    }

    const response = yield call(
      MasterInstance.post,
      "/inventorymaster-detailsassets",
      { uuid }
    );
    if (
      response.data?.status === "success" &&
      Array.isArray(response.data.data?.data)
    ) {
      yield put({
        type: INVENTORYMASTER_OVERVIEWASSETSLIST,
        payload: response.data.data.data,
      });

      if (callback) {
        callback({ success: true, data: response.data.data.data });
      }
    } else {
      throw new Error("Invalid API response structure");
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || error.message || "Something went wrong";

    yield put(inventoryMasterFailure(errorMessage));

    if (action.payload?.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

function* inventoryOverviewMaterialListMasterSaga(action) {
  try {
    const { uuid, callback } = action.payload;

    if (!uuid) {
      if (callback) callback({ success: false, error: "UUID is required" });
      return;
    }

    const response = yield call(
      MasterInstance.post,
      "/inventorymaster-detailsrequest",
      { uuid }
    );
    if (
      response.data?.status === "success" &&
      Array.isArray(response.data.data?.data)
    ) {
      yield put({
        type: INVENTORYMASTER_OVERVIEWMATERIALLIST,
        payload: response.data.data.data,
      });

      if (callback) {
        callback({ success: true, data: response.data.data.data });
      }
    } else {
      throw new Error("Invalid API response structure");
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || error.message || "Something went wrong";

    yield put(inventoryMasterFailure(errorMessage));

    if (action.payload?.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}
export default function* inventoryMasterSagas() {
  yield takeLatest(INVENTORYMASTER_CREATE, createInventoryMasterSaga);
  yield takeLatest(INVENTORYMASTER_UPDATE, updateInventoryMasterSaga);
  yield takeLatest(INVENTORYMASTER_FETCH, fetchInventoryMasterSaga);
  yield takeLatest(INVENTORYMASTER_DELETE, deleteInventoryMasterSaga);
  yield takeLatest(INVENTORYMASTER_DETAIL, inventoryDetailMasterSaga);
  yield takeLatest(INVENTORYMASTER_OVERVIEWDETAIL, inventoryOverViewMasterSaga);
  yield takeLatest(
    INVENTORYMASTER_OVERVIEWITEMLIST,
    inventoryOverviewItemListMasterSaga
  );
  yield takeLatest(
    INVENTORYMASTER_OVERVIEWASSETSLIST,
    inventoryOverviewAssetsListMasterSaga
  );
  yield takeLatest(
    INVENTORYMASTER_OVERVIEWMATERIALLIST,
    inventoryOverviewMaterialListMasterSaga
  );
}
