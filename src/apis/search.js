import request from '@/common/js/request';
import { getSongUrl, songDetail } from 'apis/song'
import { get } from 'lodash';
import { createSong } from 'common/js/song'


export const getHotDetail = function () {
    const url = '/api/search/hot/detail';
    return request.get(url).then((res) => {
        return Promise.resolve(res.data)
    })
}


export const getSuggest = async function (keyword = "") {
    try {
        const url = `/api/search/suggest?keywords=${keyword}`;
        const res = await request.get(url)
        const songs = get(res, 'data.result.songs', [])
        let ids = songs.map(item => item.id)
        ids = ids.join(',')
        const detail = await songDetail(ids)
        const result = await getSongUrl(ids)

        const data = detail.songs.map(song => {
            const current = result.data.find(item => item.id === song.id)
            console.log(song.ar)
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