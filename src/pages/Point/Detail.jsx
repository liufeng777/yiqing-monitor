import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Modal, Divider } from 'antd';
import { pointState } from '../../assets/js/constant';
import { projectListSimple } from '../../api';
import { throttle, debounce } from 'throttle-debounce';

const { Option } = Select;

const defaultDetail = {
  point_id: '',
  project_id: '',
  name: '',
  device_code: '',
  tag: '',
  state: 2,
}

export const PointDetail = (props) => {
  const [detail, setDetail] = useState(defaultDetail);
  const [projects, setProjects] = useState([]);
  const [projectKeywords, setProjectKeywords] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [form] = Form.useForm();
  const initialValues = {
    ...detail,
    project_id: (props.project_id || detail.project_id) + '',
    state: detail.state + ''
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
      setTotal(projectRes.total_count);
      setCurrentPage(1)
    }
  }

  useEffect(() => {
    async function fetchData () {
      if (props.visible) {
        setDetail(props.detail || {
          ...defaultDetail,
          project_id: props.project_id
        });
        setProjectKeywords('');
        getProjects('', 1)
      }
    }
    fetchData()
  }, [props.visible]);

  return (
    <Modal
      title={props.detail ? '编辑信息' : '添加布点'}
      footer={null}
      visible={props.visible}
      onCancel={() => {
        setDetail(defaultDetail)
        props.onCancel();
      }}
    >
      <Form className="detail-form point-form" onFinish={(values) => {
        props.onSubmit(detail);
      }}
      form={form}
      initialValues={initialValues}
      >
        <Form.Item label="布点名" name="name"
          rules={[{ required: true, message: '请输入布点名' }]}
        >
          <Input maxLength={32} value={detail.name} onChange={(e) => {
            setDetail({
              ...detail,
              name: e.target.value
            })
          }}
          />
        </Form.Item>
        {(props.detail || props.project_id) ?
        <Form.Item label="所属工程" name="project_name">
          <Input value={props.detail?.project_name} disabled />
        </Form.Item> :
        <Form.Item label="所属工程" name="project_id"
          rules={[{ required: true, message: '请选择所属工程' }]}
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
            value={(props.project_id || detail.project_id)}
            disabled={props.detail || props.project_id}
            onChange={(val) => {
              setDetail({
                ...detail,
                project_id: +val
              })
            }}
            dropdownRender={(menu) => (
              <section>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <section style={{textAlign: 'right'}}>
                  <Button type="link" disabled={currentPage === 1}
                    onClick={throttle(1000, async () => {
                      const page = currentPage - 1;
                      getProjects(projectKeywords, page)
                      
                    })}
                  >上一页</Button>
                  <Button type="link" disabled={currentPage * 10 >= total}
                    onClick={throttle(1000, async () => {
                      const page = currentPage + 1;
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
        <Form.Item label="设备编码" name="device_code">
          <Input maxLength={16} value={detail.device_code} onChange={(e) => {
            setDetail({
              ...detail,
              device_code: e.target.value
            })
          }}
          />
        </Form.Item>
        <Form.Item label="状态" name="state">
          <Select value={detail.state + ''} onChange={(val) => {
            setDetail({
              ...detail,
              state: +val
            })
          }}
          >
            {
              Object.keys(pointState).map((key) => {
                return <Option value={key + ''} key={key}>{pointState[key]}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="标签" name="tag">
          <Input maxLength={32} value={detail.tag} onChange={(e) => {
            setDetail({
              ...detail,
              tag: e.target.value
            })
          }}
          />
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
    </Modal>
  )
}