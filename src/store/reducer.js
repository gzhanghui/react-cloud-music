import { combineReducers } from 'redux-immutable'
import { reducer as recommendReducer } from '@/views/recommend/store'
import { reducer as playerReducer } from '@/components/player/store'
import { reducer as songListReducer } from '@/components/player/store'

export default combineReducers({
    recommend: recommendReducer,
    player: playerReducer,
    list: songListReducer
})