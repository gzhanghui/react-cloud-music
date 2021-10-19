/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react'
import { Input, AutoComplete } from 'antd';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty, throttle } from 'lodash'
import { getHotDetailThunk, getSuggestThunk, searchRes, setHistorySearch, clearSearchSuggest, clearHistory } from './search-slice'
const throttleRef = throttle((dispatch, val) => {
    dispatch(getSuggestThunk(val))
}, 300)
export default function Search() {
    const dispatch = useDispatch();
    const searchData = useSelector(searchRes);
    const $autoComplete = useRef(null)
    useEffect(() => {
        dispatch(getHotDetailThunk())
    }, [])
    function renderItem(type, data) {
        let option = {}
        switch (type) {
            case 'history':
                option = {
                    label: <div className="history-title title"><i className=" hide iconfont icon-time"></i><span>搜索历史</span><button 
                    onClick={(e=>{
                        e.stopPropagation();
                        dispatch(clearHistory('all'))
                    })}
                    className="clear-history"><i className="iconfont icon-trash"></i>清除记录</button></div>,
                    options: data.map((word, index) => ({
                        value: word+index,
                        label: (<div key={`history-${word}`} className="history-item" ><span>{word}</span><a
                        
                        onClick={(e=>{
                            e.stopPropagation();
                            dispatch(clearHistory(index))
                        })}
                        
                        ><i className="iconfont icon-delete"></i></a></div>)
                    }))
                }
                break;
            case 'hot':
                option = {
                    label: <div className="hot-title title"><i className="hide iconfont icon-hot"></i><span>热门搜索</span></div>,
                    options: data.map((item, index) => ({
                        value: item.searchWord,
                        label: (<div  key={item.searchWord} className="search-item search-result-simple">
                            <em className={classNames("search-result-num", { 'top': index < 3 })}>{index + 1}</em>
                            <div className="text">
                                <div><span className="word">{item.searchWord}</span><em className="id">{item.score}</em></div>
                                <div className="content hide">{item.content}</div>
                            </div>
                        </div>)
                    }))
                }
                break;
            case 'playlists':
                option = {
                    label: <div className="playlist-title title"><i className="iconfont icon-list hide"></i><span>歌单</span></div>,
                    options: data.map(item => ({
                        value: item.id,
                        label: (<div>{item.name}</div>)
                    }))
                }
                break;
            case 'artists':
                option = {
                    label: <div className="artist-title title"><i className="iconfont icon-artist hide"></i><span>歌手</span></div>,
                    options: data.map(item => ({
                        value: item.id,
                        label: (<div key={item.name}>{item.name}</div>)
                    }))
                }
                break;
            case 'songs':
                option = {
                    label: <div className="song-title title"><i className="iconfont icon-song hide"></i><span>单曲</span></div>,
                    options: data.map(item => ({
                        value: item.id,
                        label: (<div key={item.name}>{item.name}</div>)
                    }))
                }
                break;
            case 'albums':
                option = {
                    label: <div className="albums-title title"><i className="iconfont icon-album hide"></i><span>专辑</span></div>,
                    options: data.map(item => ({
                        value: item.id,
                        label: (<div key={item.name}>{item.name}</div>)
                    }))
                }
                break;
            default:
                break;
        }
        return option
    }

    function renderRes(data) {
        return data.filter(item => item.data.length > 0).map(item => {
            return renderItem(item.type, item.data)
        })
    }
    return (
        <React.Fragment>
            <div ref={$autoComplete} style={{ height: '60vh' }}>
                <AutoComplete
                    dropdownClassName="category-search-dropdown"
                    dropdownMatchSelectWidth={320}
                    allowClear={true}
                    onChange={(val) => {
                        if (!val || isEmpty(val.trim())) {
                            dispatch(clearSearchSuggest())
                        } else {
                            throttleRef(dispatch, val)
                        }
                    }}
                    listHeight={500}
                    options={renderRes(searchData)}
                    onSelect={(value) => {
                        if (!isEmpty(value)) {
                            dispatch(setHistorySearch(value))
                        }
                    }}
                >
                    <Input
                        prefix={<i className="iconfont icon-search"></i>} placeholder="搜索" />
                </AutoComplete>

            </div>
            <div>
                
            </div>
        </React.Fragment>
    )
}