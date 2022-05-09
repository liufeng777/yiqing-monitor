import React from 'react';
import { Tooltip, Button } from 'antd';
import { SelectArea } from '../../component/SelectArea';
import { overviewStatistic, projectMap, overviewTopProjWarn, pointListInMap } from '../../api';
import { warningType, barOption, lineOption } from '../../assets/js/constant';
import { Header } from '../../component/Header';
import { EchartSearch } from './EchartSearch';
import { WarnProjectRank } from './WarnProjectRank';
import { LatestWarn } from './LatestWarn';
import './index.less';

import * as echarts from 'echarts/core';
import { ToolboxComponent, LegendComponent, GridComponent } from 'echarts/components';
import { PieChart, BarChart, LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// redux
import * as actions from '../../store/action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

echarts.use(
  [ // 饼图
    ToolboxComponent,LegendComponent, PieChart,
    // 柱状图
    GridComponent, BarChart,
    // 折线图
    LineChart, UniversalTransition,
    CanvasRenderer
  ]
);

class HomePage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      area_code: this.props.areaCode,
      area_point: this.props.areaPoint,
      zoom: 6,
      data: {},
      projects: [],
      activeProject: null,
      // 按年按月参数
      projAndPointTimeType: 1,
      projAndPointIndex: 0,
      warnAndInspectTimeType: 1,
      warnAndInspectIndex: 0,
      // 表格数据
      projectTable: [],
      warnTable: [],
      points: []
    }
  }

  componentDidMount() {
    this.getStatistic()
    this.getProjectsInMap()
    this.getMapCenterAndZoom()
    this.getTopProjWarn()
  }

  render() {
    const leftDataArr = [{
      icon: 'icon-gongcheng',
      count: this.state.data.project_count,
      title: '工程',
      path: '/project',
      bgColor: '#01B4D2'
    }, {
      icon: 'icon-f-location',
      count: this.state.data.point_count,
      title: '布点',
      path: '/point',
      bgColor: '#4bb419'
    }]

    const rightDataArr = [{
      icon: 'icon-jinggao',
      count: this.getWarnCount(this.state.data.warns_count),
      title: '报警',
      path: '/warning',
      bgColor: '#EE6666'
    }, {
      icon: 'icon-tance',
      count: this.state.data.inspect_count,
      title: '检查',
      path: '/detect',
      bgColor: '#d9a93d'
    }]

    const adminRole = +sessionStorage.getItem('adminRole');

    return (
      <section className="home-page">
        <div className='test'></div>
        <section className="home-top">
          {/* 搜索 */}
          <section className="home-top-item search-box">
            <section>
              <SelectArea
                selectAll
                width={280}
                area_code={this.state.area_code}
                visible
                onChange={({code, point}) => {
                  this.setState({ area_code: code, area_point: point})
                }}
              />
            </section>
            <section>
              <Tooltip title="搜素">
                <section className='search-btn' style={{margin: '0px 10px'}} onClick={() => {
                  this.getStatistic()
                  this.getProjectsInMap()
                  this.getTopProjWarn();
                  this.getMapCenterAndZoom();
                  this.props.setAreaCode(this.state.area_code)
                  this.props.setAreaPoint(this.state.area_point)
                }}
                >
                  <i className="iconfont icon-sousuo" />
                </section>
              </Tooltip>
              <Tooltip title="重置">
                <section className='search-btn' onClick={() => {
                  this.setState(() => ({
                    area_code: 0,
                    area_point: {lng: 108.55, lat: 34.32},
                    zoom: 6,
                    data: {},
                    projects: [],
                    activeProject: null,
                    projectTable: [],
                    warnTable: []
                  }), () => {
                    this.getStatistic()
                    this.getProjectsInMap()
                    this.getTopProjWarn()
                    this.props.setAreaCode(0)
                    this.props.setAreaPoint({lng: 108.55, lat: 34.32})
                  })
                }}
                >
                  <i className="iconfont icon-zhongzhi" />
                </section>
              </Tooltip>
            </section>
          </section>
          <section className="home-top-item home-title" />
          {/* 登录信息 */}
          <section className="home-top-item login-info">
            <span style={{marginRight: 40}}>探测数：{this.state.data.detect_count}</span>
            <Header onSubmit={(val) => this.props.changeLoginInfo(val)} />
          </section>
        </section>

        <section className="home-body">
          {/* 工程、布点 */}
          <section className="body-left">
            <ul className="data-box">
              {
                leftDataArr.map((item, index) => {
                  return (
                    <li key={index}>
                      <section
                        className='data-circle'
                        style={{backgroundColor: item.bgColor}}
                        onClick={() => {
                          if (adminRole === 1) return;
                          this.props.history.push(item.path);
                        }}
                      >
                        {item.count}
                      </section>
                      <span className="type-name">{item.title}</span>
                    </li>
                  )
                })
              }
            </ul>
            {/* 按年按月 */}
            <EchartSearch
              onChangeTimeType={(val) => {
                this.setState({
                  projAndPointTimeType: val
                }, () => {
                  this.getStatistic()
                })
              }}
              onChangeIndex={(val) => {
                this.setState({
                  projAndPointIndex: val,
                }, () => {
                  this.getStatistic()
                })
              }}
            />
            {/* echats */}
            <section className="echart-box">
              <p>
                <i className="iconfont icon-huanyanse-12" />
                <span>工程增量</span>
              </p>
              <section className="echart-data" id="project-echart" />
            </section>
            <section className="echart-box">
              <p>
                <i className="iconfont icon-huanyanse-12" />
                <span>布点增量</span>
              </p>
              <section className="echart-data" id="point-echart" />
            </section>
          </section>
          
          {/* 地图 */}
          <section className="body-center">
            {/* <ProjectMap
              projects={this.state.projects}
              zoom={this.state.zoom}
              centerPoint={this.props.areaPoint}
            /> */}

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



          </section>

          {/* 报警、检查 */}
          <section className="body-right">
            <ul className="data-box">
              {
                rightDataArr.map((item, index) => {
                  return (
                    <li key={index}>
                      <section
                        className='data-circle'
                        style={{backgroundColor: item.bgColor}}
                        onClick={() => {
                          if (adminRole === 1) return;
                          this.props.history.push(item.path);
                        }}
                      >
                        {item.count}
                      </section>
                      <span className="type-name">{item.title}</span>
                    </li>
                  )
                })
              }
            </ul>
            {/* 按年按月 */}
            <EchartSearch
              onChangeTimeType={(val) => {
                this.setState({
                  warnAndInspectTimeType: val
                }, () => {
                  this.getStatistic()
                })
              }}
              onChangeIndex={(val) => {
                this.setState({
                  warnAndInspectIndex: val,
                }, () => {
                  this.getStatistic()
                })
              }}
            />

            {/* echats */}
            <section className="echart-box">
              <p>
                <i className="iconfont icon-huanyanse-12" />
                <span>蚁情报警</span>
              </p>
              <section className="echart-data" id="warn-echart" />
            </section>
            <section className="echart-box">
              <p>
                <i className="iconfont icon-huanyanse-12" />
                <span>检查数</span>
              </p>
              <section className="echart-data" id="inspect-echart" />
            </section>
          </section>
        </section>

        <section className='home-footer'>
          <section className="table-box">
              <WarnProjectRank data={this.state.projectTable} />
            </section>
          <section className="echart-box warn-type-echart-box" style={{marginTop: 0}}>
              <p className='table-title'>
                <i className="iconfont icon-huanyanse-12" />
                <span>报警类型</span>
              </p>
              <section
                className="echart-data"
                id="warn-type-echart"
                style={{height: 235}}
              />
          </section>

          <section className="table-box">
            <LatestWarn data={this.state.warnTable} />
          </section>
          </section>
      </section>
    );
  }
  
  // 获取报警总数
  getWarnCount = (data) => {
    if (data && data[3]) {
      return data[3] 
    } else {
      return 0
    }
  }
  
  // 获取数据
  getStatistic = async () => {
    const res = await overviewStatistic({
      area_code: this.state.area_code,
      cfg_time_type: this.state.projAndPointTimeType,
      cfg_index: this.state.projAndPointIndex,
      supv_time_type: this.state.warnAndInspectTimeType,
      supv_index: this.state.warnAndInspectIndex
    });
    if (res) {
      this.setState({
        data: res
      })
      // 报警类型
      this.getWarnTypeEchart(res);
      // 工程增量
      this.getProjectEchart(res);
      // 布点增量
      this.getPointEchart(res);
      // 已处理报警
      this.getWarnEchart(res);
      // 检查数
      this.getInspectEchart(res);
    }
  }

  // 报警类型的Echart
  getWarnTypeEchart = (res) => {
    // 报警类型的Echarts
    const data = Object.keys(res.warns_count).map(key => {
      return {
        value: res.warns_count[key],
        name: warningType[key] + '(' + res.warns_count[key] + ')'
      }
    })
    const chartDom = document.getElementById('warn-type-echart');
    const warnChart = echarts.init(chartDom, 'dark');
    const option = {
      darkMode: true,
      legend: {
        top: 'bottom'
      },
      color: ['#ee6666', '#FAC857', '#01B4D2'],
      backgroundColor: '#2b2b2b',
      series: [
        {
          name: '',
          type: 'pie',
          radius: [40, 70],
          center: ['50%', '50%'],
          itemStyle: {
            borderRadius: 4
          },
          label: {
            textBorderWidth: 0
          },
          labelLine: {
            length: 4,
            length2: 4
          },
          data
        }
      ]
    }
    option && warnChart.setOption(option);
  }
  // 工程增量
  getProjectEchart = (res) => {
    const chartDom = document.getElementById('project-echart');
    const projectChart = echarts.init(chartDom, 'dark');
    const option = lineOption(res.project_time_names, res.project_counts);
    option && projectChart.setOption(option);
  }
  // 布点增量
  getPointEchart = (res) => {
    const chartDom = document.getElementById('point-echart');
    const pointChart = echarts.init(chartDom, 'dark');
    const option = barOption(res.point_time_names, res.point_counts);
    option && pointChart.setOption(option);
  }
  // 已处理报警
  getWarnEchart = (res) => {
    const chartDom = document.getElementById('warn-echart');
    const warnChart = echarts.init(chartDom, 'dark');
    const option = lineOption(res.warn_time_names, res.warn_counts);
    option && warnChart.setOption(option);
  }
  // 检查数
  getInspectEchart = (res) => {
    const chartDom = document.getElementById('inspect-echart');
    const inspectChart = echarts.init(chartDom, 'dark');
    const option = barOption(res.inspect_time_names, res.inspect_counts);
    option && inspectChart.setOption(option);
  }

  // 获取工程
  getProjectsInMap = async () => {
    const res = await projectMap({
      area_code: this.state.area_code
    })
    if (res) {
      this.setState({
        projects: res.records
      });
    }
    this.renderMap(this.state.zoom, this.state.projects)
  }

  // 获取地图层级
  getMapCenterAndZoom = () => {
    let zoom = 14;
    if (!this.state.area_code) {
      zoom = 5
      this.setState({
        zoom: 5
      })
    } else if (!(this.state.area_code % 10000)) {
      zoom = 10
      this.setState({
        zoom: 10
      })
    } else if (!(this.state.area_code % 100)) {
      zoom = 12
      this.setState({
        zoom: 12
      })
    } else {
      this.setState({
        zoom: 14
      })
    }
    this.renderMap(zoom, this.state.projects)
  }

  // 获取蚁情最多的工程和最新蚁情报警
  getTopProjWarn = async () => {
    const res = await overviewTopProjWarn({
      area_code: this.state.area_code
    });
    if (res) {
      this.setState({
        projectTable: res.projects,
        warnTable: res.warns
      })
    }
  }

  renderMap = (zoom, projects) => {
    console.log('#######', zoom)
    // 地图初始化应该在地图容器div已经添加到DOM树之后
    const center = [this.props.areaPoint?.lng || 108.55, this.props.areaPoint?.lat || 34.32]
    const map = new window.AMap.Map('project-map-container', {
      zoom,
      center, //中心点坐标
      mapStyle: 'amap://styles/darkblue',
    })

    for (const item of projects) {
        const img = this.getMarkerImg(item)

        const marker = new window.AMap.Marker({
            icon: require(`../../assets/image/${img}`),
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
};

const mapStateToProps = (state) => {
  return {
    areaCode: state.areaCode,
    areaPoint: state.areaPoint
  };
};

const mapDispathToProps = (dispath) => {
  return {
    ...bindActionCreators(actions, dispath),
  };
};

export default connect(mapStateToProps, mapDispathToProps)(HomePage);
