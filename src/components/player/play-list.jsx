import React from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import { message } from "antd";
import PlayingIcon from 'components/player/play-icon'
import {
  playList,
  currentIndex,
  changeIndex,
  audioState,
} from "./player-slice";
function PlayList() {
  const list = useSelector(playList);
  const state = useSelector(audioState);
  const index = useSelector(currentIndex);
  const dispatch = useDispatch();
  const playingClass = (i) => {
    return classNames("iconfont", {
      "icon-poweroff-circle-fill": i === index && state.playing,
      "icon-videofill": index !== i || (i === index && !state.playing),
    });
  };
  return (
    <div className="song-list">
      <ul>
        {list.map((song, i) => {
          return (
            <li
              className={classNames("item", { disabled: !song.url })}
              key={song.id}
              onClick={() => {
                if (!song.url) {
                  message.error("error");
                  return;
                }
                dispatch(changeIndex(i));
              }}
            >
              <div className="icon">
                <img src={song.image} width="42" />
                <span className="control-icon">
                  <i className={playingClass(i)}></i>
                </span>
              </div>
              <div className="text">
                <h3 className="top">
                  <span className="name ellipsis">{song.name}</span>
                  {i === index && state.playing && <PlayingIcon/>}
                </h3>
                <div className="bottom">
                  <span>{song.artistsName}</span>
                  <span className="duration">{song.duration}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PlayList;
