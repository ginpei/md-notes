import firebaseui from 'firebaseui';
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Link, RouteComponentProps } from 'react-router-dom';
import AppLayout from '../independents/AppLayout';
import firebase from '../middleware/firebase';
import { notePath } from '../models/Notes';

type PageProps =
  & RouteComponentProps;

const LoginPage: React.FC<PageProps> = (props) => {
  const uiConfig: firebaseui.auth.Config = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE, // disable AccountChooser.com
    privacyPolicyUrl: () => props.history.push('/privacy'),
    signInOptions: [
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    tosUrl: () => props.history.push('/terms'),
  };

  const user = firebase.auth().currentUser;

  return (
    <AppLayout>
      <h1>Login</h1>
      {user ? (<>
        <p>
          ✓ Logged in.
        </p>
        <ul>
          <li><Link to={notePath()}>Note list</Link></li>
        </ul>
      </>) : (
        <StyledFirebaseAuth
          firebaseAuth={firebase.auth()}
          uiConfig={uiConfig}
        />
      )}
    </AppLayout>
  );
}

export default LoginPage;
