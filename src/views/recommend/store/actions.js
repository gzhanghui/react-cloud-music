
import * as constants from './constants'



export const getRecommendPlayListAsync = (playlist) => ({
    type: constants.RECOMMEND_PLAYLIST_ASYNC,
    playlist
})
export const getRecommendPlaylistAction = () => ({
    type: constants.RECOMMEND_PLAYLIST
})

export const getRecommendSongAsync = (songs) => ({
    type: constants.RECOMMEND_SONGS_ASYNC,
    songs
})

export const getRecommendSongsAction = () => ({
    type: constants.RECOMMEND_SONGS
})

export const getBannerAsync = (banner) => ({
    type: constants.GET_BANNER_ASYNC,
    banner
})
export const getBannerAction = () => ({
    type: constants.GET_BANNER
})

export const bannerChangeAction = (bannerIndex) => ({
    type: constants.BANNER_INDEX,
    bannerIndex
})

export const insertSongAction = (insertSong) => ({
    type: constants.INSERT_SONG,
    insertSong
})

