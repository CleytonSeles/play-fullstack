import React, { useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';
import Head from 'next/head';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 2rem;
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 450px;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const LinkContainer = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  
  a {
    color: #e94560;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/playlists');
    }
  }, [isAuthenticated, router]);
  
  return (
    <>
      <Head>
        <title>Sign Up | WatchPlay</title>
      </Head>
      
      <Container>
        <FormContainer>
          <Title>Create your WatchPlay account</Title>
          <RegisterForm />
          <LinkContainer>
            Already have an account?{' '}
            <Link href="/login">Login here</Link>
          </LinkContainer>
        </FormContainer>
      </Container>
    </>
  );
};

export default RegisterPage;
