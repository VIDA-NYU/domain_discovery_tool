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
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import $ from 'jquery';

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
    };
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
      "valueLoadUrls":"",
    });
  };

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

randomFunction(){
  console.log("");
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
            <Col xs={4} md={4} style={{marginLeft:'0px', borderRightStyle:"ridge", borderRightColor:"white", borderWidth: 1,}}>

            <Row>
              <Col xs={10} md={10} style={{marginLeft:'0px'}}>
                <TextField style={{width:'260px', fontSize: 12, borderColor: 'gray', borderWidth: 1, background:"white", borderRadius:"1px"}}
                onChange={this.randomFunction.bind(this)}
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
                onTouchTap={this.randomFunction.bind(this)}
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

            </Col>
            <ToolbarSeparator style={{ marginTop:"5px"}} />
            <Col xs={4} md={4} style={{marginLeft:'0px'}}>
            <Paper zDepth={1} style={{  height: 510,
  width: 400, margin: 20,
  textAlign: 'center',
  display: 'inline-block',}} />
  <RaisedButton label="Start Crawler" style={{margin: 12,}} />

            </Col>
            <Col xs={4} md={4} style={{marginLeft:'0px'}}>
              <p>
              Recommendations:
              </p>
              <Table>
                 <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                   <TableRow>
                     <TableHeaderColumn>Domain</TableHeaderColumn>
                     <TableHeaderColumn>Total</TableHeaderColumn>
                   </TableRow>
                 </TableHeader>
                 <TableBody displayRowCheckbox={false}>
                   <TableRow>
                     <TableRowColumn>www.domain1.com</TableRowColumn>
                     <TableRowColumn>12</TableRowColumn>
                   </TableRow>
                   <TableRow>
                     <TableRowColumn>www.domain2.com</TableRowColumn>
                     <TableRowColumn>13</TableRowColumn>
                   </TableRow>
                   <TableRow>
                     <TableRowColumn>www.domain3.com</TableRowColumn>
                     <TableRowColumn>14</TableRowColumn>
                   </TableRow>
                 </TableBody>
               </Table>
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
