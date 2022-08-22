import React from 'react';
import { Table, Pagination, Input, Tooltip, Modal, Button, message, Tag, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { cardType, cardState } from '../../assets/js/constant';
import { CardDetail } from './Detail';
import { getDateTime, DateAndTime } from './DateAndTime';
import { throttle } from 'throttle-debounce';
import './index.less';
import CacheTags from '../../component/CacheTags';

// api
import { cardList, cardBatchDelete, cardAdd, cardChange, cardExport, cardImport } from '../../api';

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
      state: '',
      proj_keyword: '',
      point_keyword: '',
      begin_timestamp: 0,
      end_timestamp: 0
    }
  };

  fileInput

  componentDidMount () {
    this.getAll();
  }

  render () {
    return (
      <section className="card-page page-view">
        <CacheTags />
        <header className="header">
          <span/>
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
              <span className="label l-large">所属工程：</span>
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
              <span className="label l-large">所属布点：</span>
              <Input
                value={this.state.point_keyword}
                onChange={(e) => {
                  this.setState({
                    point_keyword: e.target.value
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
          </ul>
          <ul className="search-box" style={{borderTop: 'none'}}>
            <li>
              <span className="label" style={{width: 320}}>流量包年或包月截止时间(起始)：</span>
              <DateAndTime value={this.state.begin_timestamp} onChange={(val) => {
                this.setState({
                  begin_timestamp: val
                })
              }} />
            </li>
            <li>
              <span className="label" style={{width: 160}}>截止时间(结束)：</span>
              <DateAndTime value={this.state.end_timestamp} onChange={(val) => {
                this.setState({
                  end_timestamp: val
                })
              }} />
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
          <section className='table-box'>
          <Table
            size="small"
            bordered
            dataSource={this.state.tableData}
            rowKey={(r, index ) => index}
            pagination={false}
            rowSelection={{
              onChange: (keys) => {
                this.setState({
                  selectedKeys: keys
                })
              }
            }}
            style={{minWidth: 1800}}
          >
            <Table.Column title="通讯卡编码" dataIndex="card_code" key="card_code" />
            <Table.Column title="类型" dataIndex="card_type" key="card_type"
              render={(val, _) => (<span>{cardType[val]}</span>)}
            />
            <Table.Column title="状态" dataIndex="state" key="state"
              render={(val, _) => (<span>{cardState[val]}</span>)}
            />
            <Table.Column title="所属工程" dataIndex="project_name" key="project_name" />
            <Table.Column title="所属布点" dataIndex="point_name" key="point_name" />
            <Table.Column title="设备编码" dataIndex="device_code" key="device_code" />
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
          </section>
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
              const res = await cardImport({
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
    const res = await cardList({
      get_count: this.state.pageSize,
      start_index: (this.state.currentPage - 1) * this.state.pageSize,
      keyword: this.state.keyword,
      type: this.state.type,
      state: this.state.state,
      proj_keyword: this.state.proj_keyword,
      point_keyword: this.state.point_keyword,
      begin_timestamp: this.state.begin_timestamp,
      end_timestamp: this.state.end_timestamp
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
    const res = await cardExport({
      ignoreResCode: true,
      keyword: this.state.keyword,
      type: this.state.type,
      state: this.state.state,
    })

    const content = "\ufeff" + res;
    const blob = new Blob([content], { type: 'text/csv, chartset=UTF-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.style.display = 'none';
    a.download = '通讯卡.csv';
    a.click();
    URL.revokeObjectURL(a.href)
  }
};
