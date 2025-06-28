import type { Client } from '@xmtp/browser-sdk';
import { Dm, Group } from '@xmtp/browser-sdk';

export async function listConversations(client: Client): Promise<Array<Dm<any> | Group<any>>> {
  return client.conversations.list();
}

export async function newDm(client: Client, inboxId: string): Promise<Dm<any>> {
  return client.conversations.newDm(inboxId);
}

export async function syncConversations(client: Client): Promise<void> {
  await client.conversations.sync();
}

export { Dm, Group }; 