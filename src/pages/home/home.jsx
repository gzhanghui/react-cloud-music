import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "antd";
import Carousel from "@/components/carousel";
import SongList from "@/components/song-list/song-list";
import Personalized from "pages/home/personalized";
import {
  bannerList,
  bannerThunk,
  newSongs,
  getNewSongThunk,
  changeIndex,
} from "./home-slice";
// import { insertSong } from "components/player/player-slice";
export default function Home() {
  const bannerData = useSelector(bannerList);
  const newSongList = useSelector(newSongs);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(bannerThunk());
    dispatch(getNewSongThunk());
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
                <img src={item.imageUrl} alt={item.typeTitle} width="100%" />
              </Carousel.Item>
            );
          })}
        </Carousel>
      </Card>
      <Personalized />
      <Card title="热门歌曲" size="small">
        <SongList songList={newSongList}></SongList>
      </Card>
    </React.Fragment>
  );
}
