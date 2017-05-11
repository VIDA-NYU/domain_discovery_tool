import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
//import {deepPurpleA400, orange300, blue400, indigoA400, blue900} from 'material-ui/styles/colors';
import Checkbox from 'material-ui/Checkbox';
import CheckboxTree from 'react-checkbox-tree';
import $ from 'jquery';

import CircularProgress from 'material-ui/CircularProgress';

const styles = {
  headline: {
    fontSize: 12,
    paddingTop: 16,
    marginBottom: 12,
      height: '120px'
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
	checked:[],
	expanded:[],
	session: {},
	flat:false,
	queryNodes:[
	    {
		value: 'query',
		label: 'Queries',
		children: [],
	    }
	]
    };
  }

  getAvailableQueries(){
    $.post(
      '/getAvailableQueries',
      {'session': JSON.stringify(this.props.session)},
	function(queriesDomain) {
	    var selected_queries = []; 
	    if(this.props.session['selected_queries'] != undefined && this.props.session['selected_queries'] !== "" && this.props.session['selected_queries'].length > 1){
		selected_queries = this.props.session['selected_queries'].split(",");
	    }
            this.setState({currentQueries: queriesDomain, session:this.props.session, checked:selected_queries});
      }.bind(this)
    );
  }

  componentWillMount(){
    this.getAvailableQueries();
  }
    
  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.session["selected_queries"]) === JSON.stringify(this.state.checked)){
	if(this.props.update){
            this.getAvailableQueries();
	}
	return;
    }
    var selected_queries = []; 
    if(nextProps.session['selected_queries'] != undefined && nextProps.session['selected_queries'] !== "" && nextProps.session['selected_queries'].length > 1)
	selected_queries = this.props.session['selected_queries'].split(",");
      
    // Calculate new state
    this.setState({
	session:nextProps.session, checked:selected_queries
    });
  }

  shouldComponentUpdate(nextProps, nextState){
      if(JSON.stringify(nextState.checked) === JSON.stringify(this.state.checked) &&
	 JSON.stringify(nextState.currentQueries) === JSON.stringify(this.state.currentQueries) &&
	 JSON.stringify(nextState.expanded) === JSON.stringify(this.state.expanded)) {
      if(this.props.update){ return true;}
      else {return false;}
    }
    return true;
  }

  addQuery(object){
      var checked = object["checked"];
      this.setState({checked: checked });	
      this.props.addQuery(checked);
  }
    
  render(){
      if(this.state.currentQueries!==undefined){
	  var nodes = this.state.queryNodes;
	  var nodesTemp = [];
	  nodes.map((node,index)=>{
	     if(node.value === "query"){
		 node.children = [];
		 Object.keys(this.state.currentQueries).map((query, index)=>{
		     var labelQuery=  query+" " +"(" +this.state.currentQueries[query]+")"; //query (ex. blue car) , index (ex. 0,1,2...)
		     node.children.push({value:query, label:labelQuery});
		 });
	     }
	      nodesTemp.push(node);
	  });
	  
	  return(
	      <div >
	      <CheckboxTree
              nodes={nodesTemp}
              checked={this.state.checked}
              expanded={this.state.expanded}
              onCheck={checked => this.addQuery({checked})}
              onExpand={expanded => this.setState({ expanded })}
	      showNodeIcon={false}
	      />
	      </div>
	  );
      }
      return(
	      <CircularProgressSimple />
      );
  }
}

class LoadTLDs extends React.Component {
  constructor(props){
      super(props);
      this.state={
	  currentTLDs:undefined,
	  checked:[],
	  expanded:[],
	  session: {},
	  tldNodes:[{
	      value: 'tld',
	      label: 'TLDs',
	      children: []
	  }
          ]
      };
  }

  getAvailableTLDs(){
      $.post(
	  '/getAvailableTLDs',
	  {'session': JSON.stringify(this.props.session)},
	  function(tlds) {
	      var selected_tlds = []; 
	      if(this.props.session['selected_tlds'] != undefined && this.props.session['selected_tlds'] !== "" && this.props.session['selected_tlds'].length > 1){
		  selected_tlds = this.props.session['selected_tlds'].split(",");
	      }
	      
              this.setState({currentTLDs: tlds, session:this.props.session, checked:selected_tlds});
	  }.bind(this)
      );
  }
    
  componentWillMount(){
    this.getAvailableTLDs();
  }
  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.session['selected_tlds']) === JSON.stringify(this.state.checked)) {
	if(this.props.update){
            this.getAvailableTLDs();
	}
	return;
    }

    var selected_tlds = []; 
    if(nextProps.session['selected_tlds'] != undefined && nextProps.session['selected_tlds'] !== "" && nextProps.session['selected_tlds'].length > 1)
	selected_tlds = this.props.session['selected_tlds'].split(",");
      
    // Calculate new state
    this.setState({
      session:nextProps.session, checked:selected_tlds
    });

  }
  shouldComponentUpdate(nextProps, nextState){
    if(JSON.stringify(nextState.checked) === JSON.stringify(this.state.checked) &&
       JSON.stringify(nextState.currentTLDs) === JSON.stringify(this.state.currentTLDs) &&
       JSON.stringify(nextState.expanded) === JSON.stringify(this.state.expanded)) {
	if(this.props.update){ return true;}
      else {return false;}
    }
      return true;
  }

  addTLD(object){
      var checked = object["checked"];
      this.setState({checked: checked });
      this.props.addTLD(checked);
  }

 render(){
     if(this.state.currentTLDs!==undefined){
	 var nodes = this.state.tldNodes;
	 var nodesTemp = [];
	 nodes.map((node,index)=>{
	     if(node.value === "tld"){
		 node.children = [];
		 Object.keys(this.state.currentTLDs).map((tld, index)=>{
		     var labelTLD=  tld +" " +"(" +this.state.currentTLDs[tld]+")"; //query (ex. blue car) , index (ex. 0,1,2...)
		     node.children.push({value:tld, label:labelTLD});
		 });
	     }
	     nodesTemp.push(node);
	 });
	  	    
	 return(
	      <div>
	      <CheckboxTree
              nodes={nodesTemp}
              checked={this.state.checked}
              expanded={this.state.expanded}
              onCheck={checked => this.addTLD({checked})}
              onExpand={expanded => this.setState({ expanded })}
	      showNodeIcon={false}
	      />
	      </div>
	  );
    }
    return(
      <CircularProgressSimple />
    );
  }
}

class LoadAnnotatedTerms extends React.Component {
  constructor(props){
      super(props);
      this.state={
	  currentATerms:undefined,
	  checked:[],
	  expanded:[],
	  session: {},
	  atermNodes:[
	      {
		  value: 'aterm',
		  label: 'Annotated Terms',
		  children: [],
	      }
	  ]
      };
  }

  getAnnotatedTerms(){
    $.post(
      '/getAnnotatedTerms',
      {'session': JSON.stringify(this.props.session)},
	function(terms) {
	    var selected_aterms = []; 
	    if(this.props.session['selected_aterms'] != undefined && this.props.session['selected_aterms'] !== "" && this.props.session['selected_aterms'].length > 1){
		selected_aterms = this.props.session['selected_aterms'].split(",");
	    }

            this.setState({currentATerms: terms, session:this.props.session, checked:selected_aterms});
      }.bind(this)
    );
  }
    
  componentWillMount(){
    this.getAnnotatedTerms();
  }
  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.session['selected_aterms']) === JSON.stringify(this.state.checked) ) {
	if(this.props.update){
            this.getAnnotatedTerms();
	}
	return;
    }
    var selected_aterms = []; 
    if(nextProps.session['selected_aterms'] != undefined && nextProps.session['selected_aterms'] !== "" && nextProps.session['selected_aterms'].length > 1)
	selected_aterms = this.props.session['selected_aterms'].split(",");
  
    // Calculate new state
    this.setState({
	session:nextProps.session, checked:selected_aterms
    });

  }
  shouldComponentUpdate(nextProps, nextState){
    if(JSON.stringify(nextState.checked) === JSON.stringify(this.state.checked) &&
       JSON.stringify(nextState.currentATerms) === JSON.stringify(this.state.currentATerms) &&
       JSON.stringify(nextState.expanded) === JSON.stringify(this.state.expanded)) {
	if(this.props.update){ return true;}
	else {return false;}
    }
      return true;
  }

  addATerm(object){
    var checked = object["checked"];
    console.log("ADD ATERM");
    console.log(checked);
    this.setState({checked: checked });	
    this.props.addATerm(checked);
  }

  render(){
    if(this.state.currentATerms!==undefined){
	// Sorting the terms by Postive or Negative so that all Positive are consecutive
	// and all Negative are consecutive
	// Create items array from the currentATerms term and tag dict
	var items = Object.keys(this.state.currentATerms).map((key)=>{
	    return [key, this.state.currentATerms[key]['tag']];
	});
	
	// Sort the array based on the tag element
	items.sort(function(first, second) {
	    // Since tags can be "Positive", "Negative","Positive;Custom" or "Negative;Custom"
	    var tag1 = "Positive";
	    var tag2 = "Positive";
	    if(first[1].indexOf("Positive") < 0)
		tag1="Negative";
	    if(second[1].indexOf("Positive") < 0)
		tag2="Negative";
	    
	    //Sort by Positive first and then Negative
	    if (tag1===tag2)
		return 0;
	    if (tag1<tag2)
		return 1;
	    return -1;
	});

	var nodes = this.state.atermNodes;
	var nodesTemp = [];
	nodes.map((node,index)=>{
	    if(node.value === "aterm"){
		node.children = [];
		var positive = [];
		var negative = [];
		items.map((item, index)=>{
		    var term = item[0];
		    var tag = item[1];
		    if(tag === "Positive")
			positive.push({value:term, label:term});
		    else if(tag === "Negative")
			negative.push({value:term, label:term});
		});
		if(positive.length > 0)
		    node.children.push({value:"positive", label:"Positive", children:positive});

		if(negative.length > 0)
		    node.children.push({value:"negative", label:"Negative", children:negative});

	    }
	    nodesTemp.push(node);
	});

	return(
	      <div >
	      <CheckboxTree
              nodes={nodesTemp}
              checked={this.state.checked}
              expanded={this.state.expanded}
              onCheck={checked => this.addATerm({checked})}
              onExpand={expanded => this.setState({ expanded })}
	      showNodeIcon={false}
	      />
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
	  currentTags: undefined,
	  checked:[],
	  expanded:[],
	  session: {},
	  tagNodes:[{
	      value: 'tag',
	      label: 'Tags',
	      children: [],
	  }]
    };
  }

  getAvailableTags(){
      $.post(
	  '/getAvailableTags',
	  {'session': JSON.stringify(this.props.session), 'event': 'Tags'},
	  function(tagsDomain) {
	      var selected_tags = []; 
	      if(this.props.session['selected_tags'] != undefined && this.props.session['selected_tags'] !== "" && this.props.session['selected_tags'].length > 1){
		  selected_tags = this.props.session['selected_tags'].split(",");
	      }
	      
              this.setState({currentTags: tagsDomain['tags'], session:this.props.session, checked:selected_tags});
	  }.bind(this)
      );
  }
    
  componentWillMount(){
      this.getAvailableTags();
  }

  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.session['selected_tags']) === JSON.stringify(this.state.checked) ) {
	if(this.props.update){
            this.getAvailableTags();
	}
	return;
    }
      
    var selected_tags = []; 
    if(nextProps.session['selected_tags'] != undefined && nextProps.session['selected_tags'] !== "" && nextProps.session['selected_tags'].length > 1)
	selected_tags = this.props.session['selected_tags'].split(",");

    this.setState({
	session:nextProps.session, checked:selected_tags
    });

  }

  shouldComponentUpdate(nextProps, nextState){
    if(JSON.stringify(nextState.checked) === JSON.stringify(this.state.checked) &&
       JSON.stringify(nextState.currentTags) === JSON.stringify(this.state.currentTags) &&
       JSON.stringify(nextState.expanded) === JSON.stringify(this.state.expanded)) {
	if(this.props.update){return true;}
	else {return false;}
    }
      return true;
  }

  addTags(object){
    var checked = object["checked"];
    this.setState({checked: checked });	
    this.props.addTags(checked);
  }

  render(){
      if(this.state.currentTags!==undefined){
	 var nodes = this.state.tagNodes;
	 var nodesTemp = [];
	 nodes.map((node,index)=>{
	     if(node.value === "tag"){
		 node.children = [];
		 Object.keys(this.state.currentTags).map((tag, index)=>{
		     var labelTag=  tag +" " +"(" +this.state.currentTags[tag]+")"; //query (ex. blue car) , index (ex. 0,1,2...)
		     node.children.push({value:tag, label:labelTag});
		 });
	     }
	     nodesTemp.push(node);
	 });
	  	    
	 return(
	      <div>
	      <CheckboxTree
              nodes={nodesTemp}
              checked={this.state.checked}
              expanded={this.state.expanded}
              onCheck={checked => this.addTags({checked})}
              onExpand={expanded => this.setState({ expanded })}
	      showNodeIcon={false}
	      />
	      </div>
	  );
    }
    return(
      <CircularProgressSimple />
    );

  }
}

class LoadModel extends React.Component {
  constructor(props){
    super(props);
    this.state={
	currentModelTags:undefined,
	checked:[],
	expanded:[],
	session: {},
	modeltagNodes:[
	    {
		value: 'modeltag',
		label: 'Model Tags',
		children: []
	    }
	]
    };
  }

  componentWillMount(){
    $.post(
      '/getAvailableModelTags',
      {'session': JSON.stringify(this.props.session)},
      function(modelTagDomain) {
        this.setState({currentModelTags: modelTagDomain, session:this.props.session, modelTagString: JSON.stringify(this.props.session['selected_model_tags'])});
      }.bind(this)
    );
  }

  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.session['selected_model_tags']) === this.state.modelTagString ) {
      this.setState({ flat:true});
      return;
    }
    this.setState({
      session:nextProps.session, modelTagString: JSON.stringify(nextProps.session['selected_model_tags']), flat:false
    });

  }

  shouldComponentUpdate(nextProps){
    if(JSON.stringify(nextProps.session['selected_model_tags']) === this.state.modelTagString && this.state.flat===true ) {
      if(this.props.update){return true;}
      else {return false;}
    }
    return true;
  }

  addModelTags(object){
    var checked = object["checked"];
    this.setState({checked: checked });	
    this.props.addModelTags(checked);
  }

  render(){
    if(this.state.currentModelTags!==undefined){
	var nodes = this.state.modeltagNodes;
	var nodesTemp = [];
	nodes.map((node,index)=>{
	    if(node.value === "modeltag"){
		node.children = [];
		Object.keys(this.state.currentModelTags).map((tag, index)=>{
		    var labelTag=  tag+" " +"(" +this.state.currentModelTags[tag]+")"; //query (ex. blue car) , index (ex. 0,1,2...)
		    node.children.push({value:tag, label:labelTag});
		});
	    }
	    nodesTemp.push(node);
	});
	
	return(
	      <div >
	      <CheckboxTree
              nodes={nodesTemp}
              checked={this.state.checked}
              expanded={this.state.expanded}
              onCheck={checked => this.addModelTags({checked})}
              onExpand={expanded => this.setState({ expanded })}
	      showNodeIcon={false}
	      />
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
      sessionString:"",
	session: {},
      tldString:"",
      atermString:"",		
      tagString:"",
      modelTagString:"",
      flat:false,
    };
  }

  componentWillMount(){
    this.setState({session:this.props.session, sessionString: JSON.stringify(this.props.session)});

  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(nextProps.session) === this.state.sessionString) {
      this.setState({  flat: true });
        return;
    }
    this.setState({
        session:nextProps.session, sessionString: JSON.stringify(nextProps.session)
    });

  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.update || JSON.stringify(nextProps.session) !== this.state.sessionString || nextState.slideIndex !== this.state.slideIndex) {
          return true;
    }
    return false;
  }

  addQuery(checked){
    var sessionTemp = this.props.session;
    var newQuery = checked.toString();
    if(newQuery !== ""){
	if (sessionTemp['selected_tags']!=="" || sessionTemp['selected_tlds']!=="" || sessionTemp['selected_model_tags'] !== ""){
	    sessionTemp['newPageRetrievalCriteria'] = "Multi";
	    sessionTemp['pageRetrievalCriteria'] = {"query":newQuery};
	    if(sessionTemp['selected_tags']!=="")
		sessionTemp['pageRetrievalCriteria']['tag'] = sessionTemp['selected_tags'];
	    if(sessionTemp['selected_model_tags']!=="")
		sessionTemp['pageRetrievalCriteria']['model_tags'] = sessionTemp['selected_model_tags'];
	    if(sessionTemp['selected_tlds']!=="")
		sessionTemp['pageRetrievalCriteria']['domain'] = sessionTemp['selected_tlds'];
	}
	else{
	    sessionTemp['newPageRetrievalCriteria'] = "one";
	    sessionTemp['pageRetrievalCriteria'] = "Queries";
	}
    }
    sessionTemp['selected_queries']=newQuery;
    if(sessionTemp['selected_queries'] === "" && sessionTemp['selected_tags'] === "" && sessionTemp['selected_model_tags'] === "" && sessionTemp['selected_tlds'] === "" && sessionTemp['selected_aterms'] === ""){
       sessionTemp['pageRetrievalCriteria'] = "Most Recent";
    }
    this.props.updateSession(sessionTemp);
  }

  addTLD(checked){
    var sessionTemp = this.props.session;
    var newTLDs = checked.toString();

    if(newTLDs !== ""){
	if(sessionTemp['selected_queries']!=="" || sessionTemp['selected_tags']!=="" || sessionTemp['selected_model_tags']!==""){
	    sessionTemp['newPageRetrievalCriteria'] = "Multi";
	    sessionTemp['pageRetrievalCriteria'] = {'domain':newTLDs};
	    if(sessionTemp['selected_queries']!=="")
		sessionTemp['pageRetrievalCriteria']['query'] = sessionTemp['selected_queries'];
	    if(sessionTemp['selected_tags']!=="")
		sessionTemp['pageRetrievalCriteria']['tag'] = sessionTemp['selected_tags'];
	    if(sessionTemp['selected_model_tags']!=="")
		sessionTemp['pageRetrievalCriteria']['model_tags'] = sessionTemp['selected_model_tags'];
	}
	else{
	    sessionTemp['newPageRetrievalCriteria'] = "one";
	    sessionTemp['pageRetrievalCriteria'] = "TLDs";
	}
    }
    sessionTemp['selected_tlds']=newTLDs;
    if(sessionTemp['selected_queries'] === "" && sessionTemp['selected_tags'] === "" && sessionTemp['selected_model_tags'] === "" && sessionTemp['selected_tlds'] === "" && sessionTemp['selected_aterms'] === ""){
       sessionTemp['pageRetrievalCriteria'] = "Most Recent";
    }

    this.props.updateSession(sessionTemp);
  }

  addATerm(checked){
    console.log("ADD ATERM");
    var sessionTemp = this.props.session;
    var newTerms = checked.toString();
    console.log(newTerms);  
    var labelTerm = "";
    checked.map((term, index)=>{
	console.log(term);
	labelTerm = labelTerm + term + " OR ";
    });
    if(labelTerm !== "")
	labelTerm = labelTerm.substring(0, labelTerm.length-" OR ".length);

    console.log(labelTerm);
      
    if(newTerms === ""){
	sessionTemp['filter'] = null;
    }
    else {
	if(sessionTemp['selected_queries']!=="" || sessionTemp['selected_tags']!=="" || sessionTemp['selected_tlds']!=="" || sessionTemp['selected_model_tags'] !== ""){
	    sessionTemp['newPageRetrievalCriteria'] = "Multi";
	    sessionTemp['filter'] = labelTerm;
	    sessionTemp['pageRetrievalCriteria'] = {};
	    if (sessionTemp['selected_tlds']!=="")
		sessionTemp['pageRetrievalCriteria']['domain'] = sessionTemp['selected_tlds'];
	    if(sessionTemp['selected_queries']!=="")
		sessionTemp['pageRetrievalCriteria']['query'] = sessionTemp['selected_queries'];
	    if(sessionTemp['selected_tags']!=="")
		sessionTemp['pageRetrievalCriteria']['tag'] = sessionTemp['selected_tags'];
	    if(sessionTemp['selected_model_tags']!=="")
		sessionTemp['pageRetrievalCriteria']['model_tags'] = sessionTemp['selected_model_tags'];
	} else sessionTemp['filter']=labelTerm;
    }
    console.log(sessionTemp['pageRetrievalCriteria']);  
    sessionTemp['selected_aterms']=newTerms;
    if(sessionTemp['selected_queries'] === "" && sessionTemp['selected_tags'] === "" && sessionTemp['selected_model_tags'] === "" && sessionTemp['selected_tlds'] === "" && sessionTemp['selected_aterms'] === ""){
       sessionTemp['pageRetrievalCriteria'] = "Most Recent";
    }
    this.props.updateSession(sessionTemp);
  }
    
  addTags(checked){
    var sessionTemp = this.props.session;	
    var newTags = checked.toString();
    console.log("ADD TAGS");
    console.log(newTags);
    if(newTags !== ""){
	if(sessionTemp['selected_queries']!=="" || sessionTemp['selected_tlds']!=="" || sessionTemp['selected_model_tags'] != ""){	  
	    sessionTemp['newPageRetrievalCriteria'] = "Multi";
	    sessionTemp['pageRetrievalCriteria'] = {'tag':newTags};
	    if(sessionTemp['selected_queries']!=="")
		sessionTemp['pageRetrievalCriteria']['query'] = sessionTemp['selected_queries'];
	    if(sessionTemp['selected_tlds']!=="")
		sessionTemp['pageRetrievalCriteria']['domain'] = sessionTemp['selected_tlds'];
	    if(sessionTemp['selected_model_tags']!=="")
		sessionTemp['pageRetrievalCriteria']['model_tags'] = sessionTemp['selected_model_tags'];
	}
      else{
	  sessionTemp['newPageRetrievalCriteria'] = "one";
	  sessionTemp['pageRetrievalCriteria'] = "Tags";
      }
    } else if(sessionTemp['newPageRetrievalCriteria'] === "Multi"){
	delete sessionTemp['pageRetrievalCriteria']['tag'];
    }
    sessionTemp['selected_tags']=newTags;
    if(sessionTemp['selected_queries'] === "" && sessionTemp['selected_tags'] === "" && sessionTemp['selected_model_tags'] === "" && sessionTemp['selected_tlds'] === "" && sessionTemp['selected_aterms'] === ""){
	sessionTemp['pageRetrievalCriteria'] = "Most Recent";
    }
      console.log(sessionTemp);  
    this.props.updateSession(sessionTemp);
  }

  addModelTags(checked){
    var sessionTemp = this.props.session;	
    var newTags = checked.toString();
    if(newTags !== ""){
	if(sessionTemp['selected_queries']!=="" || sessionTemp['selected_tlds']!=="" || sessionTemp['selected_tags'] !== ""){	  	  
	    sessionTemp['newPageRetrievalCriteria'] = "Multi";
	    sessionTemp['pageRetrievalCriteria'] = {'tag':newTags};
	    if(sessionTemp['selected_queries']!=="")
		sessionTemp['pageRetrievalCriteria']['query'] = sessionTemp['selected_queries'];
	    if(sessionTemp['selected_tlds']!=="")
		sessionTemp['pageRetrievalCriteria']['domain'] = sessionTemp['selected_tlds'];
	    if(sessionTemp['selected_tags']!=="")
		sessionTemp['pageRetrievalCriteria']['tag'] = sessionTemp['selected_tags'];
	} else{
	  sessionTemp['newPageRetrievalCriteria'] = "one";
	  sessionTemp['pageRetrievalCriteria'] = "Model Tags";
	}
    }
    sessionTemp['selected_model_tags']=newTags;
    if(sessionTemp['selected_queries'] === "" && sessionTemp['selected_tags'] === "" && sessionTemp['selected_model_tags'] === "" && sessionTemp['selected_tlds'] === "" && sessionTemp['selected_aterms'] === ""){
	sessionTemp['pageRetrievalCriteria'] = "Most Recent";
    }
    this.props.updateSession(sessionTemp);
  }

  // removeString(currentType, item){
  //   var currentString = "";
  //   var array=[]; // it could be a query or tag array.
  //   switch (currentType) {
  //     case 0: //query
  //         array = this.state.session["selected_queries"].split(",");
  //         break;
  //     case 1://tags
  //         array = this.state.session["selected_tags"].split(",");
  //       break;
  //     case 2: //tlds
  //       array = this.state.session["selected_tlds"].split(",");
  //       break;
  //     case 3: //Annotated Terms
  //       array = this.state.session["selected_aterms"].split(",");
  //       break;
  //   }
  //   for(var index in array){ /* loop over all array items */
  //     if(array[index] !== item){
  //       currentString = currentString + array[index] + ",";
  //     }
  //   }
  //   if(currentString != "") return currentString.substring(0, currentString.length-1);
  //     return currentString;
  // }

  // removeQueryTag(currentType, item){
  //   const sessionTemp =  this.state.session;
  //   switch (currentType) {
  //     case 0: //query
  //         sessionTemp['selected_queries']= this.removeString(0, item);
  //         if(sessionTemp['selected_queries'] === "") {
  //           sessionTemp['newPageRetrievalCriteria'] = "one";
  //           sessionTemp['pageRetrievalCriteria'] = "Tags";
  //         }
  //         break;
  //     case 1://tags
  //         sessionTemp['selected_tags']= this.removeString(1, item);
  //         if(sessionTemp['selected_tags'] === "") {
  //           sessionTemp['newPageRetrievalCriteria'] = "one";
  //           sessionTemp['pageRetrievalCriteria'] = "Queries";
  //         }
  //       break;
  //     case 2://tags
  //         sessionTemp['selected_tags']= this.removeString(1, item);
  //         if(sessionTemp['selected_tags'] === "") {
  //           sessionTemp['newPageRetrievalCriteria'] = "one";
  //           sessionTemp['pageRetrievalCriteria'] = "Queries";
  //         }
  //         break;
  //     case 3://tags
  //         sessionTemp['selected_model_tags']= this.removeString(3, item);
  //         if(sessionTemp['selected_model_tags'] === "") {
  //           if(sessionTemp['selected_queries'] !== "" && sessionTemp['selected_tags'] !== "")
  //               sessionTemp['newPageRetrievalCriteria'] = "Multi";
  //           else if (sessionTemp['selected_queries'] !== "") {
  //             sessionTemp['newPageRetrievalCriteria'] = "one";
  //             sessionTemp['pageRetrievalCriteria'] = "Queries";
  //           }
  //           else {
  //             sessionTemp['newPageRetrievalCriteria'] = "one";
  //             sessionTemp['pageRetrievalCriteria'] = "Tags";
  //           }
  //         }
  //       break;
  //     case 4: //TLD
  //         sessionTemp['selected_tlds']= this.removeString(2, item);
  //         if(sessionTemp['selected_tlds'] === "") {
  //           sessionTemp['newPageRetrievalCriteria'] = "one";
  //           sessionTemp['pageRetrievalCriteria'] = "TLDs";
  //         }
  //       break;
  //     case 5: //Annotated Terms
  //         sessionTemp['selected_aterms']= this.removeString(3, item);
  //         break;
  //   }
  //   if(sessionTemp['selected_queries'] === "" && sessionTemp['selected_tags'] === "" && sessionTemp['selected_model_tags'] === "" && sessionTemp['selected_tlds'] === "" && sessionTemp['selected_aterms'] === ""){
  //      sessionTemp['pageRetrievalCriteria'] = "Most Recent";
  //   }
  //   this.props.deletedFilter(sessionTemp);
  // }
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
      // <Tabs
      //     onChange={this.handleChange}
      //     value={this.state.slideIndex}
      //     inkBarStyle={{background:'#7940A0' ,height: '4px'}}
      //     tabItemContainerStyle={{background: '#9A7BB0' ,height: '40px'}}>
      //     <Tab label="Queries" value={0} style={styles.tab} />
      //   </Tabs>
      return (
	    <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange}  >
            <div style={styles.headline}>
            <LoadQueries update={this.props.update} session={this.state.session} addQuery={this.addQuery.bind(this)}  />
	    <LoadTag update={this.props.update} session={this.state.session} addTags={this.addTags.bind(this)}  />
	    <LoadAnnotatedTerms update={this.props.update} session={this.state.session} addATerm={this.addATerm.bind(this)}  />  	      
	    <LoadTLDs update={this.props.update} session={this.state.session} addTLD={this.addTLD.bind(this)}  />
	    <LoadModel update={this.props.update} session={this.state.session} addModelTags={this.addModelTags.bind(this)} />	      
            </div>
	    </SwipeableViews>
    );
  }
}

export default FiltersTabs;
