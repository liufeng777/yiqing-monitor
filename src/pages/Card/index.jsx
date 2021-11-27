import React from 'react';
import { Table, Pagination, Input, Tooltip, Modal, Button, message, Tag, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { cardType, cardState } from '../../assets/js/constant';
import { CardDetail } from './Detail';
import { getDateTime } from './DateAndTime';
import { throttle } from 'throttle-debounce';
import './index.less';

// api
import { cardList, cardBatchDelete, cardAdd, cardChange, cardExport } from '../../api';

const { Option } = Select;

export default class CardPage extends React.Component {
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
          <span className="title">通讯卡列表</span>
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
            <Button className="export-btn header-btn" type="primary" onClick={throttle(1000, this.exportData)}>
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
              <span className="label">通讯卡：</span>
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
              <span className="label">通讯卡类型：</span>
              <Select value={this.state.type + ''} style={{ width: 100 }}
                onChange={(val) => {
                  this.setState({
                    type: +val
                  })
                }}
              >
                {
                  Object.keys(cardType).map((key) => {
                    return <Option value={key + ''} key={key}>{+key === 0 ? '全部' : cardType[key]}</Option>
                  })
                }
              </Select>
            </li>
            <li>
              <span className="label">通讯卡状态：</span>
              <Select value={this.state.state + ''} style={{ width: 100 }}
                onChange={(val) => {
                  this.setState({
                    state: +val
                  })
                }}
              >
                {
                  Object.keys(cardState).map((key) => {
                    return <Option value={key + ''} key={key}>{+key === 0 ? '全部' : cardState[key]}</Option>
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
            dataSource={this.state.tableData}
            rowKey={r => r.card_id}
            pagination={false}
            rowSelection={{
              onChange: (keys) => {
                this.setState({
                  selectedKeys: keys
                })
              }
            }}
          >
            <Table.Column title="通讯卡编码" dataIndex="card_code" key="card_code" />
            <Table.Column title="类型" dataIndex="card_type" key="card_type"
              render={(val, _) => (<span>{cardType[val]}</span>)}
            />
            <Table.Column title="状态" dataIndex="state" key="state"
              render={(val, _) => (<span>{cardState[val]}</span>)}
            />
            <Table.Column title="标签" dataIndex="tag" key="tag"
              render={(val, _) => (<Tag>{val}</Tag>)}
            />
            <Table.Column title="流量包年或包月截止时间" dataIndex="service_deadline" key="service_deadline"
              render={(val, _) => (<span>{getDateTime(val).join(' ')}</span>)}
            />
            <Table.Column title="上一次续费时间" dataIndex="last_pay_timestamp" key="last_pay_timestamp"
              render={(val, _) => (<span>{getDateTime(val).join(' ')}</span>)}
            />
            <Table.Column title="上一次续费价格(分)" dataIndex="last_pay_expense" key="last_pay_expense" />
            <Table.Column title="上一次续费时长(天)" dataIndex="last_pay_period" key="last_pay_period" />
            <Table.Column title="操作" width="100px" dataIndex="operation" key="operation"
              render={(_, record) => (
                <>
                  <Tooltip title="修改">
                    <i className="iconfont icon-xiugai" onClick={throttle(1000, () => {
                      this.setState({
                        showDetail: true,
                        operationType: 'edit',
                        detail: {
                          ...record,
                          code: record.card_code,
                          type: record.card_type
                        }
                      })
                    })} 
                    />
                  </Tooltip>
                  <Tooltip title="删除">
                    <i className="iconfont icon-shanchu" onClick={throttle(1000, () => this.onDelete([record.card_id]))} />
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
        <CardDetail
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
    const res = await cardList({
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
      title: '确认删除选中的通讯卡?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await cardBatchDelete(id, {})
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
    await cardAdd(values) : await cardChange(values.card_id, values);
    if (res) {
      this.setState({
        showDetail: false,
        detail: null
      });
      message.success(`${this.state.operationType === 'add' ? '添加成功' : '修改成功'}`);
      this.getAll();
    }
  }

  // 导出数据
  exportData = async () => {
    const res = await cardExport({});
    console.log(res)
  }
};
