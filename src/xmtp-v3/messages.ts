import type { Dm, Group } from '@xmtp/browser-sdk';
import { DecodedMessage } from '@xmtp/browser-sdk';

export async function listMessages(conversation: Dm<any> | Group<any>) {
  return conversation.messages();
}

export async function sendMessage(conversation: Dm<any> | Group<any>, content: any) {
  return conversation.send(content);
}

export async function streamMessages(
  conversation: Dm<any> | Group<any>,
  callback: (err: Error | null, message?: DecodedMessage<any>) => void
) {
  return conversation.stream((err, message) => {
    callback(err, message);
  });
} 