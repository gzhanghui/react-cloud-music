import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { isArray, uniqBy } from 'lodash'
import { getLyric } from 'apis/song'
import { cachePlaylist, cachePlayMode } from 'common/js/cache';
export const PLAY_MODE = {
    sequence: { text: '顺序播放', icon: 'icon-sequence', code: 0 },
    loop: { text: '随机播放', icon: 'icon-random', code: 1 },
    random: { text: '单曲循环', icon: 'icon-loop', code: 2 }
}

const initialState = {
    audioState: {
        buffered: [],
        duration: 0,
        muted: false,
        paused: false,
        playing: true,
        time: 0,
        volume: 1,
    },
    fullScreen: false,
    songError: false,
    currentIndex: -1,
    currentLyric: '',
    playList: cachePlaylist.get() || [],
    panelVisible: false,
    currentLineNum: 0,
    currentMode: cachePlayMode.get() || PLAY_MODE.sequence.code
};
export const lyricThunk = createAsyncThunk(
    'player/lyric',
    async (id) => {
        const res = await getLyric(id);
        return res.lrc.lyric;
    }
);
export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        insertSong: (state, action) => {
            const list = current(state).playList
            // 批量插入
            if (isArray(action.payload)) {
                state.playList = uniqBy(action.payload.concat(list), 'id')
            } else {
                // 单曲插入  
                state.playList = uniqBy([action.payload, ...list], 'id')
            }
            cachePlaylist.set(state.playList)
        },
        toggleFullScreen: (state) => {
            state.fullScreen = !state.fullScreen;
        },
        changePlaying: (state, action) => {
            state.playing = action.payload
        },
        togglePanel: (state) => {
            state.panelVisible = !state.panelVisible
        },
        changeIndex: (state, action) => {
            state.currentIndex = action.payload;
        },
        changeCurrentLine: (state, action) => {
            state.currentLineNum = action.payload
        },
        setSongLyric: (state, action) => {
            state.currentLyric = action.payload;
        },
        changeMode: (state) => {
            state.currentMode = (state.currentMode + 1) % 3;
            cachePlayMode.set(state.currentMode)
        },
        changeState: (state, action) => {
            state.audioState = action.payload;
        },
    },
    extraReducers: {

        [lyricThunk.fulfilled]: (state, action) => {
            const current = { ...state.playList[state.currentIndex], lyric: action.payload }
            state.playList = state.playList.map((song, index) => index === state.currentIndex ? current : song)
            state.currentLyric = action.payload;
        },

    }

});

export const {
    toggleFullScreen,
    updateTime,
    changeIndex,
    togglePanel,
    changePlaying,
    changeCurrentLine,
    setSongLyric,
    changeMode,
    changeState,
    insertSong
} = playerSlice.actions;

export const fullScreen = (state) => state.player.fullScreen;
export const audioState = (state) => state.player.audioState;
export const panelVisible = (state) => state.player.panelVisible;
export const playList = (state) => state.player.playList;
export const currentIndex = (state) => state.player.currentIndex;
export const playing = (state) => state.player.playing;
export const currentLyric = (state) => state.player.currentLyric;
export const currentLineNum = (state) => state.player.currentLineNum;
export const currentMode = (state) => state.player.currentMode;
export const currentSong = (state) => (state.player.playList[state.player.currentIndex] || {})

export const addSongLyric = (id) => (dispatch, getState) => {
    const song = currentSong(getState());
    if (!song.lyric) {
        dispatch(lyricThunk(id))
    } else {
        dispatch(setSongLyric(song.lyric))
    }
};
export const toggleNext = () => async (dispatch, getState) => {
    const list = playList(getState())
    if (!list.length) return
    if (list.length === 1) {
        loop(dispatch)
    } else {
        let index = currentIndex(getState()) + 1
        if (index === list.length) {
            index = 0
        }
        dispatch(changeIndex(index))
    }
};

export const togglePrev = () => (dispatch, getState) => {
    const list = playList(getState())
    if (!list.length) return
    if (list.length === 1) {
        loop(dispatch)
    } else {
        let index = currentIndex(getState()) - 1
        if (index === -1) {
            index = 0
        }
        if (!list[index].url) {
            index = index + 1
        }
        dispatch(changeIndex(index))
    }
};
export const skipForward = () => () => {

}
function loop(dispatch) {
    dispatch(changePlaying(true))
}
export default playerSlice.reducer;
