import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

class Monitoring extends Component {

  constructor(props){
    super(props);
    this.state={

    }
  }

  render(){
    return ( <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderColumn width={this.props.widthProcess}>Process</TableHeaderColumn>
                  <TableHeaderColumn width={this.props.widthDomain}>Domain</TableHeaderColumn>
                  <TableHeaderColumn width={this.props.widthStatus}>Status</TableHeaderColumn>
                  <TableHeaderColumn width={this.props.widthDescription}>Description</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                <TableRow>
                  <TableRowColumn width={this.props.widthProcess}>Crawler</TableRowColumn>
                  <TableRowColumn width={this.props.widthDomain}>{this.props.nameDifferentDomain}</TableRowColumn>
                  <TableRowColumn width={this.props.widthStatus}>{this.props.messageCrawler}</TableRowColumn>
                   <TableRowColumn width={this.props.widthDescription}>...</TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>);
  }
}

Monitoring.propTypes = {
    nameDifferentDomain: React.PropTypes.string.isRequired,
    messageCrawler: React.PropTypes.string.isRequired,
};

Monitoring.defaultProps = {
    widthProcess:70,
    widthDomain:130,
    widthStatus:160,
    widthDescription:100,
};

export default Monitoring;
