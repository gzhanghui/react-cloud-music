/* eslint-disable react/prop-types */

import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Tabs } from "antd";
import SongList from "./list";

class Record extends Component {
  render() {
    console.log(this.props.recordlist);
    return (
      <Fragment>
        <div className='likeList like-wrap'>
          <div className='playlist-content'>
            <Tabs
              defaultActiveKey='tab-playlist'
              items={[
                {
                  label: `最近播放`,
                  key: "tab-playlist",
                  children: <SongList list={this.props.recordlist} onToggleLike={this.props.onToggleLike} onTogglePlay={this.props.onTogglePlay}></SongList>,
                },
              ]}
            ></Tabs>
          </div>
        </div>
      </Fragment>
    );
  }
  componentDidMount() {}
}

const mapStateToProps = (state) => {
  return {
    recordlist: state.getIn(["record", "record"]),
  };
};
const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Record));
