import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'antd';
import Carousel from '@/components/carousel';
import Personalized from 'pages/home/personalized'
import { bannerList, bannerThunk, newSongs, getNewSongThunk, changeIndex } from './home-slice'
import {replacePlayList} from 'components/player/player-slice'
export default function Home() {
  const bannerData = useSelector(bannerList)
  const newSongList = useSelector(newSongs)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(bannerThunk())
    dispatch(getNewSongThunk())
  }, [])
  return (
    <React.Fragment>
      <Carousel interval="4000" type="card" height="200px" autoplay={true} onChange={(index)=>{dispatch(changeIndex(index))}}>
        {
          bannerData.map((item) => {
            return (
              <Carousel.Item key={item.imageUrl}>
                <img src={item.imageUrl} alt={item.typeTitle} width="100%" />
              </Carousel.Item>
            )
          })
        }
      </Carousel>
      <Personalized />
      <Table
        rowKey='name'
        showHeader={false}
        pagination={false}
        columns={[{  dataIndex: 'name' },{  dataIndex: 'artistsName' },{  dataIndex: 'albumName' },{  dataIndex: 'duration' }]}
        dataSource={newSongList} size="small" 
        onRow={() => {
          return {
            onClick: () => {
              dispatch(replacePlayList(newSongList))
            },
          }
        }}
        />
    </React.Fragment>
  )
}