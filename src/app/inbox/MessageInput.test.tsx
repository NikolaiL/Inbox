import { expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, afterEach } from 'vitest';
import { MessageInput } from './MessageInput';

describe('MessageInput', () => {
  afterEach(() => cleanup());

  it('renders input and send button', () => {
    render(<MessageInput conversationId="c1" onSend={() => {}} isLoading={false} />);
    expect(screen.getByPlaceholderText(/type a message/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /send/i })).toBeTruthy();
  });

  it('calls onSend with input value when send is clicked', () => {
    const onSend = vi.fn();
    render(<MessageInput conversationId="c1" onSend={onSend} isLoading={false} />);
    const input = screen.getByPlaceholderText(/type a message/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(onSend).toHaveBeenCalledWith('Hello');
  });

  it('disables input and button when isLoading is true', () => {
    render(<MessageInput conversationId="c1" onSend={() => {}} isLoading={true} />);
    expect((screen.getByPlaceholderText(/type a message/i) as HTMLInputElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: /send/i }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('clears input after send', () => {
    const onSend = vi.fn();
    render(<MessageInput conversationId="c1" onSend={onSend} isLoading={false} />);
    const input = screen.getByPlaceholderText(/type a message/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(input.value).toBe('');
  });
}); 