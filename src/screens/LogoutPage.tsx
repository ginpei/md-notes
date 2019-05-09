import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import AppLayout from '../independents/AppLayout';
import firebase from '../middleware/firebase';
import { AppState } from '../models/store';

interface StateProps {
  loggedIn: boolean;
}

const mapState = ({ currentUser }: AppState): StateProps => ({
  loggedIn: currentUser.loggedIn,
});

type PageProps =
  & RouteComponentProps
  & StateProps;

const LoginPage: React.FC<PageProps> = (props) => {
  const [signingOut, setSigningOut] = useState(false);

  const onLogoutClick = async () => {
    setSigningOut(true);
    await firebase.auth().signOut();
  };

  return (
    <AppLayout>
      <h1>Logout</h1>
      {props.loggedIn ? (
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

export default connect(mapState)(LoginPage);
