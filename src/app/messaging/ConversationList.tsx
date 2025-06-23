"use client";

import React, { useEffect, useState } from 'react';
import { useClient, Conversation } from '@xmtp/react-sdk';
import { useXmtpStore } from '../../store/useXmtpStore';

type ConversationDisplay = {
  topic: string;
  peerAddress: string;
  lastMessage: string;
  lastMessageTimestamp: number;
};

export function ConversationList() {
  const { client } = useClient();
  const { setConversationTopic } = useXmtpStore();
  const [conversations, setConversations] = useState<ConversationDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!client) return;
      try {
        setLoading(true);
        const convs = await client.conversations.list();
        
        const conversationData: ConversationDisplay[] = await Promise.all(
          convs.map(async (conv: Conversation) => {
            const messages = await conv.messages();
            const lastMessage = messages[messages.length - 1];
            return {
              topic: conv.topic,
              peerAddress: conv.peerAddress,
              lastMessage: lastMessage?.content || '',
              lastMessageTimestamp: lastMessage?.sent.getTime() || 0,
            };
          })
        );
        
        conversationData.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);

        setConversations(conversationData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch conversations", error);
        setLoading(false);
      }
    };
    fetchConversations();
  }, [client]);

  const handleConversationSelect = (topic: string) => {
    setConversationTopic(topic);
  };

  if (loading) {
    return <div>Loading conversations...</div>;
  }

  if (conversations.length === 0) {
    return <div>No conversations yet.</div>;
  }

  return (
    <div className="h-full overflow-y-auto">
      <ul>
        {conversations.map((conv, index) => (
          <li 
            key={index} 
            onClick={() => handleConversationSelect(conv.topic)} 
            className="p-4 hover:bg-gray-100 cursor-pointer border-b"
          >
            <div className="font-bold">{conv.peerAddress}</div>
            <div className="text-sm text-gray-600 truncate">{conv.lastMessage}</div>
            <div className="text-xs text-gray-400">
              {new Date(conv.lastMessageTimestamp).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 