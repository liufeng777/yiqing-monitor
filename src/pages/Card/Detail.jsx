import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, InputNumber, Modal } from 'antd';
import { cardType, cardState } from '../../assets/js/constant';
import { DateAndTime } from './DateAndTime';
import { throttle } from 'throttle-debounce';

const { Option } = Select;

const defaultDetail = {
  card_id: '',
  code: '',
  type: 1,
  tag: '',
  state: 1,
  service_deadline: 0,
  last_pay_timestamp: 0,
  last_pay_expense: 0,
  last_pay_period: 0
}

export const CardDetail = (props) => {
  const [detail, setDetail] = useState(defaultDetail);
  const [form] = Form.useForm();
  const initialValues = {
    ...detail,
    state: detail.state + '',
    type: detail.type + ''
  }
  form.setFieldsValue(initialValues)

  useEffect(() => {
    setDetail(props.detail || defaultDetail)
  }, [props.detail]);

  return (
    <Modal
      title={props.detail ? '编辑信息' : '添加通讯卡'}
      footer={null}
      visible={props.visible}
      onCancel={() => {
        setDetail(defaultDetail)
        props.onCancel();
      }}
    >
      <Form className="detail-form card-form" onFinish={(values) => {
        props.onSubmit(detail);
      }}
      form={form}
      initialValues={initialValues}
      >
        <Form.Item label="通讯卡编码" name="code"
          rules={[{ required: true, message: '请输入通讯卡编码' }]}
        >
          <Input maxLength={32} value={detail.code} onChange={(e) => {
            setDetail({
              ...detail,
              code: e.target.value
            })
          }}
          />
        </Form.Item>
        <Form.Item label="类型" name="type"
          rules={[{ required: true, message: '请选择通讯卡类型' }]}
        >
          <Select value={detail.type + ''} onChange={(val) => {
            setDetail({
              ...detail,
              type: +val
            })
          }}
          >
            {
              Object.keys(cardType).map((key) => {
                return <Option value={key + ''} key={key}>{cardType[key]}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="状态" name="state"
          rules={[{ required: true, message: '请选择通讯卡状态' }]}
        >
          <Select value={detail.state + ''} onChange={(val) => {
            setDetail({
              ...detail,
              state: +val
            })
          }}
          >
            {
              Object.keys(cardState).map((key) => {
                return <Option value={key + ''} key={key}>{cardState[key]}</Option>
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
        <Form.Item label="流量包年或包月截止时间" name="service_deadline">
          <DateAndTime value={detail.service_deadline} onChange={(val) => {
            setDetail({
              ...detail,
              service_deadline: val
            })
          }}
          />
        </Form.Item>
        <Form.Item label="上一次续费时间" name="last_pay_timestamp">
          <DateAndTime value={detail.last_pay_timestamp} onChange={(val) => {
            setDetail({
              ...detail,
              last_pay_timestamp: val
            })
          }}
          />
        </Form.Item>
        <Form.Item label="上一次续费价格(分)" name="last_pay_expense">
          <InputNumber min={0} style={{width: 134}} value={detail.last_pay_expense} onChange={(val) => {
            setDetail({
              ...detail,
              last_pay_expense: val
            })
          }}
          />
        </Form.Item>
        <Form.Item label="上一次续费时长(天)" name="last_pay_period">
          <InputNumber min={0} style={{width: 134}} value={detail.last_pay_period} onChange={(val) => {
            setDetail({
              ...detail,
              last_pay_period: val
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