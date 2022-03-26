import React from 'react';
import { withRouter } from  'react-router-dom'
import { Button } from 'antd';
import { pointListInMap } from '../../../api';
import { styleJson } from '../../../assets/js/constant';
import './index.less';

// 地图
import { Map, NavigationControl, ZoomControl, CustomOverlay } from 'react-bmapgl';

class ProjectMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      points: []
    }
  };
  

  componentDidMount() {
   console.log('######', Map)
  }

  // componentWillReceiveProps() {
  //   this.renderMap()
  // }

  render () {
    const adminRole = +sessionStorage.getItem('adminRole');
    return (
      <section className="project-map-box">
        <section id="project-map-container">
        <Map
          style={{height: '100%'}}
          mapStyleV2={{ styleJson }}
          center={this.props.centerPoint || {lng: 108.55, lat: 34.32}
          }
          zoom={this.props.zoom}
          enableScrollWheelZoom
        >
          {this.props.projects.map((item) => {
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
          })}
          <NavigationControl />
          <ZoomControl />
        </Map>
      </section>

      {/* 工程详情 */}
      {
        this.props.activeProject &&
        <section className='project-info'>
          <header className='info-header'>
            <span className='info-name'>{this.props.activeProject.name}</span>
            <i className='iconfont icon-guanbi1' onClick={() => {
              this.props.changeActiveProject(null)
            }} />
          </header>
          <ul className='info-body'>
            <li style={{marginRight: 20}}>
              <span>未处理报警(蚁情)数量：</span>
              <span style={{fontSize: 20, fontWeight: 'bold', color: '#FF4D4F'}}>
                {this.props.activeProject.termite_wait_count}
              </span>
            </li>
            <li>
              <span>报警(蚁情)总数：</span>
              <span style={{fontSize: 20, fontWeight: 'bold', color: '#FAAD14'}}>
                {this.props.activeProject.termite_count}
              </span>
            </li>
          </ul>
          { adminRole > 1 && <footer>
              <Button type="link" style={{fontWeight: 'bold'}} onClick={() => {
                this.props.history.push({
                  pathname: `/point/map/${this.props.activeProject.project_id}`,
                  state: { from : 'home' }
                })
              }}>查看布点（{this.state.points.length}）</Button>
            </footer>
          }
        </section>
      }
      </section>
    )
  }

  renderMap = () => {
    const map = new window.BMapGL.Map("project-map-container");
    // 中心点
    const centerPoint = this.props.centerPoint ?
    new window.BMapGL.Point(this.props.centerPoint.lng, this.props.centerPoint.lat) :
    new window.BMapGL.Point(108.55, 34.32)
    console.log('#####', this.props.zoom)
    map.centerAndZoom(centerPoint, this.props.zoom);
  }

  // 根据工程获取布点
  getPointByProject = async (item) => {
    const res = await pointListInMap({
      project_id: item.project_id
    });
    if (res) {
      this.setState({
        points: res.records
      })
    }
  }

  // 获取marker颜色
  getMarker = (project) => {
    let bgColor = '';
    let shadowColor = '';
    if (project.termite_wait_count > 0) {
      bgColor = '#FFA3AA';
      shadowColor = '#D42626'
    } else if (project.termite_count > 0) {
      bgColor = '#fdedc9';
      shadowColor = '#fbb20e';
    } else {
      bgColor = '#aff2fe';
      shadowColor = '#09a0b9'
    }

    return <span style={{
      display: 'inline-block',
      width: 15,
      height: 15,
      borderRadius: '50%',
      backgroundColor: bgColor,
      boxShadow: `0 0 8px 8px ${shadowColor}`
    }} />
  }
}

export default withRouter(ProjectMap);


