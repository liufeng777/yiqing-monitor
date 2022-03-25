import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Modal, Divider } from 'antd';
import { projectUserRole } from '../../assets/js/constant';
import { userList } from '../../api';
import { throttle } from 'throttle-debounce';

const { Option } = Select;

const defaultDetail = {
  user_id: '',
  role: 1
}

export const ProjectDetail = (props) => {
  const [detail, setDetail] = useState(defaultDetail);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [form] = Form.useForm();
  const initialValues = {
    ...detail,
    user_id: detail.user_id + '',
    role: detail.role + ''
  }
  form.setFieldsValue(initialValues)

  useEffect( () => {
    async function fetchData () {
      if (props.visible) {
        setDetail(props.detail || defaultDetail);
        const res = await userList({
          get_count: 10,
          start_index: (currentPage - 1) * 10
        })
        if (res) {
          setUsers(res.records);
          setTotal(res.total_count);
        }
      }
    }
    fetchData()
  }, [props.visible]);

  return (
    <Modal
      width={400}
      title={props.detail ? '编辑信息' : '绑定工程人员'}
      footer={null}
      visible={props.visible}
      onCancel={() => {
        setDetail(defaultDetail);
        setUsers([]);
        setCurrentPage(1);
        setTotal(0);
        props.onCancel();
      }}
    >
      <Form className="detail-form project-user-form" onFinish={(values) => {
        props.onSubmit(detail);
      }}
      form={form}
      initialValues={initialValues}
      >
        <Form.Item label="工程人员" name="user_id" rules={[{ required: true, message: '请选择工程人员' }]}>
          <Select value={detail.user_id + ''} disabled={props.detail}
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
                  <Button type="link" disabled={currentPage === 1}
                    onClick={throttle(1000, async () => {
                      const page = currentPage - 1;
                      const res = await userList({
                        get_count: 10,
                        start_index: (page - 1) * 10
                      })
                      if (res) {
                        setUsers(res.records);
                        setTotal(res.total_count);
                        setCurrentPage(page);
                      }
                    })}
                  >上一页</Button>
                  <Button type="link" disabled={currentPage * 10 >= total}
                    onClick={throttle(1000, async () => {
                      const page = currentPage + 1;
                      const res = await userList({
                        get_count: 10,
                        start_index: (page - 1) * 10
                      })
                      if (res) {
                        setUsers(res.records);
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
              users.map((item) => {
                return <Option key={item.id} value={item.id + ''}>{item.name}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="角色" name="role" rules={[{ required: true, message: '请选择角色' }]}>
          <Select value={detail.role + ''} onChange={(val) => {
            setDetail({
              ...detail,
              role: +val
            })
          }}
          >
            {
              Object.keys(projectUserRole).map((key) => {
                return <Option value={key + ''} key={key}>{projectUserRole[key]}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item>
          <section className="form-btn">
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button htmlType="button" onClick={throttle(1000, () => {
              setDetail(defaultDetail);
              setUsers([]);
              setCurrentPage(1);
              setTotal(0);
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
