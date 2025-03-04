import styled from 'styled-components';

interface InputProps {
  error?: boolean;
  fullWidth?: boolean;
}

const Input = styled.input<InputProps>`
  padding: 0.75rem 1rem;
  border: 1px solid ${(props) => (props.error ? '#ff4757' : '#dfe4ea')};
  border-radius: 4px;
  font-size: 1rem;
  background-color: #fff;
  transition: all 0.2s ease-in-out;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};

  &:focus {
    outline: none;
    border-color: ${(props) => (props.error ? '#ff4757' : '#e94560')};
    box-shadow: 0 0 0 2px ${(props) => (props.error ? 'rgba(255, 71, 87, 0.2)' : 'rgba(233, 69, 96, 0.2)')};
  }
`;

export default Input;
