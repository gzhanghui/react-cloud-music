import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getMvUrl , getRelated} from 'apis/mv';
const initialState = {
    mvUrl: [],
    related:[],
    play: false,
    currentMv: {}
};

export const getMvUrlThunk = createAsyncThunk(
    'mv/mv-url',
    async (id) => {
        const res = await getMvUrl(id)
        return res.data
    }
)
export const getRelatedThunk = createAsyncThunk(
    'mv/related',
    async (id) => {
        const res = await getRelated(id)
        return res.data
    }
)

export const mvSlice = createSlice({
    name: 'mv-detail',
    initialState,
    reducers: {
        changeState: (state, action) => {
            state.play = action.payload;
        },
        setCurrentMv: (state, action) => {
            state.currentMv = action.payload;
        },
    },
    extraReducers: {
        [getMvUrlThunk.fulfilled]: (state, action) => {
            state.mvUrl = action.payload
        },
        [getRelatedThunk.fulfilled]: (state, action) => {
             state.related = action.payload
        }
    },
});
export const { changeState, setCurrentMv } = mvSlice.actions
export const mvUrl = (state) => state.mv.mvUrl;
export const videoState = (state) => state.mv.play;
export const currentMv = (state) => state.mv.currentMv;
export const related = (state) => state.mv.related;

export default mvSlice.reducer;
