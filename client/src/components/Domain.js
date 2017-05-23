import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import logoNYU from '../images/nyu_logo_purple.png';

import { } from 'material-ui/styles/colors';

import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FontIcon from 'material-ui/FontIcon';
import Model from 'material-ui/svg-icons/image/blur-linear';
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
import { FormControl} from 'react-bootstrap';
import Search from 'material-ui/svg-icons/action/search';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import Body from './Body';
import Header from './Header';
import TextField from 'material-ui/TextField';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';

import $ from 'jquery';



class Domain extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idDomain:'',
      deleteKeywordSignal:false,
      reloadBody:true,
      noModelAvailable:true,
      reloadHeader : false,
    };

  };

componentWillMount(){
    this.setState({idDomain: this.props.location.query.idDomain});
};

componentWillReceiveProps  = (newProps, nextState) => {
  if(newProps.location.query.idDomain ===this.state.idDomain){
    return;
  }
  this.setState({idDomain: this.props.location.query.idDomain});

};

shouldComponentUpdate(nextProps, nextState) {
  if(nextProps.location.query.idDomain ===this.state.idDomain){
        return false;
   }
    return true;
};

filterKeyword(newFilterKeyword){
    this.setState({filterKeyword:newFilterKeyword, deleteKeywordSignal:false, reloadBody:true, reloadHeader : false, });
    this.forceUpdate();
}
availableCrawlerButton(noModelAvailable){ //false means that there is a available model
    this.setState({noModelAvailable:noModelAvailable,reloadBody:false, reloadHeader : false, });
    this.forceUpdate();
}

deletedFilter(filter_Keyword){
  this.setState({ deleteKeywordSignal:true, reloadBody:false, reloadHeader : false,  });
  this.forceUpdate();
}

updateHeader(){
  this.setState({ reloadHeader : true, noModelAvailable:this.state.noModelAvailable, reloadBody:false, });
  this.forceUpdate();
}

render() {
    console.log("HEADER " + this.state.filterKeyword);
  return (
    <div>
	     <Header reloadHeader = {this.state.reloadHeader} updateHeader = {this.updateHeader.bind(this)} deleteKeywordSignal = {this.state.deleteKeywordSignal} currentDomain={this.props.location.query.nameDomain} idDomain={this.props.location.query.idDomain} filterKeyword={this.filterKeyword.bind(this)} noModelAvailable={this.state.noModelAvailable}/>
       <Body nameDomain={this.props.location.query.nameDomain} currentDomain={this.state.idDomain} filterKeyword={this.state.filterKeyword} deletedFilter={this.deletedFilter.bind(this)} availableCrawlerButton={this.availableCrawlerButton.bind(this)} reloadBody={this.state.reloadBody}/>
    </div>
  );
}
}

export default Domain;
