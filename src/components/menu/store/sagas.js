import request from "@/common/js/request";
import get from "lodash/get";
import { put, call, take } from "redux-saga/effects";

import { getLoginStatus } from "components/login/store/sagas";
import { playlistRequest } from "./actions";
import * as constants from "./constants";

function* getPlaylist(uid, cookie) {
  try {
    const res = yield request.get("/api/user/playlist", {
      params: {
        uid,
        timestamp: new Date() * 1,
        cookie,
      },
    });
    const action = playlistRequest(get(res, "data.playlist", []));
    yield put(action);
  } catch (e) {
    console.log(e);
  }
}

export function* watchRequest() {
  while (true) {
    yield take(constants.INIT_LOGIN_STATUS);
    const res = yield call(getLoginStatus);
    const cookie = get(res, "data.cookie");
    const uid = get(res, "data.info.profile.userId");
    const status = get(res, "data.status");
    if (status) {
      yield call(getPlaylist, uid, cookie);
    }
  }
}

export default watchRequest;
