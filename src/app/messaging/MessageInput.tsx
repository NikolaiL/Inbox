"use client";

import React, { useState } from 'react';
import { useClient } from '@xmtp/react-sdk';
import { useXmtpStore } from '../../store/useXmtpStore';

export function MessageInput() {
  const { client } = useClient();
  const { conversationTopic } = useXmtpStore();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if (!client || !conversationTopic || !message.trim()) return;

    try {
      setSending(true);
      const conversation = await client.conversations.newConversation(conversationTopic);
      await conversation.send(message);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!conversationTopic) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select a conversation to start messaging
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={sending}
        />
        <button
          onClick={sendMessage}
          disabled={!message.trim() || sending}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
} 