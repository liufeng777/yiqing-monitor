import React from 'react';
import { Table, Pagination, Input, Tooltip, Modal, Button, message, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { warnType, inspectResult, measureType, termiteType, termiteAmount } from '../../assets/js/constant';
import { InspectDetail } from './Detail';
import { getDateTime, DateAndTime } from '../Card/DateAndTime';
import { SelectArea } from '../../component/SelectArea';
import { throttle } from 'throttle-debounce';
import './index.less';
import CacheTags from '../../component/CacheTags';

// redux
import * as actions from '../../store/action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// api
import { inspectList, inspectBatchDelete, inspectAdd, inspectChange } from '../../api';

const { Option } = Select;

class InspectPage extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      tableData: [],
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
      area_code: this.props.areaCode,
      area_point: this.props.areaPoint,
      warn_type: '',
      state: '',
      measure_type: '',
      begin_timestamp: '',
      end_timestamp: ''
    }
  };

  componentDidMount () {
    this.getAll();
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.cacheTags.find(v => v.path === '/inspect')) {
      this.setState(() => ({
        area_code: nextProps.areaCode
      }), this.getAll)
    }
  }

  render () {
    return (
      <section className="inspect-page page-view">
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
              <span className="label l-small">工程：</span>
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
              <span className="label l-small">区域：</span>
              <SelectArea selectAll width={320} area_code={this.state.area_code} visible onChange={({code, point}) => {
                this.setState({ area_code: code, area_point: point})
              }}
              />
            </li>
            <li>
              <span className="label l-large">报警类型：</span>
              <Select value={this.state.warn_type + ''} style={{width: 100}} onChange={(val) => {
                this.setState({ warn_type: +val})
              }}
              >
                {
                  Object.keys(warnType).map((key) => {
                    return <Option value={key + ''} key={key}>{+key === 1 ? '全部' : warnType[key]}</Option>
                  })
                }
              </Select>
            </li>
            <li>
              <span className="label l-large">检查结果：</span>
              <Select value={this.state.state + ''} style={{width: 100}} onChange={(val) => {
                this.setState({ state: +val})
              }}
              >
                {
                  Object.keys(inspectResult).map((key) => {
                    return <Option value={key + ''} key={key}>{+key === 0 ? '全部' : inspectResult[key]}</Option>
                  })
                }
              </Select>
            </li>
            <li>
              <span className="label l-large">措施类型：</span>
              <Select value={this.state.measure_type + ''} style={{width: 100}} onChange={(val) => {
                this.setState({ measure_type: +val})
              }}
              >
                {
                  Object.keys(measureType).map((key) => {
                    return <Option value={key + ''} key={key}>{+key === 0 ? '全部' : measureType[key]}</Option>
                  })
                }
              </Select>
            </li>
          </ul>
          <ul className="search-box" style={{borderTop: 'none'}}>
            <li>
              <span className="label l-small">布点：</span>
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
              <span className="label">检测完成时间(起始)：</span>
              <span>
                <DateAndTime value={this.state.begin_timestamp} onChange={(val) => {
                  this.setState({ begin_timestamp: val})
                }}
              /></span>
            </li>
            <li>
              <span className="label">检测完成时间(结束)：</span>
              <span><DateAndTime value={this.state.end_timestamp} onChange={(val) => {
                this.setState({ end_timestamp: val})
              }}
              /></span>
            </li>
            <li>
              <Tooltip title="搜素">
                <Button shape="circle" type="primary" style={{marginRight: 10}} onClick={() => {
                  this.getAll()
                }}>
                  <i className="iconfont icon-sousuo" />
                </Button>
              </Tooltip>
              <Tooltip title="重置">
                <Button shape="circle" type="primary" onClick={throttle(1000, () => {
                  const searchInfo = {
                    proj_keyword: '',
                    point_keyword: '',
                    area_code: 0,
                    warn_type: '',
                    state: '',
                    measure_type: '',
                    begin_timestamp: '',
                    end_timestamp: ''
                  }
                  this.setState(() => (searchInfo), this.getAll);
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
            rowKey={r => r.inspect_id}
            pagination={false}
            rowSelection={{
              onChange: (keys) => {
                this.setState({
                  selectedKeys: keys
                })
              }
            }}
          >
            <Table.Column
              title="工程"
              dataIndex="project_name"
              key="project_name"
            />
            <Table.Column
              title="布点"
              dataIndex="point_name"
              key="point_name"
            />
            <Table.Column title="报警类型" dataIndex="warn_type" key="warn_type"
              render={(val, _) => (<span>{warnType[val]}</span>)}
            />
            <Table.Column title="执行用户" dataIndex="user_name" key="user_name" />
            <Table.Column title="检查完成时间" dataIndex="done_timestamp" key="done_timestamp"
              render={(val, _) => (<span>{getDateTime(val).join(' ')}</span>)}
            />
            <Table.Column title="检查结果状态" dataIndex="state" key="state"
              render={(val, _) => (<span>{inspectResult[val]}</span>)}
            />
            <Table.Column title="措施类型" dataIndex="measure_type" key="measure_type"
              render={(val, _) => (<span>{measureType[val]}</span>)}
            />
            <Table.Column title="白蚁类型" dataIndex="termite_type" key="termite_type"
              render={(val, _) => (<span>{termiteType[val]}</span>)}
            />
            <Table.Column title="蚁量" dataIndex="termite_amount" key="termite_amount"
              render={(val, _) => (<span>{termiteAmount[val]}</span>)}
            />
            {/* <Table.Column title="备注信息" dataIndex="comment" key="comment"/>
            <Table.Column title="图片文件" dataIndex="image_file" key="image_file"/> */}
            <Table.Column title="操作" width="100px" dataIndex="operation" key="operation"
              render={(_, record) => (
                <>
                  <Tooltip title="修改">
                    <i className="iconfont icon-xiugai" onClick={throttle(1000, () => {
                      this.setState({
                        showDetail: true,
                        type: 'edit',
                        detail: record
                      })
                    })} 
                    />
                  </Tooltip>
                  <Tooltip title="删除">
                    <i className="iconfont icon-shanchu" onClick={throttle(1000, () => this.onDelete([record.inspect_id]))} />
                  </Tooltip>
                </>
              )}
            />
          </Table>
          <Pagination
            defaultCurrent={1}
            current={this.state.currentPage}
            pageSize={this.state.pageSize}
            showTotal={() => `总数 ${this.state.total} `}
            total={this.state.total}
            locale={{
              items_per_page: '每页行数',
            }}
            showSizeChanger
            onShowSizeChange={(currentPage, pageSize) => {
              const searchInfo = {
                currentPage: 1,
                pageSize
              }
              this.setState(searchInfo, () => {
                this.getAll()
              });
            }}
            onChange={(pageNumber) => {
              const searchInfo = {
                currentPage: pageNumber
              }
              this.setState(searchInfo, () => {
                this.getAll()
              });
            }}
          />
        </section>
        {/* 添加或者编辑 */}
        <InspectDetail
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
    const res = await inspectList({
      get_count: this.state.pageSize,
      start_index: (this.state.currentPage - 1) * this.state.pageSize,
      proj_keyword: this.state.proj_keyword,
      point_keyword: this.state.point_keyword,
      area_code: this.state.area_code,
      warn_type: this.state.warn_type,
      state: this.state.state,
      measure_type: this.state.measure_type,
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
      title: '确认删除选中的检查数据?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await inspectBatchDelete(id, {})
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
    await inspectAdd(values) : await inspectChange(values.inspect_id, values);
    if (res) {
      this.setState({
        showDetail: false,
        detail: null
      });
      message.success(`${this.state.type === 'add' ? '添加成功' : '修改成功'}`);
      this.getAll();
    }
  }
};

const mapStateToProps = (state) => {
  return {
    areaCode: state.areaCode,
    areaPoint: state.areaPoint,
    cacheTags: state.cacheTags
  };
};

const mapDispathToProps = (dispath) => {
  return {
    ...bindActionCreators(actions, dispath),
  };
};

export default connect(mapStateToProps, mapDispathToProps)(InspectPage);
