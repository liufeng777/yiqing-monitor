import React from 'react';
import { Table, Pagination, Input, Tooltip, Modal, Button, message, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { genderData, userRoleData } from '../../assets/js/constant';
import { UserDetail } from './Detail';
import MD5 from 'crypto-js/md5';
import { SelectArea } from '../../component/SelectArea';
import { throttle } from 'throttle-debounce';
import './index.less';

// redux
import * as actions from '../../store/action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// api
import { userList, userBatchDelete, userAdd, userChange } from '../../api';

const { Option } = Select;

class UserPage extends React.Component {
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
      keyword: '',
      project_owner_type: '',
      area_code: this.props.areaCode,
      ...this.props.userSearchInfo
    }
  };

  componentDidMount () {
    this.getAll();
  }

  render () {
    return (
      <section className="admin-page page-view">
        <header className="header">
          <span className="title">用户列表</span>
          <span>
            <Button className="add-btn header-btn" type="primary" disabled={!this.state.selectedKeys.length} onClick={throttle(1000, () => {
              this.onDelete(this.state.selectedKeys)
            })}
            >
              <i className="iconfont icon-piliangshanchu1" />
              批量删除
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
              <span className="label">用户：</span>
              <Input
                value={this.state.proj_keyword}
                onChange={(e) => {
                  this.setState({
                    proj_keyword: e.target.value
                  })
                }}
                allowClear
                placeholder="名称、手机号"
                onPressEnter={() => {
                  this.getAll()
                }}
                style={{ width: 140 }}
              />
            </li>
            <li>
              <span className="label">负责人类型：</span>
              <Select value={this.state.project_owner_type + ''} style={{ width: 120 }}
                onChange={(val) => {
                  this.setState({
                    project_owner_type: +val
                  })
                }}
              >
                {
                  Object.keys(userRoleData).map((key) => {
                    return <Option value={key + ''} key={key}>{+key === 0 ? '全部' : userRoleData[key]}</Option>
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
            <li>
              <Tooltip title="搜素">
                <Button shape="circle" type="primary" style={{marginRight: 10}} onClick={() => {
                  this.props.setAreaCode(this.state.area_code)
                  this.getAll();
                  this.props.setSearchInfo({
                    type: 'user',
                    data: {
                      keyword: this.state.keyword,
                      project_owner_type: this.state.project_owner_type,
                      area_code: this.state.area_code
                    }
                  });
                }}>
                  <i className="iconfont icon-sousuo" />
                </Button>
              </Tooltip>
              <Tooltip title="重置">
                <Button shape="circle" type="primary" onClick={throttle(1000, () => {
                  const searchInfo = {
                    keyword: '',
                    project_owner_type: '',
                    area_code: ''
                  }
                  this.setState(() => (searchInfo), this.getAll)
                  this.props.setSearchInfo({
                    type: 'user',
                    data: searchInfo
                  });
                })}
                >
                  <i className="iconfont icon-zhongzhi" />
                </Button>
              </Tooltip>
            </li>
          </ul>
          <Table
            dataSource={this.state.tableData}
            rowKey={r => r.id}
            pagination={false}
            rowSelection={{
              onChange: (keys) => {
                this.setState({
                  selectedKeys: keys
                })
              }
            }}
          >
            <Table.Column title="用户名" dataIndex="name" key="name" />
            <Table.Column title="手机号" min-width="120px" dataIndex="mobile" key="mobile" />
            <Table.Column title="区域" dataIndex="area_name" key="area_name"
              render={(val, record) => (<span>{record.area_code ? val : '全国'}</span>)}
            />
            {/* <Table.Column title="性别" min-width="80px" dataIndex="gender" key="gender"
              render={(val, _) => (<span>{genderData[val]}</span>)}
            /> */}
            <Table.Column title="工程负责人类型" min-width="100px" dataIndex="project_owner_type" key="project_owner_type"
              render={(val, _) => (<span>{userRoleData[val]}</span>)}
            />
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
                    <i className="iconfont icon-shanchu" onClick={throttle(1000, () => this.onDelete([record.id]))} />
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
              this.props.setSearchInfo({
                type: 'user',
                data: searchInfo
              });
            }}
            onChange={(pageNumber) => {
              const searchInfo = {
                currentPage: pageNumber
              }
              this.setState(searchInfo, () => {
                this.getAll()
              });
              this.props.setSearchInfo({
                type: 'user',
                data: searchInfo
              });
            }}
          />
        </section>
      
        {/* 添加或者编辑 */}
        <UserDetail
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
    const res = await userList({
      get_count: this.state.pageSize,
      start_index: (this.state.currentPage - 1) * this.state.pageSize,
      keyword: this.state.keyword,
      project_owner_type: this.state.project_owner_type,
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
      title: '确认删除选中的用户?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await userBatchDelete(id, {})
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
    const {confirmPassword, password, ...others} = values;
    if (this.state.type === 'add') {
      others.password = MD5(password).toString();
    }
    const res = this.state.type === 'add' ?
    await userAdd(values) : await userChange(values.id, values);
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
    userSearchInfo: state.searchInfo.user
  };
};

const mapDispathToProps = (dispath) => {
  return {
    ...bindActionCreators(actions, dispath),
  };
};

export default connect(mapStateToProps, mapDispathToProps)(UserPage);
