import React, { Component } from 'react'

class UploadDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      org: "org_1",
      file: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value})
  }

  handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({file: reader.result})
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  handleSubmit(evt) {
    evt.preventDefault();
    let body = {
      "name": this.state.name,
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
      .then(response =>response.text())
      .then(result => this.setState({documents: JSON.parse(result)}))
      .catch(error => console.log('error', error));
  }

  render() {
    return (     
      <form onSubmit={this.handleSubmit}>
        <label htmlFor='name'>Name: </label>
        <input
          id="name"
          name="name"
          value={this.state.name}
          onChange={this.handleChange}
        />
        <input type="file" onChange={this.handleFileChange} />
        <button>Upload File</button>
      </form>
    )
  }
}

export default UploadDocument