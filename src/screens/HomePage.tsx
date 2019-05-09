import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AppLayout from '../independents/AppLayout';
import { notePath } from '../models/Notes';
import { AppState } from '../models/store';

interface StateProps {
  loggedIn: boolean;
}

const mapState = ({ currentUser }: AppState): StateProps => ({
  loggedIn: currentUser.loggedIn,
});

type PageProps =
  & StateProps;

const HomePage: React.FC<PageProps> = (props) => {
  return (
    <AppLayout>
      <h1>MD Notes</h1>
      <div style={{ textAlign: 'center' }}>
        <img src="/icon-512.png" alt="logo" width="256" height="256" />
      </div>
      <ul>
        {props.loggedIn ? (
          <li><Link to="/logout">Logout</Link></li>
          ) : (
          <li><Link to="/login">Login</Link></li>
        )}
        <li><Link to={notePath()}>Note list</Link></li>
      </ul>
    </AppLayout>
  );
}

export default connect(mapState)(HomePage);
