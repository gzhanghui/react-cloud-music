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
  currentIndex,
  insertSong,
} from "components/player/player-slice";

function SongList(props) {
  const { songList,handelSongLike } = props;
  const state = useSelector(audioState);
  const playIndex = useSelector(currentIndex);
  const dispatch = useDispatch();
  return (
    <Table
      rowKey="id"
      showHeader={true}
      pagination={false}
      columns={[
        {
          dataIndex: "islike",
          title: " ",
          render: (text, record,index) => (
            <button className="like-button" onClick={()=>{
              handelSongLike(record,index)
            }}>
              {record.islike ? (
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
          render: (text, record, index) => (
            <div className="table-player-control">
              <span className="name">{text}</span>
              <div className="play-state">
                {state.playing && playIndex === index ? (
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
                      dispatch(changeIndex(index));
                    }}
                  />
                )}
              </div>
            </div>
          ),
        },
        { dataIndex: "artistsName", title: "歌手" },
        { dataIndex: "albumName", title: "专辑" },
        { dataIndex: "duration", title: "时长" },
      ]}
      dataSource={songList}
      size="small"
      onRow={(record, index) => {
        return {
          onClick: () => {
          },
          onDoubleClick: () => {
            dispatch(insertSong(songList[index]));
            console.log(index);
            setTimeout(() => {
              dispatch(changeIndex(index));
            }, 400);
          },
        };
      }}
    ></Table>
  );
}

SongList.propTypes = {
  songList: PropTypes.oneOfType([PropTypes.array]),
  handelSongLike:PropTypes.oneOfType([PropTypes.func])
};
SongList.defaultProps = {
  songList: [],
  handelSongLike:()=>{}
};
export default SongList;
