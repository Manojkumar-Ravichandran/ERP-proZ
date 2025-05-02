import { takeLatest,call,put } from "redux-saga/effects";
import AuthTypes from "./AuthTypes";
import { forgotPasswordEffect, loginEffect } from "./AuthEffect";
import { forgotPasswordInError, forgotPasswordInSuccess, setLoginError, setLoginSuccess } from "./AuthAction";
import { getErrorMessageFromAPI, setUserLocalStorage } from "../../utils/utils";
import { setAppLoader } from "../common/CommonAction";

function* checkLogin({ payload: { callback, ...payload } }) {
    try {
      const { data } = yield call(loginEffect, payload);
    //   data.userGuid = uuidv4();
      // if (data?.twoFactorEnabled === false) {

        yield call(setUserLocalStorage, data);
        yield put(setAppLoader(true));
      // }
      yield put(setLoginSuccess({ data: data }));

      if (callback) {
        callback(data);
      }
    } catch (e) {
      yield put(setLoginError({message:getErrorMessageFromAPI(e)}));
    }
  }
  function* forgotPassword({ payload: { callback, ...payload } }) {
    try {
      const { data } = yield call(forgotPasswordEffect, payload);
      yield put(forgotPasswordInSuccess({ data: data }));
      if (callback) {
        callback(data);
      }
    } catch (e) {
      yield put(forgotPasswordInError({ message: getErrorMessageFromAPI(e) }));
    }
  }
  


  export default function* authSaga() {
    yield takeLatest(AuthTypes.LOGIN_IN_PROGRESS, checkLogin);
    yield takeLatest(AuthTypes.FORGOT_PASSWORD_PROGRESS, forgotPassword);

  }