/* eslint-disable react/prop-types */

import React from "react";
import { connect } from "react-redux";
import { Popover } from "antd";

import Dialog from "@/components/dialog";

import { actionCreators } from "./store";
import { get } from "lodash";
class Login extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // this.props.initLoginStatus();
  }

  render() {
    return (
      <React.Fragment>
        <div className='user-wrap '>
          {this.props.status ? (
            <React.Fragment>
              <Popover
                defaultOpen={false}
                className='user-popover'
                mouseEnterDelay={0.1}
                placement='rightTop'
                content={
                  <div className='user-popover-content' style={{ height: "auto", width: "216px", backgroundImage: `url(${get(this.props.userinfo, "profile.backgroundUrl")})` }}>
                    <div className='user-popover-nav'>
                      <a className='user-nav-link'>
                        <i className='iconfont icon-dynamic'></i>
                        <span>动态</span>
                      </a>
                      <a className='user-nav-link'>
                        <i className='iconfont icon-follow'></i>
                        <span>关注</span>
                      </a>
                      <a className='user-nav-link'>
                        <i className='iconfont icon-fans'></i>
                        <span>粉丝</span>
                      </a>
                    </div>
                    <div className='user-popover-menu'>
                      <div className='popover-menu-group'>
                        <a className='popover-menu-item'>
                          <i className='iconfont icon-crown'></i>
                          <span>会员中心</span>
                        </a>
                        <a className='popover-menu-item'>
                          <i className='iconfont icon-level'></i>
                          <span>等级</span>
                        </a>
                      </div>
                      <div className='popover-menu-group'>
                        <a className='popover-menu-item'>
                          <i className='iconfont icon-setting'></i>
                          <span>个人信息设置</span>
                        </a>
                        <a className='popover-menu-item' onClick={this.props.handleLoginOut}>
                          <i className='iconfont icon-logout'></i>
                          <span>退出登录</span>
                        </a>
                      </div>
                    </div>
                  </div>
                }
              >
                <div className='user-header'>
                  <div className='user-avatar'>
                    <img className='header-image' alt='' src={get(this.props.userinfo, "profile.avatarUrl")} />
                  </div>
                  <div className='user-info'>
                    <div className='user-name'>{get(this.props.userinfo, "profile.nickname")}</div>
                    <div className='user-level'>QQ绿钻Lv{get(this.props.userinfo, "profile.vipType")}</div>
                  </div>
                </div>
              </Popover>
            </React.Fragment>
          ) : (
            <div className='not-login' onClick={this.props.handleLLoginModal}>
              <i className='iconfont icon-user'></i>
              <div className='not-login-btn'>
                <span>未登录</span>
                <i className='iconfont icon-caret-right'></i>
              </div>
            </div>
          )}
        </div>

        <Dialog visible={this.props.visible}>
          <div className='login-wrapper'>
            <div className='login-container'>
              <div className='login-header'>
                <span className='title'>网易云音乐</span>
                <i onClick={this.props.handleLLoginModal} className='iconfont icon-close'></i>
              </div>
              <div className='login-form'>
                <div className='login-tab'>
                  <span className='selected'>密码登录</span>
                  <span>短信登录</span>
                </div>
                <div className='login-form-inner'>
                  <div className='login-item'>
                    <input
                      type='text'
                      onChange={(e) => {
                        e.persist();
                        this.props.changAccount(e);
                      }}
                      className='account'
                      maxLength='40'
                      value={this.props.account}
                      placeholder='请输入手机号/邮箱'
                    ></input>
                  </div>
                  <div className='login-item'>
                    <input
                      type='password'
                      onChange={(e) => {
                        e.persist();
                        this.props.changPassword(e);
                      }}
                      className='password'
                      maxLength='20'
                      placeholder='请输入密码'
                    />
                  </div>
                </div>
                <div className='login-btn'>
                  <div className='btn-common'>
                    <div
                      className='btn-inner btn-major'
                      onClick={() => {
                        this.props.handleLogin(this.props);
                      }}
                    >
                      登录
                    </div>
                  </div>
                </div>
                <div className='login-sns'>
                  <div className='sns-title'>其他方式登录</div>
                  <div className='sns-list'>
                    <a href='javascript:;'>
                      <i className='iconfont icon-wechat'></i>
                    </a>
                    <a href='javascript:;'>
                      <i className='iconfont icon-qq'></i>
                    </a>
                    <a href='javascript:;'>
                      <i className='iconfont icon-sina'></i>
                    </a>
                    <a href='javascript:;'>
                      <i className='iconfont icon-netease'></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </React.Fragment>
    );
  }
}

const mapState = (state) => {
  return {
    visible: state.getIn(["login", "visible"]),
    account: state.getIn(["login", "account"]),
    password: state.getIn(["login", "password"]),
    status: state.getIn(["login", "status"]),
    userinfo: state.getIn(["login", "userinfo"]),
  };
};

const mapDispatch = (dispatch) => {
  return {
    initLoginStatus() {
      dispatch(actionCreators.getLoginStatusAction());
    },
    handleLogin(props) {
      dispatch(actionCreators.loginAction(props.account, props.password));
    },
    handleLLoginModal() {
      dispatch(actionCreators.changeVisibleAction());
    },
    changAccount(e) {
      dispatch(actionCreators.changAccountAction(e.target.value));
    },
    changPassword(e) {
      dispatch(actionCreators.changPasswordAction(e.target.value));
    },
    handleLoginOut() {
      dispatch(actionCreators.logoutAction());
    },
  };
};

export default connect(mapState, mapDispatch)(Login);
