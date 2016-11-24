import React, {Component} from 'react';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';

import Home from 'material-ui/svg-icons/action/home';

const styles = {
  card: {

    borderStyle: 'solid',
    borderColor: '#C09ED7',
    background: 'white',
    borderRadius: '0px 0px 0px 0px',
    borderWidth: '0px 0px 1px 0px'
  },
  avatar:{
    margin:'-4px 8px 0px 0px',
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
    border:'solid',
    borderColor: '#C09ED7',
  },

};

class DomainInfo extends Component{

  constructor(props) {
    super(props);
    this.state = {
      expanded: this.props.statedCard,
    };
  };

  componentWillMount = () => {
   this.setState({expanded: this.props.statedCard, valueT: true,});
  };

  componentWillReceiveProps  = (newProps) => {
       this.setState({expanded: this.props.statedCard}, function() {
            this.setState({expanded: this.props.statedCard});
       });
   };

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
    if(expanded){
      this.props.setActiveMenu(expanded, 2);
    }
  };

  handleToggle = (event, toggle) => {
    console.log("handleToggle");
    this.setState({expanded: toggle});
  };

  handleExpand = () => {
    console.log("expand");
    this.setState({expanded: true});
  };

  handleReduce = () => {
    console.log("reduce");
    this.setState({expanded: false});
  };

  render(){

    return(
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange} style={styles.card}>
           <CardHeader
             title="Domain information"
             avatar={ <Avatar color={'white'} backgroundColor={'#7940A0'} size={this.props.sizeAvatar} style={styles.avatar} icon={<Home />} />}
             style={styles.cardHeader}
             actAsExpander={true}
             showExpandableButton={true}
           />
           <CardMedia expandable={true} style={styles.cardMedia}>
            <p>Information about current domain.</p>
           </CardMedia>
       </Card>
    )
  }
}

export default DomainInfo;
