import React, { useState } from 'react';
import { Dropdown, Menu, message, Modal, Form, Input, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import MD5 from 'crypto-js/md5';
import { logout, changePassword } from '../api/index';
import { useHistory } from 'react-router';
import { throttle } from 'throttle-debounce';
// import { withRouter } from 'react-router-dom'

export const Header = (props) => {
  const [showChangePwd, setShowChangePwd] = useState(false)
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')

  const history = useHistory();

  return <>
    <Dropdown overlay={(
      <Menu>
        <Menu.Item key="change" onClick={() => {
          setShowChangePwd(true);
          setOldPwd('');
          setNewPwd('');
          setConfirmPwd('');
        }}
        >修改密码</Menu.Item>
        <Menu.Item key="logout" onClick={() => {
          Modal.confirm({
            title: '确认退出当前登录?',
            icon: <ExclamationCircleOutlined />,
            okText: "确认",
            cancelText: "取消",
            onOk: async () => {
              const res = await logout({});
              if (res) {
                message.success('已成功退出登录');
                props.onSubmit(false);
                history.push('/login');
                sessionStorage.clear();
              }
            },
            onCancel() {
              console.log('Cancel');
            },
          })
        }}
        >退出</Menu.Item>
      </Menu>
    )}
    >
      <span style={{cursor: 'pointer'}}>
        <i className="iconfont icon-guanliyuan" style={{marginRight: 6}} />
        {sessionStorage.getItem('adminName') || ''}
      </span>
    </Dropdown>

    {/* 修改密码 */}
    <Modal
      title="修改密码"
      visible={showChangePwd}
      onCancel={throttle(1000, () => {
        setShowChangePwd(false);
      })}
      footer={null}
    >
      <Form
        className="change-pwd-form"
        onFinish={async (values) => {
          const { oldPwd, newPwd } = values
          const res = await changePassword({
            old_password: MD5(oldPwd).toString(),
            new_password: MD5(newPwd).toString()
          });
          if (res) {
            message.success('密码修改成功，请重新登录');
            props.onSubmit(false);
            history.push('/login');
            sessionStorage.clear();
          }
      }}
      >
        <Form.Item label="旧密码" name="oldPwd"
          rules={[{ required: true, message: '请输入旧密码' }]}
        >
          <Input.Password value={oldPwd} onChange={(e) => {
            setOldPwd(e.target.value)
          }}
          />
        </Form.Item>
        <Form.Item label="新密码" name="newPwd"
          rules={[{ required: true, message: '请输入新密码' }]}
        >
          <Input.Password value={newPwd} onChange={(e) => {
            setNewPwd(e.target.value)
          }}
          />
        </Form.Item>
        <Form.Item label="确认密码" name="confirmPwd" dependencies={['newPwd']}
          rules={[
            { required: true, message: '请再次输入密码' },
            ({getFieldValue}) => ({
              validator(rule, value) {
                if (value && getFieldValue('newPwd') !== value) {
                  return Promise.reject('两次输入的密码不一致');
                } else {
                  return Promise.resolve();
                }
              }
            })
          ]}
        >
          <Input.Password value={confirmPwd} onChange={(e) => {
            setConfirmPwd(e.target.value)
          }}
          />
        </Form.Item>
        <Form.Item>
          <section className="form-btn">
            <Button htmlType="button" style={{marginRight: 20}}
              onClick={throttle(1000, () => {
                setShowChangePwd(false)
              })}
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              确认
            </Button>
          </section>
        </Form.Item>
      </Form>
    </Modal>
  </>
}
