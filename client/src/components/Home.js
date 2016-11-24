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



class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentDomain:null,
    };
  }

setSelectedDomain(currentDomain){
  console.log("hello new domain" +currentDomain);
  this.setState({currentDomain:currentDomain});
  this.props.route.setSelectedDomain(currentDomain, true);
}

render(){
var mydata = ["Machine Learning", "Text Classification", "Ebola", "Data mining", "More domains"];

  return (
    <div className="jumbotron col-sm-12 text-center">
        <div style={{ marginLeft:'25%'}}>
          <Row>
            <Col xs={6} md={6} style={{borderStyle: 'solid',
            borderColor: '#C09ED7',
            background: 'white',
            borderRadius: '0px 0px 0px 0px',
            borderWidth: '0px 0px 1px 0px'}}>
                  <List>
                    <Subheader style={{color:'black'}}><h2>Domains</h2></Subheader>
                    {Object.keys(mydata).map((k, index)=>{
                      return <Link to='/playerOne' text={"Machine Learning"}>
                      <ListItem key={index} style={{textAlign: 'left'}}
                        primaryText={mydata[k]}
                        rightIcon={<Forward />}
                        onClick={this.setSelectedDomain.bind(this, mydata[k])}
                      />
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
  );
}
}

export default Home;
