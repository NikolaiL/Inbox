import { describe, it, expect, vi } from 'vitest';
import * as consentModule from './consent';
import { ConsentEntityType, ConsentState } from './consent';

const mockClient = {
  preferences: {
    getConsentState: vi.fn(async () => 'mockConsent'),
    setConsentStates: vi.fn(async () => undefined),
  },
};

describe('XMTP V3 Consent Module', () => {
  it('getConsentState calls client.preferences.getConsentState with correct args', async () => {
    const result = await consentModule.getConsentState(
      mockClient as any,
      ConsentEntityType.InboxId,
      'entity123'
    );
    expect(mockClient.preferences.getConsentState).toHaveBeenCalledWith(ConsentEntityType.InboxId, 'entity123');
    expect(result).toBe('mockConsent');
  });

  it('setConsentState calls client.preferences.setConsentStates with correct args', async () => {
    await consentModule.setConsentState(
      mockClient as any,
      ConsentEntityType.InboxId,
      'entity123',
      ConsentState.Allowed
    );
    expect(mockClient.preferences.setConsentStates).toHaveBeenCalledWith([
      { entityType: ConsentEntityType.InboxId, entity: 'entity123', state: ConsentState.Allowed },
    ]);
  });
}); 