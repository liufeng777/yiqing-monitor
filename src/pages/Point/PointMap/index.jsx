import React from 'react';
import { Link } from 'react-router-dom';
import { Descriptions, Tabs } from 'antd';
import { pointListInMap, projectGet, pointGet } from '../../../api';
import { getDateTime } from '../../Card/DateAndTime';
import { inspectResult, measureType, warnType } from '../../../assets/js/constant';
import PointPage from '../index';
import './index.less';

const { TabPane } = Tabs;

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
    // const centerPoint = this.state.project ? {
    //   lng: this.state.project.longitude / 1000000, lat: this.state.project.latitude / 1000000
    // } : {lng: 108.55, lat: 34.32}

    return (
      <section className="point-map-box">
        <header className="header">
          <span className="title">
            {
              this.props.location.state?.from === 'home' ? <>
                <Link to="/home">工程分布</Link> / 布点({this.state.points.length})
              </> : <>
                <Link to="/project">工程列表 ({this.state.project?.name})</Link> / 布点({this.state.points.length})
              </>
            }
          </span>
        </header>
        <section className='card-container'>
          <Tabs type="card" defaultActiveKey="map">
            <TabPane tab="布点列表" key="list">
              <PointPage hideTags={true} projId={this.props.match.params.proId} projName={this.state.project?.name} />
            </TabPane>
            <TabPane tab="布点分布" key="map">
              <section className='point-map-body'>
                <section id="point-map-container">
                  {/* <Map
                    style={{height: '100%'}}
                    center={centerPoint}
                    zoom={18}
                    enableScrollWheelZoom
                  >
                  {this.state.points.map((item) => {
                    return <CustomOverlay
                        position={new window.BMapGL.Point(item.longitude / 1000000, item.latitude / 1000000)}
                        key={item.point_id}
                    >
                        <span
                          style={{display: 'inline-block', width: 40, height: 40, cursor: 'pointer', textAlign: 'center'}}
                          onClick={() => {
                            this.getPointInfo(item.point_id)
                          }}
                        >
                        <span style={{
                          display: 'inline-block',
                          width: 15,
                          height: 15,
                          borderRadius: '50%',
                          backgroundColor: '#aff891',
                          boxShadow: `0 0 8px 8px #389e0d`
                        }} />
                        </span>
                    </CustomOverlay>
                  })}
                <NavigationControl />
                <ZoomControl />
                  </Map> */}
              </section>
              {
              this.state.activePoint &&
                <section className='point-item-desc'>
                  <i className='iconfont icon-guanbi1' onClick={() => {
                    this.setState({
                      activePoint: null
                    })
                  }}/>
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
          </TabPane>
          </Tabs>
        </section>
      </section>
    )
  }

  renderMap = (points, project) => {
    const centerPoint = project ? [project.longitude / 1000000, project.latitude / 1000000
    ] : [108.55, 34.32]
    const map = new window.AMap.Map('point-map-container', {
      zoom: 18,
      center: centerPoint,
    })

    for (const item of points) {
      const marker = new window.AMap.Marker({
          icon: require(`../../../assets/image/green.png`),
          position:  [item.longitude / 1000000, item.latitude / 1000000], // 基点位置
          offset: new window.AMap.Pixel(-17, -42) // 相对于基点的偏移位置
      });

      map.add(marker);
      marker.on("click", () => { 
        this.getPointInfo(item.point_id)
      });
    }
  }

  // 根据工程获取布点
  getPointByProject = async () => {
    const res = await pointListInMap({
      project_id: this.props.match.params.proId,
    });
    if (res) {
      this.setState({
        points: res.records
      })
      this.renderMap(res.records, this.state.project)
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
      this.renderMap(this.state.points, res.record)
    }
  }

  // 获取布点的最新信息
  getPointInfo = async (id) => {
    const res = await pointGet(id, {
      id
    });
    if (res) {
      this.setState({
        activePoint: res.record
      })
    }
  }
}


