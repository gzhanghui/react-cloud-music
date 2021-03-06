
import utils from '@/common/js/util'
export function formatName(data, field = 'name') {
    let ret = []
    if (!data) return ''
    data.forEach((s) => {
        ret.push(s[field])
    })
    return ret.join('/')
}


export function createSong({ name, id, artists, album, duration, image, url, metadata }) {
    // const isLike = RegExp(/p2.music/).test(image)
    return {
        name,
        id,
        artistsName: formatName(artists),
        artists,
        album,
        albumName: album.name,
        duration: utils.durationToTime(duration),
        image,
        url,
        isLike:false,
        metadata
    }
}

