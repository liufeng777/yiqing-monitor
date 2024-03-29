import React from 'react';
import { Table, Pagination, Input, Tooltip, Modal, Button, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { projectState } from '../../assets/js/constant';
import { ProjectDetail } from './Detail';
import { SelectArea } from '../../component/SelectArea';
import { throttle } from 'throttle-debounce';
import { getDateTime } from '../Card/DateAndTime';
import './index.less';
import CacheTags from '../../component/CacheTags';

// redux
import * as actions from '../../store/action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// api
import { projectList, projectDelete, projectAdd, projectChange, projectExport, projectImport } from '../../api';

class ProjectPage extends React.Component {
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
      // 搜索条件
      proj_keyword: '',
      user_keyword: '',
      area_code: this.props.areaCode,
      area_point: this.props.areaPoint
    }
  };

  fileInput

  componentDidMount () {
    this.getAll();
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.cacheTags.find(v => v.path === '/project')) {
      this.setState(() => ({
        area_code: nextProps.areaCode
      }), this.getAll)
    }
  }

  render () {
    const adminRole = +sessionStorage.getItem('adminRole');

    return (
      <section className={"project-page page-view"}>
        <CacheTags />
        <header className="header">
          <span/>
          {adminRole > 1 && <span>
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
          </span>}
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
              <span className="label">工程负责人：</span>
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
                style={{ width: 140 }}
              />
            </li>
            <li>
              <span className="label">区域：</span>
              <SelectArea selectAll width={320} area_code={this.state.area_code} visible onChange={({code, point}) => {
                this.setState({ area_code: code, area_point: point})
              }}
              />
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
                <Button shape="circle" type="primary" onClick={throttle(1000,() => {
                  this.setState(() => ({
                    proj_keyword: '',
                    user_keyword: '',
                    area_code: 0,
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
            dataSource={this.state.tableData}
            rowKey={(r, index ) => index}
            pagination={false}
            // scroll={{x: 1800}}
            bordered
            style={{minWidth: 1800}}
          >
            <Table.Column title="工程名" dataIndex="name" key="name" />
            <Table.Column title="区域" dataIndex="area_name" key="area_name"
              render={(val, record) => (<span>{record.area_code ? val : '全国'}</span>)}
            />
            <Table.Column title="工程编码" dataIndex="project_code" key="project_code" />
            <Table.Column title="状态" min-width="80px" dataIndex="state" key="state"
              render={(val, _) => (<span>{projectState[val]}</span>)}
            />
            <Table.Column title="图片" width={80} dataIndex="image_path" key="image_path" render={(val, _) => 
              val ? 
              (<img alt="" src={window.globalData.host + val} style={{width: 60, height: 60}} />) : <></>
              }
            />
            {/* <Table.Column title="描述" dataIndex="comment" key="comment" /> */}
            <Table.Column title="工程地址" dataIndex="address" key="address" />
            <Table.Column title="建筑面积" dataIndex="building_area" key="building_area" />
            <Table.Column title="幢数" dataIndex="building_number" key="building_number" />
            <Table.ColumnGroup title="建设单位信息">
              <Table.Column title="名称" dataIndex="constructor" key="constructor" />
              <Table.Column title="联系人" dataIndex="constructor_user" key="constructor_user" />
              <Table.Column title="电话" dataIndex="constructor_phone" key="constructor_phone" />
            </Table.ColumnGroup>
            <Table.ColumnGroup title="施工单位信息">
              <Table.Column title="名称" dataIndex="builder" key="builder" />
              <Table.Column title="联系人" dataIndex="builder_user" key="builder_user" />
              <Table.Column title="电话" dataIndex="builder_phone" key="builder_phone" />
            </Table.ColumnGroup>
            <Table.Column title="开工日期" dataIndex="build_timestamp" key="build_timestamp"
              render={(val, _) => (<span>{getDateTime(val).join(' ')}</span>)}/>
            {adminRole > 1 && <Table.Column title="操作" width="150px" dataIndex="operation" key="operation"
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
                  <Tooltip title="查看布点分布">
                    <i className="iconfont icon-iconfontzhizuobiaozhun023117" onClick={throttle(1000, () => this.props.history.push({
                      pathname: `/point/map/${record.project_id}`,
                      state: { from : 'project' }
                    }))} />
                  </Tooltip>
                  <Tooltip title="绑定工程人员">
                    <i className="iconfont icon-renyuan" onClick={throttle(1000, () => this.props.history.push(`/project/user/${record.project_id}`))} />
                  </Tooltip>
                  <Tooltip title="删除">
                    <i className="iconfont icon-shanchu" onClick={throttle(1000, () => this.onDelete(record.project_id))} />
                  </Tooltip>
                </>
              )}
            />}
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
              const res = await projectImport({
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
    const res = await projectList({
      get_count: this.state.pageSize,
      start_index: (this.state.currentPage - 1) * this.state.pageSize,
      proj_keyword: this.state.proj_keyword,
      user_keyword: this.state.user_keyword,
      area_code: this.state.area_code,
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
      title: '确认删除选中的工程?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await projectDelete(id, {})
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
    await projectAdd(values) : await projectChange(values.project_id, values);
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
    const res = await projectExport({
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
    a.download = '工程.csv';
    a.click();
    URL.revokeObjectURL(a.href)
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

export default connect(mapStateToProps, mapDispathToProps)(ProjectPage);
