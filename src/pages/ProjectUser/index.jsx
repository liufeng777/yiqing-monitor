import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Pagination, Input, Tooltip, Modal, Button, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { projectUserRole } from '../../assets/js/constant';
import { ProjectDetail } from './Detail';
import { throttle } from 'throttle-debounce';
import './index.less';

// redux
import * as actions from '../../store/action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// api
import { projectGet, projectUserList, projectUserUnbind, projectUserBind, projectUserChange, projectUserExport } from '../../api';

class ProjectUserPage extends React.Component {
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
      projectName: '',
      // 搜索条件
      user_keyword: '',
      ...this.props.projectUserSearchInfo
    }
  };

  componentDidMount () {
    this.getAll();
    this.getProject();
  }

  render () {
    return (
      <section className="project-user-page page-view">
        <header className="header">
          <span className="title">
            <Link to="/project">工程</Link> / 工程人员列表
          </span>
          <span>
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
            <li style={{marginRight: 30}}>
              <i className="iconfont icon-gongcheng" style={{marginRight: 10}} />
              {this.state.projectName}
            </li>
            <li>
              <span className="label">用户：</span>
              <Input
                value={this.state.user_keyword}
                onChange={(e) => {
                  this.setState({
                    user_keyword: e.target.value
                  })
                }}
                allowClear
                placeholder="用户名、手机"
                onPressEnter={() => {
                  this.getAll()
                }}
                style={{ width: 200 }}
              />
            </li>
            <li>
              <Tooltip title="搜素">
                <Button shape="circle" type="primary" style={{marginRight: 10}} onClick={() => {
                  this.props.setSearchInfo({
                    type: 'projectUser',
                    data: {
                      user_keyword: this.state.user_keyword
                    }
                  });
                  this.getAll()
                }}>
                  <i className="iconfont icon-sousuo" />
                </Button>
              </Tooltip>
              <Tooltip title="重置">
                <Button shape="circle" type="primary" onClick={throttle(1000, () => {
                  this.setState(() => ({
                    user_keyword: ''
                  }), this.getAll);
                  this.props.setSearchInfo({
                    type: 'projectUser',
                    data: {
                      user_keyword: ''
                    }
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
            rowKey={r => r.project_id}
            pagination={false}
          >
            <Table.Column title="用户" dataIndex="name" key="name" />
            <Table.Column title="手机号" dataIndex="mobile" key="mobile" />
            <Table.Column title="角色" dataIndex="role" key="role"
              render={(val, _) => (<span>{projectUserRole[val]}</span>)}
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
                          user_id: record.id,
                          role: record.role
                        }
                      })
                    })} 
                    />
                  </Tooltip>
                  <Tooltip title="解绑">
                    <i className="iconfont icon-shanchu" onClick={throttle(1000, () => this.onDelete(record.id))} />
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
                type: 'projectUser',
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
                type: 'projectUser',
                data: searchInfo
              });
            }}
          />
        </section>
      
        {/* 添加或者编辑 */}
        <ProjectDetail onCancel={() => {
          this.setState({
            showDetail: false,
            detail: null
          })
        }}
        onSubmit={(values) => this.onSubmit(values)}
        detail={this.state.detail}
        visible={this.state.showDetail}
        />
      </section>
    );
  }

  // 获取工程详情
  getProject = async () => {
    const res = await projectGet(this.props.match.params.proId, {
      id: this.props.match.params.proId
    })
    if (res) {
      this.setState({
        projectName: res.record.name
      })
    }
  }
  
  // 分页获取
  getAll = async () => {
    const res = await projectUserList({
      get_count: this.state.pageSize,
      start_index: (this.state.currentPage - 1) * this.state.pageSize,
      project_id: this.props.match.params.proId,
      user_keyword: this.state.user_keyword,
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
      title: '确认解绑选中的人员?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await projectUserUnbind(this.props.match.params.proId, id, {})
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
    const param = {
      ...values,
      project_id: this.props.match.params.proId
    }
    const res = this.state.type === 'add' ?
    await projectUserBind(param) : await projectUserChange(param.project_id, param.user_id, param);
    if (res) {
      this.setState({
        showDetail: false,
        detail: null
      });
      message.success(`${this.state.type === 'add' ? '添加成功' : '修改成功'}`);
      this.getAll();
    }
  }

  // 导出数据
  exportData = async () => {
    const res = await projectUserExport({});
  }
};

const mapStateToProps = (state) => {
  return {
    areaCode: state.areaCode,
    projectUserSearchInfo: state.searchInfo.projectUser
  };
};

const mapDispathToProps = (dispath) => {
  return {
    ...bindActionCreators(actions, dispath),
  };
};

export default connect(mapStateToProps, mapDispathToProps)(ProjectUserPage);
