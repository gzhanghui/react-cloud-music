import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Immutable from "immutable";
import classnames from "classnames";
import padStart from "lodash/padStart";

import { Table } from "antd";
import PlayIcon from "@/components/icons/playing";
class SongList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const props = this.props;

    const columns = [
      {
        title: " ",
        dataIndex: "toolbar",
        width: "100px",
        render(text, record, index) {
          return (
            <div className='table-toolbar'>
              <span className='toolbar-item'>{props.current.id === record.id ? <PlayIcon /> : <Fragment>{padStart(`${index + 1}`, 2, "0")}</Fragment>}</span>
              <span className='toolbar-item'>
                <i data-type='like' className={classnames("iconfont", { "icon-like": !record.isLike, "icon-like-fill": record.isLike })}></i>
              </span>
              <span className='toolbar-item'>
                <i className='iconfont icon-play' data-type='play'></i>
              </span>
            </div>
          );
        },
      },
      {
        title: "音乐标题",
        dataIndex: "name",
        ellipsis: true,
      },
      {
        title: "歌手",
        dataIndex: "artists",
        ellipsis: true,
      },
      {
        title: "专辑",
        dataIndex: "album",
        ellipsis: true,
      },
      {
        title: "时长",
        dataIndex: "duration",
        width: 80,
        align: "right",
      },
    ];
    return (
      <React.Fragment>
        <Table
          showHeader={false}
          onRow={(record) => {
            return {
              onClick: (e) => {
                e.persist();
                const type = e.target.getAttribute("data-type");
                if (type === "like") {
                  this.props.onToggleLike(record, e);
                }
                if (type === "play") {
                  this.props.onTogglePlay(record, e);
                }
              },
              onDoubleClick: () => {},
            };
          }}
          rowKey='id'
          pagination={false}
          columns={columns}
          dataSource={this.props.list}
          size='middle'
        />
      </React.Fragment>
    );
  }
}

SongList.propTypes = {
  list: PropTypes.oneOfType([PropTypes.arrayOf(Immutable.List, PropTypes.array), PropTypes.object]),
  onTogglePlay: PropTypes.func.isRequired,
  onToggleLike: PropTypes.func.isRequired,
  current: PropTypes.object,
};
SongList.defaultProps = {
  onTogglePlay: () => {},
  onToggleLike: () => {},
  current: {},
};

export default SongList;
