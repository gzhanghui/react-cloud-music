/* eslint-disable react/prop-types */

import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as dayjs from "dayjs";
import { Tabs } from "antd";
import { actionCreators } from "./store";
import SongList from "./list";

class Like extends Component {
  render() {
    const id = this.props.match.params.id;
    let info = this.props.playlist.filter((item) => `${item.id}` === id);
    info = info[0];
    return (
      <Fragment>
        <div className='likeList like-wrap'>
          {info && (
            <div className='likeList-info'>
              <div className='left-wrap'>
                <div className='cover'>
                  <img width={184} src={info.coverImgUrl} alt='' />
                </div>
              </div>

              <div className='right-wrap'>
                <div className='title'>
                  <span className='type'>歌单</span>
                  <span className='name'>{info.name}</span>
                </div>
                <div className='creator'>
                  <div className='avatar'>
                    <img width={24} src={info.creator.avatarUrl} alt='' />
                  </div>
                  <span className='nickname'>
                    <a>{info.creator.nickname}</a>
                  </span>
                  <span className='create-time'>{dayjs(info.createTime).format("YYYY-MM-DD")}创建</span>
                </div>
                <div className='btn-wrap'>
                  <button>
                    <i className='iconfont icon-play-circle'></i>
                    <span>播放全部</span>
                  </button>
                </div>
                <div className='count'>
                  <div className='track-count'>
                    <span>歌曲数</span>
                    <em>{info.trackCount}</em>
                  </div>
                  <div className='play-count'>
                    <span>播放数</span>
                    <em>{info.playCount}</em>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className='playlist-content'>
            <Tabs
              defaultActiveKey='tab-playlist'
              items={[
                {
                  label: `歌曲列表`,
                  key: "tab-playlist",
                  children: <SongList list={this.props.likeList} onToggleLike={this.props.onToggleLike} onTogglePlay={this.props.onTogglePlay}></SongList>,
                },
              ]}
            ></Tabs>
          </div>
        </div>
      </Fragment>
    );
  }
  componentDidMount() {}
}

const mapStateToProps = (state) => {
  return {
    likeList: state.getIn(["like", "likeList"]),
    playlist: state.getIn(["menu", "playlist"]),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    togglePanel(visible) {
      dispatch(actionCreators.toggleSearchPanelAction(visible));
    },
    onTogglePlay(item) {
      console.log(item);
    },
    onToggleLike(item) {
      console.log(item);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Like));
