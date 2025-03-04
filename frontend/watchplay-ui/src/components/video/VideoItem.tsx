import React from 'react';
import styled from 'styled-components';
import { Video } from '@/types/playlist';
import { AiOutlineDelete } from 'react-icons/ai';
import { useAppSelector } from '@/redux/hooks';

const VideoCard = styled.div`
  display: flex;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ThumbnailContainer = styled.div`
  flex: 0 0 160px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlayOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${ThumbnailContainer}:hover & {
    opacity: 1;
  }
  
  &::before {
    content: '';
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 12px solid white;
    margin-left: 3px;
  }
`;

const VideoContent = styled.div`
  flex: 1;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
`;

const VideoTitle = styled.h4`
  font-size: 1rem;
  margin: 0 0 0.5rem;
  color: #333;
`;

const VideoDescription = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin: 0 0 0.5rem;
  flex: 1;
`;

const VideoMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #888;
`;

const VideoDuration = styled.span`
  background: #f1f2f6;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-weight: 500;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff4757;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  
  &:hover {
    opacity: 0.8;
  }
`;

interface VideoItemProps {
  video: Video;
  playlistId: string;
  onRemove?: (videoId: string) => void;
  canManage: boolean;
}

const VideoItem: React.FC<VideoItemProps> = ({ video, playlistId, onRemove, canManage }) => {
  const handlePlay = () => {
    window.open(video.url, '_blank');
  };
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(video.id);
    }
  };
  
  // Use a thumbnail from YouTube if available, otherwise use a placeholder
  const thumbnailUrl = video.thumbnailUrl || 
    (video.url.includes('youtube.com') ? 
      `https://img.youtube.com/vi/${video.url.split('v=')[1]}/mqdefault.jpg` : 
      'https://via.placeholder.com/160x90');
  
  return (
    <VideoCard>
      <ThumbnailContainer onClick={handlePlay}>
        <Thumbnail src={thumbnailUrl} alt={video.title} />
        <PlayOverlay />
      </ThumbnailContainer>
      
      <VideoContent>
        <VideoTitle>{video.title}</VideoTitle>
        <VideoDescription>
          {video.description || 'No description'}
        </VideoDescription>
        
        <VideoMeta>
          {video.duration && <VideoDuration>{video.duration}</VideoDuration>}
          
          {canManage && onRemove && (
            <DeleteButton onClick={handleRemove} title="Remove video">
              <AiOutlineDelete />
            </DeleteButton>
          )}
        </VideoMeta>
      </VideoContent>
    </VideoCard>
  );
};

export default VideoItem;
