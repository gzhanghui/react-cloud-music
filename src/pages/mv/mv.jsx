import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Row, Col, Card, Image, Typography } from "antd";
import { PauseCircleFilled, PlayCircleFilled } from "@ant-design/icons";
import { mvUrl, getMvUrlThunk } from "./mv-slice";
import VideoJS from "components/video/index";
import "videojs-playlist/dist/videojs-playlist";
import {
  changeState,
  getRelatedThunk,
  related,
  videoState,
  currentMv,
} from "pages/mv/mv-slice";

export default function Mv() {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentItem = useSelector(mvUrl);
  const relatedList = useSelector(related);
  const play = useSelector(videoState);
  const current = useSelector(currentMv);
  const playerRef = useRef(null);

  const id = new URLSearchParams(history.location.search).get("id");
  const options = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
  };
  useEffect(() => {
    dispatch(getMvUrlThunk(id));
    dispatch(getRelatedThunk(id));
    return componentWillUnmount;
  }, []);
  function componentWillUnmount() {
    // playerRef.current && playerRef.current.pause();
  }
  useEffect(() => {
    playerRef.current && playerRef.current.src(currentItem.url);
  }, [currentItem]);

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    player.on("waiting", () => {
      console.log("player is waiting");
    });

    player.on("dispose", () => {
      console.log("player will dispose");
    });
    player.on("pause", () => {
      changeState(true);
      console.log("player will true");
    });
    player.on("play", () => {
      changeState(false);
      console.log("player will false");
    });

    player.on("click", () => {});
  };

  return (
    <React.Fragment>
      <Row>
        <Col flex="auto">
          <Card title="MV 详情" bordered={false} style={{ width: "100%" }}>
            <VideoJS options={options} onReady={handlePlayerReady} />
          </Card>
        </Col>
        <Col flex="320px">
          <Card title="相关推荐" bordered={false} style={{ width: "100%" }}>
            {relatedList.map((mv) => (
              <div bordered={false} className="related-mv" key={mv.id}>
                <div className="mv-cover-content">
                  <Image src={mv.coverUrl} preview={false} width={"100%"} />
                  <div className="mv-cover-mask">
                    <button className="mv-cover-button">
                      {play && current.id === mv.id && (
                        <PauseCircleFilled className="icon" />
                      )}
                      {!play && <PlayCircleFilled className="icon" />}
                    </button>
                  </div>
                </div>
                <div className="mv-info-content">
                  <Typography.Paragraph ellipsis={{ rows: 2 }}>
                    {mv.title}
                  </Typography.Paragraph>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}
