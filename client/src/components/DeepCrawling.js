import React, { Component } from 'react';
import { Col, Row} from 'react-bootstrap';
// From https://github.com/oliviertassinari/react-swipeable-views
import Terms from './Terms';
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

import MultiselectTable from './MultiselectTable';


class DeepCrawling extends Component {

  constructor(props) {
    super(props);
      this.state = {
      disableStopCrawlerSignal:false,
      disableAcheInterfaceSignal:true,
      disabledStartCrawler:false, //false
      disabledCreateModel:true, //false
      messageCrawler:"",
      recommendations: this.getRecommendationResults(),
      pages:{},
      openDialogLoadUrl: false,
      deepCrawlableDomains: [],
      deepCrawlableDomainsFromTag: [],
      resetSelection: false,
      openLoadURLs: false,
      session:"",
    };
    this.selectedRows = [];
    this.addDomainsForDeepCrawl = this.addDomainsForDeepCrawl.bind(this);
    this.addDomainsOnSelection = this.addDomainsOnSelection.bind(this);
  }
  /**
  * Set the deepCrawlableDomainsFromTag state for displaying the current tlds in deep crawler tag.
  * @method componentWillMount
  * @param
  */
  componentWillMount(){
      var session = this.props.session;
      session['newPageRetrievalCriteria'] = "one";
      session['pageRetrievalCriteria'] = "Tags";
      session['selected_tags']="Deep Crawl";
      this.getPages(session);
  }


    getRecommendationResults() {
      var recommendations = {
        'pajiba.com': 1,
        'pamageller.com': 6,
        'pandemic.internationalsos.com': 1,
        'papmiket.com': 1,
        'paper.wenweipo.com': 1,
        'papers.ssrn.com': 1,
        'parabarbarian.blogspot.com': 25,
        'parade.com': 15,
        'paraitesinblackandwhite.blogspot.com': 6,
        'parusfamilia.com': 10,
        'papers.ssrn.com': 1,
        'parabarbarian.blogspot.com': 25,
        'parade.com': 15,
        'parasitesinblackandwhite.blogspot.com': 6,
        'paratusfamilia.com': 10,
        'papers.ssrn.com': 1,
        'parabarbarian.blogspot.com': 25,
        'parade.com': 15,
        'parasitesinblackandwhite.com': 6,
        'paratufia.com': 10,
        'papes.ssrn.com': 1,
        'parabarbarian.blogspot.com': 25,
        'parade.com': 15,
        'parasitenblackandwhite.blogspot.com': 6,
        'paratusamilia.com': 10,
        'paratufia.': 10,
        'papes.ssrcom': 1,
        'parabarbariancom': 25,
        'com': 15,
        '.blogspot.com': 6,
        '.com': 10
      };

      return Object.keys(recommendations)
              .map(reco => [reco, recommendations[reco]])
              .sort((a, b) => ((a[1] > b[1]) ? -1 : ((a[1] < b[1]) ? 1 : 0)));
    }



  /**
  * Get the current tlds in deep crawler tag.
  * @method getCurrentTLDSfromDeepCrawlTag
  * @param
  */
  getCurrentUrlsfromDeepCrawlTag(pages){
    var urlsList = {};
    var urlsList2 =  (Object.keys(pages).length>0)? Object.keys(pages)
                        .map((k, index)=>{ urlsList[k]="1"; }) : {};
    return Object.keys(urlsList)
              .map(reco => [reco, urlsList[reco]])
              .sort((a, b) => ((a[1] > b[1]) ? -1 : ((a[1] < b[1]) ? 1 : 0)));
  }

  //Returns dictionary from server in the format: {url1: {snippet, image_url, title, tags, retrieved}} (tags are a list, potentially empty)
  getPages(session){
    $.post(
      '/getPages',
      {'session': JSON.stringify(session)},
      function(pages) {
        var urlsfromDeepCrawlTag = this.getCurrentUrlsfromDeepCrawlTag(pages["data"]["results"]);
        this.setState({deepCrawlableDomainsFromTag: urlsfromDeepCrawlTag, session:session, pages:pages["data"]["results"], sessionString: JSON.stringify(session), lengthPages : Object.keys(pages['data']["results"]).length,  lengthTotalPages:pages['data']['total'], });
        this.forceUpdate();
      }.bind(this)
    );
  }

  /**
   * Set the state for displaying the selected list of deep crawlable urls
   * @method addDomainsOnSelection (onClick event)
   * @param {Object} event
   */
  addDomainsForDeepCrawl(event) {
    var aux_deepCrawlableDomains = this.state.deepCrawlableDomains;
      this.selectedRows.forEach((rowIndex) => {
    if(this.state.deepCrawlableDomains.indexOf(this.state.recommendations[rowIndex][0]) === -1) {
              var recommendation = this.state.recommendations[rowIndex][0];
        console.log("RECOMMENDATION");
        console.log(recommendation);
              aux_deepCrawlableDomains.push(recommendation);
    }
      })

    this.setState({
      deepCrawlableDomains: aux_deepCrawlableDomains,
      resetSelection: true
    });
  }

  /**
   * Assigns the selected rows of the table to deepCrawlableDomains key in state
   * @method addDomainsOnSelection (onRowSelection event)
   * @param {number[]} selectedRows
   */
  addDomainsOnSelection(selectedRows) {
    this.selectedRows = selectedRows;
  }

  /**
  * Add domain from file or textField (or both) to deep crawl.
  * @method addDomainsFromFileForDeepCrawl
  * @param {}
  */
  addDomainsFromFileForDeepCrawl() {
    let aux_deepCrawlableDomains = this.state.deepCrawlableDomains;
    var aux_valueLoadUrls = (this.state.valueLoadUrls!==undefined)?this.state.valueLoadUrls:[];
    //Append urls from textField to this.state.valueLoadUrls
    var valueLoadUrlsFromTextField = (this.state.valueLoadUrlsFromTextField!==undefined)?((this.state.valueLoadUrlsFromTextField!=="")?this.state.valueLoadUrlsFromTextField.split(/\r\n|\n/):[]):[];

    valueLoadUrlsFromTextField.forEach((value) => {
      aux_valueLoadUrls.push(value);
    });
    //Append new urls to deepCrawlableDomains
    aux_valueLoadUrls.forEach((value) => {
      aux_deepCrawlableDomains.push(value);
    })
    this.setState({
      deepCrawlableDomains: aux_deepCrawlableDomains,
      resetSelection: true,
      valueLoadUrls:[],
      valueLoadUrlsFromTextField:"",
    });
  }

  /**
   * Saves all the selected domains with Deep Crawl tag and STARTS the crawler
   * @method startCrawler (onClick event)
   * @param {Object} event
   */
  startDeepCrawler(event) {
      this.setDeepcrawlTagtoPages(
    this.state.deepCrawlableDomains
      );

      this.startCrawler("deep", this.state.deepCrawlableDomainsFromTag.concat(this.state.deepCrawlableDomains));
  }

    startCrawler(type, seeds){
     var session = this.state.session;
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
      var session = this.state.session;
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



  /**
   * Add "Deep Crawl" tag to the list of provided URLs
   * @method setDeepcrawlTagtoPages
   * @param {string[]} urls
   */
  setDeepcrawlTagtoPages(urls) {
    $.post(
      '/setPagesTag',
      {
        pages: urls.join('|'),
        tag: 'Deep Crawl',
        applyTagFlag: true,
        session: JSON.stringify(this.state.session)
      },
      (message) => {
          urls.forEach(url => {
              this.state.deepCrawlableDomainsFromTag.push(url);
          });

          this.setState({
              deepCrawlableDomainsFromTag: this.state.deepCrawlableDomainsFromTag,
              deepCrawlableDomains: []
          });
      }
    ).fail((error) => {
  console.log('setPagesTag', error)
    });
  }

  // Download the pages of uploaded urls from file
  runLoadUrlsFileQuery(txt) {
    var allTextLines = txt.split(/\r\n|\n/);
    this.setState({ valueLoadUrls: allTextLines, });//allTextLines.join(" ")});
  }
  //Reading file's content.
  handleFile(event) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = (upload) => {
      this.runLoadUrlsFileQuery(upload.target.result);
    };
    reader.readAsText(file);
  }

  //Handling open/close 'load url' Dialog
  handleOpenDialogLoadUrl = () => {
    this.setState({openDialogLoadUrl: true});
    //this.focusTextField();
  };
  handleCloseDialogLoadUrl  = () => {
    this.setState({openDialogLoadUrl: false, newNameTerm:"",});
    this.termsFromFile=[]; // Empting the terms from file.
  };

  //Handling value into 'load urls' textfield
  handleTextChangeLoadUrls(e){
    this.setState({ valueLoadUrlsFromTextField: e.target.value});
  }

  //Adding urls from file and the textField.
  addURLfromFileAndTextField(){
    this.addDomainsFromFileForDeepCrawl();
    this.handleCloseDialogLoadUrl();

  }



    //Removing selected url from the table to deepCrawlableDomains
    handleRemoveUrlFromList(url, index){
      //var total_deepCrawlableDomains = this.state.deepCrawlableDomainsFromTag.length;
      var urlsList = this.state.deepCrawlableDomains;
      var deepCrawlableDomains_aux =  urlsList.splice(index,1);
      this.setState({deepCrawlableDomains:urlsList});
      this.forceUpdate();
    }


  render() {

    const actionsLoadUrls = [
                        <FlatButton label="Cancel" primary={true} onTouchTap={this.handleCloseDialogLoadUrl.bind(this)}/>,
                        <FlatButton label="Add" style={{marginLeft:10}} primary={true} keyboardFocused={true} onTouchTap={this.addURLfromFileAndTextField.bind(this)}/>,
                            ];
    const heightTableStyle = { height: "10px", padding: "0px"};

    return (

  <Row>
  <Col xs={6} md={6} style={{marginLeft:'0px'}}>
  <Card>
   <CardHeader
     title="Domains for crawling"
     actAsExpander={false}
     showExpandableButton={false}
     style={{fontWeight:'bold', marginBottom:"-70px"}}
   />
   <CardText expandable={false} >
      <Table id={"Annotated urls"} height={"210px"} selectable={false} multiSelectable={false} >
      <TableHeader displaySelectAll={false} enableSelectAll={false} >
        <TableRow>
          <TableHeaderColumn >
          </TableHeaderColumn>
        </TableRow>
        <TableRow style={heightTableStyle}>
          <TableHeaderColumn colSpan="1" style={{textAlign: 'center'}}>
            Annotated urls
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody showRowHover={false} displayRowCheckbox={false} deselectOnClickaway={false} stripedRows={false}>
      {
        (this.state.deepCrawlableDomainsFromTag || []).map((row, index) => (
          <TableRow displayBorder={false} key={index} style={heightTableStyle}>
          <TableRowColumn style={heightTableStyle}>{row}</TableRowColumn>
          </TableRow>
        ))
      }
      </TableBody>
      </Table>

      <Table id={"Added urls to deep crawl"} height={"210px"} selectable={false} multiSelectable={false} >
      <TableHeader displaySelectAll={false} enableSelectAll={false} >
        <TableRow>
          <TableHeaderColumn >
          </TableHeaderColumn>
        </TableRow>
        <TableRow>
          <TableHeaderColumn colSpan="2" style={{textAlign: 'center'}}>
            Added urls to deep crawl
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false} deselectOnClickaway={false} showRowHover={true} stripedRows={false}>
      {
        (this.state.deepCrawlableDomains).map((row, index) => (
          <TableRow key={index}>
          <TableRowColumn>{row}</TableRowColumn>
          <TableRowColumn style={{textAlign: 'right'}}>
            <div>
              <IconButton onClick={this.handleRemoveUrlFromList.bind(this,row, index )} tooltip="Remove" touch={true} tooltipPosition="bottom-right" tooltipStyles={{marginTop:"-53px",marginLeft:"-73px", fontSize:11,}}>
                <RemoveURL />
              </IconButton>
            </div>
          </TableRowColumn>
          </TableRow>
        ))
      }
      </TableBody>
      </Table>
    </CardText>
  </Card>
  <RaisedButton
    label="Start Crawler"
    style={{margin: 12}}
onClick={this.startDeepCrawler.bind(this)}
  />
  </Col>

  <Col xs={6} md={6} style={{marginLeft:'0px'}}>
    <Card id={"Recommendations"} initiallyExpanded={true} >
     <CardHeader
       title="Recommendations"
       actAsExpander={false}
       showExpandableButton={false}
       style={{fontWeight:'bold', marginBottom:"-70px",}}
     />
     <CardText expandable={false} >
        <MultiselectTable
          rows={this.state.recommendations}
          columnHeadings={["DOMAIN", "COUNT"]}
          onRowSelection={this.addDomainsOnSelection}
          resetSelection={this.state.resetSelection}
        />
        <RaisedButton
          disabled={false}
          style={{ height:20, marginTop: 15}}
          labelStyle={{textTransform: "capitalize"}}
          buttonStyle={{height:19}}
          label="Add to deep crawl"
          onClick={this.addDomainsForDeepCrawl}
        />
      </CardText>
     </Card>

    <Card id={"Load external urls"} initiallyExpanded={true} >
     <CardHeader
       title={<RaisedButton
         disabled={false}
         style={{ height:20, marginTop: 15}}
         labelStyle={{textTransform: "capitalize", fontWeight:"bold", fontSize:14,}}
         buttonStyle={{height:19}}
         label="Loading external urls"
         onClick={this.handleOpenDialogLoadUrl.bind(this)}
         />}
       actAsExpander={false}
       showExpandableButton={false}
       style={{fontWeight:'bold',}}
     />
     <CardText expandable={true} >
     <Dialog title="Adding urls" actions={actionsLoadUrls} modal={false} open={this.state.openDialogLoadUrl} onRequestClose={this.handleCloseDialogLoadUrl.bind(this)}>
       <Row>
       <Col xs={10} md={10} style={{marginLeft:'0px'}}>
         <TextField style={{height:200, width:'260px', fontSize: 12, marginRight:'-80px', marginTop:5, border:'solid',  Color: 'gray', borderWidth: 1, background:"white", borderRadius:"5px"}}
           onChange={this.handleTextChangeLoadUrls.bind(this)}
           floatingLabelText="Write urls (one by line)."
           hintStyle={{ marginLeft:30}}
           textareaStyle={{marginTop:30,}}
           inputStyle={{ height:180, marginBottom:10, marginLeft:10, paddingRight:20}}
           multiLine={true}
           rows={6}
           rowsMax={6}
           floatingLabelStyle={{marginLeft:10, marginRight:30,}}
           underlineStyle={{width:210, marginLeft:30, marginRight:30,}}
         />
       </Col>
       </Row>
       <Row>
         <br />
         <FlatButton style={{marginLeft:'15px'}}
           label="Choose URLs File"
           labelPosition="before"
           containerElement="label"
           labelStyle={{textTransform: "capitalize"}}>
           <input type="file" id="csvFileInput" onChange={this.handleFile.bind(this)} name='file' ref='file' accept=".txt"/>
         </FlatButton>
       </Row>
     </Dialog>
     </CardText>
    </Card>
  </Col>
  </Row>
);
}
}

export default DeepCrawling;
