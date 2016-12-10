import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
//import {deepPurpleA400, orange300, blue400, indigoA400, blue900} from 'material-ui/styles/colors';
import Checkbox from 'material-ui/Checkbox';
import $ from 'jquery';

import CircularProgress from 'material-ui/CircularProgress';

const styles = {
  headline: {
    fontSize: 12,
    paddingTop: 16,
    marginBottom: 12,
    height: '120px',
  },
  slide: {
    height: '100px',
  },
  tab:{
    fontSize: '12px',
  },
};

/*class loadQueries extends React.Component {
  <div style={styles.headline}>
    {Object.keys(this.props.currentQueries).map((k, index)=>{
      return <Checkbox label={this.props.currentQueries[k]} style={styles.checkbox}  />
    })}
  </div>
}*/

class CircularProgressSimple extends React.Component{
  render(){

    return(
    <div style={{borderColor:"green", marginLeft:"50%"}}>
      <CircularProgress size={60} thickness={7} />
    </div>
  );}
}


class FiltersTabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
      session:undefined,


      currentQueries:undefined,
      currentTags:undefined,
      currentModels:undefined,
      queriesCheckBox:[],
      tagsCheckBox:[],
    };
  }

componentWillMount(){
  console.log("create FiltersTabs");
  console.log(this.props.session);
    $.post(
      '/getAvailableQueries',
      {'session': JSON.stringify(this.props.session)},
      function(queriesDomain) {
        console.log('currentQueries');
        console.log(queriesDomain);
        this.setState({currentQueries: queriesDomain});
      }.bind(this)
    );
    $.post(
      '/getAvailableTags',
      {'session': JSON.stringify(this.props.session), 'event': 'Tags'},
      function(tagsDomain) {
        console.log('tagsDomain');
        console.log(tagsDomain);
        this.setState({currentTags: tagsDomain['tags']});
      }.bind(this)
    );
    //getAvailableModelTags
    //{'session': JSON.stringify(session)},
    $.post(
      '/getAvailableTags',
      {'session': JSON.stringify(this.props.session), 'event': 'Tags'},
      function(modelsDomain) {
        console.log('modelsDomain');
        console.log(modelsDomain);
        this.setState({currentModels: modelsDomain});
      }.bind(this)
    );


}
componentWillReceiveProps(nextProps) {
    if (nextProps === this.props) {
        return;
    }
}

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  }


  addQuery(labelQuery){
    var selected_queries = this.state.queriesCheckBox; //  var selected_queries = [];
    selected_queries.push(labelQuery);
    var newQuery = selected_queries.toString();
    this.setState({queriesCheckBox: selected_queries});
    console.log(this.props.session);
    var sessionTemp = this.props.session;
    console.log("before: " +sessionTemp['domainId']);
    sessionTemp['newPageRetrievelCriteria'] = "one";
    sessionTemp['pageRetrievalCriteria'] = "Queries";
    sessionTemp['selected_queries']=newQuery;
    console.log("after" +sessionTemp['domainId']);
    console.log(sessionTemp);
    this.props.updateSession(sessionTemp);
  }
  addTags(labelTags){
    var selected_tags = this.state.tagsCheckBox; //  var selected_queries = [];
    selected_tags.push(labelTags);
    var newTags = selected_tags.toString();
    this.setState({tagsCheckBox: selected_tags});
    console.log(this.props.session);
    var sessionTemp = this.props.session;
    console.log("before: " +sessionTemp['domainId']);
    sessionTemp['newPageRetrievelCriteria'] = "Queries,Tags,";
    sessionTemp['pageRetrievalCriteria'] = "Queries";
    sessionTemp['selected_tags']=newTags;
    console.log("after" +sessionTemp['domainId']);
    console.log(sessionTemp);
    this.props.updateSession(sessionTemp);
  }

  render() {
    if(this.state.currentQueries!==undefined && this.state.currentTags!==undefined && this.state.currentModels!==undefined){


    console.log(this.props.queries);
    console.log(this.state.currentQueries);
    return (
      <div>
        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
          inkBarStyle={{background:'#7940A0' ,height: '4px'}}
          tabItemContainerStyle={{background: '#9A7BB0' ,height: '40px'}}
        >
          <Tab label="Queries" value={0} style={styles.tab} />
          <Tab label="Tags" value={1} style={styles.tab} />
          <Tab label="Model" value={2} style={styles.tab} />
        </Tabs>
        <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange}  >
          <div style={styles.headline}>
            {Object.keys(this.state.currentQueries).map((k, index)=>{
              var labelQuery=  k+" " +"(" +this.state.currentQueries[k]+")";
              return <Checkbox label={labelQuery} style={styles.checkbox}  onClick={this.addQuery.bind(this,k )}/>
            })}
          </div>
          <div style={styles.headline}>
            {Object.keys(this.state.currentTags).map((k, index)=>{
              var labelTags=  k+" " +"(" +this.state.currentTags[k]+")";
              return <Checkbox label={labelTags} style={styles.checkbox}  onClick={this.addTags.bind(this,k )} />
            })}
          </div>
          <div style={styles.headline}>
            {Object.keys(this.state.currentModels).map((k, index)=>{
              var labelTags=  k+" " +"(" +this.state.currentModels[k]+")";
              return <Checkbox label={labelTags} style={styles.checkbox}  />
            })}
          </div>
        </SwipeableViews>
      </div>
    );
  }
  return(
    <CircularProgressSimple />
  );
}
}

export default FiltersTabs;
