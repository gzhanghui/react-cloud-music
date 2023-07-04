import request from "@/common/js/request";
import get from "lodash/get";
import { takeEvery, put } from "redux-saga/effects";
import * as constants from "./constants";
import { getLoginStatusAsync, loginAsync, logoutAsync } from "./actions";
import { cacheUser } from "@/common/js/cache";

const cookie = get(cacheUser.get(), "cookie");

export function* getLoginStatus() {
  try {
    const res = yield request.post(`/api/login/status`, { cookie, timestamp: new Date() * 1 });
    let info = get(res, "data.info", {});
    info = { ...info, cookie: get(res, "data.cookie", {}) };
    const action = getLoginStatusAsync(get(res, "data.status", false), info);
    yield put(action);
    return res;
  } catch (e) {
    console.log(e);
  }
}

function* loginPhone(action) {
  const data = { account: action.payload.account, password: action.payload.password, cookie, timestamp: new Date() * 1 };
  try {
    const res = yield request.post(`/api/login/phone`, data);
    const action = loginAsync(get(res, "data.info", {}));
    yield put(action);
  } catch (e) {
    console.log(e);
  }
}

function* logout() {
  try {
    const res = yield request.post(`/api/login/logout`, { cookie, timestamp: new Date() * 1 });
    const action = logoutAsync(get(res, "data.status"));
    yield put(action);
  } catch (e) {
    console.log(e);
  }
}

export default function* saga() {
  // yield takeLatest(constants.LOGIN_STATUS, getLoginStatus);
  yield takeEvery(constants.LOGIN, loginPhone);
  yield takeEvery(constants.LOGOUT, logout);
}
