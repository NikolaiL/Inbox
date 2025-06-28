import { describe, it, expect, vi } from 'vitest';
import * as conversationsModule from './conversations';

const mockDm = { id: 'dm1' };
const mockGroup = { id: 'group1' };
const mockClient = {
  conversations: {
    list: vi.fn(async () => [mockDm, mockGroup]),
    newDm: vi.fn(async (inboxId) => ({ id: `dm-${inboxId}` })),
    sync: vi.fn(async () => undefined),
  },
};

describe('XMTP V3 Conversations Module', () => {
  it('listConversations returns conversations from the client', async () => {
    const result = await conversationsModule.listConversations(mockClient as any);
    expect(result).toEqual([mockDm, mockGroup]);
    expect(mockClient.conversations.list).toHaveBeenCalled();
  });

  it('newDm creates a new DM with the given inboxId', async () => {
    const result = await conversationsModule.newDm(mockClient as any, 'inbox123');
    expect(result).toEqual({ id: 'dm-inbox123' });
    expect(mockClient.conversations.newDm).toHaveBeenCalledWith('inbox123');
  });

  it('syncConversations calls sync on the client', async () => {
    await conversationsModule.syncConversations(mockClient as any);
    expect(mockClient.conversations.sync).toHaveBeenCalled();
  });
}); 