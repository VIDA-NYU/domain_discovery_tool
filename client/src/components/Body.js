// Filename:		Body.js
// Purpose:		Contain filters and view components. If there is some change into filter or view components, body.js should be updated.
// Author: Sonia Castelo (scastelo2@gmail.com)
import React, {Component} from 'react';
import { Row, Col} from 'react-bootstrap';
import DomainInfo from './DomainInfo';
import Search from './Search';
import Filters from './Filters';
import Terms from './Terms';
import Views from './Views';
import CrawlingView from './CrawlingView';
import '../css/Components.css';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import 'react-select/dist/react-select.css';
import Sidebar from 'react-sidebar';
import Plus from 'material-ui/svg-icons/action/swap-horiz';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Snackbar from 'material-ui/Snackbar'; //Adding an indicator which tell us that the pages are being downloaded

import {Card, CardActions, CardHeader, CardText, CardMedia} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

const styles = {
  button:{
    //hoverColor:"#9c9ca4"
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
    margin:'-4px 8px 0px 0px',
  },

  //
  card: {

    borderStyle: 'solid',
    borderColor: '#C09ED7',
    background: 'white',
    borderRadius: '0px 0px 0px 0px',
    borderWidth: '0px 0px 1px 0px'
  },
  cardHeader:{
    background: '#DCCCE7',
    padding:'10px 1px 10px 6px',
    borderRadius: '0px 0px 0px 0px',
  },
  cardMedia:{
    background: '#DCCCE7',
    padding:'2px 4px 2px 4px',
    borderRadius: '0px 0px 0px 0px',
    height: "200px",
  },
};



class Body extends Component{

  constructor(props) {
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
	offset:0,
	currentPagination:0,
        stateFiltersCard:false,
        stateTermsCard:false,
        sizeAvatar:25,
        currentDomain:'',
        sessionBody:{},
        sessionString:"",
	pages:{},
        update:false,
        runCurrentQuery: "*",
        intervalFuncId:undefined,
        stopApplyQueryOverView:false, //Allow interactions with data (applying filters, tagging, etc) while multiple searches are running.
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
    session['filter'] = null; //null
    session['pageRetrievalCriteria'] = "Most Recent";
    session['selected_morelike'] = "";
    session['selected_queries']="";
    session['selected_tlds']="";
    session['selected_aterms']="";
    session['selected_tags']="";
    session['selected_model_tags']="";
    session['selected_crawled_tags']="";
    session['model'] = {};
    session['model']['positive'] = "Relevant";
    session['model']['negative'] = "Irrelevant";



    return session;
  }

  //Get queries, tags, urls from a speficic domain.
  componentWillMount() {
    this.setState({currentDomain: this.props.currentDomain, sessionBody: this.createSession(this.props.currentDomain), sessionString: JSON.stringify(this.createSession(this.props.currentDomain)) });
  }

  //handling update of props (ex. filters, session, etc)
  componentWillReceiveProps  = (newProps) => {
    if(newProps.reloadBody){
      let sessionTemp =  this.state.sessionBody;
      sessionTemp['filter']= (newProps.filterKeyword === '')?null:newProps.filterKeyword;
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
       if(nextProps.updateCrawlerData=="updateCrawler" || nextProps.updateCrawlerData=="stopCrawler" || nextProps.filterKeyword !== null || nextProps.filterKeyword !== ""   || nextState.stateDomainInfoCard!==this.state.stateDomainInfoCard || nextState.stateSearchCard!==this.state.stateSearchCard || nextState.stateTermsCard!==this.state.stateTermsCard || nextState.stateFiltersCard!==this.state.stateFiltersCard){
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
        stateTermsCard:false,
    });}
    else{
      this.openMenu();
      this.setState({
        stateDomainInfoCard:false,
        stateSearchCard:false,
        stateFiltersCard:false,
        stateTermsCard:false,
      });
    }
  }

  setActiveMenu (expanded, menu) {
    if(!this.state.open){
      this.openMenu();
    }
    //stateSearchCard: menu=0
    //stateFiltersCard: menu=1
    //stateDomainInfoCard: menu=2
    //stateTermsCard: menu=3
    var item = menu===0 ? this.setState({stateSearchCard: expanded,  stateFiltersCard :!expanded, stateDomainInfoCard:!expanded, stateTermsCard:!expanded}) :
               (menu===1 ? this.setState({stateFiltersCard: expanded, stateSearchCard: !expanded, stateDomainInfoCard:!expanded, stateTermsCard:!expanded}) :
               menu===2 ? this.setState({ stateDomainInfoCard:expanded, stateFiltersCard: !expanded, stateSearchCard: !expanded, stateTermsCard:!expanded}):
               this.setState({stateTermsCard:expanded, stateDomainInfoCard:!expanded, stateFiltersCard: !expanded, stateSearchCard: !expanded}));
  }

  //function from FiltersTabs Component. Add or Remove some query or tag which was used to filter data.
  deletedFilter(sessionTemp){
    this.props.deletedFilter(sessionTemp["filter"]);
    this.setState({
        sessionBody:sessionTemp, sessionString: JSON.stringify(sessionTemp), stopApplyQueryOverView:true,
    });
    this.updateSession(sessionTemp);
  }

  // Update the pages that have changed (for example pages returned from web query)
  updatePages(pages){
  	this.setState({pages:pages});
  }

  // Update the status message
  updateStatusMessage(value, term){
      this.setState({update:value, runCurrentQuery: term});
      this.forceUpdate();
  }

  // Start a timer and get the pages for the particular query as and when they become available on the server
  getQueryPages(term){
    if(this.state.intervalFuncId !== undefined)
      this.queryPagesDone();

    this.setState({stopApplyQueryOverView:false, intervalFuncId: window.setInterval(function() {this.applyFilterByQuery(term);}.bind(this), 1000)});

  }

  applyFilterByQuery(term){
    var session =this.state.sessionBody;
    if(!this.state.stopApplyQueryOverView){
      session['newPageRetrievalCriteria'] = "one";
      session['pageRetrievalCriteria'] = "Queries";
      session['selected_queries']=term;
    }
    this.updateSession(session);

  }

  // Stop timer to stop getting pages fromt the server as all downloaded pages have been retrieved
  queryPagesDone(){
    window.clearInterval(this.state.intervalFuncId);
    this.setState({intervalFuncId:undefined, stopApplyQueryOverView:false,});
  }

  //Update session
  updateSession(newSession){
    this.setState({sessionBody: newSession , sessionString: JSON.stringify(newSession), stopApplyQueryOverView:true,});
    this.forceUpdate();
  }

  reloadFilters(){
    this.setState({update:true});
    this.forceUpdate();
    this.setState({update:false});
  };

   availableCrawlerButton(isthereModel){
     this.props.availableCrawlerButton(isthereModel);
   }

    // Update pagination
    handlePageClick(offset, currentPagination){
	this.setState({offset: offset, currentPagination:currentPagination});
  }


  render(){

    if(this.props.selectedViewBody===1) //explore data view
    {
      //console.log(this.state.sessionBody);
      //console.log("------body----------");
      const sidebar = (<div style={{width:this.state.size}}>
      <Col style={{marginTop:70, marginLeft:10, marginRight:10, width:335, background:"white"}}>
            <Row className="Menus-child">
              <DomainInfo nameDomain={this.props.nameDomain} session={this.state.sessionBody} statedCard={this.state.stateDomainInfoCard} sizeAvatar={this.state.sizeAvatar} setActiveMenu={this.setActiveMenu.bind(this)}/>
            </Row>
            <Row className="Menus-child">
             <Search statedCard={this.state.stateSearchCard} sizeAvatar={this.state.sizeAvatar} setActiveMenu={this.setActiveMenu.bind(this)} session={this.state.sessionBody} updatePages={this.updatePages.bind(this)} updateStatusMessage={this.updateStatusMessage.bind(this)} getQueryPages={this.getQueryPages.bind(this)} queryPagesDone={this.queryPagesDone.bind(this)}/>
            </Row>
            <Row className="Menus-child">
              <Filters updateCrawlerData={this.props.updateCrawlerData} queryFromSearch = {this.state.intervalFuncId} update={this.state.update} statedCard={this.state.stateFiltersCard} sizeAvatar={this.state.sizeAvatar} setActiveMenu={this.setActiveMenu.bind(this)} session={this.state.sessionBody} updateStatusMessage={this.updateStatusMessage.bind(this)} updateSession={this.updateSession.bind(this)} deletedFilter={this.deletedFilter.bind(this)}/>
            </Row>
            <Row className="Menus-child">
              <Terms statedCard={this.state.stateTermsCard} sizeAvatar={this.state.sizeAvatar} setActiveMenu={this.setActiveMenu.bind(this)} session={this.state.sessionBody} BackgroundColorTerm={'#DCCCE7'} renderAvatar={true} showExpandableButton={true} actAsExpander={true}/>
            </Row>
            <Row className="Menus-child">
              <FloatingActionButton mini={true}  style={styles.button} zDepth={3} onClick={this.openDockMenu.bind(this)}>
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
            <Views queryFromSearch={this.state.intervalFuncId} currentDomain={this.state.currentDomain} nameDomain={this.props.nameDomain}  index={this.props.index} session={this.state.sessionBody} deletedFilter={this.deletedFilter.bind(this)} reloadFilters={this.reloadFilters.bind(this)} availableCrawlerButton={this.availableCrawlerButton.bind(this)} offset={this.state.offset} currentPagination={this.state.currentPagination} handlePageClick={this.handlePageClick.bind(this)}/>
          </Row>
          </div>
          <Snackbar
        open={this.state.update || this.state.intervalFuncId !== undefined}
        message={this.state.runCurrentQuery}
          //autoHideDuration={(this.state.runCurrentQuery !== "process*concluded" && this.state.runCurrentQuery !== "*" )? 30000: (this.state.runCurrentQuery === "process*concluded")?2000: 0}
        />
        </Sidebar>
      )
    }
    else //crawling view
    {
      return(
        <div>
        <CrawlingView domainId={this.state.currentDomain} statusCrawlers={this.props.statusCrawlers} />
        </div>
      )
    }


  }
}



export default Body;
