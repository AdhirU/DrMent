import React, { Component } from 'react';

class Document extends Component {
  render() {
    return (
      <div style={{"border": "1px", "backgroundColor": "red"}}>
        <p>Document Name: {this.props.name} </p>
        <p>Timestamp: {this.props.timestamp}  Link: {this.props.url}</p>
      </div>
    )
  }
}

export default Document;