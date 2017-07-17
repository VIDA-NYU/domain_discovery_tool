import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn,
         TableRow, TableRowColumn } from 'material-ui/Table';

// Table built on top of Material UI's Table component to avoid the Select all bug
// TODO: Once Material UI releases the next version this can be discarded
//       completely. Also, add more props for better flexibility
class MultiselectTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      selectAll: false
    }

    this.toggleSelectOrDeselectAll = this.toggleSelectOrDeselectAll.bind(this);
    this.onRowSelection = this.onRowSelection.bind(this);
  }

  /**
   * Manipulate this.state.selectedRows to mimick SelectAll / DeselectAll
   * @method toggleSelectOrDeselectAll (onClick event)
   * @param {Object} event
   */
  toggleSelectOrDeselectAll(event) {
    let selectedRows = !this.state.selectAll ?
                        this.props.rows.map((reco, index) => index)
                        :
                        []

    this.setState({
      selectAll: !this.state.selectAll,
      selectedRows
    });
    this.props.onRowSelection && this.props.onRowSelection(selectedRows);
  }

  /**
   * Set selectedRows accordingly without weird strings such as 'none' or 'all'
   * and call the parent components method to manipulate data
   * @method onRowSelection (onClick event)
   * @param {number[]} selectedRows
   */
  onRowSelection(selectedRows) {
    selectedRows = (selectedRows === 'none' ? [] : selectedRows);
    this.setState({selectedRows});
    this.props.onRowSelection && this.props.onRowSelection(selectedRows);
  }


  render() {
    return (
      <div>
        <Table
          height={"300px"}
          fixedHeader={true}
          fixedFooter={true}
          selectable={true}
          multiSelectable={true}
          onRowSelection={this.onRowSelection}
          style={{width:900}}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={true}
            enableSelectAll={false}
          >
            <TableRow>
            <TableHeaderColumn colSpan="2">
            </TableHeaderColumn>
            </TableRow>
            <TableRow>
              {
                this.props.columnHeadings.
                  map(column =>
                    <TableHeaderColumn  style={{textAlign:'left', margin:"-10px", height:30,}}>
                      {column}
                    </TableHeaderColumn>
                  )
              }
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={true}
            deselectOnClickaway={false}
            showRowHover={true}
            stripedRows={false}
          >
            {this.props.rows.map((row, index) => (
              <TableRow key={row[0]} selected={(this.state.selectedRows || []).indexOf(index) !== -1}>
                <TableRowColumn>{row[0]}</TableRowColumn>
                <TableRowColumn>{row[1]}</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
          <TableFooter adjustForCheckbox={true} />
        </Table>
      </div>
    )
  }
}

MultiselectTable.propTypes = {
  rows: PropTypes.array,
  columnHeadings: PropTypes.array,
  onRowSelection: PropTypes.func
}

export default MultiselectTable;
