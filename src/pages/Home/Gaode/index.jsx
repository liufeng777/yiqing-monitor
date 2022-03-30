import React from 'react';
import { withRouter } from  'react-router-dom'
import { Button } from 'antd';
import { pointListInMap } from '../../../api';
import '../ProjectMap/index.less';


class ProjectMap extends React.Component {
  constructor(props) {
    super(props);
    this.map ={};
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
        <section id="project-map-container" />

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
    // 地图初始化应该在地图容器div已经添加到DOM树之后
    const map = new window.AMap.Map('project-map-container', {
      zoom: this.props.zoom,
      center: [this.props.centerPoint?.lng || 108.55, this.props.centerPoint?.lat || 34.32], //中心点坐标
      mapStyle: 'amap://styles/darkblue',
    })

    for (const item of this.props.projects) {
        const img = this.getMarkerImg(item)

        const marker = new window.AMap.Marker({
            icon: require(`../../../assets/image/${img}`),
            position:  [item.longitude / 1000000, item.latitude / 1000000], // 基点位置
            offset: new window.AMap.Pixel(-17, -42) // 相对于基点的偏移位置
        });

        map.add(marker);
        marker.on("click", () => { 
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

  getMarkerImg = (project) => {
    if (project.termite_wait_count > 0) {
        return 'red.png'
      } else if (project.termite_count > 0) {
        return 'yellow.png'
      } else {
        return 'blue.png'
      }
  }
}

export default withRouter(ProjectMap);


