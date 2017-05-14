import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import logoNYU from '../images/nyu_logo_purple.png';

import { } from 'material-ui/styles/colors';

import IconButton from 'material-ui/IconButton';
//import Body from './Body';
import {Toolbar, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FontIcon from 'material-ui/FontIcon';
import Model from 'material-ui/svg-icons/image/blur-linear';
import Domain from 'material-ui/svg-icons/maps/transfer-within-a-station';
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
import { FormControl} from 'react-bootstrap';
import Search from 'material-ui/svg-icons/action/search';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import Body from './Body';
import TextField from 'material-ui/TextField';
import $ from "jquery";
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  backgound: {
    background: "#50137A"
  },
  titleText: {
    color: 'white'
  },
  toolBarHeader: {
    width:'70%',
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

class ToolBarHeader extends Component {

  constructor(props){
    super(props);
    this.state = {
      currentDomain:'',
      term:'',
      stopCrawlerSignal:false,
    };
  }
  componentWillMount(){
    this.setState({currentDomain: this.props.currentDomain});
  };

  componentWillReceiveProps  = (nextProps) => {
    if(nextProps.currentDomain ===this.state.currentDomain){
      return;
    }
    this.setState({currentDomain: nextProps.currentDomain});
  };

  shouldComponentUpdate(nextProps, nextState) {
     if (nextProps.currentDomain === this.state.currentDomain) {
       if(nextState.term !==this.state.term){ return true; }
       return false;
     }
     return true;
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
      session['filter'] = null;
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

   startCrawler(){
     console.log("start crawler");
     var session = this.createSession(this.props.idDomain);
     this.setState({stopCrawlerSignal:true,});
     this.forceUpdate();
     $.post(
       '/startCrawler',
       {'session': JSON.stringify(session)},
       function(model) {
       }.bind(this)
     );
   }

   stopCrawler(){
     console.log("stop crawler");
     var session = this.createSession(this.props.idDomain);
     this.setState({stopCrawlerSignal:false,});
     this.forceUpdate();
     $.post(
       '/stopCrawler',
       {'session': JSON.stringify(session)},
       function(model) {
       }.bind(this)
     );
   }

   render() {
     /*{<IconButton tooltip="Create Model" style={{marginLeft:'-15px', marginRight:'-10px'}} > <Model />
     </IconButton>}*/
     var crawlingProgress = (this.state.stopCrawlerSignal)?<CircularProgress style={{marginTop:15, marginLeft:"-10px"}} size={20} thickness={4} />:<div />;
     var crawler = (this.state.stopCrawlerSignal)?<RaisedButton  onClick={this.stopCrawler.bind(this)} style={{height:20, marginTop: 15, width:98}} labelStyle={{textTransform: "capitalize"}} buttonStyle={{height:19}}
        label="Stop"
        labelPosition="before"
        containerElement="label"/> : <div/>;
     var disabledStartCrawler = (this.state.stopCrawlerSignal)?true:false;
     return (
       <Toolbar style={styles.toolBarHeader}>
         <ToolbarTitle text={this.state.currentDomain} style={styles.tittleCurrentDomain}/>
         <ToolbarSeparator style={{ marginTop:"5px"}} />
         <Link to='/'>
           <IconButton tooltip="Change Domain" style={{marginLeft:'-15px'}} > <Domain />
           </IconButton>
         </Link>

         <ToolbarSeparator style={{ marginTop:"5px"}} />
         <RaisedButton  onClick={this.startCrawler.bind(this)} disabled={disabledStartCrawler} style={{height:20, marginTop: 15, width:68}} labelStyle={{textTransform: "capitalize"}} buttonStyle={{height:19}}
            label="Crawler"
            labelPosition="before"
            containerElement="label"
          />
          {crawler}
          {crawlingProgress}

         <ToolbarSeparator style={{ marginTop:"5px"}} />
        <TextField
         style={{width:'35%',marginRight:'-80px', marginTop:5, height: 35, borderColor: 'gray', borderWidth: 1, background:"white", borderRadius:"5px"}}
         hintText="Search ..."
         hintStyle={{marginBottom:"-8px", marginLeft:10}}
         inputStyle={{marginBottom:10, marginLeft:10}}
          underlineShow={false}
         value={this.state.term}
         onKeyPress={(e) => {(e.key === 'Enter') ? this.filterKeyword(this.state.term) : null}}
         onChange={e => this.setState({ term: e.target.value })}
        //  hintText="Hint Text"
        //  onChange={this.handleChange.bind(this)}
        />
         <IconButton style={{marginRight:'-25px'}} onClick={this.filterKeyword.bind(this, this.state.term)}>
          <Search />
         </IconButton>
       </Toolbar>
     );
   }
 }

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idDomain:'',
      filterKeyword:'',
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
    this.setState({filterKeyword:newFilterKeyword});
    this.forceUpdate();
}

render() {
  console.log("header");
  return (
    <div>
      <AppBar showMenuIconButton={true}
        style={styles.backgound}
        title={  <span style={styles.titleText}> Domain Discovery Tool </span>}
        //iconElementLeft={<IconButton><NavigationClose /></IconButton>}
        iconElementLeft={<img src={logoNYU}  height='45' width='40'  />}
        //onLeftIconButtonTouchTap={this.removeRecord.bind(this)}
      >
      <ToolBarHeader currentDomain={this.props.location.query.nameDomain} filterKeyword={this.filterKeyword.bind(this)} idDomain={this.props.location.query.idDomain} />
      </AppBar>

      <Body nameDomain={this.props.location.query.nameDomain} currentDomain={this.state.idDomain} filterKeyword={this.state.filterKeyword}/>

    </div>
  );
}
}

export default Header;
