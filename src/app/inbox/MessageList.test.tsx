import { expect } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, beforeEach, afterEach } from 'vitest';
import { MessageList } from './MessageList';

const mockMessages = [
  { id: 'm1', content: 'Hello', sender: '0xabc' },
  { id: 'm2', content: 'World', sender: '0xdef' },
];

describe('MessageList', () => {
  afterEach(() => cleanup());

  it('renders a list of messages', () => {
    render(<MessageList conversationId="c1" messages={mockMessages} isLoading={false} error={null} />);
    expect(screen.getByText('Hello')).toBeTruthy();
    expect(screen.getByText('World')).toBeTruthy();
  });

  it('shows loading state', () => {
    render(<MessageList conversationId="c1" messages={[]} isLoading={true} error={null} />);
    expect(screen.getByText(/loading/i)).toBeTruthy();
  });

  it('shows empty state', () => {
    render(<MessageList conversationId="c1" messages={[]} isLoading={false} error={null} />);
    expect(screen.getByText(/no messages/i)).toBeTruthy();
  });

  it('shows error state', () => {
    render(<MessageList conversationId="c1" messages={[]} isLoading={false} error={new Error('fail')} />);
    expect(screen.getByText(/fail/i)).toBeTruthy();
  });
}); 