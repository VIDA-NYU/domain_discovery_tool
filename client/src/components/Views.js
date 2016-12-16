
import React, {Component} from 'react';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';
import ViewTabs from './ViewTabs';
import Avatar from 'material-ui/Avatar';
import CheckList from 'material-ui/svg-icons/av/playlist-add-check';

const styles = {
  card: {
    paddingLeft: '15px',
    background: 'white',
    borderRadius: '0px 0px 0px 0px',
  },
  cardHeader:{
    background: 'white',
    padding:'0px 8px 0px 8px',
    borderRadius: '0px 0px 0px 0px',
  },
  avatar:{
    margin:'-20px 8px 0px 0px',
  },
  cardMedia:{
    padding:'2px 6px 2px 6px',
    borderRadius: '0px 0px 0px 0px',
  },

};

class Views extends Component{

  constructor(props){
    console.log("view constructor");
    super(props);
    this.state={
      sessionString:"",
      session: {},
    }
  }

  componentWillMount(){
    console.log("view componentWillMount");
    this.setState({
        session:this.props.session, sessionString: JSON.stringify(this.props.session)
    });
  }

  componentWillReceiveProps(nextProps){
    console.log("view before componentWillReceiveProps");
    if(JSON.stringify(nextProps.session) === this.state.sessionString) {
        return;
    }
    console.log("view after componentWillReceiveProps");
    // Calculate new state
    this.setState({
        session:nextProps.session, sessionString: JSON.stringify(nextProps.session)
    });
  }

  deletedFilter(sessionTemp){
    this.setState({
        session:sessionTemp, sessionString: JSON.stringify(sessionTemp)
    });
    this.props.deletedFilter(sessionTemp);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("view shouldComponentUpdate");
    if(JSON.stringify(nextState.session) === this.state.sessionString) {
           return false;//false
    }
    return true;
 }


  render(){
    console.log('----view---');
    return(
      <Card initiallyExpanded={true} style={styles.card}>
           <CardMedia expandable={true} style={styles.cardMedia}>
              <ViewTabs domainId={this.props.domainId} session={this.state.session} deletedFilter={this.deletedFilter.bind(this)}/>
           </CardMedia>
       </Card>
    )
  }
}

export default Views;

/*
<CardHeader
  //title="View"
  //avatar={ <Avatar color={'white'} backgroundColor={'#7D49A1'} size={25} style={styles.avatar} icon={<CheckList />} />}
   style={styles.cardHeader}
  actAsExpander={true}
  showExpandableButton={true}



/>
*/
