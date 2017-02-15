import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
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
    console.log("ChipViewTab componentWillReceiveProps before");
    if (JSON.stringify(nextProps.session) === this.state.sessionString ) {
        return;
    }
    // Calculate new state
    console.log("ChipViewTab componentWillReceiveProps after");
    var session = nextProps.session; //this.createSession(this.props.domainId, this.state.search_engine, this.state.activeProjectionAlg, this.state.pagesCap,this.state.fromDate, this.state.toDate, this.state.filter, this.state.pageRetrievalCriteria, this.state.selected_morelike, this.state.model);
    var queriesList =[], tagsList =[];
    queriesList = session['selected_queries'] !=="" ? session['selected_queries'].split(",") : queriesList;
    tagsList=session['selected_tags']!=="" ? session['selected_tags'].split(",") : tagsList;

    var newChip = [];
    for(var i=0; i<queriesList.length && queriesList.length>0; i++){
      newChip.push({key: i, type: 0, label: queriesList[i], avatar: Qicon});
    }
    for(var i=(queriesList.length), j=0; i<(tagsList.length+queriesList.length) && tagsList.length>0 ; i++, j++){
      newChip.push({key: i, type: 1, label: tagsList[j], avatar:Ticon});
    }
    if(session['filter']){newChip.push({key: (queriesList.length + tagsList.length ), type: 2, label: session['filter'] , avatar: Searchicon});
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
        }
        if(sessionTemp['selected_queries'] === "" && sessionTemp['selected_tags'] === ""){
           sessionTemp['pageRetrievalCriteria'] = "Most Recent";
        }

        console.log(JSON.stringify(sessionTemp));
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
      console.log("ChipViewTab shouldComponentUpdate before");
      if(JSON.stringify(nextProps.session)!== this.state.sessionString) {
        return true;
      }
      console.log("ChipViewTab shouldComponentUpdate after");
      return false;
  }

  render(){
    console.log("--------------ChipViewTab--------------");
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
      selectedIndex: 0,
    };
  }

  componentWillMount(){
    this.setState({
        session:this.props.session, sessionString: JSON.stringify(this.props.session), pages:this.props.pages,
    });
  }

  componentWillReceiveProps(nextProps, nextState){
    console.log("ViewTabSnippets componentWillReceiveProps before");
    if (JSON.stringify(nextProps.session) === this.state.sessionString && nextProps.pages === this.state.pages ) { // ||
        return;
    }
    console.log("ViewTabSnippets componentWillReceiveProps after");
    this.setState({
      pages:nextProps.pages, pages:nextProps.pages, session:nextProps.session, sessionString: JSON.stringify(nextProps.session)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("ViewTabSnippets shouldComponentUpdate before");
    if (JSON.stringify(nextProps.session) !== this.state.sessionString  || nextState.pages !== this.state.pages || nextState.selectedIndex !== this.state.selectedIndex) { //&&
         return true;
    }
    console.log("ViewTabSnippets shouldComponentUpdate after");
     return false;
  }



  select = (index) => this.setState({selectedIndex: index});
  render(){
    console.log("------------------ViewTabSnippets-----------------");
    console.log(this.state.pages);
    //'/setPagesTag', {'pages': pages.join('|'), 'tag': tag, 'applyTagFlag': applyTagFlag, 'session': JSON.stringify(session)}, onSetPagesTagCompleted);
    var image ='url image';
    var urlsList = Object.keys(this.state.pages).map((k, index)=>{
                      //let currentTag=
                    let colorTagRelev="";
                    let colorTagIrrelev="";
                    let colorTagNeutral="";
                    if(this.state.pages[k]["tags"] === undefined || this.state.pages[k]["tags"] === null){
                        colorTagRelev=colorTagIrrelev=colorTagNeutral="silver";
                    }
                    else{
                      colorTagRelev=(this.state.pages[k]["tags"].toString()==='Relevant')?"#4682B4":"silver";
                      colorTagIrrelev=(this.state.pages[k]["tags"].toString()==='Irrelevant')?"#CD5C5C":"silver";
                      colorTagNeutral=(this.state.pages[k]["tags"].toString()!=='Relevant' && this.state.pages[k]["tags"].toString()!=="Irelevant")?'silver':"silver";
                    }
                        return <ListItem key={index}
                        >
                        <div style={{  minHeight: '60px',  borderColor:"silver", marginLeft: '8px', marginTop: '3px',}}>
                          <div>
                            <p style={{float:'left'}}><img src={this.state.pages[k]["image_url"]} alt="HTML5 Icon" style={{width:'60px',height:'60px', marginRight:'3px'}}/></p>
                            <p style={{float:'right'}}>
                            <ButtonGroup bsSize="small">
                              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Relevant</Tooltip>}>
                                <Button style={{backgroundColor:colorTagRelev}} >Relev</Button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Irrelevant</Tooltip>}>
                                <Button style={{backgroundColor:colorTagIrrelev}} >Irrel</Button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Neutral</Tooltip>}>
                                <Button style={{backgroundColor:colorTagNeutral}} >Neutr</Button>
                              </OverlayTrigger>
                            </ButtonGroup></p>
                            <p><a target="_blank" href={k} style={{ color:'blue'}} >{this.state.pages[k]["title"] + this.state.pages[k]["tags"]}</a> <br/><a target="_blank" href={k} style={{fontSize:'11px'}}>{k}</a></p>
                          </div>
                          <br/>
                          <div style={{marginTop:'-3px'}}> <p>{this.state.pages[k]["snippet"]}</p> </div>
                          <Divider />
                        </div>
                        </ListItem>;
                      });

    return (
      <div>
      {
        <List>
        <Subheader inset={true}>{urlsList.length} pages </Subheader>
        {urlsList}
        <Divider inset={true} />
        </List>
      }
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




class ViewTabs extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      slideIndex: 0,
      pages:[],
      sessionString:"",
      session:{},
      chipData: [],
    };
    //this.processResults = this.processResults.bind(this)
  }

  processResults (error, data){
      this.setState({"data":data});
  }

  componentWillMount(){
    console.log("viwtabs componentWillMount");
    let paginas = [];
    $.post(
      '/getPages',
      {'session': JSON.stringify(this.props.session)},
      function(pages) {
        paginas =pages["data"];
        console.log(paginas.length);
        this.setState({session:this.props.session, pages:paginas, sessionString: JSON.stringify(this.props.session)});
        //this.forceUpdate();
      }.bind(this)
    );
  //  csv("https://raw.githubusercontent.com/uiuc-cse/data-fa14/gh-pages/data/iris.csv", this.processResults);
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  componentWillReceiveProps(nextProps){
    console.log("viwtabs componentWillReceiveProps before");
    if (JSON.stringify(nextProps.session) === this.state.sessionString) {
        return;
    }
    console.log("viwtabs componentWillReceiveProps after");
    let paginas = [];
    $.post(
      '/getPages',
      {'session': JSON.stringify(nextProps.session)},
      function(pages) {
        paginas =pages["data"];
        this.setState({session:nextProps.session, pages:paginas, sessionString: JSON.stringify(nextProps.session)});
        //this.forceUpdate();
      }.bind(this)
    );
  }

  deletedFilter(sessionTemp){
    let paginas = [];
    $.post(
      '/getPages',
      {'session': JSON.stringify(sessionTemp)},
      function(pages) {
        paginas =pages["data"];
        this.setState({session:sessionTemp, pages:paginas, sessionString: JSON.stringify(sessionTemp)});
        //this.forceUpdate();
      }.bind(this)
    );
    this.props.deletedFilter(sessionTemp);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("viwtabs shouldComponentUpdate before");
    console.log("NEXT PAGES");
    console.log(nextState.pages);
    if (JSON.stringify(nextProps.session) !== this.state.sessionString  || nextState.pages !== this.state.pages || nextState.slideIndex !== this.state.slideIndex) { //
          return true;
    }
    console.log('viwtabs shouldComponentUpdate after');
    console.log(JSON.stringify(nextProps.session));
    console.log(this.state.sessionString);
    console.log(nextState.pages);
    console.log(this.state.pages);
     return false;
  }


  render() {
    /*let dimensions= ["petal_length", "petal_width", "sepal_length", "sepal_width"];
    let dnames = ["Petal Length", "Petal Width", "Sepal Length", "Sepal Width"];
    let pairs = [];
    for (let i = 0; i < dimensions.length-1; i++){
      for (let j = i+1; j < dimensions.length; j++){
        pairs.push({'dimensions':[dimensions[i], dimensions[j]],
                    'names': [dnames[i], dnames[j]]});
      }
    }

    var urls = [];
    var urlName = ["url1", "url12", "url13", "url14", "url15"];
    var urlDescription = ["urlDescription1", "urlDescription2", "urlDescription3", "urlDescription4", "urlDescription5"];

    for (let i = 0; i < urlName.length; i++) {
        urls.push({
            name: urlName[i],
            description: urlDescription[i],
        });
    }
*/
    console.log('-------viewTabs------');
    if(Object.keys(this.state.pages).length>0){
      console.log('---into if viewTabs---');
      return (
        <div>
          <Tabs
            onChange={this.handleChange}
            value={this.state.slideIndex}
            inkBarStyle={{background: '#7940A0' ,height: '4px'}}
            tabItemContainerStyle={{background:'#9A7BB0', height: '40px'}}>
              <Tab label="Snippets" value={0} style={styles.tab} />
              <Tab label="Visualizations" value={1} style={styles.tab} />
              <Tab label="Model" value={2} style={styles.tab} />/#/domain/DataClassification?idDomain=AVbn5nq4HqwA5r9bnKWr&nameDomain=Data+Classification
          </Tabs>

          <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange}  >

            <div style={styles.headline}>
              <ChipViewTab  session={this.state.session} deletedFilter={this.deletedFilter.bind(this)}/>
              <ViewTabSnippets session={this.state.session} pages={this.state.pages}/>
            </div>

            <div style={styles.headline}>
            </div>

            <div style={styles.headline}>
              <Checkbox label="Neutral" style={styles.checkbox}  />
              <Checkbox label="Relevant" style={styles.checkbox}  />
              <Checkbox label="Irrelevante" style={styles.checkbox}  />
            </div>

          </SwipeableViews>
        </div>
      );
    }
    return(
      <CircularProgressSimple />
    );

  }
}

export default ViewTabs;
/*  {pairs.map((p)=>{
      return (
          <Scatterplot title={p['names'][0] + " x " + p['names'][1]} data={this.state.data}
              xAcessor={(d)=>d[p['dimensions'][0]]} yAcessor={(d)=>d[p['dimensions'][1]]} labelAcessor={(d)=>d["species"]}
              xLabel={p['names'][0]} yLabel={p['names'][1]}/>
        )
  })}*/
