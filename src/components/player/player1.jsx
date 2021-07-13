import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import animations from "create-keyframe-animation";
import Lyric from "lyric-parser";
import { get } from 'lodash'
import { CSSTransition } from "react-transition-group";
import { Slider, Drawer, Tooltip } from "antd";
import classNames from "classnames";
import { removeClass } from 'common/js/utils/dom'

import { formatTime, drawCD } from "common/js/utils/tool";
import Scroll from "@/components/scroll";
import { prefixStyle } from "@/common/js/utils/dom";
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

const transform = prefixStyle("transform");

function Player() {
    const time = useSelector(currentTime);
    const list = useSelector(playList);
    const visible = useSelector(panelVisible);
    const screen = useSelector(fullScreen);
    const song = useSelector(currentSong);
    const line = useSelector(currentLineNum)
    const play = useSelector(playing)
    const vol = useSelector(volume)
    const playModeIcon = useSelector(modeIcon)
    const playModeTxt = useSelector(modeTxt)
    const lyric = useSelector(currentLyric)

    const $cd = useRef(null);
    const $lyricBox = useRef(null);
    const $audio = useRef(null);
    const $canvas = useRef(null);
    const $scroll = useRef(null);
    const $nodeRef = useRef(null)

    const readyRef = useRef(false);
    const cdRef = useRef(null);
    const lyricRef = useRef(null);

    const dispatch = useDispatch();

    function handleLyric({ lineNum }) {
        if ($scroll.current) {
            if (!$lyricBox.current) return;
            dispatch(changeCurrentLine(lineNum))
            const lineEle = $lyricBox.current.getElementsByTagName("p");
            if (lineNum > 5) {
                let lineEl = lineEle[lineNum - 5];
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

        if (lyricRef.current) {
            lyricRef.current.stop();
            lyricRef.current = null;
            dispatch(updateTime(0))
            dispatch(changeCurrentLine(0))
        }
        if($audio.current.src!==song.url){
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
        dispatch(addSongLyric(song.id));
        if(lyric){
            if (song.lyric !== lyric) return
            lyricRef.current = new Lyric(song.lyric, handleLyric)
            if (readyRef.current) { lyricRef.current.seek(time); }
        }
    }, [song])

    /* 播放状态变化时 */
    useEffect(() => {
        if (!readyRef.current) return
        console.log(`play`)
        if (play) {
            $audio.current.play()
            cdRef.current.start();
            lyricRef.current && lyricRef.current.seek(time);
        } else {
            $audio.current.pause()
            cdRef.current.stop();
            lyricRef.current && lyricRef.current.stop();
        }
    }, [play])


    const onEnter = () => {
        removeClass($nodeRef.current, 'hide')
        const { x, y, scale } = _getPosAndScale();
        let animation = {
            0: {
                transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
            },
            60: {
                transform: `translate3d(0,0,0) scale(1.1)`,
            },
            100: {
                transform: `translate3d(0,0,0) scale(1)`,
            },
        };
        animations.registerAnimation({
            name: "move",
            animation,
            presets: {
                duration: 400,
                easing: "linear",
            },
        });
        animations.runAnimation($cd.current, "move");
    };
    const onEntered = () => {
        animations.unregisterAnimation("move");
        $cd.current.style.animation = "";
    };
    const onExit = () => {
        $cd.current.style.transition = "all 0.4s";
        const { x, y, scale } = _getPosAndScale();
        $cd.current.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
    };
    const onExited = () => {
        $cd.current.style.transition = "";
        $cd.current.style[transform] = "";
    };

    return (
        <div className="player-wrap">
            <audio
                ref={$audio}
                onError={() => { readyRef.current = true }}
                onEnded={() => {
                    dispatch(updateTime(0))
                    dispatch(toggleNext())
                }}
                onPause={() => { dispatch(changePlay(false)) }}
                onCanPlay={() => {
                    if (readyRef.current) return
                    console.log(`onCanPlay`)
                    readyRef.current = true;
                    lyricRef.current && lyricRef.current.seek(time);
                }}
                onTimeUpdate={(e) => {
                    if (!$audio.current.update) return
                    dispatch(updateTime(e.target.currentTime * 1000))
                }}
                onVolumeChange={(e) => {
                    dispatch(changeVolume(e.target.volume * 100))
                }}
            ></audio>
            <div>
                <CSSTransition
                    nodeRef={$nodeRef}
                    in={screen}
                    timeout={400}
                    classNames="normal"
                    appear={true}
                    onEnter={onEnter}
                    onEntered={onEntered}
                    onExit={onExit}
                    onExited={onExited}
                >
                    <div className={classNames('normal-player hide')} ref={$nodeRef}>
                        <div className="background-mask"></div>
                        <div className="background" style={{ backgroundImage: `url(${song.image})` }}></div>
                        <div className="song-content">
                            <div className="cd">
                                <div ref={$cd} className="album-cover">
                                    <canvas id='canvas' className="canvas" ref={$canvas}></canvas>
                                </div>
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
                                            <div ref={$lyricBox}>
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
                    </div>
                </CSSTransition>
            </div>
            <div className="mini-player">
                <div
                    className="left"
                    onClick={() => {
                        dispatch(toggleFullScreen())
                    }}
                >
                    <div className="icon">
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
                        <button disabled={!readyRef.current} className="icon" onClick={() => {
                            dispatch(changePlay(!play))
                        }}>
                            <i className={classNames('iconfont', {
                                'icon-poweroff-circle-fill': play,
                                'icon-play-circle-fill': !play
                            })}></i>
                        </button>
                        <button disabled={!readyRef.current} onClick={() => {
                            dispatch(toggleNext())
                        }} className="icon">
                            <i className="iconfont icon-next">{/**/}</i>
                        </button>
                    </div>
                    <div className="progress-wrapper">
                        <span className="time-l time">
                            {formatTime(time)}
                        </span>
                        <div className="progress">
                            <Slider
                                value={time}
                                onAfterChange={(value) => {
                                    $audio.current.update = true
                                    console.log(value)
                                    $audio.current.currentTime = value / 1000;
                                }}
                                max={song.duration}
                                tipFormatter={(val) => {
                                    return parseInt((Number(val) / (song.duration)) * 100) + '%';
                                }}
                                onChange={(value) => {
                                    $audio.current.update = false
                                    dispatch(updateTime(value))
                                }}
                            />
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
                            tipFormatter={(val) => {
                                return val + "%";
                            }}
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
            <div className="player-list">
                <Drawer
                    title=""
                    className=""
                    placement="right"
                    width={340}
                    maskClosable={true}
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
        </div>
    );
}

function _getPosAndScale() {
    const targetWidth = 42;
    const paddingLeft = 24;
    const paddingBottom = 40;
    const paddingTop = 100;
    const width = 262;
    const scale = targetWidth / width;
    const x = -(
        window.innerWidth / 2 -
        (840 / 2 - width + width / 2) -
        paddingLeft
    );
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
    return {
        x,
        y,
        scale,
    };
}

export default Player;
