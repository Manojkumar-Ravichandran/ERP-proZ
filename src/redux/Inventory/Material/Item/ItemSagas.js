import { call, put, takeLatest } from "redux-saga/effects";
import { createMaterialItemEffect, getMaterialItemEffect, updateMaterialItemEffect } from "./ItemEffect";
import {
  createMatItemInError,
  createMatItemInSuccess,
  getMatItemInError,
  getMatItemInSuccess,
  updateMatItemInError,
  updateMatItemInprogress,
  updateMatItemInSuccess,
} from "./ItemAction";
import { getErrorMessageFromAPI } from "../../../../utils/utils";
import MaterialCatTypes from "./ItemTypes";
import { updateLeadInSuccess } from "../../../CRM/lead/LeadActions";

function* createMaterialItem({ payload: { callback, ...payload } }) {
  try {
    let { data } = yield call(createMaterialItemEffect, payload);
    if (data === 0) {
      throw "Error with code 0";
    }
    yield put(createMatItemInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Item creation failed.";
    yield put(
      createMatItemInError({
        message: errorMsg,
      })
    );
  }
}
function* getMaterialItemList({ payload: { callback, ...payload } }) {
  try {
    const { data } = yield call(getMaterialItemEffect, payload);
    yield put(getMatItemInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Fetch Item list  failed.";
    yield put(
      getMatItemInError({
        message: errorMsg,
      })
    );
  }
}
function* updateMaterialItem({ payload: { callback, ...payload } }) {
  try {
    let { data } = yield call(updateMaterialItemEffect, payload);
    yield put(updateMatItemInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Fetch Item list  failed.";
    yield put(
      updateMatItemInError({
        message: errorMsg,
      })
    );
  }
}

export default function* materialItemSaga(){
    yield takeLatest(MaterialCatTypes.CREATE_MAT_ITEM_PROGRESS, createMaterialItem);
    yield takeLatest(MaterialCatTypes.GET_MAT_ITEM_PROGRESS, getMaterialItemList);
    yield takeLatest(MaterialCatTypes.UPDATE_MAT_ITEM_PROGRESS, updateMaterialItem);
}
