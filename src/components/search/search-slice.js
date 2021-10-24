import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isEmpty, uniq } from 'lodash';
import {cacheSearch} from 'common/js/cache'
import { getHotDetail, getSuggest } from 'apis/search'

const initialState = {
    searchWord:'',
    searchRes: [],
    panelVisible: false,
    searchSuggest: [],
    hotSearch: [],
    historySearch:  cacheSearch.get() || []
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
            const data = uniq([action.payload, ...state.historySearch])
            cacheSearch.set(data)
            state.historySearch = data
        },
        clearSearchSuggest: (state) => {
            state.searchSuggest = []
        },
        togglePanel: (state, action) => {
            state.panelVisible = action.payload
        },
        clearHistory(state, action) {
            if (action.payload === 'all') {
                state.historySearch = []
            } else {
                state.historySearch.splice(action.payload, 1);
            }
            cacheSearch.set(state.historySearch)
        },
        setSearchWord:(state, action) => {
            state.searchWord = action.payload
        },
    
    },
    extraReducers: {
        [getHotDetailThunk.fulfilled]: (state, action) => {
            state.hotSearch = action.payload.splice(0,10)
        },
        [getSuggestThunk.fulfilled]: (state, action) => {
            if (isEmpty(action.payload)) return
            const data = {}
            action.payload.order.forEach(key => {
                data[key] = action.payload[key]
            })
            state.searchSuggest = data
        },
    }

});

export const { setHistorySearch, clearSearchSuggest, clearHistory, togglePanel ,setSearchWord} = searchSlice.actions;


export const hotSearch = (state) => state.search.hotSearch;
export const panelVisible = (state) => state.search.panelVisible;
export const historySearch = (state) => state.search.historySearch;
export const searchSuggest = (state) => state.search.searchSuggest;
export const searchWord = (state) => state.search.searchWord;
 
export default searchSlice.reducer;

