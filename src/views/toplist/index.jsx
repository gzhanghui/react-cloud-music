/* eslint-disable react/prop-types */

import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { actionCreators } from "./store";

class Toplist extends Component {
  render() {
    return (
      <Fragment>
        <div>
          {this.props.toplist.map((item) => {
            return <div key={item.id}>{item.name}</div>;
          })}
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
    toplist: state.getIn(["toplist", "toplist"]),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    initData() {
      dispatch(actionCreators.toplistAction());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Toplist));
