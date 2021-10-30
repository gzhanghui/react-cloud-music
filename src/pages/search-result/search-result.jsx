import React, { useEffect } from "react";
import { get } from "lodash";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Tabs, Card, Avatar, Typography, Button } from "antd";
import SongList from "components/song-list/song-list";
import utils from "@/common/js/util";
import {
  artistDetail,
  getArtistDetailThunk,
  artistTopSong,
  getArtistTopSongThunk,
  artistAlbum,
  getArtistAlbumThunk,
  artistDesc,
  getArtistDescThunk,
  artistMv,
  getArtistMvThunk,
} from "./search-result-slice";
// eslint-disable-next-line no-unused-vars
import { insertSong } from "@/components/player/player-slice";
export default function SearchReslut() {
  const dispatch = useDispatch();
  const artist = useSelector(artistDetail);
  const topSong = useSelector(artistTopSong);
  const album = useSelector(artistAlbum);
  const desc = useSelector(artistDesc);
  const mv = useSelector(artistMv);
  const history = useHistory();
  useEffect(() => {
    const id = new URLSearchParams(history.location.search).get("id");
    dispatch(getArtistDetailThunk(id));
    dispatch(getArtistTopSongThunk(id));
    dispatch(getArtistAlbumThunk({ id }));
    dispatch(getArtistDescThunk(id));
    dispatch(getArtistMvThunk(id));
  }, []);

  function callback(key) {
    console.log(key);
  }
  return (
    <Card title="搜索结果" bordered={false}>
      <div className="top">
        <Avatar shape="square" size={174} src={get(artist, "artist.cover")} />
        <div className="brief-desc">
          <Typography>
            <Typography.Title level={5}>
              {get(artist, "artist.name")}
            </Typography.Title>
            <Typography.Paragraph
              ellipsis={{
                rows: 7,
              }}
            >
              {get(artist, "artist.briefDesc")}
            </Typography.Paragraph>
          </Typography>
        </div>
      </div>

      <Tabs defaultActiveKey="1" onChange={callback}>
        <Tabs.TabPane tab="单曲" key="1">
          <Button
            type="primary"
            icon={<i className="iconfont icon-play float-left"></i>}
          >
            播放全部
          </Button>
          <SongList songList={topSong}></SongList>
        </Tabs.TabPane>
        <Tabs.TabPane tab="专辑" key="2">
          <ul className="artist-album">
            {album.hotAlbums.map((item) => (
              <li key={item.id} className="artist-album-item">
                <Avatar
                  src={item.picUrl}
                  size={104}
                  shape="square"
                  className="album-cover"
                />
                <div>{item.name}</div>
                <time>{utils.durationToTime(item.publishTime)}</time>
              </li>
            ))}
          </ul>
        </Tabs.TabPane>
        <Tabs.TabPane tab="艺人介绍" key="0">
          <div className="brief-desc">
            <Typography>
              {get(desc, "introduction").map((item) => (
                <React.Fragment key={item.ti}>
                  <Typography.Title level={5}>{item.ti}</Typography.Title>
                  <Typography.Paragraph ellipsis={{ rows: 7 }}>
                    {item.txt}
                  </Typography.Paragraph>
                </React.Fragment>
              ))}
            </Typography>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="MV" key="3">
          <ul className="artist-mv">
            {mv.map((item) => (
              <li key={item.id} className="artist-mv-item">
                <Link
                  to={{
                    pathname: "/mv-detail",
                    search: `?id=${item.id}`,
                  }}
                  className="artist-mv-item-box"
                  onClick={() => {}}
                >
                  <img src={item.imgurl16v9} className="mv-cover" />
                  <i className="iconfont icon-videofill"></i>
                  <div>{item.playCount}</div>
                  <div>{item.duration}</div>
                  <div>{item.name}</div>
                  <time>{item.name}</time>
                </Link>
              </li>
            ))}
          </ul>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
}
