import axios from 'axios';

export const getPersonalized = function (limit) {
    const url = '/api/personalized';
    return axios.get(url, {
        params: limit
    }).then((res) => {
        return Promise.resolve(res.data)
    })

};


export const getBanner = function (type = 2) {
    const url = '/api/banner';
    return axios.get(url, {
        params: type
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}


export const getHotwallList = function () {
    const url = '/api/comment/hotwall/list';
    return axios.get(url).then((res) => {
        return Promise.resolve(res.data)
    })
}


export const getNewSong = function () {
    const url = '/api/personalized/newsong';
    return axios.get(url).then((res) => {
        return Promise.resolve(res.data)
    })
}
export const getSongUrl = function (id) {
    const url = '/api/song/url';
    return axios.get(url, {
        params: {
            id,
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

export const songDetail=function(ids){
    const url = '/api/song/detail';
    return axios.get(url, {
        params: {
            ids,
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

//lyric
export const getLyric=function(id){
    const url = '/api/lyric';
    return axios.get(url, {
        params: {
            id,
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}