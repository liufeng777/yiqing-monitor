import React from 'react';
import { withRouter } from  'react-router-dom'
import { Button } from 'antd';
import { pointListInMap } from '../../../api';
import { styleJson } from '../../../assets/js/constant';
import './index.less';

class ProjectMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      points: [],
      activeProject: null
    }
  };
  

  componentDidMount() {
    this.renderMap()
  }

  componentWillReceiveProps() {
    this.renderMap()
  }

  render () {
    const adminRole = +sessionStorage.getItem('adminRole');
    return (
      <section className="project-map-box">
        <section id="project-map-container">
        </section>
      {/* 工程详情 */}
      {
        this.state.activeProject &&
        <section className='project-info'>
          <header className='info-header'>
            <span className='info-name'>{this.state.activeProject.name}</span>
            <i className='iconfont icon-guanbi1' onClick={() => {
              this.setState({
                activeProject: null
              })
            }} />
          </header>
          <ul className='info-body'>
            <li style={{marginRight: 20}}>
              <span>未处理报警(蚁情)数量：</span>
              <span style={{fontSize: 20, fontWeight: 'bold', color: '#FF4D4F'}}>
                {this.state.activeProject.termite_wait_count}
              </span>
            </li>
            <li>
              <span>报警(蚁情)总数：</span>
              <span style={{fontSize: 20, fontWeight: 'bold', color: '#FAAD14'}}>
                {this.state.activeProject.termite_count}
              </span>
            </li>
          </ul>
          { adminRole > 1 && <footer>
              <Button type="link" style={{fontWeight: 'bold'}} onClick={() => {
                this.props.history.push({
                  pathname: `/point/map/${this.state.activeProject.project_id}`,
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
    const centerPoint =
    new window.BMapGL.Point(this.props.centerPoint?.lng || 108.55, this.props.centerPoint?.lat || 34.32);
    map.centerAndZoom(centerPoint, this.props.zoom);

    const zoomCtrl = new window.BMapGL.ZoomControl();  // 添加缩放控件
    map.addControl(zoomCtrl);

    map.setMapStyleV2({styleJson:styleJson});

    for (const item of this.props.projects) {
      const myIcon = new window.BMapGL.Icon(require('../../../assets/image/red.png'), new window.BMapGL.Size(23, 25), {   
        // 指定定位位置。  
        // 当标注显示在地图上时，其所指向的地理位置距离图标左上   
        // 角各偏移10像素和25像素。您可以看到在本例中该位置即是  
        // 图标中央下端的尖角位置。   
        anchor: new window.BMapGL.Size(10, 25),   
        // 设置图片偏移。  
        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您  
        // 需要指定大图的偏移位置，此做法与css sprites技术类似。   
        imageOffset: new window.BMapGL.Size(0, 0 - 25)   // 设置图片偏移   
      });     
      // 创建标注对象并添加到地图  
      const point = new window.BMapGL.Point(item.longitude / 1000000, item.latitude / 1000000)
      const marker = new window.BMapGL.Marker(point, {icon: myIcon});   
      map.addOverlay(marker);

      marker.addEventListener("click", () => { 
        this.setState({
          activeProject: item
        })
        this.getPointByProject(item)
      });
    }
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


