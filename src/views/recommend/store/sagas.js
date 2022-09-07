import axios from 'axios'
import { takeEvery, put } from 'redux-saga/effects'
import * as constants from './constants'
import { getRecommendPlayListAsync, getRecommendSongAsync, getBannerAsync } from './actions'

function* getPersonalizedList() {
    try {
        const res = yield axios.get('/api/personalized/songList')
        const action = getRecommendPlayListAsync(res.data.data)
        yield put(action);

    } catch (e) {
        console.log('list.json网络请求失败');
    }
}

function* getPersonalizedSongs() {
    try {
        const res = yield axios.get('/api/personalized/songs')
        const action = getRecommendSongAsync(res.data.data)
        yield put(action);
    } catch (error) {
        console.log('list.json网络请求失败');

    }
}

function* getBanner() {
    try {
        const res = yield axios.get('/api/banner')
        const action = getBannerAsync(res.data.data)
        yield put(action);
    } catch (error) {
        console.log('list.json网络请求失败');

    }
}



function* mySaga() {
    yield takeEvery(constants.RECOMMEND_PLAYLIST, getPersonalizedList);
    yield takeEvery(constants.RECOMMEND_SONGS, getPersonalizedSongs);
    yield takeEvery(constants.GET_BANNER, getBanner);
}

export default mySaga;