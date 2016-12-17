import React, { Component } from 'react';
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { Row, Col} from 'react-bootstrap';
//import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import FlatButton from 'material-ui/FlatButton';
import Forward from 'material-ui/svg-icons/content/forward';
import AddBox from 'material-ui/svg-icons/content/add-box';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import {fullWhite} from 'material-ui/styles/colors';
import $ from 'jquery';


import AppBar from 'material-ui/AppBar';
import logoNYU from '../images/nyu_logo_purple.png';

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
    };
  }

  componentWillMount() {
    //Get domains.
    $.post(
      '/getAvailableCrawlers',
      {"type": "init"},
      function(domains) {
        this.setState({domains: domains['crawlers']});
      }.bind(this)
    );
  }

  render(){
    console.log('home');
    if(this.state.domains!==undefined){
      console.log('home into if');
      var mydata = this.state.domains;
      return (
        <div>
          <AppBar showMenuIconButton={true}
            style={{background: "#50137A"}}
            title={  <span style={{color: 'white'}}> Domain Discovery Tool </span>}
            //iconElementLeft={<IconButton><NavigationClose /></IconButton>}
            iconElementLeft={<img src={logoNYU}  height='45' width='40' />}
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
                      var str = (mydata[k].name).replace(/\s+/g, '');
                      return <Link to={{ pathname: `/domain/${str}`, query: { nameDomain: mydata[k].name, idDomain: mydata[k].id} }}  text={"Machine Learning"}>
                      <ListItem key={index} style={{textAlign: 'left'}}
                      primaryText={mydata[k].name}
                      rightIcon={<Forward />} />
                      </Link>
                    })}
                  </List>
                </Col>
                <Col xs={3} md={3}>
                  <Link to='/playerOne'>
                    <FlatButton style={{margin:'70px 10px 10px 10px'}}
                    backgroundColor="#26C6DA"
                    hoverColor="#80DEEA"
                    icon={<AddBox color={fullWhite} />}
                    />
                    <FlatButton style={{margin:20}}
                    backgroundColor="#26C6DA"
                    hoverColor="#80DEEA"
                    icon={<DeleteForever color={fullWhite} />}
                    />
                    <FlatButton style={{margin:20}}
                    backgroundColor="#26C6DA"
                    hoverColor="#80DEEA"
                    icon={<ContentCopy color={fullWhite} />}
                    />
                  </Link>
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

export default Home;
