import React, { Component, useState } from 'react';
import { fetchAuthSession } from '@aws-amplify/auth';
import Document from './Document';
import UploadDocument from './UploadDocument';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { documents: [], user_id: "", token: "" }
    this.DocumentList = this.DocumentList.bind(this);   
  }

  async componentDidMount() {
    const session = await fetchAuthSession();
    this.setState({
      user_id: session.tokens.signInDetails.loginId,
      token: session.tokens.idToken.toString()
    }, this.DocumentList)
  }
  

  DocumentList() {
    var requestOptions = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.state.token
      },
      redirect: 'follow'
    };
    fetch("https://sqikvxgwz3.execute-api.us-east-1.amazonaws.com/dev/dashboard/org_1", requestOptions)
      .then(response => response.text())
      .then(result => this.setState({ documents: JSON.parse(result) }))
      .catch(error => console.log('error', error));
  }

  render() {
    const documents = this.state.documents.map((item) => (
      <Document key={item.id} doc_id={item.id} name={item.name} description={item.description} token={this.state.token} />
    ))

    // return (
    //   <div>
    //     { documents }
    //     <UploadDocument token={this.state.token}/>
    //   </div>
    // )
    return (
      <div>

        <header className='header'>
          <h1>Document Management</h1>
        </header>
        <div className="container">
          <section className="document-upload-section">
            <h2>Upload Document</h2>
            {/* <form>
              <label htmlFor="file">Choose File:</label>
              <input type="file" id="file" />
              <label htmlFor="name">Document Name:</label>
              <input type="text" id="name" />
              <label htmlFor="description">Document Description:</label>
              <input type="text" id="description" />
              <button type="submit">Upload</button>
            </form> */}
            <UploadDocument user_id={this.state.user_id} token={this.state.token} reloadDocs={this.DocumentList} />



          </section>
          <section className="document-list">
            <h2>Scanned Documents</h2>
            {documents}
          </section>
        </div>
      </div>
    )
  }
}

export default Dashboard;