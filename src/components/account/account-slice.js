import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDetail, getUserLevel, getUserLikeSongs} from 'apis/account';
const initialState = {
    userDetail: [],
    level:{},
    likeIds: []
};

export const getDetailThunk = createAsyncThunk(
    'account/detail',
    async (uid) => {
        const data = await getDetail(uid)
        return data
    }
)
export const getUserLevelThunk =  createAsyncThunk(
    'account/level',
    async () => {
        const data = await getUserLevel()
        return data
    }
)
export const getUserLikeSongsThunk =  createAsyncThunk(
    'account/like',
    async () => {
        const data = await getUserLikeSongs()
        return data
    }
)
export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
    },
    extraReducers: {
        [getDetailThunk.fulfilled]: (state, action) => {
            state.userDetail = action.payload;
        },
        [getUserLevelThunk.fulfilled]: (state, action) => {
            state.level = action.payload;
        },
        [getUserLikeSongsThunk.fulfilled]: (state, action) => {
            state.likeIds = action.payload;
        },
    },
});
export const userDetail = (state) => state.account.userDetail;
export const userLevel = (state) => state.account.level;
export const userLikeSongs = (state) => state.account.likeIds;

export default accountSlice.reducer;
