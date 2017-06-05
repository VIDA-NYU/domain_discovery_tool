import React, {Component} from 'react';
import { Row, Col} from 'react-bootstrap';
import DomainInfo from './DomainInfo';
import Search from './Search';
import Filters from './Filters';
import '../css/Components.css';
import Plus from 'material-ui/svg-icons/action/swap-horiz';
import FloatingActionButton from 'material-ui/FloatingActionButton';

const styles = {
  button:{
    marginTop:20,
    paddingBottom:'-145px',
    marginBottom:'-545px',
    marginRight: 5,
  },
};

class SidebarMenu extends Component{

  constructor(props) {
      super(props);
      this.state = {
        session:{},
    };
  }

  componentWillMount() {
    this.setState({session:this.props.session});


  }

  updateSession(newSession){
    this.props.updateSession(newSession);
  }

    closeMenu(){
      this.setState({
        size: 60,
        //iconDomainInfo:<Avatar color={'white'} backgroundColor={'#7940A0'} size={35} style={styles.avatar} icon={<Home />} />,
        //stateDomainInfoCard:false,
        open: !this.state.open,
        sizeAvatar:35,
      });
    }

    openMenu(){
      this.setState({
        size: 350,
        iconDomainInfo:null,
        open: !this.state.open,
        sizeAvatar:25,
      });
    }

    openDockMenu(){
      if(this.state.open){
        this.closeMenu();
        this.setState({
          stateDomainInfoCard:false,
          stateSearchCard:false,
          stateFiltersCard:false,
      });}
      else{
        this.openMenu();
        this.setState({
          stateDomainInfoCard:false,
          stateSearchCard:false,
          stateFiltersCard:false,
        });
      }
    }

    setActiveMenu (expanded, menu) {
      console.log("setActiveMenu " + expanded.toString() + " " + this.state.open.toString());
      if(!this.state.open){
        this.openMenu();
      }
      var item = menu===0 ? this.setState({stateSearchCard: expanded,  stateFiltersCard :!expanded, stateDomainInfoCard:!expanded}) :
      ( menu===1 ? this.setState({stateFiltersCard: expanded, stateSearchCard: !expanded, stateDomainInfoCard:!expanded}) : this.setState({ stateDomainInfoCard:expanded, stateFiltersCard: !expanded, stateSearchCard: !expanded}));
    }

  render(){
    return (
      <div style={{width:this.state.size}}>
        <Col style={{marginTop:70, marginLeft:10, marginRight:10, width:350, background:"white"}}>
            <Row className="Menus-child">
              <DomainInfo statedCard={this.state.stateDomainInfoCard} sizeAvatar={this.state.sizeAvatar} setActiveMenu={this.setActiveMenu.bind(this)}/>
            </Row>
            <Row className="Menus-child">
              <Search statedCard={this.state.stateSearchCard} sizeAvatar={this.state.sizeAvatar} setActiveMenu={this.setActiveMenu.bind(this)}/>
            </Row>
            <Row className="Menus-child">
              <Filters statedCard={this.state.stateFiltersCard} sizeAvatar={this.state.sizeAvatar} setActiveMenu={this.setActiveMenu.bind(this)} session={this.state.session} updateSession={this.updateSession.bind(this)}/>
            </Row>
            <Row className="Menus-child">
              <FloatingActionButton mini={true} style={styles.button} zDepth={3} onClick={this.openDockMenu.bind(this)}>
                <Plus />
              </FloatingActionButton>
            </Row>
        </Col>
      </div>
    )
  }
}

export default SidebarMenu;
