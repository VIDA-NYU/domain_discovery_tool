import React, { Component } from 'react';
import { Col, Row} from 'react-bootstrap';
// From https://github.com/oliviertassinari/react-swipeable-views
import Terms from './Terms';
import ScaleBar from './ScaleBar';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import { InputGroup, FormControl , DropdownButton,  MenuItem} from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';
import {fullWhite} from 'material-ui/styles/colors';
import Search from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import {Toolbar, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import RemoveURL from 'material-ui/svg-icons/navigation/cancel';
import IconButton from 'material-ui/IconButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';

import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';


import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import $ from 'jquery';


const styles = {

  card: {
    borderStyle: 'solid',
    borderColor: '#C09ED7',
    background: 'white',
    borderRadius: '0px 0px 0px 0px',
    borderWidth: '0px 0px 0px 0px'
  },
  avatar:{
    margin:'-4px 8px 0px 0px',
  },
  cardHeader:{
    background: "white", //'#DCCCE7',
    padding:'10px 1px 10px 6px',
    borderRadius: '0px 0px 0px 0px',
  },
  cardMedia:{
    background: "white",
    padding:'2px 4px 2px 4px',
    borderRadius: '0px 0px 0px 0px',
    height: "382px",
  },
};


class FocusedCrawling extends Component {

  constructor(props) {
    super(props);
      this.state = {
      slideIndex: 0,
      pages:{},
      currentTags:undefined,
      selectedPosTags: ["Relevant"],
      selectedNegTags: ["Irrelevant"],
      session:{},
    };

  }



  /**
  * Set
  * @method componentWillMount
  * @param
  */
  componentWillMount(){
      var temp_session = this.props.session;
      this.setState({session: temp_session});
      this.getAvailableTags(this.props.session);
      this.getModelTags(this.props.domainId);


  }
  componentWillReceiveProps  = (newProps, nextState) => {

  }

  loadingTerms(){
    var temp_session = JSON.parse(JSON.stringify(this.props.session));
    temp_session['newPageRetrievalCriteria'] = "one";
    temp_session['pageRetrievalCriteria'] = "Tags";
    temp_session['selected_tags']=this.state.selectedPosTags.join(',');
    this.setState({session: temp_session});
  }

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

  getModelTags(domainId){
    $.post(
      '/getModelTags',
      {'domainId': domainId},
      function(tags){
        if(Object.keys(tags).length > 0){
          var session = this.state.session;
          session['model']['positive'] = tags['positive'].slice();
          session['model']['negative'] = tags['negative'].slice();
          this.setState({session: session, selectedPosTags: tags['positive'].slice(), selectedNegTags: tags['negative'].slice()})
          this.loadingTerms();
          this.forceUpdate();
        }
      }.bind(this)
    );
  }

  handleSaveTags() {
    var session = this.state.session;
    session['model']['positive'] = this.state.selectedPosTags.slice();
    session['model']['negative'] = this.state.selectedNegTags.slice();
    this.setState({session: session, selectedPosTags: this.state.selectedPosTags.slice(),});
    this.loadingTerms();
    this.forceUpdate();

    $.post(
      '/saveModelTags',
      {'session': JSON.stringify(session)},
      function(update){
        this.forceUpdate();
      }.bind(this)

    );
  }

  handleCancelTags(){
    this.setState({selectedPosTags: this.state.session['model']['positive'].slice(), selectedNegTags: this.state.session['model']['negative'].slice()})
    this.forceUpdate();

  }

  addPosTags(tag){
    var tags = this.state.selectedPosTags;
    if(tags.includes(tag)){
      var index = tags.indexOf(tag);
      tags.splice(index, 1);
    }
    else{
      tags.push(tag);
    }
    this.setState({selectedPosTags: tags})
    this.forceUpdate();
  }

  addNegTags(tag){
    var tags = this.state.selectedNegTags;
    if(tags.includes(tag)){
      var index = tags.indexOf(tag);
      tags.splice(index, 1);
    }
    else{
      tags.push(tag);
    }
    this.setState({selectedNegTags: tags})
    this.forceUpdate();
  }


  handleStartCrawler =()=>{
    this.setState({crawlerStart:true});
    this.forceUpdate();
  }

  render() {

    var checkedTagsPosNeg = (this.state.currentTags!==undefined) ?
                          <div style={{height:330, overflowY: "scroll", }}>
                          Positive
                          {Object.keys(this.state.currentTags).map((tag, index)=>{
                          var labelTags=  tag+" (" +this.state.currentTags[tag]+")";
                          var checkedTag=false;
                          var tags = this.state.selectedPosTags;
                          if(tags.includes(tag))
                            checkedTag=true;
                          return <Checkbox label={labelTags} checked={checkedTag}  onClick={this.addPosTags.bind(this,tag)} />
                          })}
                          Negative
                            {Object.keys(this.state.currentTags).map((tag, index)=>{
                              var labelTags=  tag+" (" +this.state.currentTags[tag]+")";
                              var checkedTag=false;
                              var tags = this.state.selectedNegTags;
                              if(tags.includes(tag))
                              checkedTag=true;
                                return <Checkbox label={labelTags} checked={checkedTag}  onClick={this.addNegTags.bind(this,tag)} />
                              })}
                        </div>:<div />;


    const stopCrawlerButton = [
      (this.state.crawlerStart)?<RaisedButton disabled={false} style={{ height:20, marginTop: 15, minWidth:118, width:118}} labelStyle={{textTransform: "capitalize"}} buttonStyle={{height:19}}
        label="Stop Crawler" labelPosition="before" containerElement="label"/>:<div/>
    ];

    return (
      <div>
      <Row>
        <Col xs={11} md={11} style={{margin:'10px'}}>
        <Card id={"Settings"} initiallyExpanded={true} style={{paddingBottom:0,}} containerStyle={{paddingBottom:0,}} >
         <CardHeader
           title="Settings"
           actAsExpander={false}
           showExpandableButton={false}
           style={{fontWeight:'bold', padding:'10px 1px 10px 6px', borderRadius: '0px 0px 0px 0px',}}
         />
         <CardText expandable={true} style={{padding:'1px 16px 0px 16px',}}>
           <Row>
             <Col xs={7} md={7} style={{margin:0, padding:0,}}>
               <Card id={"Tags"} initiallyExpanded={true} style={styles.card}>
                <CardHeader
                  title="Tags"
                  actAsExpander={false}
                  showExpandableButton={false}
                  style={styles.cardHeader}
                />
                <CardText expandable={true} style={styles.cardMedia}>


                <Divider/>
                  <Row style={{margin:"5px 5px 10px 20px"}} title="Model Settings">
                    {checkedTagsPosNeg}
                  </Row>
                  <Row style={{margin:"-8px 5px 10px 20px"}}>
                    <RaisedButton disabled={false} onTouchTap={this.handleSaveTags.bind(this)} style={{ height:20, marginTop: 15, marginRight:10, minWidth:118, width:118}} labelStyle={{textTransform: "capitalize"}} buttonStyle={{height:19}}
                    label="Save" labelPosition="before" containerElement="label" />
            <RaisedButton disabled={false} onTouchTap={this.handleCancelTags.bind(this)} style={{ height:20, marginTop: 15, minWidth:118, width:118}} labelStyle={{textTransform: "capitalize"}} buttonStyle={{height:19}}
                    label="Cancel" labelPosition="before" containerElement="label" />
                  </Row>
                </CardText>
                </Card>
             </Col>
             <Col xs={5} md={5} style={{margin:0, padding:0,}}>
               <Terms statedCard={true} sizeAvatar={20} setActiveMenu={true} showExpandableButton={false} actAsExpander={false} BackgroundColorTerm={"white"} renderAvatar={false} session={this.state.session}/>
             </Col>
           </Row>


         </CardText>
        </Card>
        </Col>
      </Row>

      <Row>
       <Col xs={5} md={5} style={{margin:'10px'}}>
       <Card id={"Crawling"} initiallyExpanded={true} >
        <CardHeader
          title="Crawling"
          actAsExpander={false}
          showExpandableButton={false}
          style={{fontWeight:'bold',}}
        />
        <CardText expandable={true} >
          <RaisedButton disabled={this.state.crawlerStart} onTouchTap={this.handleStartCrawler.bind(this)} style={{ height:20, marginTop: 15, minWidth:118, width:118}} labelStyle={{textTransform: "capitalize"}} buttonStyle={{height:19}}
          label="Start Crawler" labelPosition="before" containerElement="label" />
          {stopCrawlerButton}
        </CardText>
        </Card>
        </Col>

        <Col xs={6} md={6} style={{margin:'10px'}}>
        <Card id={"Model"} initiallyExpanded={true} >
         <CardHeader
           title="Model"
           actAsExpander={false}
           showExpandableButton={false}
           style={{fontWeight:'bold',}}
         />
         <CardText expandable={true} >
           <List>
            <Subheader>Details</Subheader>
            <ListItem>
            <p><span>Relevant:</span> 20 </p>
            <p><span>Irrelevant:</span> 20 </p>
            <p><span>Domain Model:</span> 20 </p>
            </ListItem>
            <Divider />
            <ScaleBar/>
            </List>



           <IconMenu
           iconButtonElement={<RaisedButton disabled={false} style={{height:20, marginTop: 15,minWidth:68, width:68}} labelStyle={{textTransform: "capitalize"}} buttonStyle={{height:19}}
           label="Export" labelPosition="before" containerElement="label" />} >
           <MenuItem value="1" primaryText="Create Model" />
           <MenuItem value="2" primaryText="Settings" />
           </IconMenu>
         </CardText>
         </Card>
        </Col>
       </Row>
        </div>
    );
  }
}

export default FocusedCrawling;
