import { describe, it, expect, vi } from 'vitest';
import * as messagesModule from './messages';

const mockMessages = [{ id: 'msg1' }, { id: 'msg2' }];
const mockConversation = {
  messages: vi.fn(async () => mockMessages),
  send: vi.fn(async (content) => ({ id: 'sent', content })),
  stream: vi.fn((cb) => {
    cb(null, { id: 'streamed' });
    return 'streamHandle';
  }),
};

describe('XMTP V3 Messages Module', () => {
  it('listMessages returns messages from the conversation', async () => {
    const result = await messagesModule.listMessages(mockConversation as any);
    expect(result).toEqual(mockMessages);
    expect(mockConversation.messages).toHaveBeenCalled();
  });

  it('sendMessage calls send on the conversation with content', async () => {
    const result = await messagesModule.sendMessage(mockConversation as any, 'hello');
    expect(result).toEqual({ id: 'sent', content: 'hello' });
    expect(mockConversation.send).toHaveBeenCalledWith('hello');
  });

  it('streamMessages calls stream on the conversation and invokes the callback', async () => {
    const cb = vi.fn();
    const handle = await messagesModule.streamMessages(mockConversation as any, cb);
    expect(mockConversation.stream).toHaveBeenCalled();
    expect(cb).toHaveBeenCalledWith(null, { id: 'streamed' });
    expect(handle).toBe('streamHandle');
  });
}); 