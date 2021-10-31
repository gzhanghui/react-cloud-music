import React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Card, Col, Row, Image, Typography } from "antd";
import { get } from "lodash";
import { PauseCircleFilled, PlayCircleFilled } from "@ant-design/icons";

function MvList(props) {
  const list = get(props, "list", []);
  const dispatch = useDispatch();
  console.log(dispatch);
  return (
    <div>
      <Row gutter={16}>
        {list.map((mv) => {
          return (
            <Col span={8} key={mv.id}>
              <Card bordered={false} className="mv-card">
                <div className="mv-cover-content">
                 <Image src={mv.cover} preview={false} width={"100%"}/>
                  <div className="mv-cover-mask">
                    <button className="mv-cover-button">
                      <PauseCircleFilled className="icon"/>
                      <PlayCircleFilled  className="icon"/>
                    </button>
                  </div>
                </div>
                <Card.Meta description={ <Typography.Paragraph ellipsis={{rows:2}}> {mv.name}</Typography.Paragraph>} />
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
