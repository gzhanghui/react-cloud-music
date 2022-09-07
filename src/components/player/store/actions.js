
import * as constants from './constants'

export const screenAction = () => ({
    type: constants.SCREEN
})

export const durationAction = (duration) => ({
    type: constants.DURATION,
    duration
})
export const currentTimeAction = (currentTime) => ({
    type: constants.CURRENT_TIME,
    currentTime
})

export const playStateAction = () => ({
    type: constants.PLAYING
})

export const readyAction = (ready) => ({
    type: constants.READY,
    ready
})
export const volumeAction = (volume) => ({
    type: constants.VOLUME,
    volume
})

export const getLyricAction = (id) => ({
    type: constants.GET_LYRIC,
    payload: { id }
})
export const getLyricAsync = (lyric) => ({
    type: constants.GET_LYRIC_ASYNC,
    lyric
})
export const lyricLineNumAction = (lyricLineNum) => ({
    type: constants.LYRIC_LINE_NUM,
    lyricLineNum
})
export const insertSongAction = (insertSong) => ({
    type: constants.INSERT_SONG,
    insertSong
})
export const randomSongAction = (randomSong) => ({
    type: constants.RANDOM_SONG,
    randomSong
})


export const moveSongAction = (result) => ({
    type: constants.MOVE_SONG,
    result
})


export const playlistVisible = () => ({
    type: constants.PLAYLIST_VISIBLE,
})

export const nextSongAction = () => ({
    type: constants.NEXT_SONG
})

export const prevSongAction = () => ({
    type: constants.PREV_SONG
})

export const changeSongAction = (song) => ({
    type: constants.CHANGE_SONG,
    song,
})


export const changeModeAction = () => ({
    type: constants.SET_PLAY_MODE
})

export const initRefsAction = (refs) => ({
    type: constants.INIT_REFS,
    refs
})