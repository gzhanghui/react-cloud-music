/* eslint-disable react/prop-types */

import React, { Component, Fragment } from "react";
import { Spring, animated, config } from "react-spring";
import { connect } from "react-redux";
import classnames from "classnames";
import clickOutside from "click-outside";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import throttle from "lodash/throttle";
import { actionCreators } from "./store";

class Search extends Component {
  render() {
    return (
      <Fragment>
        <div className='search-wrap'>
          <div className='search-box'>
            <i className='iconfont icon-search icon-search-outline'></i>
            <input
              className='search-input'
              type='text'
              placeholder='搜索'
              onFocus={() => {
                this.props.togglePanel(true);
              }}
              value={this.props.keywords}
              onChange={(e) => {
                e.persist();
                const value = e.target.value;
                this.props.changeKeywords(value);
                if (!isEmpty(value)) {
                  this.props.getSearchSuggest(value);
                }
              }}
              data-outside={"input"}
            />
          </div>
          <Spring from={{ height: 0 }} to={{ height: this.props.visible ? 340 : 0 }} config={config.stiff}>
            {(styles) => {
              return (
                <animated.div
                  ref={(panel) => {
                    this.$panel = panel;
                  }}
                  style={styles}
                  className='search-result'
                >
                  <div className={classnames("search-result-hot", { hidden: !isEmpty(this.props.keywords) })}>
                    <ul>
                      {this.props.hot.map((item, index) => {
                        return (
                          <li
                            className='search-result-item search-result-item_hot'
                            onClick={() => {
                              this.props.handleSelect(item);
                            }}
                            key={item.first}
                          >
                            {index < 3 ? (
                              <Fragment>
                                <em className='search-result-num'>{index + 1}</em>
                                <span>{item.first}</span>
                              </Fragment>
                            ) : (
                              <span>{item.first}</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className={classnames("search-result-content", { hidden: isEmpty(this.props.keywords) })}>
                    {get(this.props.suggest, "order", []).map((key) => {
                      return (
                        <div key={key} className='search-result-list'>
                          <div className='search-result-title'>{this.props.searchResult[key]}</div>
                          <ul className={`search-result-${key}`}>
                            {get(this.props.suggest, [key], []).map((item) => {
                              return (
                                <li className={`search-result-item search-result-item_${key}`} key={item.id}>
                                  {item.name}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </animated.div>
              );
            }}
          </Spring>
        </div>
      </Fragment>
    );
  }
  componentDidMount() {
    this.$panel.addEventListener("click", () => {
      console.log(1111);
    });
    this.clickOutside = clickOutside(this.$panel, (e) => {
      if (e.target.getAttribute("data-outside") !== "input") {
        this.props.togglePanel(false);
      }
    });
    this.props.initData();
  }
  componentWillUnmount() {
    this.clickOutside();
  }
}

const mapStateToProps = (state) => {
  return {
    visible: state.getIn(["search", "visible"]),
    hot: state.getIn(["search", "hot"]),
    suggest: state.getIn(["search", "suggest"]),
    keywords: state.getIn(["search", "keywords"]),
    searchResult: { songs: "单曲", artists: "歌手", albums: "专辑", playlists: "歌单" },
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    togglePanel(visible) {
      dispatch(actionCreators.toggleSearchPanelAction(visible));
    },
    initData() {
      dispatch(actionCreators.getSearchHot());
    },
    changeKeywords(keywords) {
      dispatch(actionCreators.changeKeywords(keywords));
    },
    getSearchSuggest: throttle((keywords) => {
      dispatch(actionCreators.getSearchSuggest(keywords));
    }, 1000),
    handleSelect(item) {
      dispatch(actionCreators.changeKeywords(item.first));
      dispatch(actionCreators.getSearchSuggest(item.first));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
