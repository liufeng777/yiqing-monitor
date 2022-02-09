import React from 'react';
import { Table, Pagination, Input, Tooltip, Modal, Button, message, Tag, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { pointState, warningType, deviceType, deviceState, measureType, inspectResult } from '../../assets/js/constant';
import { PointDetail } from './Detail';
import { SelectArea } from '../../component/SelectArea';
import { throttle } from 'throttle-debounce';
import { getDateTime } from '../Card/DateAndTime';
import './index.less';

// redux
import * as actions from '../../store/action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// api
import { pointList, pointBatchDelete, pointAdd, pointChange, pointExport, pointImport } from '../../api';

const { Option } = Select;

class PointPage extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      tableData: [],
      projects: [],
      total: 0,
      currentPage: 1,
      pageSize: 30,
      showDetail: false,
      type: 'add',
      detail: null,
      selectedKeys: [],
      // 搜索
      proj_keyword: '',
      point_keyword: '',
      state: '',
      device_code: '',
      device_type: '',
      area_code: this.props.areaCode,
    }
  };

  fileInput

  componentDidMount () {
    this.getAll();
  }

  render () {
    return (
      <section className="point-page page-view">
        <header className="header">
          <span className="title">布点列表</span>
          <span>
            <Button className="add-btn header-btn" type="primary" disabled={!this.state.selectedKeys.length} onClick={throttle(1000, () => {
              this.onDelete(this.state.selectedKeys)
            })}
            >
              <i className="iconfont icon-piliangshanchu1" />
              批量删除
            </Button>
            <Button className="import-btn header-btn" type="primary" onClick={throttle(1000, () => this.fileInput.click())}>
              <i className="iconfont icon-daoru" />
              导入
            </Button>
            <Button className="export-btn header-btn" type="primary" onClick={throttle(1000, this.exportData)}>
              <i className="iconfont icon-export" />
              导出
            </Button>
            <Button className="add-btn header-btn" type="primary" onClick={throttle(1000, () => {
              this.setState({
                showDetail: true,
                type: 'add',
                detail: null
              })
            })}
            >
              <i className="iconfont icon-add1" />
              添加
            </Button> 
          </span>
        </header>
        <section className="body">
          <ul className="search-box">
            <li>
              <span className="label">工程：</span>
              <Input
                value={this.state.proj_keyword}
                onChange={(e) => {
                  this.setState({
                    proj_keyword: e.target.value
                  })
                }}
                allowClear
                placeholder="名称"
                onPressEnter={() => {
                  this.getAll()
                }}
                style={{ width: 120 }}
              />
            </li>
            <li>
              <span className="label">布点：</span>
              <Input
                value={this.state.point_keyword}
                onChange={(e) => {
                  this.setState({
                    point_keyword: e.target.value
                  })
                }}
                allowClear
                placeholder="名称、标签"
                onPressEnter={() => {
                  this.getAll()
                }}
                style={{ width: 120 }}
              />
            </li>
            <li>
              <span className="label">状态：</span>
              <Select value={this.state.state + ''} style={{ width: 120 }}
                onChange={(val) => {
                  this.setState({
                    state: +val
                  })
                }}
              >
                {
                  Object.keys(pointState).map((key) => {
                    return <Option value={key + ''} key={key}>{+key === 0 ? '全部' : pointState[key]}</Option>
                  })
                }
              </Select>
            </li>
            <li>
              <span className="label">区域：</span>
              <SelectArea width={320} area_code={this.state.area_code} visible onChange={({code}) => {
                this.setState({ area_code: code})
              }}
              />
            </li>
            
          </ul>
          <ul className="search-box" style={{borderTop: 'none'}}>
            <li>
              <span className="label">设备编码：</span>
              <Input
                value={this.state.device_code}
                onChange={(e) => {
                  this.setState({
                    device_code: e.target.value
                  })
                }}
                allowClear
                placeholder="设备编码"
                onPressEnter={() => {
                  this.getAll()
                }}
                style={{ width: 120 }}
              />
            </li>
            <li>
              <span className="label">设备类型：</span>
              <Select style={{width: 120}} value={this.state.device_type + ''} onChange={val => {
                this.setState({device_type: +val})
              }}
              >
                {
                  Object.keys(deviceType).map(v => {
                    return <Option key={v} value={v + ''}>{+v === 0 ? '全部' : deviceType[v]}</Option>
                  })
                }
              </Select>
            </li>
            <li>
              <Tooltip title="搜素">
                <Button shape="circle" type="primary" style={{marginRight: 10}} onClick={() => {
                  this.props.setAreaCode(this.state.area_code)
                  this.getAll()
                }}>
                  <i className="iconfont icon-sousuo" />
                </Button>
              </Tooltip>
              <Tooltip title="重置">
                <Button shape="circle" type="primary" onClick={throttle(1000, () => {
                  this.setState(() => ({
                    proj_keyword: '',
                    point_keyword: '',
                    state: '',
                    area_code: ''
                  }), this.getAll)
                })}
                >
                  <i className="iconfont icon-zhongzhi" />
                </Button>
              </Tooltip>
            </li>
          </ul>
          <Table
            bordered
            dataSource={this.state.tableData}
            rowKey={r => r.point_id}
            pagination={false}
            scroll={{x: 1500}}
            rowSelection={{
              onChange: (keys) => {
                this.setState({
                  selectedKeys: keys
                })
              }
            }}
          >
            <Table.Column title="布点名" width={100} dataIndex="name" key="name" />
            <Table.Column title="所属工程" width={100} dataIndex="project_name" key="project_name" />
            <Table.Column title="状态" width={90} dataIndex="state" key="state"
              render={(val, _) => (<span>{pointState[val]}</span>)}
            />
            {/* 设备信息 */}
            <Table.ColumnGroup title="设备信息">
              <Table.Column title="编码" dataIndex="device_code" key="device_code" />
              <Table.Column title="类型" width={90} dataIndex="device_type" key="device_type"
                render={(val, _) => (<span>{deviceType[val]}</span>)}
              />
              <Table.Column title="状态" width={90} dataIndex="device_state" key="device_state"
                render={(val, _) => (<span>{deviceState[val]}</span>)}
              />
            </Table.ColumnGroup>
            {/* 通讯卡信息 */}
            {/* <Table.ColumnGroup title="通讯卡信息">
              <Table.Column title="编码" dataIndex="card_code" key="card_code" />
              <Table.Column title="类型" dataIndex="card_type" key="card_type"
                render={(val, _) => (<span>{cardType[val]}</span>)}
              />
              <Table.Column title="流量截止时间" dataIndex="service_deadline" key="service_deadline"
                render={(val, _) => (<span>{getDateTime(val).join(' ')}</span>)}
              />
            </Table.ColumnGroup> */}

            {/* 检查信息 */}
            <Table.ColumnGroup title="检查信息">
              <Table.Column title="措施" dataIndex="inspect_measure" key="inspect_measure"
                render={(val, _) => (<span>{measureType[val]}</span>)}
              />
              <Table.Column title="结果" dataIndex="inspect_state" key="inspect_state"
                render={(val, _) => (<span>{inspectResult[val]}</span>)}
              />
              <Table.Column title="检查时间" width={120} dataIndex="inspect_timestamp" key="inspect_timestamp"
                render={(val, _) => (<span>{getDateTime(val).join(' ')}</span>)}
              />
            </Table.ColumnGroup>
            <Table.Column title="部署时间" width={120} dataIndex="deploy_timestamp" key="deploy_timestamp"
              render={(val, _) => (<span>{getDateTime(val).join(' ')}</span>)}
            />
            <Table.Column title="探测时间" width={120} dataIndex="detect_timestamp" key="detect_timestamp"
              render={(val, _) => (<span>{getDateTime(val).join(' ')}</span>)}
            />
            <Table.Column title="报警类型" width={90} dataIndex="warn_type" key="warn_type"
              render={(val, _) => (<span>{warningType[val]}</span>)}
            />

            <Table.Column title="标签" dataIndex="tag" key="tag"
              render={(val, _) => (<Tag>{val}</Tag>)}
            />
            <Table.Column title="操作" width="100px" dataIndex="operation" key="operation"
              render={(_, record) => (
                <>
                  <Tooltip title="修改">
                    <i className="iconfont icon-xiugai" onClick={throttle(1000, () => {
                      this.setState({
                        showDetail: true,
                        type: 'edit',
                        detail: {
                          point_id: record.point_id,
                          project_id: record.project_id,
                          name: record.name,
                          tag: record.tag,
                          state: record.state,
                        }
                      })
                    })} 
                    />
                  </Tooltip>
                  <Tooltip title="删除">
                    <i className="iconfont icon-shanchu" onClick={throttle(1000, () => this.onDelete([record.point_id]))} />
                  </Tooltip>
                </>
              )}
            />
          </Table>
          <Pagination
            defaultCurrent={this.state.currentPage}
            pageSize={this.state.pageSize}
            showTotal={() => `总数 ${this.state.total} `}
            total={this.state.total}
            locale={{
              items_per_page: '每页行数',
            }}
            showSizeChanger
            onShowSizeChange={(currentPage, pageSize) => {
              this.setState({
                currentPage: 1,
                pageSize
              }, () => {
                this.getAll()
              });
            }}
            onChange={(pageNumber) => {
              this.setState({
                currentPage: pageNumber
              }, () => {
                this.getAll()
              });
            }}
          />
        </section>
      
        {/* 添加或者编辑弹窗 */}
        <PointDetail
          visible={this.state.showDetail}
          onCancel={() => {
            this.setState({
              showDetail: false,
              detail: null
            })
          }}
          onSubmit={(values) => this.onSubmit(values)}
          detail={this.state.detail}
        />

        {/* 导入csv */}
        <input
          type="file"
          ref={r => this.fileInput = r}
          style={{display: 'none'}}
          id="upload-file"
          accept={"text/csv"}
          onClick={throttle(1000, (e) => {
            e.target.value = ''
          })}
          onChange={async (e) => {
            const file = e.target.files[0];

            if (file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
              message.warning(`请上传CSV格式的文件`);
              return;
            }

            // 导入数据
            if (file) {
              const res = await pointImport({
                input_file: file
              });
              if (res && res.complete_count) {
                this.getAll()
              } else {
                message.error(res.err_msgs?.join('、'))
              }
            }
          }}
        />
      </section>
    );
  }
  
  // 分页获取
  getAll = async () => {
    const res = await pointList({
      get_count: this.state.pageSize,
      start_index: (this.state.currentPage - 1) * this.state.pageSize,
      proj_keyword: this.state.proj_keyword,
      point_keyword: this.state.point_keyword,
      state: this.state.state,
      device_code: this.state.device_code,
      device_type: this.state.device_type,
      area_code: this.state.area_code
    });
    if (res) {
      this.setState({
        tableData: res.records,
        total: res.total_count
      })
    }
  }

  // 删除
  onDelete = (id) => {
    Modal.confirm({
      title: '确认删除选中的布点?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await pointBatchDelete(id, {})
        if (res) {
          this.getAll();
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }

  // 添加或者修改
  onSubmit = async (values) => {
    const res = this.state.type === 'add' ?
    await pointAdd(values) : await pointChange(values.point_id, values);
    if (res) {
      this.setState({
        showDetail: false,
        detail: null
      });
      message.success(`${this.state.type === 'add' ? '添加成功' : '修改成功'}`);
      this.getAll();
    }
  }

  // 导出
  exportData = async () => {
    const res = await pointExport({
      ignoreResCode: true,
      proj_keyword: this.state.proj_keyword,
      user_keyword: this.state.user_keyword,
      area_code: this.state.area_code,
    })

    const content = "\ufeff" + res;
    const blob = new Blob([content], { type: 'text/csv, chartset=UTF-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.style.display = 'none';
    a.download = '布点.csv';
    a.click();
    URL.revokeObjectURL(a.href)
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

export default connect(mapStateToProps, mapDispathToProps)(PointPage);

