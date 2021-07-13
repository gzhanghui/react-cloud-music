import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cloneDeep, isUndefined } from 'lodash';
import { getLyric } from 'apis/home'
const initialState = {
    fullScreen: false,
    songReady: false,
    songError: false,
    currentTime: 0,
    currentIndex: -1,
    lyric: '',
    playList: [],
    playing: false,
    volume: 25,
    panelVisible: false,
    currentSong: {},
    currentLineNum: 0
};
export const lyricThunk = createAsyncThunk(
    'player/getLyric',
    async (id) => {
        const response = await getLyric(id);
        return response.lrc.lyric;
    }
);
export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        toggleFullScreen: (state) => {
            state.fullScreen = !state.fullScreen;
        },
        addSong: (state, action) => {
            state.playList = [action.payload, ...state.playList]
        },
        replacePlayList: (state, action) => {
            state.playList = action.payload
        },
        togglePlayState(state, action) {
            if (isUndefined(action.payload)) {
                state.playing = !state.playing;
            } else {
                state.playing = action.payload
            }
        },
        togglePanel(state) {
            state.panelVisible = !state.panelVisible
        },
        toggleReady: (state, action) => {
            console.log(action.payload)
            state.songReady = action.payload;
        },
        updateCurrentTime: (state, action) => {
            state.currentTime = action.payload;
        },
        changeIndex: (state, action) => {
            state.currentIndex = action.payload;
        },
        changeVolume: (state, action) => {
            state.volume = action.payload
        },
        changePlayState: (state, action) => {
            state.songReady = action.payload
        },
        changeCurrentLine: (state, action) => {
            state.currentLineNum = action.payload
        },
        changeCurLyric: (state, action) => {
            state.lyric = action.payload;
        },

    },
    extraReducers: {
        [lyricThunk.fulfilled]: (state, action) => {
            state.lyric = action.payload;
            state.currentSong = cloneDeep({ ...state.currentSong, lyric: action.payload });
        },
    }

});

export const { toggleFullScreen, togglePlayState, updateCurrentTime, changeIndex, changeVolume, changePlayState,
    togglePanel, replacePlayList, toggleReady, changeCurrentLine, changeCurLyric } = playerSlice.actions;

export const currentIndex = (state) => state.player.currentIndex;
export const currentTime = (state) => state.player.currentTime;
export const fullScreen = (state) => state.player.fullScreen;
export const playing = (state) => state.player.playing;
export const volume = (state) => state.player.volume;
export const playList = (state) => state.player.playList;
export const panelVisible = (state) => state.player.panelVisible;
export const currentSong = (state) => state.player.playList[state.player.currentIndex] || {}
export const lyric = (state) => state.player.lyric;
export const songReady = (state) => state.player.songReady;
export const currentLineNum = (state) => state.player.currentLineNum;

export const addLyric = (id) => (dispatch, getState) => {
    const song = currentSong(getState());
    if (!song.lyric) {
        dispatch(lyricThunk(id))
    } else {
        dispatch(changeCurLyric(getState(), song.lyric))
    }
};


export default playerSlice.reducer;
