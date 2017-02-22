// Filename:		Body.js
// Purpose:		Contain filters and view components. If there is some change into filter or view components, body.js should be updated.
// Author: Sonia Castelo (scastelo2@gmail.com)
import React, {Component} from 'react';
import { Row, Col} from 'react-bootstrap';
import DomainInfo from './DomainInfo';
import Search from './Search';
import Filters from './Filters';
import Views from './Views';
import SidebarMenu from './SidebarMenu';
import '../css/Components.css';
import Sidebar from 'react-sidebar';
import Avatar from 'material-ui/Avatar';
import Assignment from 'material-ui/svg-icons/action/assignment-returned';
import Plus from 'material-ui/svg-icons/action/swap-horiz';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Snackbar from 'material-ui/Snackbar'; //Adding an indicator which tell us that the pages are being downloaded
import $ from 'jquery';

const styles = {
  button:{
    marginTop:20,
    paddingBottom:'-145px',
    marginBottom:'-545px',
    marginRight: 5,
  },
  contentHeaderMenuLink: {
    textDecoration: 'none',
    color: 'white',
    padding: 8,
  },
  content: {
    marginTop: '68px',
    marginRight: '5px',
    marginBottom: '8px',
    marginLeft: '5px',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px 10px 10px 10px',
  },
  avatar:{
    margin:'8px 8px 0px -10px',
  },
};

class Body extends Component{

  constructor(props) {
      console.log("body constructor");
      super(props);
      this.state = {
        docked: true,
        open: true,
        transitions: true,
        touch: true,
        shadow: true,
        pullRight: false,
        touchHandleWidth: 20,
        dragToggleDistance: 30,
        size:350,
        iconDomainInfo:null,
        stateDomainInfoCard:false,
        stateSearchCard:false,
        stateFiltersCard:true,
        sizeAvatar:25,
        currentDomain:'',
        sessionBody:{},
        sessionString:"",
        update:false,
        runCurrentQuery: "*",
    };
    this.sessionB={};
  }

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
    session['filter'] = null;
    session['pageRetrievalCriteria'] = "Most Recent";
    session['selected_morelike'] = "";
    session['selected_queries']="";
    session['selected_tags']="";
    session['model'] = {};
    session['model']['positive'] = "Relevant";
    session['model']['nagative'] = "Irrelevant";


    return session;
  }

  //Get queries, tags, urls from a speficic domain.
  componentWillMount() {
    console.log("body componentWillMount");
    this.setState({currentDomain: this.props.currentDomain, sessionBody: this.createSession(this.props.currentDomain), sessionString: JSON.stringify(this.createSession(this.props.currentDomain)) });

  }

  //handling update of props (ex. filters, session, etc)
  componentWillReceiveProps  = (newProps) => {
    console.log("body componentWillReceiveProps");
    console.log(newProps.filterKeyword);
    console.log(newProps.currentDomain);
    if(newProps.filterKeyword !== '' || newProps.filterKeyword !== null){
      const sessionTemp =  this.state.sessionBody;
      sessionTemp['filter']= newProps.filterKeyword;
      this.setState({sessionBody: sessionTemp, sessionString: JSON.stringify(sessionTemp)});
    }
    if(newProps.currentDomain === this.state.currentDomain){
      return;
    }
    this.setState({currentDomain: this.props.currentDomain});
  };

  //Verify if it is necessary an update.
  shouldComponentUpdate(nextProps, nextState) {
     if (nextState.sessionString  === this.state.sessionString) {
       if(nextProps.filterKeyword !== null || nextProps.filterKeyword !== ""   || nextState.stateDomainInfoCard!==this.state.stateDomainInfoCard || nextState.stateSearchCard!==this.state.stateSearchCard || nextState.stateFiltersCard!==this.state.stateFiltersCard){
         return true;
       }
          return false;
     }
      return true;
  }

  //Handling menus of DomainInfo, Search, and Filter Cards.
  closeMenu(){
    this.setState({
      size: 60,
      //iconDomainInfo:<Avatar color={'white'} backgroundColor={'#7940A0'} size={35} style={styles.avatar} icon={<Home />} />,
      //stateDomainInfoCard:false,
      open: !this.state.open,
      sizeAvatar:35,
    });
  }

  //Handling menus of DomainInfo, Search, and Filter Cards.
  openMenu(){
    this.setState({
      size: 350,
      iconDomainInfo:null,
      open: !this.state.open,
      sizeAvatar:25,
    });
  }

  //Handling close/open of DomainInfo, Search, and Filter Cards.
  openDockMenu(){
    if(this.state.open){
      this.closeMenu();
      this.setState({
        stateDomainInfoCard:false,
        stateSearchCard:false,
        stateFiltersCard:false,
    });}
    else{
      this.openMenu();
      this.setState({
        stateDomainInfoCard:false,
        stateSearchCard:false,
        stateFiltersCard:false,
      });
    }
  }

  setActiveMenu (expanded, menu) {
    console.log("setActiveMenu " + expanded.toString() + " " + this.state.open.toString());
    if(!this.state.open){
      this.openMenu();
    }
    var item = menu===0 ? this.setState({stateSearchCard: expanded,  stateFiltersCard :!expanded, stateDomainInfoCard:!expanded}) :
    ( menu===1 ? this.setState({stateFiltersCard: expanded, stateSearchCard: !expanded, stateDomainInfoCard:!expanded}) : this.setState({ stateDomainInfoCard:expanded, stateFiltersCard: !expanded, stateSearchCard: !expanded}));
  }

  //function from FiltersTabs Component. Add or Remove some query or tag which was used to filter data.
  deletedFilter(sessionTemp){
    this.setState({
        sessionBody:sessionTemp, sessionString: JSON.stringify(sessionTemp)
    });
  }

  //Check if the some query (by queryWeb, seedfinder or loadUrls) is running.
  uploadDDT(value, term){
    if(value){
      this.setState({update:value, runCurrentQuery: term});
      this.forceUpdate();
    }
    else{
      this.setState({update:true, runCurrentQuery: term});
      this.forceUpdate();
      this.setState({update:value, runCurrentQuery: "*"});
      this.forceUpdate();
    }
  }

  //Update session
  updateSession(newSession){
    //console.log(JSON.stringify(newSession));
    //console.log('body newSession');
    this.setState({sessionBody: newSession , sessionString: JSON.stringify(newSession)});
    this.forceUpdate();
  }

  render(){
    //console.log(this.state.sessionBody);
    console.log("------body----------");
    const sidebar = (<div style={{width:this.state.size}}>
      <Col style={{marginTop:70, marginLeft:10, marginRight:10, width:350, background:"white"}}>
        <Row className="Menus-child">
          <DomainInfo nameDomain={this.props.nameDomain} session={this.state.sessionBody} statedCard={this.state.stateDomainInfoCard} sizeAvatar={this.state.sizeAvatar} setActiveMenu={this.setActiveMenu.bind(this)}/>
        </Row>
        <Row className="Menus-child">
          <Search statedCard={this.state.stateSearchCard} sizeAvatar={this.state.sizeAvatar} setActiveMenu={this.setActiveMenu.bind(this)} session={this.state.sessionBody} uploadDDT={this.uploadDDT.bind(this)}/>
        </Row>
        <Row className="Menus-child">
          <Filters update={this.state.update} statedCard={this.state.stateFiltersCard} sizeAvatar={this.state.sizeAvatar} setActiveMenu={this.setActiveMenu.bind(this)} session={this.state.sessionBody} updateSession={this.updateSession.bind(this)} deletedFilter={this.deletedFilter.bind(this)}/>
        </Row>
        <Row className="Menus-child">
          <FloatingActionButton mini={true} style={styles.button} zDepth={3} onClick={this.openDockMenu.bind(this)}>
            <Plus />
          </FloatingActionButton>
        </Row>
      </Col>

    </div>
  );

  const sidebarProps = {
    sidebar: sidebar,
    docked: this.state.docked,
    sidebarClassName: 'custom-sidebar-class',
    open: this.state.open,
    touch: this.state.touch,
    shadow: this.state.shadow,
    pullRight: this.state.pullRight,
    touchHandleWidth: this.state.touchHandleWidth,
    dragToggleDistance: this.state.dragToggleDistance,
    transitions: this.state.transitions,
    onSetOpen: this.onSetOpen,
  };

  return (
    <Sidebar {...sidebarProps}>
      <div>
        <Row style={styles.content}>
          <Views domainId={this.state.currentDomain} session={this.state.sessionBody} deletedFilter={this.deletedFilter.bind(this)}/>
        </Row>
      </div>
      <Snackbar
      open={(this.state.runCurrentQuery === "*")? false: (this.state.runCurrentQuery === "process*concluded")?false:true}
      message={(this.state.runCurrentQuery !== "process*concluded" && this.state.runCurrentQuery !== "*" )? "Searching: " + this.state.runCurrentQuery : (this.state.runCurrentQuery === "process*concluded")? "Search was completed.": ""}
      //autoHideDuration={(this.state.runCurrentQuery !== "process*concluded" && this.state.runCurrentQuery !== "*" )? 30000: (this.state.runCurrentQuery === "process*concluded")?2000: 0}
    />
    </Sidebar>
  )
}
}

export default Body;
