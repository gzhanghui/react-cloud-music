import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { get } from "lodash";
import { Table, Card, Row, Col, Image, Button, Avatar, Modal } from "antd";
import {
  HeartOutlined,
  PlayCircleOutlined,
  PauseCircleFilled,
  PlayCircleFilled,
} from "@ant-design/icons";
import PlayingIcon from "components/player/play-icon";
import utils from "common/js/util";
import {
  likeList,
  playlist,
  getLikeListThunk,
  getPlaylistThunk,
} from "./like-slice";
import {
  replacePlayList,
  changeIndex,
  audioState,
  currentIndex,
  changePlaying,
} from "components/player/player-slice";

export default function Like() {
  const likeData = useSelector(likeList);
  const playData = useSelector(playlist);
  const state = useSelector(audioState);
  const playIndex = useSelector(currentIndex);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLikeListThunk());
    dispatch(getPlaylistThunk());
  }, []);

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
        dispatch(replacePlayList(likeData));
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
                {utils.formatTime(get(playData, "[0].creator.createTime"))} 创建
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
      <Table
        rowKey="id"
        showHeader={true}
        pagination={false}
        columns={[
          {
            dataIndex: "duration",
            title: " ",
            render: () => (
              <button className="like-button">
                <HeartOutlined />
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
        dataSource={likeData}
        size="small"
        onRow={() => {
          return {
            onClick: () => {
              // dispatch(replacePlayList(likeData));
            },
          };
        }}
      ></Table>
    </Card>
  );
}
