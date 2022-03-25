import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Modal, Divider } from 'antd';
import { warningType, confirmRes } from '../../assets/js/constant';
import { DateAndTime } from '../Card/DateAndTime';
import { userList, pointList } from '../../api';
import { throttle } from 'echarts';

const { Option } = Select;

const defaultDetail = {
  warn_id: '001',
  point_id: '',
  warn_type: 3,
  detect_timestamp: 0,
  confirm_timestamp: 0,
  confirm_user_id: '',
  confirm_res: ''
}

export const WarningDetail = (props) => {
  const [detail, setDetail] = useState(defaultDetail);
  const [form] = Form.useForm();
  // pointList
  const [points, setPoints] = useState([]);
  const [pointCurrentPage, setPointCurrentPage] = useState(1);
  const [pointTotal, setPointTotal] = useState(0);

  // userList
  const [users, setUsers] = useState([]);
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);

  const initialValues = {
    ...detail,
    warn_type: detail.warn_type + '',
    point_id: detail.point_id + '',
    confirm_user_id: detail.confirm_user_id + '',
    confirm_res: detail.confirm_res + ''
  }
  form.setFieldsValue(initialValues)

  useEffect(() => {
    async function fetchData () {
      if (props.visible) {
        setDetail(props.detail || defaultDetail);
        const pointRes = await pointList({
          get_count: 10,
          start_index: (pointCurrentPage - 1) * 10,
          area_code: +sessionStorage.getItem('areaCode') || 0
        })
        if (pointRes) {
          setPoints(pointRes.records);
          setPointTotal(pointRes.total_count);
        }

        const userRes = await userList({
          get_count: 10,
          start_index: (userCurrentPage - 1) * 10,
        })
        if (userRes) {
          setUsers(userRes.records);
          setUserTotal(userRes.total_count);
        }
      }
    }
    fetchData()
  }, [props.visible]);

  return (
    <Modal
      title={props.detail ? '编辑信息' : '添加报警数据'}
      footer={null}
      visible={props.visible}
      onCancel={() => {
        setDetail(defaultDetail)
        props.onCancel();
      }}
    >
      <Form className="detail-form warning-form" onFinish={(values) => {
        props.onSubmit(detail);
      }}
      form={form}
      initialValues={initialValues}
      >
        <Form.Item label="布点" name="point_id"
          rules={[{ required: true, message: '请输入布点' }]}
        >
          <Select value={detail.point_id + ''} disabled={props.detail}
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
                      const res = await pointList({
                        get_count: 10,
                        start_index: (page - 1) * 10,
                        area_code: +sessionStorage.getItem('areaCode') || 0
                      })
                      if (res) {
                        setPoints(res.records);
                        setPointTotal(res.total_count);
                        setPointCurrentPage(page);
                      }
                    })}
                  >上一页</Button>
                  <Button type="link" disabled={pointCurrentPage * 10 >= pointTotal}
                    onClick={throttle(1000, async () => {
                      const page = pointCurrentPage + 1;
                      const res = await pointList({
                        get_count: 10,
                        start_index: (page - 1) * 10,
                        area_code: +sessionStorage.getItem('areaCode') || 0
                      })
                      if (res) {
                        setPoints(res.records);
                        setPointTotal(res.total_count);
                        setPointCurrentPage(page);
                      }
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
        <Form.Item label="报警类型" name="warn_type" rules={[{ required: true }]}>
          <Select value={detail.warn_type + ''} onChange={(val) => {
            setDetail({
              ...detail,
              warn_type: +val
            })
          }}
          >
            {
              Object.keys(warningType).map((key) => {
                return <Option value={key + ''} key={key}>{warningType[key]}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="探测时间" name="detect_timestamp">
          <DateAndTime value={detail.detect_timestamp} onChange={(val) => {
            setDetail({
              ...detail,
              detect_timestamp: val
            })
          }}
          />
        </Form.Item>
        <Form.Item label="确认时间" name="confirm_timestamp">
          <DateAndTime value={detail.confirm_timestamp} onChange={(val) => {
            setDetail({
              ...detail,
              confirm_timestamp: val
            })
          }}
          />
        </Form.Item>
        <Form.Item label="确认用户" name="confirm_user_id">
          <Select value={detail.confirm_user_id + ''}
            onChange={(val) => {
              setDetail({
                ...detail,
                confirm_user_id: +val
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
                      const res = await userList({
                        get_count: 10,
                        start_index: (page - 1) * 10,
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
                      const res = await userList({
                        get_count: 10,
                        start_index: (page - 1) * 10,
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
        <Form.Item label="报警确认结果" name="confirm_res">
          <Select value={detail.confirm_res + ''} onChange={(val) => {
            setDetail({
              ...detail,
              confirm_res: +val
            })
          }}
          >
            {
              Object.keys(confirmRes).map((key) => {
                return <Option value={key + ''} key={key}>{confirmRes[key]}</Option>
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