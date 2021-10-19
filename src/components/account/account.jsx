import React, {useEffect} from "react";
import {Avatar, Popover, Button} from "antd";
import {get, isEmpty} from "lodash";
import {getStatus, getUserInfo, setLoginBox} from "components/login/login-slice";
import {useDispatch, useSelector} from "react-redux";
import storage from "store";
import {getDetailThunk, getUserLevelThunk, userDetail, userLevel} from './account-slice'
import {logoutThunk} from '@/components/login/login-slice'
const USER_INFO = '__music_userinfo__'
export default function Account() {
    const dispatch = useDispatch();
    const profile = useSelector(userDetail)
    const level = useSelector(userLevel)
    const status = useSelector(getStatus);
    let userInfo = useSelector(getUserInfo);
    userInfo = isEmpty(userInfo) ? storage.get(USER_INFO) : userInfo
    let avatarUrl = `https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png`
    avatarUrl = get(userInfo, 'profile.avatarUrl') ? get(userInfo, 'profile.avatarUrl') : avatarUrl
    useEffect(() => {
        const uid = get(userInfo, 'profile.userId')
        dispatch(getDetailThunk(uid))
        dispatch(getUserLevelThunk())
        console.log(profile, level)
    }, [])
    const navLogin = (
        <div className="state nav-login"
             onClick={() => {
                 dispatch(setLoginBox(true))
             }}>
            <div>请登录</div>
        </div>
    )
    const user = (
        <div>
            <Popover overlayClassName="nav-login-inner"
                     title={() => null}
                     placement="rightTop" color="rgba(18,19,24,.9)"
                     trigger="click"
                     content={
                         <React.Fragment>
                             <div className="micro-bg" style={{background:`url(${get(userInfo, 'profile.backgroundUrl')})`}}>
                                 <div className="nav-login-top">
                                     <Avatar size={50} src={avatarUrl}/>
                                     <div className="title">
                                         <div className="name">{get(userInfo, 'profile.nickname')}</div>
                                         <div className="level">
                                             <i className={`iconfont icon-level-${profile.level}`}></i>
                                         </div>
                                     </div>
                                 </div>
                                 <div className='nav-login-middle'>
                                     <ul>
                                         <li><i className="icon-compass-3-line iconfont"></i><span>动态</span></li>
                                         <li><i className="icon-chat-follow-up-line iconfont"></i><span>关注</span></li>
                                         <li><i className="icon-heart-add-line iconfont"></i><span>粉丝</span></li>
                                     </ul>
                                 </div>
                                 <div className="nav-login-bottom">
                                     <Button type="link" onClick={()=>{
                                        dispatch(logoutThunk())
                                     }}>
                                         退出
                                     </Button>
                                 </div>
                             </div>

                         </React.Fragment>
                     }
            >
                <div className="avatar">
                    <Avatar size={50} src={avatarUrl}/>
                </div>
                <div className="info">
                    <div className="name">{get(userInfo, 'profile.nickname')}</div>
                    <div className="level">
                        <i className={`iconfont icon-level-${profile.level}`}></i>
                    </div>
                </div>
            </Popover>
        </div>
    )

    return <div>   {get(status,'account')  ? user : navLogin}  </div>
}
