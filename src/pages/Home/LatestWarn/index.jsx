import React, { useState } from 'react';
import { Table } from 'antd';
import { getDateTime } from '../../Card/DateAndTime';
import { confirmRes } from '../../../assets/js/constant';
import './index.less';

export const LatestWarn = () => {
  return (
    <section className="latest-warn">
      <p>
        <i className="iconfont icon-biaoge2" />
        最新蚁情报警
      </p>
      <Table
        dataSource={[]}
        rowKey={r => r.warn_id}
        pagination={false}
        size="small"
      >
        <Table.Column title="工程名" dataIndex="project_name" key="project_name" />
        <Table.Column title="布点名" dataIndex="point_name" key="point_name" />
        <Table.Column title="报警时间" dataIndex="warn_time" key="warn_time" />
        <Table.Column title="确认时间" dataIndex="confirm_timestamp" key="confirm_timestamp"
          render={(val, _) => (<span>{getDateTime(val).join(' ')}</span>)}
        />
        
        <Table.Column title="报警确认结果" dataIndex="confirm_res" key="confirm_res"
          render={(val, _) => (<span>{confirmRes[val]}</span>)}
        />
      </Table>
    </section>
  )
}
