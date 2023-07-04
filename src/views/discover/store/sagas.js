import request from "@/common/js/request";
import { takeEvery, put } from "redux-saga/effects";
import * as constants from "./constants";
import { playlistRequest, newsongRequest, getBannerRequest, newAlbumRequest } from "./actions";

function* getNewsong() {
  try {
    const res = yield request.get("/api/personalized/newsong");
    const action = newsongRequest(res.data);
    yield put(action);
  } catch (error) {
    console.log(error);
  }
}

function* getNewAlbum() {
  try {
    const res = yield request.get("/api/personalized/new/album", {});
    const action = newAlbumRequest(res.data);
    yield put(action);
  } catch (e) {
    console.log(e);
  }
}

function* getPlaylist() {
  try {
    const res = yield request.get("/api/personalized/playlist");
    const action = playlistRequest(res.data);
    yield put(action);
  } catch (e) {
    console.log(e);
  }
}

function* getBanner() {
  try {
    const res = yield request.get("/api/banner");
    const action = getBannerRequest(res.data);
    yield put(action);
  } catch (error) {
    console.log(error);
  }
}

function* mySaga() {
  yield takeEvery(constants.PERSONALIZED_PLAYLIST, getPlaylist);
  yield takeEvery(constants.PERSONALIZED_NEWSONG, getNewsong);
  yield takeEvery(constants.GET_NEW_ALBUM, getNewAlbum);
  yield takeEvery(constants.GET_BANNER, getBanner);
}

export default mySaga;
