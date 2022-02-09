import React from 'react';
import { withRouter } from  'react-router-dom'
import { Button } from 'antd';
import { pointList } from '../../../api';
import './index.less';

// 地图
import { Map, NavigationControl, ZoomControl, InfoWindow, CustomOverlay } from 'react-bmapgl';

class ProjectMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      points: []
    }
  };

  render () {
      return (
        <section className="project-map-box">
          <i className="iconfont icon-gongcheng" />
          工程分布
          <section id="project-map-container">
        <Map
          style={{height: '100%'}}
          center={this.props.centerPoint || {lng: 108.55, lat: 34.32}
          }
          zoom={this.props.zoom}
          enableScrollWheelZoom
        >
          {/* 工程 */}
          {
            this.props.projects.map((item) => {
              return <CustomOverlay
                position={new window.BMapGL.Point(item.longitude / 1000000, item.latitude / 1000000)}
                key={item.project_id}
                    >
                <span
                  style={{display: 'inline-block', width: 40, height: 40, cursor: 'pointer', textAlign: 'center'}}
                  onClick={() => {
                    this.props.changeActiveProject(item)
                    this.getPointByProject(item)
                  }}
                >
                  {this.getMarker(item)}
                </span>
              </CustomOverlay>
            })
          }

          <NavigationControl />
          <ZoomControl />

          {/* 工程详情 */}
          {this.props.activeProject &&
            <InfoWindow
              position={{lng: this.props.activeProject.longitude / 1000000, lat: this.props.activeProject.latitude / 1000000}}
              title={this.props.activeProject.name}
              height={90}
            >
              <section>
                <p>
                  <span>未处理报警(蚁情)数量：</span>
                  <span style={{fontSize: 24, fontWeight: 'bold', color: '#FF4D4F'}}>{this.props.activeProject.termite_wait_count}</span>
                </p>
                <p>
                  <span>报警(蚁情)总数：</span>
                  <span style={{fontSize: 24, fontWeight: 'bold', color: '#FAAD14'}}>{this.props.activeProject.termite_count}</span>
                </p>
                <Button type="link" disabled={this.state.points.length === 0} onClick={() => {
                  this.props.history.push({
                    pathname: `/point/map/${this.props.activeProject.project_id}`,
                    state: { from : 'home' }
                  })
                }}>查看布点（{this.state.points.length}）</Button>
              </section>
            </InfoWindow>
          }
        </Map>
        </section>
      </section>
      )
  }

  // 根据工程获取布点
  getPointByProject = async (item) => {
    const res = await pointList({
      get_count: 100,
      start_index: 0,
      proj_keyword: item.project_id,
    });
    if (res) {
      this.setState({
        points: res.records
      })
    }
  }

  // 获取marker颜色
  getMarker = (project) => {
    let color = '';
    if (project.termite_wait_count > 0) {
      color = '#FF4D4F'
    } else if (project.termite_count > 0) {
      color = '#FAAD14'
    } else {
      color = '#52C41A'
    }

    return <i className="iconfont icon-gongcheng" style={{color, fontSize: 30 }} />
  }
}

export default withRouter(ProjectMap);


