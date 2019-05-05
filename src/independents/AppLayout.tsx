import React from 'react';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import styled from 'styled-components';

const AppBody = styled.div`
`;

const AppLayout: React.FC = ({ children }) => {
  return (
    <div className="AppLayout">
      <AppHeader />
      <AppBody className="container">
        {children}
      </AppBody>
      <AppFooter />
    </div>
  );
};

export default AppLayout;
