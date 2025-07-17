import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
// Import your file management component
import FileManager from './FileManager';

function App({ signOut, user }) {
  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#232f3e', color: 'white' }}>
        <h1>CloudVault</h1>
        <div>
          <span>Hello, {user.attributes.email}</span>
          <button onClick={signOut} style={{ marginLeft: '1rem' }}>Sign Out</button>
        </div>
      </header>
      <main>
        <FileManager />
      </main>
    </div>
  );
}

// withAuthenticator automatically wraps your app in a login/signup flow
export default withAuthenticator(App);
