"use client";

import React, { useEffect, useState } from 'react';
import { useClient } from '@xmtp/react-sdk';
import { useXmtpStore } from '../../store/useXmtpStore';

interface Conversation {
  topic: string;
  peerAddress: string;
  lastMessage?: string;
  lastMessageTime?: Date;
}

export function ConversationList() {
  const { client } = useClient();
  const { conversationTopic, setConversationTopic } = useXmtpStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      if (!client) return;
      
      try {
        setLoading(true);
        const conversations = await client.conversations.list();
        
        const conversationData: Conversation[] = await Promise.all(
          conversations.map(async (conv: any) => {
            const messages = await conv.messages();
            const lastMessage = messages[messages.length - 1];
            
            return {
              topic: conv.topic,
              peerAddress: conv.peerAddress,
              lastMessage: lastMessage?.content || 'No messages yet',
              lastMessageTime: lastMessage?.sentAt,
            };
          })
        );
        
        setConversations(conversationData);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, [client]);

  const selectConversation = (topic: string) => {
    setConversationTopic(topic);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
          <p className="text-gray-600">Start a new conversation to begin messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conversation) => (
        <div
          key={conversation.topic}
          onClick={() => selectConversation(conversation.topic)}
          className={`p-4 cursor-pointer rounded-lg transition-colors ${
            conversationTopic === conversation.topic
              ? 'bg-blue-50 border border-blue-200'
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {conversation.peerAddress.slice(0, 6)}...{conversation.peerAddress.slice(-4)}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {conversation.lastMessage}
              </p>
            </div>
            {conversation.lastMessageTime && (
              <div className="text-xs text-gray-400 ml-2">
                {conversation.lastMessageTime.toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 