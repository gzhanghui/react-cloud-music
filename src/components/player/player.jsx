import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { get } from 'lodash'
import { Slider, Drawer, Tooltip } from "antd";
import classNames from "classnames";
import { useSpring, animated, config, useSpringRef, useChain, to } from '@react-spring/web'
import { removeClass, addClass } from 'common/js/utils/dom'
import { formatTime, drawCD } from "common/js/utils/tool";
import Lyric from "@/common/js/utils/lyric-parser";
import Scroll from "@/components/scroll";
import musicCover from "@/common/images/default-music.svg";
import PlayList from './play-list'
import {
    fullScreen,
    currentSong,
    currentTime,
    playing,
    volume,
    currentLyric,
    currentLineNum,
    modeIcon,
    modeTxt,
    playList,
    panelVisible,
    changeCurrentLine,
    toggleFullScreen,
    togglePanel,
    updateTime,
    changeVolume,
    changePlay,
    changeMode,
    addSongLyric,
    toggleNext,
    togglePrev
} from './player-slice'


function Player() {
    const list = useSelector(playList);
    const visible = useSelector(panelVisible);
    const screen = useSelector(fullScreen);
    const song = useSelector(currentSong);
    const time = useSelector(currentTime);
    const line = useSelector(currentLineNum)
    const play = useSelector(playing)
    const vol = useSelector(volume)
    const playModeIcon = useSelector(modeIcon)
    const playModeTxt = useSelector(modeTxt)
    const lyric = useSelector(currentLyric)
    // dom
    const $cd = useRef(null);
    const $lyric = useRef(null);
    const $audio = useRef(null);
    const $canvas = useRef(null);
    const $scroll = useRef(null);
    const $nodeRef = useRef(null)
    const $miniCover = useRef(null);
    const $progress = useRef(null);
    // ref
    const readyRef = useRef(false);
    const cdRef = useRef(null);
    const lyricRef = useRef(null);
    const loaded = useRef(0)
    const timerRef = useRef(null)
    const dispatch = useDispatch();

    function handleLyric({ lineNum }) {
        if ($scroll.current) {
            if (!$lyric.current) return;
            dispatch(changeCurrentLine(lineNum))
            const lineEle = $lyric.current.getElementsByTagName("p");
            if (lineNum > 3) {
                let lineEl = lineEle[lineNum - 3];
                $scroll.current.scrollToElement(lineEl, 1000);
            } else {
                $scroll.current.scrollTo(0, 0, 1000);
            }
        }
    }

    /* 音乐切换时 */
    useEffect(() => {
        if (!song.url) return;
        readyRef.current = false;
        if(play){
            readyRef.current = true;
        }
        if (lyricRef.current) {
            lyricRef.current.stop();
            lyricRef.current = null;
            dispatch(updateTime(0))
            dispatch(changeCurrentLine(0))
        }
        if ($audio.current.src !== song.url) {
            $audio.current.src = song.url;
            $audio.current.play();
            dispatch(changePlay(true))
            $audio.current.update = true;
        }

        /* 绘制旋转的CD */
        if (cdRef.current) {
            cdRef.current.drawCover(song.image);
        } else {
            cdRef.current = new drawCD($canvas.current, song.image)
        }
        console.log('update song')

        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            readyRef.current = true
        }, 5000)
        dispatch(addSongLyric(song.id));
    }, [song])
    useEffect(() => {
        if (lyric) {
            if (song.lyric !== lyric) return
            lyricRef.current = new Lyric(song.lyric, handleLyric)
            lyricRef.current.seek(time);
        }
    }, [lyric])

    /* 播放状态变化时 */
    useEffect(() => {
        if (!readyRef.current) return
        if (play) {
            $audio.current.play()
            cdRef.current.start();
            lyricRef.current && lyricRef.current.play();
            readyRef.current = true;
        } else {
            $audio.current.pause()
            cdRef.current.stop();
            lyricRef.current && lyricRef.current.stop();
        }
        console.log('play')
    }, [play])


    const panelSpringApi = useSpringRef();

    const { opacity } = useSpring({
        ref: panelSpringApi,
        from: { opacity: 0 },
        to: { opacity: screen ? 1 : 0 },
        onStart(result) {
            if (result.value.opacity < 0.5) removeClass($nodeRef.current, 'hide')
        },
        onRest(result) {
            if (result.finished && result.value.opacity === 0) addClass($nodeRef.current, 'hide')
            $scroll.current.refresh()
        }
    })

    const cdSpringApi = useSpringRef();
    const X = window.innerWidth / 2 - window.innerWidth / 2 / 2 - 20
    const Y = window.innerHeight - 80 - 262 / 2
    const { xy, scale } = useSpring({
        xy: screen ? [0, 0] : [-X, Y],
        scale: screen ? 1 : 0.16,
        config: config.gentle,
    })
    useChain(screen ? [panelSpringApi, cdSpringApi] : [cdSpringApi, panelSpringApi]);

    console.log(readyRef.current)
    return (
        <React.Fragment>
            <audio
                ref={$audio}
                onError={() => {
                    clearTimeout(timerRef.current)
                    readyRef.current = true;
                }}
                onEnded={() => {
                    console.log('onEnded')
                    dispatch(updateTime(0))
                    dispatch(toggleNext())
                }}
                onPause={() => { dispatch(changePlay(false)) }}
                onPlaying={() => {
                    console.log('onPlaying')
                    readyRef.current = true;
                    clearTimeout(timerRef.current);
                    dispatch(changePlay(true))
                }}
                onCanPlay={(e) => {
                    readyRef.current = true;
                    console.log(`onCanPlay`)
                    loaded.current = e.target.buffered.end(e.target.buffered.length - 1) / e.target.duration
                    lyricRef.current && lyricRef.current.seek(time);
                }}
                onProgress={(e) => {
                    loaded.current = e.target.buffered.end(e.target.buffered.length - 1) / e.target.duration
                }}
                onTimeUpdate={(e) => {
                    if (!$audio.current.update) return
                    dispatch(updateTime(e.target.currentTime * 1000))
                }}
                onVolumeChange={(e) => {
                    dispatch(changeVolume(e.target.volume * 100))
                }}
                preload="auto"
            ></audio>
            <div className="player-wrap">

                <animated.div style={{ opacity }} className={classNames('normal-player hide')} ref={$nodeRef}>
                    <div className="background-mask"></div>
                    <div className="background" style={{ backgroundImage: `url(${song.image})` }}></div>
                    <div className="song-content">
                        <div className="cd">
                            <animated.div
                                style={{
                                    transform: to([scale.to({ range: [0, 0.65, 0.75, 1], output: [0.16, 0.8, 1.03, 1], }), xy], (s, xy) => (`translate(${xy[0]}px, ${xy[1]}px) scale(${s}) `))
                                }}
                                ref={$cd} className="album-cover">
                                <canvas id='canvas' className="canvas" ref={$canvas}></canvas>
                            </animated.div>
                        </div>
                        <div className="lyric">
                            <div className="lyric-content">
                                <h3 className="song-name">{song.name}</h3>
                                <div className="song-info">
                                    <div className="album">
                                        <span className="album-label">专辑：</span>
                                        <span className="album-name"> {song.albumName}</span>
                                    </div>
                                    <div className="singer">
                                        <span className="singer-label">歌手：</span>
                                        <span className="singer-name">{song.artistsName}</span>
                                    </div>
                                </div>
                                <div className="lyric-panel">
                                    <Scroll ref={$scroll}>
                                        <div ref={$lyric}>
                                            {get(lyricRef, 'current.lines') && lyricRef.current.lines.map((ric, index) => (
                                                <p className={classNames('lyric-line', { active: index === line })}
                                                    key={index}>{ric.txt}
                                                </p>))}
                                        </div>
                                    </Scroll>
                                </div>
                            </div>
                        </div>
                    </div>
                </animated.div>
                <div className="mini-player">
                    <div
                        className="left"
                        onClick={() => {
                            dispatch(toggleFullScreen())
                        }}
                    >
                        <div className="icon" ref={$miniCover}>
                            <img src={song.image || musicCover} alt="" />
                        </div>
                        <div className="text">
                            <div className="name">{song.name}</div>
                            <div className="desc">{song.artistsName}</div>
                        </div>
                    </div>
                    <div className="control">
                        <div className="operators">
                            <button disabled={!readyRef.current} onClick={() => { dispatch(togglePrev()) }} className="icon">
                                <i className="iconfont icon-prev"></i>
                            </button>
                            <button disabled={!readyRef.current} className="icon"
              
              
              >
                {play ? (
                  <i
                    className="iconfont icon-poweroff-circle-fill"
                    onClick={controls.pause}
                  ></i>
                ) : (
                  <i
                    className="iconfont icon-play-circle-fill"
                    onClick={controls.play}
                  ></i>
                )}
              </button>
                            <button disabled={!readyRef.current}
                                onClick={() => { dispatch(toggleNext()) }} className="icon">
                                <i className="iconfont icon-next">{/**/}</i>
                            </button>
                        </div>
                        <div className="progress-wrapper">
                            <span className="time-l time">
                                {formatTime(time)}
                            </span>
                            <div className="progress" ref={$progress}>
                                <Slider
                                    disabled={!song.url}
                                    value={time}
                                    onAfterChange={(value) => {
                                        $audio.current.update = true
                                        $audio.current.currentTime = value / 1000;
                                    }}
                                    max={song.duration}
                                    tipFormatter={(val) => {
                                        if (!song.duration) return val + '%'
                                        return parseInt((Number(val || 0) / (song.duration || 0)) * 100) + '%';
                                    }}
                                    onChange={(value) => {
                                        $audio.current.update = false
                                        dispatch(updateTime(value))
                                        lyricRef.current && lyricRef.current.seek(time);
                                    }}
                                >
                                    {$progress.current && (<div className="loaded" style={{ width: `${loaded.current * $progress.current.getBoundingClientRect().width}px` }}></div>)}
                                </Slider>
                            </div>
                            <span className="time-r time">
                                {formatTime(song.duration)}
                            </span>
                        </div>
                    </div>
                    <div className="right">
                        <button className="icon">
                            <i className="iconfont icon-like"></i>
                        </button>
                        <button className="icon" onClick={() => {
                            dispatch(changeMode())
                        }}>
                            <Tooltip title={playModeTxt}>
                                <i className={classNames('iconfont', playModeIcon)}></i>
                            </Tooltip>
                        </button>
                        <button className="icon">
                            <i className="iconfont icon-notification">{/**/}</i>
                        </button>
                        <div className="volume">
                            <Slider
                                min={0}
                                max={100}
                                value={vol}
                                tipFormatter={val => val + "%"}
                                onChange={(val) => {
                                    $audio.current.volume = val / 100;
                                }}
                            />
                        </div>
                        <div className="icon" onClick={() => {
                            dispatch(togglePanel())
                        }}>
                            <i className="iconfont icon-list"></i>
                        </div>
                    </div>
                </div>
                <Drawer
                    title=""
                    className="player-list"
                    placement="right"
                    width={340}
                    mask={false}
                    closable={false}
                    onClose={() => {
                        dispatch(togglePanel())
                    }}
                    visible={visible}
                    getContainer={false}
                >
                    <div className="list-title">
                        <h3>播放列表</h3>
                        <div className="list-info">
                            <span>共{list.length}首音乐</span>
                        </div>
                    </div>
                    <div className="list-wrap">
                        <Scroll scrollbar={false}>
                            <PlayList />
                        </Scroll>
                    </div>
                </Drawer>
            </div>

        </React.Fragment>
    );
}

export default Player;
