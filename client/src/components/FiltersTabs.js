import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
//import {deepPurpleA400, orange300, blue400, indigoA400, blue900} from 'material-ui/styles/colors';
import Checkbox from 'material-ui/Checkbox';


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
    };
  }

componentWillMount(){
  console.log("create FiltersTabs");
    this.setState({
      currentQueries:this.props.queries,
      currentTags:this.props.tags,
      currentModels:this.props.models,
    });
}
componentWillReceiveProps(nextProps) {
    if (nextProps === this.props) {
        return;
    }
    // Calculate new state
    this.setState({
      currentQueries:this.props.queries,
      currentTags:this.props.tags,
      currentModels:this.props.models,
    });
}

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  }

  /*
  if(vis.getCheckedValues('queries_checkbox').toString()!= "" && vis.getCheckedValues('tags_checkbox').toString() != ""){
        session['selected_queries'] = vis.getCheckedValues('queries_checkbox').toString();
        session['selected_tags']= vis.getCheckedValues('tags_checkbox').toString();
        session['newPageRetrievelCriteria'] = "Queries,Tags,";
      }
      else{
        session['newPageRetrievelCriteria'] = "one";
        if (vis.getCheckedValues('queries_checkbox').toString()!= ""){ // if (pageRetrievalCriteria == 'Queries'){
          session['pageRetrievalCriteria'] = "Queries";
          session['selected_queries'] = vis.getCheckedValues('queries_checkbox').toString();
        }
        if (vis.getCheckedValues('tags_checkbox').toString()!= ""){//if (pageRetrievalCriteria == 'Tags' || pageRetrievalCriteria == 'More like'){
          //if (pageRetrievalCriteria == 'More like') session['pageRetrievalCriteria'] = "More like";
          //else
          session['pageRetrievalCriteria'] = "Tags";
          session['selected_tags'] = vis.getCheckedValues('tags_checkbox').toString();
      */

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
}

export default FiltersTabs;
