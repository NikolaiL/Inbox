"use client";

import React, { useState } from 'react';
import { useClient } from '@xmtp/react-sdk';
import { useXmtpStore } from '../../store/useXmtpStore';

export function NewConversation() {
  const { client } = useClient();
  const { setConversationTopic } = useXmtpStore();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startConversation = async () => {
    if (!client || !recipientAddress.trim()) return;

    try {
      setLoading(true);
      setError('');
      
      // Check if recipient is on XMTP
      const canMessage = await client.canMessage(recipientAddress);
      if (!canMessage) {
        setError('Recipient is not on XMTP network');
        return;
      }

      // Start conversation
      const conversation = await client.conversations.newConversation(recipientAddress);
      setConversationTopic(conversation.topic);
      setRecipientAddress('');
    } catch (error) {
      console.error('Error starting conversation:', error);
      setError('Failed to start conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      startConversation();
    }
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">New Conversation</h3>
      <div className="space-y-3">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter wallet address (0x...)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>
        
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        
        <button
          onClick={startConversation}
          disabled={!recipientAddress.trim() || loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Starting...' : 'Start Conversation'}
        </button>
      </div>
    </div>
  );
} 