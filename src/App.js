import React from 'react';
import { Layout } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom";
import Scroll from 'components/scroll';
import Home from 'pages/home/home'
import Like from 'pages/like/like';
import Player from 'components/player/player'
import { carouselItem } from 'pages/home/home-slice'
import Login from 'components/login/login'
import { setLoginBox } from 'components/login/login-slice'
const { Header, Footer, Sider, Content } = Layout;
function App() {
  const currentItem = useSelector(carouselItem)
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <Router>
        <Layout  style={{height:'100%',overflow:'hidden'}}>
          <Layout>
            <Sider>
              <div>
              <div className="user">
                    <div className="avatar">
                      <img src='https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' />
                    </div>
                    <div className="info">
                      <div className="name">漩涡朱弟</div>
                      <div className="level">qq绿钻Lv5</div>
                    </div>
                    <div className="state" onClick={() => { dispatch(setLoginBox(true)) }}>
                      <div>请登录</div>
                    </div>
                    <Login />
                  </div>
                  <div className="tab-list">
                    <div className="list-item">
                      <ul>
                        <li><NavLink exact to="/"><i className="iconfont icon-musicfill"></i><span>发现音乐</span></NavLink></li>
                        <li><NavLink to="/bubblegum"> <i className="iconfont icon-record"></i><span>视频MV</span></NavLink></li>
                        <li><NavLink to="/bubblegum"><i className="iconfont icon-apps"></i><span>歌单</span></NavLink></li>
                        <li><NavLink to="/bubblegum"><i className="iconfont icon-wefill"></i><span>电台</span></NavLink></li>
                        <li><NavLink to="/bubblegum"><i className="iconfont icon-hot"></i><span>榜单</span></NavLink></li>
                      </ul>
                    </div>
                    <div className="list-item">
                      <h3 className="title">我的音乐</h3>
                      <ul>
                        <li><NavLink to="/like"> <i className="iconfont icon-like"></i><span>我喜欢的</span></NavLink></li>
                        <li><NavLink to="/history"><i className="iconfont icon-time"></i><span>播放历史</span></NavLink></li>
                      </ul>
                    </div>
                  </div>
               
              </div>
            </Sider>
            <Layout>
              <Header>Header</Header>
              <Content>
                <div className="container">
                  <Scroll>
                    <Switch>
                      <Route exact path="/">
                        <Home />
                      </Route>
                      <Route exact path="/like">
                        <Like />
                      </Route>
                    </Switch>
                  </Scroll>
                </div>
              </Content>
            </Layout>
          </Layout>
          <Footer style={{ height: '80px',padding:0 }}>
            <Player style={{display:'none'}}/>
          </Footer>
        </Layout>
        <div className="blur-bg" style={currentItem.imageUrl && {  backgroundImage: `url(${currentItem.imageUrl})` }}></div>
        <div className="blur-mask"></div>
      </Router>
    </React.Fragment>
  );
}

export default App;
