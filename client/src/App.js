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
injectTapEventPlugin();


class App extends Component {
  constructor(props){
  super(props);
  this.state = {
    currentDomain:' s',
    activeMenu: false,
  };
}

setActiveMenu (variable) {
  console.log("setActiveMenu App: " + variable);
}

setSelectedDomain(currentDomain1, active){
  console.log("setSelectedDomainSonia" + currentDomain1 + ", " +active.toString());
    this.setState({currentDomain:currentDomain1, activeMenu:active}, function() {
         this.setState({currentDomain:currentDomain1, activeMenu:active});
         this.forceUpdate();
    });
    this.forceUpdate();
}

  render() {
    return (
      <MuiThemeProvider>
      <div>
      <Router history={hashHistory}>
        <Route path='/' currentDomain={this.state.currentDomain} activeMenu={this.state.activeMenu}  setActiveMenu={this.setActiveMenu.bind(this)} component={Header}>
          <IndexRoute setSelectedDomain={this.setSelectedDomain.bind(this)} component={Home} />
          <Route path='playerOne' header='Player One'  component={Body} />
        </Route>
      </Router>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
