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


// function _normalizeSongs(list) {
//     let ret = []
//     list.forEach((musicData) => {
//         ret.push(createSong(musicData))
//     })
//     return ret
// }

// function createSong(data){
//     return  {
//         name: data.name,
//         id: data.id,
//         artistsName: formatName(data.ar),
//         artists: data.ar,
//         album: data.al,
//         albumName: data.al.name,
//         duration: utils.durationToTime(data.dt),
//         image: data.al.picUrl,
//         url: data.url
//     }
// }
