/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper";

import Scroll from "@/components/scroll";
import Card from '@/components/card/index'
import Player from '@/components/player'
import SongList from '@/components/song-list'
import Carousel from '@/components/carousel'


import { actionCreators } from './store'
import { changeSongAction, playStateAction } from '../../components/player/store/actions'

class Home extends Component {

  componentDidMount() {
    this.props.handleInitData()
  }

  render() {
    return (
      <div className="container" >
        <div className="main">
          <div className="aside">
            Aside
          </div>
          <div className="main-warp">
            <Scroll>
              <div className="carousel">
                <Carousel
                  interval="4000"
                  type="card"
                  height="200px"
                  autoplay={false}
                  onChange={(index) => { this.props.handleBannerChange(index) }}
                >
                  {this.props.banner.map((item) => {
                    return (
                      <Carousel.Item key={item.imageUrl}>
                        <img src={item.imageUrl} alt={item.typeTitle} height="100%" width="100%" />
                      </Carousel.Item>
                    );
                  })}
                </Carousel>
              </div>
              <Card header="推荐歌单" extra={<span className="extra"><button className="prev-button icon-arrow-left iconfont"></button><button className="next-button icon-arrow-right iconfont"></button></span>} headerClassName="featured-card featured-warp">
                <div className="featured" ref={(scroll) => { this.scrollRef = scroll }}>
                  <div className="featured-content" >
                    <Swiper slidesPerView={'auto'}
                      modules={[Navigation]}
                      navigation={{
                        nextEl: '.next-button',
                        prevEl: '.prev-button',
                      }}
                      slidesPerGroupAuto={true}
                      spaceBetween={16}>
                      {this.props.playlist.map(item => {
                        return <SwiperSlide key={item.id}><div className="featured-item">
                          <img className="image" width="100%" src={item.picUrl} />
                          <p className="name">{item.name}</p>
                        </div></SwiperSlide>
                      })}
                    </Swiper>
                  </div>
                </div>
              </Card>
              <Card header="推荐歌单" extra={<span className="extra"><a className="more-btn"><span>更多</span><i className="icon-arrow-right iconfont"></i></a></span>} headerClassName="">
                <SongList list={this.props.recommendSongs} onSelectedItem={this.props.selectedItem}></SongList>
              </Card>
            </Scroll>
          </div>
        </div>
        <div className="footer">
          <Player />
        </div>
      </div>
    )
  }

}
const mapStateToProps = (state) => {
  return {
    banner: state.getIn(['recommend', 'banner']),
    playlist: state.getIn(['recommend', 'playlist']),
    recommendSongs: state.getIn(['recommend', 'recommendSongs']),
    bannerIndex: state.getIn(['recommend', 'bannerIndex'])
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    handleInitData() {
      dispatch(actionCreators.getRecommendPlaylistAction())
      dispatch(actionCreators.getRecommendSongsAction())
      dispatch(actionCreators.getBannerAction())
    },
    selectedItem(item) {
      dispatch(actionCreators.insertSongAction(item))
      dispatch(changeSongAction(item))
      dispatch(playStateAction(true))


    },
    handleBannerChange(index) {
      dispatch(actionCreators.bannerChangeAction(index))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(Home)