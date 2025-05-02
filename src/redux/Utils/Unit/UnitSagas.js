import { call, put, takeLatest } from "redux-saga/effects";
import { createUnitEffect, getUnitEffect, updateUnitEffect, createUnitConversionEffect,getUnitConversionEffect,updateUnitConversionEffect,deleteUnitConversionEffect } from "./UnitEffect";
import {
  createUnitInError,
  createUnitInSuccess,
  getUnitInError,
  getUnitInSuccess,
  updateUnitInError,
  updateUnitInprogress,
  updateUnitInSuccess,

  createUnitConversionInError,
  createUnitConversionInSuccess,
  getUnitConversionInError,
  getUnitConversionInSuccess,
  updateUnitConversionInError,
  updateUnitConversionInprogress,
  updateUnitConversionInSuccess,
  deleteUnitConversionInError,
  deleteUnitConversionInSuccess,
  deleteUnitConversionInprogress
} from "./UnitAction";
// getErrorMessageFromAPI
import { getErrorMessageFromAPI } from "../../../utils/utils";
import UnitTypes from "./UnityTypes";

function* createUnit({ payload: { callback, ...payload } }) {
  try {
    let { data } = yield call(createUnitEffect, payload);
    if (data === 0) {
      throw "Error with code 0";
    }
    yield put(createUnitInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Item creation failed.";
    yield put(
      createUnitInError({
        message: errorMsg,
      })
    );
  }
}
function* getUnitList({ payload: { callback, ...payload } }) {
  try {
    const { data } = yield call(getUnitEffect, payload);
    yield put(getUnitInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Fetch Item list  failed.";
    yield put(
      getUnitInError({
        message: errorMsg,
      })
    );
  }
}
function* updateUnit({ payload: { callback, ...payload } }) {
  try {
    let { data } = yield call(updateUnitEffect, payload);
    yield put(updateUnitInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Fetch Item list  failed.";
    yield put(
      updateUnitInError({
        message: errorMsg,
      })
    );
  }
}
function* createUnitConversion({ payload: { callback, ...payload } }) {
  try {
    let { data } = yield call(createUnitConversionEffect, payload);
    if (data === 0) {
      throw new Error("Error with code 0");
    }
    yield put(createUnitConversionInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Unit conversion creation failed.";
    yield put(
      createUnitConversionInError({
        message: errorMsg,
      })
    );
  }
}

function* getUnitConversionList({ payload: { callback, ...payload } }) {
   try {
      const { data } = yield call(getUnitConversionEffect,payload);
      yield put(getUnitConversionInSuccess({ data: data }));
      if (callback) {
        callback(data);
      }
    } catch (e) {
      let errorMsg = getErrorMessageFromAPI(e)
        ? getErrorMessageFromAPI(e)
        : "Fetch Category list  failed.";
      yield put(
        getUnitConversionInError({
          message: errorMsg,
        })
      );
    }
}

function* updateUnitConversionList({ payload: { callback, ...payload } }) {
  try {
    let { data } = yield call(updateUnitConversionEffect, payload);
    yield put(updateUnitConversionInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Fetch Item list  failed.";
    yield put(
      updateUnitConversionInError({
        message: errorMsg,
      })
    );
  }
}

function* deleteUnitConversionProgress({ payload: { callback, ...payload } }) {
  try {
    // Call the delete effect
    const { data } = yield call(deleteUnitConversionEffect, payload);

    // If the data deletion is successful, dispatch the success action
    yield put(deleteUnitConversionInSuccess({ data }));

    // Execute the callback if provided (useful for updates in the UI)
    if (callback) {
      callback(data);
    }
  } catch (e) {
    // Handle any errors during the deletion process
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Unit conversion deletion failed.";

    // Dispatch the error action
    yield put(deleteUnitConversionInError({
      message: errorMsg,
    }));
  }
}

export default function* unitSaga() {
  yield takeLatest(UnitTypes.CREATE_UNIT_CONVERSION_PROGRESS, createUnitConversion);
  yield takeLatest(UnitTypes.GET_UNIT_CONVERSION_PROGRESS, getUnitConversionList);
  yield takeLatest(UnitTypes.UPDATE_UNIT_CONVERSION_PROGRESS, updateUnitConversionList)
  yield takeLatest(UnitTypes.DELETE_UNIT_CONVERSION_PROGRESS,deleteUnitConversionProgress);

  yield takeLatest(UnitTypes.CREATE_UNIT_PROGRESS, createUnit);
  yield takeLatest(UnitTypes.GET_UNIT_PROGRESS, getUnitList);
  yield takeLatest(UnitTypes.UPDATE_UNIT_PROGRESS, updateUnit);
}
