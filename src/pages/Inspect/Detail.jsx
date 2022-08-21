import React, { useState, useEffect, useRef } from 'react';
import { Form, Select, Button, Modal, Divider, message, Input } from 'antd';
import { warnType, inspectResult, measureType } from '../../assets/js/constant';
import { DateAndTime } from '../Card/DateAndTime';
import { projectUserList, pointListSimple, warningListByPoint, projectListSimple } from '../../api';
import { throttle, debounce } from 'throttle-debounce';

const imgType = ['image/jpg', 'image/jpeg', 'image/png'];

const { Option } = Select;

const defaultDetail = {
  inspect_id: '',
  project_id: '',
  point_id: '',
  warn_id: '',
  user_id: '',
  done_timestamp: 0,
  state: '',
  measure_type: '',
  image_file: '',
  image_path: ''
}

export const InspectDetail = (props) => {
  const [detail, setDetail] = useState(defaultDetail);
  const [imgUrl, setImgUrl] = useState('');
  const [form] = Form.useForm();

  const fileInput = useRef();

  // projectList
  const [projects, setProjects] = useState([]);
  const [projectCurrentPage, setProjectCurrentPage] = useState(1);
  const [projectTotal, setProjectTotal] = useState(0);
  const [projectKeywords, setProjectKeywords] = useState('');

  // pointListSimple
  const [points, setPoints] = useState([]);
  const [pointCurrentPage, setPointCurrentPage] = useState(1);
  const [pointTotal, setPointTotal] = useState(0);
  const [pointKeyword, setPointKeyword] = useState('');

  // warningListByPoint
  const [warnings, setWarnings] = useState([]);
  const [warningCurrentPage, setWarningCurrentPage] = useState(1);
  const [warningTotal, setWarningTotal] = useState(0);

  // projectUserList
  const [users, setUsers] = useState([]);
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);

  const initialValues = {
    ...detail,
    state: detail.state + '',
    project_id: detail.project_id + '',
    point_id: detail.point_id + '',
    warn_id: detail.warn_id + '',
    user_id: detail.user_id + '',
    measure_type: detail.measure_type + ''
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

  // 获取报警
  const getWarns = async (page, point_id) => {
    if (!point_id) return
    const warningRes = await warningListByPoint({
      get_count: 10,
      start_index: (page - 1) * 10,
      point_id: +point_id
    })
    if (warningRes) {
      setWarnings(warningRes.records);
      setWarningTotal(warningRes.total_count);
      setWarningCurrentPage(page)
    }
  }

  useEffect(() => {
    async function fetchData () {
      if (props.visible) {
        setDetail(props.detail || defaultDetail);
        setProjectKeywords('');

        // projectList
        getProjects('', 1)

        // pointList
        getPoints('', 1, props.detail?.project_id)

        // warningListByPoint
        getWarns(1, props.detail?.point_id)
        
        // projectUserList
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
    setImgUrl(props.detail?.image_path ? window.globalData.host + props.detail?.image_path : '');
    fetchData()
  }, [props.visible]);

  return (
    <Modal
      title={props.detail ? '编辑信息' : '添加检查数据'}
      footer={null}
      visible={props.visible}
      onCancel={() => {
        setDetail(defaultDetail)
        props.onCancel();
      }}
    >
      <Form className="detail-form inspect-form" onFinish={(values) => {
        props.onSubmit(detail);
      }}
      form={form}
      initialValues={initialValues}
      >
        {props.detail ?
          <Form.Item label="工程" name="project_name">
            <Input value={props.detail.project_name} disabled />
          </Form.Item>:
          <Form.Item label="工程" name="project_id"
            rules={[{ required: true, message: '请选择工程' }]}
          >
            <Select
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
              value={detail.project_id + ''}
              disabled={props.detail}
              onChange={async (val) => {
                setDetail({
                  ...detail,
                  project_id: +val,
                  point_id: '',
                  warn_id: '',
                  user_id: ''
                })
                setWarnings([]);
                setWarningCurrentPage(1);
                setWarningTotal(0)

                // 重新获取points
                getPoints('', 1, +val)

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
          </Form.Item>:
          <Form.Item label="布点" name="point_id"
            rules={[{ required: true, message: '请选择布点' }]}
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
              onChange={async (val) => {
                setDetail({
                  ...detail,
                  point_id: +val,
                  warn_id: ''
                })
                // 重新获取warns
                getWarns(1, +val)
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
        <Form.Item label="报警" name="warn_id">
          <Select value={detail.warn_id + ''} disabled={props.detail}
            onChange={(val) => {
              setDetail({
                ...detail,
                warn_id: +val
              })
            }}
            dropdownRender={(menu) => (
              <section>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <section style={{textAlign: 'right'}}>
                  <Button type="link" disabled={warningCurrentPage === 1}
                    onClick={throttle(1000, async () => {
                      const page = warningCurrentPage - 1;
                      getWarns(page, detail.point_id)
                    })}
                  >上一页</Button>
                  <Button type="link" disabled={warningCurrentPage * 10 >= warningTotal}
                    onClick={throttle(1000, async () => {
                      const page = warningCurrentPage + 1;
                      getWarns(page, detail.point_id)
                    })}
                  >下一页</Button>
                </section>
              </section>
            )}
          >
            {
              warnings.map((item) => {
                return <Option key={item.warn_id} value={item.warn_id + ''}>{`${item.warn_id}(${warnType[item.warn_type]})`}</Option>
              })
            }
          </Select>
        </Form.Item>
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
          <Form.Item label="检测完成时间" name="done_timestamp">
            <DateAndTime value={detail.done_timestamp} onChange={(val) => {
              setDetail({
                ...detail,
                done_timestamp: val
              })
            }}
            />
          </Form.Item>
          <Form.Item label="检查结果状态" name="state">
            <Select value={detail.state + ''} onChange={(val) => {
              setDetail({
                ...detail,
                state: +val
              })
            }}
            >
              {
                Object.keys(inspectResult).map((key) => {
                  return <Option value={key + ''} key={key}>{inspectResult[key]}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="措施类型" name="measure_type">
            <Select value={detail.measure_type + ''} onChange={(val) => {
              setDetail({
                ...detail,
                measure_type: +val
              })
            }}
            >
              {
                Object.keys(measureType).map((key) => {
                  return <Option value={key + ''} key={key}>{measureType[key]}</Option>
                })
              }
            </Select>
          </Form.Item>
          </>
        }
        <Form.Item label="图片" name="image_file">
          <div className="upload-image">
            {
              imgUrl ? <img
                alt=""
                src={imgUrl}
                style={{width: '100%', height: '100%'}}
                       /> : <span onClick={throttle(1000, () => fileInput.current.click())}>上传图片</span>
            }
            {imgUrl && <section className="img-masker">
              <i className="iconfont icon-xiugai" onClick={throttle(1000, () => fileInput.current.click())} />
              <i className="iconfont icon-shanchu" onClick={throttle(1000, () => {
                setImgUrl('');
                setDetail({
                  ...detail,
                  image_file: '',
                  image_path: ''
                })
              })}
              />
            </section>}
          </div>
        </Form.Item>
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

      {/* 上传图片的input */}
      <input
        type="file"
        ref={r => fileInput.current = r}
        style={{display: 'none'}}
        id="upload-file"
        accept={imgType.toString()}
        onClick={throttle(1000, (e) => {
          e.target.value = ''
        })}
        onChange={e => {
          const file = e.target.files[0];

          if (!imgType.includes(file.type)) {
            message.warning(`请上传${imgType.join('、')}格式的图片`);
            return;
          }

          setDetail({
            ...detail,
            image_file: file
          })
          
          const fr = new FileReader();
          fr.readAsDataURL(file);
          fr.onload = async (r) => {
            setImgUrl(r.target.result)
          }
        }}
      />
    </Modal>
  )
}