// Filename:		SearchTabs.js
// Purpose:		Searches by web query, load urls and seedfinder .
// Author: Sonia Castelo (scastelo2@gmail.com)
import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import { InputGroup, FormControl , DropdownButton,  MenuItem} from 'react-bootstrap';
import { Col, Row} from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';
import {fullWhite} from 'material-ui/styles/colors';
import Search from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import Select from 'react-select';
import $ from 'jquery';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
  },
  slide: {
    padding: '10px 0px 0px 0px',
    height: '200px',
  },
  tab:{
    fontSize: '12px',
    marginTop:'-5px',
  },
};

class SearchTabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
      dataSource: [],
      "search_engine":"GOOG",
      "valueQuery":"",
	"valueLoadUrls":"",
	flat:true,
	openLoadURLs: false,

    };
      uploadTag: "Neutral";
      fromFile: false;
      this.availableTags=[];

  }

    //Handling changes in SearchTabs
    handleChange = (value) => {
      this.setState({  slideIndex: value,  });
    };

    getAvailableTags(){
      $.post(
    	  '/getAvailableTags',
    	  {'session': JSON.stringify(this.props.session), 'event': 'Tags'},
    	  function(tagsDomain) {
    	      var selected_tags = [];
    	      if(this.props.session['selected_tags'] !== undefined && this.props.session['selected_tags'] !== ""){
    		        selected_tags = this.props.session['selected_tags'].split(",");
    	      }
            this.availableTags = Object.keys(tagsDomain['tags'] || {})
                                 .filter(tag => ["Neutral", "Irrelevant", "Relevant"].indexOf(tag) === -1)
                                 .map(tag => { return {value: tag, label: tag}; });

    	  }.bind(this)
      );
    }
    componentWillMount(){
      this.getAvailableTags();
    }
  resetAllFilters(session){
    session['newPageRetrievalCriteria'] = "one";
    session['pageRetrievalCriteria'] = "Queries";
    session['selected_morelike'] = "";
    session['selected_queries']="";
    session['selected_tlds']="";
    session['selected_aterms']="";
    session['selected_tags']="";
    session['selected_model_tags']="";
    session['filter'] = null;
    return session;
  }
  //Submits a web query for a list of terms, e.g. 'ebola disease'
  RunQuery(){
    var session =this.props.session;
    session['search_engine']=this.state.search_engine;
    session = this.resetAllFilters(session);
    this.props.getQueryPages(this.state.valueQuery);

    $.post(
      '/queryWeb',
      {'terms': this.state.valueQuery,  'session': JSON.stringify(session)},
      function(data) {
          this.props.queryPagesDone();
	  this.props.updateStatusMessage(false, 'Searching: Web query "' + this.state.valueQuery + '" is completed');
      }.bind(this)).fail(function() {
        console.log("Something is wrong. Try again.");
        this.props.updateStatusMessage(false, 'Searching: Web query "' + this.state.valueQuery + '" has failed');
      }.bind(this));
      this.props.updateStatusMessage(true, 'Searching: Web query "' + this.state.valueQuery + '"');
    }

    // Submits a query and then run ACHE SeedFinder to generate queries and corresponding seed urls
    runSeedFinderQuery(){
	var session =this.props.session;
	session['search_engine']=this.state.search_engine;
	$.post(
            '/runSeedFinder',
            {'terms': this.state.valueQuery,  'session': JSON.stringify(session)},
            function(data) {
		setTimeout(function(){
		    this.props.queryPagesDone();
		    this.props.updateStatusMessage(false, 'Searching: SeedFinder query "' + this.state.valueQuery + '" has completed' );
		}.bind(this), 9000);
            }.bind(this)).fail(function() {
		console.log("Something is wrong. Try again.");
		this.props.updateStatusMessage(false, 'Searching: SeedFinder query "'+this.state.valueQuery+ '" has failed');
            }.bind(this));
	this.props.updateStatusMessage(true, 'Searching: SeedFinder query "'+this.state.valueQuery+'". Check status in process monitor.');
    }

    // Download the pages of uploaded urls
    runLoadUrls(valueLoadUrls){
      var session =this.props.session;
      session['search_engine']=this.state.search_engine;
      session = this.resetAllFilters(session);
	this.props.getQueryPages("uploaded");
	var tag = (this.uploadTag !== "Neutral")?this.uploadTag:"";
      $.post(
        '/uploadUrls',
          {'urls': valueLoadUrls, 'tag':tag,  'session': JSON.stringify(session)},
          function(data) {
	      this.props.queryPagesDone();
              this.props.updateStatusMessage(false, 'Uploading URLs has completed' );
	      this.uploadTag = "Neutral";
          }.bind(this)).fail(function() {
          console.log("Something is wrong. Try again.");
          this.props.updateStatusMessage(false, "Uploading URLs failed");
        }.bind(this));
        this.props.updateStatusMessage(true, "Uploading URLs");
      }

    addPosURLs(){
	this.handleCloseLoadURLs();
	this.uploadTag = "Relevant";
        this.runLoadUrls(this.state.valueLoadUrls);
    }

    addNegURLs(){
	this.handleCloseLoadURLs();
	this.uploadTag = "Irrelevant";
	this.runLoadUrls(this.state.valueLoadUrls);
    }

    addNeutralURLs(){
	this.handleCloseLoadURLs();
	this.uploadTag = "Neutral";
	this.runLoadUrls(this.state.valueLoadUrls);
    }
    addCustomTagURLs(event){
      this.handleCloseLoadURLs();
      this.uploadTag = event.value;
      this.runLoadUrls(this.state.valueLoadUrls);
    }


    loadFromFile = () => {
	this.fromFile = true;
	this.handleOpenLoadURLs();
    }

    loadFromTextInput = () => {
	this.fromFile = false;
	this.handleOpenLoadURLs();
    }

    // Handling search engine DropdownButton.
    handleDropdownButton(eventKey){
      this.setState({"search_engine":eventKey})
    }
    //Handling value into webQuery textfield
    handleChangeQuery(e){
      this.setState({ "valueQuery": e.target.value });
    }

    //Handling value into loadUrls textfield
    handleTextChangeLoadUrls(e){
	this.setState({ "valueLoadUrls": e.target.value});
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

    //Handling open/close create a new term Dialog
    handleOpenLoadURLs = () => {
      this.setState({openLoadURLs: true});
    };
    handleCloseLoadURLs = () => {
	this.setState({openLoadURLs: false,});
    };

    // Explicitly focus the text input using the raw DOM API
    focusTextField() {
      setTimeout(() => this.textInput.focus(), 100);
    }

    render() {
	const actionsLoadURLs = [
		<FlatButton label="Cancel" primary={true} onTouchTap={this.handleCloseLoadURLs}/>,
		<FlatButton label="Relevant" style={{marginLeft:10}} primary={true} keyboardFocused={true} onTouchTap={this.addPosURLs.bind(this)}/>,
		<FlatButton label="Irrelevant" primary={true} keyboardFocused={true} onTouchTap={this.addNegURLs.bind(this)}/>,
		<FlatButton label="Neutral" style={{marginLeft:10}} primary={true} keyboardFocused={true} onTouchTap={this.addNeutralURLs.bind(this)}/>,
    <div style={{float:"left",fontSize: "14px", fontWeight: "500",width: '18%'}}>
      <Select.Creatable
        placeholder="Add Tag"
        multi={false}
        options={this.availableTags}
        onChange={this.addCustomTagURLs.bind(this)}
        ignoreCase={true}
      />
      </div>
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

	return (
    <div>
      <Tabs
      onChange={this.handleChange}
      value={this.state.slideIndex}
      inkBarStyle={{background: '#7940A0' ,height: '4px'}}
      tabItemContainerStyle={{background: '#9A7BB0' ,height: '30px'}}
      >
        <Tab label={'WEB'} value={0}  style={styles.tab} />
        <Tab label={'LOAD'} value={1} style={styles.tab} />
        <Tab label={'SeedFinder'} value={2} style={styles.tab} />
      </Tabs>
      <SwipeableViews
      index={this.state.slideIndex}
      onChangeIndex={this.handleChange}
      >
      <div style={styles.slide} >
        <Col xs={10} md={10} style={{marginLeft:'-15px'}} >
        <InputGroup >
        <FormControl type="text" value={this.state.valueQuery} onKeyPress={(e) => {(e.key === 'Enter') ? this.RunQuery() : null}} placeholder="write a query ..." onChange={this.handleChangeQuery.bind(this)} style={{width:'177px'}}  />
        <DropdownButton
        componentClass={InputGroup.Button}
        id="input-dropdown-addon"
        pullRight="split-button-pull-right"
        onSelect={this.handleDropdownButton.bind(this)}
        title={this.state.search_engine}
        >
        <MenuItem key="0" eventKey='GOOG' >Goog</MenuItem>
        <MenuItem key="1" eventKey='BING'>Bing</MenuItem>
        </DropdownButton>
        </InputGroup>
        </Col>
        <Col xs={2} md={2} >
        <FlatButton style={{marginLeft:'-10px', minWidth: '58px'}}
        backgroundColor="#26C6DA"
        hoverColor="#80DEEA"
        icon={<Search color={fullWhite} />}
        onTouchTap={this.RunQuery.bind(this)}
        />
        </Col>
      </div>
      <div style={styles.slide}>
        <Row>
        <Col xs={10} md={10} style={{marginLeft:'0px'}}>
        <TextField style={{width:'260px', fontSize: 12, borderColor: 'gray', borderWidth: 1, background:"white", borderRadius:"1px"}}
        onChange={this.handleTextChangeLoadUrls.bind(this)}
        hintText="Write urls."
        hintStyle={{ marginLeft:10}}
        inputStyle={{marginBottom:10, marginLeft:10, paddingRight:20}}
        multiLine={true}
        rows={2}
        rowsMax={2}
        />
        </Col>
        <Col xs={2} md={1} style={{marginLeft:'-35px'}}>
        <FlatButton style={{marginLeft:'10px', minWidth: '58px' }}
        backgroundColor="#26C6DA"
        hoverColor="#80DEEA"
        icon={<Search color={fullWhite} />}
        onTouchTap={this.loadFromTextInput.bind(this)}
        />
        </Col>
        </Row>

        <Row>
        <br />
        <FlatButton style={{marginLeft:'15px'}}
        label="Load urls from file"
        labelPosition="before"
        containerElement="label" onTouchTap={this.loadFromFile.bind(this)}/>
        <br />

        <Dialog  title={"Upload URLs"} actions={actionsLoadURLs} modal={false} open={this.state.openLoadURLs} onRequestClose={this.handleCloseLoadURLs.bind(this)}>
        {show_choose_file}
        <br />
        </Dialog>

        </Row>
      </div>
      <div style={styles.slide}>

        <Col xs={10} md={10} style={{marginLeft:'-15px'}} >
        <InputGroup >
        <FormControl style={{width: '268px'}} type="text" value={this.state.valueQuery} onKeyPress={(e) => {(e.key === 'Enter') ? this.runSeedFinderQuery() : null}} placeholder="write a query ..." onChange={this.handleChangeQuery.bind(this)} />
        </InputGroup>
        </Col>
        <Col xs={2} md={1} >
        <FlatButton style={{marginLeft:'-10px', minWidth: '58px'}}
        backgroundColor="#26C6DA"
        hoverColor="#80DEEA"
        icon={<Search color={fullWhite} />}
        onTouchTap={this.runSeedFinderQuery.bind(this)}
        />
        </Col>


      </div>
      </SwipeableViews>
    </div>
      );
    }
  }

export default SearchTabs;
