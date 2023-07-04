import { takeEvery, put } from "redux-saga/effects";
import request from "@/common/js/request";
import { catalogueRequest, playlistRequest, highQualityTagsRequest, hotTagsRequest } from "./actions";

import * as constants from "./constants";

function* getPlaylist() {
  try {
    const res = yield request.get("/api/playlist/list", {
      params: {},
    });
    const action = playlistRequest(res.data);
    yield put(action);
  } catch (e) {
    console.log(e);
  }
}

function* getCatalogue() {
  try {
    const res = yield request.get("/api/playlist/catalogue", {
      params: {},
    });
    const action = catalogueRequest(res.data);
    yield put(action);
  } catch (e) {
    console.log(e);
  }
}

function* getHighQualityTags() {
  try {
    const res = yield request.get("/api/playlist/highQuality/tags", {
      params: {},
    });
    const action = highQualityTagsRequest(res.data);
    yield put(action);
  } catch (e) {
    console.log(e);
  }
}

function* getHotTags() {
  try {
    const res = yield request.get("/api/playlist/hotTags", {
      params: {},
    });
    const action = hotTagsRequest(res.data);
    yield put(action);
  } catch (e) {
    console.log(e);
  }
}

function* saga() {
  yield takeEvery(constants.GET_PLAYLIST, getPlaylist);
  yield takeEvery(constants.CATALOGUE, getCatalogue);
  yield takeEvery(constants.HIGH_QUALITY_TAGS, getHighQualityTags);
  yield takeEvery(constants.HOT_TAGS, getHotTags);
}

export default saga;
