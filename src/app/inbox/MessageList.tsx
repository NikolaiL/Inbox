import React from 'react';
import type { DecodedMessage } from '@xmtp/browser-sdk';

export function MessageList({ messages }: { messages: DecodedMessage<unknown>[] }) {
  if (!messages.length) return <div>No messages</div>;
  return (
    <ul>
      {messages.map((m) => (
        <li key={m.id}>{typeof m.content === 'string' ? m.content : String(m.id)}</li>
      ))}
    </ul>
  );
} 