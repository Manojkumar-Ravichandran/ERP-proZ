import { call, put, takeLatest } from "redux-saga/effects";
import {
  createBillingAddressEffect,
  getBillingAddressEffect,
  getShippingAddressEffect,
} from "./AddressEffect";
import {
  createBillingAddressInError,
  createBillingAddressInSuccess,
  getBillingAddressInError,
  getBillingAddressInSuccess,
  getShippingAddressInError,
  getShippingAddressInSuccess,
} from "./AddressAction";
import { getErrorMessageFromAPI } from "../../utils/utils";
import AddressTypes from "./AddressTypes";

function* createBillingAddress({ payload: { callback, ...payload } }) {
  try {
    let { data } = yield call(createBillingAddressEffect, payload);
    if (data === 0) {
      throw "Error with code 0";
    }
    yield put(createBillingAddressInSuccess({ data: data }));
    if (callback) {
      callback(data);
    }
  } catch (e) {
    let errorMsg = getErrorMessageFromAPI(e)
      ? getErrorMessageFromAPI(e)
      : "Category creation failed.";
    yield put(
      createBillingAddressInError({
        message: errorMsg,
      })
    );
  }
}

function* getBillingAddressList({ payload: { callback, ...payload } }) {
  try {
    const { data } = yield call(getBillingAddressEffect);
    yield put(getBillingAddressInSuccess({ ...data }));

    if (callback) {
      callback(data);
    }
  } catch (e) {
    yield put(getBillingAddressInError({ message: getErrorMessageFromAPI(e) }));
  }
}

function* getShippingAddressList({ payload: { callback, ...payload } }) {
  try {
    const { data } = yield call(getShippingAddressEffect);
    yield put(getShippingAddressInSuccess({ ...data }));

    if (callback) {
      callback(data);
    }
  } catch (e) {
    yield put(
      getShippingAddressInError({ message: getErrorMessageFromAPI(e) })
    );
  }
}

export default function* AddressSaga() {
  yield takeLatest(
    AddressTypes.CREATE_BILLING_ADDRESS_PROGRESS,
    createBillingAddress
  );
  yield takeLatest(
    AddressTypes.GET_BILLING_ADDRESS_PROGRESS,
    getBillingAddressList
  );
  yield takeLatest(
    AddressTypes.GET_SHIPPING_ADDRESS_PROGRESS,
    getShippingAddressList
  );
  // yield takeLatest(
  //   AddressTypes.G,
  //   createBillingAddress
  // );
}
