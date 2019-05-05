import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Outer = styled.header`
  background-color: #036;
  color: #fff;
  font-size: 0.8rem;
  line-height: 1rem;

  & a {
    color: inherit;
    text-decoration: none;

    :hover {
      text-decoration: underline;
    }
  }
`;

const Inner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const LinksWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 1rem;
  text-align: right;

  & a {
    margin-left: 1rem;
  }
`;

const AppHeader: React.FC = () => {
  return (
    <Outer>
      <Inner className="container">
        <Link to="/">MD Notes</Link>
        <LinksWrapper>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to={`/random-${`${Math.random()}`.slice(2)}`}>Something else</Link>
        </LinksWrapper>
      </Inner>
    </Outer>
  );
};

export default AppHeader;
