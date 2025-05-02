import { call, put, takeLatest } from "redux-saga/effects";
import { createVendorEffect, getVendorEffect, updateVendorEffect } from "./VendorEffect";
import {
  createVendorInError,
  createVendorInSuccess,
  getVendorInError,
  getVendorInSuccess,
  updateVendorInError,
  updateVendorInprogress,
  updateVendorInSuccess,
} from "./VendorAction";
// getErrorMessageFromAPI
import { getErrorMessageFromAPI } from "../../../utils/utils";
import VendorTypes from "./VendorTypes";


function* createVendor({ payload: { callback, ...payload } }) {
  try {
    let { data } = yield call(createVendorEffect, payload);
    if (data === 0) {
      throw "Error with code 0";
    }
    yield put(createVendorInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Item creation failed.";
    yield put(
      createVendorInError({
        message: errorMsg,
      })
    );
  }
}
function* getVendorList({ payload: { callback, ...payload } }) {
  try {
    const { data } = yield call(getVendorEffect);
    yield put(getVendorInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Fetch Item list  failed.";
    yield put(
      getVendorInError({
        message: errorMsg,
      })
    );
  }
}
function* updateVendor({ payload: { callback, ...payload } }) {
  try {
    let { data } = yield call(updateVendorEffect, payload);
    yield put(updateVendorInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Fetch Item list  failed.";
    yield put(
      updateVendorInError({
        message: errorMsg,
      })
    );
  }
}

export default function* vendorSaga(){
    yield takeLatest(VendorTypes.CREATE_VENDOR_PROGRESS, createVendor);
    yield takeLatest(VendorTypes.GET_VENDOR_PROGRESS, getVendorList);
    yield takeLatest(VendorTypes.UPDATE_VENDOR_PROGRESS, updateVendor);
}
