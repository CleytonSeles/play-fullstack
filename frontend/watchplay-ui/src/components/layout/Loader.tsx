import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
`;

const SpinnerWrapper = styled.div`
  width: 40px;
  height: 40px;
`;

const Spinner = styled.div`
  width: 100%;
  height: 100%;
  border: 4px solid rgba(233, 69, 96, 0.1);
  border-radius: 50%;
  border-left-color: #e94560;
  animation: ${spin} 1s linear infinite;
`;

const Loader: React.FC = () => {
  return (
    <LoaderContainer>
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    </LoaderContainer>
  );
};

export default Loader;
