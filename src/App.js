/* eslint-disable react/prop-types */
import React from "react";
import get from "lodash/get";
import { connect } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "swiper/swiper-bundle.min.css";
// import "swiper/css/grid";

import Scroll from "components/scroll/scroll";
import Home from "@/views/discover/index.jsx";
import Player from "@/components/player";
import Login from "@/components/login";
import Like from "@/views/like";
import Playlist from "@/views/playlist";
import Rank from "@/views/toplist/index.jsx";

import Search from "components/search";
import Menu from "components/menu";
import Record from "@/views/record";

class App extends React.Component {
  render() {
    const currentItem = this.props.banner[this.props.bannerIndex];
    return (
      <React.Fragment>
        <div className='page-wrapper'>
          <div className='container'>
            <div className='main'>
              <BrowserRouter>
                <div className='aside'>
                  <Login></Login>
                  <Menu></Menu>
                </div>
                <div className='content'>
                  <div className='header-wrap'>
                    <Search></Search>
                  </div>
                  <div className='view'>
                    <Scroll>
                      <Switch>
                        <Route path='/' exact={true}>
                          <Home />
                        </Route>
                        <Route path='/toplist' exact={true}>
                          <Rank />
                        </Route>
                        <Route path='/like/:id' exact={true}>
                          <Like />
                        </Route>
                        <Route path='/playlist' exact={true}>
                          <Playlist />
                        </Route>
                        <Route path='/record' exact={true}>
                          <Record />
                        </Route>
                      </Switch>
                    </Scroll>
                  </div>
                </div>
              </BrowserRouter>
            </div>
            <div className='footer'>
              <Player />
            </div>
          </div>

          <div className='blur-bg' style={{ backgroundImage: `url(${get(currentItem, "imageUrl", "")})` }}></div>
          <div className='blur-mask'></div>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    banner: state.getIn(["discover", "banner"]),
    bannerIndex: state.getIn(["discover", "bannerIndex"]),
  };
};
const mapDispatchToProps = () => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
