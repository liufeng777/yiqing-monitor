import React from 'react';
import { Link } from 'react-router-dom';
import { Descriptions, Tabs, Radio, Space } from 'antd';
import { pointListInMap, projectGet, pointGet } from '../../../api';
import { getDateTime } from '../../Card/DateAndTime';
import { inspectResult, measureType, warnType } from '../../../assets/js/constant';
import PointPage from '../index';
import './index.less';

// redux
import * as actions from '../../../store/action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const { TabPane } = Tabs;

class PointMap extends React.Component {
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
              <TabPane tab="布点分布" key="map">
                <section className='point-map-body'>
                  <section id="point-map-container" />
                  <section className='map-type'>
                    <Radio.Group onChange={(e) => {
                      this.props.setMapDefaultType(e.target.value);
                      this.renderMap(this.state.points, this.state.project, e.target.value)
                    }} value={this.props.mapDefaultType}>
                      <Space direction="vertical">
                        <Radio value={0}>标准地图</Radio>
                        <Radio value={1}>卫星图</Radio>
                      </Space>
                    </Radio.Group>
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
            <TabPane tab="布点列表" key="list">
              <PointPage hideTags={true} projId={this.props.match.params.proId} projName={this.state.project?.name || ''} />
            </TabPane>
          </Tabs>
        </section>
      </section>
    )
  }

  renderMap = (points, project, mapType) => {
    const centerPoint = project ? [project.longitude / 1000000, project.latitude / 1000000
    ] : [108.55, 34.32]
    const map = new window.AMap.Map('point-map-container', {
      zoom: 18,
      center: centerPoint,
      mapStyle: 'amap://styles/darkblue',
    });

    map.plugin(["AMap.MapType"], () => {
      //地图类型切换
      const type= new window.AMap.MapType({
        defaultType: mapType
      });
      map.addControl(type);
  });

    for (const item of points) {
      const marker = new window.AMap.Marker({
          icon: require(`../../../assets/image/green.png`),
          position:  [item.longitude / 1000000, item.latitude / 1000000], // 基点位置
      });

      map.add(marker);
      marker.on("click", () => { 
        this.getPointInfo(item.point_id)
      });
    }

    // const centerPoint = new window.BMapGL.Point(project ? project.longitude / 1000000 : 108.55, project ? project.latitude / 1000000 : 34.32);
    // const map = new window.BMapGL.Map("point-map-container");
    // map.centerAndZoom(centerPoint, 18);

    // const zoomCtrl = new window.BMapGL.ZoomControl();  // 添加缩放控件
    // map.addControl(zoomCtrl);
    
    // for (const item of points) {
    //   const myIcon = new window.BMapGL.Icon(require(`../../../assets/image/green.png`), new window.BMapGL.Size(40, 40));     
    //   // 创建标注对象并添加到地图  
    //   const point = new window.BMapGL.Point(item.longitude / 1000000, item.latitude / 1000000)
    //   const marker = new window.BMapGL.Marker(point, {icon: myIcon});   
    //   map.addOverlay(marker);

    //   marker.addEventListener("click", () => { 
    //     this.getPointInfo(item.point_id)
    //   });
    // }
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
      this.renderMap(res.records, this.state.project, this.props.mapDefaultType)
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
      this.renderMap(this.state.points, res.record, )
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

const mapStateToProps = (state) => {
  return {
    areaCode: state.areaCode,
    areaPoint: state.areaPoint,
    mapDefaultType: state.mapDefaultType
  };
};

const mapDispathToProps = (dispath) => {
  return {
    ...bindActionCreators(actions, dispath),
  };
};

export default connect(mapStateToProps, mapDispathToProps)(PointMap);



