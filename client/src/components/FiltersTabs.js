import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
//import {deepPurpleA400, orange300, blue400, indigoA400, blue900} from 'material-ui/styles/colors';
import Checkbox from 'material-ui/Checkbox';


const styles = {
  headline: {
    fontSize: 12,
    paddingTop: 16,
    marginBottom: 12,
    height: '120px',
  },
  slide: {
    height: '100px',
  },
  tab:{
    fontSize: '12px',
  },
};

class FiltersTabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
    };
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  render() {
    return (
      <div>
        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
          inkBarStyle={{background:'#7940A0' ,height: '4px'}}
          tabItemContainerStyle={{background: '#9A7BB0' ,height: '40px'}}
        >
          <Tab label="Queries" value={0} style={styles.tab} />
          <Tab label="Tags" value={1} style={styles.tab} />
          <Tab label="Model" value={2} style={styles.tab} />
        </Tabs>
        <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange}  >
          <div style={styles.headline}>
            <Checkbox label="QueryOne" style={styles.checkbox}  />
            <Checkbox label="Querytwo" style={styles.checkbox}  />
            <Checkbox label="Querythree" style={styles.checkbox}  />
            <Checkbox label="Queryfour" style={styles.checkbox}  />
            <Checkbox label="SimpleQuery" style={styles.checkbox}  />
            <Checkbox label="SimpleQuery" style={styles.checkbox}  />
            <Checkbox label="SimpleQuery" style={styles.checkbox}  />
            <Checkbox label="SimpleQuery" style={styles.checkbox}  />
          </div>
          <div style={styles.headline}>
          <Checkbox label="Neutral" style={styles.checkbox}  />
          <Checkbox label="Relevant" style={styles.checkbox}  />
          <Checkbox label="Irrelevant" style={styles.checkbox}  />
          <Checkbox label="VeryIrrelant" style={styles.checkbox}  />
          <Checkbox label="VeryRelevant" style={styles.checkbox}  />
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
}

export default FiltersTabs;
