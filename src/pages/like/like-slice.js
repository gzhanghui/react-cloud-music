import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getLikelist } from 'apis/likes';
import { processSongsUrl, formatName } from 'common/js/song'
const initialState = {
    likeList: [],
};

export const getLikelistThunk = createAsyncThunk(
    'like/getLikelist',
    async (uid) => {
        const list = await getLikelist(uid)
        const data = await processSongsUrl(_normalizeSongs(list.songs))
        return data
    }
)
export const likeSlice = createSlice({
    name: 'like',
    initialState,
    reducers: {
   
    },
    extraReducers: {
        [getLikelistThunk.fulfilled]: (state, action) => {
            console.log(action.payload)
            state.likeList = action.payload;
        }
    },
});

export const likeList = (state) => state.like.likeList;

export default likeSlice.reducer;


function _normalizeSongs(list) {
    let ret = []
    list.forEach((musicData) => {
        ret.push(createSong(musicData))
    })
    return ret
}

function createSong(data){
    return  {
        name: data.name,
        id: data.id,
        artistsName: formatName(data.ar),
        artists: data.ar,
        album: data.al,
        albumName: data.al.name,
        duration: data.dt,
        image: data.al.picUrl,
        url: data.url
    }
}
