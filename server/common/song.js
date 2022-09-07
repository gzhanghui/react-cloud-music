const { isBuffer } = require('lodash')
const { getFormattedTime } = require('../common/utils')
const { song_url, lyric } = require('NeteaseCloudMusicApi')
/**
 * 获取歌曲url                                                                                                             
 * @param {Array} id 
 * @returns 
 */
const getSongUrl = async function (id) {
    try {
        const res = await song_url({ id })
        res.body = isBuffer(res.body) ? res.body.toString() : res.body
        return res
    } catch (error) {
        return error
    }

}

/**
 * 获取歌词
 * @param {id} id 
 * @returns 
 */
const getLyric = async function (id) {
    try {
        const res = lyric(id)
        return res.body
    } catch (error) {
        return error
    }
}


const createSong = function ({ name, id, artists, album, duration, image, url, metadata }) {
    // const isLike = RegExp(/p2.music/).test(image)
    return {
        name,
        id,
        artists: formatName(artists),
        album: album.name,
        duration: getFormattedTime(duration),
        image,
        url,
        isLike: false,
        metadata
    }
}

function formatName(data, field = 'name') {
    let ret = []
    if (!data) return ''
    data.forEach((s) => {
        ret.push(s[field])
    })
    return ret.join('/')
}
module.exports = {
    createSong,
    getSongUrl,
    getLyric
}

