import React, { useEffect,useRef} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Row, Col, Card } from "antd";
import { mvUrl, getMvUrlThunk } from "./mv-slice";
import VideoJS from "components/video/index";
import "videojs-playlist/dist/videojs-playlist";
export default function Mv() {

  const dispatch = useDispatch();
  const history = useHistory();
  const currentitem = useSelector(mvUrl);
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
  }, []);

  useEffect(() => {
    playerRef.current&& playerRef.current.src(currentitem.url);
  }, [currentitem]);

  const handlePlayerReady = (player) => {
    playerRef.current = player;
    console.log(player);
   
    player.on("waiting", () => {
      console.log("player is waiting");
    });

    player.on("dispose", () => {
      console.log("player will dispose");
    });
  };

  return (
    <React.Fragment>
      <Row>
        <Col span={16}>
          <Card title="MV 详情" bordered={false} style={{ width: "100%" }}>
              <VideoJS options={options} onReady={handlePlayerReady} />
          </Card>
        </Col>
        <Col span={8}>col-12</Col>
      </Row>
    </React.Fragment>
  );
}
