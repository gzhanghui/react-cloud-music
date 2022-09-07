
import { fromJS } from 'immutable'
import * as constants from './constants'
const defaultState = fromJS({
    playlist: [],
    songs: [],
    banner: [],
    bannerIndex: 0
})
export default (state = defaultState, action) => {
    const { type } = action;
    if (type === constants.RECOMMEND_PLAYLIST_ASYNC) {
        return state.set('playlist', action.playlist)
    }

    if (type === constants.RECOMMEND_SONGS_ASYNC) {
        return state.set('songs', action.songs)
    }
    if (type === constants.GET_BANNER_ASYNC) {
        return state.set('banner', action.banner)
    }
    if (type === constants.BANNER_INDEX) {
        return state.set('bannerIndex', action.bannerIndex)
    }
    return state
}