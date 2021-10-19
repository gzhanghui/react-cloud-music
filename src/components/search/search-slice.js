import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isEmpty, uniq } from 'lodash';
import storage from 'store'
import { getHotDetail, getSuggest } from 'apis/search'
const initialState = {
    searchRes: [],
    searchSuggest: {},
    hotSearch: {
        type: 'hot',
        data: []
    },
    historySearch: {
        type: 'history',
        data: storage.get('history-search') || []
    }
};
export const getHotDetailThunk = createAsyncThunk(
    'search/getHotDetail',
    async () => {
        const res = await getHotDetail();
        return res.data;
    }
);
export const getSuggestThunk = createAsyncThunk(
    'search/getSuggest',
    async (keywords) => {
        const res = await getSuggest(keywords);
        return res.result;
    }
);
export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setHistorySearch: (state, action) => {
            const data = uniq([action.payload, ...state.historySearch.data])
            storage.set('history-search', data)
            state.historySearch.data = data
        },
        clearSearchSuggest: (state) => {
            state.searchSuggest = {}
        },
        clearHistory(state, action) {
            if (action.payload === 'all') {
                state.historySearch.data = []
            } else {
                state.historySearch.data.splice(action.payload, 1);
            }
            storage.set('history-search', state.historySearch.data)
        }
    },
    extraReducers: {

        [getHotDetailThunk.fulfilled]: (state, action) => {
            state.hotSearch.data = action.payload
        },
        [getSuggestThunk.fulfilled]: (state, action) => {
            if (isEmpty(action.payload)) return
            const data = []
            action.payload.order.forEach(key => {
                const o = {}
                o.type = key
                o.data = action.payload[key]
                data.push(o)
            })
            state.searchSuggest = data
        },
    }

});

export const {
    setHistorySearch,
    clearSearchSuggest,
    clearHistory
} = searchSlice.actions;


export const hotSearch = (state) => state.search.hotSearch;
export const searchRes = (state) => {
    console.log(state.search.historySearch,)
    if (isEmpty(state.search.searchSuggest)) return [state.search.historySearch, state.search.hotSearch]
    return [...state.search.searchSuggest]
}


export default searchSlice.reducer;

