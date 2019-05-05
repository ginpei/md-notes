import React from 'react';
import AppLayout from '../independents/AppLayout';

const HomePage: React.FC = () => {
  return (
    <AppLayout>
      <h1>MD Notes</h1>
      <div style={{ textAlign: 'center' }}>
        <img src="/icon-512.png" alt="logo" width="256" height="256" />
      </div>
      <p>
        <a href="/notes/12/write">Write a note</a>
      </p>
    </AppLayout>
  );
}

export default HomePage;
