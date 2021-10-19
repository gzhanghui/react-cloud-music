import request from '@/common/js/request';
export const getPersonalized = function (limit) {
    const url = '/api/personalized';
    return request.get(url, {
        params: limit
    }).then((res) => {
        return Promise.resolve(res.data)
    })

};


export const getBanner = function (type = 2) {
    const url = '/api/banner';
    return request.get(url, {
        params: type
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}


export const getHotwallList = function () {
    const url = '/api/comment/hotwall/list';
    return request.get(url).then((res) => {
        return Promise.resolve(res.data)
    })
}


export const getNewSong = function () {
    const url = '/api/personalized/newsong';
    return request.get(url).then((res) => {
        return Promise.resolve(res.data)
    })
}
export const getSongUrl = function (id) {
    const url = '/api/song/url';
    return request.get(url, {
        params: {
            id,
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

export const songDetail=function(ids){
    const url = '/api/song/detail';
    return request.get(url, {
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
    return request.get(url, {
        params: {
            id,
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}


