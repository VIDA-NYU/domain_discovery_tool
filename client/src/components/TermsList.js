// Filename:		TermsList.js
// Purpose:		Showing list of terms of a specific domain.
/*This component receives an array of objects with the following structure:
var array = [{'word': w[0], 'posFreq': w[1], 'negFreq': w[2], 'tags': w[3]},
             {'word': w[0], 'posFreq': w[1], 'negFreq': w[2], 'tags': w[3]}
           ];
*/
// Author: Sonia Castelo (scastelo2@gmail.com)


import React, { Component } from 'react';
import {scaleLinear} from 'd3-scale';
import {range} from 'd3-array';
import TermsSnippetViewer from "./TermsSnippetViewer";
import Divider from 'material-ui/Divider';
import { Glyphicon } from 'react-bootstrap';
import $ from "jquery";
import FlatButton from 'material-ui/FlatButton';
import {fullWhite} from 'material-ui/styles/colors';
import AddTermIcon from 'material-ui/svg-icons/content/add-box';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
//import {select} from 'd3-selection';
//import cloud from 'd3-cloud';
//import ReactFauxDom from 'react-faux-dom';


class TermsList extends Component {
    constructor(props){
        super(props);
        this.state = {
          listTerms: [],
          term:"",
          focusContext:false,
          focusTermContext:"",
          focusContextStyle:"#E6E6E6",//color withput focus
          openCreateTerm: false,
          newNameTerm:"",
        };
        this.focusTextField = this.focusTextField.bind(this);
        this.textInput = null;

        //this.startTermsList = this.startTermsList.bind(this);
        //this.drawWordCloud = this.drawWordCloud.bind(this);
    }

    componentWillMount(){
      this.setState({listTerms:this.props.listTerms});
    }

    componentWillReceiveProps(nextProps){
      console.log(nextProps.listTerms);
      this.setState({listTerms:nextProps.listTerms});
    }

    //Handling open/close create a new term Dialog
    handleOpenAddTerm = () => {
      this.setState({openCreateTerm: true});
      this.focusTextField();
    };
    handleCloseAddTerm = () => {
      this.setState({openCreateTerm: false, newNameTerm:"",});
    };
    //Handling changes into TextField newNameTerm (updating TextField).
    handleTextChangeNewNameTerm(e){
      this.setState({ newNameTerm: e.target.value});
    }
    // Explicitly focus the text input using the raw DOM API
    focusTextField() {
      setTimeout(() => this.textInput.focus(), 100);
    }

    //Checking whether there is already the word.
    addEntries(newTerm, entries){
      var updateListTerm = this.state.listTerms;
      var duplicate = false;
      var found = updateListTerm.some(function (obj) {
        return obj.word === newTerm;
      });
      if (found) duplicate = true;
      if (duplicate === false) updateListTerm = entries.concat(updateListTerm);
      this.setState({listTerms:updateListTerm, openCreateTerm: false, newNameTerm:"",});
    }

    //Adding custom positive terms.
    addPosTerm(){
      var newTerm = this.state.newNameTerm;
      var entries = [{'word': newTerm, 'posFreq': 0, 'negFreq': 0, 'tags': ["Positive", "Custom"]}];
      this.addEntries(newTerm, entries);
      this.setTermTag(newTerm,'Positive;Custom', true, this.props.session);
    }

    //Adding custom negative terms.
    addNegTerm(){
      var newTerm = this.state.newNameTerm;
      var entries = [{'word': newTerm, 'posFreq': 0, 'negFreq': 0, 'tags': ["Negative", "Custom"]}];
      this.addEntries(newTerm, entries);
      this.setTermTag(newTerm,'Negative;Custom', true, this.props.session);
    }

    startSnippets(term){
      this.setState({term:term});
    }

    focusTermContext(term){
      if(this.state.focusTermContext==term)
        this.setState({focusContext:false, focusTermContext:"", focusContextStyle:"#E6E6E6",})
      else
        this.setState({focusContext:true, focusTermContext:term, term:term, focusContextStyle:"black"})
    }

    // Adds tag to term.
    setTermTag(term, tag, applyTagFlag, session) {
        $.post(
          '/setTermsTag',
          {'terms': term, 'tag': tag, 'applyTagFlag': applyTagFlag, 'session': JSON.stringify(session)},
            function() {
              console.log("tagterm-------------");
          }.bind(this)).fail(function() {
                console.log("Something wrong happen. Try again.");
          }.bind(this));
    };

    // Responds to toggle of a term.
    // Term format:
    // {'word': term, 'tags': [], ...}
    updateTermTag(term){
      // State machine: Neutral -> Positive -> Negative -> Neutral.
      var tags = term['tags'];
      var wordId = term['word'].replace(/ /g, "_");
      wordId = '#'+wordId;
      var color = ($(wordId).css("fill")).toString();
      //var color = ($(wordId).css("fill")).toString();

      //if (tags.indexOf("Custom") != -1)
      //return;

      var isPositive = color=="rgb(0, 0, 255)";//tags.indexOf('Positive') != -1;
      var isNegative = color=="rgb(255, 0, 0)";//tags.indexOf('Negative') != -1;
      if (isPositive) {
        // It was positive, so it turns negative.
        this.setTermTag(term['word'], 'Positive', false, this.props.session);
        this.setTermTag(term['word'], 'Negative', true, this.props.session);

        // Removes tag 'Positive' from tags array, adds 'Negative'.
        $(wordId).css('fill','red');
      }
      else if (isNegative) {
        // It was Negative, so it turns Neutral.
        this.setTermTag(term['word'], 'Negative', false, this.props.session);
        // Removes tag 'Negative' from tags array.
        $(wordId).css('fill','black');
      }
      else {
        // It was Neutral, so it turns Positive.
        this.setTermTag(term['word'], 'Positive', true, this.props.session);
        // Adds tag 'Positive' to tags array.
        $(wordId).css('fill','blue');
      }

    }


    render() {
      if(this.state.listTerms.length>0){
      var maxBarWidth = 30;
      // Sets maximum frequency for positive/negative frequencies to set bars width in wordlist.
      var maxPosFreq = Math.max.apply(null,this.state.listTerms.map(function(w) {return w["posFreq"]; }));
      var maxNegFreq = Math.max.apply(null,this.state.listTerms.map(function(w) {return w["negFreq"]; }));
      var maxFreq = Math.max(maxPosFreq, maxNegFreq);
      // Scales for left/right bars.
      var barScale = scaleLinear().range([0, maxBarWidth]);
      barScale.domain([0, maxFreq]);
      let y =0;
      let terms_array = [];
      let loopListTerms = this.state.listTerms.map(function(w) {
                              // Aligns left bar to right.
                              let widthPos = barScale(w['posFreq']);
                              // Aligns left bar to left.
                              var widthNeg = barScale(w['negFreq']);
                              var currentTerm =w["word"];
                              var tags = w['tags']; //var isPositive = (tags.indexOf('Positive') != -1 || tags.indexOf('Relevant') != -1); var isNegative = tags.indexOf('Negative') != -1 || tags.indexOf('Irrelevant') != -1;
                              var colorPin = (this.state.focusContext && this.state.focusTermContext==currentTerm)? "black":"#E6E6E6";
                              var removeTermButton = (tags.indexOf('Custom')!= -1)?<foreignObject height="20" width="20" ><span className={"glyphicon glyphicon-trash"}></span></foreignObject>:<span/>;
                              var colorWord = (tags.indexOf('Positive') != -1 || tags.indexOf('Relevant') != -1)?"blue": (tags.indexOf('Negative') != -1 || tags.indexOf('Irrelevant') != -1)?"red":"black";

                              let pins = <g className={"pins"} transform={`translate(14, 0)`} style={{cursor:"pointer", letterSpacing:4, color:colorPin}} onClick={this.focusTermContext.bind(this, currentTerm)} onMouseOver={this.startSnippets.bind(this, currentTerm)}>
                                            <foreignObject fill="blue" height="20" width="20" ><span className={"control glyphicon glyphicon-pushpin"}></span></foreignObject>
                                         </g>;

                              let words = <g transform={`translate(30, 10)`}  onClick={this.updateTermTag.bind(this, w)} onMouseOver={this.startSnippets.bind(this, currentTerm)}>
                                            <text id={currentTerm.replace(/ /g, "_")} fontSize="12" fontFamily="sans-serif" textAnchor="start" style={{fill:colorWord}} >{currentTerm}
                                            </text>
                                          </g>;

                              let custom = <g className={"custom"} transform={`translate(2, 0)`} style={{cursor:"pointer", letterSpacing:4, color:"orange"}} onClick={this.focusTermContext.bind(this, currentTerm)} >
                                              {removeTermButton}
                                           </g>;

                              // Adds right bars (aligned to left).
                              let barNegative = <g transform={`translate(182, 0)`}>
                                                       <rect y={5} height={6} width={maxBarWidth}  fillOpacity="0.3" style={{fill:"#000000"}} />
                                                       <rect y={5} height={6} width={widthNeg} x={maxBarWidth - widthNeg} style={{fill:"red"}}/>
                                                 </g>;
                              // Adds left bars (aligned to right).
                              let barPositive = <g transform={`translate(212, 0)`}>
                                                       <rect y={5} height={6} width={maxBarWidth}  fillOpacity="0.3" style={{fill:"#000000"}}/>
                                                       <rect y={5} height={6} width={widthPos} x={0} style={{fill:"blue"}}/>
                                                </g>;
                              let bars =   <g id="terms" transform={`translate(0, ${y})`}>
                                              {custom}
                                              {pins}
                                              {words}
                                              {barNegative}
                                              {barPositive}
                                            </g>;
                              terms_array.push(bars);
                              y=y+16;
                              //var nameIdButton = '#'+ev.target.id
                              //var color = ($(nameIdButton).css("background-color")).toString();
                           }.bind(this));
         const actionsAddTerm = [
           <FlatButton label="Cancel" primary={true} onTouchTap={this.handleCloseAddTerm}/>,
           <FlatButton label="Relevant" style={{marginLeft:10}} primary={true} keyboardFocused={true} onTouchTap={this.addPosTerm.bind(this)}/>,
           <FlatButton label="Irrelevant" primary={true} keyboardFocused={true} onTouchTap={this.addNegTerm.bind(this)}/>,
         ];

        return (
                    <div>
                      <div style={{fontSize: 10, height: '180px', overflowY: "scroll",}}>
                          <svg ref="svg_container"  width={this.props.width} height={this.state.listTerms.length*20}  style={{marginTop:4, cursor:'default',MozUserSelect:'none', WebkitUserSelect:'none',msUserSelect:'none'}}>
                            {terms_array}
                          </svg>
                      </div>
                      <div style={{ textAlign:"right", margin:"-20px 0px -10px 0px",}}>
                          <IconButton tooltip="Add term" onTouchTap={this.handleOpenAddTerm.bind(this)} iconStyle={{color:"#26C6DA"}} hoveredStyle={{color:"#80DEEA"}}>
                             <AddTermIcon color={fullWhite} />
                          </IconButton>
                              <Dialog
                                 title="Adding a term"
                                 actions={actionsAddTerm}
                                 modal={false}
                                 open={this.state.openCreateTerm}
                                 onRequestClose={this.handleCloseAddTerm.bind(this)}
                               >
                                 <TextField style={{width:'268px', fontSize: 12, borderColor: 'gray', borderWidth: 1, background:"white", borderRadius:"1px"}}
                                   ref={(input) => { this.textInput = input;}}
                                   value={this.state.newNameTerm}
                                   onChange={this.handleTextChangeNewNameTerm.bind(this)}
                                   hintText="Write new term."
                                   hintStyle={{ marginLeft:10}}
                                   inputStyle={{marginBottom:10, marginLeft:10, paddingRight:20}}

                                 />
                               </Dialog>

                      </div>
                      <Divider style={{margin:"10px 10px 10px 10px"}}/>
                      <div style={{fontSize: 12, padding:10, height: '180px', overflowY: "scroll", borderTopColor:"#FFFFFF"}}>
                      <TermsSnippetViewer term= {this.state.term} session={this.props.session} focusContext={this.state.focusContext} focusTermContext={this.state.focusTermContext}/>
                      </div>
                    </div>

        );
      }
      else {
        return(<div/>);
      }

    }
}

TermsList.propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
};

TermsList.defaultProps = {
  width: 300,
  height: 300,
};



export default TermsList;
