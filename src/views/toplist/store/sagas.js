import { takeEvery, put } from "redux-saga/effects";
import request from "@/common/js/request";
import { newAlbumRequest } from "./actions";
import * as constants from "./constants";

function* getToplist() {
  try {
    const res = yield request.get("/api/toplist", {
      params: {
        timestamp: new Date() * 1,
      },
    });
    const action = newAlbumRequest(res.data.list);
    yield put(action);
  } catch (e) {
    console.log(e);
  }
}

function* saga() {
  yield takeEvery(constants.TOPLIST_ACTION, getToplist);
}

export default saga;
