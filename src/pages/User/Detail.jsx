import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Modal } from 'antd';
import { genderData, userRoleData } from '../../assets/js/constant';
import { SelectArea } from '../../component/SelectArea';
import { throttle } from 'throttle-debounce';

const { Option } = Select;

const defaultDetail = {
  id: '',
  name: '',
  mobile: '',
  // gender: 0,
  area_code: '',
  project_owner_type: 1,
  password: '',
  confirmPassword: ''
}

export const UserDetail = (props) => {
  const [detail, setDetail] = useState(defaultDetail);
  const [form] = Form.useForm();
  const initialValues = {
    ...detail,
    // gender: detail.gender + '',
    project_owner_type: detail.project_owner_type + ''
  }
  form.setFieldsValue(initialValues)

  useEffect(() => {
    if (props.visible) {
      setDetail(props.detail || defaultDetail)
    }
  }, [props.visible]);

  return (
    <Modal
      width={550}
      title={props.detail ? '编辑信息' : '添加用户'}
      footer={null}
      visible={props.visible}
      onCancel={() => {
        setDetail(defaultDetail)
        props.onCancel();
      }}
    >
      <Form className="detail-form user-form" onFinish={(values) => {
        props.onSubmit(detail);
      }}
      form={form}
      initialValues={initialValues}
      >
        <Form.Item label="用户名" name="name"
          rules={[{ required: true, message: '请输入用户名' }]}
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
        {
          !props.detail && <>
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
                  if (getFieldValue('password') !== value) {
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
          <SelectArea visible={props.visible} area_code={detail.area_code} onChange={({code}) => {
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
        <Form.Item label="工程负责人类型" name="project_owner_type">
          <Select value={detail.project_owner_type + ''} onChange={(val) => {
            setDetail({
              ...detail,
              project_owner_type: +val
            })
          }}
          >
            {
              Object.keys(userRoleData).map((key) => {
                return <Option value={key + ''} key={key}>{userRoleData[key]}</Option>
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