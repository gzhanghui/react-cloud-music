/* eslint-disable react/prop-types */
import React from 'react';
import get from 'lodash/get'
import { connect } from 'react-redux'
import 'swiper/swiper-bundle.min.css';

import Home from '@/views/recommend/index.jsx';


class App extends React.Component {
  render() {
    const currentItem = this.props.banner[this.props.bannerIndex]
    return (
      <React.Fragment>
        <div className="page-wrapper">
          <Home />
          <div className='blur-bg' style={{ backgroundImage: `url(${get(currentItem, 'imageUrl', '')})` }}></div>
          <div className="blur-mask"></div>
        </div>
      </React.Fragment >
    );
  }
}
const mapStateToProps = (state) => {
  return {
    banner: state.getIn(['recommend', 'banner']),
    bannerIndex: state.getIn(['recommend', 'bannerIndex']),
  }
}
const mapDispatchToProps = () => {
  return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
