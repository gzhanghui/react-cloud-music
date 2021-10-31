import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getBanner, getPersonalized, getNewSong, getPrivateList, getRecommendMv } from 'apis/home';
const initialState = {
    bannerList: [],
    newSongs: [],
    personalized: [],
    privateList: [],
    recommendMvList: [],
    index: -1
};

export const privateListThunk = createAsyncThunk(
    'home/getPrivateList',
    async ({ limit }) => {
        console.log(limit)
        const data = await getPrivateList()
        const result = (data.result || []).map(item => ({ ...item, cover: item.sPicUrl }))
        return result
    }
)
export const recommendMvThunk = createAsyncThunk(
    'home/getRecommendMv',
    async ({ limit }) => {
        console.log(limit)
        limit = limit || 3
        const data = await getRecommendMv()
        const result = (data.result || []).map(item => ({ ...item, cover: item.picUrl }))
        return result.splice(0, 3)
    }
)

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
        },
        [privateListThunk.fulfilled]: (state, action) => {
            state.privateList = action.payload;
        },
        [recommendMvThunk.fulfilled]: (state, action) => {
            state.recommendMvList = action.payload;
        },

    },
});
export const { changeIndex } = homeSlice.actions;
export const bannerList = (state) => state.home.bannerList;
export const personalized = (state) => state.home.personalized;
export const newSongs = (state) => state.home.newSongs;
export const privateList = (state) => state.home.privateList;
export const recommendMvList = (state) => state.home.recommendMvList;
export const carouselItem = (state) => state.home.bannerList[state.home.index] || {};
export default homeSlice.reducer;
