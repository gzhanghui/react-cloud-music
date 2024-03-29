import React from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Table } from "antd";
import PlayingIcon from "components/player/play-icon";
import {
  HeartOutlined,
  PauseCircleFilled,
  PlayCircleFilled,
  HeartFilled,
} from "@ant-design/icons";
import {
  changeIndex,
  audioState,
  changePlaying,
  currentSong,
  insertSong,
} from "components/player/player-slice";
import { userLikeSongs } from "components/account/account-slice";

function SongList(props) {
  const { songList, handelSongLike } = props;
  const state = useSelector(audioState);
  const song = useSelector(currentSong);
  const likeIds = useSelector(userLikeSongs);
  const songIndex = songList.findIndex((item) => item.id === song.id);
  const list = songList.map((song) =>
    likeIds.includes(song.id) ? { ...song, isLike: true } : { ...song }
  );
  const dispatch = useDispatch();
  return (
    <Table
      rowKey="id"
      showHeader={false}
      pagination={false}
      columns={[
        {
          dataIndex: "isLike",
          title: " ",
          width: 56,
          render: (text, record, index) => (
            <button
              className="like-button"
              onClick={() => {
                handelSongLike(record, index);
              }}
            >
              {record.isLike ? (
                <HeartFilled className="like-color" />
              ) : (
                <HeartOutlined />
              )}
            </button>
          ),
        },
        {
          dataIndex: "name",
          title: "歌曲名",
          ellipsis:true,
          render: (text, record, index) => (
            <div className="table-player-control">
              <span className="name">{text}</span>
              <div className="play-state">
                {state.playing && songIndex === index ? (
                  <React.Fragment>
                    <PlayingIcon className="state-icon" />
                    <PauseCircleFilled
                      className="state-btn"
                      onClick={() => {
                        dispatch(changePlaying(true));
                      }}
                    />
                  </React.Fragment>
                ) : (
                  <PlayCircleFilled
                    className="state-btn"
                    onClick={() => {
                      dispatch(changePlaying(false));
                    }}
                  />
                )}
              </div>
            </div>
          ),
        },
        { dataIndex: "artistsName", title: "歌手"    ,     ellipsis:true,},
        { dataIndex: "albumName", title: "专辑"  ,     ellipsis:true,},
        { dataIndex: "duration", title: "时长"  ,     ellipsis:true, width: 66,},
      ]}
      dataSource={list}
      size="small"
      onRow={(record) => {
        return {
          onClick: () => {},
          onDoubleClick: () => {
            dispatch(insertSong(record));
            dispatch(changeIndex(0));
          },
        };
      }}
    ></Table>
  );
}

SongList.propTypes = {
  songList: PropTypes.oneOfType([PropTypes.array]),
  handelSongLike: PropTypes.oneOfType([PropTypes.func]),
};
SongList.defaultProps = {
  songList: [],
  handelSongLike: () => {},
};
export default SongList;
