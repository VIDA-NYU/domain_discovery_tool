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


class ViewTabSnippets extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      pages:[],
      session:{},
      chipData: [],
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
  };

  componentWillMount(){
    this.setState({
        session:this.props.session,
        pages:this.props.pages,
    });
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.session === this.props.session) {
        return;
    }
    // Calculate new state
    console.log("viwtabs");
    var session = this.props.session; //this.createSession(this.props.domainId, this.state.search_engine, this.state.activeProjectionAlg, this.state.pagesCap,this.state.fromDate, this.state.toDate, this.state.filter, this.state.pageRetrievalCriteria, this.state.selected_morelike, this.state.model);
    var queriesList =[];
    queriesList = session['selected_queries'].length>0 ? session['selected_queries'].split(",") : queriesList;
    var tagsList=session['selected_tags'].length>0 ? queriesList.concat(session['selected_tags'].split(",")) : queriesList  ;
    var newChip = [];
    for(var i=0; i<queriesList.length && queriesList.length>0; i++){
      newChip.push({key: i, label: queriesList[i], avatar: Qicon});
    }
    for(var i=0; i<tagsList.length && queriesList.length>0; i++){
      newChip.push({key: i, label: tagsList[i], avatar:Ticon});
    }
    this.setState({
      chipData:newChip,
    });
  }


  handleRequestDelete = (key) => {
        this.chipData = this.state.chipData;
        const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(key);
        this.chipData.splice(chipToDelete, 1);
        this.setState({chipData: this.chipData});
  };
  //onTouchTap={handleTouchTap}

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
    if (nextProps.session === this.props.session && nextState.pages === this.state.pages ) {
         return false;
    }
     return true;
  }


  render(){
    console.log(this.state.pages);
    return (
      <div>
      {
        <List>
        <Subheader inset={true}>100 pages </Subheader>
        {this.state.pages.map((page, index) => (
          <ListItem key={index}
          leftAvatar={<Avatar icon={<FileFolder />} />}
          rightToggle={<Toggle />}
          primaryText={page[0]}
          secondaryText={"page[1]"}
          />
        ))}
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
        paginas =pages["data"]["pages"];
        this.setState({session:this.props.session, pages:paginas,});
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
    if (nextProps.session === this.props.session) {
        return;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.session === this.props.session && nextState.pages === this.state.pages ) {
        if(nextState.slideIndex === this.state.slideIndex){
          return false;
        }
         return true;
    }
     return true;
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
    console.log('---viewTabs---');
    /*if(this.state.pages!==undefined)
    var doubles = this.state.pages.map(function(page) {
      //console.log("pag: " + page[0]);
      return 0;
    });*/
    //console.log(this.state.currentPages);
    if(this.state.pages.length>0){
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
              <Tab label="Model" value={2} style={styles.tab} />
          </Tabs>

          <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange}  >

            <div style={styles.headline}>
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
