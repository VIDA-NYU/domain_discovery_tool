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

class Radviz extends Component {

  constructor(props) {
      super(props);
      console.log(props);
      this.state = {
	  flat:0,
	  data:undefined,
	  colors:undefined,
	  originalData:undefined,
	  dimNames:[],
	  filterTerm:"",
	  open:false,
	  index:'',
	  idDomain:'',
	  session:'',
	  typeRadViz:4,
	  nroCluster:7,
	  updatingRadViz:false
      };
      this.colorTags= [ "#9E9E9E", "#0D47A1", "#C62828"];
  };

  /*consultaQueries: {"search_engine":"GOOG","activeProjectionAlg":"Group by Correlation"
  ,"domainId":"AVWjx7ciIf40cqEj1ACn","pagesCap":"100","fromDate":null,"toDate":null,
  "filter":null,"pageRetrievalCriteria":"Most Recent","selected_morelike":"",
  "model":{"positive":"Relevant","nagative":"Irrelevant"}}*/
   createSession(domainId){
    var session = {};
    session['search_engine'] = "GOOG";
       session['activeProjectionAlg'] = "Group by Correlation";
       session['domainId'] = domainId;
    session['pagesCap'] = "100";
    session['fromDate'] = null;
    session['toDate'] = null;
    session['filter'] = null; //null
    session['pageRetrievalCriteria'] = "Most Recent";
    session['selected_morelike'] = "";
    session['selected_queries']="";
    session['selected_tlds']="";
    session['selected_aterms']="";
    session['selected_tags']="";
    session['selected_model_tags']="";
    session['selected_crawled_tags']="";
    session['model'] = {};
    session['model']['positive'] = "Relevant";
    session['model']['negative'] = "Irrelevant";

    return session;
  }

    loadDataFromElasticSearch(index, filterTerm, typeRadViz, nroCluster, removeKeywords){
	var session = this.createSession(this.state.idDomain);

    $.post(
        '/getRadvizPoints',
        {'session': JSON.stringify(session), 'filterByTerm': filterTerm, 'typeRadViz': typeRadViz, 'nroCluster': nroCluster, 'removeKeywords':removeKeywords},
        function(es) {
          var data = JSON.parse(es);
          let numericalData = [];
          let dimNames = Object.keys(data);
          let scaleColor = scaleOrdinal(this.colorTags);
          let colors = [];
          let cluster_labels = [];
            data['Model Result'] = [];
	    console.log(data);
	    console.log(data['pred_labels']);

          for (let i = 0; i < data['labels'].length; ++i){
              data['Model Result'][i] = "neutral";
              data['labels'][i]= data['labels'][i].split(',');
              if(!(cluster_labels.includes(data['pred_labels'][i]))) cluster_labels.push(data['pred_labels'][i]);
              //colors.push(scaleColor(data['tags'][0]));
              let aux = {};
              for (let j = 0; j < dimNames.length-3; ++j){//except urls and labels and pred_labels
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
              this.setState({originalData: data, data:numericalDataTSP, colors:colors, flat:1, dimNames: dimNames, filterTerm: filterTerm, updatingRadViz:false});
              //this.props.setDimNames(dimNames);
            }.bind(this)
          );
        }.bind(this)
    ).fail(function() {
              this.setState({open: true});
              }.bind(this));
  }

    componentWillMount(){
      this.setState({idDomain: this.props.currentDomain, index: this.props.index, session: this.createSession(this.props.currentDomain)});
      this.loadDataFromElasticSearch(this.state.index, this.state.filterTerm, this.state.typeRadViz, this.state.nroCluster, "");
  };

      componentWillReceiveProps  = (newProps, nextState) => {
    if(newProps.idDomain ===this.state.idDomain){
      return;
    }
      this.setState({idDomain: this.props.currentDomain});

  };

  //Filter by terms (ex. ebola AND virus)
  filterKeyword(filterTerm){
      this.loadDataFromElasticSearch(this.state.index, filterTerm, this.state.typeRadViz, this.state.nroCluster, "");
  }
  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  changeTypeRadViz(typeRadViz){
      this.loadDataFromElasticSearch(this.state.index, this.state.filterTerm, typeRadViz, this.state.nroCluster, "");
    this.setState({typeRadViz: typeRadViz});
  }

  changeNroCluster(nroCluster){
      this.loadDataFromElasticSearch(this.state.index, this.state.filterTerm, this.state.typeRadViz, nroCluster, "");
    this.setState({nroCluster: nroCluster});

  }

  removeKeywordsRadViz(removeKeywords){
    this.setState({updatingRadViz:true});
      this.loadDataFromElasticSearch(this.state.index, this.state.filterTerm, this.state.typeRadViz, this.state.nroCluster, removeKeywords);
    this.forceUpdate();
  }

    render() {
	const actions = [
		<FlatButton
	    label="Ok"
	    primary={true}
	    onTouchTap={this.handleClose}
		/>,
	];
	return (
		<div>
  		<RadVizComponent session={this.state.session} currentDomain={this.state.idDomain} searchText={this.state.searchText} originalData={this.state.originalData} data={this.state.data} colors={this.state.colors} flat={this.state.flat}
            dimNames={this.state.dimNames} filterTerm={this.state.filterTerm}  filterKeyword={this.filterKeyword.bind(this)}
            changeTypeRadViz= {this.changeTypeRadViz.bind(this)} changeNroCluster= {this.changeNroCluster.bind(this)} removeKeywordsRadViz= {this.removeKeywordsRadViz.bind(this)}
            updatingRadViz={this.state.updatingRadViz}/>
		
	    </div>
	);
    }
}

export default Radviz;
