import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLyric } from 'apis/home'

export const PLAY_MODE = {
    sequence: 0,
    loop: 1,
    random: 2
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
    playList: [],
    panelVisible: false,
    currentLineNum: 0,
    mode: PLAY_MODE.sequence
};
export const lyricThunk = createAsyncThunk(
    'player/getLyric',
    async (id) => {
        const res = await getLyric(id);
        return res.lrc.lyric;
    }
);
export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        addSong: (state, action) => {
            state.playList = [action.payload, ...state.playList]
        },
        replacePlayList: (state, action) => {
            state.playList = action.payload
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
        changeCurrentLyric: (state, action) => {
            state.currentLyric = action.payload;
        },
        changeMode: (state) => {
            state.mode = (state.mode + 1) % 3;
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
    replacePlayList,
    changeCurrentLine,
    changeCurrentLyric,
    changeMode,
    changeState,
} = playerSlice.actions;

export const fullScreen = (state) => state.player.fullScreen;
export const audioState = (state) => state.player.audioState;
export const panelVisible = (state) => state.player.panelVisible;
export const playList = (state) => state.player.playList;
export const currentIndex = (state) => state.player.currentIndex;
export const currentSong = (state) => state.player.playList[state.player.currentIndex] || {}
export const playing = (state) => state.player.playing;
export const currentLyric = (state) => state.player.currentLyric;
export const currentLineNum = (state) => state.player.currentLineNum;
export const mode = (state) => state.player.mode;
export const modeIcon = (state) => (state.player.mode === PLAY_MODE.sequence ? 'icon-sequence' : state.player.mode === PLAY_MODE.random ? 'icon-random' : 'icon-loop')
export const modeTxt = (state) => (state.player.mode === PLAY_MODE.sequence ? '顺序播放' : state.player.mode === PLAY_MODE.random ? '随机播放' : '单曲循环')

export const addSongLyric = (id) => (dispatch, getState) => {
    const song = currentSong(getState());
    if (!song.lyric) {
        dispatch(lyricThunk(id))
    } else {
        dispatch(changeCurrentLyric(song.lyric))
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
    dispatch(updateTime(0))
    dispatch(changePlaying(true))
}
export default playerSlice.reducer;
