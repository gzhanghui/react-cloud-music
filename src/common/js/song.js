
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
    const islike = RegExp(/p2.music/).test(image)
    console.log(islike, image)
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
        islike,
        metadata
    }
}

