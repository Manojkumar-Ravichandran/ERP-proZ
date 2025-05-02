import { call, put, takeLatest } from "redux-saga/effects";
import {
  getCustomerListInError, getCustomerListInSuccess, getTaskListInError, getTaskListInSuccess,
  getMyTaskListInError, getMyTaskListInSuccess, setCustomerDetailInError, setCustomerDetailInSuccess
} from "./CustomerActions";
import { customerDetailsEffect, getCustomerListEffect, getTaskListEffect, getMyTaskListEffect } from "./CustomerEffects";
import { getErrorMessageFromAPI } from "../../../utils/utils";
import CustomerTypes from "./CustomerTypes";

function* getCustomerList({ payload: { callback, ...payload } }) {
  try {
    const { data } = yield call(getCustomerListEffect, payload);
    console.log("data", data.data.data)
    yield put(getCustomerListInSuccess({ data: data }));

    if (callback) {
      callback(data);
    }
  } catch (e) {
    yield put(getCustomerListInError({ message: getErrorMessageFromAPI(e) }));
  }
}

function* getCustomerDetail({ payload: { callback, ...payload } }) {
  try {
    const { data } = yield call(customerDetailsEffect, payload);
    yield put(setCustomerDetailInSuccess({ data: data }));

    if (callback) {
      callback(data);
    }
  } catch (e) {
    yield put(setCustomerDetailInError({ message: getErrorMessageFromAPI(e) }));
  }
}

function* getTaskList({ payload: { callback, ...payload } }) {
  try {
    const { data } = yield call(getTaskListEffect, payload);
    console.log("data", data.data)
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
    console.log("data", data.data)
    yield put(getMyTaskListInSuccess({ data: data }));

    if (callback) {
      callback(data);
    }
  } catch (e) {
    yield put(getMyTaskListInError({ message: getErrorMessageFromAPI(e) }));
  }
}
export default function* customerSaga() {
  yield takeLatest(CustomerTypes.GET_CUSTOMER_LIST_PROGRESS, getCustomerList);
  yield takeLatest(CustomerTypes.SET_CUSTOMER_DETAIL_PROGRESS, getCustomerDetail);
  yield takeLatest(CustomerTypes.GET_TASK_LIST_PROGRESS, getTaskList);
  yield takeLatest(CustomerTypes.GET_MYTASK_LIST_PROGRESS, getMyTaskList);
}
