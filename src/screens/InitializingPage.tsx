import React from 'react';
import styled from 'styled-components';

const Center = styled.div`
  align-items: center;
  background-color: #fff9;
  box-shadow: 0 0 20vmin #0003 inset;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;
`;

const Shaking = styled.div`
  animation: shaking 1000ms infinite;

  @keyframes shaking {
    0% { transform: translateX( 0  ) translateY( 0  ); }
    5% { transform: translateX( 2px) translateY( 2px); }
    10% { transform:                  translateY(-2px); }
    15% { transform: translateX(-2px) translateY( 2px); }
    20% { transform:                  translateY(-2px); }
    25% { transform: translateX( 0  ) translateY( 0  ); }
    100% { transform: translateX( 0  ) translateY( 0  ); }
  }
`;

const InitializingPage: React.FC = () => {
  return (
    <Center>
      <Shaking>📝</Shaking>
    </Center>
  );
}

export default InitializingPage;
