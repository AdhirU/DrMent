import React, { Component } from 'react';

class Document extends Component {
  constructor(props) {
    super(props);
    this.getUrl = this.getUrl.bind(this);
  }
  getUrl(evt) {
    const doc_id = this.props.doc_id
    var requestOptions = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.props.token
      },
      redirect: 'follow'
    };
    fetch("https://sqikvxgwz3.execute-api.us-east-1.amazonaws.com/dev/document/"+doc_id, requestOptions)
      // .then(response => JSON.parse(response))
      .then(resp => resp.json())
      .then(resp => window.open(resp.url, '_blank').focus())
      // .then(response => response.arrayBuffer())
      // .then(result => this.setState({ documents: JSON.parse(result) }))
      .catch(error => console.log('error', error));
  }
  render() {
    return (
      <div className="document-list-item">
        <h3>{this.props.name}</h3>
        <p>Description: {this.props.description}</p>
        <button onClick={this.getUrl}>View Scanned Document</button>
        <button>Comment on Document</button>
      </div>
    )
    //   return (
    //     <div style={{"border": "1px", "backgroundColor": "red"}}>
    //       <p>Document Name: {this.props.name} </p>
    //       <p>Timestamp: {this.props.timestamp}  Link: {this.props.url}</p>
    //     </div>
    //   )
    // }
  }
}

export default Document;