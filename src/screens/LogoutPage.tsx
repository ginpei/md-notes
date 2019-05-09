import firebaseui from 'firebaseui';
import React, { useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Link, RouteComponentProps } from 'react-router-dom';
import AppLayout from '../independents/AppLayout';
import firebase from '../middleware/firebase';
import { notePath } from '../models/Notes';

type PageProps =
  & RouteComponentProps;

const LoginPage: React.FC<PageProps> = (props) => {
  const user = firebase.auth().currentUser;

  const [signingOut, setSigningOut] = useState(false);

  const onLogoutClick = async () => {
    setSigningOut(true);
    await firebase.auth().signOut();
  };

  return (
    <AppLayout>
      <h1>Logout</h1>
      {user ? (
        <p>
          <button
            disabled={signingOut}
            onClick={onLogoutClick}
          >
            Log out
          </button>
        </p>
      ) : (<>
        <p>
          ✓ Logged out.
        </p>
        <ul>
          <li><Link to="/">Home</Link></li>
        </ul>
      </>)}
    </AppLayout>
  );
}

export default LoginPage;
