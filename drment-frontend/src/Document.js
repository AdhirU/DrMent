import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './App.css';


class Document extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false, comment: "", commentList: [] }
    this.getUrl = this.getUrl.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
  toggleOpen() {

    this.setState({ open: !this.state.open })
  }
  closePopup() {
    this.setState({ open: false })
  }
  submitComment(evt) {
    evt.preventDefault();
    const doc_id = this.props.doc_id;
    let body = {
      "comment": this.state.comment,
      "user_id": this.props.user_id,
      "doc_id": this.props.doc_id
    }
    var requestOptions = {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Authorization": this.props.token },
      body: JSON.stringify(body)
    };

    fetch(`https://sqikvxgwz3.execute-api.us-east-1.amazonaws.com/dev/document/${doc_id}/comments`,
      requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        console.log(result.code)
        this.setState({ comment: "" })
      })
  }
  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value })
  }
  render() {
    return (
      <div className="document-list-item">
        <Popup open={this.state.open} closeOnDocumentClick onClose={this.closePopup}>
          <div className="modal">
          <p>Comment 1</p>
          <p>Comment 2</p>
          <p>Comment 3</p>
          <form onSubmit={this.submitComment}>
            <input 
              id="comment"
              name="comment"
              value={this.state.comment}
              type="text"
              onChange={this.handleChange}
              className='text-box'/>
            <button>Comment</button>
            </form>
          </div>
        </Popup>
        <h3>{this.props.name}</h3>
        <p>Description: {this.props.description}</p>
        <button onClick={this.getUrl}>View Scanned Document</button>
        <button onClick={this.toggleOpen}>View Comments</button>
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