import React, { Component } from 'react';
import { Col, Row} from 'react-bootstrap';
// From https://github.com/oliviertassinari/react-swipeable-views
import Terms from './Terms';
import ScaleBar from './ScaleBar';
import { InputGroup, FormControl , DropdownButton} from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Save from 'material-ui/svg-icons/content/save';
import Cancel from 'material-ui/svg-icons/action/highlight-off';
import Export from 'material-ui/svg-icons/file/file-download';
import Monitoring from './Monitoring.js';
import Dialog from 'material-ui/Dialog';
import {scaleLinear} from 'd3-scale';
import {range} from 'd3-array';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
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

class CircularProgressSimple extends React.Component{
  render(){
    return(
    <div style={{borderColor:"green", marginLeft:"50%"}}>
      <CircularProgress size={30} thickness={7} />
    </div>
  );}
}

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
      loadTerms:false,
      disableStopCrawlerSignal:true,
      disableAcheInterfaceSignal:true,
      disabledCreateModel:false, //false
      disabledStartCrawler:false, //false
      messageCrawler:"",
      open:false,
      openDialog:false,
      anchorEl:undefined,
      termsList: [],
      accuracyOnlineLearning:0,
      loadingModel:false,
      createModelMessage:"",
      openMessageModelResult:false,
      openDialogStatusCrawler:false,
      messageErrorCrawler:'',
    };
    this.handleCloseDialogStatusCrawler = this.handleCloseDialogStatusCrawler.bind(this);

  }



  /**
  * Set
  * @method componentWillMount
  * @param
  */
  componentWillMount(){
      var update_disabledStartCrawler = (this.props.updateCrawlerData)?true:false;
      this.setState({session:this.props.session, disabledStartCrawler:update_disabledStartCrawler,});
      this.forceUpdate();
      var temp_session = this.props.session;
      this.getAvailableTags(this.props.session);
      this.getModelTags(this.props.domainId);


  }
  componentWillReceiveProps  = (newProps, nextState) => {

  }

  setSelectedPosTags(selectedPosTags){

  }

  loadingTerms(session, selectedPosTags){

      var temp_session = session;
      temp_session['newPageRetrievalCriteria'] = "one";
      temp_session['pageRetrievalCriteria'] = "Tags";
      temp_session['selected_tags']=this.state.selectedPosTags.join(',');
      this.setState({session: temp_session, selectedPosTags: selectedPosTags, loadTerms:true});
      this.forceUpdate();
  }

  updateTerms(terms){
      this.setState({termsList: terms});
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
	    var session = this.props.session;
	    session['model']['positive'] = [];
	    session['model']['negative'] = [];
            if(Object.keys(tags).length > 0){
		session['model']['positive'] = tags['positive'].slice();
		session['model']['negative'] = tags['negative'].slice();

		//setting session info for generating terms.
		session['newPageRetrievalCriteria'] = "one";
		session['pageRetrievalCriteria'] = "Tags";
		session['selected_tags']=(tags['positive'].slice()).join(',');
    this.updateClassifierCrawler(session);
		this.setState({session: session, selectedPosTags: tags['positive'].slice(), selectedNegTags: tags['negative'].slice(), loadTerms:true});
		this.forceUpdate();

            }
            else {if(!(session['model']['positive'].length>0)){
		this.setState({loadTerms:false,});
		this.forceUpdate();
            }}

	}.bind(this)
    );
  }

  saveInitialModel() {
    var session = this.props.session;
    session['model']['positive'] = this.state.selectedPosTags.slice();
    session['model']['negative'] = this.state.selectedNegTags.slice();
    //this.setState({session: session, selectedPosTags: this.state.selectedPosTags.slice(),});
    if(session['model']['positive'].length>0 ){
      this.loadingTerms(session, this.state.selectedPosTags);
      this.updateClassifierCrawler(session);
        $.post(
          '/saveModelTags',
          {'session': JSON.stringify(session)},
          function(update){
            //this.forceUpdate();
          }.bind(this)
        );
    }
  }

  handleSaveTags() {
    var session = this.props.session;
    session['model']['positive'] = this.state.selectedPosTags.slice();
    session['model']['negative'] = this.state.selectedNegTags.slice();
    //this.setState({session: session, selectedPosTags: this.state.selectedPosTags.slice(),});
    if(session['model']['positive'].length>0 ){
      this.loadingTerms(session, this.state.selectedPosTags);
    }
    else{
      this.setState({openDialog:true, loadTerms:false});
    }
    this.updateClassifierCrawler(session);


      $.post(
        '/saveModelTags',
        {'session': JSON.stringify(session)},
        function(update){
          //this.forceUpdate();
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


  startFocusedCrawler =()=>{
    this.saveInitialModel();
    this.startCrawler("focused");
    this.forceUpdate();
  }

  startCrawler(type){
    var session = JSON.parse(JSON.stringify(this.state.session));
    var message = "Running";
    this.setState({disableAcheInterfaceSignal:false, disableStopCrawlerSignal:false, disabledStartCrawler:true, messageCrawler:message});
    this.forceUpdate();

    var terms = [];
    var pos_terms = [];
    terms = pos_terms = this.state.termsList.map((term)=>{
      if(term['tags'].indexOf('Positive') !== -1)
      return term['word'];
    }).filter((term)=>{return term !== undefined});

    if(pos_terms.length === 0){
      terms = this.state.termsList.map((term)=>{
        return term['word']
      });
    }

    $.post(
      '/startCrawler',
      {'session': JSON.stringify(session),'type': type, 'terms': this.state.termsList.join('|')},
      function(message) {
        var disableStopCrawlerFlag = false;
        var disableAcheInterfaceFlag = false;
        var disabledStartCrawlerFlag = true;
        var crawlerIsNotRunningFlag = false;
        var messageErrorCrawlerTemp = '';
        if(message.toLowerCase() === "no regex domain model available" || message.toLowerCase()=== "no page classifier or regex domain model available" || message.toLowerCase()==="no domain model available" || message.toLowerCase()=== "failed to connect to server. server may not be running" || message.toLowerCase()=== "failed to run crawler"){
          disableStopCrawlerFlag = true;
          disableAcheInterfaceFlag =true;
          disabledStartCrawlerFlag = false;
          crawlerIsNotRunningFlag = true;
          messageErrorCrawlerTemp = message;
        }

        this.setState({ disableAcheInterfaceSignal: disableAcheInterfaceFlag, disableStopCrawlerSignal:disableStopCrawlerFlag, disabledStartCrawler:disabledStartCrawlerFlag, messageCrawler:message, openDialogStatusCrawler:crawlerIsNotRunningFlag,  messageErrorCrawler:messageErrorCrawlerTemp});
        this.forceUpdate();
      }.bind(this)
    );
  }

   stopFocusedCrawler(event) {
     this.stopCrawler("focused");
   }


   stopCrawler(type){
     var session = this.props.session;
     var message = "Terminating";
     this.setState({disableAcheInterfaceSignal:true, disableStopCrawlerSignal:true, disabledStartCrawler:true, messageCrawler:message,});
     this.forceUpdate();
     $.post(
       '/stopCrawler',
       {'session': JSON.stringify(session), 'type' : type  },
	 function(message) {
           this.setState({disableAcheInterfaceSignal:true, disableStopCrawlerSignal:true, disabledStartCrawler: false, messageCrawler:"",});
         this.forceUpdate();
       }.bind(this)
   ).fail((error) => {
      this.setState({disabledStartCrawler: false});
   });
   }
   handleRequestClosePopOver(){
     this.setState({open:false});
   }
   handleExport(event){
     this.setState({open:true,anchorEl:event.currentTarget})
   }
   handleOpenMenu = () => {
    this.setState({
      openMenu: true,
    });
  }
  handlecloseDialog(){
    this.setState({openDialog:false});
    this.forceUpdate();
  }
  //Handling open/close 'status crawler' Dialog
  handleCloseDialogStatusCrawler  = () => {
    this.setState({openDialogStatusCrawler: false, });
  };
  handleOnRequestChange = (value) => {
    this.setState({
      openMenu: value,
    });
  }

  ////////////////////
  ///Create a model////
  ////////////////////
  getCreatedModel(session){
    this.setState({loadingModel:true, disabledCreateModel:true, createModelMessage:"",})
    $.post(
       '/createModel',
       {'session': JSON.stringify(session)},
       function(model_file) {
         var url = model_file;
         var message = (url.indexOf("_model.zip")==-1)?"Model was not created.":"Model created successfully.";

         this.setState({modelDownloadURL: model_file, loadingModel:false, disabledCreateModel:false, createModelMessage:message, openMessageModelResult:true})
         this.forceUpdate();
       }.bind(this)
     );
  }

  exportModel(){
    this.getCreatedModel(this.state.session);
  }

  downloadExportedModel = (event) => {
    if((this.state.modelDownloadURL || "").indexOf("_model.zip") !== -1)
      window.open(this.state.modelDownloadURL, 'download')
  }

  handleCloseModelResult = () => {
    this.setState({openMessageModelResult: false});
  };
  ////////////////////

  //////////////////////
  /////////////////////
  updateClassifierCrawler(sessionTemp){
    $.post(
      '/updateClassifierCrawler',
      {'session':  JSON.stringify(sessionTemp)},
      function(accuracy) {
          this.setState({accuracyOnlineLearning:accuracy,});
          this.forceUpdate();
    }.bind(this)
    );
  }
///////////////////////
//////////////////////
  render() {
    var total_selectedPosTags=0;
    var total_selectedNegTags=0;
    var ratioPosNeg =0;
    var ratioAccuracy=0;
    var checkedTagsPosNeg = (this.state.currentTags!==undefined) ?
                          <Row style={{height:330, overflowY: "scroll", }}>
                          <Col xs={6} md={6} style={{marginTop:'2px'}}>
                          Positive
                          {Object.keys(this.state.currentTags).map((tag, index)=>{
                            var labelTags=  tag+" (" +this.state.currentTags[tag]+")";
                            var checkedTag=false;
                            var tags = this.state.selectedPosTags;
                            if(tags.includes(tag)){
                                checkedTag=true;
                                total_selectedPosTags=total_selectedPosTags +this.state.currentTags[tag];
                            }
                            return <Checkbox label={labelTags} checked={checkedTag}  onClick={this.addPosTags.bind(this,tag)} />
                          })}
                          </Col>
                          <Col xs={6} md={6} style={{marginTop:'2px'}}>
                          Negative
                            {Object.keys(this.state.currentTags).map((tag, index)=>{
                              var labelTags=  tag+" (" +this.state.currentTags[tag]+")";
                              var checkedTag=false;
                              var tags = this.state.selectedNegTags;
                              if(tags.includes(tag)){
                                checkedTag=true;
                                total_selectedNegTags=total_selectedNegTags+this.state.currentTags[tag];
                              }
                              return <Checkbox label={labelTags} checked={checkedTag}  onClick={this.addNegTags.bind(this,tag)} />
                              })}
                          </Col>
                        </Row>:<div />;

    ratioPosNeg = (total_selectedPosTags>total_selectedNegTags)?total_selectedNegTags/total_selectedPosTags:total_selectedPosTags/total_selectedNegTags;
    ratioAccuracy = ratioPosNeg*this.state.accuracyOnlineLearning;
    var barScale = scaleLinear().range([0, 240]);
	  barScale.domain([0, 100]);
    var aux_ratioAccuracy = barScale(ratioAccuracy);
    var DialogBox= <RaisedButton disabled={false} onTouchTap={this.handlecloseDialog.bind(this)} style={{ height:20, marginTop: 15, marginRight:10, minWidth:118, width:118}} labelStyle={{textTransform: "capitalize"}} buttonStyle={{height:19}}
      label="Close" labelPosition="before" containerElement="label" />;
    var renderTerms = (this.state.loadTerms)?<Terms statedCard={true} sizeAvatar={20} showExpandableButton={false} actAsExpander={false}
                                                    BackgroundColorTerm={"white"} renderAvatar={false} session={this.state.session}
                                                    focusedCrawlDomains={this.state.loadTerms} fromCrawling={true} updateTerms={this.updateTerms.bind(this)}/>
                                                    :<div></div>;
    var openMessage = (this.props.slideIndex && this.state.openDialog)?true:false;
    var loadingModel_signal = (this.state.disabledCreateModel)?<CircularProgressSimple style={{marginTop:"5px", marginLeft:"-30px"}} size={20} thickness={4} />:<div />;

    const actionsModelResult = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.handleCloseModelResult.bind(this)}
      />,
    ];
    const actionsStatusCrawler = [
      <FlatButton label="Close" primary={true} onTouchTap={this.handleCloseDialogStatusCrawler.bind(this)}/>,  ];

    return (
      <div>
      <Row>
        <Col xs={11} md={11} style={{margin:'10px'}}>
        <Card id={"Settings"} initiallyExpanded={true} style={{paddingBottom:0,}} containerStyle={{paddingBottom:0,}} >
         <CardHeader
           title="Model Settings"
           actAsExpander={false}
           showExpandableButton={false}
           style={{fontWeight:'bold', padding:'10px 1px 10px 6px', borderRadius: '0px 0px 0px 0px',}}
         />
         <CardText expandable={true} style={{padding:'1px 16px 0px 16px',}}>
           <Row>
             <Col xs={7} md={7} style={{margin:0, padding:0,}}>
               <Card id={"Tags"} initiallyExpanded={true} style={styles.card}>
                <CardHeader
                  title="Select postive and negative examples."
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
                    <RaisedButton
                      disabled={false}
                      label="Save"
                      labelStyle={{textTransform: "capitalize", fontSize:14, fontWeight:"normal"}}
                      backgroundColor={this.props.backgroundColor}
                      icon={<Save />}
                      //buttonStyle={{height:19}}
                      style={{height:35, marginTop: 8, marginBottom:"-8px", marginRight:10}}
                      disabled={false}
                      onTouchTap={this.handleSaveTags.bind(this)}
                    />
                    <RaisedButton
                      disabled={false}
                      label="Cancel"
                      labelStyle={{textTransform: "capitalize", fontSize:14, fontWeight:"normal"}}
                      backgroundColor={this.props.backgroundColor}
                      icon={<Cancel />}
                      //buttonStyle={{height:19}}
                      style={{height:35, marginTop: 8, marginBottom:"-8px"}}
                      disabled={false}
                      onTouchTap={this.handleCancelTags.bind(this)}
                    />
                  </Row>
                  <Dialog title="Select positive tags to extract terms." open={openMessage}>
                  {DialogBox}</Dialog>
                </CardText>
                </Card>
             </Col>
             <Col xs={5} md={5} style={{margin:0, padding:0,}}>
             {renderTerms}
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
          title="CRAWLING"
          actAsExpander={false}
          showExpandableButton={false}
          style={{fontWeight:'bold',}}
        />
        <CardText expandable={true} style={{height:212}}>
          <Row>
            <Col xs={5} md={5} style={{marginLeft:'0px'}}>
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
                onClick={this.startFocusedCrawler}
              />
            </Col>
            {
              this.state.disabledStartCrawler ?
              <Col xs={7} md={7} style={{marginLeft:'-70px'}}>
                <RaisedButton
                  label="Crawler Monitor"
                  labelStyle={{textTransform: "capitalize", fontSize:14, fontWeight:"normal"}}
                  backgroundColor={this.props.backgroundColor}
                  style={{height:35, marginTop: 0, margin: 12}}
                  href={this.props.crawlerServers['focused']+"/monitoring"} target="_blank"
                />
                <RaisedButton
                  label="Stop Crawler"
                  labelStyle={{textTransform: "capitalize", fontSize:14, fontWeight:"normal"}}
                  backgroundColor={this.props.backgroundColor}
                  style={{height:35, marginTop: 0, margin: 12}}
                  onClick={this.stopFocusedCrawler.bind(this)}
                />
                </Col>
              :
              null
            }
          </Row>
        </CardText>
        </Card>
        </Col>

        <Col xs={6} md={6} style={{margin:'10px', marginLeft:"-10px",}}>
        <Card id={"Model"} initiallyExpanded={true} >
         <CardHeader
           title="Model"
           actAsExpander={false}
           showExpandableButton={false}
           style={{fontWeight:'bold'}}
         />
         <CardText expandable={true} style={{marginTop:"-12px", paddingTop:0, marginBottom:18,}}>
            <p><span style={{marginRight:10,}}>Total Positive: </span>{total_selectedPosTags} </p>
            <p><span style={{marginRight:10,}}>Total Negative: </span>{total_selectedNegTags} </p>
            <p><span>Domain Model (Accuracy): </span> {this.state.accuracyOnlineLearning} %</p>
            <Divider />
            <div style={{marginLeft:10, marginTop:0, marginBottom:"-25px"}}>
              <ScaleBar ratioAccuracy={aux_ratioAccuracy}/>
            </div>
            <div style={{marginTop:"-20px", }}>
            <RaisedButton
              disabled={this.state.disabledCreateModel}
              label="Export"
              labelStyle={{textTransform: "capitalize", fontSize:14, fontWeight:"normal"}}
              backgroundColor={this.props.backgroundColor}
              icon={<Export />}
              style={{height:35, marginTop: 0, margin: 12}}
              onClick={this.exportModel.bind(this)}
            />
            <div style={{marginTop:"-40px", marginLeft:"-180px"}}>
            {loadingModel_signal}
            </div>
            <Dialog
              actions={actionsModelResult}
              modal={false}
              open={this.state.openMessageModelResult}
              onRequestClose={this.handleCloseModelResult.bind(this)}
            >
              {this.state.createModelMessage}
              <RaisedButton
                label="Download"
                style={{margin: 5}}
                labelStyle={{textTransform: "capitalize"}}
                onClick={this.downloadExportedModel}
              />
            </Dialog>
            <Dialog title="Status Focused Crawler" actions={actionsStatusCrawler} modal={true} open={this.state.openDialogStatusCrawler} onRequestClose={this.handleCloseDialogStatusCrawler.bind(this)}>
                {this.state.messageErrorCrawler}
            </Dialog>
            </div>
         </CardText>
         </Card>
        </Col>
       </Row>
        </div>
    );
  }
}


FocusedCrawling.defaultProps = {
    backgroundColor:"#9A7BB0",
};

export default FocusedCrawling;
