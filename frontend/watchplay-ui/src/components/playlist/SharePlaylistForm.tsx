import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../layout/Button';
import Input from '../layout/Input';
import ErrorMessage from '../layout/ErrorMessage';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 0.9rem;
`;

const HelpText = styled.p`
  font-size: 0.8rem;
  color: #666;
`;

interface SharePlaylistFormProps {
  onShare: (emails: string[]) => void;
  isLoading: boolean;
  error: string | null;
}

const SharePlaylistForm: React.FC<SharePlaylistFormProps> = ({ onShare, isLoading, error }) => {
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  
  const addEmail = () => {
    const trimmedEmail = emailInput.trim();
    
    // Validação básica de email
    if (!trimmedEmail) {
      setFormError('Please enter an email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    if (emails.includes(trimmedEmail)) {
      setFormError('This email is already in the list');
      return;
    }
    
    setEmails([...emails, trimmedEmail]);
    setEmailInput('');
    setFormError(null);
  };
  
  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (emails.length === 0) {
      setFormError('Please add at least one email address');
      return;
    }
    
    onShare(emails);
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="email">Enter email addresses to share with</Label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Input
            id="email"
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="friend@example.com"
            fullWidth
          />
          <Button type="button" onClick={addEmail} primary>
            Add
          </Button>
        </div>
        {formError && <ErrorMessage>{formError}</ErrorMessage>}
        <HelpText>
          Add emails one by one. You can add multiple recipients.
        </HelpText>
      </FormGroup>
      
      {emails.length > 0 && (
        <div>
          <Label>Recipients:</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {emails.map((email, index) => (
              <div
                key={index}
                style={{
                  background: '#f1f2f6',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                {email}
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    color: '#ff4757',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Button type="submit" primary fullWidth disabled={isLoading || emails.length === 0}>
        {isLoading ? 'Sharing...' : 'Share Playlist'}
      </Button>
    </Form>
  );
};

export default SharePlaylistForm;
