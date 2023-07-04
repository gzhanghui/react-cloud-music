/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Grid } from "swiper";
import { Col, Row, Card } from "antd";

import Carousel from "@/components/carousel";
import SongList from "./list";

import { actionCreators } from "./store";
import { changeSongAction, playStateAction } from "../../components/player/store/actions";

class Discover extends Component {
  componentDidMount() {
    this.props.handleInitData();
  }

  render() {
    return (
      <React.Fragment>
        <div className='carousel'>
          <Carousel
            interval='4000'
            type='card'
            height='200px'
            autoplay={false}
            onChange={(index) => {
              this.props.handleBannerChange(index);
            }}
          >
            {this.props.banner.map((item) => {
              return (
                <Carousel.Item key={item.imageUrl}>
                  <img src={item.imageUrl} alt={item.typeTitle} height='100%' width='100%' />
                </Carousel.Item>
              );
            })}
          </Carousel>
        </div>
        <Card
          title='为你推荐'
          extra={
            <span className='extra'>
              <button className='prev-button icon-arrow-left iconfont'></button>
              <button className='next-button icon-arrow-right iconfont'></button>
            </span>
          }
          className='featured-card featured-warp'
        >
          <div
            className='featured'
            ref={(scroll) => {
              this.scrollRef = scroll;
            }}
          >
            <div className='featured-content'>
              <Swiper
                slidesPerView={"auto"}
                modules={[Navigation]}
                navigation={{
                  nextEl: ".next-button",
                  prevEl: ".prev-button",
                }}
                slidesPerGroupAuto={true}
                spaceBetween={16}
              >
                {this.props.playlist.map((item) => {
                  return (
                    <SwiperSlide key={item.id}>
                      <div className='featured-item'>
                        <img className='image' width='100%' src={item.picUrl} />
                        <p className='name'>{item.name}</p>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </Card>
        <Row>
          <Col span={13}>
            <Card
              title='最新音乐'
              extra={
                <a className='more-btn'>
                  <span>更多</span>
                  <i className='icon-arrow-right iconfont'></i>
                </a>
              }
            >
              <SongList list={this.props.newsong}></SongList>
            </Card>
          </Col>
          <Col span={11}>
            <Card
              title='排行榜'
              extra={
                <a className='more-btn'>
                  <span>更多</span>
                  <i className='icon-arrow-right iconfont'></i>
                </a>
              }
            >
              <div className='new-album'>
                <Swiper
                  slidesPerView={3}
                  grid={{
                    rows: 2,
                  }}
                  spaceBetween={30}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Grid]}
                  className='mySwiper'
                >
                  {this.props.newAlbum.map((item) => {
                    return (
                      <SwiperSlide key={item.id}>
                        <div className='album-item'>
                          <img className='album-pic' src={`${item.picUrl}`} alt='' />
                          <p className='album-name'> {item.name}</p>
                          <p className='album-artist'>{item.updateFrequency}</p>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  console.log(111);

  return {
    banner: state.getIn(["discover", "banner"]),
    playlist: state.getIn(["discover", "playlist"]),
    newsong: state.getIn(["discover", "newsong"]),
    newAlbum: state.getIn(["discover", "newAlbum"]),
    bannerIndex: state.getIn(["discover", "bannerIndex"]),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    handleInitData() {
      dispatch(actionCreators.getPlaylistAction());
      dispatch(actionCreators.getSongsAction());
      dispatch(actionCreators.getBannerAction());
      dispatch(actionCreators.getNewAlbumAction());
    },
    selectedItem(item) {
      dispatch(actionCreators.insertSongAction(item));
      dispatch(changeSongAction(item));
      dispatch(playStateAction(true));
    },
    handleBannerChange(index) {
      dispatch(actionCreators.bannerChangeAction(index));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(Discover);
