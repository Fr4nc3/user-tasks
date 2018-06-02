import React, { Component } from 'react';

const statusTypes = ['NEW', 'COMPLETE'];

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }

    remote(remoteObj) {
        // Only cell editing, insert and delete row will be handled by remote store
        remoteObj.cellEdit = true;
        remoteObj.insertRow = true;
        remoteObj.dropRow = true;
        return remoteObj;
    }

    render() {
        const cellEditProp = {
            mode: 'click'
        };
        const selectRow = {
            mode: 'checkbox',
            cliclToSelct: true
        };
        console.log("here");
        console.log(this.props.tasks);
        return (
           
            <BootstrapTable data={this.props.tasks}
                selectRow={selectRow}
                remote={this.remote}
                insertRow deleteRow search pagination
                cellEdit={cellEditProp}
                options={{
                    onCellEdit: this.props.onCellEdit,
                    onDeleteRow: this.props.onDeleteRow,
                    onAddRow: this.props.onAddRow
                }}>
                <TableHeaderColumn dataField='Name' isKey={true}>Name</TableHeaderColumn>
                <TableHeaderColumn dataField='Description' editable={{ type: 'textarea' }}>Description</TableHeaderColumn>
                <TableHeaderColumn dataField='Status' editable={{ type: 'select', options: { values: statusTypes } }}>Status</TableHeaderColumn>
                <TableHeaderColumn dataField='DueDate' editable={{ type: 'datetime' }}>DueDate</TableHeaderColumn>
            
            </BootstrapTable>
        );
    }
}



export default Dashboard;
