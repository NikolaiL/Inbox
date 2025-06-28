import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as clientModule from './client';

vi.mock('@xmtp/browser-sdk', () => ({
  Client: {
    build: vi.fn(async () => ({ mock: 'client' })),
  },
}));

const mockSigner = { getIdentity: vi.fn(), signMessage: vi.fn() };

describe('XMTP V3 Client Module', () => {
  beforeEach(() => {
    clientModule.disconnectXmtpClient();
  });

  it('buildXmtpClient initializes and returns a client', async () => {
    const client = await clientModule.buildXmtpClient(mockSigner);
    expect(client).toEqual({ mock: 'client' });
    expect(clientModule.getXmtpClient()).toEqual({ mock: 'client' });
  });

  it('disconnectXmtpClient clears the client', async () => {
    await clientModule.buildXmtpClient(mockSigner);
    clientModule.disconnectXmtpClient();
    expect(clientModule.getXmtpClient()).toBeNull();
  });
}); 