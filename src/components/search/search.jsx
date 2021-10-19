/* eslint-disable */
import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input, Avatar, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useSpring, animated } from "@react-spring/web";
import classNames from "classnames";
import { formatName } from "common/js/song";
import { useSelector, useDispatch } from "react-redux";
import { debounce, isEmpty } from "lodash";
import Scroll from "@/components/scroll";
import utils from "@/common/js/util";
import {
  togglePanel,
  panelVisible,
  getHotDetailThunk,
  getSuggestThunk,
  searchSuggest,
  historySearch,
  clearSearchSuggest,
  clearHistory,
  hotSearch,
  setHistorySearch,
  searchWord,
  setSearchWord,
} from "./search-slice";
export default function Search() {
  const suggest = useSelector(searchSuggest);
  const hot = useSelector(hotSearch);
  const word = useSelector(searchWord);
  const historyData = useSelector(historySearch);
  const visible = useSelector(panelVisible);
  const dispatch = useDispatch();
  const $panelRef = useRef(null);
  const $scroll = useRef(null);
  const $containerRef = useRef(null);
  const preventBlurRef = useRef(false);
  useEffect(() => {
    dispatch(getHotDetailThunk());
  }, []);
  useEffect(() => {
    $scroll.current.refresh();
  }, [suggest]);
  const getSuggest = debounce(function (val) {
    dispatch(getSuggestThunk(val));
  }, 300);
  useEffect(() => {
    if (!word || isEmpty(`${word}`.trim())) {
      dispatch(clearSearchSuggest());
    } else {
      getSuggest(word);
    }
  }, [word]);

  useEffect(() => {
    window.addEventListener("mousedown", (e) => {
      const target = utils.getTargetFromEvent(e);
      const clickedOutside = isClickOutside(target);
      //  preventBlurRef.current = !clickedOutside;

      if (!clickedOutside) {
        preventBlurRef.current = true;
        // Always set back in case `onBlur` prevented by user
        requestAnimationFrame(() => {
          preventBlurRef.current = false;
        });
      } else {
        if (clickedOutside) dispatch(togglePanel(false));
      }
    });
  }, []);

  const opacity = useSpring({
    from: { opacity: 0, height: 0 },
    to: { opacity: visible ? 1 : 0, height: visible ? 435 : 0 },
    onStart() {},
    onRest() {
      $scroll.current.refresh();
    },
    config: {
      tension: 500,
    },
  });

  /**
   * 历史
   * @param {Array} data
   * @returns
   */
  function renderHistory(data) {
    return (
      <React.Fragment>
        <div className="search-result-title">
          <span>搜索历史</span>
          <Button
            icon={<i className="iconfont icon-trash"></i>}
            type="link"
            onClick={() => {
              dispatch(clearHistory("all"));
            }}
          >
            清除记录
          </Button>
        </div>
        {data.map((word, index) => {
          return (
            <div
              key={`history-${word}`}
              className="search-result-item search-item-history"
              onClick={() => {
                dispatch(setSearchWord(word));
              }}
            >
              <span>{word}</span>
              <Button
                className="clear-history-btn"
                type="link"
                icon={<CloseOutlined />}
                onClick={() => {
                  dispatch(clearHistory(index));
                }}
              ></Button>
            </div>
          );
        })}
      </React.Fragment>
    );
  }
  /**
   * 热门搜索
   * @param {Array} data
   * @returns
   */
  function renderHot(data) {
    return (
      <React.Fragment>
        <div className="search-result-title">
          <span>热门搜索</span>
        </div>
        {data.map((item, index) => {
          return (
            <div
              key={item["searchWord"]}
              className="search-result-item search-result-simple"
              onClick={() => {
                dispatch(setSearchWord(item.searchWord));
              }}
            >
              <em
                className={classNames("search-result-num", { top: index < 3 })}
              >
                {index + 1}
              </em>
              <span className="search-result-text">{item.searchWord}</span>
            </div>
          );
        })}
      </React.Fragment>
    );
  }

  function renderSongs(data) {
    return (
      <React.Fragment>
        <div className="search-result-title ">
          <span>单曲</span>
        </div>
        {data.map((item) => {
          return (
            <div key={item.id} className="search-result-item search-item-song">
              <span>
                {item.name}-<em>{item.artists}</em>
              </span>
            </div>
          );
        })}
      </React.Fragment>
    );
  }

  function renderPlaylists(data) {
    return (
      <React.Fragment>
        <div className="search-result-title">
          <span>歌单</span>
        </div>
        {data.map((item) => {
          return (
            <div
              key={item.id}
              className="search-result-item search-item-playlist"
            >
              <span>{item.name}</span>
              <span>
                <i className="iconfont icon-list"></i>
              </span>
            </div>
          );
        })}
      </React.Fragment>
    );
  }

  function renderArtists(data) {
    return (
      <React.Fragment>
        <div className="search-result-title">
          <span>歌手</span>
        </div>
        {data.map((item) => {
          return (
            <Link
              to={{
                pathname: "/search-result",
                search: `?name=${item.name}&id=${item.id}`,
              }}
              key={item.id}
              onClick={() => {
                dispatch(togglePanel(false));
              }}
            >
              <Avatar shape="circle" src={item.picUrl} />
              <span className="artist">{item.name}</span>
            </Link>
          );
        })}
      </React.Fragment>
    );
  }

  function renderAlbums(data) {
    return (
      <React.Fragment>
        <div className="search-result-title">
          <span>专辑</span>
        </div>
        {data.map((item) => {
          return (
            <div
              key={`${item.id}`}
              className="search-result-item search-item-albums"
            >
              {item.name}
            </div>
          );
        })}
      </React.Fragment>
    );
  }
  const searchSuggestMap = {
    songs: renderSongs,
    playlists: renderPlaylists,
    artists: renderArtists,
    albums: renderAlbums,
  };

  function renderSearchSuggest(data) {
    const keys = Object.keys(data);
    return keys.map((name) => {
      let itemData = data[name];
      if (name === "songs") {
        itemData = data.songs.map((song) => ({
          name: song.name,
          id: `${song.id}`,
          artists: formatName(song.artists),
        }));
      }
      return searchSuggestMap[name](itemData);
    });
  }
  // eslint-disable-next-line no-unused-vars
  function isClickOutside(target) {
    return !utils.elementsContains(
      [$panelRef.current, $containerRef.current],
      target
    );
  }

  return (
    <React.Fragment>
      <div className="search-wrap" ref={$containerRef}>
        <Input
          value={word}
          prefix={<i className="iconfont icon-search"></i>}
          placeholder="搜索"
          onFocus={() => {
            dispatch(togglePanel(true));
          }}
          onBlur={() => {
            setTimeout(() => {
              let { activeElement } = document;
              while (activeElement && activeElement.shadowRoot) {
                activeElement = activeElement.shadowRoot.activeElement;
              }
              if (preventBlurRef.current || !isClickOutside(activeElement)) {
                return;
              }
              dispatch(togglePanel(false));
            }, 0);
          }}
          onChange={(e) => {
            dispatch(setSearchWord(e.target.value));
          }}
          onPressEnter={(e) => {
            if (!e.target.value.trim().length) return;
            dispatch(setHistorySearch(e.target.value));
          }}
        />
        <animated.div
          style={opacity}
          className={classNames("search-panel")}
          ref={$panelRef}
        >
          <Scroll ref={$scroll}>
            <div
              className={classNames("history-hot-panel", {
                hide: !isEmpty(word),
              })}
            >
              <div>{renderHistory(historyData)}</div>
              <div>{renderHot(hot)}</div>
            </div>
            <div
              className={classNames("search-suggest-panel", {
                hide: isEmpty(word),
              })}
            >
              {renderSearchSuggest(suggest)}
            </div>
          </Scroll>
        </animated.div>
      </div>
    </React.Fragment>
  );
}
