
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
    super(props);
    this.state={
      flat:this.props.flat,
      session: {},
    }
  }

  componentWillMount(){
    this.setState({
        flat:this.props.flat,
        session:this.props.session,
    });
  }

  componentWillReceiveProps(nextProps){
    if (nextProps === this.props) {
        return;
    }
    console.log(this.props.flat);
    console.log("view");
    // Calculate new state
    this.setState({
        flat:this.props.flat,
        session:this.props.session,
    });
  }

  render(){
    console.log(this.props.flat);
    return(
      <Card initiallyExpanded={true} style={styles.card}>
           <CardMedia expandable={true} style={styles.cardMedia}>
              <ViewTabs domainId={this.props.domainId} session={this.state.session}/>
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
