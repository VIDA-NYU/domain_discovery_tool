// Filename:		Header.js
// Purpose:		Shows just information about the current domain. From here, the user can change of domain too.
//Dependencies: Body.js
// Author: Sonia Castelo (scastelo2@gmail.com)

import React, { Component } from 'react';
import Header from './Header';
import $ from 'jquery';
import {scaleOrdinal} from 'd3-scale';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RadVizComponent from 'radviz-component';
import FiltersTabs from './FiltersTabs'
class RadViz extends Component {

  constructor(props) {
    super(props);
    this.state = {
      flat:0,
      data:undefined,
      colors:undefined,
      originalData:undefined,
      dimNames:[],
      filterTerm:"",
      open:false,
      session:"",
      sessionString:{},
    };
    this.colorTags= [ "#9E9E9E", "#0D47A1", "#C62828"];
  };

  loadDataFromElasticSearch(session,  filterTerm){
    //var session = this.props.session;

    if(!(Object.keys(session).length === 0)){
    //console.log(session);
    session['pagesCap']='1000';
    $.post(
        '/getRadvizPoints',
        {'session': JSON.stringify(session), filterByTerm: filterTerm},
        function(es) {
          var data = JSON.parse(es);
          let numericalData = [];
          let dimNames = Object.keys(data);
          let scaleColor = scaleOrdinal(this.colorTags);
          let colors = [];
          data['Model Result'] = [];

          for (let i = 0; i < data['labels'].length; ++i){
              data['Model Result'][i] = "neutral";
              data['labels'][i]= data['labels'][i].split(',');
              //colors.push(scaleColor(data['tags'][0]));
              let aux = {};
              for (let j = 0; j < dimNames.length-2; ++j){//except urls and labels
                  aux[dimNames[j]] = parseFloat(data[dimNames[j]][i]);
              }
              numericalData.push(aux);
          }
          dimNames.push('Model Result');
          $.post(
            '/computeTSP',
            { },
            function(es) {
              let numericalDataTSP = [];
              var orderObj = JSON.parse(es);
              for (let i = 0; i < numericalData.length; ++i){
                  let aux = {};
                  for(var j in orderObj.cities){
                      aux[dimNames[orderObj.cities[j]]] = numericalData[i][dimNames[orderObj.cities[j]]];
                  }
                  numericalDataTSP.push(aux);
              }
              this.setState({originalData: data, data:numericalDataTSP, colors:colors, flat:1, dimNames: dimNames, filterTerm: filterTerm});
              //this.props.setDimNames(dimNames);
            }.bind(this)
          );
        }.bind(this)
    ).fail(function() {
              this.setState({open: true});
              }.bind(this));
            }
  }

  componentWillMount(){
    //console.log(this.props.session);
    this.loadDataFromElasticSearch(this.props.session, this.state.filterTerm);
    //this.setState({ session:this.props.session, sessionString:JSON.stringify(this.props.session)});
  };

  componentWillReceiveProps  = (newProps, nextState) => {
    if(newProps.reloadRadViz){
      var reload = false;
      for (var i = 0; i < newProps.urlsToRadviz.length; i++) {
        for (let j = 0; j < this.state.originalData['urls'].length; ++j){
            if(this.state.originalData['urls'][j] === newProps.urlsToRadviz[i]) {
              reload = true;
              break;
            }
        }
      }
      if(reload){
        this.setState({ session:newProps.session, sessionString:JSON.stringify(newProps.session)});
        this.loadDataFromElasticSearch(newProps.session, this.state.filterTerm);
      }
    }

    if(JSON.stringify(newProps.session) ===this.state.sessionString){
      if(newProps.queryFromSearch){
        this.setState({ session:newProps.session, sessionString:JSON.stringify(newProps.session)});
        this.loadDataFromElasticSearch(newProps.session, this.state.filterTerm);
      }
      else{
        return;
      }
    }
    this.setState({ session:newProps.session, sessionString:JSON.stringify(newProps.session)});
    this.loadDataFromElasticSearch(newProps.session, this.state.filterTerm);
  };

  //Filter by terms (ex. ebola AND virus)
  filterKeyword(filterTerm){
    this.loadDataFromElasticSearch(this.props.session, filterTerm);
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };
updateTagColor(){
  this.props.updateTagColor();
}
reloadFilters(){
    this.props.reloadFilters();
  };
updateOnlineAccuracy(accuracy){
  this.props.updateOnlineAccuracy(accuracy);
};
  render() {
    if(!(Object.keys(this.state.session).length === 0)){
      const actions = [
          <FlatButton
            label="Ok"
            primary={true}
            onTouchTap={this.handleClose}
          />,
        ];
        //console.log(this.state.session);
      return (
        <div>
          <RadVizComponent session={this.state.session} searchText={this.state.searchText} originalData={this.state.originalData} data={this.state.data} colors={this.state.colors} flat={this.state.flat} dimNames={this.state.dimNames} filterTerm={this.state.filterTerm}  filterKeyword={this.filterKeyword.bind(this)} reloadFilters={this.reloadFilters.bind(this)} updateOnlineAccuracy={this.updateOnlineAccuracy.bind(this)} />
        </div>
      );
    }
    else {
      return(
        <div>
        </div>
      );
    }
  }
}

  export default RadViz;
