import React, {Component} from 'react';
import { Row, Col} from 'react-bootstrap';
import DomainInfo from './DomainInfo';
import QueriesLoad from './QueriesLoad';
import Filters from './Filters';
import Views from './Views';
import '../css/Components.css';

import Sidebar from 'react-sidebar';

import Avatar from 'material-ui/Avatar';
import Assignment from 'material-ui/svg-icons/action/assignment-returned';
import Plus from 'material-ui/svg-icons/action/swap-horiz';
import FloatingActionButton from 'material-ui/FloatingActionButton';


const styles = {
  button:{
    marginTop:20,
    paddingBottom:'-145px',
    marginBottom:'-545px',
    marginRight: 5,
  },
  contentHeaderMenuLink: {
    textDecoration: 'none',
    color: 'white',
    padding: 8,
  },
  content: {
    marginLeft: '5px',
    marginTop: '65px',
    marginRight: '0px',
    marginBottom: '8px',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px 10px 10px 10px',
  },
  avatar:{
    margin:'8px 8px 0px -10px',
  },
};

class Body extends Component{

  constructor(props) {
      super(props);
      this.state = {
      docked: true,
      open: true,
      transitions: true,
      touch: true,
      shadow: true,
      pullRight: false,
      touchHandleWidth: 20,
      dragToggleDistance: 30,
      size:350,
      iconDomainInfo:null,
      stateDomainInfoCard:false,
      stateQueryCard:true,
      stateFiltersCard:false,
      sizeAvatar:25,
    };
  }

    static  openDock1(){
      if(this.state.open){
      this.setState({
        size: 50,
        iconDomainInfo:<Avatar color={'white'} backgroundColor={'#7940A0'} size={25} style={styles.avatar} icon={<Assignment />} />,
        stateQueryCard:false,
        open: !this.state.open,
      });}
      else{
        this.setState({
          size: 350,
          iconDomainInfo:null,
          stateQueryCard:true,
          open: !this.state.open,
        });
      }
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

  openDock(){
    if(this.state.open){
      this.closeMenu();
      this.setState({
        stateDomainInfoCard:false,
        stateQueryCard:false,
        stateFiltersCard:false,
    });}
    else{
      this.openMenu();
      this.setState({
        stateDomainInfoCard:false,
        stateQueryCard:false,
        stateFiltersCard:false,
      });
    }
  }

  setActiveMenu (expanded, menu) {
    console.log("setActiveMenu " + expanded.toString() + " " + this.state.open.toString());
    if(!this.state.open){
      this.openMenu();
    }
    var item = menu===0 ? this.setState({stateQueryCard: expanded,  stateFiltersCard :!expanded, stateDomainInfoCard:!expanded}) :
    ( menu===1 ? this.setState({stateFiltersCard: expanded, stateQueryCard: !expanded, stateDomainInfoCard:!expanded}) : this.setState({ stateDomainInfoCard:expanded, stateFiltersCard: !expanded, stateQueryCard: !expanded}));
  }


  render(){
     const sidebar = (<div style={{width:this.state.size}}>

       <Col style={{marginTop:70, marginLeft:10, marginRight:10, width:350, background:"white"}}>
     <Row className="Menus-child">
       <DomainInfo statedCard={this.state.stateDomainInfoCard} sizeAvatar={this.state.sizeAvatar} setActiveMenu={this.setActiveMenu.bind(this)}/>
     </Row>
     <Row className="Menus-child">
       <QueriesLoad statedCard={this.state.stateQueryCard} sizeAvatar={this.state.sizeAvatar} setActiveMenu={this.setActiveMenu.bind(this)}/>
     </Row>
     <Row className="Menus-child">
       <Filters statedCard={this.state.stateFiltersCard} sizeAvatar={this.state.sizeAvatar} setActiveMenu={this.setActiveMenu.bind(this)}/>
     </Row>
     <Row className="Menus-child">
     <FloatingActionButton mini={true} style={styles.button} zDepth={3} onClick={this.openDock.bind(this)}>
        <Plus />
    </FloatingActionButton>
    </Row>
     </Col>

     </div>
   );

     const sidebarProps = {
       sidebar: sidebar,
       docked: this.state.docked,
       sidebarClassName: 'custom-sidebar-class',
       open: this.state.open,
       touch: this.state.touch,
       shadow: this.state.shadow,
       pullRight: this.state.pullRight,
       touchHandleWidth: this.state.touchHandleWidth,
       dragToggleDistance: this.state.dragToggleDistance,
       transitions: this.state.transitions,
       onSetOpen: this.onSetOpen,
     };

   return (
     <Sidebar {...sidebarProps}>

         <div>

         <Row style={styles.content}>


                 <Views />
                 </Row>
         </div>
     </Sidebar>
    )
  }
}

export default Body;
