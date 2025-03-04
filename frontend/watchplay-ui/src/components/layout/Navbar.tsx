import React from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const NavContainer = styled.nav`
  background-color: #1a1a2e;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #e94560;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #e94560;
    cursor: pointer;
  }
`;

const NavButton = styled.button`
  background-color: #e94560;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #d63f57;
  }
`;

const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <NavContainer>
      <NavContent>
        <Link href="/" passHref legacyBehavior>
          <Logo as="a">WatchPlay</Logo>
        </Link>
        
        <NavLinks>
          {isAuthenticated ? (
            <>
              <Link href="/playlists" passHref legacyBehavior>
                <NavLink>My Playlists</NavLink>
              </Link>
              <Link href="/playlists/create" passHref legacyBehavior>
                <NavLink>Create Playlist</NavLink>
              </Link>
              <NavButton onClick={handleLogout}>Logout</NavButton>
            </>
          ) : (
            <>
              <Link href="/login" passHref legacyBehavior>
                <NavLink>Login</NavLink>
              </Link>
              <Link href="/register" passHref legacyBehavior>
                <NavButton as="a">Sign Up</NavButton>
              </Link>
            </>
          )}
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar;
