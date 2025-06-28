import { expect } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, afterEach } from 'vitest';
import { MessageList } from './MessageList';
import type { DecodedMessage } from '@xmtp/browser-sdk';

// Test mock workaround: use 'unknown as DecodedMessage<unknown>' to satisfy type system for minimal mocks
const mockMessages: DecodedMessage<unknown>[] = [
  ({ id: 'm1', content: 'Hello' } as unknown) as DecodedMessage<unknown>,
  ({ id: 'm2', content: 'World' } as unknown) as DecodedMessage<unknown>,
];

describe('MessageList', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a list of messages', () => {
    render(<MessageList messages={mockMessages} />);
    expect(screen.getByText('Hello')).toBeTruthy();
    expect(screen.getByText('World')).toBeTruthy();
  });

  it('shows empty state', () => {
    render(<MessageList messages={[]} />);
    expect(screen.getByText(/no messages/i)).toBeTruthy();
  });
}); 