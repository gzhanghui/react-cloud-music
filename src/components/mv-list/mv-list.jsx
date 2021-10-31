import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Card, Col, Row, Image, Typography } from "antd";
import { get } from "lodash";
import { PauseCircleFilled, PlayCircleFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  videoState,
  currentMv,
  setCurrentMv,
} from "pages/mv/mv-slice";
function MvList(props) {
  const list = get(props, "list", []);
  const play = useSelector(videoState);
  const current = useSelector(currentMv);
  const dispatch = useDispatch();
  console.log("play", play);
  return (
    <div>
      <Row gutter={16}>
        {list.map((mv) => {
          return (
            <Col span={8} key={mv.id}>
              <Card bordered={false} className="mv-cover">
                <Link
                  to={{
                    pathname: "/mv-detail",
                    search: `?id=${mv.id}`,
                  }}
                  className="mv-cover-content"
                  onClick={() => {
                    dispatch(setCurrentMv(mv));
                  }}
                >
                  <Image src={mv.cover} preview={false} width={"100%"} />
                  <div className="mv-cover-mask">
                    <button className="mv-cover-button">
                      {play && current.id === mv.id && (
                        <PauseCircleFilled className="icon" />
                      )}
                      {!play && <PlayCircleFilled className="icon" />}
                    </button>
                  </div>
                </Link>
                <Card.Meta
                  description={
                    <Typography.Paragraph ellipsis={{ rows: 2 }}>
                      {mv.name}
                    </Typography.Paragraph>
                  }
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

MvList.propTypes = {
  list: PropTypes.oneOfType([PropTypes.array]),
  handelMv: PropTypes.oneOfType([PropTypes.func]),
};
MvList.defaultProps = {
  list: [],
  handelMv: () => {},
};
export default MvList;
