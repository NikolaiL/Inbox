"use client";

import React, { useState } from 'react';
import { useXmtpV3Store } from '../../store/useXmtpV3Store';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { ConversationList } from './ConversationList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { listMessages, sendMessage } from '../../xmtp-v3/messages';
import { OnboardingModal } from '../onboarding/OnboardingModal';

export default function InboxPage() {
  const { conversations, isLoading, error, client, reset: resetXmtp } = useXmtpV3Store();
  const {
    ensName,
    walletConnected,
    showModal,
    reset: resetOnboarding,
    setShowModal,
  } = useOnboardingStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedConvo, setSelectedConvo] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgError, setMsgError] = useState<Error | null>(null);
  const [sendLoading, setSendLoading] = useState(false);

  // Get address from selected conversation or client
  const address = client?.address || '';
  const username = ensName || address;

  async function handleSelect(convo: any) {
    setSelectedId(convo.id);
    setSelectedConvo(convo);
    setMsgLoading(true);
    setMsgError(null);
    try {
      const msgs = await listMessages(convo);
      setMessages(msgs);
    } catch (e: any) {
      setMsgError(e);
      setMessages([]);
    } finally {
      setMsgLoading(false);
    }
  }

  async function handleSend(value: string) {
    if (!selectedConvo) return;
    setSendLoading(true);
    try {
      await sendMessage(selectedConvo, value);
      // Re-fetch messages after send
      const msgs = await listMessages(selectedConvo);
      setMessages(msgs);
    } catch (e) {
      // Optionally handle error
    } finally {
      setSendLoading(false);
    }
  }

  function handleExit() {
    resetXmtp();
    resetOnboarding();
    setShowModal(true);
    setSelectedId(null);
    setSelectedConvo(null);
    setMessages([]);
  }

  if (showModal) {
    return <OnboardingModal />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>{username}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>{address}</span>
          <button onClick={handleExit}>Exit</button>
        </div>
      </div>
      <h1>Inbox</h1>
      <div style={{ display: 'flex', gap: 24 }}>
        <div>
          <ConversationList
            onSelect={handleSelect}
            selectedId={selectedId}
          />
        </div>
        <div>
          {selectedId ? (
            <>
              <MessageList
                conversationId={selectedId}
                messages={messages}
                isLoading={msgLoading}
                error={msgError}
              />
              <MessageInput
                conversationId={selectedId}
                onSend={handleSend}
                isLoading={sendLoading}
              />
            </>
          ) : (
            <div>Select a conversation</div>
          )}
        </div>
      </div>
    </div>
  );
}