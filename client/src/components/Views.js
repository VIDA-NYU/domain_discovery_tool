import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import Checkbox from 'material-ui/Checkbox';

import Scatterplot from './Scatterplot'
import {csv} from 'd3-request'


import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import {blue500} from 'material-ui/styles/colors';
import Toggle from 'material-ui/Toggle';
import CircularProgress from 'material-ui/CircularProgress';
import Chip from 'material-ui/Chip';
import Qicon from '../images/qicon.png';
import Ticon from '../images/ticon.png';

import Searchicon from '../images/searchicon.png';

import FlatButton from 'material-ui/FlatButton';
import AddBox from 'material-ui/svg-icons/content/add-box';
import Settings from 'material-ui/svg-icons/action/settings';
import RelevantFace from 'material-ui/svg-icons/action/thumb-up';
import IrrelevantFace from 'material-ui/svg-icons/action/thumb-down';
import NeutralFace from 'material-ui/svg-icons/action/thumbs-up-down';
import {fullWhite} from 'material-ui/styles/colors';

import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';

const recentsIcon = <RelevantFace />;
const favoritesIcon = <IrrelevantFace />;
const nearbyIcon = <NeutralFace />;

import { ButtonGroup, Button, OverlayTrigger, Tooltip, Glyphicon} from 'react-bootstrap';


import $ from 'jquery';

const styles = {
  headline: {
    fontSize: 12,
    paddingTop: 16,
    marginBottom: 12,
    height: '940px',
  },
  slide: {
    height: '100px',
  },
  tab:{
    fontSize: '12px',
  },
  button:{
    marginTop:'10px',
    marginLeft:'10px',
    marginRight: 20,
  },

};

class ChipViewTab extends React.Component{
  constructor(props){
    super(props);
    this.state={
      chipData: [],
      sessionString:"",
      session:{},
    };
    this.styles = {
      chip: {
        margin: 4,
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    };
  }

  componentWillMount(){
    this.setState({
        session:this.props.session, sessionString: JSON.stringify(this.props.session)
    });
  }

  componentWillReceiveProps(nextProps, nextState){
    if (JSON.stringify(nextProps.session) === this.state.sessionString ) {
        return;
    }
    // Calculate new state
    var session = nextProps.session; //this.createSession(this.props.domainId, this.state.search_engine, this.state.activeProjectionAlg, this.state.pagesCap,this.state.fromDate, this.state.toDate, this.state.filter, this.state.pageRetrievalCriteria, this.state.selected_morelike, this.state.model);
    console.log("CHIP");
    console.log(session);
    var queriesList =[], tagsList =[], modelTagsList =[];
    queriesList = session['selected_queries'] !=="" ? session['selected_queries'].split(",") : queriesList;
    tagsList=session['selected_tags']!=="" ? session['selected_tags'].split(",") : tagsList;
    modelTagsList=session['selected_model_tags']!=="" ? session['selected_model_tags'].split(",") : modelTagsList;

    var newChip = [];
    for(var i=0; i<queriesList.length && queriesList.length>0; i++){
      newChip.push({key: i, type: 0, label: queriesList[i], avatar: Qicon});
    }
    for(var i=(queriesList.length), j=0; i<(tagsList.length+queriesList.length) && tagsList.length>0 ; i++, j++){
      newChip.push({key: i, type: 1, label: tagsList[j], avatar:Ticon});
    }
    for(var i=(tagsList.length+queriesList.length), j=0; i<(tagsList.length+queriesList.length+modelTagsList.length) && modelTagsList.length>0 ; i++, j++){
      newChip.push({key: i, type: 3, label: modelTagsList[j], avatar:Ticon});
    }
    if(session['filter']){newChip.push({key: (queriesList.length + tagsList.length + modelTagsList.length), type: 2, label: session['filter'] , avatar: Searchicon});
    }

    this.setState({
      chipData:newChip, pages:nextProps.pages, session:nextProps.session, sessionString: JSON.stringify(nextProps.session)
    });
  }

  removeString(currentType, currentKey){
    var currentString = "";
    var anyFilter = false;
    this.state.chipData.map((chip) => {
      if(chip.type == currentType && chip.key != currentKey)
        currentString = currentString + chip.label + ",";
    });
    if(currentString != "") return currentString.substring(0, currentString.length-1);
    return currentString;
  }


  handleRequestDelete = (key) => {
        const sessionTemp =  this.state.session;
        const chipToDelete = this.state.chipData.map((chip) => chip.key).indexOf(key);
        switch (this.state.chipData[chipToDelete].type) {
          case 0: //query
              sessionTemp['selected_queries']= this.removeString(0, key);
              if(sessionTemp['selected_queries'] === "") {
                sessionTemp['newPageRetrievelCriteria'] = "one";
                sessionTemp['pageRetrievalCriteria'] = "Tags";
              }
              break;
          case 1://tags
              sessionTemp['selected_tags']= this.removeString(1, key);
              if(sessionTemp['selected_tags'] === "") {
                sessionTemp['newPageRetrievelCriteria'] = "one";
                sessionTemp['pageRetrievalCriteria'] = "Queries";
              }
              break;
          case 2://filter
              sessionTemp['filter']= null;
              break;
          case 3://tags
                  sessionTemp['selected_model_tags']= this.removeString(3, key);
                  if(sessionTemp['selected_model_tags'] === "") {
                    if(sessionTemp['selected_queries'] !== "" && sessionTemp['selected_tags'] !== "")
                        sessionTemp['newPageRetrievelCriteria'] = "Queries,Tags,";
                    else if (sessionTemp['selected_queries'] !== "") {
                      sessionTemp['newPageRetrievelCriteria'] = "one";
                      sessionTemp['pageRetrievalCriteria'] = "Queries";
                    }
                    else {
                      sessionTemp['newPageRetrievelCriteria'] = "one";
                      sessionTemp['pageRetrievalCriteria'] = "Tags";
                    }
                  }
                  break;
        }
        if(sessionTemp['selected_queries'] === "" && sessionTemp['selected_tags'] === "" && sessionTemp['selected_model_tags'] === "" ){
           sessionTemp['pageRetrievalCriteria'] = "Most Recent";
        }

        this.state.chipData.splice(chipToDelete, 1);
        this.setState({chipData: this.state.chipData});
        this.props.deletedFilter(sessionTemp);
  };

  renderChip(data) {
        return (
          <Chip
            key={data.key}
            onRequestDelete={() => this.handleRequestDelete(data.key)}
            style={this.styles.chip}
          >
            <Avatar src={data.avatar} />
            {data.label}
          </Chip>
        );
  }

  shouldComponentUpdate(nextProps, nextState) {
      if(JSON.stringify(nextProps.session)!== this.state.sessionString) {
        return true;
      }
      return false;
  }

  render(){
    return (
      <div style={this.styles.wrapper}>
       {this.state.chipData.map(this.renderChip, this)}
      </div>
    );
  }
}


class ViewTabSnippets extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      pages:[],
      sessionString:"",
      session:{},
      accuracyOnlineLearning:0,
    };
  }

  componentWillMount(){
    this.setState({
        session:this.props.session, sessionString: JSON.stringify(this.props.session), pages:this.props.pages,
    });
    this.updateOnlineClassifier(this.props.session);
  }

  componentWillReceiveProps(nextProps, nextState){
    if (JSON.stringify(nextProps.session) !== this.state.sessionString || this.props.queryFromSearch) { // ||
      this.setState({
      session:nextProps.session, sessionString: JSON.stringify(nextProps.session), pages:nextProps.pages
      });
    }
    return;

  }

  shouldComponentUpdate(nextProps, nextState) {
    if ( nextState.accuracyOnlineLearning !== this.state.accuracyOnlineLearning || JSON.stringify(nextProps.session) !== this.state.sessionString  || nextState.pages !== this.state.pages || this.props.queryFromSearch ) {
         return true;
    }
    return false;
  }

  updateOnlineClassifier(sessionTemp){
    $.post(
    	'/updateOnlineClassifier',
    	{'session':  JSON.stringify(sessionTemp)},
    	function(accuracy) {
        //Updates the showed accuracy on the interface only if the different between the new and the previous accuracy is enough significant.
        if(accuracy >=this.state.accuracyOnlineLearning+2 || accuracy <=this.state.accuracyOnlineLearning-2){
          //updateing filters modelTags
          this.props.reloadFilters();
          this.setState({
              accuracyOnlineLearning:accuracy,
          });
        }

    	}.bind(this)
    );
  }

  removeAddTags(urls, current_tag, applyTagFlag ){

    $.post(
      '/setPagesTag',
      {'pages': urls.join('|'), 'tag': current_tag, 'applyTagFlag': applyTagFlag, 'session':  JSON.stringify(this.props.session)},
	function(pages) {
          //updateing filters Tags
          this.props.reloadFilters();
          this.updateOnlineClassifier(this.props.session);
      }.bind(this)
    );
  }

    //Handling click event on the tag button. When it is clicked it should update tag of the page in elasticsearch.
    onTagActionClicked(inputURL, inputTag){
      var idButton = (inputTag).split("-"); // (ev.target.id).split("-")
      var tag = idButton[0];
      var url = inputURL; // ev.target.value;
      var urls=[];
      var action = 'Apply';
      var isTagPresent = false;
      var updatedPages = JSON.parse(JSON.stringify(this.state.pages));
        if(updatedPages[url]["tags"]){
           isTagPresent = Object.keys(updatedPages[url]["tags"]).map(key => updatedPages[url]["tags"][key]).some(function(itemTag) {
            return itemTag == tag;});
            if(isTagPresent) action = 'Remove';
        }
        // Apply or remove tag from urls.
        var applyTagFlag = action == 'Apply';
        var urls = [];
        urls.push(url);
        if (applyTagFlag && !isTagPresent) {
          // Removes tag when the tag is present for item, and applies only when tag is not present for item.
          var auxKey = "0";
          if(updatedPages[url]["tags"] && (tag==="Relevant"  || tag==="Irrelevant" || tag==="Neutral")){
              var temp = Object.keys(updatedPages[url]["tags"]).map(key => {
                          var itemTag = updatedPages[url]["tags"][key].toString();
                          if(itemTag==="Relevant" || itemTag==="Irrelevant" || itemTag==="Neutral"){
                            delete updatedPages[url]["tags"][key];
                            this.removeAddTags(urls, itemTag, false );
                          }
                        });
              delete updatedPages[url]["tags"];
          }
          updatedPages[url]["tags"]=[];
          updatedPages[url]["tags"][auxKey] = tag;
          //checking if the new tag belong to the filter
          if(!this.props.session['selected_tags'].split(",").includes(tag) && this.props.session['selected_tags'] !== "" ){
            this.setState({ pages:updatedPages, });
            delete updatedPages[url];
          }
          //  setTimeout(function(){ $(nameIdButton).css('background-color','silver'); }, 500);
          this.setState({ pages:updatedPages, });
          this.removeAddTags(urls, tag, applyTagFlag );

        }
        else{
          delete updatedPages[url]["tags"];
          this.setState({ pages:updatedPages,});
          this.removeAddTags(urls, tag, applyTagFlag );
        }


      }

  keyboardFocus = (event, item) => {
    console.log(event);
    console.log(item);
      console.log("keyboardFocus");
    };


  render(){
    console.log("SnippetsPAges------------");
    //'/setPagesTag', {'pages': pages.join('|'), 'tag': tag, 'applyTagFlag': applyTagFlag, 'session': JSON.stringify(session)}, onSetPagesTagCompleted);
    var id=0;
    var urlsList = Object.keys(this.state.pages).map((k, index)=>{
                    let colorTagRelev = "";
                    let colorTagIrrelev="";
                    let colorTagNeutral="";
                    let uniqueTag="";
                    if(this.state.pages[k]["tags"]){
                     uniqueTag = (Object.keys(this.state.pages[k]["tags"]).length > 0) ? (this.state.pages[k]["tags"]).toString():(this.state.pages[k]["tags"][Object.keys(this.state.pages[k]["tags"]).length-1]).toString();
                     colorTagRelev=(uniqueTag==='Relevant')?"#4682B4":"silver";
                     colorTagIrrelev=(uniqueTag==='Irrelevant')?"#CD5C5C":"silver";
                     colorTagNeutral=(uniqueTag==='Neutral')?'silver':"silver";
                    }
                    else{
                      colorTagRelev=colorTagIrrelev=colorTagNeutral="silver";
                    }

                    id= id+1;
                    let urlLink= (k.length<110)?k:k.substring(0,109);
                    let imageUrl=(this.state.pages[k]["image_url"]=="")? "http://www.kanomax-usa.com/wp-content/uploads/2015/09/images-not-available.png":this.state.pages[k]["image_url"];

                    //style={{height:"200px"}} disableKeyboardFocus= {false} isKeyboardFocused={true} onKeyboardFocus={this.keyboardFocus.bind(this)}
                    return <ListItem key={index}  >
                    <div style={{  minHeight: '60px',  borderColor:"silver", marginLeft: '8px', marginTop: '3px', fontFamily:"arial,sans-serif"}}>
                      <div>
                        <p style={{float:'left'}}><img src={imageUrl} alt="HTML5 Icon" style={{width:'60px',height:'60px', marginRight:'3px'}}/></p>
                        <p style={{float:'right'}}>
                        <ButtonGroup bsSize="small">
                          <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Relevant</Tooltip>}>
                            <Button >
                              <IconButton onClick={this.onTagActionClicked.bind(this,k,"Relevant-"+id)} iconStyle={{width:25,height: 25,marginBottom:"-9px", color:colorTagRelev }} style={{height: 8, margin: "-10px", padding:0,}}><RelevantFace /></IconButton>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Irrelevant</Tooltip>}>
                            <Button>
                              <IconButton onClick={this.onTagActionClicked.bind(this,k,"Irrelevant-"+id)} iconStyle={{width:25,height: 25,marginBottom:"-9px", color:colorTagIrrelev }} style={{height: 8, margin: "-10px", padding:0,}}><IrrelevantFace /></IconButton>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Neutral</Tooltip>}>
                            <Button >
                              <IconButton onClick={this.onTagActionClicked.bind(this,k,"Neutral-"+id)} iconStyle={{width:25,height: 25,marginBottom:"-9px", color:colorTagNeutral }} style={{height: 8, margin: "-10px", padding:0,}}><NeutralFace /></IconButton>
                            </Button>
                          </OverlayTrigger>
                        </ButtonGroup></p>
                        <p>
                        <a target="_blank" href={k} style={{ fontSize:'18px',color:'#1a0dab'}} >{this.state.pages[k]["title"]}</a>
                        <br/>
                        <p style={{fontSize:'14px', color:'#006621', marginBottom:4, marginTop:2}}>{urlLink}</p>
                        <p style={{  fontSize:'13px', color:'#545454'}}>{this.state.pages[k]["snippet"]}</p>
                        </p>
                      </div>
                      <br/>
                      <Divider />
                    </div>
                  </ListItem>;

                    });


    return (
      <div  style={{maxWidth:1000}}>
        <p style={{color: "#FFFFFF",}}>-</p>
        <div style={{marginBottom:"50px"}}>
          <p style={{float:"left", color: "#757575", fontSize: "14px", fontWeight: "500", paddingLeft: "72px",}}>{urlsList.length} pages </p>
          <p style={{float:"right", color: "#757575", fontSize: "14px", fontWeight: "500", paddingRight: "20px",}}>  Accuracy of onlineClassifier: {this.state.accuracyOnlineLearning} % </p>
        </div>
        <div style={{marginTop:"50px"}}>
          <List>
          {urlsList}
          <Divider inset={true} />
          </List>
        </div>
     </div>
  );
  }
}

class CircularProgressSimple extends React.Component{
  render(){
    return(
    <div style={{borderColor:"green", marginLeft:"50%"}}>
      <CircularProgress size={60} thickness={7} />
    </div>
  );}
}

class Views extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      slideIndex: 0,
	pages:{},
      sessionString:"",
      session:{},
      chipData: [],
      lengthPages: 1,
    };
    this.newPages = true;
    this.queryFromSearch=true;
  }

  //Returns dictionary from server in the format: {url1: {snippet, image_url, title, tags, retrieved}} (tags are a list, potentially empty)
  getPages(session){
      $.post(
	  '/getPages',
	  {'session': JSON.stringify(session)},
	  function(pages) {
	      console.log("GET PAGES");
              console.log(pages);
                this.newPages=true;
              this.setState({session:session, pages:pages["data"], sessionString: JSON.stringify(session), lengthPages : Object.keys(pages["data"]).length});
	  }.bind(this)
      );
  }

  //Loads pages in the first time.
  componentWillMount(){
      this.getPages(this.props.session);
  }

  //Handling SwipeableViews.
  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  //Loads pages
  loadPages(session){
      this.getPages(session);
  }

  //If there are any change in the session like a new filter, then getPages() is called.
  componentWillReceiveProps(nextProps, nextState){
      this.queryFromSearch = (this.props.queryFromSearch ==undefined)?false:true;
	/*if (nextProps.pages !== this.state.pages) {
	    this.setState({pages:nextProps.pages, lengthPages : Object.keys(nextProps.pages).length});
	    this.forceUpdate();
	}*/
	if (JSON.stringify(nextProps.session) !== this.state.sessionString || this.queryFromSearch) {
    console.log("View---------------");
    this.newPages = false;
    this.loadPages(nextProps.session);
	}else{
      return;
  }


  }

  //Updates selected filters.
  deletedFilter(sessionTemp){
    this.getPages(sessionTemp);
    this.props.deletedFilter(sessionTemp);
  }

  //If the view is changed (snippet, visualization or model) or session is update then we need to rerender.
  shouldComponentUpdate(nextProps, nextState) {
    this.queryFromSearch = (this.props.queryFromSearch ==undefined)?false:true;
    if ((JSON.stringify(nextProps.session) !== this.state.sessionString && this.newPages) || nextState.slideIndex !== this.state.slideIndex ||this.queryFromSearch ) { //'""' if there is some selected tag.   || JSON.stringify(this.props.session['selected_tags'])!='""'
          return true;
    }
    return false;
  }

  reloadFilters(){
    this.props.reloadFilters();
  };

  render() {

    var showPages = (Object.keys(this.state.pages).length>0)?<ViewTabSnippets session={this.state.session} pages={this.state.pages} reloadFilters={this.reloadFilters.bind(this)} queryFromSearch = {this.queryFromSearch}/>
    : (this.state.lengthPages==0)? <div style={{paddingTop:"20px", paddingLeft:"8px",}}> No pages found.</div> : <CircularProgressSimple />;

      return (
        <div>
          <Tabs
            onChange={this.handleChange}
            value={this.state.slideIndex}
            inkBarStyle={{background: '#7940A0' ,height: '4px'}}
            tabItemContainerStyle={{background:'#9A7BB0', height: '40px'}}>
              <Tab label="Snippets" value={0} style={styles.tab} />
          </Tabs>

          <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange}  >
            <div style={styles.headline}>
              <ChipViewTab  session={this.state.session} deletedFilter={this.deletedFilter.bind(this)}/>
              {showPages}
            </div>

          </SwipeableViews>
        </div>
      );

  }
}

export default Views;
