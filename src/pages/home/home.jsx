import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Row, Col } from "antd";
import Carousel from "@/components/carousel";
import SongList from "@/components/song-list/song-list";
import Personalized from "pages/home/personalized";
import MvList from "components/mv-list/mv-list";
import {
  bannerList,
  bannerThunk,
  newSongs,
  getNewSongThunk,
  changeIndex,
  privateList,
  privateListThunk,
  recommendMvList,
  recommendMvThunk
} from "./home-slice";
// import { insertSong } from "components/player/player-slice";
export default function Home() {
  const bannerData = useSelector(bannerList);
  const newSongList = useSelector(newSongs);
  const privateMv = useSelector(privateList);
  const recommendMv = useSelector(recommendMvList)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(bannerThunk());
    dispatch(getNewSongThunk());
    dispatch(privateListThunk({limit:3}))
    dispatch(recommendMvThunk({limit:3}))
  }, []);
  return (
    <React.Fragment>
      <Card size="small">
        <Carousel
          interval="4000"
          type="card"
          height="200px"
          autoplay={false}
          onChange={(index) => {
            dispatch(changeIndex(index));
          }}
        >
          {bannerData.map((item) => {
            return (
              <Carousel.Item key={item.imageUrl}>
                <img src={item.imageUrl} alt={item.typeTitle} height="100%" width="100%"/>
              </Carousel.Item>
            );
          })}
        </Carousel>
      </Card>
      <Personalized />
      <Row>
        <Col xs={24} sm={24} md={12}>
          <Card title="热门歌曲" size="small">
            <SongList songList={newSongList}></SongList>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Card title="独家放送" size="small">
            <MvList list={privateMv}></MvList>
          </Card>
          <Card title="推荐MV" size="small">
            <MvList list={recommendMv}></MvList>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}
