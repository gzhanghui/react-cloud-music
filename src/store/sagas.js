import { all } from 'redux-saga/effects'
import recommendSaga from '@/views/recommend/store/sagas'
import playerSaga from '@/components/player/store/sagas'
export default function* sagas() {
    yield all([recommendSaga(), playerSaga()])
}