import { call, put, takeLatest } from "redux-saga/effects";
import {
  getMyTaskListInError,
  getMyTaskListInSuccess,
  getTaskListInError,
  getTaskListInSuccess,
} from "./TaskAction";
import { getMyTaskListEffect, getTaskListEffect } from "./TaskEffect";
import { getErrorMessageFromAPI } from "../../../utils/utils";

function* getLeadList({ payload: { callback, ...payload } }) {
  try {
    const { data } = yield call(getTaskListEffect, payload);
    yield put(getTaskListInSuccess({ data: data }));

    if (callback) {
      callback(data);
    }
  } catch (e) {
    yield put(getTaskListInError({ message: getErrorMessageFromAPI(e) }));
  }
}
function* getMyTaskList({ payload: { callback, ...payload } }) {
  try {
    const { data } = yield call(getMyTaskListEffect, payload);
    yield put(getMyTaskListInSuccess({ data: data }));

    if (callback) {
      callback(data);
    }
  } catch (e) {
    yield put(getMyTaskListInError({ message: getErrorMessageFromAPI(e) }));
  }
}

export default function* crmTaskSaga() {
  yield takeLatest("TASK_TYPE.GET_TASK_LIST_PROGRESS", getLeadList);
  yield takeLatest("TASK_TYPE.GET_MY_TASK_LIST_PROGRESS", getMyTaskList);
}
