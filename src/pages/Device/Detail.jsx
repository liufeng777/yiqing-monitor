import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Modal, Divider } from 'antd';
import { deviceType, deviceState } from '../../assets/js/constant';
import { cardList } from '../../api';
import { throttle } from 'throttle-debounce';

const { Option } = Select;

const defaultDetail = {
  device_id: '',
  code: '',
  type: 2,
  card_id: '',
  tag: '',
  state: 1,
}

export const DeviceDetail = (props) => {
  const [detail, setDetail] = useState(defaultDetail);
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [form] = Form.useForm();
  const initialValues = {
    ...detail,
    state: detail.state + '',
    type: detail.type + '',
    card_id: detail.card_id + ''
  }
  form.setFieldsValue(initialValues)

  useEffect(() => {
    async function fetchData () {
      if (props.visible) {
        setDetail(props.detail || defaultDetail);
        const res = await cardList({
          get_count: 10,
          start_index: (currentPage - 1) * 10,
        })
        if (res) {
          setCards(res.records);
          setTotal(res.total_count);
        }
      }
    }
    fetchData()
  }, [props.visible]);

  return (
    <Modal
      title={props.detail ? '编辑信息' : '添加设备'}
      footer={null}
      visible={props.visible}
      onCancel={() => {
        setDetail(defaultDetail)
        props.onCancel();
      }}
    >
      <Form className="detail-form device-form" onFinish={(values) => {
        props.onSubmit(detail);
      }}
      form={form}
      initialValues={initialValues}
      >
        <Form.Item label="设备编码" name="code"
          rules={[{ required: true, message: '请输入设备编码' }]}
        >
          <Input maxLength={16} value={detail.code} onChange={(e) => {
            setDetail({
              ...detail,
              code: e.target.value
            })
          }}
          />
        </Form.Item>
        <Form.Item label="类型" name="type"
          rules={[{ required: true, message: '请选择类型' }]}
        >
          <Select value={detail.type + ''} onChange={(val) => {
            setDetail({
              ...detail,
              type: +val
            })
          }}
          >
            {
              Object.keys(deviceType).map((key) => {
                return <Option value={key + ''} key={key}>{deviceType[key]}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="状态" name="state"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select value={detail.state + ''} onChange={(val) => {
            setDetail({
              ...detail,
              state: +val
            })
          }}
          >
            {
              Object.keys(deviceState).map((key) => {
                return <Option value={key + ''} key={key}>{deviceState[key]}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="通讯卡" name="card_id"
          rules={[{ required: true, message: '请选择通讯卡' }]}
        >

          <Select value={detail.card_id + ''}
            onChange={(val) => {
              setDetail({
                ...detail,
                card_id: +val
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
                      const res = await cardList({
                        get_count: 10,
                        start_index: (page - 1) * 10,
                      })
                      if (res) {
                        setCards(res.records);
                        setTotal(res.total_count);
                        setCurrentPage(page);
                      }
                    })}
                  >上一页</Button>
                  <Button type="link" disabled={currentPage * 10 >= total}
                    onClick={throttle(1000, async () => {
                      const page = currentPage + 1;
                      const res = await cardList({
                        get_count: 10,
                        start_index: (page - 1) * 10,
                      })
                      if (res) {
                        setCards(res.records);
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
              cards.map((item) => {
                return <Option key={item.card_id} value={item.card_id + ''}>{item.card_code}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="标签" name="tag">
          <Input value={detail.tag} onChange={(e) => {
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