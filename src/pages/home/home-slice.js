import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getBanner, getPersonalized, getNewSong } from 'apis/home';
const initialState = {
    bannerList: [],
    newSongs: [],
    personalized: [],
    index: -1
};

export const bannerThunk = createAsyncThunk(
    'home/getBanner',
    async () => {
        const data = await getBanner()
        return data.banners
    }
)
export const personalizedThunk = createAsyncThunk(
    'home/getPersonalized',
    async () => {
        const data = await getPersonalized()
        return data.result
    }
)

export const getNewSongThunk = createAsyncThunk(
    'home/getNewSong',
    async () => {
        const list = await getNewSong()
        return list
    }
)

export const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        changeIndex: (state, action) => {
            state.index = action.payload
        },
    },
    extraReducers: {
        [bannerThunk.fulfilled]: (state, action) => {
            state.bannerList = action.payload;
        },
        [personalizedThunk.fulfilled]: (state, action) => {
            state.personalized = action.payload;
        },
        [getNewSongThunk.fulfilled]: (state, action) => {
            state.newSongs = action.payload;
        }
    },
});
export const { changeIndex } = homeSlice.actions;
export const bannerList = (state) => state.home.bannerList;
export const personalized = (state) => state.home.personalized;
export const newSongs = (state) => state.home.newSongs;
export const carouselItem = (state) => state.home.bannerList[state.home.index] || {};
export default homeSlice.reducer;
