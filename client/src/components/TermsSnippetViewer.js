// Filename:		TermsSnippetViewer.js
// Purpose:		Showing snippets that belong to an specific term.
// Author: Sonia Castelo (scastelo2@gmail.com)


import React, { Component } from 'react';
import {scaleLinear} from 'd3-scale';
import {range} from 'd3-array';
import {select} from 'd3-selection';
import ReactFauxDom from 'react-faux-dom';
import $ from "jquery";
//import {select} from 'd3-selection';
//import ReactFauxDom from 'react-faux-dom';


class TermsSnippetViewer extends Component {
    constructor(props){
        super(props);
        this.state = {
          term: [],
        };
        this.update = this.update.bind(this);
        this.onLoadedTermsSnippets = this.onLoadedTermsSnippets.bind(this);

        //this.drawWordCloud = this.drawWordCloud.bind(this);
    }

    componentWillMount(){
      this.setState({term:this.props.term});
      this.getTermSnippets(this.props.term, this.props.session);
      //this.wordCloud = ReactFauxDom.createElement('div');
    }

    componentWillReceiveProps(nextProps){
      if(nextProps.focusContext && this.state.term == nextProps.focusTermContext){
        return;
      }
      this.setState({term:nextProps.term});
      this.getTermSnippets(nextProps.term, nextProps.session);

    }


    getTermSnippets(term, session){
      $.post(
        '/getTermSnippets',
        {'term': term, 'session': JSON.stringify(session)},
          function(data) {
            console.log("TermsSippets-------------");
              this.onLoadedTermsSnippets(data);
        }.bind(this)).fail(function() {
              console.log("Something wrong happen. Try again.");
        }.bind(this));
    }

    // Responds to loaded terms snippets.
    onLoadedTermsSnippets(data) {
      var term = data.term;
      var tags = data.tags;
      var context = data.context;

      var termObj = {term: term, tags: tags};

      var termSnippets = [];
      $.each(context, function(url, context){
        var termSnippet = {};
        termSnippet['term'] = termObj;
        termSnippet['url'] = url;
        termSnippet['snippet'] = context;
        termSnippets.push(termSnippet);
      });

      //var lazyUpdate = true;
      //this.termsSnippetsViewer.clear(lazyUpdate);
      //this.termsSnippetsViewer.addItems(termSnippets);
      this.update(termSnippets);
    };

    /**
    * Updates viewer.
    */
   update(items_) {
    // Removes missing items.
     select("#termsSnippet").selectAll('*').remove();
     
     var items = select("#termsSnippet")
     .attr("width", 300)
     .attr("height", 300)
     .selectAll('.item').data(items_, function(item, i) {
         //console.log(item.term.term + '-' + i + '-' + item.snippet.substring(0, 30));
         return item.term.term + '-' + i + '-' + item.snippet.substring(0, 30);
     });

     // New items.
     items.enter()
       .append('div')
       .classed('noselect', true)
       .classed('item', true)
       .html(function(item, i) {
           var snippet = (item.snippet.replace(/<em>/g, "<b>")).replace("</em>", "</b>");
           return '<p>' + snippet + '</p>';
         })
       .style('cursor', 'pointer')
       .on('click', function(item, i) {
         var elem = select(this);
         elem.classed('dblclicked', !elem.classed('dblclicked'));
         window.open(item.url, '_blank');
       });

     items.each(function(item, i) {
       console.log("---");
       var tags = item.term['tags'];
       var isPositive = tags.indexOf('Positive') != -1;
       var isNegative = tags.indexOf('Negative') != -1;
       /*select(this).selectAll('em')
         .classed('Positive', isPositive)
         .classed('Negative', isNegative);*/
     });
   };


    render() {
      if(this.state.term!==""){
        return (
                    <div id="termsSnippet">
                    </div>
        );
      }
      else {
        return(<div/>);
      }

    }
}

TermsSnippetViewer.propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
};

TermsSnippetViewer.defaultProps = {
  width: 300,
  height: 300,
};



export default TermsSnippetViewer;
