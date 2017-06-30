import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';
import Chip from 'material-ui/Chip';
import Qicon from '../images/qicon.png';
import Ticon from '../images/ticon.png';
import Dicon from '../images/dicon.png';
import NoFoundImg from '../images/images_not_available.png';
import Searchicon from '../images/searchicon.png';
import RelevantFace from 'material-ui/svg-icons/action/thumb-up';
import IrrelevantFace from 'material-ui/svg-icons/action/thumb-down';
import NeutralFace from 'material-ui/svg-icons/action/thumbs-up-down';
import IconButton from 'material-ui/IconButton';
import ReactPaginate from 'react-paginate';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
//const recentsIcon = <RelevantFace />;
//const favoritesIcon = <IrrelevantFace />;
//const nearbyIcon = <NeutralFace />;

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
    var session = nextProps.session;
      var queriesList =[], tagsList =[], tldsList=[],atermsList=[], modelTagsList =[], crawledTagsList=[];
    queriesList = session['selected_queries'] !=="" ? session['selected_queries'].split(",") : queriesList;
    tldsList = session['selected_tlds'] !=="" ? session['selected_tlds'].split(",") : tldsList;
    atermsList = session['selected_aterms'] !=="" ? session['selected_aterms'].split(",") : atermsList;
    tagsList=session['selected_tags']!=="" ? session['selected_tags'].split(",") : tagsList;
    modelTagsList=session['selected_model_tags']!=="" ? session['selected_model_tags'].split(",") : modelTagsList;
    crawledTagsList=session['selected_crawled_tags']!=="" ? session['selected_crawled_tags'].split(",") : crawledTagsList;

    var newChip = [];
    for(let i=0; i<queriesList.length && queriesList.length>0; i++){
      newChip.push({key: i, type: 0, label: queriesList[i], avatar: Qicon});
    }
    for(let i=(queriesList.length), j=0; i<(queriesList.length+tagsList.length) && tagsList.length>0 ; i++, j++){
      newChip.push({key: i, type: 1, label: tagsList[j], avatar:Ticon});
    }
    for(let i=(queriesList.length+tagsList.length), j=0; i<(queriesList.length+tagsList.length+tldsList.length) && tldsList.length>0 ; i++, j++){
      newChip.push({key: i, type: 4, label: tldsList[j], avatar:Dicon});
    }
    for(let i=(queriesList.length+tagsList.length+tldsList.length), j=0; i<(queriesList.length+tagsList.length+tldsList.length+atermsList.length) && atermsList.length>0 ; i++, j++){
      newChip.push({key: i, type: 5, label: atermsList[j], avatar:Ticon});
    }
    for(let i=(queriesList.length+tagsList.length+tldsList.length+atermsList.length), j=0; i<(queriesList.length+tagsList.length+tldsList.length+atermsList.length+modelTagsList.length) && modelTagsList.length>0 ; i++, j++){
      newChip.push({key: i, type: 3, label: modelTagsList[j], avatar:Ticon});
    }
    for(let i=(queriesList.length+tagsList.length+tldsList.length+atermsList.length+modelTagsList.length), j=0; i<(queriesList.length+tagsList.length+tldsList.length+atermsList.length+modelTagsList.length+crawledTagsList.length) && crawledTagsList.length>0 ; i++, j++){
      newChip.push({key: i, type: 6, label: crawledTagsList[j], avatar:Ticon});
    }

    if(session['filter'] !== null){
      newChip.push({key: (queriesList.length+tagsList.length+tldsList.length+atermsList.length+modelTagsList.length+crawledTagsList), type: 2, label: session['filter'] , avatar: Searchicon});
    }
    this.setState({
      chipData:newChip, pages:nextProps.pages, session:nextProps.session, sessionString: JSON.stringify(nextProps.session)
    });
  }

removeString(currentType, currentKey){
  var currentString = "";
  //var anyFilter = false;
  this.state.chipData.map((chip) => {
    if(chip.type === currentType && chip.key !== currentKey)
    currentString = currentString + chip.label + ",";
  });
  if(currentString !== "") return currentString.substring(0, currentString.length-1);
  return currentString;
}

handleRequestDelete = (key) => {
  const sessionTemp =  this.state.session;
  const chipToDelete = this.state.chipData.map((chip) => chip.key).indexOf(key);
  switch (this.state.chipData[chipToDelete].type) {
    case 0: //query
    sessionTemp['selected_queries']= this.removeString(0, key);
    if(sessionTemp['newPageRetrievalCriteria'] === "Multi"){
      if(sessionTemp['selected_queries'] === "") {
        delete sessionTemp['pageRetrievalCriteria']['query'];
      } else sessionTemp['pageRetrievalCriteria']['query'] = sessionTemp['selected_queries'];
    }
    break;
    case 1://tags
    sessionTemp['selected_tags']= this.removeString(1, key);
    if(sessionTemp['newPageRetrievalCriteria'] === "Multi"){
      if(sessionTemp['selected_tags'] === "") {
        delete sessionTemp['pageRetrievalCriteria']['tag'];
      } else sessionTemp['pageRetrievalCriteria']['tag'] = sessionTemp['selected_tags'];
    }
    break;
    case 2://filter
    sessionTemp['filter']=null;//null;
    break;
    case 3://model tags
    sessionTemp['selected_model_tags']= this.removeString(3, key);
    if(sessionTemp['newPageRetrievalCriteria'] === "Multi"){
      if(sessionTemp['selected_model_tags'] === "") {
        delete sessionTemp['pageRetrievalCriteria']['model_tag'];
      } else sessionTemp['pageRetrievalCriteria']['model_tag'] = sessionTemp['selected_model_tags'];
    }
    break;
    case 4: //tlds
    sessionTemp['selected_tlds']= this.removeString(4, key);
    if(sessionTemp['newPageRetrievalCriteria'] === "Multi"){
      if(sessionTemp['selected_tlds'] === "") {
        delete sessionTemp['pageRetrievalCriteria']['domain'];
      } else sessionTemp['pageRetrievalCriteria']['domain'] = sessionTemp['selected_tlds'];
    }
    break;
    case 5: //Annotated Terms
    sessionTemp['selected_aterms']= this.removeString(5, key);
    if(sessionTemp['selected_aterms'] === "")
    sessionTemp['filter'] =null;//null;
    else {
      var checked = sessionTemp['selected_aterms'].split(",");
      var labelTerm = "";
      checked.map((term, index)=>{
        labelTerm = labelTerm + term + " OR ";
      });
      if(labelTerm !== "")
      labelTerm = labelTerm.substring(0, labelTerm.length-" OR ".length);

      sessionTemp['filter'] = labelTerm;
    }
    break;
    case 6://crawled tags
      sessionTemp['selected_crawled_tags']= this.removeString(6, key);
      if(sessionTemp['newPageRetrievalCriteria'] === "Multi"){
	  if(sessionTemp['selected_crawled_tags'] === "") {
              delete sessionTemp['pageRetrievalCriteria']['crawled_tag'];
	  } else sessionTemp['pageRetrievalCriteria']['crawled_tag'] = sessionTemp['selected_crawled_tags'];
    }
    break;

  }
  if(sessionTemp['selected_queries'] === "" && sessionTemp['selected_tags'] === "" && sessionTemp['selected_model_tags'] === ""  && sessionTemp['selected_crawled_tags'] === "" && sessionTemp['selected_tlds'] === ""&& sessionTemp['selected_aterms'] === "" ){
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
      offset:0,
      currentPagination:0,
      allRelevant:false,
      lengthTotalPages:0,
      custom_tag_val:"",
    };
    this.perPage=12; //default 12
    this.currentUrls=[];
    this.disableCrawlerButton=true;
    this.customTagPages=[];
  }

  componentWillMount(){
    this.setState({
        session:this.props.session, sessionString: JSON.stringify(this.props.session), pages:this.props.pages, currentPagination:0, offset:0, lengthTotalPages:this.props.lengthTotalPages,
    });
    this.updateOnlineClassifier(this.props.session);
  }

  componentWillReceiveProps(nextProps, nextState){
    if (JSON.stringify(nextProps.session) !== this.state.sessionString || this.props.queryFromSearch) {
      if(!this.props.queryFromSearch) $("div").scrollTop(0);
      this.setState({
      session:nextProps.session, sessionString: JSON.stringify(nextProps.session), pages:nextProps.pages, lengthTotalPages:nextProps.lengthTotalPages, currentPagination:0, offset:0,
      });
    }
    return;

  }

  shouldComponentUpdate(nextProps, nextState) {
    if ( nextState.currentPagination!== this.state.currentPagination || nextState.accuracyOnlineLearning !== this.state.accuracyOnlineLearning || JSON.stringify(nextProps.session) !== this.state.sessionString  || nextState.pages !== this.state.pages || this.props.queryFromSearch ) {
         return true;
    }
    return false;
  }

  removeString(currentTag){
    var currentString = "";
    //var anyFilter = false;
    this.state.session['selected_tags'].split(",").forEach(function(tag) {
      if(tag !== currentTag && tag !== "")
      currentString = currentString + tag + ",";
    });
    if(currentString !== "") return currentString.substring(0, currentString.length-1);
    return currentString;
  }

  updateOnlineClassifier(sessionTemp){
    $.post(
    	'/updateOnlineClassifier',
    	{'session':  JSON.stringify(sessionTemp)},
    	function(accuracy) {
        if(accuracy>0 && this.disableCrawlerButton){
          this.disableCrawlerButton=false;
          this.props.availableCrawlerButton(false); // disable
        }
        if(accuracy===0){
          this.disableCrawlerButton=true;
          this.props.availableCrawlerButton(true); // disable
        }
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

  //Returns dictionary from server in the format: {url1: {snippet, image_url, title, tags, retrieved}} (tags are a list, potentially empty)
  getPages(session){
    $.post(
      '/getPages',
      {'session': JSON.stringify(session)},
      function(pages) {
        this.newPages=true;
        this.setState({session:session, pages:pages["data"]["results"], sessionString: JSON.stringify(session), lengthTotalPages:pages['data']['total'], });
        this.forceUpdate();
      }.bind(this)
    );
  }

  handlePageClick(data){
    $("div").scrollTop(0);
    let selected = data.selected; //current page (number)
    let offset = Math.ceil(selected * this.perPage);
    this.setState({offset: offset, currentPagination:data.selected});
    //Returns dictionary from server in the format: {url1: {snippet, image_url, title, tags, retrieved}} (tags are a list, potentially empty)
    var tempSession = JSON.parse(JSON.stringify(this.props.session));
    tempSession["from"] = offset;
    this.getPages(tempSession);
  }

  //Remove or Add tags from elasticSearch
  removeAddTagElasticSearch(urls, current_tag, applyTagFlag ){
    console.log("el");
    console.log(urls);
    $.post(
      '/setPagesTag',
      {'pages': urls.join('|'), 'tag': current_tag, 'applyTagFlag': applyTagFlag, 'session':  JSON.stringify(this.props.session)},
      function(message) {
        //updateing filters Tags
        this.props.reloadFilters();
        this.updateOnlineClassifier(this.props.session);
        this.forceUpdate();
      }.bind(this)
    );
  }

  //If the tag already exits then it is removed from elasticsearch, in other case it is applied. If it is a Neutral tag then Relevant and Irrelevant tags are removed.
  removeTags(arrayInputURL,  tag){
    var updatedPages = JSON.parse(JSON.stringify(this.state.pages));
    var totalTagRemoved = 0;
    //Removing Relevant, Irrelevant tag
    for (var i in arrayInputURL) {
        var url = arrayInputURL[i];
        var urls =[];
        urls.push(url);
        var auxKey = "0";
        if(updatedPages[url]["tags"]){
            var temp = Object.keys(updatedPages[url]["tags"]).map(key => {
                        var itemTag = updatedPages[url]["tags"][key].toString();
                        if(itemTag==="Relevant" || itemTag==="Irrelevant"){
                          delete updatedPages[url]["tags"][key];
                          this.removeAddTagElasticSearch(urls, itemTag, false ); //Remove tag
                        }
                      });
            delete updatedPages[url]["tags"]; //Removing tag on the interface
        }
        if(tag!=="Neutral"){ //Applying tag on the interface it is different to a Neutral tag
          updatedPages[url]["tags"]=[];
          updatedPages[url]["tags"][auxKey] = tag;
        }
        if(!this.props.session['selected_tags'].split(",").includes(tag) && this.props.session['selected_tags'] !== "" ){
          totalTagRemoved++;
          delete updatedPages[url];
        }
    }
    this.setState({ pages:updatedPages, lengthTotalPages: this.state.lengthTotalPages - totalTagRemoved});
    this.forceUpdate();

    return updatedPages;
  }

  //Handling click event on the tag button. When it is clicked it should update tag of the page in elasticsearch.
  onTagAllPages(inputTag){
    var arrayInputURL =this.currentUrls;
    var tag = inputTag;
    if(tag==="Relevant"  || tag==="Irrelevant"){
      this.removeTags(arrayInputURL, tag);
      this.removeAddTagElasticSearch(arrayInputURL, tag, true ); //Applying the new tag
    }
    else{
      this.removeTags(arrayInputURL, tag);
    }

  }

    //Handling click event on the tag button. When it is clicked it should update tag of the page in elasticsearch.
    onTagActionClicked(inputURL, inputTag){
      var idButton = (inputTag).split("-"); // (ev.target.id).split("-")
      var tag = idButton[0];
      var url = inputURL; // ev.target.value;
      var action = 'Apply';
      var isTagPresent = false;
      var updatedPages = JSON.parse(JSON.stringify(this.state.pages));
      if(tag ==="Neutral"){
        let arrayInputURL = [];
        arrayInputURL.push(url);
        this.removeTags(arrayInputURL,  tag);
      }
      else{
        if(updatedPages[url]["tags"]){
           isTagPresent = Object.keys(updatedPages[url]["tags"]).map(key => updatedPages[url]["tags"][key]).some(function(itemTag) {
                                      return itemTag === tag;});
           if(isTagPresent) action = 'Remove';
        }
        // Apply or remove tag from urls.
        var applyTagFlag = action === 'Apply';
        var urls = [];
        urls.push(url);
        if (applyTagFlag && !isTagPresent) {
          // Removes tag when the tag is present for item, and applies only when tag is not present for item.
          var auxKey = "0";
          if(updatedPages[url]["tags"] && (tag==="Relevant"  || tag==="Irrelevant")){ // || tag==="Neutral")){
              var temp = Object.keys(updatedPages[url]["tags"]).map(key => {
                          var itemTag = updatedPages[url]["tags"][key].toString();
                          if(itemTag==="Relevant" || itemTag==="Irrelevant"){// || itemTag==="Neutral"){
                            delete updatedPages[url]["tags"][key];
                            this.removeAddTagElasticSearch(urls, itemTag, false );
                          }
                        });
              delete updatedPages[url]["tags"];
          }
          updatedPages[url]["tags"]=[];
          updatedPages[url]["tags"][auxKey] = tag;
          //checking if the new tag belong to the filter
          if(!this.props.session['selected_tags'].split(",").includes(tag) && this.props.session['selected_tags'] !== "" ){
            this.setState({ pages:updatedPages, lengthTotalPages: this.state.lengthTotalPages - 1});
            delete updatedPages[url];
          }
          //  setTimeout(function(){ $(nameIdButton).css('background-color','silver'); }, 500);
          this.setState({ pages:updatedPages});
          this.removeAddTagElasticSearch(urls, tag, applyTagFlag ); //Add tag

        }
        else{
          delete updatedPages[url]["tags"];
          this.setState({ pages:updatedPages});
          this.removeAddTagElasticSearch(urls, tag, applyTagFlag );//Remove tag
        }
      }

    }
  getTag(k){
    var uniqueTag = (Object.keys(this.state.pages[k]["tags"]).length > 0) ? (this.state.pages[k]["tags"]).toString():(this.state.pages[k]["tags"][Object.keys(this.state.pages[k]["tags"]).length-1]).toString();
    return uniqueTag;
  }
  clicktext(urllink){
      this.setState({custom_tag_val:""});
      this.customTagPages.push(urllink);
  }

createChip(inputURL){
    if(this.state.custom_tag_val !== ""){
	//this.removeAddTagElasticSearch(this.customTagPages, this.state.custom_tag_val, true);
  var currentPages = this.state.pages;
  Object.keys(currentPages).filter(function(page){
    return page === inputURL;
  }).map((page)=>{
      var k = page;
      if(currentPages[k]["tags"] !== undefined)
        currentPages[k]["tags"].push( this.state.custom_tag_val);
      else currentPages[k]["tags"] = [this.state.custom_tag_val];
  });
  this.setState({pages:currentPages});
  this.removeAddTagElasticSearch(this.customTagPages, this.state.custom_tag_val, true);
	this.forceUpdate();
    }
  }


 renderCustomTag(data){
    return ( <Chip style={{margin:4}}
        key={data.key}
        onRequestDelete={() => this.handleRequestDelete(data.url,data.label)}
      >
        {data.label}
      </Chip>
    );
}


 onCustomTag(event){
	var value = event.target.value;
	var empty = "";
	this.setState({custom_tag_val: value});
	this.forceUpdate();

    }

 handleRequestDelete = (url,key) => {
	console.log("HANDLE REQUEST DELETE " + key);
//  console.log(this.customTagPages);
  var current = [];
  current.push(url);
  var currentPages = this.state.pages;
  this.state.pages[url]["tags"].pop(key);

	this.removeAddTagElasticSearch(current,key, false);
  this.forceUpdate();
  //this.removeTags(this.customTagPages, key);
    }

  render(){
    //console.log("SnippetsPAges------------");
    //'/setPagesTag', {'pages': pages.join('|'), 'tag': tag, 'applyTagFlag': applyTagFlag, 'session': JSON.stringify(session)}, onSetPagesTagCompleted);
    var id=0;
    var c=0;
    var currentPageCount = (this.state.lengthTotalPages/this.perPage);
    var messageNumberPages = (this.state.offset===0)?"About " : "Page " + (this.state.currentPagination+1) +" of about ";
    this.currentUrls=[];
    var relev_total = 0; var irrelev_total = 0; var neut_total = 0;
    var urlsList = Object.keys(this.state.pages).map((k, index)=>{
      var chip = [];
      if(this.state.pages[k]["tags"]){
             let uniqueTag="";
             uniqueTag = this.getTag(k);
             if(uniqueTag==='Relevant')relev_total++;
             if(uniqueTag==='Irrelevant')irrelev_total++;
             if(uniqueTag==='Neutral')neut_total++;
             var data = this.state.pages[k]["tags"].filter(function(tag){
               return tag !== "Relevant" && tag !== "Irrelevant" && tag !== "Neutral" && tag !== undefined
             }).map((tag, index)=>{
                return {'key':index, 'label':tag, 'url':k}

             });
             chip =data.map(this.renderCustomTag.bind(this));

        }
        else{
            neut_total++;
        }
        let colorTagRelev = "";
        let colorTagIrrelev="";
        let colorTagNeutral="";
        let uniqueTag="";
        if(this.state.pages[k]["tags"]){
           uniqueTag = this.getTag(k);
           colorTagRelev=(uniqueTag==='Relevant')?"#4682B4":"silver";
           colorTagIrrelev=(uniqueTag==='Irrelevant')?"#CD5C5C":"silver";
           colorTagNeutral=(uniqueTag==='Neutral')?'silver':"silver";
        }
        else{
           colorTagRelev=colorTagIrrelev=colorTagNeutral="silver";
        }

        id++;
        let urlLink= (k.length<110)?k:k.substring(0,109);
        let tittleUrl = (this.state.pages[k]["title"] === "" || this.state.pages[k]["title"] === undefined )?k.substring(k.indexOf("//")+2, k.indexOf("//")+15) + "..." : this.state.pages[k]["title"] ;
        let imageUrl=(this.state.pages[k]["image_url"]==="")? NoFoundImg:this.state.pages[k]["image_url"];

        this.currentUrls.push(k);

        return <ListItem key={index}  >
        <div style={{  minHeight: '60px',  borderColor:"silver", marginLeft: '8px', marginTop: '3px', fontFamily:"arial,sans-serif"}}>
          <div>
            <p style={{float:'left'}}><img src={imageUrl} onError={(ev) => { ev.target.src = NoFoundImg;}} style={{width:'60px',height:'60px', marginRight:'3px'}}/></p>
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
            <p style={{float:'right', margin:4}}>
            <TextField style={{width:'100px'}} hintText="Add Tag"  onClick={this.clicktext.bind(this,k)} onChange={this.onCustomTag.bind(this)} onKeyPress={(e) => {(e.key === 'Enter') ? this.createChip(k,this) : null}}></TextField>
            </p>
            <p>
              <a target="_blank" href={k} style={{ fontSize:'18px',color:'#1a0dab'}} >{tittleUrl}</a>
              <br/>
              <p style={{fontSize:'14px', color:'#006621', marginBottom:4, marginTop:2}}>{urlLink}</p>
              <p style={{  fontSize:'13px', color:'#545454'}}>{this.state.pages[k]["snippet"]}</p>
            </p>
            <div style={{display: 'flex',flexWrap: 'wrap'}}>
            {chip}
            </div>
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
          <p style={{float:"left", color: "#757575", fontSize: "13px", fontWeight: "500", paddingLeft: "72px",}}> {messageNumberPages}  {this.state.lengthTotalPages} results. </p>
          <p style={{float:"right", color: "#757575", fontSize: "14px", fontWeight: "500", paddingRight: "20px",}}>  Accuracy of onlineClassifier: {this.state.accuracyOnlineLearning} % </p>
        </div>
        <div style={{marginBottom:"50px", marginTop:"-10px"}}>
          <p style={{float:"right", fontSize: "14px", fontWeight: "500", paddingRight: "20px",}}>
            <RaisedButton label="Tag All" labelPosition="before"  backgroundColor={"#BDBDBD"} style={{ marginRight:4}}   labelStyle={{textTransform: "capitalize"}} icon={<RelevantFace color={"#4682B4"} />} onClick={this.onTagAllPages.bind(this,"Relevant")}/>
            <RaisedButton label="Tag All" labelPosition="before" backgroundColor={"#BDBDBD"} style={{marginRight:4}}  labelStyle={{textTransform: "capitalize"}} icon={<IrrelevantFace color={"#CD5C5C"}/>} onClick={this.onTagAllPages.bind(this,"Irrelevant")}/>
            <RaisedButton label="Tag All" labelPosition="before"  backgroundColor={"#BDBDBD"}  labelStyle={{textTransform: "capitalize"}} icon={<NeutralFace  color={"#FAFAFA"}/>} onClick={this.onTagAllPages.bind(this,"Neutral")}/>
          </p>
        </div>
        <div style={{marginTop:"80px"}} >
          <List>
          {urlsList}
          <Divider inset={true} />
          </List>
          <div style={{display: "table", marginRight: "auto", marginLeft: "auto",}}>
            <ReactPaginate previousLabel={"previous"}
                           nextLabel={"next"}
                           initialPage={0}
                           forcePage={this.state.currentPagination}
                           breakLabel={<a >...</a>}
                           breakClassName={"break-me"}
                           pageCount={currentPageCount}
                           marginPagesDisplayed={3}
                           pageRangeDisplayed={8}
                           onPageChange={this.handlePageClick.bind(this)}
                           containerClassName={"pagination"}
                           subContainerClassName={"pages pagination"}
                           activeClassName={"active"} />
          </div>
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
      lengthTotalPages:0,
    };
    this.newPages = true;
    this.queryFromSearch=true;
  }

  //Returns dictionary from server in the format: {url1: {snippet, image_url, title, tags, retrieved}} (tags are a list, potentially empty)
  getPages(session){
    var tempSession = session;
    tempSession["from"]=0;
    $.post(
      '/getPages',
      {'session': JSON.stringify(tempSession)},
      function(pages) {
        this.newPages=true;
        this.setState({session:tempSession, pages:pages["data"]["results"], sessionString: JSON.stringify(tempSession), lengthPages : Object.keys(pages['data']["results"]).length,  lengthTotalPages:pages['data']['total'], });
      }.bind(this)
    );
  }

  //Loads pages in the first time.
  componentWillMount(){
      this.loadPages(this.props.session, this.queryFromSearch);
  }

  //Handling SwipeableViews.
  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  //Loads pages
  loadPages(session, queryFromSearch){
      this.getPages(session);
  }

  //If there are any change in the session like a new filter, then getPages() is called.
  componentWillReceiveProps(nextProps, nextState){
    this.queryFromSearch = (nextProps.queryFromSearch ===undefined)?false:true;
  	/*if (nextProps.pages !== this.state.pages) {
  	    this.setState({pages:nextProps.pages, lengthPages : Object.keys(nextProps.pages).length});
  	    this.forceUpdate();
  	}*/
  	if (JSON.stringify(nextProps.session) !== this.state.sessionString || this.queryFromSearch) {
      this.newPages = false;
      this.loadPages(nextProps.session, this.queryFromSearch);
  	}else{
        return;
    }
  }

  //Updates selected filters.
  deletedFilter(sessionTemp){
    this.loadPages(sessionTemp, this.queryFromSearch);
    this.props.deletedFilter(sessionTemp);
  }


  //If the view is changed (snippet, visualization or model) or session is update then we need to rerender.
  shouldComponentUpdate(nextProps, nextState) {
    this.queryFromSearch = (nextProps.queryFromSearch ===undefined)?false:true;
    if ((JSON.stringify(nextProps.session) !== this.state.sessionString && this.newPages) || nextState.slideIndex !== this.state.slideIndex ||this.queryFromSearch ) { //'""' if there is some selected tag.   || JSON.stringify(this.props.session['selected_tags'])!='""'
          return true;
    }
    if(!this.queryFromSearch && this.state.lengthTotalPages===0) return true;

    return false;
  }

  reloadFilters(){
    this.props.reloadFilters();
  };

  availableCrawlerButton(isthereModel){
    this.props.availableCrawlerButton(isthereModel);
  };


  render() {
    var searchOtherEngine = "No Pages Found.";
    if(this.state.session['newPageRetrievalCriteria'] === "one" &&  this.state.session['pageRetrievalCriteria'] === "Queries"){
      searchOtherEngine = (this.state.session['search_engine']==='BING')?"Query failed. Try Google.":(this.state.session['search_engine'] === 'GOOG')?"Query failed. Try Bing.":"";
    }
    var messageSearch = (this.queryFromSearch)? "Searching..." :searchOtherEngine;
    //if(!this.queryFromSearch && this.state.lengthTotalPages==0)
    var showPages = (Object.keys(this.state.pages).length>0)?<ViewTabSnippets
    lengthTotalPages={this.state.lengthTotalPages} session={this.state.session} pages={this.state.pages} deletedFilter={this.deletedFilter.bind(this)}
    reloadFilters={this.reloadFilters.bind(this)} queryFromSearch={this.queryFromSearch} availableCrawlerButton={this.availableCrawlerButton.bind(this)}/>
    : (this.state.lengthPages===0)? <div style={{paddingTop:"20px", paddingLeft:"8px",}}> {messageSearch}</div> : <CircularProgressSimple />;

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
