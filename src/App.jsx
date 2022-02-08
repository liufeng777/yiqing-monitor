import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { storeInstance } from './store/index';

// component
import SiderNavbar from './component/SiderNavbar';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import ProjectPage from './pages/Project';
import ProjectUserPage from './pages/ProjectUser';
import PointPage from './pages/Point';
import DevicePage from './pages/Device';
import CardPage from './pages/Card';
import AdminPage from './pages/Admin';
import UserPage from './pages/User';
import DetectPage from './pages/Detect';
import InspectPage from './pages/Inspect';
import WarningPage from './pages/Warning';

import './App.less';

export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isLogin: false,
      showChangePwd: false,
      oldPwd: '',
      newPwd: '',
      confirmPwd: ''
    }
  }

  componentDidMount() {
    this.setState({
      isLogin: sessionStorage.getItem('isLogin') ? true : false
    })
  }

  render () {
    return (
      <Provider store={storeInstance}>
        <section className="app-page">
          <Router>
            {
              this.state.isLogin ?
              <>
                <aside className="navbar-content">
                  <SiderNavbar onSubmit={(isLogin) => {
                    this.setState({isLogin})
                  }}
                  />
                </aside>
                <section className="app-content">
                  <section className="app-body">
                    <section className="app-page">
                      <Switch>
                        <Route path="/home" render={props => <HomePage {...props} changeLoginInfo={(isLogin) => {
                          this.setState({isLogin})
                        }}/>}
                       />
                        <Route path="/project" exact component={ProjectPage} />
                        <Route path="/project/user/:proId" exact component={ProjectUserPage} />
                        <Route path="/point" component={PointPage} />
                        <Route path="/device" component={DevicePage} />
                        <Route path="/card" component={CardPage} />
                        <Route path="/detect" component={DetectPage} />
                        <Route path="/inspect" component={InspectPage} />
                        <Route path="/warning" component={WarningPage} />
                        <Route path="/admin" component={AdminPage} />
                        <Route path="/user" component={UserPage} />
                        <Redirect to="/home" />
                      </Switch>
                    </section>
                  </section>
                </section>
              </> :
              <Switch>
                <Route path="/login" exact render={props => <LoginPage {...props} onSubmit={(isLogin) => {
                  this.setState({isLogin})
                }}
                                                            />} 
                />
                <Redirect path="/" exact to="/login" />
              </Switch>
            }
          </Router>
        </section>
      </Provider>
    )
  }
}