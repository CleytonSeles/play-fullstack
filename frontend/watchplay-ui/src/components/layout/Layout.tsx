import React, { ReactNode, useEffect } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Lista de rotas públicas
  const publicRoutes = ['/', '/login', '/register'];
  const isPublicRoute = publicRoutes.includes(router.pathname);

  useEffect(() => {
    // Redireciona para login se não estiver autenticado e a rota não for pública
    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login');
    }
  }, [isAuthenticated, isPublicRoute, router]);

  return (
    <Container>
      <Navbar />
      <Content>{children}</Content>
    </Container>
  );
};

export default Layout;
