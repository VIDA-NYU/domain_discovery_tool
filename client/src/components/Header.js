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

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';

import $ from 'jquery';

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
      openCreateModel: false,
      currentTags:undefined,
      tagsPosCheckBox:["Relevant"],
      tagsNegCheckBox:["Irrelevant"],
      loadingModel:false,
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
     if (nextProps.currentDomain === this.state.currentDomain ) {
       if(nextState.term !==this.state.term || nextState.openCreateModel ){ return true; }
       return false;
     }
     return true;
  }

   filterKeyword(terms){
     this.props.filterKeyword(terms);
   }

   handleOnRequestChange = (event, value)=> {
     var session = this.createSession(this.props.idDomain);
     if(value == 2){
       this.getAvailableTags(session);
       this.setState({ openCreateModel: true });
     }
     else{
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

   getAvailableTags(session){
     $.post(
        '/getAvailableTags',
        {'session': JSON.stringify(session), 'event': 'Tags'},
        function(tagsDomain) {
          //tagString: JSON.stringify(this.props.session['selected_tags'])
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
          this.setState({loadingModel:false})
          this.forceUpdate();
        }.bind(this)
      );
   }
   //Create model
   createModel(){
     //createNewDomain
     var session = this.createSession(this.props.idDomain);
     this.setState({loadingModel:true});
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
       <FlatButton
         label="Cancel"
         primary={true}
         onTouchTap={this.handleCloseCancelCreateModel}
       />,
       <FlatButton
         label="Save"
         primary={true}
         keyboardFocused={true}
         onTouchTap={this.handleCloseCreateModel}
       />,
     ];

      var checkedTagsPosNeg = (this.state.currentTags!==undefined)?<div><p>Positive</p>
           {Object.keys(this.state.currentTags).map((tag, index)=>{
             var labelTags=  tag+" " +"(" +this.state.currentTags[tag]+")";
             var checkedTag=false;
             var tags = this.state.tagsPosCheckBox;
             if(tags.includes(tag))
               checkedTag=true;
             return <Checkbox label={labelTags} checked={checkedTag}  onClick={this.addPosTags.bind(this,tag)} />
           })}
           <p>Negative</p>
           {Object.keys(this.state.currentTags).map((tag, index)=>{
             var labelTags=  tag+" " +"(" +this.state.currentTags[tag]+")";
             var checkedTag=false;
             var tags = this.state.tagsNegCheckBox;
             if(tags.includes(tag))
               checkedTag=true;
             return <Checkbox label={labelTags} checked={checkedTag}  onClick={this.addNegTags.bind(this,tag)} />
           })}
           </div>:<div />;
     var loadingModel = (this.state.loadingModel)?<CircularProgress style={{marginTop:15, marginLeft:"-30px"}} size={20} thickness={4} />: <div/>;
     /*{<IconButton tooltip="Create Model" style={{marginLeft:'-15px', marginRight:'-10px'}} > <Model />
     </IconButton>}*/
     return (
       <Toolbar style={styles.toolBarHeader}>
         <ToolbarTitle text={this.state.currentDomain} style={styles.tittleCurrentDomain}/>
         <ToolbarSeparator style={{ marginTop:"5px"}} />
         <Link to='/'>
           <IconButton tooltip="Change Domain" style={{marginLeft:'-15px'}} > <Domain />
           </IconButton>
         </Link>
         <IconMenu
          iconButtonElement={<RaisedButton style={{height:20, marginTop: 15, width:68}} labelStyle={{textTransform: "capitalize"}} buttonStyle={{height:19}}
            label="Model"
            labelPosition="before"
            containerElement="label"
          />}
          onChange={this.handleOnRequestChange.bind(this)}
         >
          <MenuItem value="1" primaryText="Create Model" />
          <MenuItem value="2" primaryText="Settings" />
         </IconMenu>
         {loadingModel}
         <ToolbarSeparator style={{ marginTop:"5px"}} />
        <TextField
         style={{width:'35%',marginRight:'-120px', marginTop:5, height: 35, borderColor: 'gray', borderWidth: 1, background:"white", borderRadius:"5px"}}
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

         <Dialog
            title=" Model Settings"
            actions={actionsCreateModel}
            modal={false}
            open={this.state.openCreateModel}
            onRequestClose={this.handleCloseCreateModel.bind(this)}
          >
          {checkedTagsPosNeg}
          </Dialog>

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
  console.log(this.props.location.query.idDomain);
  return (
    <div>
      <AppBar showMenuIconButton={true}
        style={styles.backgound}
        title={  <span style={styles.titleText}> Domain Discovery Tool </span>}
        //iconElementLeft={<IconButton><NavigationClose /></IconButton>}
        iconElementLeft={<img src={logoNYU}  height='45' width='40'  />}
        //onLeftIconButtonTouchTap={this.removeRecord.bind(this)}
      >
      <ToolBarHeader currentDomain={this.props.location.query.nameDomain} idDomain={this.props.location.query.idDomain} filterKeyword={this.filterKeyword.bind(this)} />
      </AppBar>

      <Body nameDomain={this.props.location.query.nameDomain} currentDomain={this.state.idDomain} filterKeyword={this.state.filterKeyword}/>

    </div>
  );
}
}

export default Header;
