import React, { Component } from 'react';
import { fetchAuthSession } from '@aws-amplify/auth';
import Document from './Document';
import UploadDocument from './UploadDocument';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {documents: [], user_id: "", token: "" }
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
      .then(response =>response.text())
      .then(result => this.setState({documents: JSON.parse(result)}))
      .catch(error => console.log('error', error));
  }

  render() {
    const documents = this.state.documents.map((item, i) => (
      <Document key={i} name={item.name} timestamp={item.timestamp} url={item.url}/>
    ))

    return (
      <div>
        { documents }
        <UploadDocument token={this.state.token}/>
      </div>
    )
  }
}

export default Dashboard;