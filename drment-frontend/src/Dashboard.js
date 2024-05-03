import React, { Component } from 'react';
import Document from './Document';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {documents: []}
  }

  componentDidMount() {
    this.DocumentList();
  }

  DocumentList() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    fetch("https://sqikvxgwz3.execute-api.us-east-1.amazonaws.com/dev/dashboard/org_1", requestOptions)
      .then(response =>response.text())
      .then(result => this.setState({documents: JSON.parse(result)}))
      .catch(error => console.log('error', error));
  }

  render() {
    // const persons = this.state.person.map((item, i) => (
    //   <div>
    //     <h1>{ item.name.first }</h1>
    //     <span>{ item.cell }, { item.email }</span>
    //   </div>
    // ));

    // return (
    //   <div id="layout-content" className="layout-content-wrapper">
    //     <div className="panel-list">{ persons }</div>
    //   </div>
    // );

    const documents = this.state.documents.map((item, i) => (
      <Document key={i} name={item.name} timestamp={item.timestamp} url={item.url}/>
    ))

    return (
      <div>
        { documents }
      </div>
    )
  }
}

export default Dashboard;