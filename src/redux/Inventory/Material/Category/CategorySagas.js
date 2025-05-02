import { call, put, takeLatest } from "redux-saga/effects";
import { createMaterialCategoryEffect, getMaterialCategoryEffect, updateMaterialCategoryEffect } from "./CategoryEffect";
import {
  createMatCategoryInError,
  createMatCategoryInSuccess,
  getMatCategoryInError,
  getMatCategoryInSuccess,
  updateMatCategoryInError,
  updateMatCategoryInprogress,
  updateMatCategoryInSuccess,
} from "./CategoryAction";
import { getErrorMessageFromAPI } from "../../../../utils/utils";
import MaterialCatTypes from "./CategoryTypes";
import { updateLeadInSuccess } from "../../../CRM/lead/LeadActions";

function* createMaterialCategory({ payload: { callback, ...payload } }) {
  try {
    let { data } = yield call(createMaterialCategoryEffect, payload);
    if (data === 0) {
      throw "Error with code 0";
    }
    yield put(createMatCategoryInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Category creation failed.";
    yield put(
      createMatCategoryInError({
        message: errorMsg,
      })
    );
  }
}
function* getMaterialCategoryList({ payload: { callback, ...payload } }) {
  try {
    const { data } = yield call(getMaterialCategoryEffect,payload);
    yield put(getMatCategoryInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Fetch Category list  failed.";
    yield put(
      getMatCategoryInError({
        message: errorMsg,
      })
    );
  }
}
function* updateMaterialCategory({ payload: { callback, ...payload } }) {
  try {
    let { data } = yield call(updateMaterialCategoryEffect, payload);
    yield put(updateMatCategoryInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Fetch Category list  failed.";
    yield put(
      updateMatCategoryInError({
        message: errorMsg,
      })
    );
  }
}

export default function* materialCategorySaga(){
    yield takeLatest(MaterialCatTypes.CREATE_MAT_CATEGORY_PROGRESS, createMaterialCategory);
    yield takeLatest(MaterialCatTypes.GET_MAT_CATEGORY_PROGRESS, getMaterialCategoryList);
    yield takeLatest(MaterialCatTypes.UPDATE_MAT_CATEGORY_PROGRESS, updateMaterialCategory);
}
