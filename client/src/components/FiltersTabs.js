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

class CircularProgressSimple extends React.Component{
  render(){

    return(
    <div style={{borderColor:"green", marginLeft:"50%"}}>
      <CircularProgress size={60} thickness={7} />
    </div>
  );}
}


class LoadQueries extends React.Component {
  constructor(props){
    super(props);
    this.state={
      currentQueries:undefined,
      queriesCheckBox:[],
      queryString:undefined,
      session: {},
      flat:false,
    };
  }

  componentWillMount(){
    console.log("load Query");
    console.log(this.props.session);
    $.post(
      '/getAvailableQueries',
      {'session': JSON.stringify(this.props.session)},
      function(queriesDomain) {
        //console.log('currentQueries');
        //console.log(queriesDomain);
        this.setState({currentQueries: queriesDomain, session:this.props.session, queryString: JSON.stringify(this.props.session['selected_queries'])});
      }.bind(this)
    );
  }
  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.session['selected_queries']) === this.state.queryString ) {
      this.setState({ flat:true});
      return;
    }
    console.log("FiltersTabs componentWillReceiveProps after");
    // Calculate new state
    this.setState({
      session:nextProps.session, queryString: JSON.stringify(nextProps.session['selected_queries']), flat:true
    });

  }
  shouldComponentUpdate(nextProps){
    console.log("shouldComponentUpdate before");
    if(JSON.stringify(nextProps.session['selected_queries']) === this.state.queryString && this.state.flat===true) {
      return false;
    }
    console.log("shouldComponentUpdate after");
    return true;
  }

  addQuery(query){
    this.props.addQuery(query);
  }

  render(){
    if(this.state.currentQueries!==undefined){
      console.log("render ");
      return(
        <div>
        {Object.keys(this.state.currentQueries).map((query, index)=>{
          console.log("k: " + query + ", index: " + index);
          var labelQuery=  query+" " +"(" +this.state.currentQueries[query]+")";
          return <Checkbox label={labelQuery} style={styles.checkbox}  onClick={this.addQuery.bind(this,query)}/>
        })}
        </div>
      );
    }
    return(
      <CircularProgressSimple />
    );
  }

}

class LoadTag extends React.Component {
  constructor(props){
    super(props);
    this.state={
      currentQueries:undefined,
      tagsCheckBox:[],
      tagString:undefined,
      session: {},
      flat:false,
    };
  }

  componentWillMount(){
    $.post(
      '/getAvailableTags',
      {'session': JSON.stringify(this.props.session), 'event': 'Tags'},
      function(tagsDomain) {
        this.setState({currentTags: tagsDomain['tags'], session:this.props.session, tagString: JSON.stringify(this.props.session['selected_tags'])});
      }.bind(this)
    );
  }

  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.session['selected_tags']) === this.state.tagString ) {
      this.setState({ flat:true});
      return;
    }
    console.log("FiltersTabs componentWillReceiveProps after");
    // Calculate new state
    this.setState({
      session:nextProps.session, tagString: JSON.stringify(nextProps.session['selected_tags']), flat:false
    });

  }

  shouldComponentUpdate(nextProps){
    if(JSON.stringify(nextProps.session['selected_tags']) === this.state.tagString && this.state.flat===true ) {
      return false;
    }
    return true;
  }

  addTags(tag){
    this.props.addTags(tag);
  }

  render(){
    if(this.state.currentTags!==undefined){
      return(
        <div style={styles.headline}>
        {Object.keys(this.state.currentTags).map((tag, index)=>{
          var labelTags=  tag+" " +"(" +this.state.currentTags[tag]+")";
          return <Checkbox label={labelTags} style={styles.checkbox}  onClick={this.addTags.bind(this,tag)} />
        })}
        </div>
      );
    }
    return(
      <CircularProgressSimple />
    );
  }
}



class FiltersTabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
      currentQueries:undefined,
      currentTags:undefined,
      currentModels:undefined,
      queriesCheckBox:[],
      tagsCheckBox:[],
      sessionString:"",
      session: {},
      flat:false,
    };
  }

  componentWillMount(){
    this.setState({session:this.props.session, sessionString: JSON.stringify(this.props.session) });

  }

  componentWillReceiveProps(nextProps) {
    console.log("FiltersTabs componentWillReceiveProps before");
    if(JSON.stringify(nextProps.session) === this.state.sessionString) {
      this.setState({  flat: true });
        return;
    }
    console.log("FiltersTabs componentWillReceiveProps after");
    // Calculate new state
    this.setState({
        session:nextProps.session, sessionString: JSON.stringify(nextProps.session), flat: true
    });

  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("FiltersTabs  shouldComponentUpdate before");
    if(JSON.stringify(nextProps.session) !== this.state.sessionString || nextState.slideIndex !== this.state.slideIndex) {
          return true;
    }
    console.log("FiltersTabs shouldComponentUpdate after");
    return false;
  }

  addQuery(labelQuery){
    var selected_queries = this.state.queriesCheckBox; //  var selected_queries = [];
    selected_queries.push(labelQuery);
    var newQuery = selected_queries.toString();
    this.setState({queriesCheckBox: selected_queries});
    var sessionTemp = this.props.session;
    if(sessionTemp['selected_tags']!=="")
      sessionTemp['newPageRetrievelCriteria'] = "Queries,Tags,";
    else{
      sessionTemp['newPageRetrievelCriteria'] = "one";
    }
    sessionTemp['pageRetrievalCriteria'] = "Queries";
    sessionTemp['selected_queries']=newQuery;
    this.props.updateSession(sessionTemp);
  }

    addTags(labelTags){
      var selected_tags = this.state.tagsCheckBox; //  var selected_queries = [];
      selected_tags.push(labelTags);
      var newTags = selected_tags.toString();
      this.setState({tagsCheckBox: selected_tags});
      var sessionTemp = this.props.session;
      if(sessionTemp['selected_queries']!=="")
        sessionTemp['newPageRetrievelCriteria'] = "Queries,Tags,";
      else{
        sessionTemp['newPageRetrievelCriteria'] = "one";
      }
      sessionTemp['pageRetrievalCriteria'] = "Tags";
      sessionTemp['selected_tags']=newTags;
      this.props.updateSession(sessionTemp);
    }
/*
  createCheckbox(k, index){
    var labelQuery=  k+" " +"(" +index+")";
    return <Checkbox
    label={labelQuery}
    style={styles.checkbox}
    onClick={this.addQuery.bind(this,k )} />;

    return <Checkbox
              label={label}
              handleCheckboxChange={this.toggleCheckbox}
              key={label} />;
  }

  createImages(currentQueries) {
     return Object.keys(currentQueries).map(this.createImage);
   },
*/

  render() {
    console.log("--------FiltersTabs---------");
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
            <LoadQueries session={this.state.session} addQuery={this.addQuery.bind(this)}/>
          </div>
          <div style={styles.headline}>
            <LoadTag session={this.state.session} addTags={this.addTags.bind(this)}/>
          </div>
          <div style={styles.headline}>
            <loadTag session={this.state.session} addTags={this.addTags.bind(this)}/>
          </div>
        </SwipeableViews>
      </div>
    );
  }
}

export default FiltersTabs;
