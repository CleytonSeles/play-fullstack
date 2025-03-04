import React from 'react';
import styled from 'styled-components';
import { Playlist } from '@/types/playlist';
import { AiOutlinePlayCircle, AiOutlineEdit, AiOutlineDelete, AiOutlineShareAlt } from 'react-icons/ai';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/redux/hooks';

const PlaylistCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const PlaylistHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f1f2f6;
`;

const PlaylistTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  color: #1a1a2e;
`;

const PlaylistTag = styled.span`
  display: inline-block;
  background: #f1f2f6;
  color: #333;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const PlaylistContent = styled.div`
  padding: 1rem;
`;

const PlaylistDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const PlaylistTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const PlaylistMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  font-size: 0.8rem;
`;

const PlaylistActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: background-color 0.2s ease, color 0.2s ease;
  
  &:hover {
    background-color: #f1f2f6;
    color: #e94560;
  }
`;

const VideosCount = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const VisibilityBadge = styled.span<{ isPublic: boolean }>`
  background: ${props => props.isPublic ? '#16c79a' : '#aaa'};
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  margin-left: 0.5rem;
`;

interface PlaylistItemProps {
  playlist: Playlist;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ playlist, onDelete, onShare }) => {
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const isOwner = user?.id === playlist.userId;
  
  const handleView = () => {
    router.push(`/playlists/${playlist.id}`);
  };
  
  const handleEdit = () => {
    router.push(`/playlists/edit/${playlist.id}`);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(playlist.id);
  };
  
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare(playlist.id);
  };
  
  return (
    <PlaylistCard>
      <PlaylistHeader>
        <PlaylistTitle>
          {playlist.title}
          <VisibilityBadge isPublic={playlist.isPublic}>
            {playlist.isPublic ? 'Public' : 'Private'}
          </VisibilityBadge>
        </PlaylistTitle>
        
        <PlaylistActions>
          <ActionButton onClick={handleView} title="View playlist">
            <AiOutlinePlayCircle />
          </ActionButton>
          
          {isOwner && (
            <>
              <ActionButton onClick={handleEdit} title="Edit playlist">
                <AiOutlineEdit />
              </ActionButton>
              <ActionButton onClick={handleDelete} title="Delete playlist">
                <AiOutlineDelete />
              </ActionButton>
              <ActionButton onClick={handleShare} title="Share playlist">
                <AiOutlineShareAlt />
              </ActionButton>
            </>
          )}
        </PlaylistActions>
      </PlaylistHeader>
      
      <PlaylistContent>
        <PlaylistDescription>
          {playlist.description || 'No description'}
        </PlaylistDescription>
        
        {playlist.tags && playlist.tags.length > 0 && (
          <PlaylistTags>
            {playlist.tags.map((tag, index) => (
              <PlaylistTag key={index}>{tag}</PlaylistTag>
            ))}
          </PlaylistTags>
        )}
        
        <PlaylistMeta>
          <span>{playlist.category || 'Uncategorized'}</span>
          <VideosCount>
            {playlist.videos.length} videos
          </VideosCount>
        </PlaylistMeta>
      </PlaylistContent>
    </PlaylistCard>
  );
};

export default PlaylistItem;
