
import utils from "./util"
// const prefix = '__react__music__'
const USER_INFO = '__music_user_info__'
const ACCESS_TOKEN = '__music_assess_token__'
const HISTORY_SEARCH = 'history-search'
const HISTORY_PLAYLIST = 'history_playlist'

const { storage } = utils
export const cacheUser = {
    set: function (data) {
        storage.set(USER_INFO, data)
    },
    get: function () {
        return storage.get(USER_INFO)
    }
}


export const cacheAccessToken = {
    set: function (data) {
        storage.set(ACCESS_TOKEN, data)
    },
    get: function () {
        return storage.get(ACCESS_TOKEN)
    }
}


export const cacheSearch = {
    set: function (data) {
        storage.set(HISTORY_SEARCH, data)
    },
    get: function () {
        return storage.get(HISTORY_SEARCH)
    }
}

export const cachePlaylist = {
    set: function (data) {
        storage.set(HISTORY_PLAYLIST, data)
    },
    get: function () {
        return storage.get(HISTORY_PLAYLIST)
    }
}
