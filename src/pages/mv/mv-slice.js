import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getMvUrl } from 'apis/mv';
const initialState = {
    mvUrl: [],
 
};

export const getMvUrlThunk = createAsyncThunk(
    'artist/mv-url',
    async (id) => {
        const res = await getMvUrl(id)
        return res.data
    }
)

export const mvSlice = createSlice({
    name: 'mv-detail',
    initialState,
    reducers: {
   
    },
    extraReducers: {
        [getMvUrlThunk.fulfilled]: (state, action)=>{
            state.mvUrl = action.payload
        }
    },
});
export const mvUrl = (state) => state.mv.mvUrl;
export default mvSlice.reducer;
