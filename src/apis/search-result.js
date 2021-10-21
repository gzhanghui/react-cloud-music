import { get } from 'lodash'
import request from '@/common/js/request';
import { getSongUrl } from 'apis/song'
import { createSong } from 'common/js/song'
export const getArtistDetail = function (id) {
    const url = `/api/artist/detail?id=${id}`;
    return request.get(url).then((res) => {
        return Promise.resolve(res.data)
    })
}
export const getArtistTopSong = async function (id) {
    const url = `/api/artist/top/song?id=${id}`;
    try {
        const res = await request.get(url)
        let ids = res.data.songs.map(item => item.id)
        ids = ids.join(',')
        const result = await getSongUrl(ids)
        const data = res.data.songs.map(song => {
            const current = result.data.find(item => item.id === song.id)
            return current ? createSong({
                name: song.name, id: song.id, artists: song.ar,
                album: song.al, duration: song.dt, image: get(song, 'al.picUrl'),
                url: current.url, metadata: song
            }) : { ...song }
        })
        return data
    } catch (error) {
        console.log(error)
    }

}

export const getArtistAlbum = function (id, limit = 50) {
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


