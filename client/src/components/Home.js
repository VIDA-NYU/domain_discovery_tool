import React, { Component } from 'react';
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

import Checkbox from 'material-ui/Checkbox';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { Row, Col} from 'react-bootstrap';
//import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import FlatButton from 'material-ui/FlatButton';
import Forward from 'material-ui/svg-icons/content/forward';
import AddBox from 'material-ui/svg-icons/content/add-box';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import {fullWhite} from 'material-ui/styles/colors';
import $ from 'jquery';

import AppBar from 'material-ui/AppBar';
import logoNYU from '../images/nyu_logo_purple.png';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  listDomains:{
    borderStyle: 'solid',
    borderColor: '#C09ED7',
    background: 'white',
    borderRadius: '0px 0px 0px 0px',
    borderWidth: '0px 0px 1px 0px',
  },
};


class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      domains: undefined,
      openCreateDomain: false,
      openDeleteDomain: false,
      newNameDomain:"",
      delDomains: {}
    };
    this.focusTextField = this.focusTextField.bind(this);
    this.textInput = null;
  }

  getAvailableDomains(){
    $.post(
      '/getAvailableDomains',
      {"type": "init"},
      function(domains) {
        this.setState({domains: domains['crawlers']});
      }.bind(this)
    );
  }
  componentWillMount() {
    //Get domains.
    this.getAvailableDomains();
  }

  handleOpenCreateDomain = () => {
    this.setState({openCreateDomain: true});
    this.focusTextField();
  };

  handleCloseCreateDomain = () => {
    this.setState({openCreateDomain: false});
  };

  handleOpenDeleteDomain = () => {
    this.setState({openDeleteDomain: true});
  };

  handleCloseDeleteDomain = () => {
    this.setState({openDeleteDomain: false});
  };

  //Handling changes into TextField newNameDomain (updating TextField).
  handleTextChangeNewNameDomain(e){
    this.setState({ "newNameDomain": e.target.value});
  }

  // Explicitly focus the text input using the raw DOM API
   focusTextField() {
     setTimeout(() => this.textInput.focus(), 100);
   }

  //Create a new domain
  createNewDomain(){
    //createNewDomain
    var nameDomain= this.state.newNameDomain;
    $.post(
      '/addDomain',
      {'index_name': nameDomain},
      function(domains) {
        this.setState({openCreateDomain: false, newNameDomain:"" });
        this.getAvailableDomains();
        this.forceUpdate();
      }.bind(this)
    );
  };

  //Delete selected domains
  deleteDomains(){
    var delDomains= this.state.delDomains;
    $.post(
      '/delDomain',
      {'domains': JSON.stringify(delDomains)},
      function(domains) {
        this.setState({openDeleteDomain: false, delDomains: {}});
        this.getAvailableDomains();
        this.forceUpdate();
      }.bind(this)
    );
  };

  // Get all the domains selected for deletion
  addDelDomains(id,name){
    var tempDelDomains = this.state.delDomains;
    tempDelDomains[id]=name;
    this.setState({delDomains:tempDelDomains});
  }

  render(){

    const actionsCreateDomain = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleCloseCreateDomain}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.createNewDomain.bind(this)}
      />,
    ];

    const actionsDeleteDomain = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleCloseDeleteDomain}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.deleteDomains.bind(this)}
      />,
    ];

    if(this.state.domains!==undefined){
      var mydata = this.state.domains;
      return (
        <div>
          <AppBar showMenuIconButton={true}
            style={{background: "#50137A"}}
            title={  <span style={{color: 'white'}}> Domain Discovery Tool </span>}
            //iconElementLeft={<IconButton><NavigationClose /></IconButton>}
            iconElementLeft={<img alt="logo NYU" src={logoNYU}  height='45' width='40' />}
            //onLeftIconButtonTouchTap={this.removeRecord.bind(this)}
          >
          </AppBar>
          <div className="jumbotron col-sm-12 text-center">
            <div style={{ marginLeft:'25%'}}>
              <Row>
                <Col xs={6} md={6} style={styles.listDomains}>
                  <List>
                    <Subheader style={{color:'black'}}><h2>Domains</h2></Subheader>
                    {Object.keys(mydata).map((k, index)=>{
                      return <Link to={{ pathname: `/domain/{mydata[k].index}`, query: { nameDomain: mydata[k].name, idDomain: mydata[k].id} }}  text={"Machine Learning"}>
                                <ListItem key={index} style={{textAlign: 'left'}}
                                primaryText={mydata[k].name}
                                rightIcon={<Forward />} />
                              </Link>
                    })}
                  </List>
                </Col>
                <Col xs={4} md={4}>
                  <Link to='/'>
                    <RaisedButton
                      label="Add Domain"
                      labelStyle={{textTransform: "capitalize", color:"#323232" }}
                      backgroundColor={this.props.backgroundColor}
                      icon={<AddBox color={"#323232"} />}
                      style={{margin:'70px 10px 30px 10px'}}
                      onTouchTap={this.handleOpenCreateDomain.bind(this)}
                    />
                    <RaisedButton
                      label="Delete Domain"
                      labelStyle={{textTransform: "capitalize", color:"#323232"}}
                      backgroundColor={this.props.backgroundColor}
                      icon={<DeleteForever color={"#323232"} />}
                      style={{margin:'70px 10px 30px 10px'}}
                      onTouchTap={this.handleOpenDeleteDomain.bind(this)}
                    />
                  </Link>
                  <Dialog
                   title="Adding a domain"
                   actions={actionsCreateDomain}
                   modal={false}
                   open={this.state.openCreateDomain}
                   onRequestClose={this.handleCloseCreateDomain.bind(this)}
                  >
                     <TextField style={{width:'268px', fontSize: 12, borderColor: 'gray', borderWidth: 1, background:"white", borderRadius:"1px"}}
                      ref={(input) => { this.textInput = input;}}
                      value={this.state.newNameDomain}
                      onChange={this.handleTextChangeNewNameDomain.bind(this)}
                      onKeyPress={(e) => {(e.key === 'Enter') ? this.createNewDomain(this) : null}}
                      hintText="Write the name domain."
                      hintStyle={{ marginLeft:10}}
                      inputStyle={{marginBottom:10, marginLeft:10, paddingRight:20}}
                     />
                   </Dialog>

                   <Dialog
                    title="Deleting a domain"
                    actions={actionsDeleteDomain}
                    modal={false}
                    open={this.state.openDeleteDomain}
                    onRequestClose={this.handleCloseDeleteDomain.bind(this)}
                   >
        	           <div style={{height:430, overflowY: "scroll",}}>
        	              {Object.keys(mydata).map((k, index)=>{
                		      return <Checkbox
                            			   label={mydata[k].name}
                            			   value={mydata[k].id}
                            			   style={styles.checkbox}
                		                 onClick={this.addDelDomains.bind(this,mydata[k].id,mydata[k].index)}
                			           />
        		            })}
        	            </div>
                   </Dialog>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      );
    }
    return(
      <div></div>
    );
  }
}

Home.defaultProps = {
    backgroundColor:"#9A7BB0",
};

export default Home;
