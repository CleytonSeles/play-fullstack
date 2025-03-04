import React, { useState } from 'react';
import styled from 'styled-components';
import Input from '../layout/Input';
import Button from '../layout/Button';
import ErrorMessage from '../layout/ErrorMessage';
import { Playlist } from '@/types/playlist';

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

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  
  input {
    width: 18px;
    height: 18px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

interface PlaylistFormProps {
  initialData?: Partial<Playlist>;
  onSubmit: (data: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    isPublic: boolean;
  }) => void;
  isLoading: boolean;
  error: string | null;
}

const PlaylistForm: React.FC<PlaylistFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  error,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');
  const [isPublic, setIsPublic] = useState(initialData?.isPublic !== undefined ? initialData.isPublic : true);
  const [formErrors, setFormErrors] = useState<{ title?: string }>({});
  
  const validateForm = () => {
    const errors: { title?: string } = {};
    
    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Parse tags from comma-separated input
      const tags = tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
        
      onSubmit({
        title,
        description,
        category,
        tags,
        isPublic,
      });
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter playlist title"
          fullWidth
          error={!!formErrors.title}
        />
        {formErrors.title && <ErrorMessage>{formErrors.title}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="description">Description</Label>
        <TextArea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description for your playlist"
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="E.g., Music, Education, Entertainment"
          fullWidth
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="E.g., music, rock, favorites"
          fullWidth
        />
      </FormGroup>
      
      <FormGroup>
        <Checkbox>
          <input
            id="isPublic"
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <Label htmlFor="isPublic">Make this playlist public</Label>
        </Checkbox>
      </FormGroup>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <ButtonGroup>
        <Button type="submit" primary disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Playlist'}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default PlaylistForm;
