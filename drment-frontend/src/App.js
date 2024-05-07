import React from 'react';
import './App.css';

// Imports the Amplify library from 'aws-amplify' package. This is used to configure your app to interact with AWS services.
import {Amplify} from 'aws-amplify';

// Imports the Authenticator and withAuthenticator components from '@aws-amplify/ui-react'.
// Authenticator is a React component that provides a ready-to-use sign-in and sign-up UI.
// withAuthenticator is a higher-order component that wraps your app component to enforce authentication.
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from '@aws-amplify/auth';

// Imports the default styles for the Amplify UI components. This line ensures that the authenticator looks nice out of the box.
import '@aws-amplify/ui-react/styles.css';

// Imports the awsExports configuration file generated by the Amplify CLI. This file contains the AWS service configurations (like Cognito, AppSync, etc.) specific to your project.
import awsExports from './aws-exports';

// Imports the Quiz component from Quiz.js for use in this file.
// import Quiz from './Quiz';

import Dashboard from './Dashboard';

// Configures the Amplify library with the settings from aws-exports.js, which includes all the AWS service configurations for this project.
Amplify.configure(awsExports);

// Function to print access token and id token
function App() {
  return (
    <div className="App">
      <header className='header'>
        <h1>Document Management</h1>
      </header>
      <div className="container">
        <section className="document-upload-section">
          <h2>Upload Document</h2>
          <form>
            <label htmlFor="file">Choose File:</label>
            <input type="file" id="file" />
            <label htmlFor="name">Document Name:</label>
            <input type="text" id="name" />
            <label htmlFor="description">Document Description:</label>
            <input type="text" id="description" />
            <button type="submit">Upload</button>
          </form>
        </section>
        <section className="document-list">
          <h2>Scanned Documents</h2>
          <div className="document-list-item">
            <h3>Document 1</h3>
            <p>Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <button>View Scanned Document</button>
            <button>Comment on Document</button>
          </div>
          <div className="document-list-item">
            <h3>Document 2</h3>
            <p>Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <button>View Scanned Document</button>
            <button>Comment on Document</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
