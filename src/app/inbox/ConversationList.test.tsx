import { expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, vi, beforeEach, afterEach } from 'vitest';
import { ConversationList } from './ConversationList';
import * as storeModule from '../../store/useXmtpV3Store';

// 'as any' is used here to satisfy the Conversation[] type for test mocks only
const mockConversations = [
  { id: '1', peerAddress: '0xabc', toString: () => 'Conversation 1' },
  { id: '2', peerAddress: '0xdef', toString: () => 'Conversation 2' },
] as any;

const mockInitialize = vi.fn();
const mockReset = vi.fn();

const mockState = {
  client: null,
  conversations: mockConversations,
  isLoading: false,
  error: null,
  initialize: mockInitialize,
  reset: mockReset,
};

describe('ConversationList', () => {
  beforeEach(() => {
    vi.spyOn(storeModule, 'useXmtpV3Store').mockImplementation((selector?: any) => {
      if (typeof selector === 'function') {
        return selector(mockState);
      }
      return mockState;
    });
  });
  afterEach(() => {
    cleanup();
  });

  it('renders a list of conversations', () => {
    render(<ConversationList onSelect={vi.fn()} selectedId={null} />);
    expect(screen.getByText('Conversation 1')).toBeTruthy();
    expect(screen.getByText('Conversation 2')).toBeTruthy();
  });

  it('shows loading state', () => {
    const loadingState = { ...mockState, conversations: [], isLoading: true };
    vi.spyOn(storeModule, 'useXmtpV3Store').mockImplementation((selector?: any) => {
      if (typeof selector === 'function') {
        return selector(loadingState);
      }
      return loadingState;
    });
    render(<ConversationList onSelect={vi.fn()} selectedId={null} />);
    expect(screen.getByText(/loading/i)).toBeTruthy();
  });

  it('shows empty state', () => {
    const emptyState = { ...mockState, conversations: [], isLoading: false };
    vi.spyOn(storeModule, 'useXmtpV3Store').mockImplementation((selector?: any) => {
      if (typeof selector === 'function') {
        return selector(emptyState);
      }
      return emptyState;
    });
    render(<ConversationList onSelect={vi.fn()} selectedId={null} />);
    expect(screen.getByText(/no conversations/i)).toBeTruthy();
  });

  it('calls onSelect when a conversation is clicked', () => {
    const onSelect = vi.fn();
    render(<ConversationList onSelect={onSelect} selectedId={null} />);
    const items = screen.getAllByText('Conversation 1');
    fireEvent.click(items[0]);
    expect(onSelect).toHaveBeenCalledWith(mockConversations[0]);
  });
}); 