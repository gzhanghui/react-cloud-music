import request from '@/common/js/request';
import { get } from 'lodash'
import { getSongUrl, songDetail } from 'apis/song'
import { createSong } from 'common/js/song'
export const getLikelist = async function (uid = `1422259951`) {
    const url = '/api/likelist';
    try {
        const res = await request.get(url, { params: { uid } })
        const ids = res.data.ids.join(',')
        const detail = await songDetail(ids)
        const result = await getSongUrl(ids)
        const data = detail.songs.map(song => {
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
};



export const getPlaylist = function (uid = `1422259951`) {
    const url = '/api/user/playlist';
    return request.get(url, {
        params: {
            uid
        }
    }).then((res) => {
        return res.data
    })
};

