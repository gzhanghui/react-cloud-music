import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getLikelist,getPlaylist } from '@/apis/likes';
const initialState = {
    likeList: [],
    playlist: []
};

export const getLikeListThunk = createAsyncThunk(
    'like/getLikeList',
    async (uid) => {
        const list = await getLikelist(uid)
        return list
    }
)

export const getPlaylistThunk = createAsyncThunk(
    'like/getPlaylist',
    async (uid) => {
        const res = await getPlaylist(uid)
        return res.playlist
    }
)
export const likeSlice = createSlice({
    name: 'like',
    initialState,
    reducers: {

    },
    extraReducers: {
        [getLikeListThunk.fulfilled]: (state, action) => {
            state.likeList = action.payload;
        },
        [getPlaylistThunk.fulfilled]:(state, action) => {
            state.playlist = action.payload;
        },
    },
});

export const likeList = (state) => state.like.likeList;
export const playlist = (state) => state.like.playlist

export const getLikeList = () => (dispatch) => {
    dispatch(getLikeListThunk());
};

export default likeSlice.reducer;
