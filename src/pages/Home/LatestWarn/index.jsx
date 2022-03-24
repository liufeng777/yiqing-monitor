import React, { useState } from 'react';
import { Table } from 'antd';
import { getDateTime } from '../../Card/DateAndTime';
import { confirmRes } from '../../../assets/js/constant';
import './index.less';

export const LatestWarn = (props) => {
  return (
    <section className="latest-warn">
      <p className='table-title'>
        <i className="iconfont icon-huanyanse-12" />
        <span>最新蚁情报警</span>
      </p>
      <Table
        bordered
        height={200}
        dataSource={props.data}
        rowKey={r => r.warn_id}
        rowClassName={(r, i) => i % 2 ? 'even-line' : 'odd-line'}
        pagination={false}
        size="small"
        scroll={{y: 200, x: 600}}
      >
        <Table.Column title="工程名" dataIndex="project_name" key="project_name" />
        <Table.Column title="布点名" dataIndex="point_name" key="point_name" />
        <Table.Column title="探测时间" dataIndex="detect_timestamp" key="detect_timestamp"
          render={(val, _) => (<span>{getDateTime(val).join(' ')}</span>)}
        />
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
