import axios from 'axios'
import { takeEvery, put } from 'redux-saga/effects'
import * as constants from './constants'
import { getLyricAsync } from './actions'


function* getLyric(action) {
    try {
        const res = yield axios.get('/api/lyric', { params: { id: action.payload.id } })
        yield put(getLyricAsync(res.data.data));
    } catch (error) {
        console.log('list.json网络请求失败');

    }
}

function* saga() {
    yield takeEvery(constants.GET_LYRIC, getLyric);
}

export default saga;