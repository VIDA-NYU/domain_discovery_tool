import React, { Component } from 'react';
import { Col, Row} from 'react-bootstrap';
// From https://github.com/oliviertassinari/react-swipeable-views
import Terms from './Terms';
import DeepCrawling from './DeepCrawling';
import FocusedCrawling from './FocusedCrawling';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import $ from 'jquery';

import MultiselectTable from './MultiselectTable';

const styles = {
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
      disableStopCrawlerSignal:true,
      disableAcheInterfaceSignal:true,
      disabledStartCrawler:false, //false
      disabledCreateModel:true, //false
      messageCrawler:"",
      openCreateModel: false,
      slideIndex: 0,
      pages:{},
      openDialogLoadUrl: false,
      currentTags:undefined,
      deepCrawlableDomains: [],
      deepCrawlableDomainsFromTag: [],
      resetSelection: false,
      openLoadURLs: false,
      session:{},
      crawlerServers: {},
    };

  }



  /**
  * Creating session to get the urls with deep crawl tag.
  * @method createSession
  * @param {string} domainId
  */
  /*consultaQueries: {"search_engine":"GOOG","activeProjectionAlg":"Group by Correlation"
  ,"domainId":"AVWjx7ciIf40cqEj1ACn","pagesCap":"100","fromDate":null,"toDate":null,
  "filter":null,"pageRetrievalCriteria":"Most Recent","selected_morelike":"",
  "model":{"positive":"Relevant","negative":"Irrelevant"}}*/
  createSession(domainId){
    var session = {};
    session['search_engine'] = "GOOG";
    session['activeProjectionAlg'] = "Group by Correlation";
    session['domainId'] = domainId;
    session['pagesCap'] = "5";
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
    session['model']['positive'] = ["Relevant"];
    session['model']['negative'] = ["Irrelevant"];
    session["from"]=0;
    return session;
  }
  /**
  * Set the deepCrawlableDomainsFromTag state for displaying the current tlds in deep crawler tag.
  * @method componentWillMount
  * @param
  */
  componentWillMount(){
      var temp_session = this.createSession(this.props.domainId);
      this.setState({session: temp_session});
      this.getCrawlerServers();
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
      //valueLoadUrls:[],
      //valueLoadUrlsFromTextField:[],
    });
  }

  getCrawlerServers(){
      $.post(
	  '/getCrawlerServers',
	  {},
	  (crawlerServers) => {
	      console.log("CRAWLER SERVERS");
	      console.log(crawlerServers);
    	      this.setState({crawlerServers: crawlerServers});
	      this.forceUpdate();
  	    }
  	).fail((error) => {
  	    console.log('getCrawlerServers FAILED ', error);
  	});
  }
  render() {
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
        <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange}>
        <div id={"deep-crawling"} style={styles.slide}>
            <DeepCrawling domainId={this.props.domainId} session={this.state.session} crawlerServers={this.state.crawlerServers}/>
        </div>

        <div id="focused-crawling" style={styles.slide}>
          <FocusedCrawling domainId={this.props.domainId}  session={this.state.session}  crawlerServers={this.state.crawlerServers} slideIndex={this.state.slideIndex}/>
        </div>

        </SwipeableViews>
      </div>
    );
  }
}

export default CrawlingView;
