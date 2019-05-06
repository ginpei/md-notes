import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../independents/AppLayout';

const HomePage: React.FC = () => {
  return (
    <AppLayout>
      <h1>MD Notes</h1>
      <div style={{ textAlign: 'center' }}>
        <img src="/icon-512.png" alt="logo" width="256" height="256" />
      </div>
      <ul>
        <li><Link to="/notes">Note list</Link></li>
        <li><Link to="/notes/12/write">Write a note</Link></li>
      </ul>
    </AppLayout>
  );
}

export default HomePage;
