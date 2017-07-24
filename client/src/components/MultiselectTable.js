import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactPaginate from 'react-paginate';

import Checkbox from 'material-ui/Checkbox';
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
      selectAll: false,
      currentPage: 0
    }


    this.perPage = 100;
    this.toggleSelectOrDeselectAll = this.toggleSelectOrDeselectAll.bind(this);
    this.onRowSelection = this.onRowSelection.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.resetSelection)
      this.setState({selectedRows: [], selectAll: false});
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
   * Set the selectedRows state variable with the checked element id "recommendation-index"
   * and call the parent components method to manipulate data
   * @method onRowSelection (onClick event)
   * @param {number[]} selectedRows
   */
  onRowSelection(event) {
    var selectedRows = this.state.selectedRows;
    var rowId = event.target.id.split("-")[1];
    if(event.target.checked)
      selectedRows.push(parseInt(rowId));
    else
      selectedRows.splice(selectedRows.indexOf(parseInt(rowId)), 1);

    this.setState({selectedRows, selectAll: false});
    this.props.onRowSelection && this.props.onRowSelection(selectedRows);
  }

  render() {
    return (
      <div>
        <Table
          height={"390px"}
          fixedHeader={true}
          fixedFooter={true}
          selectable={false}
          multiSelectable={false}
          style={{width:700}}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
            headerStyle={{textAlign:'left',}}
          >
            <TableRow>
              <TableHeaderColumn colSpan="1">
                <Checkbox
                  checked={this.state.selectAll}
                  onCheck={this.toggleSelectOrDeselectAll}
                />
              </TableHeaderColumn>
                {
                  this.props.columnHeadings.map(column =>
                    <TableHeaderColumn colSpan="7" style={{textAlign:'left', margin:"-10px", height:30}}>
                      {column}
                    </TableHeaderColumn>
                  )
                }
            </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          deselectOnClickaway={false}
          showRowHover={true}
          stripedRows={false}
        >
          {
            this.props.rows.slice(
              this.state.currentPage * this.perPage,
              (this.state.currentPage + 1) * this.perPage
            ).map((row, index) =>
              <TableRow key={row[0]}>
                <TableRowColumn colSpan="1">
                  <Checkbox
                    id={"recommendations-" + (this.state.currentPage*this.perPage + index)}
                    checked={(this.state.selectedRows || []).indexOf(this.state.currentPage*this.perPage + index) !== -1}
                    onCheck={this.onRowSelection}
                  />
                </TableRowColumn>
		             <TableRowColumn colSpan="7">{row[0]}</TableRowColumn>
		             <TableRowColumn colSpan="7">{(row[1]['score'] === undefined)? '1, '+row[1]['count']: row[1]['score'].toFixed(3)+', '+row[1]['count']}</TableRowColumn>
              </TableRow>
            )
          }
        </TableBody>
        <TableFooter adjustForCheckbox={true} />
      </Table>
      <div style={{float: 'right', marginTop: '-12px'}}>
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          initialPage={0}
          breakLabel={<a >...</a>}
          breakClassName={"break-me"}
          pageCount={(this.props.rows || []).length/this.perPage}
          marginPagesDisplayed={1}
          pageRangeDisplayed={1}
          onPageChange={(page) => {this.setState({currentPage: page.selected})}}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"} />
        </div>
      </div>
    )
  }
}

MultiselectTable.propTypes = {
  rows: PropTypes.array,
  columnHeadings: PropTypes.array,
  onRowSelection: PropTypes.func,
  resetSelection: PropTypes.bool
}

export default MultiselectTable;
