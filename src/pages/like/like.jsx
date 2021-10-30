import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { get } from "lodash";
import { Card, Row, Col, Image, Button, Avatar, Modal } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import utils from "common/js/util";
import SongList from "components/song-list/song-list";
import { insertSong, changeIndex } from "components/player/player-slice";

import {
  likeList,
  playlist,
  getLikeListThunk,
  getPlaylistThunk,
  changeSongList
} from "./like-slice";

export default function Like() {
  const likeData = useSelector(likeList);
  const playData = useSelector(playlist);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLikeListThunk());
    dispatch(getPlaylistThunk());
  }, []);
  const handelSongLike = (record,index)=>{
    dispatch(changeSongList({record,index}))
  }
  const confirm = () => {
    Modal.confirm({
      title: (
        <div className="confirm-title">
          &quot;播放全部&quot;将会替换当前的播放列表，是否继续?
        </div>
      ),
      content: "",
      okText: "确认",
      cancelText: "取消",
      onCancel: (close) => {
        close();
      },
      onOk: (close) => {
        dispatch(insertSong(likeData));
        dispatch(changeIndex(0));
        close();
      },
    });
  };
  return (
    <Card>
      <Row>
        <Col>
          <Image
            style={{ marginTop: "20px" }}
            width={170}
            height={170}
            preview={false}
            src={get(playData, "[0].coverImgUrl")}
          />
        </Col>
        <Col>
          <Card title="我喜欢的音乐">
            <div className="create-info">
              <Avatar size={42} src={get(playData, "[0].creator.avatarUrl")} />
              <Button type="link">
                {get(playData, "[0].creator.nickname")}
              </Button>
              <span>
                {utils.durationToTime(get(playData, "[0].creator.createTime"))} 创建
              </span>
            </div>
            <Button
              type="primary"
              onClick={confirm}
              icon={<PlayCircleOutlined />}
            >
              播放全部
            </Button>
            <div className="playlist-count">
              <span>
                歌曲数:<em>{get(playData, "[0].trackCount")}</em>
              </span>
              <span>
                播放数:<em>{get(playData, "[0].playCount")}</em>
              </span>
            </div>
          </Card>
        </Col>
      </Row>
      <SongList songList={likeData} handelSongLike={handelSongLike}></SongList>
    </Card>
  );
}
