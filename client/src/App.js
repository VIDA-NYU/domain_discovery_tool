import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Domain from './components/Domain';
import Body from './components/Body';
import Home from './components/Home';
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;
var IndexRoute = ReactRouter.IndexRoute;

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class App extends Component {

  render() {
    return (
      <MuiThemeProvider>
        <Router history={hashHistory}>
        <Route path='/' component={Home} />
            <Route path="/domain/:domainId" component={Domain}>
            </Route>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
