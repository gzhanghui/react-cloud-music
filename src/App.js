import React from 'react';
import {Layout} from 'antd';
import {useSelector} from 'react-redux';
import {BrowserRouter as Router, Switch, Route, NavLink} from "react-router-dom";
import Scroll from 'components/scroll';
import Home from 'pages/home/home'
import Like from 'pages/like/like';
import Mv from 'pages/mv/mv';
import Player from 'components/player/player'
import Account from 'components/account/account'
import SearchResult from 'pages/search-result/search-result'
import {carouselItem} from 'pages/home/home-slice'
import Login from 'components/login/login'
import Search from 'components/search/search';
const {Header, Footer, Sider, Content} = Layout;

function App() {
    const currentItem = useSelector(carouselItem)
    return (
        <React.Fragment>
            <Router>
                <Layout style={{height: '100%', overflow: 'hidden'}}>
                    <Layout>
                        <Sider>
                            <div>
                                <div className="user">
                                    <Account/>
                                    <Login/>
                                </div>
                                <div className="tab-list">
                                    <div className="list-item">
                                        <ul>
                                            <li>
                                                <NavLink exact to="/">
                                                    <i  className="iconfont icon-musicfill"></i>
                                                    <span>发现音乐</span>
                                                </NavLink>
                                            </li>
                                            <li><NavLink to="/search-result"> <i
                                                className="iconfont icon-record"></i><span>视频MV</span></NavLink></li>
                                            <li><NavLink to="/bubblegum"><i
                                                className="iconfont icon-apps"></i><span>歌单</span></NavLink></li>
                                            <li><NavLink to="/bubblegum"><i
                                                className="iconfont icon-wefill"></i><span>电台</span></NavLink></li>
                                            <li><NavLink to="/bubblegum"><i
                                                className="iconfont icon-hot"></i><span>榜单</span></NavLink></li>
                                        </ul>
                                    </div>
                                    <div className="list-item">
                                        <div className="title"><span>我的音乐</span></div>
                                        <ul>
                                            <li><NavLink to="/like"> <i
                                                className="iconfont icon-like"></i><span>我喜欢的</span></NavLink></li>
                                            <li><NavLink to="/history"><i
                                                className="iconfont icon-time"></i><span>播放历史</span></NavLink></li>
                                            <li><NavLink to="/history"><i
                                                className="iconfont icon-download"></i><span>下载管理</span></NavLink></li>
                                            <li><NavLink to="/history"><i
                                                className="iconfont icon-folder"></i><span>本地音乐</span></NavLink></li>
                                        </ul>
                                    </div>
                                    <div className="list-item">
                                        <div className="title">
                                            <span>我创建的歌单</span>
                                            <button className="add-icon"><i className="iconfont icon-add"></i></button>
                                        </div>
                                        <ul>
                                            <li><NavLink to="/like1"> <i
                                                className="iconfont icon-dot"></i><span>我喜欢的</span></NavLink></li>
                                            <li><NavLink to="/history"><i
                                                className="iconfont icon-dot"></i><span>播放历史</span></NavLink></li>
                                            <li><NavLink to="/history"><i
                                                className="iconfont icon-dot"></i><span>下载管理</span></NavLink></li>
                                            <li><NavLink to="/history"><i
                                                className="iconfont icon-dot"></i><span>本地音乐</span></NavLink></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Sider>
                        <Layout>
                            <Header>
                                <Search/>
                            </Header>
                            <Content>
                                <div className="container">
                                    <Scroll>
                                        <Switch>
                                            <Route exact path="/">
                                                <Home/>
                                            </Route>
                                            <Route exact path="/like">
                                                <Like/>
                                            </Route>
                                            <Route  path="/search-result">
                                                <SearchResult/>
                                            </Route>
                                            <Route  path="/mv-detail">
                                                <Mv/>
                                            </Route>
                                        </Switch>
                                    </Scroll>
                                </div>
                            </Content>
                        </Layout>
                    </Layout>
                    <Footer style={{height: '80px', padding: 0}}>
                        <Player style={{display: 'none'}}/>
                    </Footer>
                </Layout>
                <div className="blur-bg"
                     style={currentItem.imageUrl && {backgroundImage: `url(${currentItem.imageUrl})`}}></div>
                <div className="blur-mask"></div>
            </Router>
        </React.Fragment>
    );
}

export default App;
