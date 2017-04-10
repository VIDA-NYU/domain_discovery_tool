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
        };
        this.startTermsList = this.startTermsList.bind(this);
        //this.drawWordCloud = this.drawWordCloud.bind(this);
    }

    componentWillMount(){
      this.setState({listTerms:this.props.listTerms});
      //this.wordCloud = ReactFauxDom.createElement('div');
    }


    componentDidMount() {
        this.startTermsList();
    }

    componentDidUpdate() {
        this.startTermsList();
    }
    componentWillReceiveProps(nextProps){
      this.setState({listTerms:nextProps.listTerms});
    }

    startTermsList() {
      console.log("terms");
      //select(this.refs.svg_container).selectAll('*').remove();

    }

    componentWillUnmount(){
    }

    startSnippets(term){
      this.setState({term:term});
    }

    focusTermContext(term){
      if(this.state.focusTermContext==term){
        this.setState({focusContext:false, focusTermContext:"", focusContextStyle:"#E6E6E6",})
      }
      else{
        this.setState({focusContext:true, focusTermContext:term, term:term, focusContextStyle:"black"})
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
                                var colorPin = (this.state.focusContext && this.state.focusTermContext==w["word"])? "black":"#E6E6E6";
                                let pins = <g className={"pins"} style={{cursor:"pointer", letterSpacing:4, color:colorPin}} onClick={this.focusTermContext.bind(this, w["word"])} onMouseOver={this.startSnippets.bind(this, w["word"])}>
                                              <foreignObject fill="blue" height="20" width="20" y="-2px" x="10px"><span className={"control glyphicon glyphicon-pushpin"}></span></foreignObject>
                                           </g>;
                                let words = <g transform={`translate(30, 10)`} onMouseOver={this.startSnippets.bind(this, w["word"])}>
                                              <text id="t_text" fontSize="12" fontFamily="sans-serif" textAnchor="start" >{w["word"]}
                                              </text>
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
                                                {pins}
                                                {words}
                                                {barNegative}
                                                {barPositive}
                                              </g>;
                                terms_array.push(bars);
                                y=y+16;
                             }.bind(this));

        return (
                    <div>
                      <div style={{fontSize: 10, height: '180px', overflowY: "scroll",}}>
                      <svg ref="svg_container"  width={this.props.width} height={this.state.listTerms.length*10}  style={{cursor:'default',MozUserSelect:'none', WebkitUserSelect:'none',msUserSelect:'none'}}
                       >
                        {terms_array}
                      </svg>
                      </div>
                      <Divider/>
                      <div style={{fontSize: 10, height: '180px', overflowY: "scroll",}}>
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


//Creating wordlist frame
/*createBarTerms() {
  var wordlist = this;
  var rowHeight = 16;
  var barHeight = 6;
  var svgMargin = {'top': 5, 'left': 5, 'right': 5, 'bottom': 5};

  var word_length = [];
  $(this.entries).each(function( index, value ){
    word_length.push(value["word"].length);
  });

  if(this.maxWordTextWidth === undefined || this.maxWordTextWidth === null) {
    this.maxWordTextWidth = Math.max.apply(Math, word_length) * 7;
  }else{
    if((Math.max.apply(Math, word_length) * 7) > this.maxWordTextWidth){
      this.maxWordTextWidth = Math.max.apply(Math, word_length) * 7;
    }
  }

  var containerWidth = $('#' + wordlist.containerId).width();
  var width = containerWidth - svgMargin.left - svgMargin.right;
  var maxBarWidth = 30;

  // Computes svg height.
  var svgHeight = svgMargin.top + svgMargin.bottom + rowHeight * this.entries.length;

  var transitionDuration = 500;

  var svg = d3.select('#' + this.containerId).selectAll('svg').data(['svg']);

  svg.enter().append('svg');
  svg.attr('height', svgHeight);
  svg = svg.selectAll('g.container').data(['g.container']);
  svg.enter().append('g')
      .classed('container', true)
      .attr('transform', 'translate(' + svgMargin.left + ', ' + svgMargin.top + ')');

  // Rows for entries.
  var rows = svg.selectAll('g.row').data(wordlist.entries, function(d, i){
      return i + '-' + d['word'];
  });
  rows.exit().remove();
  rows.enter().append('g')
      .classed('row', true)
      .attr('transform', function(d, i) {
          return 'translate(0, '
          + (i * rowHeight) + ')';
      });

  // Left bars (positive frequency bars).
  var posBars = rows.selectAll('g.bar.pos').data(function(d) { return [d]; });
  posBars.enter().append('g')
      .classed('bar', true)
      .classed('pos', true)
      .attr('transform', 'translate(' + (width - (maxBarWidth)) + ', 0)')
      .append('rect')
      .classed('background', true)
      .attr('y', 0.5 * (rowHeight - barHeight))
      .attr('width', maxBarWidth)
      .attr('height', barHeight);


  // Container for word.
  var words = rows.selectAll('g.words').data(function(d) { return [d]; });
  words
    .enter().append('g')
      .classed('words', true)
      .attr('transform', 'translate(30,' + (0.5 * rowHeight) + ')')
      .append('text')
      .classed('noselect', true)
      .text(function(d){return d['word'];})
      .on('click', function(d, i){
        wordlist.onItemClick(d, i, d3.event.shiftKey);
      })
      .on('mouseover', function(d, i) {
        if (!wordlist.currentWord){
          wordlist.onItemFocus(d, i, d3.event.shiftKey, true);
        }
      })
      .on('mouseout', function(d, i) {
        if (!wordlist.currentWord){
          wordlist.onItemFocus(d, i, d3.event.shiftKey, false);
        }
      })

  // Container for word.
  var circles = rows.selectAll('g.custom').data(function(d) { return [d]; });
  circles
      .enter().append('g')
      .classed('custom', true);


  // Term should be classed according to its tags, e.g. Positive/Negative.
  words.each(function(d) {
    var elm = d3.select(this).select('text');
    var tags = d['tags'];
    var isPositive = tags.indexOf('Positive') != -1 || tags.indexOf('Relevant') != -1;
    var isNegative = tags.indexOf('Negative') != -1 || tags.indexOf('Irrelevant') != -1;
    elm
      .classed('Positive', isPositive)
      .classed('Negative', isNegative);
  });



  var pins = rows.selectAll('g.pins').data(function(d) { return [d]; });
  pins.enter().append('g')
    .classed("pins", true)
    .append('svg:foreignObject')
    .attr("width", 20)
    .attr("height", 20)
    .attr("y", "-2px")
    .attr("x", "10px")
    .append("xhtml:span")
    .attr("class", "control glyphicon glyphicon-pushpin")
    .on('mouseover', function(d, i) {
    Utils.showTooltip();
    })
    .on('mousemove', function() {
  Utils.updateTooltip('Pin Term Context');
    })
    .on('mouseout', function() {
  Utils.hideTooltip();
    })
    .on("click", function(d, i){
      if (wordlist.currentWord == d.word){
        wordlist.currentWord = undefined;
        $(this).removeClass("pinned");
      } else {
        wordlist.currentWord = d.word;
        $(".pins span.pinned").removeClass("pinned");
        $(this).addClass("pinned");
        wordlist.onItemFocus(d, i, d3.event.shiftKey, true);
      }
    })

  circles.each(function(d) {
var tags = d['tags'];
var isCustom = tags.indexOf('Custom') != -1;
if (isCustom){
    var container = d3.select(this);
    container.append('image')
  .attr('xlink:href', '/img/delete.jpg')
  .attr('width', 15)
  .attr('height', 15)
  .attr('transform', 'translate(-5,-4)')
        .on('click', function(d, i) {
      wordlist.onDeleteClick(d, i);
  })
  .on('mouseover', function(d, i) {
      Utils.showTooltip();
  })
  .on('mousemove', function() {
      Utils.updateTooltip('Delete Term');
  })
  .on('mouseout', function() {
      Utils.hideTooltip();
  });

}
  });

  // Right bars (negative frequency bars).
  var negBars = rows.selectAll('g.bar.neg').data(function(d) { return [d]; });
  negBars.enter().append('g')
      .classed('bar', true)
      .classed('neg', true)
      .attr('transform', 'translate(' + (width - (2 * maxBarWidth)) + ', 0)')
    .append('rect')
      .classed('background', true)
      .attr('y', 0.5 * (rowHeight - barHeight))
      .attr('width', maxBarWidth)
      .attr('height', barHeight);

  // Scales for left/right bars.
  // TODO Read domain from data.
  var barScale = d3.scale.linear()
      .range([0, maxBarWidth]);

  // Adds left bars (aligned to right).

  barScale.domain([0, wordlist.maxPosFreq]);
  posBars.each(function(d, i) {
      var rect = d3.select(this).selectAll('rect.pos').data(['rect']);
      rect.enter().append('rect')
          .classed('pos', true)
          .attr('y', 0.5 * (rowHeight - barHeight))
          .attr('height', barHeight);
      // Aligns left bar to right.
      var width = barScale(d['posFreq']);
      rect
          .transition(transitionDuration)
          .attr('x', 0)
          .attr('width', width);
  });

  // Adds right bars (aligned to left).
  barScale.domain([0, wordlist.maxNegFreq]);
  negBars.each(function(d, i) {
      var rect = d3.select(this).selectAll('rect.neg').data(['rect']);
      rect.enter().append('rect')
          .classed('neg', true)
          .attr('y', 0.5 * (rowHeight - barHeight))
          .attr('height', barHeight);

      // Aligns left bar to left.
      var width = barScale(d['negFreq']);
      rect
        .transition(transitionDuration)
        .attr('x', maxBarWidth - width)
        .attr('width', width);
  });
};*/
