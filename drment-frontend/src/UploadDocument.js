import React, { Component } from 'react'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


class UploadDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      org: "org_1",
      file: null,
      msg: "",
      msgSuccess: true,
      open: false,
      macros: { "num_macros": "0", "macros_1_content": "", "macro_1_files": [], "macro_1_flags": [], "macro_1_urls": [] }
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.closePopup = this.closePopup.bind(this);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value })
  }

  handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({ file: reader.result })
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  handleSubmit(evt) {
    evt.preventDefault();
    // this.setState({msg: "", macros: { "num_macros": "0", "macros_1_content": "", "macro_1_files": [], "macro_1_flags": [], "macro_1_urls": [] }})
    let body = {
      "name": this.state.name,
      "description": this.state.description,
      "user_id": this.props.user_id,
      "org": this.state.org,
      "file": this.state.file
    }
    var requestOptions = {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Authorization": this.props.token },
      body: JSON.stringify(body)
    };

    fetch("https://sqikvxgwz3.execute-api.us-east-1.amazonaws.com/dev/document",
      requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        console.log(result.code)
        if (result.code === 1) {
          this.setState({ msg: result.output, msgSuccess: true },);
          // this.props.reloadDocs();
          // this.setState({ msg: result.output, msgSuccess: true }, () => setTimeout( this.clearForm() ,5000));
        } else {
          this.setState({ msg: "Macro detected!", msgSuccess: false, macros: result.output });
        }
      })
      .catch(error => {
        this.setState({ msg: error.message, msgSuccess: false });
      })
      .finally(() => {
        this.props.reloadDocs();
      })
  }

  clearForm() {
    this.setState({ name: '', description: '', file: null, msg: '' })
  }

  toggleOpen() {
    this.setState({ open: !this.state.open })
  }
  closePopup() {
    this.setState({ open: false })
  }

  render() {
    return (
      <div>
        <Popup open={this.state.open} closeOnDocumentClick onClose={this.closePopup}>
          <div className="modal">
            <p><strong>Number of Macros:</strong> {this.state.macros.num_macros}</p>
            <p><strong>Flags:</strong></p>
            <ul>
              {this.state.macros.macro_1_flags.map(t => <li>{t}</li>)}
            </ul>
            <p><strong>Files:</strong></p>
            <ul>
              {this.state.macros.macro_1_files.map(t => <li>{t}</li>)}
            </ul>
            <p><strong>URLs:</strong></p>
            <ul>
              {this.state.macros.macro_1_urls.map(t => <li>{t}</li>)}
            </ul>
            <p><strong>Full Macros Content:</strong></p>
            <p>{this.state.macros.macros_1_content}</p>
          </div>
        </Popup>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="file">Choose File:</label>
          <input type="file" onChange={this.handleFileChange} />
          <label htmlFor='name'>Document Name:</label>
          <input
            id="name"
            name="name"
            value={this.state.name}
            type="text"
            onChange={this.handleChange}
          />
          <label htmlFor='description'>Document Description:</label>
          <input
            id="description"
            name="description"
            value={this.state.description}
            type="text"
            onChange={this.handleChange}
          />
          <button>Upload</button>
        </form>
        <div>
          <p className={`upload-message ${this.state.msgSuccess ? "success" : "error"}`}>
            {this.state.msg} {this.state.macros.num_macros !== "0" ? <a href='#' onClick={this.toggleOpen}>View details</a> : ""}
          </p>
        </div>
      </div>
    )
  }
}

export default UploadDocument