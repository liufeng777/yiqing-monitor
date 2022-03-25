import React, { useState } from 'react';
import { Button, Radio } from 'antd';
import './index.less';

export const EchartSearch = (props) => {
  const [time, setTime] = useState(1);
  const [index, setIndex] = useState(0);

  return (
    <section className="echart-search">
      <Button
        style={{backgroundColor: '#A2A2A2'}}
        icon={<i className="iconfont icon-zuofanye" />}
        onClick={() => {
          setIndex(index - 1);
          props.onChangeIndex(index - 1);
        }}
      />
      <Radio.Group
        optionType="button"
        buttonStyle="solid"
        value={time} onChange={(e) => {
        setTime(e.target.value);
        props.onChangeTimeType(e.target.value);
      }}>
        <Radio.Button value={1}>按年</Radio.Button>
        <Radio.Button value={2}>按月</Radio.Button>
      </Radio.Group>
      <Button
        style={{backgroundColor: '#A2A2A2'}}
        icon={<i className="iconfont icon-youfanye" />}
        onClick={() => {
          setIndex(index + 1);
          props.onChangeIndex(index + 1);
        }}
      />
    </section>
  )
}
