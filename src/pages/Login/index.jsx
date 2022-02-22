import React from 'react';
import { Form, Input, Button } from 'antd';
import { login, verifyLocal } from '../../api';
import { throttle } from 'throttle-debounce';
import MD5 from 'crypto-js/md5';
import './index.less';

// redux
import * as actions from '../../store/action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class LoginPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      mobile: '',
      password: '',
      verify_code: '',
      code: ''
    }
  }

  render () {
    return (
      <section className="login-page">
        <section className="login-box">
          <header className="title">蚁情监测系统</header>
          <Form onFinish={async (values) => {
            const res = await login({
              mobile: this.state.mobile,
              password: MD5(this.state.password).toString(),
              verify_code: this.state.verify_code
            });
            if (res) {
              sessionStorage.setItem('isLogin', true);
              sessionStorage.setItem('areaCode', res.record?.area_code);
              this.props.setAreaCode(res.record?.area_code)
              if (res.record?.area_lng) {
                sessionStorage.setItem('areaPoint', JSON.stringify({
                  lng: +res.record?.area_lng, lat: +res.record?.area_lat
                }));
                this.props.setAreaPoint({
                  lng: +res.record?.area_lng, lat: +res.record?.area_lat
                })
              }
              sessionStorage.setItem('adminName', res.record?.admin_name);
              this.props.setTokenInvalid(false)
              this.props.history.push('/home')
              this.props.onSubmit(true);
            }
          }}
          >
            <Form.Item name="mobile"
              rules={[
                { required: true, message: '请输入手机号' },
                {
                  validator(rule, value) {
                    const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
                    if (value && !reg.test(value)) {
                      return Promise.reject('请输入正确的手机号');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="请输入手机号"
                allowClear
                style={{height: 40}}
                prefix={<i className="iconfont icon-shouji" />}
                value={this.state.mobile}
                onChange={(e) => {
                  this.setState({
                    mobile: e.target.value,
                    code: '',
                    verify_code: ''
                  })
                }}
                onBlur={() => {
                  const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
                  if (reg.test(this.state.mobile)) {
                    this.getCode()
                  }
                }}
              />
            </Form.Item>
            <Form.Item name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码"
                style={{height: 40}}
                prefix={<i className="iconfont icon-mima1" />}
                value={this.state.password}
                onChange={(e) => {
                  this.setState({
                    password: e.target.value
                  })
                }}
              />
            </Form.Item>
            <Form.Item name="verify_code"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <section style={{display: 'flex', alignItems: 'center'}}>
                <Input placeholder="请输入验证码"
                  style={{width: 200}}
                  prefix={<i className="iconfont icon-yanzhengma" />}
                  value={this.state.verify_code}
                  onChange={(e) => {
                    this.setState({
                      verify_code: e.target.value
                    })
                  }}
                />
                <span className="code-box">{this.state.code}</span>
                <Button type="link" disabled={!this.state.code}>
                  <i
                    className="iconfont icon-zhongzhi"
                    onClick={throttle(1000, () => {
                      this.setState({
                        verify_code: '',
                        code: ''
                      });
                      this.getCode()
                    })}
                  />
                </Button>
              </section>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit"
                style={{width: 328, height: 40, fontSize: 16}}
              >登 录</Button>
            </Form.Item>
          </Form>
        </section>
      </section>
    )
  }

  getCode = async () => {
    if (!this.state.mobile) return;
    const res = await verifyLocal(1, this.state.mobile, {});
    if (res) {
      this.setState({
        code: res.verify_code
      })
    }
  }
}

const mapStateToProps = (state) => {
  return {
    tokenInvalid: state.tokenInvalid,
  };
};

const mapDispathToProps = (dispath) => {
  return {
    ...bindActionCreators(actions, dispath),
  };
};

export default connect(mapStateToProps, mapDispathToProps)(LoginPage);