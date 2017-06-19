import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import logoNYU from '../images/nyu_logo_purple.png';

import { } from 'material-ui/styles/colors';

import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import SwitchDomain from 'material-ui/svg-icons/maps/transfer-within-a-station';
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
import Search from 'material-ui/svg-icons/action/search';
import OpenInNewTab from 'material-ui/svg-icons/action/open-in-new';
import InfoIcon from 'material-ui/svg-icons/action/info';
import TextField from 'material-ui/TextField';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';
import Monitoring from './Monitoring.js';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import $ from 'jquery';

const styles = {
  backgound: {
    background: "#50137A"
  },
  titleText: {
    color: 'white'
  },
  toolBarHeader: {
    width:'75%',
    height:45,
    marginTop:8,
    marginRight:'-15px',
    background:'#B39DDB',
    borderRadius: '5px 5px 5px 5px',
    borderStyle: 'solid',
    borderColor: '#7E57C2#B39DDB',
    borderWidth: '1px 0px 1px 0px'
  },
  toolBarCurrentDomain:{
    marginLeft: '0px',
    marginRight: '0px'
  },
  tittleCurrentDomain:{
    fontSize: 15,
    textTransform: 'uppercase',
    color: 'black', fontWeight:'bold',
    paddingLeft: '3px',
    paddingRight: '0px',
    marginTop: '-5px',
  },
  toolBarGroupChangeDomain:{
    marginLeft: '0px',
    marginRight: '2px'
  },
  buttons:{
    margin: '-10px',
    marginTop:5,
    width:35,
    border:0,
  },

};

class Header extends Component {

  constructor(props){
    super(props);
    this.state = {
      currentDomain:'',
      term:'',
      disableStopCrawlerSignal:true,
      disableAcheInterfaceSignal:true,
      disabledStartCrawler:true, //false
      disabledCreateModel:true, //false
      messageCrawler:"",
      openCreateModel: false,
      openInfo:false,
      currentTags:undefined,
      tagsPosCheckBox:["Relevant"],
      tagsNegCheckBox:["Irrelevant"],
      loadingModel:false,
      processes:{},
      noModelAvailable:true, //the first time we dont have a model
    };

    this.intervalFuncId = undefined;
  }

  componentWillMount(){
      this.setState({currentDomain: this.props.currentDomain,});
      this.setStatusInterval();
  };

  componentWillReceiveProps  = (nextProps) => {
    if(nextProps.deleteKeywordSignal){ this.setState({term:""});}
    if(nextProps.noModelAvailable !== this.state.noModelAvailable ){
        if(!nextProps.noModelAvailable){ //if there is a model
            this.setState({noModelAvailable:false, disabledStartCrawler:false,  disabledCreateModel:false,});
        }
        else this.setState({noModelAvailable:true, disableStopCrawlerSignal:true, disableAcheInterfaceSignal:true, disabledStartCrawler:true,  disabledCreateModel:true,});
    }
    else {return;}
    }

    shouldComponentUpdate(nextProps, nextState) {
      if(nextProps.deleteKeywordSignal){ return true; }
      if(nextProps.noModelAvailable !== this.state.noModelAvailable){ return true; }
      if(nextState.term !==this.state.term || nextState.openCreateModel || nextState.openInfo){ return true; }

      return false;
    }

    //Kill window.setInterval() for the current intervalFuncId. It happen when you go out from the domain (switching domain)
    componentWillUnmount() {
      window.clearInterval(this.intervalFuncId);
    }

   filterKeyword(terms){
     this.props.filterKeyword(terms);
   }

   createSession(domainId){
      var session = {};
      session['search_engine'] = "GOOG";
      session['activeProjectionAlg'] = "Group by Correlation";
      session['domainId'] = domainId;
      session['pagesCap'] = "100";
      session['fromDate'] = null;
      session['toDate'] = null;
      session['filter'] = null;//null;
      session['pageRetrievalCriteria'] = "Most Recent";
      session['selected_morelike'] = "";
      session['selected_queries']="";
      session['selected_tlds']="";
      session['selected_aterms']="";
      session['selected_tags']="";
      session['selected_model_tags']="";
      session['model'] = {};
      session['model']['positive'] = "Relevant";
      session['model']['nagative'] = "Irrelevant";
      return session;
   }


    getStatus(){
	var session = this.createSession(this.props.idDomain);
	$.post(
	    '/getStatus',
	    {'session': JSON.stringify(session)},
	    function(result) {
		var status = JSON.parse(JSON.stringify(result));
		var disableStopCrawlerFlag = true;
		var disableAcheInterfaceFlag =true;
		var disabledStartCrawlerFlag = false;
		var disabledCreateModelFlag = false;
		if(this.state.noModelAvailable){
		    disabledStartCrawlerFlag = true;
		    disabledCreateModelFlag = true;
		}
		if(status !== undefined && Object.keys(status).length > 0) {
		    // Background processes exist
		    if(status.Crawler !== undefined && status.Crawler.length > 0){
			// Crawler is executing
			var message = status.Crawler[0].status;
			if( message !== undefined){
			    if(message.toLowerCase() === "running"){
				disableStopCrawlerFlag = false;
				disableAcheInterfaceFlag =false;
				disabledStartCrawlerFlag = true;
			    }else if(message.toLowerCase() === "terminating"){
				disabledStartCrawlerFlag = true;
			    }
			    if(this.props.currentDomain !== status.Crawler[0].domain){
				// Crawler is rumming in a different domain
				disableStopCrawlerFlag = true;
				disableAcheInterfaceFlag =true;
				disabledStartCrawlerFlag = true;
				message = message +" in domain: " +  status.Crawler[0].domain;
			    }
			    this.setState({processes: status, disableAcheInterfaceSignal:disableAcheInterfaceFlag, disableStopCrawlerSignal:disableStopCrawlerFlag, disabledStartCrawler:disabledStartCrawlerFlag, disabledCreateModel: disabledCreateModelFlag, messageCrawler:message, });
			    this.forceUpdate();
			}
		    } else {
			// Not a crawler process. Could be seedfinder
			this.setState({processes: status, disableAcheInterfaceSignal:true, disableStopCrawlerSignal:true, disabledStartCrawler: disabledStartCrawlerFlag, disabledCreateModel: disabledCreateModelFlag, messageCrawler:"", });
			this.forceUpdate();
		    }
		}else {
		    // No processes running
		    this.setState({processes: status, disableAcheInterfaceSignal:true, disableStopCrawlerSignal:true, disabledStartCrawler: disabledStartCrawlerFlag, disabledCreateModel:disabledCreateModelFlag,  messageCrawler:"", });
		    this.forceUpdate();
		}
	    }.bind(this)
	);
    }
    
   setStatusInterval(){
       this.intervalFuncId = window.setInterval(function() {this.getStatus();}.bind(this), 1000);
   }

   startCrawler(){
     var session = this.createSession(this.props.idDomain);
     var message = "Running";
     this.setState({disableAcheInterfaceSignal:false, disableStopCrawlerSignal:false, disabledStartCrawler:true, messageCrawler:message});
     this.forceUpdate();
     $.post(
         '/startCrawler',
         {'session': JSON.stringify(session)},
         function(message) {
           var disableStopCrawlerFlag = false;
           var disableAcheInterfaceFlag = false;
           var disabledStartCrawlerFlag = true;
           if(message.toLowerCase() !== "running"){
	       disableStopCrawlerFlag = true;
	       disableAcheInterfaceFlag =true;
	       disabledStartCrawlerFlag = true;
           }
	     
           this.props.updateFilterCrawlerData("updateCrawler");
           this.setState({ disableAcheInterfaceSignal: disableAcheInterfaceFlag, disableStopCrawlerSignal:disableStopCrawlerFlag, disabledStartCrawler:disabledStartCrawlerFlag, messageCrawler:message});
           this.forceUpdate();
         }.bind(this)
     );
   }

   stopCrawler(flag){
     var session = this.createSession(this.props.idDomain);
     var message = "Terminating";
     this.setState({disableAcheInterfaceSignal:true, disableStopCrawlerSignal:true, disabledStartCrawler:true, messageCrawler:message,});
     this.forceUpdate();
     $.post(
       '/stopCrawler',
       {'session': JSON.stringify(session)},
       function(message) {
         this.props.updateFilterCrawlerData("stopCrawler");
           this.setState({disableAcheInterfaceSignal:true, disableStopCrawlerSignal:true, disabledStartCrawler: false, messageCrawler:"",});
         this.forceUpdate();
       }.bind(this)
     );
   }

   acheInterfaceCrawler(flag){
     var session = this.createSession(this.props.idDomain);
     var message = "Terminating";
     this.setState({disableAcheInterfaceSignal:true, disableStopCrawlerSignal:true, disabledStartCrawler:true, messageCrawler:message,});
     this.forceUpdate();
     $.post(
       '/stopCrawler',
       {'session': JSON.stringify(session)},
       function(message) {
         this.setState({disableAcheInterfaceSignal:true, disableStopCrawlerSignal:true, disabledStartCrawler: false, messageCrawler:""});
         this.forceUpdate();
       }.bind(this)
     );
   }

   handleOnRequestChange = (event, value)=> {
       var session = this.createSession(this.props.idDomain);
       if(value === "2"){
	   this.getAvailableTags(session);
	   this.setState({ openCreateModel: true });
       }
       else if(value === "1"){
	   this.createModel();
       }
   }

   handleOpenCreateModel = () => {
     this.setState({openCreateModel: true});
   };

   handleCloseCreateModel = () => {
     this.setState({openCreateModel: false});
     this.forceUpdate();
   };

   handleCloseCancelCreateModel = () => {
     this.setState({openCreateModel: false});
     this.setState({  tagsPosCheckBox:["Relevant"], tagsNegCheckBox:["Irrelevant"],})
     this.forceUpdate();
   };

   handleOpenInfo = () => {
      this.setState({openInfo: true});
      this.forceUpdate();
    };

    handleCloseInfo = () => {
      this.setState({openInfo: false});
      this.forceUpdate();
    };


   getAvailableTags(session){
     $.post(
        '/getAvailableTags',
        {'session': JSON.stringify(session), 'event': 'Tags'},
        function(tagsDomain) {
          this.setState({currentTags: tagsDomain['tags']}); //, session:this.props.session, tagString: JSON.stringify(this.props.session['selected_tags'])});
          this.forceUpdate();
        }.bind(this)
      );
   }
   getCreatedModel(session){
     $.post(
        '/createModel',
        {'session': JSON.stringify(session)},
        function(model_file) {
          var url = model_file;
          window.open(url,'Download');
          this.setState({loadingModel:false, disabledCreateModel:false})
          this.forceUpdate();
        }.bind(this)
      );
   }
   //Create model
   createModel(){
     var session = this.createSession(this.props.idDomain); //createNewDomain
     this.setState({loadingModel:true, disabledCreateModel:true});
     this.forceUpdate();
     this.getCreatedModel(session);
   };

   addPosTags(tag){
      var tags = this.state.tagsPosCheckBox;
      if(tags.includes(tag)){
        var index = tags.indexOf(tag);
        tags.splice(index, 1);
      }
      else{
        tags.push(tag);
      }
      this.setState({tagsPosCheckBox:tags})
      this.forceUpdate();
   }

   addNegTags(tag){
      var tags = this.state.tagsNegCheckBox;
      if(tags.includes(tag)){
        var index = tags.indexOf(tag);
        tags.splice(index, 1);
      }
      else{
        tags.push(tag);
      }
      this.setState({tagsNegCheckBox:tags})
      this.forceUpdate();
   }

   render() {
     const actionsCreateModel = [
                                 <FlatButton label="Cancel" primary={true} onTouchTap={this.handleCloseCancelCreateModel} />,
                                 <FlatButton label="Save"   primary={true} keyboardFocused={true} onTouchTap={this.handleCloseCreateModel} />,
                                ];
    const actionsShowInfo = [
                                <FlatButton label="Ok" primary={true}   keyboardFocused={true} onTouchTap={this.handleCloseInfo} />,
                               ];

     var checkedTagsPosNeg = (this.state.currentTags!==undefined) ?
                             <div>
                               <p>Positive</p>
                                 {Object.keys(this.state.currentTags).map((tag, index)=>{
                                   var labelTags=  tag+" (" +this.state.currentTags[tag]+")";
                                   var checkedTag=false;
                                   var tags = this.state.tagsPosCheckBox;
                                   if(tags.includes(tag))
                                      checkedTag=true;
                                   return <Checkbox label={labelTags} checked={checkedTag}  onClick={this.addPosTags.bind(this,tag)} />
                                 })}
                              <p>Negative</p>
                                 {Object.keys(this.state.currentTags).map((tag, index)=>{
                                   var labelTags=  tag+" (" +this.state.currentTags[tag]+")";
                                   var checkedTag=false;
                                   var tags = this.state.tagsNegCheckBox;
                                   if(tags.includes(tag))
                                   checkedTag=true;
                                   return <Checkbox label={labelTags} checked={checkedTag}  onClick={this.addNegTags.bind(this,tag)} />
                                 })}
                               </div>:<div />;

     var loadingModel = (this.state.loadingModel)?<CircularProgress style={{marginTop:15, marginLeft:"-30px"}} size={20} thickness={4} />: <div/>;
     var crawlingProgress = (this.state.disableStopCrawlerSignal)?<div />: <CircularProgress style={{marginTop:15, marginLeft:"-10px"}} size={20} thickness={4} />;
     var messageCrawlerRunning = (this.state.disabledStartCrawler)?<div style={{marginTop:15, fontFamily:"arial", fontSize:14 , fontWeight:"bold"}}>{this.state.messageCrawler} </div>:"";
     var infoCrawlerRunning = <IconButton tooltip="Process Monitor" onTouchTap={this.handleOpenInfo.bind(this)}
                                  style={{height:20, marginLeft: "-20px", minWidth:58, width:48}} tooltipStyles={{fontSize:14, fontWeight:"bold"}}
                              >
                                <InfoIcon />
                              </IconButton>;
     var crawlerStop = (this.state.disableStopCrawlerSignal)?<div/>:<RaisedButton  onClick={this.stopCrawler.bind(this, true)} style={{height:20, marginTop: 15, minWidth:58, width:48}} labelStyle={{textTransform: "capitalize"}} buttonStyle={{height:19}}
                                                                                   label="Stop" labelPosition="before" containerElement="label"/>;
     var crawlerAcheInterface = (this.state.disableStopCrawlerSignal)?<div/>:<IconButton tooltip="Click to open ACHE Interface"
                                  href="http://localhost:8080/" target="_blank" style={{height:20, marginLeft: "-20px", minWidth:58, width:48}} tooltipStyles={{fontSize:14, fontWeight:"bold"}}
                                >
                                  <OpenInNewTab />
                                </IconButton>;
     return (
       <AppBar showMenuIconButton={true} style={styles.backgound} title={<span style={styles.titleText}> Domain Discovery Tool </span>}
        iconElementLeft={<img alt="logo NYU" src={logoNYU}  height='45' width='40'  />} >
         <Toolbar style={styles.toolBarHeader}>
             <ToolbarTitle text={this.state.currentDomain} style={styles.tittleCurrentDomain}/>
             <ToolbarSeparator style={{ marginTop:"5px"}} />
                 <Link to='/'>
                  <IconButton tooltip="Change Domain" style={{marginLeft:'-15px'}} tooltipStyles={{fontSize:14, fontWeight:"bold"}} > <SwitchDomain /> </IconButton>
                 </Link>
             <ToolbarSeparator style={{ marginTop:"5px", marginLeft:"-20px"}} />
             <RaisedButton onClick={this.startCrawler.bind(this)} disabled={this.state.disabledStartCrawler} style={{ height:20, marginTop: 15, minWidth:118, width:118}} labelStyle={{textTransform: "capitalize"}} buttonStyle={{height:19}}
                           label="Start Crawler" labelPosition="before" containerElement="label" />
             {crawlerAcheInterface}
             {crawlerStop}
             {messageCrawlerRunning}
             {crawlingProgress}

             <IconMenu
             iconButtonElement={<RaisedButton disabled={this.state.disabledCreateModel} style={{height:20, marginTop: 15,minWidth:68, width:68}} labelStyle={{textTransform: "capitalize"}} buttonStyle={{height:19}}
             label="Model" labelPosition="before" containerElement="label" />} onChange={this.handleOnRequestChange.bind(this)}>
                 <MenuItem value="1" primaryText="Create Model" />
                 <MenuItem value="2" primaryText="Settings" />
             </IconMenu>
	     {loadingModel}
	     <ToolbarSeparator style={{ marginTop:"5px"}} />
	     {infoCrawlerRunning}
             <ToolbarSeparator style={{ marginTop:"5px"}} />
             <TextField
             style={{width:'25%',marginRight:'-80px', marginTop:5, height: 35, borderColor: 'gray', borderWidth: 1, background:"white", borderRadius:"5px"}}
             hintText="Search ..." hintStyle={{marginBottom:"-8px", marginLeft:10}} inputStyle={{marginBottom:10, marginLeft:10}} underlineShow={false}
             value={this.state.term} onKeyPress={(e) => {(e.key === 'Enter') ? this.filterKeyword(this.state.term) : null}} onChange={e => this.setState({ term: e.target.value })}
             />
             <IconButton style={{marginRight:'-25px'}} onClick={this.filterKeyword.bind(this, this.state.term)}>
                <Search />
             </IconButton>
             <Dialog title=" Model Settings" actions={actionsCreateModel} modal={false} open={this.state.openCreateModel} onRequestClose={this.handleCloseCreateModel.bind(this)}>
                {checkedTagsPosNeg}
             </Dialog>
             <Dialog title="Monitoring processes" actions={actionsShowInfo} modal={false} open={this.state.openInfo} onRequestClose={this.handleCloseInfo.bind(this)}>
             <Monitoring processes={this.state.processes}/>
             </Dialog>
         </Toolbar>
       </AppBar>
     );
   }
 }

 export default Header;
