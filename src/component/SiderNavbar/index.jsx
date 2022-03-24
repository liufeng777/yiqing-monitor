import React from 'react';
import { NavLink } from 'react-router-dom';
import { Modal, Button, Tooltip } from 'antd';
import { withRouter } from 'react-router';

// redux
import * as actions from '../../store/action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './index.less';

const navbarArr = [{
  path: '/home',
  name: '首页',
  icon: 'icon-yemian-copy-copy',
  access: 1
}, {
  path: '/project',
  name: '工程',
  icon: 'icon-gongcheng',
  access: 1
}, {
  path: '/point',
  name: '布点',
  icon: 'icon-f-location',
  access: 2
}, {
  path: '/device',
  name: '设备',
  icon: 'icon-shebei',
  access: 2
}, {
  path: '/card',
  name: '通讯卡',
  icon: 'icon-tongxunka-32',
  access: 2
}, {
  path: '/detect',
  name: '探测',
  icon: 'icon-tance',
  access: 2
}, {
  path: '/inspect',
  name: '检查',
  icon: 'icon-jianchajieguo',
  access: 2
}, {
  path: '/warning',
  name: '报警',
  icon: 'icon-jinggao',
  access: 1
}, {
  path: '/admin',
  name: '管理员',
  icon: 'icon-guanliyuan1',
  access: 2
}, {
  path: '/user',
  name: '用户',
  icon: 'icon-yonghu',
  access: 2
}]

class SiderNavbar extends React.Component{
  constructor (props) {
    super(props);
    this.state={
      open: true
    }
  }

  componentDidMount () {
    // if (!this.props.cacheTags.length) {
    //   this.props.history.push('/home')
    // }
  }

  render () {
    const adminRole = sessionStorage.getItem('adminRole');
    return (
      <section className="navbar-box" style={{width: `${this.state.open ? '152px' : '50px'}`}}>
        {/* <header className="navbar-header">
          <i className="iconfont icon-ANT-black" />
          { this.state.open && 
            <span>蚁情监测</span>
          }
        </header> */}
        <section className="navbar-body">
          {navbarArr.map((item, index) =>
            {return +adminRole >= item.access ?
            <NavLink
                key={item.path}
                to={item.path}
                className="navlink"
                onClick={() => {
                  const isExist = this.props.cacheTags.find(v => v.path === item.path);
                  if (!isExist && item.path !== '/home') {
                    this.props.setCacheTags([
                      ...this.props.cacheTags,
                      {
                        path: item.path,
                        name: item.name
                      }
                    ]);
                  }
                  this.props.switchTag(item.path)
                }}
              >
                {
                  this.state.open ? <>
                    <i className={`iconfont ${item.icon}`} />
                    {item.name}
                  </> :
                  <Tooltip title={item.name} placement="right">
                    <i className={`iconfont ${item.icon}`} />
                  </Tooltip>
                }
            </NavLink>
            : <></>
            })
          }
        </section>
        <i 
          className={`iconfont operation-icon ${this.state.open ? 'icon-shouqicaidan' : 'icon-zhankaicaidan'}`}
          onClick={() => {
            this.setState((preState) => ({
              open: !preState.open
            }))
          }}
        />

        <Modal width={400} visible={this.props.tokenInvalid}
          closable={false}
          footer={[
            <Button type="primary" key="ok" onClick={() => {
              this.props.onSubmit(false);
              this.props.setTokenInvalid(false)
              this.props.history.push('/login')
              sessionStorage.clear()
            }}
            >确定</Button>
          ]}
        >
            <p>
              <i className={"iconfont icon-jinggao"} style={{
                color: '#faad14',
                marginRight: 8
              }}
              />
              <span style={{fontSize: 16}}>授权Token检验失败，请重新登录</span>
            </p>
          </Modal>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tokenInvalid: state.tokenInvalid,
    cacheTags: state.cacheTags
  };
};

const mapDispathToProps = (dispath) => {
  return {
    ...bindActionCreators(actions, dispath),
  };
};

export default connect(mapStateToProps, mapDispathToProps)(withRouter(SiderNavbar));

// export const SiderNavbar = () => {
//   // const history = useHistory();
//   return (
//     <section className="navbar-box">
//       <header className="navbar-header">蚁情监测</header>
//       <section className="navbar-body">
//         {
//           navbarArr.map((item) =>
//             <NavLink key={item.path} to={item.path} className="navlink">
//               <i className={`iconfont ${item.icon}`} />
//               {item.name}
//             </NavLink>)
//         }
//       </section>
//     </section>
//   );
// };
