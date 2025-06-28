import { expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, vi, beforeEach, afterEach } from 'vitest';
import { ConversationList } from './ConversationList';
import * as storeModule from '../../store/useXmtpV3Store';
import type { Dm } from '@xmtp/browser-sdk';

// Test mock workaround: use 'unknown as Dm<unknown>' to satisfy type system for minimal mocks
const mockConversations: Dm<unknown>[] = [
  ({ id: '1', peerAddress: '0xabc', toString: () => 'Conversation 1' } as unknown) as Dm<unknown>,
  ({ id: '2', peerAddress: '0xdef', toString: () => 'Conversation 2' } as unknown) as Dm<unknown>,
];

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
    vi.spyOn(storeModule, 'useXmtpV3Store').mockImplementation((selector?: unknown) => {
      if (typeof selector === 'function') {
        return (selector as (state: typeof mockState) => unknown)(mockState);
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
    vi.spyOn(storeModule, 'useXmtpV3Store').mockImplementation((selector?: unknown) => {
      if (typeof selector === 'function') {
        return (selector as (state: typeof loadingState) => unknown)(loadingState);
      }
      return loadingState;
    });
    render(<ConversationList onSelect={vi.fn()} selectedId={null} />);
    expect(screen.getByText(/loading/i)).toBeTruthy();
  });

  it('shows empty state', () => {
    const emptyState = { ...mockState, conversations: [], isLoading: false };
    vi.spyOn(storeModule, 'useXmtpV3Store').mockImplementation((selector?: unknown) => {
      if (typeof selector === 'function') {
        return (selector as (state: typeof emptyState) => unknown)(emptyState);
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