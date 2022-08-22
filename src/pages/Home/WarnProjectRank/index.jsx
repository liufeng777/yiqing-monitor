import React, { useState } from 'react';
import { Table } from 'antd';
import './index.less';

export const WarnProjectRank = (props) => {
  return (
    <section className="warn-project-rank">
      <p className='table-title'>
        <i className="iconfont icon-huanyanse-12" />
        <span>蚁情报警工程排行</span>
      </p>
      <Table
        bordered
        height={200}
        dataSource={props.data}
        rowKey={(r, index ) => index}
        rowClassName={(r, i) => i % 2 ? 'even-line' : 'odd-line'}
        pagination={false}
        size="small"
        scroll={{y: 200, x: 400}}
      >
        <Table.Column title="工程名" dataIndex="name" key="name" />
        <Table.Column title="蚁情报警数" width={90} dataIndex="termite_count" key="termite_count" />
        <Table.Column title="已处理数" width={80} dataIndex="termite_wait_count" key="termite_wait_count" render={(d, r) => {
          return r.termite_count - d
        }} />
        <Table.Column title="地区" dataIndex="area_name" key="area_name" />
      </Table>
    </section>
  )
}
