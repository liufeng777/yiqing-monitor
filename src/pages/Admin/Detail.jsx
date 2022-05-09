import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Modal } from 'antd';
import { genderData, adminRoleData } from '../../assets/js/constant';
import { SelectArea } from '../../component/SelectArea';
import { throttle } from 'throttle-debounce';

const { Option } = Select;

const defaultDetail = {
  admin_id: '',
  name: '',
  mobile: '',
  password: '',
  confirmPassword: '',
  // gender: 0,
  area_code: '',
  area_name: '',
  role: 1
}

export const AdminDetail = (props) => {
  const [detail, setDetail] = useState(defaultDetail);
  const [form] = Form.useForm();
  const initialValues = {
    ...detail,
    // gender: detail.gender + '',
    role: detail.role + ''
  }
  form.setFieldsValue(initialValues)

  useEffect(() => {
    setDetail(props.detail || defaultDetail)
  }, [props.detail]);

  return (
    <Modal
      title={props.detail ? '编辑信息' : '添加管理员'}
      footer={null}
      visible={props.visible}
      onCancel={() => {
        setDetail(defaultDetail)
        props.onCancel();
      }}
    >
      <Form className="detail-form admin-form" onFinish={(values) => {
        props.onSubmit(detail);
      }}
      form={form}
      initialValues={initialValues}
      >
        <Form.Item label="管理员名" name="name"
          rules={[{ required: true, message: '请输入管理员名' }]}
        >
          <Input maxLength={45} value={detail.name} onChange={(e) => {
            setDetail({
              ...detail,
              name: e.target.value
            })
          }}
          />
        </Form.Item>
        <Form.Item label="手机号" name="mobile"
          rules={[
            { required: true, message: '请输入手机号' },
            // {
            //   validator(rule, value) {
            //     const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
            //     if (value && !reg.test(value)) {
            //       return Promise.reject('请输入正确的手机号');
            //     }
            //     return Promise.resolve();
            //   },
            // },
          ]}
        >
          <Input value={detail.mobile} onChange={(e) => {
            setDetail({
              ...detail,
              mobile: e.target.value
            })
          }}
          />
        </Form.Item>
        { !props.detail &&
          <>
            <Form.Item label="密码" name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password value={detail.password} onChange={(e) => {
                setDetail({
                  ...detail,
                  password: e.target.value
                })
              }}
              />
            </Form.Item>
            <Form.Item label="确认密码" name="confirmPassword" dependencies={['password']}
              rules={[
                { required: true, message: '请再次输入密码' },
                ({getFieldValue}) => ({
                  validator(rule, value) {
                    if (value && getFieldValue('password') !== value) {
                      return Promise.reject('两次输入的密码不一致');
                    } else {
                      return Promise.resolve();
                    }
                  }
                })
              ]}
            >
              <Input.Password value={detail.confirmPassword} onChange={(e) => {
                setDetail({
                  ...detail,
                  confirmPassword: e.target.value
                })
              }}
              />
            </Form.Item>
          </>
        }
        <Form.Item label="区域" name="area_code"
          rules={[{ required: true, message: '请选择区域' }]}
        >
          <SelectArea selectAll visible={props.visible} area_code={detail.area_code} onChange={({code}) => {
            setDetail({
              ...detail,
              area_code: code
            })
          }}
          />
        </Form.Item>
        {/* <Form.Item label="性别" name="gender">
          <Select value={detail.gender + ''} onChange={(val) => {
            setDetail({
              ...detail,
              gender: +val
            })
          }}
          >
            {
              Object.keys(genderData).map((key) => {
                return <Option value={key + ''} key={key}>{genderData[key]}</Option>
              })
            }
          </Select>
        </Form.Item> */}
        <Form.Item label="角色" name="role">
          <Select value={detail.role + ''} onChange={(val) => {
            setDetail({
              ...detail,
              role: +val
            })
          }}
          >
            {
              Object.keys(adminRoleData).map((key) => {
                return <Option value={key + ''} key={key}>{adminRoleData[key]}</Option>
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