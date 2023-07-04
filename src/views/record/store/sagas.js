import { put, call, take } from "redux-saga/effects";

import request from "@/common/js/request";
import { recordRequest } from "./actions";
import get from "lodash/get";
import { LOGIN_STATUS_ASYNC } from "@/components/login/store/constants";

function* getRecord(uid, cookie) {
  try {
    const res = yield request.get("/api/user/record", {
      params: {
        uid,
        timestamp: new Date() * 1,
        cookie,
      },
    });
    const action = recordRequest(res.data);
    yield put(action);
  } catch (e) {
    console.log(e);
  }
}

export function* watchRequest() {
  while (true) {
    const res = yield take(LOGIN_STATUS_ASYNC);
    const cookie = get(res, "payload.userinfo.cookie");
    const uid = get(res, "payload.userinfo.profile.userId");
    yield call(getRecord, uid, cookie);
  }
}

export default watchRequest;
