import React, { Component } from 'react';
import { Col, Row} from 'react-bootstrap';
// From https://github.com/oliviertassinari/react-swipeable-views
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

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10,
  },
  content: {
    marginTop: '5px',
    marginRight: '5px',
    marginBottom: '8px',
    marginLeft: '5px',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px 10px 10px 10px',
  },
};

class CrawlingView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
      recommendations: this.getRecommendationResults(),
      pages:{},
      openDialogLoadUrl: false,
    };
    this.addDomainsForDeepCrawl = this.addDomainsForDeepCrawl.bind(this);
    this.addDomainsOnSelection = this.addDomainsOnSelection.bind(this);
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

  /**
  * Creating session to get the urls with deep crawl tag.
  * @method createSession
  * @param {string} domainId
  */
  /*consultaQueries: {"search_engine":"GOOG","activeProjectionAlg":"Group by Correlation"
  ,"domainId":"AVWjx7ciIf40cqEj1ACn","pagesCap":"100","fromDate":null,"toDate":null,
  "filter":null,"pageRetrievalCriteria":"Most Recent","selected_morelike":"",
  "model":{"positive":"Relevant","nagative":"Irrelevant"}}*/
  createSession(domainId){
    var session = {};
    session['search_engine'] = "GOOG";
    session['activeProjectionAlg'] = "Group by Correlation";
    session['domainId'] = domainId;
    session['pagesCap'] = "100";
    session['fromDate'] = null;
    session['toDate'] = null;
    session['filter'] = null; //null
    session['newPageRetrievalCriteria'] = "one";
    session['pageRetrievalCriteria'] = "Tags";
    session['selected_morelike'] = "";
    session['selected_queries']="";
    session['selected_tlds']="";
    session['selected_aterms']="";
    session['selected_tags']="Deep Crawl";
    session['selected_model_tags']="";
    session['selected_crawled_tags']="";
    session['model'] = {};
    session['model']['positive'] = "Relevant";
    session['model']['nagative'] = "Irrelevant";
    session["from"]=0;
    return session;
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
  * Set the deepCrawlableDomainsFromTag state for displaying the current tlds in deep crawler tag.
  * @method componentWillMount
  * @param
  */
  componentWillMount(){
    var session = this.createSession(this.props.domainId);
    this.getPages(session);
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
      "valueLoadUrls":"",
    });
  };

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
  * Set the state for displaying the selected list of deep crawlable urls
  * @method addDomainsOnSelection (onClick event)
  * @param {Object} event
  */
  addDomainsForDeepCrawl(event) {
    this.setState({
      deepCrawlableDomains: this.state.deepCrawlableDomains
    });
  }

  /**
  * Assigns the selected rows of the table to deepCrawlableDomains key in state
  * @method addDomainsOnSelection (onRowSelection event)
  * @param {number[]} selectedRows
  */
  addDomainsOnSelection(selectedRows) {
    this.state.deepCrawlableDomains = this.state.recommendations
                                        .filter((reco, index) => selectedRows.indexOf(index) !== -1);
  }

  // Download the pages of uploaded urls from file
  runLoadUrlsFileQuery(txt) {
    var allTextLines = txt.split(/\r\n|\n/);
    this.setState({ "valueLoadUrls": allTextLines.join(" ")});
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

  loadFromFile = () => {
    this.fromFile = true;
    //this.handleOpenLoadURLs();
  }
  handleCloseLoadURLs = () => {
    console.log("");
    //this.setState({openLoadURLs: false,});
  };

  //Handling open/close load url Dialog
  handleOpenDialogLoadUrl = () => {
    this.setState({openDialogLoadUrl: true});
    this.focusTextField();
  };
  handleCloseDialogLoadUrl  = () => {
    this.setState({openDialogLoadUrl: false, newNameTerm:"",});
    this.termsFromFile=[]; // Empting the terms from file.
  };

  randomFunction(){
    console.log("");
  }

  //Removing selected url from the table to deepCrawlableDomains
  handleRemodeUrlFromList(url, index){
    //var total_deepCrawlableDomains = this.state.deepCrawlableDomainsFromTag.length;
    var urlsList = this.state.deepCrawlableDomains;
    console.log(urlsList);
    var deepCrawlableDomains_aux =  urlsList.splice(index,1);
    console.log(urlsList);
    this.setState({deepCrawlableDomains:urlsList});
    this.forceUpdate();
  }

  //Handling value into loadUrls textfield
  handleTextChangeLoadUrls(e){
    this.setState({ "valueLoadUrls": e.target.value});
  }

  render() {
    const actionsLoadURLs = [
                              <FlatButton label="Cancel" primary={true} onTouchTap={this.randomFunction}/>,
                              <FlatButton label="Relevant" style={{marginLeft:10}} primary={true} keyboardFocused={true} onTouchTap={this.randomFunction.bind(this)}/>,
                              <FlatButton label="Irrelevant" primary={true} keyboardFocused={true} onTouchTap={this.randomFunction.bind(this)}/>,
                              <FlatButton label="Neutral" style={{marginLeft:10}} primary={true} keyboardFocused={true} onTouchTap={this.randomFunction.bind(this)}/>,
                            ];

    let show_choose_file = (this.fromFile || this.fromFile === undefined)? <Row style={{marginTop:30}}> <p style={{fontSize:12, marginLeft:10}}>"Upload URLs from file"</p> <br />
                            <FlatButton style={{marginLeft:'15px'}}
                            label="Choose URLs File"
                            labelPosition="before"
                            containerElement="label">
                            <input type="file" id="csvFileInput" onChange={this.handleFile.bind(this)} name='file' ref='file' accept=".txt"/>
                            </FlatButton>
                            </Row>
                            :<div/>;
    const actionsLoadUrls = [
                        <FlatButton label="Cancel" primary={true} onTouchTap={this.handleCloseDialogLoadUrl.bind(this)}/>,
                        <FlatButton label="Add" style={{marginLeft:10}} primary={true} keyboardFocused={true} onTouchTap={this.randomFunction.bind(this)}/>,
                            ];
    const heightTableStyle = { height: "10px", padding: "0px"};

    return (
      <div style={styles.content}>
        <Tabs
        onChange={this.handleChange}
        value={this.state.slideIndex}
        inkBarStyle={{background: '#7940A0' ,height: '4px'}}
        tabItemContainerStyle={{background:'#9A7BB0', height: '40px'}}>
        >
        <Tab label="Deep crawling" value={0} />
        <Tab label="Focused crawling " value={1} />
        </Tabs>
        <SwipeableViews
        index={this.state.slideIndex}
        onChangeIndex={this.handleChange}
        >
        <div id={"deep-crawling"} style={styles.slide}>
          <Row>

          <Col xs={6} md={6} style={{marginLeft:'0px'}}>

          <Card
          >
         <CardHeader
           title="Domains for crawling"
           actAsExpander={false}
           showExpandableButton={false}
           style={{fontWeight:'bold', marginBottom:"-70px"}}
         />

          <CardText expandable={false} >

          <Table height={"210px"} selectable={false} multiSelectable={false} >
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
          <TableBody  showRowHover={false} displayRowCheckbox={false} deselectOnClickaway={false} stripedRows={false}>
          {
            (this.state.deepCrawlableDomainsFromTag || []).map((row, index) => (
              <TableRow displayBorder={false} key={index} style={heightTableStyle}>
              <TableRowColumn style={heightTableStyle}>{row[0]}</TableRowColumn>
              </TableRow>
            ))
          }
          </TableBody>
          </Table>

          <Table height={"210px"} selectable={false} multiSelectable={false} >
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
            (this.state.deepCrawlableDomains || []).map((row, index) => (
              <TableRow key={index}>
              <TableRowColumn>{row[0]}</TableRowColumn>
              <TableRowColumn style={{textAlign: 'right'}}>
                <div>
                  <IconButton onClick={this.handleRemodeUrlFromList.bind(this,row[0], index )} tooltip="Remove" touch={true} tooltipPosition="bottom-right" tooltipStyles={{marginTop:"-53px",marginLeft:"-73px", fontSize:11,}}>
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

          <RaisedButton label="Start Crawler" style={{margin: 12,}} />
          </Col>
          <Col xs={6} md={6} style={{marginLeft:'0px'}}>

        <Card initiallyExpanded={true} >
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

        <Card initiallyExpanded={true} >
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
         hintStyle={{ marginLeft:10}}
         textareaStyle={{margin:0,}}
         inputStyle={{ height:180, marginBottom:10, marginLeft:10, paddingRight:20}}
         multiLine={true}
         rows={6}
         rowsMax={6}
         floatingLabelStylex={{marginLeft:30, marginRight:30,}}
         underlineStyle={{marginLeft:30, marginRight:30,}}
         />
         </Col>
         </Row>

         <Row>
         <br />
         <RaisedButton
         disabled={false}
         style={{ height:20, marginTop: 15}}
         labelStyle={{textTransform: "capitalize"}}
         buttonStyle={{height:19}}
         label="Load urls from file"
         onClick={this.loadFromFile.bind(this)}
         />
         <br />
         <Dialog  title={"Upload URLs"} actions={actionsLoadURLs} modal={false} open={this.state.openLoadURLs} onRequestClose={this.handleCloseLoadURLs.bind(this)}>
         {show_choose_file}
         <br />
         </Dialog>
         </Row>
         </Dialog>

         </CardText>
         </Card>

          </Col>
          </Row>
        </div>

        <div id="focused-crawling" style={styles.slide}>
          focused crawling
          <br />
          <RaisedButton disabled={false} style={{ height:20, marginTop: 15, minWidth:118, width:118}} labelStyle={{textTransform: "capitalize"}} buttonStyle={{height:19}}
          label="Start Crawler" labelPosition="before" containerElement="label" />
          <br />
          <IconMenu
          iconButtonElement={<RaisedButton disabled={false} style={{height:20, marginTop: 15,minWidth:68, width:68}} labelStyle={{textTransform: "capitalize"}} buttonStyle={{height:19}}
          label="Model" labelPosition="before" containerElement="label" />} >
          <MenuItem value="1" primaryText="Create Model" />
          <MenuItem value="2" primaryText="Settings" />
          </IconMenu>
        </div>

        </SwipeableViews>
      </div>
    );
  }
}

export default CrawlingView;
