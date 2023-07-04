import React from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { Spring, animated, to } from "react-spring";
import debounce from "lodash/debounce";
import "./style.less";

class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.node = window.document.createElement("div");
    this.node.setAttribute("class", "dialog");
    window.document.body.appendChild(this.node);
    this.onResize = this.onResize.bind(this);
  }
  componentWillUnmount() {
    window.document.body.removeChild(this.node);
    window.removeEventListener("resize", debounce(this.onResize, 200));
  }
  componentDidMount() {
    window.addEventListener("resize", this.onResize);
  }
  onResize() {
    const { top, left } = this.calcPosition();
    this.$content.style.top = top + "px";
    this.$content.style.left = left + "px";
  }
  calcPosition() {
    let { width, height } = this.props;
    width = width ? parseInt(width) : this.$content.getBoundingClientRect().width;
    height = height ? parseInt(height) : this.$content.getBoundingClientRect().height;
    const clientHeight = document.body.clientHeight;
    const clientWidth = document.body.clientWidth;
    const left = clientWidth / 2 - width / 2;
    const top = clientHeight / 2 - height / 2;
    return { top: parseInt(top), left: parseInt(left) };
  }
  render() {
    const { visible, width, height } = this.props;
    const { top, left } = this.calcPosition();
    return createPortal(
      <Spring
        from={{ opacity: 0 }}
        to={{ opacity: visible ? 1 : 0 }}
        onStart={(result) => {
          if (result.value.opacity < 0.5) {
            this.$backdrop.style.display = "inline-block";
          }
        }}
        onRest={(result) => {
          if (result.finished && result.value.opacity === 0) {
            this.$backdrop.style.display = "none";
          }
        }}
      >
        {(styles) => {
          return (
            <React.Fragment>
              <Spring scale={visible ? 1 : 0} config={{ duration: 250 }}>
                {({ scale }) => {
                  return (
                    <animated.div
                      className='dialog-content'
                      style={{
                        width,
                        height,
                        top: top + "px",
                        left: left + "px",
                        transform: to([scale.to({ range: [0, 0.5, 1], output: [0, 1.1, 1] })], (scale) => `scale(${scale})`),
                      }}
                      ref={(content) => {
                        this.$content = content;
                      }}
                    >
                      {this.props.children}
                    </animated.div>
                  );
                }}
              </Spring>
              <animated.div
                style={styles}
                className='dialog-backdrop'
                ref={(backdrop) => {
                  this.$backdrop = backdrop;
                }}
              ></animated.div>
            </React.Fragment>
          );
        }}
      </Spring>,
      this.node
    );
  }
}

Dialog.propTypes = {
  children: PropTypes.element,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  visible: PropTypes.bool,
};

Dialog.defaultProps = {
  visible: false,
  width: "360px",
  height: "420px",
};

export default Dialog;
