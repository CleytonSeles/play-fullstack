import React, { useState } from 'react';
import styled from 'styled-components';
import Input from '../layout/Input';
import Button from '../layout/Button';
import ErrorMessage from '../layout/ErrorMessage';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
`;

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid #dfe4ea;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #e94560;
    box-shadow: 0 0 0 2px rgba(233, 69, 96, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

interface VideoFormProps {
  onSubmit: (data: {
    title: string;
    url: string;
    description: string;
    thumbnailUrl: string;
    duration: string;
  }) => void;
  isLoading: boolean;
  error: string | null;
}

const VideoForm: React.FC<VideoFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [formErrors, setFormErrors] = useState<{ title?: string; url?: string }>({});
  
  const validateForm = () => {
    const errors: { title?: string; url?: string } = {};
    
    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!url.trim()) {
      errors.url = 'Video URL is required';
    } else if (!isValidUrl(url)) {
      errors.url = 'Please enter a valid URL';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Função para extrair ID do YouTube se a URL for do YouTube
  const extractYouTubeThumbnail = () => {
    if (!url) return;
    
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        let videoId = '';
        
        if (urlObj.hostname.includes('youtube.com')) {
          videoId = urlObj.searchParams.get('v') || '';
        } else if (urlObj.hostname.includes('youtu.be')) {
          videoId = urlObj.pathname.slice(1);
        }
        
        if (videoId && !thumbnailUrl) {
          setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
        }
      }
    } catch (e) {
      // URL inválida, não faz nada
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        title,
        url,
        description,
        thumbnailUrl,
        duration,
      });
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="title">Video Title *</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter video title"
          fullWidth
          error={!!formErrors.title}
        />
        {formErrors.title && <ErrorMessage>{formErrors.title}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="url">Video URL *</Label>
        <Input
          id="url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={extractYouTubeThumbnail}
          placeholder="https://www.youtube.com/watch?v=..."
          fullWidth
          error={!!formErrors.url}
        />
        {formErrors.url && <ErrorMessage>{formErrors.url}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="description">Description</Label>
        <TextArea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description for this video"
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="thumbnailUrl">Thumbnail URL (optional)</Label>
        <Input
          id="thumbnailUrl"
          type="text"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="https://example.com/thumbnail.jpg"
          fullWidth
        />
        {thumbnailUrl && (
          <div style={{ marginTop: '0.5rem' }}>
            <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Thumbnail Preview:</p>
            <img
              src={thumbnailUrl}
              alt="Thumbnail Preview"
              style={{
                maxWidth: '200px',
                maxHeight: '120px',
                border: '1px solid #dfe4ea',
                borderRadius: '4px',
              }}
            />
          </div>
        )}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="duration">Duration (optional)</Label>
        <Input
          id="duration"
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="E.g., 10:30"
          fullWidth
        />
      </FormGroup>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <ButtonGroup>
        <Button type="submit" primary disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Video'}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default VideoForm;
