import { all } from "redux-saga/effects";
import recommendSaga from "@/views/discover/store/sagas";
import playerSaga from "@/components/player/store/sagas";
import loginSaga from "@/components/login/store/sagas";
import searchSaga from "@/components/search/store/sagas";
import menuSaga from "@/components/menu/store/sagas";
import likeSaga from "@/views/like/store/sagas";
import recordSaga from "@/views/record/store/sagas";
import rankingSaga from "@/views/toplist/store/sagas";
import playlistSaga from "@/views/playlist/store/sagas";

export default function* sagas() {
  yield all([recommendSaga(), playerSaga(), loginSaga(), searchSaga(), menuSaga(), likeSaga(), recordSaga(), rankingSaga(), playlistSaga()]);
}
