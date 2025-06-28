import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useXmtpV3Store } from './useXmtpV3Store';

import { Client } from '@xmtp/browser-sdk';

vi.mock('@xmtp/browser-sdk', () => ({
  Client: {
    build: vi.fn(async () => ({ mock: 'client' })),
  },
}));

describe('XMTP V3 Zustand Store', () => {
  beforeEach(() => {
    useXmtpV3Store.getState().reset();
    vi.mocked(Client.build).mockResolvedValue({ mock: 'client' });
  });

  it('initialize sets isLoading, then sets client and clears error', async () => {
    const store = useXmtpV3Store.getState();
    const promise = store.initialize({});
    expect(useXmtpV3Store.getState().isLoading).toBe(true);
    await promise;
    expect(useXmtpV3Store.getState().client).toEqual({ mock: 'client' });
    expect(useXmtpV3Store.getState().isLoading).toBe(false);
    expect(useXmtpV3Store.getState().error).toBeNull();
  });

  it('initialize sets error on failure', async () => {
    vi.mocked(Client.build).mockRejectedValueOnce(new Error('fail'));
    const store = useXmtpV3Store.getState();
    await store.initialize({});
    expect(useXmtpV3Store.getState().error).toBeInstanceOf(Error);
    expect(useXmtpV3Store.getState().isLoading).toBe(false);
    expect(useXmtpV3Store.getState().client).toBeNull();
  });

  it('reset clears all state', async () => {
    const store = useXmtpV3Store.getState();
    await store.initialize({});
    store.reset();
    expect(useXmtpV3Store.getState().client).toBeNull();
    expect(useXmtpV3Store.getState().conversations).toEqual([]);
    expect(useXmtpV3Store.getState().isLoading).toBe(false);
    expect(useXmtpV3Store.getState().error).toBeNull();
  });
}); 