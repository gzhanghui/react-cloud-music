import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDetail, getUserLevel} from 'apis/account';
const initialState = {
    userDetail: [],
    level:{}
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
    },
});
export const userDetail = (state) => state.account.userDetail;
export const userLevel = (state) => state.account.level;

export default accountSlice.reducer;
