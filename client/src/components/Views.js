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
import Dicon from '../images/dicon.png';

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

const recentsIcon = <RelevantFace />;
const favoritesIcon = <IrrelevantFace />;
const nearbyIcon = <NeutralFace />;

import { ButtonGroup, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';


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
    var queriesList =[], tldsList=[],atermsList=[],tagsList =[], modelTagsList =[];
    queriesList = session['selected_queries'] !=="" ? session['selected_queries'].split(",") : queriesList;
    tldsList = session['selected_tlds'] !=="" ? session['selected_tlds'].split(",") : tldsList;
    atermsList = session['selected_aterms'] !=="" ? session['selected_aterms'].split(",") : atermsList;            
    tagsList=session['selected_tags']!=="" ? session['selected_tags'].split(",") : tagsList;
    modelTagsList=session['selected_model_tags']!=="" ? session['selected_model_tags'].split(",") : modelTagsList;

    var newChip = [];
    for(var i=0; i<queriesList.length && queriesList.length>0; i++){
      newChip.push({key: i, type: 0, label: queriesList[i], avatar: Qicon});
    }
    for(var i=(queriesList.length), j=0; i<(queriesList.length+tagsList.length) && tagsList.length>0 ; i++, j++){
      newChip.push({key: i, type: 1, label: tagsList[j], avatar:Ticon});
    }
    for(var i=(queriesList.length+tagsList.length), j=0; i<(queriesList.length+tagsList.length+tldsList.length) && tldsList.length>0 ; i++, j++){
      newChip.push({key: i, type: 4, label: tldsList[j], avatar:Dicon});
    }
    for(var i=(queriesList.length+tagsList.length+tldsList.length), j=0; i<(queriesList.length+tagsList.length+tldsList.length+atermsList.length) && atermsList.length>0 ; i++, j++){
      newChip.push({key: i, type: 5, label: atermsList[j], avatar:Ticon});
    }
    for(var i=(queriesList.length+tagsList.length+tldsList.length+atermsList.length), j=0; i<(queriesList.length+tagsList.length+tldsList.length+atermsList.lebgth+modelTagsList.length) && modelTagsList.length>0 ; i++, j++){
      newChip.push({key: i, type: 3, label: modelTagsList[j], avatar:Ticon});
    }

    this.setState({
      chipData:newChip, pages:nextProps.pages, session:nextProps.session, sessionString: JSON.stringify(nextProps.session)
    });
  }

  removeString(currentType, currentKey){
    var currentString = "";
      var anyFilter = false;
      console.log("REMOVE STRING");
      console.log(this.state.chipData);
    this.state.chipData.map((chip) => {
      if(chip.type == currentType && chip.key != currentKey)
        currentString = currentString + chip.label + ",";
    });
    if(currentString != "") return currentString.substring(0, currentString.length-1);
    return currentString;
  }


    handleRequestDelete = (key) => {
	console.log("handleRequestDelete");
        const sessionTemp =  this.state.session;
        const chipToDelete = this.state.chipData.map((chip) => chip.key).indexOf(key);
        switch (this.state.chipData[chipToDelete].type) {
          case 0: //query
            sessionTemp['selected_queries']= this.removeString(0, key);
	    console.log(sessionTemp['selected_queries']);
              if(sessionTemp['selected_queries'] === "") {
                sessionTemp['newPageRetrievalCriteria'] = "one";
                sessionTemp['pageRetrievalCriteria'] = "Tags";
              }
              break;
          case 1://tags
            sessionTemp['selected_tags']= this.removeString(1, key);
	    console.log(sessionTemp['selected_tags']);
              if(sessionTemp['selected_tags'] === "") {
                sessionTemp['newPageRetrievalCriteria'] = "one";
                sessionTemp['pageRetrievalCriteria'] = "Queries";
              }
              break;
          case 2://filter
              sessionTemp['filter']= null;
              break;
          case 3://model tags
            sessionTemp['selected_model_tags']= this.removeString(3, key);
            break;
          case 4: //tlds
              sessionTemp['selected_tlds']= this.removeString(4, key);
              if(sessionTemp['selected_tlds'] === "") {
                sessionTemp['newPageRetrievalCriteria'] = "one";
                sessionTemp['pageRetrievalCriteria'] = "TLDs";
              }
              break;
        case 5: //Annotated Terms
            sessionTemp['selected_aterms']= this.removeString(5, key);
	    console.log("ANNOTATED TERMS REMOVE");
	    console.log(sessionTemp['selected_aterms']);
	    if(sessionTemp['selected_aterms'] === "")
		sessionTemp['filter'] = null;
	    else {
		var checked = sessionTemp['selected_aterms'].split(",");
		var labelTerm = "";
		checked.map((term, index)=>{
		    labelTerm = labelTerm + term + " OR ";
		});
		if(labelTerm != "")
		    labelTerm = labelTerm.substring(0, labelTerm.length-" OR ".length);

		sessionTemp['filter'] = labelTerm;
	    }
            break;
	    
        }
        if(sessionTemp['selected_queries'] === "" && sessionTemp['selected_tags'] === "" && sessionTemp['selected_model_tags'] === "" && sessionTemp['selected_tlds'] === ""&& sessionTemp['selected_aterms'] === "" ){
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
    this.pages = [];
  }

  componentWillMount(){
    this.pages=this.props.pages;
    this.setState({
        session:this.props.session, sessionString: JSON.stringify(this.props.session), pages:this.props.pages,
    });
    this.updateOnlineClassifier(this.props.session);
  }

  componentWillReceiveProps(nextProps, nextState){
    if (JSON.stringify(nextProps.session) === this.state.sessionString && nextProps.pages === this.state.pages ) { // ||
        return;
    }
    this.pages=nextProps.pages;
    this.setState({
      pages:nextProps.pages, session:nextProps.session, sessionString: JSON.stringify(nextProps.session)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ( nextState.accuracyOnlineLearning !== this.state.accuracyOnlineLearning || JSON.stringify(nextProps.session) !== this.state.sessionString  || nextState.pages !== this.state.pages ) { //&&
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
          this.updateOnlineClassifier(this.props.session);
      }.bind(this)
    );
  }

  //Changing color button from css (directly).
  setColorButton(idButton, tag, color){
    $('#Relevant-'+idButton).css('background-color','silver');
    $('#Irrelevant-'+idButton).css('background-color','silver');
    $('#Neutral-'+idButton).css('background-color','silver');

    var setColor= (tag=="Relevant")? ((color=="rgb(192, 192, 192)")? $('#Relevant-'+idButton).css('background-color','#4682B4'): $('#Relevant-'+idButton).css('background-color','silver'))
                : (tag=="Irrelevant")?((color=="rgb(192, 192, 192)")? $('#Irrelevant-'+idButton).css('background-color','#CD5C5C'): $('#Irrelevant-'+idButton).css('background-color','silver'))
                : (tag=="Neutral")? ((color=="rgb(192, 192, 192)")? $('#Neutral-'+idButton).css('background-color','silver'): $('#Neutral-'+idButton).css('background-color','silver'))
                :"";
  }

  //Handling click event on the tag button. When it is clicked it should update tag of the page in elasticsearch.
  onTagActionClicked(ev){
    var idButton = (ev.target.id).split("-")
    var tag = idButton[0];
    var url = ev.target.value;
    var urls=[];
    var action = 'Apply';
    var isTagPresent = false;
    var nameIdButton = '#'+ev.target.id
    var color = ($(nameIdButton).css("background-color")).toString();
      if(this.pages[url]["tags"]){
         isTagPresent = Object.keys(this.pages[url]["tags"]).map(key => this.pages[url]["tags"][key]).some(function(itemTag) {
          return itemTag == tag;});
          if(isTagPresent) action = 'Remove';
      }
      // Apply or remove tag from urls.
      var applyTagFlag = action == 'Apply';
      this.setColorButton(idButton[1], tag, color);
      var urls = [];
      urls.push(url);
      if (applyTagFlag && !isTagPresent) {
        // Removes tag when the tag is present for item, and applies only when tag is not present for item.
        var auxKey = "0";
        if(this.pages[url]["tags"] && (tag==="Relevant"  || tag==="Irrelevant" || tag==="Neutral")){
            var temp = Object.keys(this.pages[url]["tags"]).map(key => {
                        var itemTag = this.pages[url]["tags"][key].toString();
                        if(itemTag==="Relevant" || itemTag==="Irrelevant" || itemTag==="Neutral"){
                          delete this.pages[url]["tags"][key];
                          this.removeAddTags(urls, itemTag, false );
                        }
                      });
            delete this.pages[url]["tags"];
        }
        this.pages[url]["tags"]=[];
        this.pages[url]["tags"][auxKey] = tag;
        this.removeAddTags(urls, tag, applyTagFlag );

      }
      else{
        delete this.pages[url]["tags"];
        this.removeAddTags(urls, tag, applyTagFlag );
      }
      this.pages=this.pages;
    }

  keyboardFocus = (event, item) => {
    console.log(event);
    console.log(item);
      console.log("keyboardFocus");
    };


  render(){
    console.log("SnippetsPAges------------");
      console.log(this.pages);
    //'/setPagesTag', {'pages': pages.join('|'), 'tag': tag, 'applyTagFlag': applyTagFlag, 'session': JSON.stringify(session)}, onSetPagesTagCompleted);
    var cont=0;
    var urlsList = Object.keys(this.pages).map((k, index)=>{
                    let colorTagRelev = "";
                    let colorTagIrrelev="";
                    let colorTagNeutral="";
                    let uniqueTag="";
                    if(this.pages[k]["tags"]){
                     uniqueTag = (Object.keys(this.pages[k]["tags"]).length > 0) ? (this.pages[k]["tags"]).toString():(this.pages[k]["tags"][Object.keys(this.pages[k]["tags"]).length-1]).toString();
                     colorTagRelev=(uniqueTag==='Relevant')?"#4682B4":"silver";
                     colorTagIrrelev=(uniqueTag==='Irrelevant')?"#CD5C5C":"silver";
                     colorTagNeutral=(uniqueTag==='Neutral')?'silver':"silver";
                    }
                    else{
                      colorTagRelev=colorTagIrrelev=colorTagNeutral="silver";
                    }
                    var id= cont+1; cont=cont+id;
                    //style={{height:"200px"}} disableKeyboardFocus= {false} isKeyboardFocused={true} onKeyboardFocus={this.keyboardFocus.bind(this)}
                    return <ListItem key={index}  >
                    <div style={{  minHeight: '60px',  borderColor:"silver", marginLeft: '8px', marginTop: '3px',}}>
                      <div>
                        <p style={{float:'left'}}><img src={this.pages[k]["image_url"]} alt="HTML5 Icon" style={{width:'60px',height:'60px', marginRight:'3px'}}/></p>
                        <p style={{float:'right'}}>
                        <ButtonGroup bsSize="small">
                          <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Relevant</Tooltip>}>
                            <Button id={"Relevant-"+id} value={k} onClick={this.onTagActionClicked.bind(this)} style={{backgroundColor:colorTagRelev}} >Relev</Button>
                          </OverlayTrigger>
                          <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Irrelevant</Tooltip>}>
                            <Button id={"Irrelevant-" +id} value={k} onClick={this.onTagActionClicked.bind(this)} style={{backgroundColor:colorTagIrrelev}} >Irrel</Button>
                          </OverlayTrigger>
                          <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Neutral</Tooltip>}>
                            <Button id={"Neutral-"+ id} value={k} onClick={this.onTagActionClicked.bind(this)} style={{backgroundColor:colorTagNeutral}} >Neutr</Button>
                          </OverlayTrigger>
                        </ButtonGroup></p>
                        <p><a target="_blank" href={k} style={{ color:'blue'}} >{this.pages[k]["title"]}</a> <br/><a target="_blank" href={k} style={{fontSize:'11px'}}>{k}</a></p>
                      </div>
                      <br/>
                      <div style={{marginTop:'-3px'}}> <p style={{ marginTop:'-3px'}}>{this.pages[k]["snippet"]}</p> </div>
                      <Divider />
                    </div>
                  </ListItem>;
                    });


    return (
      <div>
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
  }

  //Returns dictionary from server in the format: {url1: {snippet, image_url, title, tags, retrieved}} (tags are a list, potentially empty)
  getPages(session){
      $.post(
	  '/getPages',
	  {'session': JSON.stringify(session)},
	  function(pages) {
	      console.log("GET PAGES");
              console.log(pages);
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
    componentWillReceiveProps(nextProps){
      console.log(nextProps.session);
	/*if (nextProps.pages !== this.state.pages) {
	    this.setState({pages:nextProps.pages, lengthPages : Object.keys(nextProps.pages).length});
	    this.forceUpdate();
	}
	if (JSON.stringify(nextProps.session) === this.state.sessionString) {
	    return;
	}*/
  console.log("View---------------");
  console.log(nextProps.session);
	this.loadPages(nextProps.session);
  }

  //Updates selected filters.
  deletedFilter(sessionTemp){
    this.getPages(sessionTemp);
    this.props.deletedFilter(sessionTemp);
  }

  //If the view is changed (snippet, visualization or model) or session is update then we need to rerender.
  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(nextProps.session) !== this.state.sessionString  || nextState.slideIndex !== this.state.slideIndex || nextProps.pages !== this.state.pages || this.state.lengthPages==0) { //
          return true;
    }
    return false;
  }

  render() {
    var showPages = (Object.keys(this.state.pages).length>0)?<ViewTabSnippets session={this.state.session} pages={this.state.pages} />
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
