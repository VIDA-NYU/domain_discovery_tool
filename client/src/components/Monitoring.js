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
	processes:{},
    }
  }
    componentWillMount(){
	this.setState({processes: this.props.processes})
    }

    componentWillReceiveProps(nextProps){
	this.setState({processes: nextProps.processes})
    }
    
    render(){
	var rows = Object.keys(this.state.processes).map((process, index)=>{
	    return this.state.processes[process].map((process_row, index_row)=>{
		if(process_row.status !== "Completed"){
		    return <TableRow>
			<TableRowColumn width={this.props.widthProcess}>{process}</TableRowColumn>
			<TableRowColumn width={this.props.widthDomain}>{process_row.domain}</TableRowColumn>
			<TableRowColumn width={this.props.widthStatus}>{process_row.status}</TableRowColumn>
			<TableRowColumn width={this.props.widthDescription}>{process_row.description}</TableRowColumn>
			</TableRow>;
		}else return;
	    });
	});
    return ( <Table>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn width={this.props.widthProcess}>Process</TableHeaderColumn>
                  <TableHeaderColumn width={this.props.widthDomain}>Domain</TableHeaderColumn>
                  <TableHeaderColumn width={this.props.widthStatus}>Status</TableHeaderColumn>
                  <TableHeaderColumn width={this.props.widthDescription}>Description</TableHeaderColumn>
                </TableRow>
              </TableHeader>
             <TableBody displayRowCheckbox={false}>
	     {rows}
             </TableBody>
            </Table>);
  }
}

Monitoring.propTypes = {
    messageCrawler: React.PropTypes.string.isRequired,
};

Monitoring.defaultProps = {
    widthProcess:100,
    widthDomain:160,
    widthStatus:200,
    widthDescription:200,
};

export default Monitoring;
