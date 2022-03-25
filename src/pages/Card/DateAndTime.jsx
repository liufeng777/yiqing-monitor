import React from 'react';
import { DatePicker, TimePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm:ss';

export const DateAndTime = (props) => {
  const [date, time] = getDateTime(props.value)

  return (
    <section className="date-and-time-box" style={{width: '100%'}}>
      <DatePicker locale={locale} style={{marginRight: props.hideTime ? 0 : 10, width: props.hideTime ? '100%' : '50%'}}
        value={props.value ? moment(date, dateFormat) : ''}
        format={dateFormat}
        onChange={(moment, val) => {
          const timestamp = getTimestamp(val, time);
          props.onChange(timestamp);
        }}
      />
      {!props.hideTime && <TimePicker locale={locale}
        style={{width: 'calc(50% - 10px)'}}
        value={props.value ? moment(time, timeFormat) : ''}
        format={timeFormat}
        onChange={(moment, val) => {
          const timestamp = getTimestamp(date, val);
          props.onChange(timestamp);
        }}
      />}
    </section>
  );
};

// 格式化
const formatData = (val) => {
  return val > 9 ? val : `0${val}`;
}

// 获取日期时间
export const getDateTime = (val) => {
  if (!val) {
    return ['', '']
  }
  const date = new Date(val * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours(); 
  const minutes = date.getMinutes(); 
  const seconds = date.getSeconds();
  return [
    `${year}-${formatData(month)}-${formatData(day)}`,
    `${formatData(hour)}:${formatData(minutes)}:${formatData(seconds)}`
  ]
}

// 获取时间戳
const getTimestamp = (date, time) => {
  return new Date(date + ' ' + time).getTime() / 1000;
}
