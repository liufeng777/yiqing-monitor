import React from 'react';
import { Tooltip, Button } from 'antd';
import { SelectArea } from '../../component/SelectArea';
import { overviewStatistic, projectMap, warningList } from '../../api';
import { warningType } from '../../assets/js/constant';
import { Header } from '../../component/Header';
import { EchartSearch } from './EchartSearch';
import { WarnProjectRank } from './WarnProjectRank';
import { LatestWarn } from './LatestWarn';
import './index.less';

import * as echarts from 'echarts/core';
import { ToolboxComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

// 地图
import { Map, NavigationControl, ZoomControl, InfoWindow, CustomOverlay } from 'react-bmapgl';

echarts.use(
  [ToolboxComponent, LegendComponent, PieChart, CanvasRenderer]
);

export default class HomePage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      area_code: +sessionStorage.getItem('areaCode') || 0,
      area_point: JSON.parse(sessionStorage.getItem('areaPoint') || '{"lng":108.55,"lat":34.32}'),
      centerPoint: JSON.parse(sessionStorage.getItem('areaPoint') || '{"lng":108.55,"lat":34.32}'),
      zoom: 6,
      data: {},
      projects: [],
      tableData: [],
      activeProject: null
    }
  }

  componentDidMount() {
    this.getData()
    this.getProjectsInMap()
    this.getWarning()
    this.getMapCenterAndZoom()
  }

  render() {
    const leftDataArr = [{
      icon: 'icon-gongcheng',
      count: this.state.data.project_count,
      title: '工程',
      path: '/project'
    }, {
      icon: 'icon-f-location',
      count: this.state.data.point_count,
      title: '布点',
      path: '/point'
    }]

    const rightDataArr = [{
      icon: 'icon-tance',
      count: this.state.data.detect_count,
      title: '探测',
      path: '/detect'
    }, {
      icon: 'icon-jianchajieguo',
      count: this.state.data.inspect_count,
      title: '检查',
      path: '/inspect'
    }]

    return (
      <section className="home-page">
        <section className="home-top">
          {/* 搜索 */}
          <section className="search-box">
            <section>
              {/* <span className="label l-small">区域：</span> */}
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
                  this.getData()
                  this.getProjectsInMap()
                  this.getWarning()
                  this.getMapCenterAndZoom();
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
                    tableData: [],
                    activeProject: null
                  }), () => {
                    this.getData()
                    this.getProjectsInMap()
                    this.getWarning()
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
            <Header />
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
                      <span className="number-value" onClick={() => {
                        this.props.history.push(item.path);
                      }}
                      >{item.count}</span>
                    </li>
                  )
                })
              }
            </ul>
            {/* 按年按月 */}
            <EchartSearch
              onChangeTime={(val) => {}}
              onChangeIndex={(val) => {}}
            />
            {/* echats */}
            <section className="echart-box">
              <p>
                <i className="iconfont icon-gongcheng" />
                工程增量
              </p>
              <section className="echart-data" id="project-echart" />
            </section>
            <section className="echart-box">
              <p>
                <i className="iconfont icon-f-location" />
                布点增量
              </p>
              <section className="echart-data" id="point-echart" />
            </section>
          </section>
          
          {/* 地图 */}
          <section className="body-center">
            <section className="project-box">
              <p className="type-name">
                <i className="iconfont icon-gongcheng" />
                工程分布
              </p>
              <section id="map-container">
              <Map
                style={{height: '100%'}}
                center={this.state.centerPoint || {lng: 108.55, lat: 34.32}}
                zoom={this.state.zoom}
                enableScrollWheelZoom
              >
                {
                  this.state.projects.map((item) => {
                    return <CustomOverlay
                      position={new window.BMapGL.Point(item.longitude / 1000000, item.latitude / 1000000)}
                      key={item.project_id}
                          >
                      <span
                        style={{display: 'inline-block', width: 40, height: 40, cursor: 'pointer', textAlign: 'center', lineHeight: 40}}
                        onClick={() => {
                          this.setState({activeProject: item})
                        }}
                      >
                        {this.getMarker(item)}
                      </span>
                    </CustomOverlay>
                  })
                }
                <NavigationControl />
                <ZoomControl />
                { this.state.activeProject &&
                  <InfoWindow
                    position={{lng: this.state.activeProject.longitude / 1000000, lat: this.state.activeProject.latitude / 1000000}}
                    title={this.state.activeProject.name}
                    height={90}
                  >
                    <section>
                      <p>
                        <span>未处理报警(蚁情)数量：</span>
                        <span style={{fontSize: 24, fontWeight: 'bold', color: '#FF4D4F'}}>{this.state.activeProject.termite_wait_count}</span>
                      </p>
                      <p>
                        <span>报警(蚁情)总数：</span>
                        <span style={{fontSize: 24, fontWeight: 'bold', color: '#FAAD14'}}>{this.state.activeProject.termite_count}</span>
                      </p>
                    </section>
                  </InfoWindow>
                }
              </Map>
              </section>
            </section>
          </section>

          {/* 报警、检查 */}
          <section className="body-right">
            <ul className="data-box">
              {
                rightDataArr.map((item, index) => {
                  return (
                    <li key={index}>
                      <section>
                        <span className="type-name">{item.title}：</span>
                        <span className="number-value" onClick={() => {
                          this.props.history.push(item.path);
                        }}
                        >{item.count}</span>
                      </section>
                    </li>
                  )
                })
              }
            </ul>
            {/* 按年按月 */}
            <EchartSearch
              onChangeTime={(val) => {}}
              onChangeIndex={(val) => {}}
            />

            {/* echats */}
            <section className="echart-box">
              <p>
                <i className="iconfont icon-jinggao" />
                蚁情报警（已处理）
              </p>
              <section className="echart-data" id="warn-echart" />
            </section>
            <section className="echart-box">
              <p>
                <i className="iconfont icon-jianchajieguo" />
                检查数
              </p>
              <section className="echart-data" id="detect-echart" />
            </section>
          </section>
        </section>
        
        {/* 报警 */}
        <section className="home-footer">
          <section className="table-box">
            <WarnProjectRank />
            <LatestWarn />
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

  // 获取数据
  getData = async () => {
    const res = await overviewStatistic({
      area_code: this.state.area_code
    });
    if (res) {
      this.setState({
        data: res
      })
      const data = Object.keys(res.warns_count).map(key => {
        return {
          value: res.warns_count[key],
          name: warningType[key] + '(' + res.warns_count[key] + ')'
        }
      })
      const chartDom = document.getElementById('warn-type-echart');
      const warnChart = echarts.init(chartDom);
      const option = {
        legend: {
          top: 'bottom'
        },
        color: ['#ee6666', '#fac858', '#73c0de'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: [10, 60],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 4
            },
            data
          }
        ]
      }

      option && warnChart.setOption(option);
    }
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

  // 获取报警
  getWarning = async () => {
    const res = await warningList({
      get_count: 10,
      start_index: 0,
      area_code: this.state.area_code
    });
    if (res) {
      this.setState({ tableData: res.records})
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

    return <i className="iconfont icon-f-location" style={{color, fontSize: 30 }} />
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
};
