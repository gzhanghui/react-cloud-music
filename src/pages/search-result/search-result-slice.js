import utils from '@/common/js/util'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getArtistDetail, getArtistTopSong, getArtistAlbum, getArtistDesc, getArtistMv } from 'apis/search-result'
import { processSongsUrl, formatName } from 'common/js/song'
const initialState = {
    artistDetail: [],
    artistTopSong: [],
    artistAlbum: {
        hotAlbums: []
    },
    artistDesc: {
        introduction: []
    },
    mv: []
};

export const getArtistDetailThunk = createAsyncThunk(
    'artist/detail',
    async (id) => {
        const res = await getArtistDetail(id)
        return res.data
    }
)
export const getArtistTopSongThunk = createAsyncThunk(
    'artist/top',
    async (id) => {
        const res = await getArtistTopSong(id)
        const data = await processSongsUrl(_normalizeSongs(res.songs))
        return data.filter(item => item.url)
    }
)

export const getArtistAlbumThunk = createAsyncThunk(
    'artist/album',
    async ({ id, limit }) => {
        const res = await getArtistAlbum(id, limit)
        return res
    }
)

export const getArtistDescThunk = createAsyncThunk(
    'artist/desc',
    async (id) => {
        const res = await getArtistDesc(id)
        return res
    }
)
export const getArtistMvThunk = createAsyncThunk(
    'artist/mv',
    async (id) => {
        const res = await getArtistMv(id)
        return res.mvs
    }
)



export const searchResultSlice = createSlice({
    name: 'search-result',
    initialState,
    reducers: {

    },
    extraReducers: {
        [getArtistDetailThunk.fulfilled]: (state, action) => {
            state.artistDetail = action.payload;
        },
        [getArtistTopSongThunk.fulfilled]: (state, action) => {
            state.artistTopSong = action.payload;
        },
        [getArtistAlbumThunk.fulfilled]: (state, action) => {
            state.artistAlbum = action.payload;
        },
        [getArtistDescThunk.fulfilled]: (state, action) => {
            state.artistDesc = action.payload;
        },
        [getArtistMvThunk.fulfilled]: (state, action) => {
            state.mv = action.payload;
        }
      
    },
});

export const likeList = (state) => state.like.likeList;
export const artistDetail = (state) => state.searchResult.artistDetail;
export const artistTopSong = (state) => state.searchResult.artistTopSong;
export const artistAlbum = (state) => state.searchResult.artistAlbum;
export const artistDesc = (state) => state.searchResult.artistDesc;
export const artistMv = (state) => state.searchResult.mv;

export default searchResultSlice.reducer;














function _normalizeSongs(list) {
    let ret = []
    list.forEach((musicData) => {
        ret.push(createSong(musicData))
    })
    return ret
}

function createSong(data) {
    return {
        name: data.name,
        id: data.id,
        artistsName: formatName(data.ar),
        artists: data.ar,
        album: data.al,
        albumName: data.al.name,
        duration: utils.durationToTime(data.dt),
        image: data.al.picUrl,
        url: data.url
    }
}
