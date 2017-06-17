import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import RaisedButton from 'material-ui/RaisedButton';
import $ from 'jquery';

class Monitoring extends Component {

    constructor(props){
    super(props);
    this.state={
	processes:{},
    }
  }
    componentWillMount(){
	this.setState({processes: this.props.processes,})
    }

    componentWillReceiveProps(nextProps){
	this.setState({processes: nextProps.processes, })
    }

    stopProcess(process, process_info){
	$.post(
	    '/stopProcess',
	    {"process": process["process"], "process_info": JSON.stringify(process_info["process_row"])},
	    function(message) {
		console.log(message);
	    }.bind(this)
	);
    }
    
    render(){
	var rows = Object.keys(this.state.processes).map((process, index)=>{
	    return this.state.processes[process].map((process_row, index_row)=>{
		var disableStop = true;
		if(process_row.status === "Running" || process_row.status === "Starting" || process_row.status === "Downloading")
		    disableStop = false;
		if(process_row.status !== "Completed"){
		    return <TableRow>
			<TableRowColumn width={this.props.widthProcess}>{process}</TableRowColumn>
			<TableRowColumn width={this.props.widthDomain}>{process_row.domain}</TableRowColumn>
			<TableRowColumn width={this.props.widthStatus}>{process_row.status}</TableRowColumn>
			<TableRowColumn width={this.props.widthDescription}>{process_row.description}</TableRowColumn>
			<TableRowColumn width={this.props.widthStop}><RaisedButton onClick={this.stopProcess.bind(this, {process}, {process_row})} disabled={disableStop}  style={{height:20, marginTop: 15, minWidth:58, width:48}} labelStyle={{textTransform: "capitalize"}} buttonStyle={{height:19}} label="Stop" labelPosition="before" containerElement="label"/></TableRowColumn>
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
	     <TableHeaderColumn width={this.props.widthDescription}>Stop</TableHeaderColumn>
	     
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
    widthDomain:150,
    widthStatus:150,
    widthDescription:150,
    widthStop:100,
};

export default Monitoring;
