import React, {Component} from 'react';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';
import FiltersTabs from './FiltersTabs';
import Avatar from 'material-ui/Avatar';
import CheckList from 'material-ui/svg-icons/av/playlist-add-check';

const styles = {
  card: {
    background: 'white',
    borderRadius: '0px 0px 0px 0px',
    borderStyle: 'solid',
    borderColor: '#C09ED7',
    borderWidth: '1px 0px 1px 0px'

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
    padding:'0px 4px 2px 4px',
    borderRadius: '0px 0px 0px 0px',
  },

};

class Filters extends Component{

    constructor(props) {
      super(props);
      this.state = {
        expanded: undefined,
        session: undefined,

      };
    }

    componentWillMount(){
      console.log("filter componentWillMount");
     this.setState({
       expanded: this.props.statedCard,
       session:this.props.session,
       });
    }

    componentWillReceiveProps(nextProps) {
      console.log("filter before componentWillReceiveProps");
        if (nextProps === this.props) {
            return;
        }
        console.log("filter after componentWillReceiveProps");
        // Calculate new state
        this.setState({expanded: this.props.statedCard}, function() {
             this.setState({expanded: this.props.statedCard});
        });
        this.setState({
          session:this.props.session,

        });
    }

    handleExpandChange = (expanded) => {
      this.setState({expanded: expanded});
      if(expanded){
        this.props.setActiveMenu(expanded, 1);
      }
    }

    handleToggle = (event, toggle) => {
      this.setState({expanded: toggle});
    }

    handleExpand = () => {
      this.setState({expanded: true});
    }

    handleReduce = () => {
      this.setState({expanded: false});
    }
    updateSession(newSession){
      console.log('filter newSession');
      console.log(newSession);
      this.props.updateSession(newSession);
    }


  render(){
    console.log("Filters");
    return(
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange} style={styles.card}>
           <CardHeader
             title="Filters"
             avatar={ <Avatar color={'white'} backgroundColor={'#7940A0'} size={this.props.sizeAvatar} style={styles.avatar} icon={<CheckList />} />}
             style={styles.cardHeader}
             actAsExpander={true}
             showExpandableButton={true}
           />
           <CardMedia expandable={true} style={styles.cardMedia}>
              <FiltersTabs session={this.props.session} updateSession={this.updateSession.bind(this)}/>
           </CardMedia>
       </Card>
    )
  }
}

export default Filters;
