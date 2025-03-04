import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addVideo, fetchPlaylist } from '@/redux/slices/playlistSlice';
import styled from 'styled-components';
import Head from 'next/head';
import Button from '@/components/layout/Button';
import VideoForm from '@/components/video/VideoForm';
import Link from 'next/link';
import Loader from '@/components/layout/Loader';

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

const AddVideoPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();
  const { currentPlaylist, isLoading, error } = useAppSelector((state) => state.playlists);
  const { user } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    if (id && typeof id === 'string') {
      dispatch(fetchPlaylist(id));
    }
  }, [dispatch, id]);
  
  const handleSubmit = async (data: {
    title: string;
    url: string;
    description: string;
    thumbnailUrl: string;
    duration: string;
  }) => {
    if (id && typeof id === 'string') {
      const resultAction = await dispatch(addVideo({
        playlistId: id,
        video: data,
      }));
      
      if (addVideo.fulfilled.match(resultAction)) {
        router.push(`/playlists/${id}`);
      }
    }
  };
  
  // Verifica se está carregando ou se a playlist não foi encontrada
  if (isLoading && !currentPlaylist) {
    return <Loader />;
  }
  
  // Verifica se o usuário tem permissão para adicionar vídeos
  if (currentPlaylist && user && currentPlaylist.userId !== user.id) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Access Denied</h2>
          <p style={{ marginBottom: '1rem' }}>
            You don't have permission to add videos to this playlist.
          </p>
          <Link href="/playlists" passHref legacyBehavior>
            <Button as="a">Back to Playlists</Button>
          </Link>
        </div>
      </Container>
    );
  }
  
  if (!currentPlaylist) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Playlist not found</h2>
          <p style={{ marginBottom: '1rem' }}>
            The playlist you're trying to add videos to doesn't exist.
          </p>
          <Link href="/playlists" passHref legacyBehavior>
            <Button as="a">Back to Playlists</Button>
          </Link>
        </div>
      </Container>
    );
  }
  
  return (
    <>
      <Head>
        <title>Add Video | WatchPlay</title>
      </Head>
      
      <Container>
        <Card>
          <Header>
            <Title>Add Video to {currentPlaylist.title}</Title>
            <Link href={`/playlists/${id}`} passHref legacyBehavior>
              <Button as="a">Cancel</Button>
            </Link>
          </Header>
          
          <VideoForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </Card>
      </Container>
    </>
  );
};

export default AddVideoPage;
