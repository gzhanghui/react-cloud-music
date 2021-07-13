import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'antd';
import { likeList, getLikelistThunk } from './like-slice'
import { replacePlayList } from 'components/player/player-slice'
export default function Like() {
    const list = useSelector(likeList)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getLikelistThunk())
    }, [])

    useEffect(() => {
        if(list.length){
            dispatch(replacePlayList(list))
        }
    }, [list])
    return (
        <div>
            <Table
                rowKey='id'
                showHeader={false}
                pagination={false}
                columns={[{ dataIndex: 'name' }, { dataIndex: 'artistsName' }, { dataIndex: 'albumName' }, { dataIndex: 'duration' }]}
                dataSource={list} size="small"
                onRow={() => {
                    return {
                        onClick: () => {
                            dispatch(replacePlayList(list))
                        },
                    }
                }}
            />
        </div>
    )

}
