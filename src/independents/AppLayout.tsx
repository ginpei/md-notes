import React from 'react';
import { Link } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

const AppLayout: React.FC = ({ children }) => {
  return (
    <div className="AppLayout">
      <AppHeader />
      <div className="AppLayout-body" style={{
        margin: 'auto',
        maxWidth: 'calc(800px - 2rem)',
        padding: '0 1rem',
      }}>
        {children}
      </div>
      <AppFooter />
    </div>
  );
};

export default AppLayout;
