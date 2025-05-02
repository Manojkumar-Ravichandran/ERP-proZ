import { takeLatest, call, put, takeEvery, select } from "redux-saga/effects";
import {
  createLeadActivityEffect,
  createLeadEffect,
  deleteLeadEffect,
  getLeadListEffect,
  getLeadSourceListEffect,
  getLeadStageListEffect,
  showLeadEffect,
  updateLeadEffect,
  verifyLeadMobileEffect,
} from "./LeadEffects";
import LeadTypes from "./LeadTypes";
import {
  createLeadActivityInError,
  createLeadActivityInSuccess,
  createLeadInError,
  createLeadInSuccess,
  deleteLeadInError,
  deleteLeadInSuccess,
  getLeadListInError,
  getLeadListInProgress,
  getLeadListInSuccess,
  getLeadSourceListError,
  getLeadSourceListSuccess,
  getLeadStageListError,
  getLeadStageListSuccess,
  leadContactVerifyError,
  leadContactVerifySuccess,
  setLeadDetailInError,
  setLeadDetailInSuccess,
  setLeadList,
  updateLeadInError,
  updateLeadInSuccess,
} from "./LeadActions";
import { getErrorMessageFromAPI } from "../../../utils/utils";

function* createLead({ payload: { callback, ...payload } }) {
  try {
    let { data } = yield call(createLeadEffect, payload);

    if (data === 0) {
      throw "Error with code 0";
    }
    yield put(createLeadInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Shipment creation failed.";
    yield put(
      createLeadInError({
        message: errorMsg,
      })
    );
  }
}

function* getLeadList({ payload: { callback, ...payload } }) {
  try {
    const { data } = yield call(getLeadListEffect, payload);
    yield put(getLeadListInSuccess({ data: data }));

    if (callback) {
      callback(data);
    }
  } catch (e) {
    yield put(getLeadListInError({ message: getErrorMessageFromAPI(e) }));
  }
}
function* getLeadDetail({ payload: { callback, ...payload } }) {
  try {
    const { data } = yield call(showLeadEffect, payload);
    yield put(setLeadDetailInSuccess({ data: data }));

    if (callback) {
      callback(data);
    }
  } catch (e) {
    yield put(setLeadDetailInError({ message: getErrorMessageFromAPI(e) }));
  }
}

function* updateLead({ payload: { callback, ...payload } }) {
  try {
    const { data, status } = yield call(updateLeadEffect, payload);
    if (status === 200) {
      yield put(updateLeadInSuccess({ data: data }));
      if (callback) {
        callback(data);
      }
    } else {
      yield put(
        updateLeadInError({
          message: getErrorMessageFromAPI(data, "Failed to update password"),
        })
      );
    }
  } catch (e) {
    const errorMessage = getErrorMessageFromAPI(e, "Failed to update password");
    yield put(
      updateLeadInError({
        message: errorMessage,
      })
    );
  }
}

function* deleteLead({ payload: { callback, ...payload } }) {
  // const notificationAPI = yield select((state) => state.common.notificationAPI);
  try {
    let { data } = yield call(deleteLeadEffect, payload);

    yield put(
      deleteLeadInSuccess({
        data: data,
      })
    );
    // yield put(setSelectedShipments([]));
    // yield put(setAppLoader(false));
    // yield call(triggerNotification, notificationAPI, {
    //   type: NOTIFICATION_TYPES.SUCCESS,
    //   title: "Shipment deleted successfully.",
    // });
    yield put(setLeadList({ data: [], progressing: true }));
    // yield put(getLeadListInProgress());
    if (callback) {
      callback(data);
    }
  } catch (e) {
    yield put(
      deleteLeadInError({
        message: getErrorMessageFromAPI(e),
      })
    );
    // yield put(setAppLoader(false));
    // yield call(triggerNotification, notificationAPI, {
    //   type: NOTIFICATION_TYPES.SUCCESS,
    //   title: "Failed to delete shipments.",
    // });
  }
}

function* getLeadStageList({ payload: { callback, ...payload } }) {
  try {
    const { data } = yield call(getLeadStageListEffect);
    yield put(getLeadStageListSuccess({ ...data }));

    if (callback) {
      callback(data);
    }
  } catch (e) {
    yield put(getLeadStageListError({ message: getErrorMessageFromAPI(e) }));
  }
}
function* getLeadSourceList({ payload: { callback, ...payload } }) {
  try {
    const { data } = yield call(getLeadSourceListEffect);
    yield put(getLeadSourceListSuccess(data));

    if (callback) {
      callback(data);
    }
  } catch (e) {
    yield put(getLeadSourceListError({ message: getErrorMessageFromAPI(e) }));
  }
}

function* createLeadActivity({ payload: { callback, ...payload } }) {
  try {
    let { data } = yield call(createLeadActivityEffect, payload);

    if (data === 0) {
      throw "Error with code 0";
    }
    yield put(createLeadActivityInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Activity creation failed.";
    yield put(
      createLeadActivityInError({
        message: errorMsg,
      })
    );
  }
}

function* mobileNumberVerify({payload:{callback,...payload}}) {
  try {
    let { data } = yield call(verifyLeadMobileEffect, payload);

    if (data === 0) {
      throw "Error with code 0";
    }
    yield put(leadContactVerifySuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Activity creation failed.";
    yield put(
      leadContactVerifyError({ data: e.data })
    );
    if (callback) {
      callback(e.data);
    }
  }
}

export default function* leadSaga() {
  yield takeLatest(LeadTypes.CREATE_LEAD_PROGRESS, createLead);
  yield takeLatest(LeadTypes.GET_LEAD_LIST_PROGRESS, getLeadList);
  yield takeLatest(LeadTypes.SET_LEAD_UPDATE_PROGRESS, updateLead);
  yield takeLatest(LeadTypes.SET_LEAD_DETAIL_PROGRESS, getLeadDetail);
  yield takeLatest(LeadTypes.DELETE_LEAD_PROGRESS, deleteLead);
  yield takeLatest(LeadTypes.GET_LEAD_STAGE_PROGRESS, getLeadStageList);
  yield takeLatest(LeadTypes.GET_LEAD_SOURCE_PROGRESS, getLeadSourceList);
  yield takeLatest(
    LeadTypes.CREATE_LEAD_ACTIVITY_INPROGRESS,
    createLeadActivity
  );
  yield takeLatest(
    LeadTypes.LEAD_CONTACT_VERIFY_INPROGRESS,
    mobileNumberVerify
  );
}
