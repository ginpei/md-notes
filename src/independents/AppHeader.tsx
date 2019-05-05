import React from 'react';
import { Link } from 'react-router-dom';

const AppHeader: React.FC = () => {
  return (
    <header className="AppHeader">
      <div>
        MD Notes
      </div>
      <div>
        <Link to="/">Home</Link>
        {' | '}
        <Link to="/about">About</Link>
        {' | '}
        <Link to={`/random-${`${Math.random()}`.slice(2)}`}>Something else</Link>
      </div>
    </header>
  );
};

export default AppHeader;
