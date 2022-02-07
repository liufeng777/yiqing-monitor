import React, { useState } from 'react';
import { Table } from 'antd';
import './index.less';

export const WarnProjectRank = () => {
  return (
    <section className="warn-project-rank">
      <p>
        <i className="iconfont icon-biaoge2" />
        蚁情报警工程排行
      </p>
      <Table
        dataSource={[]}
        rowKey={r => r.project_name}
        pagination={false}
        size="small"
      >
        <Table.Column title="工程名" dataIndex="project_name" key="project_name" />
        <Table.Column title="蚁情报警数" dataIndex="warn" key="warn" />
        <Table.Column title="已处理数" dataIndex="number" key="number" />
        <Table.Column title="地区" dataIndex="area" key="area" />
      </Table>
    </section>
  )
}
