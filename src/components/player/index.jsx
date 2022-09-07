/* eslint-disable react/prop-types */
import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Spring, animated, config, to } from "react-spring";
import { Slider, Tooltip } from "antd";
import { removeClass, addClass } from "@/common/js/dom";
import { formatTime } from '@/common/js/util'
import albumImage from '@/common/images/default-music.svg'
import Scroll from '@/components/scroll'
import Loading from "@/components/icons/loading";
import DrawCover from '@/components/icons/rotate-cover'
import PlayIcon from "@/components/icons/playing";
import { PLAY_MODE } from '@/common/js/config.js'

import { actionCreators } from './store'

/**
 * list item
 */
const SortableItem = SortableElement(({ item, song, state, handleItemClick }) => <li className="song-item">
  <div className="song-item-avatar">
    <img src={item.get('image')} width="42" />
    <button className="song-item-control" onClick={() => { handleItemClick(item) }}> <i className={classNames('iconfont', {
      'icon-play': item.get("id") !== song.id || !state,
      'icon-pause': (item.get("id") === song.id) && state
    })}></i></button>
  </div>
  <div className="song-item-info">
    <div className="song-item-name">
      <span>{item.get('name')}</span>
      {(item.get("id") === song.id && state) && <span><PlayIcon /></span>}
    </div>
    <i className="iconfont icon-close"></i>
    <div className="song-item-artists">
      <span>{item.get('artists')}</span>
      <span className="song-item-duration">{item.get('duration')}</span>
    </div>
  </div>
</li>
);
/**
 * list container
 */
const SortableList = SortableContainer(({ list, song, state, handleItemClick }) => {
  return (
    <ul className="list-content">
      {list.map((item, index) => (<SortableItem key={item.get('id')} state={state} handleItemClick={handleItemClick} item={item} song={song} index={index} />))}
    </ul>
  );
});

class Player extends React.Component {

  render() {
    const X = window.innerWidth / 2 - window.innerWidth / 2 / 2 - 20;
    const Y = window.innerHeight - 80 - 262 / 2;

    const { song, fullscreen, lyric, lyricLineNum, ready, playing, currentTime, volume, duration, playlistVisible, playlist, mode } = this.props
    return (
      <div className="player">
        <audio autoPlay={false}
          id="audio"
          preload='auto'
          src={this.props.song.url}
          ref={(audio) => { this.$audio = audio; }}
          onTimeUpdate={this.props.handleTimeupdate}
          onCanPlay={this.props.handleCanPlay}
          onEnded={this.props.handleEnded}
        ></audio>
        <Spring
          from={{ opacity: 0 }}
          to={{ opacity: fullscreen ? 1 : 0 }}
          onStart={(result) => { if (result.value.opacity < 0.5) removeClass(this.$nodeRef, "hide") }}
          onRest={(result) => {
            if (result.finished && result.value.opacity === 0) {
              addClass(this.$nodeRef, 'hide')
            }
            this.$scroll.refresh();
          }}>
          {styles => {
            return <animated.div
              style={styles}
              className={classNames("normal-player hide")}
              ref={(nodeRef) => { this.$nodeRef = nodeRef }}
            >
              <div className="background-mask"></div>
              <div className="background" style={{ backgroundImage: `url(${song.image})`, fontSize: '100px' }} ></div>
              <div className="song-content">
                <div className="cd">
                  <Spring
                    xy={fullscreen ? [0, 0] : [-X, Y]}
                    scale={fullscreen ? 1 : 0.16}
                    config={config.gentle}
                  >
                    {({ xy, scale }) => {
                      return <animated.div
                        style={{
                          transform: to(
                            [scale.to({ range: [0, 0.65, 0.75, 1], output: [0.16, 0.8, 1.03, 1], }), xy],
                            (scale, xy) => `translate(${xy[0]}px, ${xy[1]}px) scale(${scale})`
                          ),
                        }}
                        className="album-cover"
                      >
                        <canvas id="canvas" className="canvas" ref={(canvas) => { this.$canvas = canvas }}></canvas>
                      </animated.div>
                    }}
                  </Spring>
                </div>
                <div className="lyric">
                  <div className="lyric-content">
                    <h3 className="song-name"></h3>
                    <div className="song-info">
                      <div className="album">
                        <span className="album-label">专辑：</span>
                        <span className="album-name"> </span>
                      </div>
                      <div className="singer">
                        <span className="singer-label">歌手：</span>
                        <span className="singer-name"></span>
                      </div>
                    </div>
                    <div className="lyric-panel">
                      <Scroll ref={(scroll) => { this.$scroll = scroll; }}>
                        {lyric.get && lyric.get('lines').map((item, index) => {
                          return <p className={classNames('lyric-line', { 'active': lyricLineNum === index })} key={index}>{item.txt}</p>
                        })}
                        {JSON.stringify(lyric)}
                      </Scroll>
                    </div>
                  </div>
                </div>
              </div>
            </animated.div>
          }}
        </Spring>

        <div className="song-info">
          <div className="song-avatar" onClick={() => this.props.toggleScreen()}>
            {song.image && <img src={song.image} width="100%" />}
            {!song.image && <img src={albumImage} width="100%" />}
          </div>
          <div className="name">
            <div className="song-name">{song.name}</div>
            <div className="singer-name">{song.artists}</div>
          </div>
        </div>
        <div className="controls">
          <button className="iconfont icon-prev" onClick={this.props.prevSong}></button>
          <button onClick={this.props.handleTogglePlay}>
            <i className={classNames('iconfont toggle', {
              'icon-play': !playing,
              'icon-pause': playing && ready
            })}></i>
            <i className={classNames('icon-loading hide', { 'show': playing && !ready })}><Loading /></i>
          </button>
          <button className="iconfont icon-next" onClick={this.props.nextSong}></button>
        </div>
        <div className="progress">
          <span className="current-time">{formatTime(currentTime)}</span>
          <Slider
            tipFormatter={() => formatTime(currentTime)}
            defaultValue={0} value={currentTime * 1000} max={duration}
            onAfterChange={() => { this.$audio.play(); }}
            onChange={(value) => { this.$audio.pause(); this.$audio.currentTime = value / 1000 }}
          />
          <span className="duration">{formatTime(duration / 1000)}</span>
        </div>
        <div className="controls-right">
          <button className="icon-like iconfont" >  </button>
          <Tooltip title={mode === PLAY_MODE.sequence ? '顺序播放' : mode === PLAY_MODE.random ? '随机播放' : '单曲循环'}>
            <button className="iconfont play-mode" onClick={this.props.handleChangeMode}>
              <i className={classNames('iconfont', { 'icon-sequence': mode === PLAY_MODE.sequence, 'icon-loop': mode === PLAY_MODE.loop, 'icon-random': mode === PLAY_MODE.random })}></i>
            </button>
          </Tooltip>

          <button className={classNames('iconfont', [volume === 0 ? 'icon-volume-mute' : volume > 0.5 ? 'icon-volume-high' : 'icon-volume-medium'])}></button>
          <div className="volume-control">
            <Slider
              min={0}
              step={0.01}
              max={1}
              defaultValue={volume}
              tipFormatter={(val) => `${Math.ceil(val * 100)}`}
              onChange={(value) => { this.$audio.volume = value }}
            />
          </div>
          <button className="iconfont icon-list" onClick={this.props.handleToggleVisible}></button>
        </div>
        <Spring
          from={{ translateX: 340 }}
          to={{ translateX: playlistVisible ? 0 : 340 }}
          config={{ tension: 500, friction: 25 }}
        >
          {styles => {
            return (<animated.div style={styles} className="playlist list">
              <div className="list-header"> <span>当前播放</span>  <i className="iconfont icon-close"></i></div>
              <SortableList handleItemClick={this.props.handleItemClick} pressDelay={200} lockAxis='y' helperClass="move-style" state={playing} song={song} list={playlist} onSortEnd={this.props.onDragEnd} />
            </animated.div>)
          }}
        </Spring>
      </div >
    )
  }
  componentDidMount() {
    this.$cover = new DrawCover(this.$canvas, albumImage)
    this.props.initRefs({ $audio: this.$audio, $scroll: this.$scroll, $cover: this.$cover })
  }
  componentDidUpdate(prevProps) {
    const index = this.props.playlist.findIndex(item => item.id === prevProps.song.id)
    if (index < 0 && prevProps.song.id !== this.props.song.id) {
      this.props.handleInsertSong(prevProps.song)
    }
  }

}

const mapState = (state) => {
  return {
    refs: state.getIn(['player', 'refs']),
    playlist: state.getIn(['player', 'playlist']),
    lyric: state.getIn(['player', 'lyric']),
    song: state.getIn(['player', 'song']),
    currentTime: state.getIn(['player', 'currentTime']),
    duration: state.getIn(['player', 'duration']),
    volume: state.getIn(['player', 'volume']),
    playing: state.getIn(['player', 'playing']),
    ready: state.getIn(['player', 'ready']),
    fullscreen: state.getIn(['player', 'fullscreen']),
    playlistVisible: state.getIn(['player', 'playlistVisible']),
    lyricLineNum: state.getIn(['player', 'lyricLineNum']),
    mode: state.getIn(['player', 'mode'])
  }
}
const mapDispatch = (dispatch) => {
  return {
    initRefs(ref) {
      dispatch(actionCreators.initRefsAction(ref))
    },

    toggleScreen() {
      dispatch(actionCreators.screenAction())
    },

    handleCanPlay() {
      dispatch(actionCreators.readyAction(true))
      dispatch(actionCreators.durationAction())
    },

    handleTogglePlay() {
      dispatch(actionCreators.playStateAction())
    },

    handleTimeupdate(e) {
      dispatch(actionCreators.currentTimeAction(e.target.currentTime))
      dispatch(actionCreators.lyricLineNumAction())
    },

    handleToggleVisible() {
      dispatch(actionCreators.playlistVisible())
    },

    onDragEnd(result) {
      const { oldIndex, newIndex } = result
      dispatch(actionCreators.moveSongAction({ source: oldIndex, destination: newIndex }))
    },
    handleInsertSong(song) {
      dispatch(actionCreators.insertSongAction(song))
    },

    nextSong() {
      dispatch(actionCreators.nextSongAction())
    },

    prevSong() {
      dispatch(actionCreators.prevSongAction())
    },

    handleEnded() {
      dispatch(actionCreators.prevSongAction())
    },

    handleChangeMode() {
      dispatch(actionCreators.changeModeAction())
    },
    handleItemClick(item) {
      dispatch(actionCreators.changeSongAction(item.toJS()))
      dispatch(actionCreators.playStateAction())
    }

  }
}


export default connect(mapState, mapDispatch)(Player)