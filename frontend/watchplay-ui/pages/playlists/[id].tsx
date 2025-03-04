import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchPlaylist, removeVideo, sharePlaylist } from '@/redux/slices/playlistSlice';
import styled from 'styled-components';
import Head from 'next/head';
import Button from '@/components/layout/Button';
import VideoItem from '@/components/video/VideoItem';
import Loader from '@/components/layout/Loader';
import Link from 'next/link';
import SharePlaylistForm from '@/components/playlist/SharePlaylistForm';

const Container = styled.div`
  padding: 1rem 0;
`;

const Header = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PlaylistTitle = styled.h1`
  font-size: 1.75rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const PlaylistDescription = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: #f1f2f6;
  color: #333;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-top: 1px solid #f1f2f6;
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const VideosSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const VideosHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const VideosTitle = styled.h2`
  font-size: 1.4rem;
  color: #333;
`;

const EmptyVideos = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
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

const PlaylistDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();
  const { currentPlaylist, isLoading, error } = useAppSelector((state) => state.playlists);
  const { user } = useAppSelector((state) => state.auth);
  
  const [shareModal, setShareModal] = useState(false);
  
  useEffect(() => {
    if (id && typeof id === 'string') {
      dispatch(fetchPlaylist(id));
    }
  }, [dispatch, id]);
  
  const handleRemoveVideo = (videoId: string) => {
    if (window.confirm('Are you sure you want to remove this video?') && id) {
      dispatch(removeVideo({ playlistId: id as string, videoId }));
    }
  };
  
  const handleSharePlaylist = () => {
    setShareModal(true);
  };
  
  const handleShareSubmit = (emails: string[]) => {
    if (id) {
      dispatch(sharePlaylist({ id: id as string, share: { emails } }));
      setShareModal(false);
    }
  };
  
  const isOwner = currentPlaylist && user ? currentPlaylist.userId === user.id : false;
  
  if (isLoading && !currentPlaylist) {
    return <Loader />;
  }
  
  if (!currentPlaylist) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Playlist not found</h2>
          <p style={{ marginBottom: '1rem' }}>
            The playlist you're looking for doesn't exist or you don't have permission to view it.
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
        <title>{currentPlaylist.title} | WatchPlay</title>
      </Head>
      
      <Container>
        <Header>
          <PlaylistTitle>{currentPlaylist.title}</PlaylistTitle>
          <PlaylistDescription>
            {currentPlaylist.description || 'No description provided.'}
          </PlaylistDescription>
          
          {currentPlaylist.tags && currentPlaylist.tags.length > 0 && (
            <TagsContainer>
              {currentPlaylist.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagsContainer>
          )}
          
          <MetaInfo>
            <span>Category: {currentPlaylist.category || 'Uncategorized'}</span>
            <span>
              {currentPlaylist.isPublic ? 'Public' : 'Private'} • 
              {currentPlaylist.videos.length} videos
            </span>
          </MetaInfo>
        </Header>
        
        <ActionBar>
          <Link href="/playlists" passHref legacyBehavior>
            <Button as="a">Back to Playlists</Button>
          </Link>
          
          {isOwner && (
            <>
              <Link
                href={`/playlists/edit/${currentPlaylist.id}`}
                passHref
                legacyBehavior
              >
                <Button primary as="a">Edit Playlist</Button>
              </Link>
              <Link
                href={`/playlists/${currentPlaylist.id}/add-video`}
                passHref
                legacyBehavior
              >
                <Button primary as="a">Add Video</Button>
              </Link>
              <Button onClick={handleSharePlaylist}>Share</Button>
            </>
          )}
        </ActionBar>
        
        <VideosSection>
          <VideosHeader>
            <VideosTitle>Videos</VideosTitle>
          </VideosHeader>
          
          {currentPlaylist.videos.length === 0 ? (
            <EmptyVideos>
              <p>This playlist doesn't have any videos yet.</p>
              {isOwner && (
                <Link
                  href={`/playlists/${currentPlaylist.id}/add-video`}
                  passHref
                  legacyBehavior
                >
                  <Button primary as="a" style={{ marginTop: '1rem' }}>
                    Add Video
                  </Button>
                </Link>
              )}
            </EmptyVideos>
          ) : (
            <div>
              {currentPlaylist.videos.map((video) => (
                <VideoItem
                  key={video.id}
                  video={video}
                  playlistId={currentPlaylist.id}
                  onRemove={isOwner ? handleRemoveVideo : undefined}
                  canManage={isOwner}
                />
              ))}
            </div>
          )}
        </VideosSection>
        
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

export default PlaylistDetail;
