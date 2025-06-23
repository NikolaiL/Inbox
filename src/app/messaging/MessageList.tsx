"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useClient } from '@xmtp/react-sdk';
import { useXmtpStore } from '../../store/useXmtpStore';
import { usePrivy } from '@privy-io/react-auth';

interface Message {
  id: string;
  content: string;
  senderAddress: string;
  sent: Date;
}

export function MessageList() {
  const { conversationTopic } = useXmtpStore();
  const { client } = useClient();
  const { user } = usePrivy();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    async function loadMessages() {
      if (!client || !conversationTopic) {
        setMessages([]);
        return;
      }

      try {
        setLoading(true);
        const conversation = await client.conversations.newConversation(conversationTopic);
        const messageList = await conversation.messages();
        
        const messageData: Message[] = messageList.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          senderAddress: msg.senderAddress,
          sent: msg.sent,
        }));
        
        setMessages(messageData);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, [client, conversationTopic]);

  // Listen for new messages
  useEffect(() => {
    if (!client || !conversationTopic) return;

    const listenToMessages = async () => {
      try {
        const conversation = await client.conversations.newConversation(conversationTopic);
        
        // Listen for new messages
        for await (const message of await conversation.streamMessages()) {
          setMessages(prev => [...prev, {
            id: message.id,
            content: message.content,
            senderAddress: message.senderAddress,
            sent: message.sent,
          }]);
        }
      } catch (error) {
        console.error('Error listening to messages:', error);
      }
    };

    listenToMessages();
  }, [client, conversationTopic]);

  if (!conversationTopic) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
          <p className="text-gray-600">Choose a conversation to view messages</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  const currentUserAddress = user?.wallet?.address;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map((message) => {
          const isOwnMessage = message.senderAddress === currentUserAddress;
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwnMessage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.sent.toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
} 