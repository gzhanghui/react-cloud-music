import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";
import * as constants from "./constants";
import { getSearchHotAsync, getSearchSuggestAsync } from "./actions";

function* getSearchHot() {
  try {
    const res = yield axios.get("/api/search/hot");
    const action = getSearchHotAsync(res.data.data);
    yield put(action);
  } catch (e) {
    console.log(e);
  }
}

function* getSearchSuggest(payload) {
  try {
    const res = yield axios.post(`/api/search/suggest`, {
      keywords: payload.payload.keywords,
    });
    const action = getSearchSuggestAsync(res.data.data);
    yield put(action);
  } catch (e) {
    console.log(e);
  }
}

function* mySaga() {
  yield takeEvery(constants.GET_SEARCH_HOT, getSearchHot);
  yield takeEvery(constants.GET_SEARCH_SUGGEST, getSearchSuggest);
}

export default mySaga;
