import type { Client, Dm, Group } from '@xmtp/browser-sdk';

export async function listConversations(client: Client): Promise<Array<Dm<unknown> | Group<unknown>>> {
  // Type cast for compatibility with generic usage
  return (await client.conversations.list()) as Array<Dm<unknown> | Group<unknown>>;
}

export async function newDm(client: Client, inboxId: string): Promise<Dm<unknown>> {
  // Type cast for compatibility with generic usage
  return (await client.conversations.newDm(inboxId)) as Dm<unknown>;
}

export async function syncConversations(client: Client): Promise<void> {
  await client.conversations.sync();
}

export { Dm, Group }; 