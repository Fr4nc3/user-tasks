import React, { Component} from 'react';
import Auth from '../auth/Auth';
//import Dashboard from '../components/Dashboard.jsx';
//import DatePicker from 'react-datepicker';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../node_modules/react-datepicker/dist/react-datepicker.css';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table.min.css';
import Modal from "react-modal";

Modal.setAppElement("#root");
const statusTypes = ['NEW', 'COMPLETE'];
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      isLoading: false,
      error: null,
      showModal: false
    };
    this.getTasks();
  }

  getTasks = (filer1, filter2, filter3) => {
    console.log("hahha");
    fetch("/api/tasks", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: Auth.getToken() // pass the token to identify user
      }
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        this.setState({ tasks: data });
      });
  };
  remote(remoteObj) {
    // Only cell editing, insert and delete row will be handled by remote store
    remoteObj.cellEdit = true;
    remoteObj.insertRow = true;
    remoteObj.dropRow = true;
    return remoteObj;
  }
  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    //this.subtitle.style.color = '#f00';
  }

  closeModal() {
   // this.setState({ modalIsOpen: false });
  }

  onClickEdit(cell, row, rowIndex) {
    console.log("Product #", rowIndex);
    this.setState({
      showModal: !this.state.showModal
    });
    // const attr = {
    //   //onModalClose, onSave,  validateState, ignoreEditable, 
    //   row
    // };
    // console.log("custom");
    // console.log(attr);
    // return 
    // <MyModal />
    
  }
  onClickDelete(cell, row, rowIndex) {
    console.log("Product #", rowIndex);
  }
  // onCellEdit = (row, fieldName, value) => {
  //   const { data } = this.state;
  //   let rowIdx;
  //   const targetRow = data.find((prod, i) => {
  //     if (prod.id === row.id) {
  //       rowIdx = i;
  //       return true;
  //     }
  //     return false;
  //   });
  //   if (targetRow) {
  //     targetRow[fieldName] = value;
  //     data[rowIdx] = targetRow;
  //     this.setState({ data });
  //   }
  // };

  onAddRow = row => {
    const Name = encodeURIComponent(row.Name);
    const Description = encodeURIComponent(row.Description);
    const Status = encodeURIComponent(row.Status);
    const DueDate = encodeURIComponent(row.DueDate);
    console.log(row);
    fetch("/api/task", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: Auth.getToken() // pass the token to identify user
      },

      // Name: "vv", Description: "vv", Status: "NEW", DueDate: "2018-04-11"
      body: JSON.stringify({
        Name: Name,
        Description: Description,
        Status: Status,
        DueDate: DueDate
      })
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (data.hasOwnProperty("status")) {
          this.getTasks();
        } else {
          const errors = {};
          errors.summary = data.message;
          this.setState({
            errors
          });
        }
      });
  };

  stringValidator = (value, row) => {
    const response = {
      isValid: true,
      notification: { type: "success", msg: "", title: "" }
    };
    if (!value) {
      response.isValid = false;
      response.notification.type = "error";
      response.notification.msg = "Value must be inserted";
      response.notification.title = "Requested Value";
    }
    return response;
  };
  dateCreatorRow = (cell, row, enumObject, rowIndex) => {
    return this.dateCreator(cell);
  };
  dateCreator = value => {
    let ob = value.split("-");
    let month = ob[2].split("T");
    console.log(month);
    //2018/04/10
    value = ob[1] + "/" + month[0] + "/" + ob[0];
    return value;
  };
  dateValidator = (value, row) => {
    const response = {
      isValid: true,
      notification: { type: "success", msg: "", title: "" }
    };
    console.log("here");
    console.log(value.length);
    let canContinue = true;
    if(value.length < 9){
      canContinue = false;
   
    }
    if(canContinue){
      value = this.dateCreator(value);
      console.log(value);
    }
    var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    if (!date_regex.test(value)) {
      canContinue = false;
    }
    if(!canContinue){
      response.isValid = false;
      response.notification.type = "error";
      response.notification.msg = "Value must be valid date mm/dd/yyyy";
      response.notification.title = "Requested Value";
    }
    return response;
  };
  // onDeleteRow = row => {
  //   this.tasks = this.tasks.filter(task => {
  //     return task.id !== row[0];
  //   });

  //   this.setState({
  //     data: this.tasks
  //   });
  // };
  getComponent(row) {
    const attr = {
      row
    };
    console.log(this.state.showModal);
    if (this.state.showModal) {  // show the modal if state showModal is true
      //return <CustomInsertModal {...attr} />;
      return <Modal
        isOpen={true}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >

        <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>
        <button onClick={this.closeModal}>close</button>
        <div>I am a modal</div>
        <form>
          <input />
          <button>tab navigation</button>
          <button>stays</button>
          <button>inside</button>
          <button>the modal</button>
        </form>
      </Modal>


    } else {
      return null;
    }
  }
  editButton(cell, row, enumObject, rowIndex) {
    return (
      <button
        type="button"
        onClick={() => this.onClickEdit(cell, row, rowIndex)}
      >
        {this.getComponent(row)}
        edit
      </button>
    );
  }
  deleteButton(cell, row, enumObject, rowIndex) {
    return (
      <button
        className="btn btn-danger"
        type="button"
        onClick={() => this.onClickDelete(cell, row, rowIndex)}
      >
        Delete
      </button>
    );
  }
  editFormat(cell, row, thatProps) {
    console.log("editformat");
    console.log(cell);
    console.log(row);
  }

  // createCustomModal = (row) => {//(onModalClose, onSave, validateState, ignoreEditable) => {

  // }

  render() {
    // const cellEditProp = {
    //   mode: 'click'
    // };
    // const selectRow = {
    //   mode: 'checkbox',
    //   cliclToSelct: true
    // };

    return <BootstrapTable data={this.state.tasks} remote={this.remote} insertRow options={{ onAddRow: this.onAddRow } //selectRow={selectRow} // onDeleteRow: this.onDeleteRow, deleteRow cellEdit={cellEditProp} //search pagination
        }>
        <TableHeaderColumn dataField="Name" isKey={true} editable={{ validator: this.stringValidator }}>
          Name
        </TableHeaderColumn>
        <TableHeaderColumn dataField="Description" editable={{ type: "textarea", validator: this.stringValidator }}>
          Description
        </TableHeaderColumn>
        <TableHeaderColumn dataField="Status" editable={{ type: "select", options: { values: statusTypes } }}>
          Status
        </TableHeaderColumn>
        <TableHeaderColumn dataField="DueDate" editable={{ type: "date", validator: this.dateValidator, placeholder: "mm/dd/yyyy" }} dataFormat={this.dateCreatorRow.bind(this)}>
          Due Date
        </TableHeaderColumn>
        {/* <TableHeaderColumn dataField="button"
          dataFormat={(cell, row) => this.editFormat(cell, row, this)}
          hiddenOnInsert
          width='5.5%'>
          Edit</TableHeaderColumn>*/}
        <TableHeaderColumn dataField="button" dataFormat={this.editButton.bind(this)} width="5.5%" hiddenOnInsert>
          Edit
        </TableHeaderColumn>
        <TableHeaderColumn dataField="button" dataFormat={this.deleteButton.bind(this)} width="5.5%" hiddenOnInsert>
          Delete
        </TableHeaderColumn>
      </BootstrapTable>;
  }
}


export default DashboardPage;
