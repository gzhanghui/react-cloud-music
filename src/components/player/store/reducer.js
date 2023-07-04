import { fromJS } from 'immutable'
import { cachePlaylist } from '@/common/js/cache'
import { insertArray, moveArray, random } from '@/common/js/util'
import { PLAY_MODE } from '@/common/js/config'
import * as constants from './constants'


const defaultState = fromJS({
    refs: {},
    songs: [],
    lyric: [],
    song: {},
    duration: 0,
    volume: 0.2,
    playing: false,
    ready: false,
    fullscreen: false,
    playlist: cachePlaylist.get(),
    mode: PLAY_MODE.sequence,
    currentTime: 0,
    lyricLineNum: 0,
    playlistVisible: false,
})
export default (state = defaultState, action) => {
    const { type } = action;
    switch (type) {
        case constants.FULLSCREEN: {
            return state.set('fullscreen', !state.get('fullscreen'));
        }
        case constants.CURRENT_TIME: {
            return state.set('currentTime', action.currentTime);
        }
        case constants.DURATION: {
            const $audio = state.get('refs').$audio
            return state.set('duration', $audio.duration * 1000);
        }

        case constants.READY: {

            // const currentSong = state.get('song')
            const ready = action.ready
            const playing = state.get('playing')
            if (!ready) state.set('ready', action.ready)
            const $cover = state.get('refs').$cover
            const $audio = state.get('refs').$audio
            if (playing) {
                $cover.style.animationPlayState = 'running'
                $audio.play()
            }
            return state.set('ready', action.ready)
        }
        case constants.VOLUME: {
            return state.set('volume', action.volume);
        }
        case constants.GET_LYRIC_ASYNC: {
            return state.set('lyric', action.lyric);
        }
        case constants.PLAYING: {
            const currentSong = state.get('song')
            const ready = state.get('ready')
            const playing = action.playing
            const $cover = state.get('refs').$cover
            const $audio = state.get('refs').$audio
            if (!currentSong.url) return state
            if (!ready) {
                return state.set('playing', playing)
            }
            console.log($cover )

            if (playing) {
                $cover.style.animationPlayState = 'running'
                $audio.play()
            } else {
                $cover.style.animationPlayState = 'paused'
                $audio.pause()
            }
            return state.set('playing', playing);
        }
        case constants.CHANGE_SONG: {
            return state.merge({ 'song': action.song })
        }
        case constants.LYRIC_LINE_NUM: {
            const num = findCurrentNum(state.get('lyric'), state.get('currentTime') * 1000)
            const $scroll = state.get('refs').$scroll
            const currentLine = state.get(['player', 'lyricLineNum'])
            if (currentLine === num) return state;
            if (num > 3) {
                const lineEl = $scroll.wrapper.current.getElementsByTagName("p")[num]
                if (lineEl) $scroll.scrollToElement(lineEl, 1000);
            }
            return state.set('lyricLineNum', num);
        }
        case constants.CHANGE_CURRENT_TIME: {
            const $audio = state.get('refs').$audio
            $audio.currentTime = action.time
            return state
        }

        case constants.PLAYLIST_VISIBLE: {
            const visible = state.get('playlistVisible')
            return state.set('playlistVisible', !visible);
        }

        case constants.SET_PLAY_MODE: {
            const mode = state.get('mode')
            return state.set('mode', (mode + 1) % 3);
        }
        case constants.INIT_REFS: {
            const refs = state.get('refs')
            return state.set('refs', Object.assign(refs, action.refs));
        }

        case constants.INSERT_SONG: {
            const playlist = state.get('playlist')
            const list = playlist.toJS()
            insertArray(list, action.insertSong, (item) => item.id === action.insertSong.id, 200)
            cachePlaylist.set((list))
            return state.merge({ 'playlist': fromJS(list), 'ready': false })

        }
        case constants.MOVE_SONG: {
            const playlist = state.get('playlist')
            const list = playlist.toJS()
            const result = moveArray(list, action.result.source, action.result.destination)
            return state.set('playlist', fromJS(result))
        }

        case constants.NEXT_SONG: {
            const playlist = state.get('playlist')
            const mode = state.get('mode')
            const $audio = state.get('refs').$audio
            const song = state.get('song')
            if (mode === PLAY_MODE.loop) {
                $audio.currentTime = 0
                $audio.play()
                return state.set('song', song)
            }
            let index = playlist.findIndex(item => item.get('id') === state.get('song').id)
            if (mode === PLAY_MODE.random) {
                index = random(0, playlist.count() - 1)
                console.log(index, playlist.toJS())
                return state.set('song', playlist.toJS()[index])
            }
            if (index < 0) return state
            return playlist.toJS()[index + 1] ? state.set('song', playlist.toJS()[index + 1]) : state.set('song', playlist.toJS()[index])
        }

        case constants.PREV_SONG: {
            const playlist = state.get('playlist')
            const list = playlist.toJS()
            let index = list.findIndex(item => item.id === state.get('song').id)
            if (index < 0) return
            return list[index - 1] ? state.set('song', list[index - 1]) : state.set('song', list[index])
        }

        // eslint-disable-next-line no-fallthrough
        default:
            return state;
    }
}


function findCurrentNum(lyric, time) {
    const lines = lyric
    for (let i = 0; i < lines.length; i++) {
        if (time <= lines[i].time) return i
    }
    return lines.length - 1
}