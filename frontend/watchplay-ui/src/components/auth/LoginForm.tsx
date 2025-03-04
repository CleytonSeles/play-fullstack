import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { login } from '@/redux/slices/authSlice';
import styled from 'styled-components';
import Input from '../layout/Input';
import Button from '../layout/Button';
import ErrorMessage from '../layout/ErrorMessage';
import { useRouter } from 'next/router';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
`;

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  
  const dispatch = useAppDispatch();
  const { error, isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const resultAction = await dispatch(login({ email, password }));
      
      if (login.fulfilled.match(resultAction)) {
        router.push('/playlists');
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          fullWidth
          error={!!formErrors.email}
        />
        {formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          fullWidth
          error={!!formErrors.password}
        />
        {formErrors.password && <ErrorMessage>{formErrors.password}</ErrorMessage>}
      </FormGroup>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Button type="submit" primary fullWidth disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </Form>
  );
};

export default LoginForm;
