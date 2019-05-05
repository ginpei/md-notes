import React from 'react';
import styled from 'styled-components';

const DialogOuter = styled.div`
background-color: #0003;
height: 100vh;
left: 0;
position: fixed;
top: 0;
width: 100vw;
`;

const DialogInner = styled.article`
background-color: #fff;
border-radius: 0.2em;
height: calc(100% - 2rem);
left: 1rem;
overflow: auto;
position: absolute;
top: 1rem;
width: calc(100% - 2rem);
`;

const Dialog: React.FC = ({ children }) => {
  return (
    <DialogOuter>
      <DialogInner>
        {children}
      </DialogInner>
    </DialogOuter>
  );
};

export default Dialog;
