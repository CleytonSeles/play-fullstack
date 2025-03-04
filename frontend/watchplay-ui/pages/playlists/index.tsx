import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { deletePlaylist, fetchPlaylists, filterPlaylists } from '@/redux/slices/playlistSlice';
import styled from 'styled-components';
import Button from '@/components/layout/Button';
import PlaylistItem from '@/components/playlist/PlaylistItem';
import Loader from '@/components/layout/Loader';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PlaylistFilter from '@/components/playlist/PlaylistFilter';
import SharePlaylistForm from '@/components/playlist/SharePlaylistForm';
import { sharePlaylist } from '@/redux/slices/playlistSlice';

const Container = styled.div`
  padding: 1rem 0;
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

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const EmptyStateText = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1.5rem;
`;

// Modal styles
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.2s ease;
  
  &:hover {
    color: #e94560;
  }
`;

const PlaylistsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { playlists, isLoading, error } = useAppSelector((state) => state.playlists);
  
  // Estado local para modais
  const [shareModal, setShareModal] = useState(false);
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(null);
  
  // Estado para categorias únicas extraídas das playlists
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    dispatch(fetchPlaylists());
  }, [dispatch]);
  
  useEffect(() => {
    // Extrair categorias únicas das playlists
    if (playlists.length > 0) {
      const uniqueCategories = Array.from(
        new Set(
          playlists
            .map(playlist => playlist.category)
            .filter(category => category !== undefined && category !== '')
        )
      ) as string[];
      
      setCategories(uniqueCategories);
    }
  }, [playlists]);
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      dispatch(deletePlaylist(id));
    }
  };
  
  const handleShare = (id: string) => {
    setCurrentPlaylistId(id);
    setShareModal(true);
  };
  
  const handleShareSubmit = (emails: string[]) => {
    if (currentPlaylistId) {
      dispatch(sharePlaylist({ id: currentPlaylistId, share: { emails } }));
      setShareModal(false);
    }
  };
  
  const handleFilter = (category: string, tags: string[]) => {
    const filterParams: { category?: string, tags?: string[] } = {};
    if (category) filterParams.category = category;
    if (tags.length > 0) filterParams.tags = tags;
    
    dispatch(filterPlaylists(filterParams));
  };
  
  const handleClearFilter = () => {
    dispatch(fetchPlaylists());
  };
  
  if (isLoading && playlists.length === 0) {
    return <Loader />;
  }
  
  return (
    <>
      <Head>
        <title>My Playlists | WatchPlay</title>
      </Head>
      
      <Container>
        <Header>
          <Title>My Playlists</Title>
          <Link href="/playlists/create" passHref legacyBehavior>
            <Button primary as="a">Create New Playlist</Button>
          </Link>
        </Header>
        
        <PlaylistFilter
          categories={categories}
          onFilter={handleFilter}
          onClear={handleClearFilter}
        />
        
        {playlists.length === 0 ? (
          <EmptyState>
            <EmptyStateText>
              You don't have any playlists yet. Create your first playlist to get started!
            </EmptyStateText>
            <Link href="/playlists/create" passHref legacyBehavior>
              <Button primary as="a">Create Playlist</Button>
            </Link>
          </EmptyState>
        ) : (
          <PlaylistGrid>
            {playlists.map((playlist) => (
              <PlaylistItem
                key={playlist.id}
                playlist={playlist}
                onDelete={handleDelete}
                onShare={handleShare}
              />
            ))}
          </PlaylistGrid>
        )}
        
        {/* Modal de compartilhamento */}
        {shareModal && (
          <ModalBackdrop>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Share Playlist</ModalTitle>
                <CloseButton onClick={() => setShareModal(false)}>×</CloseButton>
              </ModalHeader>
              <SharePlaylistForm
                onShare={handleShareSubmit}
                isLoading={isLoading}
                error={error}
              />
            </ModalContent>
          </ModalBackdrop>
        )}
      </Container>
    </>
  );
};

export default PlaylistsPage;
