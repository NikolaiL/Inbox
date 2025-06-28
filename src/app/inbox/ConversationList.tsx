import React from 'react';
import { useXmtpV3Store } from '../../store/useXmtpV3Store';
import type { Dm, Group } from '@xmtp/browser-sdk';

export function ConversationList({ onSelect, selectedId }: {
  onSelect: (c: Dm<unknown> | Group<unknown>) => void;
  selectedId: string | null;
}) {
  const { conversations, isLoading } = useXmtpV3Store();

  if (isLoading) return <div>Loading...</div>;
  if (!conversations.length) return <div>No conversations</div>;

  return (
    <ul>
      {conversations.map((c) => (
        <li
          key={c.id}
          style={{ fontWeight: c.id === selectedId ? 'bold' : 'normal', cursor: 'pointer' }}
          onClick={() => onSelect(c as Dm<unknown> | Group<unknown>)}
        >
          {c.toString()}
        </li>
      ))}
    </ul>
  );
} 