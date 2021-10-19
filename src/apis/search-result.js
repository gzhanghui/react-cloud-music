import request from '@/common/js/request';
export const getArtistDetail = function (id) {
    const url = `/api/artist/detail?id=${id}`;
    return request.get(url).then((res) => {
        return Promise.resolve(res.data)
    })
}
export const getArtistTopSong = function (id) {
    const url = `/api/artist/top/song?id=${id}`;
    return request.get(url).then((res) => {
        return Promise.resolve(res.data)
    })
}

export const getArtistAlbum = function (id,limit=50) {
    const url = `/api/artist/album?id=${id}&limit=${limit}`;
    return request.get(url).then((res) => {
        return Promise.resolve(res.data)
    })
}


export const getArtistDesc = function (id) {
    const url = `/api/artist/desc?id=${id}`;
    return request.get(url).then((res) => {
        return Promise.resolve(res.data)
    })
}


export const getArtistMv = function (id) {
    const url = `/api/artist/mv?id=${id}`;
    return request.get(url).then((res) => {
        return Promise.resolve(res.data)
    })
}


