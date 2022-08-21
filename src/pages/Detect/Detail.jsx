import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Modal, Divider, Input } from 'antd';
import { warnType } from '../../assets/js/constant';
import { DateAndTime } from '../Card/DateAndTime';
import { projectUserList, pointListSimple, projectListSimple } from '../../api';
import { throttle, debounce } from 'throttle-debounce';

const { Option } = Select;

const defaultDetail = {
  detect_id: '',
  project_id: '',
  point_id: '',
  warn_type: 1,
  done_timestamp: 0,
  user_id: ''
}

export const DetectDetail = (props) => {
  const [detail, setDetail] = useState(defaultDetail);
  
  // projectList
  const [projects, setProjects] = useState([]);
  const [projectCurrentPage, setProjectCurrentPage] = useState(1);
  const [projectTotal, setProjectTotal] = useState(0);
  const [projectKeywords, setProjectKeywords] = useState('');

  // pointList
  const [points, setPoints] = useState([]);
  const [pointCurrentPage, setPointCurrentPage] = useState(1);
  const [pointTotal, setPointTotal] = useState(0);
  const [pointKeyword, setPointKeyword] = useState('');

  // userList
  const [users, setUsers] = useState([]);
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);

  const [form] = Form.useForm();
  const initialValues = {
    ...detail,
    project_id: detail.project_id + '',
    point_id: detail.point_id + '',
    user_id: detail.user_id + '',
    warn_type: detail.warn_type + ''
  }
  form.setFieldsValue(initialValues)

  // 获取project
  const getProjects = async (keyword, page) => {
    const projectRes = await projectListSimple({
      get_count: 10,
      start_index: (page - 1) * 10,
      area_code: +sessionStorage.getItem('areaCode') || 0,
      proj_keyword: keyword
    })
    if (projectRes) {
      setProjects(projectRes.records);
      setProjectTotal(projectRes.total_count);
      setProjectCurrentPage(page)
    }
  }

  // 获取points
  const getPoints = async (keyword, page, project_id) => {
    if (!project_id) return
    const pointRes = await pointListSimple({
      get_count: 10,
      start_index: (page - 1) * 10,
      project_id: +project_id,
      keyword
    })
    if (pointRes) {
      setPoints(pointRes.records);
      setPointTotal(pointRes.total_count);
      setPointCurrentPage(page)
    }
  }

  useEffect(() => {
    async function fetchData () {
      if (props.visible) {
        setDetail(props.detail || defaultDetail);

        // projectList
        getProjects('', 1)
        
        // points
        getPoints('', 1, props.detail?.project_id)

        if (props.detail?.project_id) {
          const userRes = await projectUserList({
            get_count: 10,
            start_index: (userCurrentPage - 1) * 10,
            project_id: +props.detail.project_id
          })
          if (userRes) {
            const userArr = userRes.records;
            if (props.detail.user_id && !userArr.find(v => v.id === props.detail.user_id)) {
              userArr.push({
                id: props.detail.user_id,
                name: props.detail.user_name
              })
            }
            setUsers(userArr);
            setUserTotal(userRes.total_count);
          }
        }
      }
    }
    fetchData()
  }, [props.visible]);

  return (
    <Modal
      title={props.detail ? '编辑信息' : '添加探测数据'}
      footer={null}
      visible={props.visible}
      onCancel={() => {
        setDetail(defaultDetail)
        props.onCancel();
      }}
    >
      <Form className="detail-form detect-form" onFinish={(values) => {
        props.onSubmit(detail);
      }}
      form={form}
      initialValues={initialValues}
      >
        {props.detail ?
          <Form.Item label="工程" name="project_name">
            <Input value={props.detail.project_name} disabled />
          </Form.Item> :
          <Form.Item label="工程" name="project_id"
          rules={[{ required: true, message: '请选择工程' }]}
        >
          <Select value={detail.project_id + ''} disabled={props.detail}
            showSearch
            filterOption={false}
            onSearch={debounce(500, (val) => {
              setProjectKeywords(val)
              getProjects(val, 1)
            })}
            onFocus={() => {
              if (projectKeywords) {
                setProjectKeywords('')
                getProjects('', 1)
              }
            }}
            onChange={async (val) => {
              setDetail({
                ...detail,
                project_id: +val,
                point_id: '',
                user_id: ''
              })

              // 重新获取points
              getPoints('', 1, val)

              // 重新获取users
              const userRes = await projectUserList({
                get_count: 10,
                start_index: 0,
                project_id: +val
              })
              if (userRes) {
                setUsers(userRes.records);
                setUserTotal(userRes.total_count);
                setUserCurrentPage(1)
              }
            }}
            dropdownRender={(menu) => (
              <section>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <section style={{textAlign: 'right'}}>
                  <Button type="link" disabled={projectCurrentPage === 1}
                    onClick={throttle(1000, async () => {
                      const page = projectCurrentPage - 1;
                      getProjects(projectKeywords, page)
                    })}
                  >上一页</Button>
                  <Button type="link" disabled={projectCurrentPage * 10 >= projectTotal}
                    onClick={throttle(1000, async () => {
                      const page = projectCurrentPage + 1;
                      getProjects(projectKeywords, page)
                    })}
                  >下一页</Button>
                </section>
              </section>
            )}
          >
            {
              projects.map((item) => {
                return <Option key={item.project_id} value={item.project_id + ''}>{item.name}</Option>
              })
            }
          </Select>
        </Form.Item>
        }
        {props.detail ?
          <Form.Item label="布点" name="point_name">
            <Input value={props.detail.point_name} disabled />
          </Form.Item> :
          <Form.Item label="布点" name="point_id"
          rules={[{ required: true, message: '请输入布点' }]}
        >
          <Select value={detail.point_id + ''} disabled={props.detail}
            showSearch
            filterOption={false}
            onSearch={debounce(500, (val) => {
              setPointKeyword(val)
              getPoints(val, 1, detail.project_id)
            })}
            onFocus={() => {
              if (pointKeyword) {
                setPointKeyword('')
                getPoints('', 1, detail.project_id)
              }
            }}
            onChange={(val) => {
              setDetail({
                ...detail,
                point_id: +val
              })
            }}
            dropdownRender={(menu) => (
              <section>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <section style={{textAlign: 'right'}}>
                  <Button type="link" disabled={pointCurrentPage === 1}
                    onClick={throttle(1000, async () => {
                      const page = pointCurrentPage - 1;
                      getPoints(pointKeyword, page, detail.project_id)
                    })}
                  >上一页</Button>
                  <Button type="link" disabled={pointCurrentPage * 10 >= pointTotal}
                    onClick={throttle(1000, async () => {
                      const page = pointCurrentPage + 1;
                      getPoints(pointKeyword, page, detail.project_id)
                    })}
                  >下一页</Button>
                </section>
              </section>
            )}
          >
            {
              points.map((item) => {
                return <Option key={item.point_id} value={item.point_id + ''}>{item.name}</Option>
              })
            }
          </Select>
        </Form.Item>
        }
        <Form.Item label="执行用户" name="user_id">
          <Select value={detail.user_id + ''}
            onChange={(val) => {
              setDetail({
                ...detail,
                user_id: +val
              })
            }}
            dropdownRender={(menu) => (
              <section>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <section style={{textAlign: 'right'}}>
                  <Button type="link" disabled={userCurrentPage === 1}
                    onClick={throttle(1000, async () => {
                      const page = userCurrentPage - 1;
                      const res = await projectUserList({
                        get_count: 10,
                        start_index: (page - 1) * 10,
                        project_id: +detail.project_id
                      })
                      if (res) {
                        setUsers(res.records);
                        setUserTotal(res.total_count);
                        setUserCurrentPage(page);
                      }
                    })}
                  >上一页</Button>
                  <Button type="link" disabled={userCurrentPage * 10 >= userTotal}
                    onClick={throttle(1000, async () => {
                      const page = userCurrentPage + 1;
                      const res = await projectUserList({
                        get_count: 10,
                        start_index: (page - 1) * 10,
                        project_id: +detail.project_id
                      })
                      if (res) {
                        setUsers(res.records);
                        setUserTotal(res.total_count);
                        setUserCurrentPage(page);
                      }
                    })}
                  >下一页</Button>
                </section>
              </section>
            )}
          >
            {
              users.map((item) => {
                return <Option key={item.id} value={item.id + ''}>{item.name}</Option>
              })
            }
          </Select>
        </Form.Item>
        {
          props.detail && <>
          <Form.Item label="报警类型" name="warn_type">
            <Select value={detail.warn_type + ''} onChange={(val) => {
              setDetail({
                ...detail,
                warn_type: +val
              })
            }}
            >
              {
                Object.keys(warnType).map((key) => {
                  return <Option value={key + ''} key={key}>{warnType[key]}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="探测完成时间" name="done_timestamp">
            <DateAndTime value={detail.done_timestamp} onChange={(val) => {
              setDetail({
                ...detail,
                done_timestamp: val
              })
            }}
            />
          </Form.Item>
          </>
        }
        <Form.Item>
          <section className="form-btn">
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button htmlType="button" onClick={throttle(1000, () => {
              setDetail(defaultDetail)
              props.onCancel();
            })}
            >
              取消
            </Button>
          </section>
        </Form.Item>
      </Form>
    </Modal>
  )
}