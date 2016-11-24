import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';

import { InputGroup, FormControl , DropdownButton,  MenuItem} from 'react-bootstrap';

import { Col} from 'react-bootstrap';

import FlatButton from 'material-ui/FlatButton';
import {fullWhite} from 'material-ui/styles/colors';

import Search from 'material-ui/svg-icons/action/search';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
  },
  slide: {
    padding: '10px 0px 0px 0px',
    height: '100px',
  },
  tab:{
    fontSize: '12px',
    marginTop:'-5px',
  },
};

class QueriesTabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
      dataSource: [],
    };
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

    handleUpdateInput = (value) => {
      this.setState({
        dataSource: [
          value,
          value + value,
          value + value + value,
        ],
      });
    };


  render() {
    return (
      <div>
        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
          inkBarStyle={{background: '#7940A0' ,height: '4px'}}
          tabItemContainerStyle={{background: '#9A7BB0' ,height: '30px'}}
        >
          <Tab label={'WEB'} value={0}  style={styles.tab} />
          <Tab label={'LOAD'} value={1} style={styles.tab} />
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <div style={styles.slide} >
          <Col xs={10} md={10} style={{marginLeft:'-15px'}} >
           <InputGroup >
            <FormControl type="text" placeholder="write a query ..." />
            <DropdownButton
              componentClass={InputGroup.Button}
              id="input-dropdown-addon"
              title="Goog"
            >
              <MenuItem key="1">Bing</MenuItem>
              </DropdownButton>
            </InputGroup>
            </Col>
            <Col xs={2} md={1} >
            <FlatButton style={{marginLeft:'-10px', minWidth: '58px'}}
              backgroundColor="#26C6DA"
              hoverColor="#80DEEA"
              icon={<Search color={fullWhite} />}
            />
            </Col>
          </div>
          <div style={styles.slide}>
            Load Urls...
          </div>

        </SwipeableViews>
      </div>
    );
  }
}

export default QueriesTabs;

//icon={<FontIcon className="material-icons"  >language</FontIcon> }
