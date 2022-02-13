import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Modal, Divider } from 'antd';
import { pointState } from '../../assets/js/constant';
import { projectList } from '../../api';
import { throttle } from 'throttle-debounce';

const { Option } = Select;

const defaultDetail = {
  point_id: '',
  project_id: '',
  name: '',
  tag: '',
  state: 2,
}

export const PointDetail = (props) => {
  const [detail, setDetail] = useState(defaultDetail);
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [form] = Form.useForm();
  const initialValues = {
    ...detail,
    project_id: (props.project_id || detail.project_id) + '',
    state: detail.state + ''
  }
  form.setFieldsValue(initialValues)

  useEffect(() => {
    async function fetchData () {
      if (props.visible) {
        setDetail(props.detail || {
          ...defaultDetail,
          project_id: props.project_id
        });
        const res = await projectList({
          get_count: 10,
          start_index: (currentPage - 1) * 10,
          area_code: +sessionStorage.getItem('areaCode') || 0,
        })
        if (res) {
          setProjects(res.records);
          setTotal(res.total_count);
        }
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
        <Form.Item label="所属工程" name="project_id"
          rules={[{ required: true, message: '请选择所属工程' }]}
        >
          <Select value={(props.project_id || detail.project_id)} disabled={props.detail || props.project_id}
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
                      const res = await projectList({
                        get_count: 10,
                        start_index: (page - 1) * 10,
                        area_code: +sessionStorage.getItem('areaCode') || 0,
                      })
                      if (res) {
                        setProjects(res.records);
                        setTotal(res.total_count);
                        setCurrentPage(page);
                      }
                    })}
                  >上一页</Button>
                  <Button type="link" disabled={currentPage * 10 >= total}
                    onClick={throttle(1000, async () => {
                      const page = currentPage + 1;
                      const res = await projectList({
                        get_count: 10,
                        start_index: (page - 1) * 10,
                        area_code: +sessionStorage.getItem('areaCode') || 0,
                      })
                      if (res) {
                        setProjects(res.records);
                        setTotal(res.total_count);
                        setCurrentPage(page);
                      }
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
              if (props.detail) {
                setDetail(props.detail)
              } else {
                setDetail(defaultDetail)
              }
            })}
            >
              重置
            </Button>
          </section>
        </Form.Item>
      </Form>
    </Modal>
  )
}