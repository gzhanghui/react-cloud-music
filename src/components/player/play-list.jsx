import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
import { formatTime } from "common/js/utils/tool";
import { message } from 'antd';
import { playList, playing, currentIndex, changeIndex, changePlay } from './player-slice'
function PlayList() {
    const list = useSelector(playList);
    const play = useSelector(playing);
    const index = useSelector(currentIndex);
    const dispatch = useDispatch()
    const playingClass = (i) => {
        return classNames('iconfont', {
            'icon-poweroff-circle-fill': i === index && play,
            'icon-videofill': index !== i || ((i === index) && !play)
        })
    }
    const playingIcon = () => {
        return (
            <div className="beat">
                {
                    [1, 2, 3, 4].map(item => {
                        return <span key={item}></span>
                    })
                }
            </div>
        )
    }
    return (
        <div className="song-list">
            <ul>
                {
                    list.map((song, i) => {
                        return (
                            <li className= {classNames('item',{'disabled':!song.url})} key={song.id}>
                                <div className="icon" >
                                    <img src={song.image} width="42" />
                                    <span className="control-icon"
                                        onClick={() => {
                                            if(!song.url){
                                                message.error('error')
                                                return
                                            }
                                            if (i === index) {
                                                dispatch(changePlay(!play))
                                            } else {
                                                dispatch(changePlay(true))
                                            }
                                            dispatch(changeIndex(i))
                                        }}>
                                        <i className={playingClass(i)}></i></span>
                                </div>
                                <div className="text">
                                    <h3 className="top"><span className="name ellipsis">{song.name}</span>{i === index && play && (playingIcon())}</h3>
                                    <div className="bottom"><span>{song.artistsName}</span><span className="duration">{formatTime(song.duration)}</span></div>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}




export default PlayList
