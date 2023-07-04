import React, { Component, Fragment } from "react";
import BScroll from "@better-scroll/core";
import ScrollBar from "@better-scroll/scroll-bar";
import MouseWheel from "@better-scroll/mouse-wheel";
import PropTypes from "prop-types";

BScroll.use(MouseWheel);
BScroll.use(ScrollBar);
class Scroll extends Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
    this.scroll = null;
    this.scrollToElement = this.scrollToElement.bind(this);
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
    this.scroll = new BScroll(this.wrapper.current, {
      scrollY: true,
      scrollbar: this.props.scrollbar,
      bounce: false,
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300,
      },
    });
    this.scroll &&
      this.scroll.on("beforeScrollStart", () => {
        this.scroll.refresh();
      });
  }
  scrollToElement(el, time, offsetX, offsetY, easing) {
    this.scroll && this.scroll.scrollToElement(el, time, offsetX, offsetY, easing);
  }
  refresh() {
    this.scroll.refresh();
  }
  scrollTo(x, y, time, easing, extraTransform, isSilent) {
    this.scroll && this.scroll.scrollTo(x, y, time, easing, extraTransform, isSilent);
  }
}

Scroll.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  scrollbar: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  scrollX: PropTypes.oneOfType([PropTypes.bool]),
  scrollY: PropTypes.oneOfType([PropTypes.bool]),
  eventPassthrough: PropTypes.oneOfType([PropTypes.string]),
};
Scroll.defaultProps = {
  children: {},
  scrollbar: {
    fade: true,
    interactive: true,
  },
  scrollX: false,
  scrollY: true,
  eventPassthrough: "vertical",
};

export default Scroll;
