import React from 'react';
import { Link } from 'react-router-dom';
import { Descriptions } from 'antd';
import { pointList, projectGet } from '../../../api';
import { getDateTime } from '../../Card/DateAndTime';
import { inspectResult, measureType, warnType } from '../../../assets/js/constant';
import './index.less';

// 地图
import { Map, NavigationControl, ZoomControl, CustomOverlay } from 'react-bmapgl';

export default class PointMap extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      points: [],
      activePoint: null,
      project: null
    }
  };

  componentDidMount() {
    this.getProject()
    this.getPointByProject()
  }

  render () {
    const centerPoint = this.state.project ? {
      lng: this.state.project.longitude / 1000000, lat: this.state.project.latitude / 1000000
    } : {lng: 108.55, lat: 34.32}

    return (
      <section className="point-map-box">
        <header className="header">
          <span className="title">
            {
              this.props.location.state.from === 'home' && <>
                <Link to="/home">工程分布</Link> / 布点分布({this.state.points.length})
              </>
            }
            {
              this.props.location.state.from === 'project' && <>
                <Link to="/project">工程列表 ({this.state.project?.name})</Link> / 布点分布({this.state.points.length})
              </>
            }
          </span>
        </header>
        <section className='point-map-body'>
          <section id="point-map-container">
            <Map
              style={{height: '100%'}}
              center={centerPoint}
              zoom={18}
              enableScrollWheelZoom
            >
            {/* 布点 */}
              {this.state.points.map((item) => {
                return <CustomOverlay
                    position={new window.BMapGL.Point(item.longitude / 1000000, item.latitude / 1000000)}
                    key={item.point_id}
                >
                    <span
                      style={{display: 'inline-block', width: 40, height: 40, cursor: 'pointer', textAlign: 'center'}}
                      onClick={() => {
                        this.setState({
                          activePoint: item
                        })
                      }}
                    >
                    <i className="iconfont icon-f-location" style={{
                      color: this.state.activePoint?.point_id === item.point_id ? '#52c41a' : '#389e0d',
                      fontSize: this.state.activePoint?.point_id === item.point_id ? 50 : 30
                    }} />
                    </span>
                </CustomOverlay>
              })}
            <NavigationControl />
            <ZoomControl />
            </Map>
          </section>
          {
            this.state.activePoint &&
            <section className='point-item-desc'>
              <Descriptions title={`布点详情（${this.state.activePoint.name}）`} bordered size="small">
                <Descriptions.Item label="探测时间">{
                  this.state.activePoint.detect_timestamp ?
                    getDateTime(this.state.activePoint.detect_timestamp).join(' ') : '未知'
                }</Descriptions.Item>
                <Descriptions.Item label="检查时间">{
                  this.state.activePoint.inspect_timestamp ?
                  getDateTime(this.state.activePoint.inspect_timestamp).join(' ') : '未知'
                }</Descriptions.Item>
                <Descriptions.Item label="检查结果">{
                  inspectResult[this.state.activePoint.inspect_state]
                }</Descriptions.Item>
                <Descriptions.Item label="措施">{
                  measureType[this.state.activePoint.inspect_measure]
                }</Descriptions.Item>
                <Descriptions.Item label="报警类型">{
                  this.state.activePoint.warn_type ?
                  warnType[this.state.activePoint.warn_type] : '未知'
                }</Descriptions.Item>
              </Descriptions>
            </section>
          }
        </section>
      </section>
    )
  }

  // 根据工程获取布点
  getPointByProject = async () => {
    const res = await pointList({
      get_count: 100,
      start_index: 0,
      proj_keyword: this.props.match.params.proId,
    });
    if (res) {
      this.setState({
        points: res.records
      })
    }
  }

  // 获取工程信息 （centerPoint）
  getProject = async () => {
    const res = await projectGet(this.props.match.params.proId, {
      id: this.props.match.params.proId
    })
    if (res) {
      this.setState({
        project: res.record
      })
    }
  }
}


