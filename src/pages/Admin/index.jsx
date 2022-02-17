import React from 'react';
import { Table, Pagination, Input, Tooltip, Modal, Button, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { genderData, adminRoleData } from '../../assets/js/constant';
import { AdminDetail } from './Detail';
import MD5 from 'crypto-js/md5';
import { throttle } from 'throttle-debounce';
import './index.less';

// api
import { adminList, adminDelete, adminAdd, adminChange } from '../../api';

export default class AdminPage extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      tableData: [],
      keyword: '',
      total: 0,
      currentPage: 1,
      pageSize: 30,
      showDetail: false,
      type: 'add',
      detail: null
    }
  };

  componentDidMount () {
    this.getAll();
  }

  render () {
    return (
      <section className="admin-page page-view">
        <header className="header">
          <span className="title">管理员列表</span>
          <span>
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
              <span className="label">管理员：</span>
              <Input
                value={this.state.keyword}
                onChange={(e) => {
                  this.setState({
                    keyword: e.target.value
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
              <Tooltip title="搜素">
                <Button shape="circle" type="primary" style={{marginRight: 10}} onClick={throttle(1000, this.getAll)}>
                  <i className="iconfont icon-sousuo" />
                </Button>
              </Tooltip>
              <Tooltip title="重置">
                <Button shape="circle" type="primary" onClick={throttle(1000, () => {
                  this.setState(() => ({
                    keyword: ''
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
            rowKey={r => r.admin_id}
            pagination={false}
          >
            <Table.Column title="管理员名" dataIndex="admin_name" key="admin_name" />
            <Table.Column title="手机号" min-width="120px" dataIndex="mobile" key="mobile" />
            <Table.Column title="区域" dataIndex="area_name" key="area_name"
              render={(val, record) => (<span>{record.area_code ? val : '全国'}</span>)}
            />
            {/* <Table.Column title="性别" min-width="80px" dataIndex="gender" key="gender"
              render={(val, _) => (<span>{genderData[val]}</span>)}
            /> */}
            <Table.Column title="角色" min-width="100px" dataIndex="role" key="role"
              render={(val, _) => (<span>{adminRoleData[val]}</span>)}
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
                          ...record,
                          name: record.admin_name
                        }
                      })
                    })} 
                    />
                  </Tooltip>
                  <Tooltip title="删除">
                    <i className="iconfont icon-shanchu" onClick={throttle(1000, () => this.onDelete(record.admin_id))} />
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
        
        <AdminDetail
          onCancel={() => {
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
  
  // 分页获取admin
  getAll = async () => {
    const res = await adminList({
      get_count: this.state.pageSize,
      start_index: (this.state.currentPage - 1) * this.state.pageSize,
      keyword: this.state.keyword
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
      title: '确认删除选中的管理员?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await adminDelete(id, {})
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
    await adminAdd(others) : await adminChange(others.admin_id, others);
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
