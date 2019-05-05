import React from 'react';
import styled from 'styled-components';

const Outer = styled.footer`
  border-top: 1px solid lightgray;
  margin-top: 1rem;
  padding-top: 1rem;
`;

const AppFooter: React.FC = () => {
  return (
    <Outer>
      <div className="container">
        <p>By Ginpei</p>
      </div>
    </Outer>
  );
};

export default AppFooter;
