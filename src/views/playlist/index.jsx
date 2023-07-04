/* eslint-disable react/prop-types */

import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { Col, Row, Tag, Divider, Badge } from "antd";

import { connect } from "react-redux";
import { actionCreators } from "./store";
class Playlist extends Component {
  render() {
    return (
      <Fragment>
        <div className='playlist'>
          <Row gutter={{ md: 24, lg: 24 }}>
            <Col span={18}>
              <Row gutter={{ md: 24, lg: 24 }}>
                {this.props.playlist.list.map((item) => {
                  return (
                    <Col key={item.id} md={{ span: 6 }} lg={{ span: 4 }}>
                      <div className='playlist-item-wrap'>
                        <div className='playlist-cover'>
                          {item.highQuality && <span className='cover-tag'>精选</span>}
                          <img src={item.coverImgUrl} alt='' width='100%' className='playlist-image' />
                        </div>
                        <p className='name'> {item.name}</p>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Col>
            <Col span={6}>
              {/* <div>
                {this.props.hotTags.map((item) => {
                  return <Tag key={item.id}>{item.name}</Tag>;
                })}
              </div>
              <Divider /> */}
              <div className='tag-wrap'>
                <div className='tag-title'>精选标签</div>
                <div className='tag-content'>
                  {this.props.highQualityTags.map((item) => {
                    return <Tag key={item.id}>{item.name}</Tag>;
                  })}
                </div>
              </div>
              <Divider />

              <div className='tag-wrap'>
                <div className='tag-title'>歌单标签</div>
                <div>
                  <Row gutter={{ md: 24, lg: 24 }} justify='start'>
                    {Object.keys(this.props.catalogue.categories).map((key) => {
                      return (
                        <Col key={key} span={8}>
                          <div className={`categories categories-${key}`}>
                            <div className='categories-item'>
                              {/* <img width='100%' src='https://mrmockup.com/wp-content/uploads/2022/01/09-Stationery-Mockups-B.jpeg' /> */}
                              {/* <i className={`iconfont icon-categories-${key}`}></i> */}
                            </div>
                          </div>
                          <span>{this.props.catalogue.categories[key]}</span>
                        </Col>
                      );
                    })}
                  </Row>
                </div>

                <div>
                  {this.props.catalogue.sub.map((item) => {
                    return (
                      <Badge dot={item.hot} showZero={item.hot} key={item.id}>
                        <Tag>{item.name}</Tag>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </Col>
          </Row>
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
    playlist: state.getIn(["playlist", "playlist"]).toJS(),
    catalogue: state.getIn(["playlist", "catalogue"]).toJS(),
    highQualityTags: state.getIn(["playlist", "highQualityTags"]),
    hotTags: state.getIn(["playlist", "hotTags"]),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    initData() {
      dispatch(actionCreators.playlistAction());
      dispatch(actionCreators.catalogueAction());
      dispatch(actionCreators.highQualityTagsAction());
      dispatch(actionCreators.hotTagsAction());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Playlist));
