import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { Slider, Drawer } from "antd";
import classNames from "classnames";
import { removeClass } from 'common/js/utils/dom'
import animations from "create-keyframe-animation";
import Lyric from "lyric-parser";
import { get } from 'lodash'

// eslint-disable-next-line no-unused-vars
// import Vudio from 'vudio'
import { formatTime, drawCD } from "common/js/utils/tool";
import Scroll from "@/components/scroll";
import { prefixStyle } from "@/common/js/utils/dom";
import defalutMusicImg from "@/common/images/default-music.svg";
import PlayList from './play-list'
import {
    currentTime, fullScreen, currentSong, lyric, playing, volume, playList, currentLineNum, panelVisible, changeCurrentLine,
    toggleFullScreen, togglePlayState, updateCurrentTime, changeVolume, changePlayState, togglePanel, addLyric
} from './player-slice'
const transform = prefixStyle("transform");
function Player() {
    const time = useSelector(currentTime);
    const list = useSelector(playList);
    const visible = useSelector(panelVisible);
    const screen = useSelector(fullScreen);
    const song = useSelector(currentSong);
    const curLine = useSelector(currentLineNum)
    const play = useSelector(playing)
    const vol = useSelector(volume)
    const dispatch = useDispatch();
    const $cdWrapper = React.createRef();
    const nodeRef = React.useRef(null)
    const $lyricBox = useRef(null);
    const $audio = useRef(null);
    const $canvas = useRef(null);
    const $scroll = useRef(null);
    const readyRef = useRef();
    const loadRef = useRef();
    const cdRef = useRef(null);
    const lyricRef = useRef({});
    const curlyric = useSelector(lyric)


    function handleLyric({ lineNum, txt }) {
        console.log(txt)
        if ($scroll.current) {
            if (!$lyricBox.current) return;
            dispatch(changeCurrentLine(lineNum))
            const lineEles = $lyricBox.current.getElementsByTagName("p");
            if (lineNum > 3) {
                let lineEl = lineEles[lineNum - 3];
                $scroll.current.scrollToElement(lineEl, 1000);
            } else {
                $scroll.current.scrollTo(0, 0, 1000);
            }
        }
    }


    useEffect(() => {
        if (song.url) {
            readyRef.current = false;
            $audio.current.src = song.url;
            $audio.current.update = true;
            $audio.current.play()
            console.log(typeof cdRef.current)
            if (!cdRef.current) 
                cdRef.current = new drawCD($canvas.current, song.image)
            else 
                cdRef.current.drawCover(song.image)
            dispatch(addLyric(song.id))
           
        }
    }, [song])

    useEffect(()=>{
        lyricRef.current.lyric = new Lyric(curlyric, handleLyric)
    },[curlyric])

    useEffect(() => {
        if (!readyRef.current) return
        if (play) 
            $audio.current.play()
        else 
            $audio.current.pause()
    }, [play])



    const onEnter = () => {
        removeClass(nodeRef.current, 'hide')
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
        animations.runAnimation($cdWrapper.current, "move");
    };
    const onEntered = () => {
        animations.unregisterAnimation("move");
        $cdWrapper.current.style.animation = "";
    };
    const onExit = () => {
        $cdWrapper.current.style.transition = "all 0.4s";
        const { x, y, scale } = _getPosAndScale();
        $cdWrapper.current.style[
            transform
        ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
    };
    const onExited = () => {
        $cdWrapper.current.style.transition = "";
        $cdWrapper.current.style[transform] = "";
    };

    return (
        <div className="player-wrap">
            <audio
                ref={$audio}
                onLoadedMetadata={() => { loadRef.current = true; console.log(`加载完成`) }}
                crossOrigin="anonymous"
                // onError={dispatch(onError())}
                onPlaying={() => { console.log('触发playing'); readyRef.current = true; }}
                onTimeUpdate={(e) => { 
                    if(!$audio.current.update) return
                    dispatch(updateCurrentTime(e.target.currentTime * 1000)) 
                    lyricRef.current.lyric&&lyricRef.current.lyric.seek(e.target.currentTime * 1000);
                }}
                onPause={() => { dispatch(changePlayState(false)) }}
                onVolumeChange={() => { dispatch(changeVolume(time)) }}
            ></audio>
            <div>
                <CSSTransition
                    nodeRef={nodeRef}
                    in={screen}
                    timeout={400}
                    classNames="normal"
                    appear={true}
                    onEnter={onEnter}
                    onEntered={onEntered}
                    onExit={onExit}
                    onExited={onExited}
                >
                    <div className={classNames('normal-player hide')} ref={nodeRef}>
                        <div className="background-mask"></div>
                        <div className="background" style={{ backgroundImage: `url(${song.image})` }}></div>
                        <div className="song-content">
                            <div className="cd">
                                <div ref={$cdWrapper} className="album-cover">
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
                                                {Array.isArray(get(lyricRef, 'current.lyric.lines')) && lyricRef.current.lyric.lines.map((ric, index) => (<p className={classNames('lyric-line',{ active: index === curLine })} key={index}>{ric.txt} </p>))}
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
                    onClick={() => { dispatch(toggleFullScreen()) }}
                >
                    <div className="icon">
                        <img src={song.image || defalutMusicImg} alt="" />
                    </div>
                    <div className="text">
                        <div className="name">{song.name}</div>
                        <div className="desc">{song.artistsName}</div>
                    </div>
                </div>
                <div className="control">
                    <div className="operators">
                        <button className="icon" >
                            <i className="iconfont icon-prev">{/**/}</i>
                        </button>
                        <button className="icon" disabled={!song.url} onClick={() => { dispatch(togglePlayState()) }}>
                            <i className={classNames('iconfont', { 'icon-poweroff-circle-fill': play, 'icon-play-circle-fill': !play })}></i>
                        </button>
                        <button className="icon">
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
                                    $audio.current.currentTime = value / 1000;
                                }}
                                max={song.duration}
                                tipFormatter={(val) => {
                                    return parseInt((val / song.duration) * 100) + '%';
                                }}
                                onChange={(value) => {
                                    $audio.current.update = false
                                    dispatch(updateCurrentTime(value))
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
                        <i className="iconfont icon-like">{/**/}</i>{" "}
                    </button>
                    <button className="icon">
                        <i className="iconfont icon-random">{/**/}</i>{" "}
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
                                dispatch(changeVolume(val));
                                $audio.current.volume = val / 100;
                            }}
                        />
                    </div>
                    <div  className="icon" onClick={() => { dispatch(togglePanel()) }}>
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
                    onClose={() => { dispatch(togglePanel()) }}
                    visible={visible}
                    getContainer={false}
                    zIndex={100000}
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
