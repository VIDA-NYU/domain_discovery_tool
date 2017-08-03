import React, { Component } from 'react';
import { Col, Row} from 'react-bootstrap';
// From https://github.com/oliviertassinari/react-swipeable-views
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import RemoveURL from 'material-ui/svg-icons/navigation/cancel';
import LoadExternalUrls from 'material-ui/svg-icons/file/file-upload';
import AddRecommendationUrls from 'material-ui/svg-icons/content/add-circle-outline';
import IconButton from 'material-ui/IconButton';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import $ from 'jquery';

import MultiselectTable from './MultiselectTable';

const PAGE_COUNT = 2000000

class DeepCrawling extends Component {

  constructor(props) {
    super(props);
      this.state = {
      disableStopCrawlerSignal:false,
      disableAcheInterfaceSignal:true,
      disabledStartCrawler:false, //false
      disabledCreateModel:true, //false
      messageCrawler:"",
      recommendations: [],
      minURLCount: 10,
      pages:{},
      openDialogLoadUrl: false,
      deepCrawlableDomains: [],
      deepCrawlableUrls: [],
      deepCrawlableDomainsFromTag: [],
      resetSelection: false,
      openLoadURLs: false,
      session:"",
      nameFile:"",
    };
    this.selectedRows = [];
    this.recommendationInterval = null;
    this.addDomainsForDeepCrawl = this.addDomainsForDeepCrawl.bind(this);
    this.addDomainsOnSelection = this.addDomainsOnSelection.bind(this);
    this.startDeepCrawler = this.startDeepCrawler.bind(this);
    this.stopDeepCrawler = this.stopDeepCrawler.bind(this);
    this.addUrlsWhileCrawling = this.addUrlsWhileCrawling.bind(this);

    this.changeMinURLCount = this.changeMinURLCount.bind(this);
    this.handleOpenDialogLoadUrl = this.handleOpenDialogLoadUrl.bind(this);

  }

  /**
  * Set the deepCrawlableDomainsFromTag state for displaying the current tlds in deep crawler tag.
  * @method componentWillMount
  * @param
  */
    componentWillMount(){
      var update_disabledStartCrawler = (this.props.updateCrawlerData)?true:false;
      this.setState({session:this.props.session, disabledStartCrawler:update_disabledStartCrawler,});
      //this.setState({session:this.props.session});
      this.forceUpdate();
      var session = this.props.session;
      session['newPageRetrievalCriteria'] = "one";
      session['pageRetrievalCriteria'] = "Tags";
      session['selected_tags']="Deep Crawl";
      session['pagesCap']=PAGE_COUNT;
      this.getPages(session);
      this.getRecommendations();
  }

 /**
  * Clear the getRecommendations interval when component is teared off the DOM
  * LifecycleHook: componentWillUnmount
  */
  componentWillUnmount() {
    clearInterval(this.recommendationInterval)
  }

 /**
  * POST XHR for fething recommendations and updating the state as response is fulfilled
  * @method getRecommendations
  */
    getRecommendations() {
  	$.post(
	    '/getRecommendations',
	    { session: JSON.stringify(this.props.session), minCount: this.state.minURLCount || 10},
	    (response) => {
		var recommendations = Object.keys(response || {})
                    .map(reco => [reco, response[reco]])
                    .sort((a, b) => {
			if(b[1]['score'] === undefined)
			    return (b[1]['count'] - a[1]['count']);
			else {
			    if(parseFloat(b[1]['score'].toFixed(3)) === parseFloat(a[1]['score'].toFixed(3)))
				return (b[1]['count'] - a[1]['count']);
			    else return (b[1]['score'] - a[1]['score']);
			};
		    });
    		this.setState({recommendations: recommendations})
  	    }
  	).fail((error) => {
  	    console.log('getRecommendations FAILED ', error);
  	});
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
        this.setState({deepCrawlableDomainsFromTag: urlsfromDeepCrawlTag,});
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
	var aux_deepCrawlableDomains = [];
	this.selectedRows.forEach((rowIndex) => {
	    if(this.state.deepCrawlableDomains.indexOf(this.state.recommendations[rowIndex][0]) === -1)
		aux_deepCrawlableDomains.push(this.state.recommendations[rowIndex][0]);
	});

	var session = this.props.session;
	session['newPageRetrievalCriteria'] = "one";
	session['pageRetrievalCriteria'] = "TLDs";
	session['selected_tlds']=aux_deepCrawlableDomains.join(",");
	session['pagesCap']=PAGE_COUNT;

	$.post(
	    '/getPages',
	    {'session': JSON.stringify(session)},
	    function(pages) {
		var urlsfromRecommendations = Object.keys(pages["data"]["results"]).map(result=>{return result;});
		this.setState({deepCrawlableUrls: urlsfromRecommendations.concat(this.state.deepCrawlableUrls)});
		this.forceUpdate();
	    }.bind(this)
	);


	this.setState({
	    deepCrawlableDomains: aux_deepCrawlableDomains.concat(this.state.deepCrawlableDomains),
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
    let aux_deepCrawlableUrls = this.state.deepCrawlableUrls;
    var aux_valueLoadUrls = (this.state.valueLoadUrls!==undefined)?this.state.valueLoadUrls:[];
    //Append urls from textField to this.state.valueLoadUrls
    var valueLoadUrlsFromTextField = (this.state.valueLoadUrlsFromTextField!==undefined)?((this.state.valueLoadUrlsFromTextField!=="")?this.state.valueLoadUrlsFromTextField.split(/\r\n|\n/):[]):[];

    valueLoadUrlsFromTextField.forEach((value) => {
      aux_valueLoadUrls.push(value);
    });
    //Append new urls to deepCrawlableUrls
    aux_valueLoadUrls.forEach((value) => {
      aux_deepCrawlableUrls.push(value);
    })
    this.setState({
      deepCrawlableUrls: aux_deepCrawlableUrls,
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
	if(this.state.deepCrawlableUrls.length > 0)
    	    this.setDeepcrawlTagtoPages(this.state.deepCrawlableUrls);

	this.startCrawler("deep", this.state.deepCrawlableDomainsFromTag.concat(this.state.deepCrawlableDomains));
    }

   startCrawler(type, seeds){
    var session = this.state.session;
    var message = "Running";
    this.setState({disableAcheInterfaceSignal:false, disableStopCrawlerSignal:false, disabledStartCrawler:true, messageCrawler:message});
    this.forceUpdate();
    $.post(
        '/startCrawler',
        {'session': JSON.stringify(session), "type": type, "seeds": seeds.join('|')},
        function(message) {
          var disableStopCrawlerFlag = false;
          var disableAcheInterfaceFlag = false;
          var disabledStartCrawlerFlag = true;
          if(message.toLowerCase() !== "running"){
            disableStopCrawlerFlag = true;
            disableAcheInterfaceFlag =true;
            disabledStartCrawlerFlag = true;
          }
          this.recommendationInterval = setInterval(this.getRecommendations.bind(this), 30000);
          this.setState({disableAcheInterfaceSignal: disableAcheInterfaceFlag, disableStopCrawlerSignal:disableStopCrawlerFlag, disabledStartCrawler:disabledStartCrawlerFlag, messageCrawler:message});
          this.forceUpdate();
        }.bind(this)
    ).fail((error) => {
      // Fail safe interval clearance in case the startCrawler errors out
      clearInterval(this.recommendationInterval);
      console.log('startCrawler', error)
    });;
  }

  stopDeepCrawler(event) {
    this.stopCrawler("deep");
  }

  stopCrawler(type){
  	var session = this.state.session;
  	var message = "Terminating";
  	this.setState({disableAcheInterfaceSignal:true, disableStopCrawlerSignal:true, disabledStartCrawler:true, messageCrawler:message,});
  	this.forceUpdate();
  	$.post(
	    '/stopCrawler',
	    {'session': JSON.stringify(session), "type": type},
	    function(message) {
        clearInterval(this.recommendationInterval);
    		this.setState({disableAcheInterfaceSignal:true, disableStopCrawlerSignal:true, disabledStartCrawler: false, messageCrawler:"",});
    		this.forceUpdate();
	    }.bind(this)
  	).fail((error) => {
  	   this.setState({disabledStartCrawler: false});
  	});
  }


  addUrlsWhileCrawling(event) {
	  if(this.state.deepCrawlableUrls.length > 0)
	    this.setDeepcrawlTagtoPages(this.state.deepCrawlableUrls);

	  this.addURLs();
  }

    addURLs() {
	$.post(
	    '/addUrls',
	    {
		"session": JSON.stringify(this.state.session),
		"seeds": this.state.deepCrawlableUrls.join("|")
	    },
	    (message) => {
		this.state.deepCrawlableUrls.forEach(url => {
		    if(this.state.deepCrawlableDomainsFromTag.indexOf(url) !== -1)
			this.state.deepCrawlableDomainsFromTag.push(url);
		});

		this.setState({
		    deepCrawlableDomainsFromTag: this.state.deepCrawlableDomainsFromTag,
		    deepCrawlableDomains: [],
		    deepCrawlableUrls: []
		});
	    }
	).fail((error) => {
	    console.log('addUrls failed', error);
	});
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
        "pages": urls.join('|'),
        "tag": 'Deep Crawl',
        "applyTagFlag": true,
        "session": JSON.stringify(this.state.session)
      },
      (message) => {
          urls.forEach(url => {
            this.state.deepCrawlableDomainsFromTag.push(url);
          });

          this.setState({
              deepCrawlableDomainsFromTag: this.state.deepCrawlableDomainsFromTag,
              deepCrawlableDomains: [],
	      deepCrawlableUrls: []
          });
      }
    ).fail((error) => {
  console.log('setPagesTag', error)
    });
  }

  /**
   * Set the minURLCount state variable and callback to getRecommendations
   * This is because setState will not run instantly, hence to prevent anomalies
   * getRecommendations is fired only after the new state is applied.
   * @method changeMinURLCount
   * @param {object} event
   */
  changeMinURLCount(event) {
    this.setState(
      { minURLCount: event.target.value }
    );
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
    const name = (event.target.files[0]!==undefined)?event.target.files[0].name:"";
    this.setState({nameFile:name});
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
    this.setState({openDialogLoadUrl: false, newNameTerm:"", nameFile:""});
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
      var urlsList = this.state.deepCrawlableUrls;
      var deepCrawlableUrls_aux =  urlsList.splice(index,1);
      this.setState({deepCrawlableUrls:urlsList});
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
          <Table id={"Annotated urls"} height={"255px"} selectable={false} multiSelectable={false} >
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

          <Table id={"Added urls to deep crawl"} style={{marginTop:"0px", }} height={"180px"} selectable={false} multiSelectable={false} >
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
            (this.state.deepCrawlableUrls).map((row, index) => (
              <TableRow key={index}>
              <TableRowColumn width={450} >{row}</TableRowColumn>
              <TableRowColumn width={90} style={{textAlign: 'right'}}>
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
        <Row>
          <Col xs={4} md={4} style={{marginLeft:'0px'}}>
            <RaisedButton
              label="Start Crawler"
              labelStyle={{textTransform: "capitalize", fontSize:14, fontWeight:"normal"}}
              backgroundColor={this.props.backgroundColor}
              //icon={<Search />}
              disable={this.state.disabledStartCrawler}
              style={
                      this.state.disabledStartCrawler ?
                      {pointerEvents: 'none', opacity: 0.5, height:35, marginTop: 0, margin: 12}
                      :
                      {pointerEvents: 'auto', opacity: 1.0, height:35, marginTop: 0, margin: 12}
                    }
              onClick={this.startDeepCrawler}
            />
          </Col>
          {
            this.state.disabledStartCrawler ?
            <Col xs={9} md={9} style={{marginLeft:'-70px'}}>
              <RaisedButton
                label="Add URLs"
                labelStyle={{textTransform: "capitalize", fontSize:14, fontWeight:"normal"}}
                backgroundColor={this.props.backgroundColor}
                //icon={<Search />}
                style={{height:35, marginTop: 0, margin: 12}}
                onClick={this.addUrlsWhileCrawling}
              />
              <RaisedButton
                label="Crawler Monitor"
                labelStyle={{textTransform: "capitalize", fontSize:14, fontWeight:"normal"}}
                backgroundColor={this.props.backgroundColor}
                //icon={<Search />}
                style={{height:35, marginTop: 0, margin: 12}}
                href={this.props.crawlerServers['deep']+"/monitoring"} target="_blank"
              />
              <RaisedButton
                label="Stop Crawler"
                labelStyle={{textTransform: "capitalize", fontSize:14, fontWeight:"normal"}}
                backgroundColor={this.props.backgroundColor}
                //icon={<Search />}
                style={{height:35, marginTop: 0, margin: 12}}
                onClick={this.stopDeepCrawler}
              />
              </Col>
            :
            null
          }
        </Row>
      </Col>

      <Col xs={6} md={6} style={{marginLeft:'0px'}}>
        <Card id={"Recommendations"} initiallyExpanded={true} >
         <CardHeader
           title="Recommendations"
           actAsExpander={false}
           showExpandableButton={false}
           style={{fontWeight:'bold', marginBottom:"-70px",}}
         />

         <CardText >
           <div style={{display: 'flex', float: 'right', marginBottom: '-10px'}}>
             <div style={{marginTop: '15px', marginRight: '19px'}}>
              Min URLs in Domain
             </div>
             <div>
               <TextField
                 ref={(element) => {this.minRecoInput = element;}}
                 type='number'
                 style={{width: "100px", marginBottom: "-70px", float: "right", padding: "0px"}}
                 value={this.state.minURLCount}
                 onChange={this.changeMinURLCount}
                 onKeyPress={(e) => {(e.key === 'Enter') ? this.getRecommendations(this) : null}}
                />
              </div>
            </div>
        </CardText>
         <CardText expandable={false} style={{marginTop:"0px",}}>
            <Divider style={{marginTop:20,}}/>
            <MultiselectTable
              rows={this.state.recommendations}
              columnHeadings={["DOMAIN", "SCORE, COUNT"]}
              onRowSelection={this.addDomainsOnSelection}
              resetSelection={this.state.resetSelection}
            />
            <RaisedButton
              label="Add to deep crawl"
              labelStyle={{textTransform: "capitalize", fontSize:14, fontWeight:"normal"}}
              backgroundColor={this.props.backgroundColor}
              icon={<AddRecommendationUrls />}
              style={{height:35, marginTop: 12}}
              onClick={this.addDomainsForDeepCrawl}
            />
          </CardText>
         </Card>

        <Card id={"Load external urls"} initiallyExpanded={true} >
         <CardHeader
           title={<RaisedButton
             label="Loading external urls"
             labelStyle={{textTransform: "capitalize", fontSize:14, fontWeight:"normal"}}
             backgroundColor={this.props.backgroundColor}
             icon={<LoadExternalUrls />}
             style={{height:35, marginTop: 8, marginBottom:"-8px"}}
             disabled={false}
             onClick={this.handleOpenDialogLoadUrl}
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
             <div>
               <FlatButton style={{ height:35, marginLeft:15, marginTop: 0}}
                 buttonStyle={{height:35}}
                 labelStyle={{textTransform: "capitalize", fontSize:14, color:"white", fontWeight:"normal"}}
                 backgroundColor="#26C6DA"
                 hoverColor="#80DEEA"
                 label="Choose URLs File"
                 labelPosition="before"
                 containerElement="label"
               >
                 <input type="file" id="csvFileInput" placeholder="Load queries from file" style={{marginTop:10, lineHeight: "1ex"}} onChange={this.handleFile.bind(this)} name='file' ref='file' accept=".txt" style={{display:"none",}}/>
               </FlatButton>
               <span style={{position:"absolute", margin:"7px 7px 7px 10px"}}>{this.state.nameFile}</span>
              </div>
           </Row>
         </Dialog>
         </CardText>
        </Card>
      </Col>
      </Row>
);
}
}

DeepCrawling.defaultProps = {
    backgroundColor:"#9A7BB0",
};

export default DeepCrawling;
