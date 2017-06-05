import React, { Component } from 'react';
import Body from './Body';
import Header from './Header';

class Domain extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idDomain:'',
      deleteKeywordSignal:false,
      reloadBody:true,
      noModelAvailable:true,
      updateCrawlerData:"",
      filterKeyword:null,
    };

  };

componentWillMount(){
    this.setState({idDomain: this.props.location.query.idDomain});
};

componentWillReceiveProps  = (newProps, nextState) => {
  if(newProps.location.query.idDomain ===this.state.idDomain){
    return;
  }
  this.setState({idDomain: this.props.location.query.idDomain});

};

shouldComponentUpdate(nextProps, nextState) {
  if(nextProps.location.query.idDomain ===this.state.idDomain){
        return false;
   }
    return true;
};

//This function is called from Header component when user applies a filter by keyword (serch by keyword)
filterKeyword(newFilterKeyword){
    this.setState({filterKeyword:newFilterKeyword, deleteKeywordSignal:false, reloadBody:true });
    this.forceUpdate();
}
//This function is called from the Body. Check if there is a available model for the current domain.
availableCrawlerButton(noModelAvailable){ //false means that there is a available model
    this.setState({noModelAvailable:noModelAvailable,reloadBody:false });
    this.forceUpdate();
}

//This function is called from the Body. It just update the Header in order to clear the textfield associated with the search by keyword.
deletedFilter(filter_Keyword){
  this.setState({ deleteKeywordSignal:true, reloadBody:false });
  this.forceUpdate();
}
//if updateCrawlerData is true, then the filter 'crawler data' should be updated because the crawler is still running.
updateFilterCrawlerData(updateCrawlerData){
  this.setState({ updateCrawlerData:updateCrawlerData, reloadBody:true });
  this.forceUpdate();
  if(updateCrawlerData==="stopCrawler"){
      this.setState({ updateCrawlerData:"", reloadBody:true });
      this.forceUpdate();
  }
}

render() {
    //console.log("HEADER " + this.state.filterKeyword);
  return (
    <div>
	     <Header deleteKeywordSignal={this.state.deleteKeywordSignal} currentDomain={this.props.location.query.nameDomain} idDomain={this.props.location.query.idDomain} filterKeyword={this.filterKeyword.bind(this)} noModelAvailable={this.state.noModelAvailable} updateFilterCrawlerData={this.updateFilterCrawlerData.bind(this)}/>
       <Body updateCrawlerData={this.state.updateCrawlerData} nameDomain={this.props.location.query.nameDomain} currentDomain={this.state.idDomain} filterKeyword={this.state.filterKeyword} deletedFilter={this.deletedFilter.bind(this)} availableCrawlerButton={this.availableCrawlerButton.bind(this)} reloadBody={this.state.reloadBody}/>
    </div>
  );
}
}

export default Domain;
