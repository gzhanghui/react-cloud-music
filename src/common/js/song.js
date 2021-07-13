import { getSongUrl } from 'apis/home'
function filterArtists(artists) {
    let ret = []
    if (!artists) {
        return ''
    }
    artists.forEach((s) => {
        ret.push(s.name)
    })
    return ret.join('/')
}

export function createSong(data) {
    const { song } = data
    return  {
        name: data.name,
        id: data.id,
        artistsName: filterArtists(song.artists),
        artists: song.artists,
        album: song.album,
        albumName: song.album.name,
        duration: song.duration,
        image: data.picUrl,
        url: data.url
    }
}
export function processSongsUrl(songs) {
    if (!songs.length) {
        return Promise.resolve(songs)
    }
    const ids = songs.map(item => item.id)
    return getSongUrl(ids.join(',')).then((res) => {
        songs = songs.filter((song) => {
            const item = res.data.find(item => song.id === item.id)
            if (item) {
                song.url = item.url
                return true
            }
            return false
        })
        return songs
    })
}