/* eslint-disable */
import React, { useRef, useEffect, useCallback } from "react";
import { Input, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useSpring, animated } from "@react-spring/web";
import classNames from "classnames";
// import { formatName } from "common/js/song";
import { useSelector, useDispatch } from "react-redux";
import { debounce, isEmpty, get } from "lodash";
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
  selectItem,
  setSelectItem
} from "./search-slice";
import { insertSong, changeIndex } from "components/player/player-slice";



export default function Search() {
  const suggest = useSelector(searchSuggest);
  const hot = useSelector(hotSearch);
  const word = useSelector(searchWord);
  const historyData = useSelector(historySearch);
  const visible = useSelector(panelVisible);
  const select = useSelector(selectItem)
  const dispatch = useDispatch();
  const $panelRef = useRef(null);
  const $scroll = useRef(null);
  const $containerRef = useRef(null);
  const $input = useRef(null)
  const clickedOutside = useRef(false);
  useEffect(() => {
    dispatch(getHotDetailThunk());
  }, []);
  useEffect(() => {
    $scroll.current.refresh();
  }, [suggest]);

  const getSuggest = useCallback(
    debounce((val) => {
      dispatch(getSuggestThunk(val));
    }, 300),
    []
  )
  useEffect(() => {
    if (!word || isEmpty(`${word}`.trim())) {
      dispatch(clearSearchSuggest());
    } else {
      getSuggest(word)
    }
  }, [word]);

  useEffect(() => {
    window.addEventListener("mousedown", (e) => {
      const target = utils.getTargetFromEvent(e);
      const isOutside = isClickOutside(target);
      clickedOutside.current = !isOutside;
      if (!isOutside) {
        clickedOutside.current = isOutside
        requestAnimationFrame(() => {
          console.log( clickedOutside.current)
          clickedOutside.current = true
        })
      }else{
        dispatch(togglePanel(false));
      }
    });
  }, []);




  const opacity = useSpring({
    from: { opacity: 0, height: 0 },
    to: { opacity: visible ? 1 : 0, height: visible ? 435 : 0 },
    onStart() { },
    onRest() {
      $scroll.current.refresh();
    },
    config: {
      tension: 500,
    },
  });
  const inputSpring = useSpring({
    from: { width: 154 },
    to: { width: visible ? 298 : 154, borderRadius: visible ? 0 : 16 },
    config: {
      tension: 500,
    },
  })

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
            onClick={(e) => {
              e.stopPropagation();
              dispatch(clearHistory("all"));
            }}
          >
            清除记录
          </Button>
        </div>
        {data.map((name, index) => {
          return (
            <div
              key={`history-${name}`}
              className={
                classNames('search-result-item search-item-history', {
                  'active': index === select
                })
              }
              onClick={() => {
                dispatch(setSearchWord(name));
              }}
            >
              <span>{name}</span>
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
              className={
                classNames('search-result-item search-result-simple', {
                  'active': index + historyData.length === select
                })
              }
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
        {data.map((item, index) => {
          return (
            <div key={item.id}
              className={
                classNames('search-result-item search-item-song', {
                  'active': index === select
                })
              }
              onClick={() => {
                console.log(item)
                dispatch(insertSong(item));
                dispatch(changeIndex(0));
              }}
            >
              <span>
                {item.name}-<em>{item.artistsName}</em>
              </span>
            </div>
          );
        })}
      </React.Fragment>
    );
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
      <animated.div style={inputSpring} className="search-wrap" ref={$containerRef}>
        <Input
          ref={$input}
          value={word}
          prefix={<i className="iconfont icon-search"></i>}
          placeholder="搜索"
          allowClear
          onFocus={() => {
            dispatch(togglePanel(true));
          }}
          onBlur={() => {
            // debugger
            let { activeElement } = document;
            // while (activeElement && activeElement.shadowRoot) {
            //   activeElement = activeElement.shadowRoot.activeElement;
            // }
            console.log('clickedOutside', clickedOutside.current)

            if (clickedOutside.current) {
              return;
            }
            // if (isClickOutside(activeElement)) {
            //   console.log(111)
            // }
            dispatch(togglePanel(false));
          }}
          onChange={(e) => {
            dispatch(setSearchWord(e.target.value));
          }}
          onPressEnter={(e) => {
            const value = word.length ? get(suggest, `songs[${select}].name`, '') : get([...historyData, ...hot], `${select}`)
            console.log(value)
            if (!e.target.value.trim().length) return;
            dispatch(setSearchWord(value));
            dispatch(setHistorySearch(e.target.value));
          }}
          onKeyDown={(e) => {
            console.log(e)
            if (![38, 40].includes(e.keyCode)) return
            e.preventDefault()
            const hotLength = historyData.length + hot.length
            const suggestength = get(suggest, 'songs', []).length
            const length = isEmpty(word) ? hotLength : suggestength
            let selectIndex = select
            if (e.keyCode === 38) {
              selectIndex = selectIndex < 1 ? length - 1 : selectIndex - 1
            }
            if (e.keyCode === 40) {
              selectIndex = selectIndex >= length - 1 ? 0 : selectIndex + 1
            }
            dispatch(setSelectItem(selectIndex))
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
              <div className={classNames({
                hide: isEmpty(historyData),
              })}>{renderHistory(historyData)}</div>
              <div>{renderHot(hot)}</div>
            </div>
            <div
              className={classNames("search-suggest-panel", {
                hide: isEmpty(word),
              })}
            >
              {renderSongs(get(suggest, 'songs', []))}
            </div>
          </Scroll>
        </animated.div>
      </animated.div>
    </React.Fragment>
  );
}

/**
 * 
 * 
 * 
 *   function renderPlaylists(data) {
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
 * * */