import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './Document.css';


class Document extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false, comment: "", commentList: [] }
    this.getUrl = this.getUrl.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchComments = this.fetchComments.bind(this);
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
    fetch("https://sqikvxgwz3.execute-api.us-east-1.amazonaws.com/dev/document/" + doc_id, requestOptions)
      // .then(response => JSON.parse(response))
      .then(resp => resp.json())
      .then(resp => window.open(resp.url, '_blank').focus())
      // .then(response => response.arrayBuffer())
      // .then(result => this.setState({ documents: JSON.parse(result) }))
      .catch(error => console.log('error', error));
  }
  fetchComments() {
    const doc_id = this.props.doc_id
    var requestOptions = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.props.token
      },
      redirect: 'follow'
    };
    fetch(`https://sqikvxgwz3.execute-api.us-east-1.amazonaws.com/dev/document/${doc_id}/comments`, requestOptions)
      // .then(response => JSON.parse(response))
      .then(resp => resp.json())
      .then(resp => this.setState({ commentList: resp }))
      // .then(response => response.arrayBuffer())
      // .then(result => this.setState({ documents: JSON.parse(result) }))
      .catch(error => console.log('error', error));
  }
  toggleOpen() {
    this.fetchComments();
    this.setState({ open: !this.state.open })
  }
  closePopup() {
    this.setState({ open: false, commentList: [], comment: "" })
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
        if (result.code == 1) {
          this.fetchComments();
        }
        this.setState({ comment: "" })
      })
  }
  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value })
  }
  render() {
    const comments = this.state.commentList.map((item) => (
      <div className="post" key={item.id}>
        <div className="post-header">
          <span className="username">{item.user_id}</span>
          <span className="date">{item.posted_time}</span>
        </div>
        <div className="post-content">
          {item.comment}
        </div>
      </div>
    ))
    return (
      <div className="document-list-item">
        <Popup open={this.state.open} closeOnDocumentClick onClose={this.closePopup}>
          <div className="modal">
            {comments}
            <form class="new-post-form" onSubmit={this.submitComment}>
              <input
                id="comment"
                name="comment"
                value={this.state.comment}
                type="text"
                onChange={this.handleChange}
                className='text-box' />
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