import type { Dm, Group, DecodedMessage } from '@xmtp/browser-sdk';

export async function listMessages(conversation: Dm<unknown> | Group<unknown>): Promise<DecodedMessage<unknown>[]> {
  return conversation.messages();
}

export async function sendMessage(conversation: Dm<unknown> | Group<unknown>, content: string): Promise<void> {
  await conversation.send(content);
}

export async function streamMessages(
  conversation: Dm<unknown> | Group<unknown>,
  callback: (err: Error | null, message?: DecodedMessage<unknown>) => void
) {
  return conversation.stream((err: Error | null, message?: DecodedMessage<unknown>) => {
    callback(err, message);
  });
} 