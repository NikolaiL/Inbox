import type { Client } from '@xmtp/browser-sdk';
import { ConsentEntityType, ConsentState } from '@xmtp/wasm-bindings';

export async function getConsentState(
  client: Client,
  entityType: ConsentEntityType,
  entity: string
) {
  return client.preferences.getConsentState(entityType, entity);
}

export async function setConsentState(
  client: Client,
  entityType: ConsentEntityType,
  entity: string,
  state: ConsentState
) {
  return client.preferences.setConsentStates([
    { entityType, entity, state },
  ]);
}

export { ConsentEntityType, ConsentState }; 