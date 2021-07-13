import React from 'react';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Scroll from 'components/scroll';
import Home from 'pages/home/home'
import Player from 'components/player/player'
import {carouselItem} from 'pages/home/home-slice'
const { Header, Footer, Sider, Content } = Layout;
function App() {
const currentItem = useSelector(carouselItem)
  return (
    <React.Fragment>
      <Layout>
        <Layout>
          <Router>
            <Sider>
              <div style={{ position: 'relative', zIndex: 10, height: '100%' }}>
                <div>
                  <div className="user">
                    <div className="avatar">{/**/}</div>
                    <div className="name">
                      <div>漩涡朱弟</div>
                      <div>漩涡朱弟</div>
                    </div>
                  </div>
                  <div className="tab-list">
                    <div className="list-item">

                      <ul>
                        <li className="active"> <Link to="/"><i className="iconfont icon-musicfill">{/**/}</i><span>发现音乐</span></Link></li>
                        <li><Link to="/bubblegum"> <i className="iconfont icon-record">{/**/}</i><span>视频MV</span></Link></li>
                        <li> <Link to="/bubblegum"><i className="iconfont icon-apps">{/**/}</i><span>歌单</span></Link></li>
                        <li><Link to="/bubblegum"><i className="iconfont icon-wefill">{/**/}</i><span>电台</span></Link></li>
                        <li><Link to="/bubblegum"><i className="iconfont icon-hot">{/**/}</i><span>榜单</span></Link></li>
                      </ul>

                    </div>
                    <div className="list-item">
                      <h3 className="title">我的音乐</h3>
                      <ul>
                        <li><i className="iconfont icon-like">{/**/}</i><span>我喜欢的</span></li>
                        <li><i className="iconfont icon-time">{/**/}</i><span>播放历史</span></li>
                      </ul>
                    </div>
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
                    </Switch>
                  </Scroll>
                </div>
              </Content>
            </Layout>
            <div className="blur-bg" style={{backgroundImage:`url(${currentItem.imageUrl})`}}></div>
            <div className="blur-mask"></div>
          </Router>
        </Layout>
        <Footer>
          <Player/>
        </Footer>
      </Layout>

    </React.Fragment>
  );
}

export default App;
