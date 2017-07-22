// Filename:		Terms.js
// Purpose:		This is an intermediate component between Body.js and TermsList.js. It handles the changes in Terms card.
// Author: Sonia Castelo (scastelo2@gmail.com)
import React, {Component} from 'react';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';
import TermsList from './TermsList';
import Avatar from 'material-ui/Avatar';
import Assignment from 'material-ui/svg-icons/action/assignment-returned';
import Divider from 'material-ui/Divider';
import $ from 'jquery';
import CircularProgress from 'material-ui/CircularProgress';


class CircularProgressSimple extends React.Component{
  render(){
    return(
    <div style={{borderColor:"green", marginLeft:"50%"}}>
      <CircularProgress size={30} thickness={7} />
    </div>
  );}
}


class Terms extends Component{

  constructor(props) {
    super(props);
    this.state = {
      expanded: this.props.statedCard,
      update:true,
      listTerms: [],
      session:{},
      sessionString:"",
      fromCrawling:false,
    };
  };

  componentWillMount = () => {
   this.setState({expanded: this.props.statedCard, session:this.props.session, sessionString:JSON.stringify(this.props.session) , fromCrawling:this.props.fromCrawling,});
   if(this.props.focusedCrawlDomains){
      this.loadTerms();
   }
  };


  //Handling state's changes of search card. (expanded or reduced)
  componentWillReceiveProps  = (nextProps) => {
      // Calculate new state
    if(nextProps.statedCard !== this.state.statedCard){
      this.setState({expanded: nextProps.statedCard}, function() {
           this.setState({expanded: nextProps.statedCard});
      });
    }

      if(JSON.stringify(nextProps.session) !== this.state.sessionString && nextProps.statedCard){
	  this.setState({
              session:nextProps.session,
              sessionString:JSON.stringify(this.props.session),
              listTerms: [],
	  });
	  this.loadTerms();
      }
      else{
	  return;
      }

   };

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
    if(expanded){
      this.props.setActiveMenu(expanded, 3);

    }
  };

  handleReduce = () => {
    this.setState({expanded: false});
  };


  loadTerms(){
    var session = this.props.session;
    $.post(
      '/extractTerms',
      {'numberOfTerms': 40, 'session': JSON.stringify(session)},
      function(summary) {
        var entries = [];
        entries = summary.map(function(w) {
          return {'word': w[0], 'posFreq': w[1], 'negFreq': w[2], 'tags': w[3]}
        });
        this.setState({listTerms: entries});
      }.bind(this)).fail(function() {
        console.log("Something wrong happen. Try again.");
      }.bind(this));
    };

    updateTerms(){
	console.log(this.props.updateTerms);
      if(this.props.updateTerms != undefined)	
	  this.props.updateTerms(this.state.listTerms);
  }
    
  updateListTermParent(updateListTerm){
      this.setState({listTerms: updateListTerm});
      this.forceUpdate();
  }

  //Check if the component should be updated or not
  shouldComponentUpdate(nextProps, nextState) {
    if(JSON.stringify(nextProps.session) !== this.state.sessionString || nextProps.statedCard !== this.state.statedCard || JSON.stringify(nextState.session) !== this.state.sessionString || this.props.focusedCrawlDomains) {
          return true;
    }
    return false;
  }


    render(){
	console.log("RENDER TERMS");
	this.updateTerms();
	
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
        background: this.props.BackgroundColorTerm, //'#DCCCE7',
        padding:'10px 1px 10px 6px',
        borderRadius: '0px 0px 0px 0px',
      },
      cardMedia:{
        background: this.props.BackgroundColorTerm,
        padding:'2px 4px 2px 4px',
        borderRadius: '0px 0px 0px 0px',
        height: "390px",
      },

    };

    let terms = " ";
    if(this.state.listTerms.length>0){
      terms = this.state.listTerms.map(function(w) {
        return <p>{w["word"]}</p>;
      });
    }
    var isThereTerms = (this.state.listTerms.length>0)?<TermsList listTerms={this.state.listTerms}  session={this.props.session} updateListTermParent={this.updateListTermParent.bind(this)} loadTerms={this.loadTerms.bind(this)} fromCrawling={this.state.fromCrawling} ></TermsList>:<CircularProgressSimple />;
    var avatarElement = (this.props.renderAvatar)?<Avatar color={'white'} backgroundColor={'#7940A0'} size={this.props.sizeAvatar} style={styles.avatar} icon={<Assignment />} />
    :null;
    return(

      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange} style={styles.card}>
        <CardHeader
            title="Terms"
            avatar={avatarElement}
            style={styles.cardHeader}
            actAsExpander={this.props.actAsExpander}
            showExpandableButton={this.props.showExpandableButton}
        />
        <CardMedia expandable={true} style={styles.cardMedia}>
          <Divider/>
          <div>
            {isThereTerms}
          </div>
        </CardMedia>
      </Card>
    )
  }

}

export default Terms;
