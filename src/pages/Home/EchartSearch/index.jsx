import React, { useState } from 'react';
import { Button, Radio } from 'antd';
import './index.less';

export const EchartSearch = (props) => {
  const [time, setTime] = useState('year');
  const [index, setIndex] = useState(0);

  return (
    <section className="echart-search">
      <Button
        type="primary"
        icon={<i className="iconfont icon-zuofanye" />}
        disabled={index === 0}
        onClick={() => {
          setIndex(index - 1);
          props.onChangeIndex(index - 1);
        }}
      />
      <Radio.Group value={time} onChange={(e) => {
        setTime(e.target.value);
        props.onChangeTime(e.target.value);
      }}>
        <Radio.Button value="year">按年</Radio.Button>
        <Radio.Button value="month">按月</Radio.Button>
      </Radio.Group>
      <Button
        type="primary"
        icon={<i className="iconfont icon-youfanye" />}
        onClick={() => {
          setIndex(index + 1);
          props.onChangeIndex(index + 1);
        }}
      />
    </section>
  )
}
