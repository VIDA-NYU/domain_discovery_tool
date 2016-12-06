import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Body from './components/Body';
import Home from './components/Home';
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;
var IndexRoute = ReactRouter.IndexRoute;

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {CrawlerVis} from './crawlervis.js';
injectTapEventPlugin();

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      currentDomain:'',
      activeMenu: false,
    };
    // load domains
  }

  render() {
    return (
      <MuiThemeProvider>
      <div>
        <Router history={hashHistory}>
        <Route path='/' component={Home} />
        <Route path="/domain/:domainId" params={{valueDomain:"un"}} component={Header}>
          <IndexRoute component={Body} />
        </Route>
        </Router>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
