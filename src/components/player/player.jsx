import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { get } from "lodash";
import { Slider, Drawer, Tooltip } from "antd";
import classNames from "classnames";
import {
  useSpring,
  animated,
  config,
  useSpringRef,
  useChain,
  to,
} from "@react-spring/web";
// import useAudio from "./useAudio";
import { useAudio } from "react-use";
import { removeClass, addClass } from "common/js/dom";
import { formatTime, drawCD } from "common/js/tool";
import Lyric from "common/js/lyric-parser";
import Scroll from "@/components/scroll";
import musicCover from "@/common/images/default-music.svg";
import PlayList from "./play-list";
import {
  fullScreen,
  audioState,
  changeState,
  currentSong,
  currentLyric,
  currentLineNum,
  modeIcon,
  modeTxt,
  playList,
  panelVisible,
  changeCurrentLine,
  toggleFullScreen,
  togglePanel,
  changeMode,
  addSongLyric,
  toggleNext,
  togglePrev,
  playing,
} from "./player-slice";

function Player() {
  const list = useSelector(playList);
  const visible = useSelector(panelVisible);
  const screen = useSelector(fullScreen);
  const song = useSelector(currentSong);
  const line = useSelector(currentLineNum);
  const playModeIcon = useSelector(modeIcon);
  const playModeTxt = useSelector(modeTxt);
  const lyric = useSelector(currentLyric);
  const playState = useSelector(audioState);
  const play = useSelector(playing);
  // dom
  const $lyric = useRef(null);
  const $canvas = useRef(null);
  const $scroll = useRef(null);
  const $nodeRef = useRef(null);
  const $miniCover = useRef(null);
  const $progress = useRef(null);
  // ref
  const coverRef = useRef(null);
  const lyricRef = useRef(null);
  const updateRef = useRef(false);

  const dispatch = useDispatch();

  function handleLyric({ lineNum }) {
    if ($scroll.current) {
      if (!$lyric.current) return;
      dispatch(changeCurrentLine(lineNum));
      const lineEle = $lyric.current.getElementsByTagName("p");
      if (lineNum > 3) {
        let lineEl = lineEle[lineNum - 3];
        $scroll.current.scrollToElement(lineEl, 1000);
      } else {
        $scroll.current.scrollTo(0, 0, 1000);
      }
    }
  }

  const [audio, state, controls, ref] = useAudio({
    autoPlay: false,
  });
  useEffect(() => {
    dispatch(changeState(state));
  }, [state]);

  useEffect(() => {
    play ? controls.pause() : controls.play();
  }, [play]);
  /* 音乐切换时 */
  useEffect(() => {
    if (!song.url) return;
    if (lyricRef.current) {
      lyricRef.current.stop();
      lyricRef.current = null;
      dispatch(changeCurrentLine(0));
    }
    if (ref.current.src !== song.url) {
      ref.current.src = song.url;
      controls.play();
    }
    /* 绘制旋转的CD */
    if (coverRef.current) {
      coverRef.current.drawCover(song.image);
    } else {
      coverRef.current = new drawCD($canvas.current, song.image);
    }
    dispatch(addSongLyric(song.id));
  }, [song]);
  /** 歌词 */
  useEffect(() => {
    if (lyric) {
      if (song.lyric !== lyric) return;
      lyricRef.current = new Lyric(song.lyric, handleLyric);
      lyricRef.current.seek(playState.time * 1000);
    }
  }, [lyric]);

  /* 播放状态变化时 */
  useEffect(() => {
    if (playState.playing) {
      if (!ref.current.src) return;
      coverRef.current && coverRef.current.start();
      lyricRef.current && lyricRef.current.play();
    } else {
      coverRef.current && coverRef.current.stop();
      lyricRef.current && lyricRef.current.stop();
    }
  }, [playState.playing]);
  // 面板动画
  const panelSpringApi = useSpringRef();
  const { opacity } = useSpring({
    ref: panelSpringApi,
    from: { opacity: 0 },
    to: { opacity: screen ? 1 : 0 },
    onStart(result) {
      if (result.value.opacity < 0.5) removeClass($nodeRef.current, "hide");
    },
    onRest(result) {
      if (result.finished && result.value.opacity === 0)
        addClass($nodeRef.current, "hide");
      $scroll.current.refresh();
    },
  });

  const cdSpringApi = useSpringRef();
  const X = window.innerWidth / 2 - window.innerWidth / 2 / 2 - 20;
  const Y = window.innerHeight - 80 - 262 / 2;
  const { xy, scale } = useSpring({
    xy: screen ? [0, 0] : [-X, Y],
    scale: screen ? 1 : 0.16,
    config: config.gentle,
  });
  useChain(
    screen ? [panelSpringApi, cdSpringApi] : [cdSpringApi, panelSpringApi]
  );

  return (
    <React.Fragment>
      {audio}
      <div className="player-wrap">
        <animated.div
          style={{ opacity }}
          className={classNames("normal-player hide")}
          ref={$nodeRef}
        >
          <div className="background-mask"></div>
          <div
            className="background"
            style={{ backgroundImage: `url(${song.image})` }}
          ></div>
          <div className="song-content">
            <div className="cd">
              <animated.div
                style={{
                  transform: to(
                    [
                      scale.to({
                        range: [0, 0.65, 0.75, 1],
                        output: [0.16, 0.8, 1.03, 1],
                      }),
                      xy,
                    ],
                    (s, xy) => `translate(${xy[0]}px, ${xy[1]}px) scale(${s}) `
                  ),
                }}
                className="album-cover"
              >
                <canvas id="canvas" className="canvas" ref={$canvas}></canvas>
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
                      {get(lyricRef, "current.lines") &&
                        lyricRef.current.lines.map((ric, index) => (
                          <p
                            className={classNames("lyric-line", {
                              active: index === line,
                            })}
                            key={index}
                          >
                            {ric.txt}
                          </p>
                        ))}
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
              dispatch(toggleFullScreen());
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
              <button
                onClick={() => {
                  dispatch(togglePrev());
                }}
                className="icon"
              >
                <i className="iconfont icon-prev"></i>
              </button>

              <button
                className="icon"
                onClick={() => {
                  playState.playing ? controls.pause() : controls.play();
                }}
              >
                <i
                  className={classNames("iconfont", {
                    "icon-poweroff-circle-fill": playState.playing,
                    "icon-play-circle-fill": !playState.playing,
                  })}
                ></i>
              </button>
              <button
                onClick={() => {
                  dispatch(toggleNext());
                }}
                className="icon"
              >
                <i className="iconfont icon-next">{/**/}</i>
              </button>
            </div>
            <div className="progress-wrapper">
              <span className="time-l time">{formatTime(playState.time)}</span>
              <div className="progress" ref={$progress}>
                <Slider
                  disabled={!song.url}
                  value={playState.time}
                  max={playState.duration}
                  onAfterChange={() => {
                    updateRef.current = true;
                    controls.play();
                  }}
                  onChange={(value) => {
                    if (playState.playing) controls.pause();
                    controls.seek(value);
                    lyricRef.current &&
                      lyricRef.current.seek(playState.time * 1000);
                  }}
                >
                  {$progress.current && playState.buffered.length && (
                    <div
                      className="loaded"
                      style={{
                        width: `${
                          (get(
                            playState,
                            `buffered[${playState.buffered.length - 1}].end`
                          ) /
                            playState.duration) *
                          $progress.current.getBoundingClientRect().width
                        }px`,
                      }}
                    >
                      {(get(
                        playState,
                        `buffered[${playState.buffered.length - 1}].end`
                      ) /
                        playState.duration) *
                        $progress.current.getBoundingClientRect().width}
                    </div>
                  )}
                </Slider>
              </div>
              <span className="time-r time">
                {formatTime(playState.duration)}
              </span>
            </div>
          </div>
          <div className="right">
            <button className="icon">
              <i className="iconfont icon-like"></i>
            </button>
            <button
              className="icon"
              onClick={() => {
                dispatch(changeMode());
              }}
            >
              <Tooltip title={playModeTxt}>
                <i className={classNames("iconfont", playModeIcon)}></i>
              </Tooltip>
            </button>
            <button className="icon">
              <i className="iconfont icon-notification">{/**/}</i>
            </button>
            <div className="volume">
              <Slider
                min={0}
                step={0.01}
                max={1}
                value={playState.volume}
                tipFormatter={(val) => val + "%"}
                onChange={(val) => {
                  controls.volume(val);
                }}
              />
            </div>
            <div
              className="icon"
              onClick={() => {
                dispatch(togglePanel());
              }}
            >
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
            dispatch(togglePanel());
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
