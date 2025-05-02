import { call, put, takeLatest } from "redux-saga/effects";
import {
  createMaterialSubCategoryEffect,
  getMaterialSubCategoryEffect,
  updateMaterialSubCategoryEffect,
} from "./SubCategoryEffect";
import {
  createMatSubCategoryInError,
  createMatSubCategoryInSuccess,
  getMatSubCategoryInError,
  getMatSubCategoryInSuccess,
  updateMatSubCategoryInError,
  updateMatSubCategoryInSuccess,
} from "./SubCategoryAction";
import { getErrorMessageFromAPI } from "../../../../utils/utils";
import MaterialCatTypes from "./SubCategoryTypes";

function* createMaterialSubCategory({ payload: { callback, ...payload } }) {
  try {
    let { data } = yield call(createMaterialSubCategoryEffect, payload);
    if (data === 0) {
      throw "Error with code 0";
    }
    yield put(createMatSubCategoryInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "SubCategory creation failed.";
    yield put(
      createMatSubCategoryInError({
        message: errorMsg,
      })
    );
  }
}
function* getMaterialSubCategoryList({ payload: { callback, ...payload } }) {
  try {
    const { data } = yield call(getMaterialSubCategoryEffect, payload);
    yield put(getMatSubCategoryInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Fetch SubCategory list  failed.";
    yield put(
      getMatSubCategoryInError({
        message: errorMsg,
      })
    );
  }
}
function* updateMaterialSubCategory({ payload: { callback, ...payload } }) {
  try {
    let { data } = yield call(updateMaterialSubCategoryEffect, payload);
    yield put(updateMatSubCategoryInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Fetch SubCategory list  failed.";
    yield put(
      updateMatSubCategoryInError({
        message: errorMsg,
      })
    );
  }
}

export default function* materialSubCategorySaga() {
  yield takeLatest(
    MaterialCatTypes.CREATE_MAT_SUBCATEGORY_PROGRESS,
    createMaterialSubCategory
  );
  yield takeLatest(
    MaterialCatTypes.GET_MAT_SUBCATEGORY_PROGRESS,
    getMaterialSubCategoryList
  );
  yield takeLatest(
    MaterialCatTypes.UPDATE_MAT_SUBCATEGORY_PROGRESS,
    updateMaterialSubCategory
  );
}
