import React from 'react';
import { Table, Pagination, Input, Tooltip, Modal, Button, message, Tag, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { deviceType, deviceState } from '../../assets/js/constant';
import { DeviceDetail } from './Detail';
import { throttle } from 'throttle-debounce';
import './index.less';

// api
import { deviceList, deviceBatchDelete, deviceAdd, deviceChange } from '../../api';

const { Option } = Select;

export default class DevicePage extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 30,
      showDetail: false,
      operationType: 'add',
      detail: null,
      selectedKeys: [],
      // 搜索
      keyword: '',
      type: '',
      state: ''
    }
  };

  componentDidMount () {
    this.getAll();
  }

  render () {
    return (
      <section className="admin-page page-view">
        <header className="header">
          <span className="title">设备列表</span>
          <span>
            <Button className="add-btn header-btn" type="primary" disabled={!this.state.selectedKeys.length} onClick={throttle(1000, () => {
              this.onDelete(this.state.selectedKeys)
            })}
            >
              <i className="iconfont icon-piliangshanchu1" />
              批量删除
            </Button>
            <Button className="import-btn header-btn" type="primary">
              <i className="iconfont icon-daoru" />
              导入
            </Button>
            <Button className="export-btn header-btn" type="primary">
              <i className="iconfont icon-export" />
              导出
            </Button>
            <Button className="add-btn header-btn" type="primary" onClick={throttle(1000, () => {
              this.setState({
                showDetail: true,
                operationType: 'add',
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
              <span className="label">设备：</span>
              <Input
                value={this.state.keyword}
                onChange={(e) => {
                  this.setState({
                    keyword: e.target.value
                  })
                }}
                allowClear
                placeholder="编码、标签"
                onPressEnter={() => {
                  this.getAll()
                }}
                style={{ width: 120 }}
              />
            </li>
            <li>
              <span className="label">设备类型：</span>
              <Select value={this.state.type + ''} style={{ width: 120 }}
                onChange={(val) => {
                  this.setState({
                    type: +val
                  })
                }}
              >
                {
                  Object.keys(deviceType).map((key) => {
                    return <Option value={key + ''} key={key}>{+key === 0 ? '全部' : deviceType[key]}</Option>
                  })
                }
              </Select>
            </li>
            <li>
              <span className="label">设备状态：</span>
              <Select value={this.state.state + ''} style={{ width: 120 }}
                onChange={(val) => {
                  this.setState({
                    state: +val
                  })
                }}
              >
                {
                  Object.keys(deviceState).map((key) => {
                    return <Option value={key + ''} key={key}>{+key === 0 ? '全部' : deviceState[key]}</Option>
                  })
                }
              </Select>
            </li>
            <li>
              <Tooltip title="搜素">
                <Button shape="circle" type="primary" style={{marginRight: 10}} onClick={throttle(1000, this.getAll)}>
                  <i className="iconfont icon-sousuo" />
                </Button>
              </Tooltip>
              <Tooltip title="重置">
                <Button shape="circle" type="primary" onClick={throttle(1000, () => {
                  this.setState(() => ({
                    keyword: '',
                    type: '',
                    state: ''
                  }), this.getAll)
                })}
                >
                  <i className="iconfont icon-zhongzhi" />
                </Button>
              </Tooltip>
            </li>
          </ul>
          <Table
            size="small"
            bordered
            dataSource={this.state.tableData}
            rowKey={r => r.device_id}
            pagination={false}
            rowSelection={{
              onChange: (keys) => {
                this.setState({
                  selectedKeys: keys
                })
              }
            }}
          >
            <Table.Column title="设备编码" dataIndex="device_code" key="device_code" />
            <Table.Column title="类型" dataIndex="device_type" key="device_type"
              render={(val, _) => (<span>{deviceType[val]}</span>)}
            />
            <Table.Column title="状态" dataIndex="state" key="state"
              render={(val, _) => (<span>{deviceState[val]}</span>)}
            />
            <Table.Column title="通讯卡" dataIndex="card_code" key="card_code" />
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
                        operationType: 'edit',
                        detail: {
                          device_id: record.device_id,
                          code: record.device_code,
                          type: record.device_type,
                          card_id: record.card_id,
                          tag: record.tag,
                          state: record.state
                        }
                      })
                    })} 
                    />
                  </Tooltip>
                  <Tooltip title="删除">
                    <i className="iconfont icon-shanchu" onClick={throttle(1000, () => this.onDelete([record.device_id]))} />
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
      
        {/* 添加或者编辑 */}
        <DeviceDetail
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
      </section>
    );
  }
  
  // 分页获取
  getAll = async () => {
    const res = await deviceList({
      get_count: this.state.pageSize,
      start_index: (this.state.currentPage - 1) * this.state.pageSize,
      keyword: this.state.keyword,
      type: this.state.type,
      state: this.state.state
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
      title: '确认删除选中的设备?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await deviceBatchDelete(id, {})
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
    const res = this.state.operationType === 'add' ?
    await deviceAdd(values) : await deviceChange(values.device_id, values);
    if (res) {
      this.setState({
        showDetail: false,
        detail: null
      });
      message.success(`${this.state.operationType === 'add' ? '添加成功' : '修改成功'}`);
      this.getAll();
    }
  }
};
