import React, { Component } from 'react'

class UploadDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      url: "",
      org: "org_1"
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value})
  }

  handleSubmit(evt) {
    evt.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("https://sqikvxgwz3.execute-api.us-east-1.amazonaws.com/dev/document", requestOptions)
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
        <label htmlFor='url'>URL: </label>
        <input
          id="url"
          name="url"
          value={this.state.url}
          onChange={this.handleChange}
        />
        {/* <input type="file" id="myFile" name="filename"
          className='button-style' accept='.pdf' /> */}
        <button>Upload File</button>
      </form>
    )
  }
}

export default UploadDocument