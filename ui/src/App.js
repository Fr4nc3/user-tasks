import HomePage from './components/HomePage.jsx';
import DashboardPage from './containers/DashboardPage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import SignUpPage from './containers/SignUpPage.jsx';
import Auth from './auth/Auth';
import React, {Component} from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {  Switch, Route, Link, NavLink, Redirect } from "react-router-dom";


const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => authed === true 
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/', state: { from: props.location } }} />} />
  )
}
//    
class App extends  Component {

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div>
          <div className="top-bar">
            <div className="top-bar-left">
              <NavLink to="/">User Task App</NavLink>
            </div>
            {Auth.isUserAuthenticated() ? (
              <div className="top-bar-right">
                <Link to="/logout">Log out</Link>
              </div>
            ) : (
                <div className="top-bar-right">
                  <Link to="/login">Log in</Link>
                  <Link to="/signup">Sign up</Link>
                </div>
              )}

          </div>
          <div>
            <Switch>
              <Route exact path="/" render={() => (
                Auth.isUserAuthenticated()? (
                  <Redirect to="/dashboard" />
                ) : (
                    <HomePage />
                  )
              )} />
              <Route path="/logout" render={() => (
                Auth.deauthenticateUser() ? (
                  <Redirect to="/" />
                ) : (
                    null
                  )
              )} />
              <PrivateRoute authed={Auth.isUserAuthenticated()} path='/dashboard' component={DashboardPage} />

              <Route path="/login" component={LoginPage} />
              <Route path="/signup" component={SignUpPage} />
              <Redirect to="/" />
            </Switch>
          </div>


        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;

