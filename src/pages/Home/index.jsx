import React from 'react';
import { Tooltip, Button, Tag } from 'antd';
import { SelectArea } from '../../component/SelectArea';
import { overviewStatistic, projectMap, warningList, overviewTopProjWarn } from '../../api';
import { warningType, barOption, lineOption } from '../../assets/js/constant';
import { Header } from '../../component/Header';
import { EchartSearch } from './EchartSearch';
import { WarnProjectRank } from './WarnProjectRank';
import { LatestWarn } from './LatestWarn';
import ProjectMap from './ProjectMap';
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
      area_point: JSON.parse(sessionStorage.getItem('areaPoint') || '{"lng":108.55,"lat":34.32}'),
      centerPoint: JSON.parse(sessionStorage.getItem('areaPoint') || '{"lng":108.55,"lat":34.32}'),
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
      warnTable: []
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
      bgColor: 'processing'
    }, {
      icon: 'icon-f-location',
      count: this.state.data.point_count,
      title: '布点',
      path: '/point',
      bgColor: 'processing'
    }]

    const rightDataArr = [{
      icon: 'icon-jinggao',
      count: this.getWarnCount(this.state.data.warns_count),
      title: '报警',
      path: '/warning',
      bgColor: 'error'
    }, {
      icon: 'icon-tance',
      count: this.state.data.detect_count,
      title: '探测',
      path: '/detect',
      bgColor: 'processing'
    }, {
      icon: 'icon-jianchajieguo',
      count: this.state.data.inspect_count,
      title: '检查',
      path: '/inspect',
      bgColor: 'processing'
    }]

    return (
      <section className="home-page">
        <section className="home-top">
          {/* 搜索 */}
          <section className="search-box">
            <section>
              <SelectArea
                selectAll
                width={330}
                area_code={this.state.area_code}
                visible
                onChange={({code, point}) => {
                  this.setState({ area_code: code, area_point: point})
                }}
              />
            </section>
            <section>
              <Tooltip title="搜素">
                <Button shape="circle" type="primary" style={{margin: '0px 10px'}} onClick={() => {
                  this.getStatistic()
                  this.getProjectsInMap()
                  this.getTopProjWarn();
                  this.getMapCenterAndZoom();
                  this.props.setAreaCode(this.state.area_code)
                }}
                >
                  <i className="iconfont icon-sousuo" />
                </Button>
              </Tooltip>
              <Tooltip title="重置">
                <Button shape="circle" type="primary" onClick={() => {
                  this.setState(() => ({
                    area_code: '',
                    area_point: '',
                    centerPoint: {lng: 108.55, lat: 34.32},
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
                  })
                }}
                >
                  <i className="iconfont icon-zhongzhi" />
                </Button>
              </Tooltip>
            </section>
          </section>
          <section className="home-title">蚁情监测平台</section>
          {/* 登录信息 */}
          <section className="login-info">
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
                      <span className="type-name">{item.title}：</span>
                      <Tag color={item.bgColor} onClick={() => {
                        this.props.history.push(item.path);
                      }}>
                        {item.count}
                      </Tag>
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
                <i className="iconfont icon-gongcheng" />
                <span>工程增量</span>
              </p>
              <section className="echart-data" id="project-echart" />
            </section>
            <section className="echart-box">
              <p>
                <i className="iconfont icon-f-location" />
                <span>布点增量</span>
              </p>
              <section className="echart-data" id="point-echart" />
            </section>
          </section>
          
          {/* 地图 */}
          <section className="body-center">
            <ProjectMap
              projects={this.state.projects}
              zoom={this.state.zoom}
              centerPoint={this.state.centerPoint}
              activeProject={this.state.activeProject}
              changeActiveProject={(item) => {
                this.setState({
                  activeProject: item
                })
              }}
            />
          </section>

          {/* 报警、检查 */}
          <section className="body-right">
            <ul className="data-box">
              {
                rightDataArr.map((item, index) => {
                  return (
                    <li key={index}>
                      <section className='right-data'>
                        <span className="type-name">{item.title}：</span>
                        <Tag color={item.bgColor} onClick={() => {
                            this.props.history.push(item.path);
                          }}>
                          {item.count}
                        </Tag>
                      </section>
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
                <i className="iconfont icon-jinggao" />
                <span>蚁情报警（已处理）</span>
              </p>
              <section className="echart-data" id="warn-echart" />
            </section>
            <section className="echart-box">
              <p>
                <i className="iconfont icon-jianchajieguo" />
                <span>检查数</span>
              </p>
              <section className="echart-data" id="inspect-echart" />
            </section>
          </section>
        </section>
        
        {/* 报警 */}
        <section className="home-footer">
          <section className="table-box">
            <WarnProjectRank data={this.state.projectTable} />
            <LatestWarn data={this.state.warnTable} />
          </section>
          <section className="echart-box" style={{marginTop: 0}}>
            <p>
              <i className="iconfont icon-jinggao" />
              报警类型
            </p>
            <section className="echart-data" id="warn-type-echart" />
          </section>
        </section>
      </section>
    );
  }
  
  // 获取报警总数
  getWarnCount = (data) => {
    if (data) {
      return Object.keys(data).reduce((pre, cur) => {
        return data[pre] + data[cur]
       })  
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
    const warnChart = echarts.init(chartDom);
    const option = {
      darkMode: true,
      legend: {
        top: 'bottom'
      },
      color: ['#ee6666', '#fac858', '#73c0de'],
      series: [
        {
          name: '',
          type: 'pie',
          radius: [10, 70],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 6
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
    const projectChart = echarts.init(chartDom);
    const option = barOption(res.project_time_names, res.project_counts);
    option && projectChart.setOption(option);
  }
  // 布点增量
  getPointEchart = (res) => {
    const chartDom = document.getElementById('point-echart');
    const pointChart = echarts.init(chartDom);
    const option = lineOption(res.point_time_names, res.point_counts);
    option && pointChart.setOption(option);
  }
  // 已处理报警
  getWarnEchart = (res) => {
    const chartDom = document.getElementById('warn-echart');
    const warnChart = echarts.init(chartDom);
    const option = barOption(res.warn_time_names, res.warn_counts);
    option && warnChart.setOption(option);
  }
  // 检查数
  getInspectEchart = (res) => {
    const chartDom = document.getElementById('inspect-echart');
    const inspectChart = echarts.init(chartDom);
    const option = lineOption(res.inspect_time_names, res.inspect_counts);
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
  }

  // 获取地图层级
  getMapCenterAndZoom = () => {
    this.setState((preState) => ({
      centerPoint: preState.area_point || preState.centerPoint
    }))

    if (!this.state.area_code) {
      this.setState({
        zoom: 6
      })
    }
    if (!(this.state.area_code % 10000)) {
      this.setState({
        zoom: 10
      })
    } else if (!(this.state.area_code % 100)) {
      this.setState({
        zoom: 12
      })
    } else {
      this.setState({
        zoom: 14
      })
    }
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
};

const mapStateToProps = (state) => {
  return {
    areaCode: state.areaCode,
  };
};

const mapDispathToProps = (dispath) => {
  return {
    ...bindActionCreators(actions, dispath),
  };
};

export default connect(mapStateToProps, mapDispathToProps)(HomePage);
