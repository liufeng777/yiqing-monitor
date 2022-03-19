import React, { useEffect, useState } from 'react';
import { areaList } from '../api/index';
import { Select } from 'antd';

const { Option } = Select;

export const SelectArea = (props) => {
  const [initCode, setInitCode] = useState('');

  const [provinceArr, setProvinceArr] = useState([]);
  const [privinceCode, setProvinceCode] = useState('');
  // const [privinceName, setProvinceName] = useState('');

  const [cityArr, setCityArr] = useState([]);
  const [cityCode, setCityCode] = useState('');
  // const [cityName, setCityName] = useState('');

  const [countyArr, setCountyArr] = useState([]);
  const [countyCode, setCountyCode] = useState('');

  useEffect(() => {
    async function fetchData () {
      // 初始化数据
      setInitCode('');
      let priCode = '';

      if (props.area_code === 0) {
        setCityCode('');
        setCountyCode('');
      }

      if (props.area_code || props.area_code === 0) {
        priCode = Math.floor(props.area_code / 10000) * 10000;
        setProvinceCode(priCode);
      } else {
        setProvinceCode('');
        setCityCode('');
        setCountyCode('');
      }

      const res = await areaList({level: 1, get_count: 100});
      if (res) {
        setProvinceArr(res.records);
      }
      
      // 编辑时
      if (props.area_code && props.area_code !== initCode) {
        if (!(props.area_code % 10000)) {
          setProvinceCode(props.area_code)
          setCityCode('')
          setCountyCode('')

          // 获取市
          const res = await areaList({level: 2, parent_code: priCode, get_count: 100});
          if (res) {
            setCityArr(res.records)
            setCityCode('')
            setCountyCode('')
          }
        } else {
          const level2Code = Math.floor(props.area_code / 100) * 100;
          const level3Code = !(props.area_code % 100) ? '' : props.area_code;
          // 获取市
          const res2 = await areaList({level: 2, parent_code: priCode, get_count: 100});
          if (res2) {
            setCityArr(res2.records)
            setCityCode(level2Code)
          }

          // 获取区
          const res3 = await areaList({level: 3, parent_code: level2Code, get_count: 100});
          if (res3) {
            setCountyArr(res3.records)
            setCountyCode(level3Code);
          }
        }
      }
    }
    fetchData();
  }, [props.area_code])

  return (
    <section style={{
      width: props.width || 392,
      display: 'flex',
      justifyContent: 'space-between'
    }}
    >
      {/* 省 */}
      <Select value={privinceCode + ''} placeholder="省" style={{marginRight: 10, width: 'calc((100% - 20px) / 3)'}}
        onChange={async (val) => {
          setInitCode(+val);
          setProvinceCode(+val);
          setCityArr([]);
          setCountyArr([]);
          setCityCode('');
          setCountyCode('');

          // areaName
          const province = provinceArr.find(p => +p.code === +val);
          const point = province ? {lng: +province.lng, lat: +province.lat} : '';
          props.onChange({code: +val, point});

          if (!+val) return
          const res = await areaList({level: 2, parent_code: +val, get_count: 100});
          if (res) {
            setCityArr(res.records)
          }
        }}
      >
        {
          props.selectAll && <Option value={'0'} key={0}>全国</Option>
        }
        {
          provinceArr?.map((item) => {
            return <Option value={item.code + ''} key={item.code}>{item.name}</Option>
          })
        }
      </Select>

      {/* 市 */}
      <Select value={cityCode + ''} placeholder="市" style={{marginRight: 10, width: 'calc((100% - 20px) / 3)'}}
        onChange={async (val) => {
          setInitCode(+val);
          setCityCode(+val);
          setCountyArr([]);
          setCountyCode('');

          // areaName
          const city = cityArr.find(p => +p.code === +val);
          const point = city ? {lng: +city.lng, lat: +city.lat} : '';
          props.onChange({code: +val, point});

          const res = await areaList({level: 3, parent_code: +val, get_count: 100});
          if (res) {
            setCountyArr(res.records)
          }

        }}
      >
        {
          cityArr?.map((item) => {
            return <Option value={item.code + ''} key={item.code}>{item.name}</Option>
          })
        }
      </Select>

      {/* 区 */}
      <Select value={countyCode + ''} placeholder="区" style={{width: 'calc((100% - 20px) / 3)'}}
        onChange={async (val) => {
          setInitCode(+val);
          setCountyCode(+val);

          // areaName
          const county = countyArr.find(p => +p.code === +val);
          const point = county ? {lng: +county.lng, lat: +county.lat} : '';
          props.onChange({code: +val, point});
        }}
      >
        {
          countyArr?.map((item) => {
            return <Option value={item.code + ''} key={item.code}>{item.name}</Option>
          })
        }
      </Select>
    </section>
  )
}
