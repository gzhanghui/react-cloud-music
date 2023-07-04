import React, { Component, Fragment } from "react";
import Scrollbar from "smooth-scrollbar";
import PropTypes from "prop-types";

class Scroll extends Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
    this.scroll = null;
    // this.scrollToElement = this.scrollToElement.bind(this);
  }
  render() {
    return (
      <Fragment>
        <div className='scroll-wrapper' ref={this.wrapper} style={{ height: "100%" }}>
          <div className='scroll-content'>{this.props.children}</div>
        </div>
      </Fragment>
    );
  }

  componentDidMount() {
    this.scroll = Scrollbar.init(this.wrapper.current, this.props.options);
    console.log(this.scroll);
  }
  refresh() {}
  scrollTo() {}
}

Scroll.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  options: PropTypes.object,
};
Scroll.defaultProps = {
  children: {},
  options: {
    damping: 0.1,
    thumbMinSize: 20,
    renderByPixels: true,
    alwaysShowTracks: false,
    continuousScrolling: true,
    delegateTo: null,
  },
};

export default Scroll;
