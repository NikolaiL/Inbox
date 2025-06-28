import { describe, it, expect, vi } from 'vitest';
import { listMessages, sendMessage } from './messages';
import type { Dm, DecodedMessage } from '@xmtp/browser-sdk';

describe('messages module', () => {
  it('listMessages returns messages from conversation', async () => {
    const mockMessages: DecodedMessage<unknown>[] = [
      ({ id: '1', content: 'hi' } as unknown) as DecodedMessage<unknown>,
      ({ id: '2', content: 'yo' } as unknown) as DecodedMessage<unknown>,
    ];
    const conversation = {
      messages: vi.fn(async () => mockMessages),
    } as unknown as Dm<unknown>;
    const result = await listMessages(conversation);
    expect(result).toEqual(mockMessages);
  });

  it('sendMessage calls send on the conversation with content', async () => {
    const send = vi.fn(async () => ({}));
    const conversation = { send } as unknown as Dm<unknown>;
    await sendMessage(conversation, 'hello');
    expect(send).toHaveBeenCalledWith('hello');
  });
}); 