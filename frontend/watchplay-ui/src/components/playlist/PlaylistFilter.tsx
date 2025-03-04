import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../layout/Button';

const FilterContainer = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #333;
`;

const FilterForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
`;

const FilterSelect = styled.select`
  padding: 0.6rem;
  border: 1px solid #dfe4ea;
  border-radius: 4px;
  background-color: white;
`;

const FilterInput = styled.input`
  padding: 0.6rem;
  border: 1px solid #dfe4ea;
  border-radius: 4px;
`;

interface PlaylistFilterProps {
  categories: string[];
  onFilter: (category: string, tags: string[]) => void;
  onClear: () => void;
}

const PlaylistFilter: React.FC<PlaylistFilterProps> = ({ categories, onFilter, onClear }) => {
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
      
    onFilter(category, tags);
  };
  
  const handleClear = () => {
    setCategory('');
    setTagsInput('');
    onClear();
  };
  
  return (
    <FilterContainer>
      <FilterTitle>Filter Playlists</FilterTitle>
      
      <FilterForm onSubmit={handleSubmit}>
        <FilterGroup>
          <FilterLabel htmlFor="category">Category</FilterLabel>
          <FilterSelect
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel htmlFor="tags">Tags (comma separated)</FilterLabel>
          <FilterInput
            id="tags"
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="music, sports, education"
          />
        </FilterGroup>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button type="submit" primary small>
            Apply Filter
          </Button>
          <Button type="button" small onClick={handleClear}>
            Clear
          </Button>
        </div>
      </FilterForm>
    </FilterContainer>
  );
};

export default PlaylistFilter;
