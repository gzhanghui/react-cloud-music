import request from '@/common/js/request';
import { getSongUrl } from 'apis/song'
import { createSong } from 'common/js/song'
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

export const getNewSong = async function () {
    const url = '/api/personalized/newsong';
    const res = await request.get(url)
    let ids = res.data.result.map(item => item.id)
    ids = ids.join(',')
    const result = await getSongUrl(ids)
    const data = res.data.result.map(item => {
        const { song } = item
        const current = result.data.find(m => m.id === song.id)
        return current ? createSong({
            name: item.name, id: item.id, artists: song.artists,
            album: song.album, duration: song.duration, image: item.picUrl,
            url: current.url, metadata: item
        }) : { ...item }
    })
    return data
}


