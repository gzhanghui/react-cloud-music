import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "antd";
import { personalized, personalizedThunk } from "./home-slice";
function Personalized() {
  const personalizedData = useSelector(personalized);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(personalizedThunk());
  }, []);
  const slideEle = useRef(null);
  const listWrapEle = useRef(null);
  let count = 0;

  const slideBtnClick = (direction) => {
    if (!slideEle.current) {
      return;
    }
    const slideWidth = slideEle.current.clientWidth;
    const del = slideWidth - listWrapEle.current.clientWidth;
    const step = 122 * 2;
    const maxCount = Math.floor(del / step);
    if (count < 0 || count > maxCount) {
      count = count < 0 ? 0 : maxCount;
      return;
    }
    count = direction > 0 ? count + 1 : count - 1;
    let offset = step * count;
    offset = offset > del ? del : offset;
    slideEle.current.style.transform = `translate3d(-${offset}px,0,0)`;
  };

  return (
    <div>
      <Card
        title="推荐歌单"
        size = "small"
        extra={
          <div className="control">
            <i
              className="iconfont icon-back"
              onClick={() => {
                slideBtnClick(-1);
              }}
            ></i>
            <i
              className="iconfont icon-right active"
              onClick={() => {
                slideBtnClick(1);
              }}
            ></i>
          </div>
        }
      >
        <div className="list-wrap"  ref={listWrapEle}>
          <ul className="list" ref={slideEle}>
            {personalizedData.map((item) => (
              <li key={item.id} className="item">
                <div className="item-card">
                  <div className="writer">{item.copywriter}</div>
                  <img src={item.picUrl} alt="" width="102px" />
                  <div className="play-count">
                    <i className="iconfont icon-erji">{/**/}</i>
                    <span>{item.playCount}</span>
                  </div>
                  <div className="play-icon">
                    <i className="iconfont icon-videofill">{/**/}</i>
                  </div>
                </div>
                <p className="desc">{item.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}

export default Personalized;
