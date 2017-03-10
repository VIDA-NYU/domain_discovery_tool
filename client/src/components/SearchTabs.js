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
    };
  }

    //Handling changes in SearchTabs
    handleChange = (value) => {
      this.setState({  slideIndex: value,  });
    };


    //Submits a web query for a list of terms, e.g. 'ebola disease'
    RunQuery(){
      console.log("run queryWeb");
      var session =this.props.session;
      session['search_engine']=this.state.search_engine;
      $.post(
        '/queryWeb',
        {'terms': this.state.valueQuery,  'session': JSON.stringify(session)},
        function(data) {
          console.log(data);
          console.log("CONCLUDED PROCESSSSSSSS)");
          this.props.uploadDDT(false, "process*concluded");
          }.bind(this)).fail(function() {
              console.log("Something wrong happen. Try again.");
              this.props.uploadDDT(false, this.state.valueQuery);
            }.bind(this));
      this.props.uploadDDT(true, this.state.valueQuery);
    }

    // Submits a query and then run ACHE SeedFinder to generate queries and corresponding seed urls
    runSeedFinderQuery(){
      console.log("run seedQuery");
      var session =this.props.session;
      session['search_engine']=this.state.search_engine;
      $.post(
        '/runSeedFinder',
        {'terms': this.state.valueQuery,  'session': JSON.stringify(session)},
        function(data) {
          this.props.uploadDDT(false, "process*concluded");
          }.bind(this)).fail(function() {
              console.log("Something wrong happen. Try again.");
              this.props.uploadDDT(false, this.state.valueQuery);
            }.bind(this));
      //console.log("run quwry" + this.state.search_engine + ", " + this.state.valueQuery );
      this.props.uploadDDT(true, this.state.valueQuery);
    }

    // Download the pages of uploaded urls
    runLoadUrls(valueLoadUrls){
      var session =this.props.session;
      session['search_engine']=this.state.search_engine;
      $.post(
        '/downloadUrls',
        {'urls': valueLoadUrls,  'session': JSON.stringify(session)},
        function(data) {
          this.props.uploadDDT(false, "process*concluded" );
          }.bind(this)).fail(function() {
              console.log("Something wrong happen. Try again.");
              this.props.uploadDDT(false, this.state.valueQuery);
            }.bind(this));
      this.props.uploadDDT(true, this.state.valueQuery);
    }


    // Download the pages of uploaded urls from textfield
    runLoadUrlsQuery(){
      this.runLoadUrls(this.state.valueLoadUrls);
    }
    // Download the pages of uploaded urls from file
    runLoadUrlsFileQuery(txt) {
        var allTextLines = txt.split(/\r\n|\n/);
        var urlsString = allTextLines.join(" ");
        this.runLoadUrls(urlsString);
    }

    // Handling search engine DropdownButton.
    handleDropdownButton(eventKey){
      this.setState({"search_engine":eventKey})
    }
    //Handling value into webQuery textfield
    handleChangeQuery(e){
      this.setState({ "valueQuery": e.target.value });
    }

    //Hadling value into loadUrls textfield
    handleTextChangeLoadUrls(e){
      console.log("valueLoadUrls" + e.target.value);
      this.setState({ "valueLoadUrls": e.target.value});
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


    render() {
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
                  <FormControl type="text" value={this.state.valueQuery} onKeyPress={(e) => {(e.key === 'Enter') ? this.RunQuery() : null}} placeholder="write a query ..." onChange={this.handleChangeQuery.bind(this)} style={{width:'189px'}}  />
                  <DropdownButton
                    componentClass={InputGroup.Button}
                    id="input-dropdown-addon"
                    pullRight id="split-button-pull-right"
                    onSelect={this.handleDropdownButton.bind(this)}
                    title={this.state.search_engine}
                    >
                    <MenuItem key="0" eventKey='GOOG'>Goog</MenuItem>
                    <MenuItem key="1" eventKey='BING' >Bing</MenuItem>
                  </DropdownButton>
                </InputGroup>
              </Col>
              <Col xs={2} md={1} >
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
                <TextField style={{width:'268px', fontSize: 12, borderColor: 'gray', borderWidth: 1, background:"white", borderRadius:"1px"}}
                  value={this.state.valueLoadUrls}
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
                  onTouchTap={this.runLoadUrlsQuery.bind(this)}
                  />
              </Col>
              </Row>
              <Row>
              <br />
                     <FlatButton style={{marginLeft:'15px'}}
                       label="Load urls from file"
                       labelPosition="before"
                       containerElement="label"
                     >
                     <input type="file" id="csvFileInput" onChange={this.handleFile.bind(this)} name='file' ref='file' accept=".txt"/>
                     </FlatButton>
                     <br />
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
