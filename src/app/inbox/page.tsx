"use client";

import React, { useState, useEffect } from 'react';
import { useXmtpV3Store } from '../../store/useXmtpV3Store';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { ConversationList } from './ConversationList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { OnboardingModal } from '../onboarding/OnboardingModal';
import { usePrivy } from '@privy-io/react-auth';
import type { DecodedMessage, Dm, Group } from '@xmtp/browser-sdk';

export default function InboxPage() {
  const { listMessages, sendMessage } = useXmtpV3Store();
  const { reset: resetOnboarding } = useOnboardingStore();
  const { user, logout } = usePrivy();
  const [selectedConversation, setSelectedConversation] = useState<Dm<unknown> | Group<unknown> | null>(null);
  const [messages, setMessages] = useState<DecodedMessage<unknown>[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Get address from Privy user object
  const address: string = user?.wallet?.address || 'Unknown';
  const username: string = address;

  useEffect(() => {
    if (!selectedConversation) return;
    setLoadingMessages(true);
    listMessages(selectedConversation).then((msgs: DecodedMessage<unknown>[]) => {
      setMessages(msgs);
      setLoadingMessages(false);
    });
  }, [selectedConversation, listMessages]);

  function handleExit() {
    resetOnboarding();
    logout();
    setSelectedConversation(null);
    setMessages([]);
  }

  return (
    <div>
      <OnboardingModal />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontWeight: 'bold' }}>{username}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{address}</div>
        </div>
        <button onClick={handleExit}>Exit</button>
      </div>
      <h1>Inbox</h1>
      <ConversationList
        onSelect={c => setSelectedConversation(c as unknown as Dm<unknown> | Group<unknown>)}
        selectedId={selectedConversation?.id ?? null}
      />
      {selectedConversation && (
        <>
          <MessageList messages={messages} />
          <MessageInput
            onSend={msg => {
              if (!selectedConversation) return;
              sendMessage(selectedConversation, msg).then(() => {
                listMessages(selectedConversation).then((msgs: DecodedMessage<unknown>[]) => setMessages(msgs));
              });
            }}
            disabled={loadingMessages}
          />
        </>
      )}
    </div>
  );
}