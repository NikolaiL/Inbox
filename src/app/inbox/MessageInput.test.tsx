import { expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, vi, afterEach } from 'vitest';
import { MessageInput } from './MessageInput';

describe('MessageInput', () => {
  afterEach(() => {
    cleanup();
  });

  it('calls onSend with input value and clears input', () => {
    const onSend = vi.fn();
    render(<MessageInput onSend={onSend} disabled={false} />);
    const input = screen.getByPlaceholderText(/type a message/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.submit(input.closest('form')!);
    expect(onSend).toHaveBeenCalledWith('Hello');
    expect(input.value).toBe('');
  });

  it('does not call onSend for empty input', () => {
    const onSend = vi.fn();
    render(<MessageInput onSend={onSend} disabled={false} />);
    const input = screen.getByPlaceholderText(/type a message/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input.closest('form')!);
    expect(onSend).not.toHaveBeenCalled();
  });

  it('disables input and button when disabled', () => {
    const onSend = vi.fn();
    render(<MessageInput onSend={onSend} disabled={true} />);
    const input = screen.getByPlaceholderText(/type a message/i) as HTMLInputElement;
    const button = screen.getByRole('button', { name: /send/i }) as HTMLButtonElement;
    expect(input.disabled).toBe(true);
    expect(button.disabled).toBe(true);
  });
}); 