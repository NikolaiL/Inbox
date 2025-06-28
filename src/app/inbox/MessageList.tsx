import React from 'react';

export function MessageList({ conversationId, messages, isLoading, error }: {
  conversationId: string;
  messages: Array<{ id: string; content: string; sender: string }>;
  isLoading: boolean;
  error: Error | null;
}) {
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!messages.length) return <div>No messages</div>;
  return (
    <ul>
      {messages.map((m) => (
        <li key={m.id}>{m.content}</li>
      ))}
    </ul>
  );
} 