import { fromJS } from 'immutable'
import { cachePlaylist } from '@/common/js/cache'
import { insertArray, moveArray, randomOrder } from '@/common/js/util'
import { PLAY_MODE } from '@/common/js/config'
import * as constants from './constants'


const defaultState = fromJS({
    refs: {},
    songs: [],
    lyric: { lines: [] },
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
        case constants.SCREEN: {
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
            return state.set('ready', action.ready);
        }
        case constants.VOLUME: {
            return state.set('volume', action.volume);
        }
        case constants.GET_LYRIC_ASYNC: {
            return state.set('lyric', action.lyric);
        }
        case constants.PLAYING: {
            const currentSong = state.get('song')
            if (!currentSong.url) {
                return state
            }
            const playing = state.get('playing')
            const $cover = state.get('refs').$cover
            const $audio = state.get('refs').$audio
            $cover.setImage(currentSong.image)

            if (!playing) {
                $cover.start()
                $audio.play()
            } else {
                $cover.stop()
                $audio.pause()
            }
            return state.set('playing', !playing);
        }
        case constants.LYRIC_LINE_NUM: {
            const num = findCurrentNum(state.get('lyric'), state.get('currentTime'))
            const $scroll = state.get('refs').$scroll
            const currentLine = state.get(['player', 'lyricLineNum'])
            if (currentLine === num) return state;
            if (num > 3) {
                const lineEl = $scroll.wrapper.current.getElementsByTagName("p")[num]
                if (lineEl) {
                    $scroll.scrollToElement(lineEl, 1000);
                }
            }
            return state.set('lyricLineNum', num);
        }

        case constants.RANDOM_SONG: {
            return state.set('playlist', randomOrder(action.randomSong));
        }
        case constants.PLAYLIST_VISIBLE: {
            const visible = state.get('playlistVisible')
            console.log(visible)
            return state.set('playlistVisible', !visible);
        }
        case constants.CHANGE_SONG: {
            return state.merge({ 'ready': false, 'song': action.song, 'playing': false })
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
            return state.set('playlist', fromJS(list))
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
    const lines = lyric.get('lines')
    for (let i = 0; i < lines.length; i++) {
        if (time <= lines[i].time) return i
    }
    return lines.length - 1
}