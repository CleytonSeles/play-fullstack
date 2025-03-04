import React from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createPlaylist } from '@/redux/slices/playlistSlice';
import styled from 'styled-components';
import Head from 'next/head';
import Button from '@/components/layout/Button';
import PlaylistForm from '@/components/playlist/PlaylistForm';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Container = styled.div`
  padding: 1rem 0;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: #333;
`;

const CreatePlaylistPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error } = useAppSelector((state) => state.playlists);
  
  const handleSubmit = async (data: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    isPublic: boolean;
  }) => {
    const resultAction = await dispatch(createPlaylist(data));
    
    if (createPlaylist.fulfilled.match(resultAction)) {
      router.push(`/playlists/${resultAction.payload.id}`);
    }
  };
  
  return (
    <>
      <Head>
        <title>Create Playlist | WatchPlay</title>
      </Head>
      
      <Container>
        <Card>
          <Header>
            <Title>Create New Playlist</Title>
            <Link href="/playlists" passHref legacyBehavior>
              <Button as="a">Cancel</Button>
            </Link>
          </Header>
          
          <PlaylistForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </Card>
      </Container>
    </>
  );
};

export default CreatePlaylistPage;
