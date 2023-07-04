/* eslint-disable react/prop-types */

import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { actionCreators } from "./store";
import { get } from "lodash";

class Menu extends Component {
  render() {
    return (
      <Fragment>
        <div className='menu'>
          <div className='menu-module'>
            <ul>
              <li className='list-item'>
                <NavLink exact to='/'>
                  <i className='iconfont icon-discover'></i>
                  <span>发现音乐</span>
                </NavLink>
              </li>

              <li className='list-item'>
                <NavLink exact to='/toplist'>
                  <i className='iconfont icon-barchart'></i>
                  <span>榜单</span>
                </NavLink>
              </li>
              <li className='list-item'>
                <NavLink exact to='/playlist'>
                  <i className='iconfont icon-apps'></i>
                  <span>歌单</span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className='menu-module'>
            <div className='menu-module-title'>我的音乐</div>
            <ul>
              <li className='list-item'>
                <NavLink exact to={`/like/${get(this.props.like, "[0].id")}`}>
                  <i className='iconfont icon-like'></i>
                  <span>我喜欢的</span>
                </NavLink>
              </li>
              <li className='list-item'>
                <NavLink exact to='/record'>
                  <i className='iconfont icon-time-circle'></i>
                  <span>播放历史</span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className='menu-module'>
            <div className='menu-module-title'>
              <span>我创建的歌单</span>
            </div>
            <ul>
              {this.props.playlist
                .filter((item) => item.specialType === 0)
                .map((item) => {
                  return (
                    <li className='list-item' key={item.id}>
                      <NavLink exact to={`/playlist/${item.id}`}>
                        <i className='iconfont icon-dot'></i>
                        <span>{item.name}</span>
                      </NavLink>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </Fragment>
    );
  }
  componentDidMount() {
    this.props.initData();
  }
}

const mapStateToProps = (state) => {
  return {
    playlist: state.getIn(["menu", "playlist"]),
    like: state.getIn(["menu", "playlist"]).filter((item) => item.specialType === 5),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    initData() {
      dispatch(actionCreators.initLoginStatus());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
