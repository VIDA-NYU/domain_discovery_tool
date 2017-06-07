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
                  <TableHeaderColumn>Process</TableHeaderColumn>
                  <TableHeaderColumn>Domain</TableHeaderColumn>
                  <TableHeaderColumn>Status</TableHeaderColumn>
                  <TableHeaderColumn>Description</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableRowColumn>Crawler</TableRowColumn>
                  <TableRowColumn>{this.props.nameDifferentDomain}</TableRowColumn>
                  <TableRowColumn>{this.props.messageCrawler}</TableRowColumn>
                   <TableRowColumn>...</TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>);
  }
}

export default Monitoring;
