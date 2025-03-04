import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import styled from 'styled-components';
import Button from '@/components/layout/Button';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

const HeroSection = styled.section`
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  border-radius: 10px;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #e0e0e0;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesSection = styled.section`
  padding: 2rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin: 1rem 0;
  color: #1a1a2e;
`;

const FeatureDescription = styled.p`
  color: #666;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
`;

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/playlists');
    } else {
      router.push('/register');
    }
  };
  
  return (
    <>
      <Head>
        <title>WatchPlay - Personalized Video Playlists</title>
      </Head>
      
      <HeroSection>
        <Title>Welcome to WatchPlay</Title>
        <Subtitle>
          Create, manage, and share personalized video playlists with your friends.
          Organize your favorite videos in one place and enjoy watching them anytime.
        </Subtitle>
        
        <ButtonGroup>
          <Button primary onClick={handleGetStarted}>
            {isAuthenticated ? 'My Playlists' : 'Get Started'}
          </Button>
          
          {!isAuthenticated && (
            <Link href="/login" passHref legacyBehavior>
              <Button as="a">Login</Button>
            </Link>
          )}
        </ButtonGroup>
      </HeroSection>
      
      <FeaturesSection>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Features That You'll Love
        </h2>
        
        <FeaturesGrid>
          <FeatureCard>
            <FeatureTitle>Create Custom Playlists</FeatureTitle>
            <FeatureDescription>
              Organize your favorite videos into custom playlists. Add titles, descriptions, and tags.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureTitle>Share With Friends</FeatureTitle>
            <FeatureDescription>
              Share your playlists with friends and family. Control who can see your playlists.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureTitle>Filter and Discover</FeatureTitle>
            <FeatureDescription>
              Find playlists by categories and tags. Discover new content that matches your interests.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </>
  );
};

export default HomePage;
