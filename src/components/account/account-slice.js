import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDetail} from 'apis/account';
const initialState = {
    userDetail: [],
};

export const getDetailThunk = createAsyncThunk(
    'account/detail',
    async (uid) => {
        const data = await getDetail(uid)
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
    },
});
export default accountSlice.reducer;
