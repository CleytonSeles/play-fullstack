import styled from 'styled-components';

interface ButtonProps {
  primary?: boolean;
  danger?: boolean;
  small?: boolean;
  fullWidth?: boolean;
}

const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => 
    props.primary ? '#e94560' : 
    props.danger ? '#ff4757' : 
    '#f1f2f6'};
  color: ${(props) => (props.primary || props.danger) ? '#fff' : '#333'};
  border: none;
  border-radius: 4px;
  padding: ${(props) => (props.small ? '0.5rem 1rem' : '0.75rem 1.5rem')};
  font-size: ${(props) => (props.small ? '0.875rem' : '1rem')};
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};

  &:hover {
    background-color: ${(props) => 
      props.primary ? '#d63f57' : 
      props.danger ? '#e84118' : 
      '#dfe4ea'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export default Button;
