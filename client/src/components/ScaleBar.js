//
import React, {Component} from 'react';

class ScaleBar extends React.Component{
  constructor(props){
    super(props);
    this.state={
      ratioAccuracy:0,
    };
  }

  render(){
    var ratioAccuracy = (this.props.ratioAccuracy===undefined || isNaN(this.props.ratioAccuracy))?0:this.props.ratioAccuracy;
    return(
      <svg width="360" height="100" viewBox="0 0 460 100" fill="none">
        <g transform="translate(0,10)" font-size="10" font-family="sans-serif" text-anchor="middle">
          <rect height="8" x="0" width="60" fill="#fff7ec"></rect>
          <rect height="8" x="60" width="60" fill="#fdd49e"></rect>
          <rect height="8" x="120" width="60" fill="#fc8d59"></rect>
          <rect height="8" x="180" width="60" fill="#d7301f"></rect>
          <text x="0" y="-6" fill="#000" text-anchor="start" font-weight="bold">Ratio/Accuracy </text>
          <g transform="translate(20,0)">
            <text fill="#000" y="16" x="0.5" dy="0.71em">Poor</text>
          </g>
          <g transform="translate(80,0)">
            <text fill="#000" y="16" x="0.5" dy="0.71em">Fair</text>
          </g>
          <g transform={`translate(${ratioAccuracy},0)`}>
            <line stroke="#000" y2="13" x1="0.5" x2="0.5"></line>
          </g>
          <g transform="translate(140,0)">
            <text fill="#000" y="16" x="0.5" dy="0.71em">Good</text>
          </g>
          <g transform="translate(200,0)">
            <text fill="#000" y="16" x="0.5" dy="0.71em">Excellent</text>
          </g>
        </g>
      </svg>
    );
  }
}

export default ScaleBar;
