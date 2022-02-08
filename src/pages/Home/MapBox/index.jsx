import React from 'react';
import './index.less';

// 地图
import { Map, NavigationControl, ZoomControl, InfoWindow, CustomOverlay } from 'react-bmapgl';

export default class MapBox extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      activeProject: null
    }
  };

  render () {
      return (
        <section className="map-box">
        <p className="type-name">
          <i className="iconfont icon-gongcheng" />
          工程分布
        </p>
        <section id="map-container">
        <Map
          style={{height: '100%'}}
          center={this.props.centerPoint || {lng: 108.55, lat: 34.32}}
          zoom={this.props.zoom}
          enableScrollWheelZoom
        >
          {
            this.props.projects.map((item) => {
              return <CustomOverlay
                position={new window.BMapGL.Point(item.longitude / 1000000, item.latitude / 1000000)}
                key={item.project_id}
                    >
                <span
                  style={{display: 'inline-block', width: 40, height: 40, cursor: 'pointer', textAlign: 'center', lineHeight: 40}}
                  onClick={() => {
                    this.props.changeActiveProject(item)
                  }}
                >
                  {this.getMarker(item)}
                </span>
              </CustomOverlay>
            })
          }
          <NavigationControl />
          <ZoomControl />
          { this.props.activeProject &&
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
              </section>
            </InfoWindow>
          }
        </Map>
        </section>
      </section>
      )
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

    return <i className="iconfont icon-f-location" style={{color, fontSize: 30 }} />
  }
}


