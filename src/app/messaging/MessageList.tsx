"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useClient, DecodedMessage } from '@xmtp/react-sdk';
import { useXmtpStore } from '../../store/useXmtpStore';
import { usePrivy } from '@privy-io/react-auth';
import { Conversation, Stream } from '@xmtp/xmtp-js';

export function MessageList() {
  const { conversationTopic } = useXmtpStore();
  const { client } = useClient();
  const { user } = usePrivy();
  const [messages, setMessages] = useState<DecodedMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!client || !conversationTopic) {
      setMessages([]);
      return;
    }

    let conversation: Conversation;
    let stream: Stream<DecodedMessage>;

    const loadMessages = async () => {
      try {
        setLoading(true);
        conversation = await client.conversations.newConversation(
          conversationTopic
        );
        const initialMessages = await conversation.messages();
        setMessages(initialMessages);
        stream = await conversation.streamMessages();
        for await (const message of stream) {
          setMessages((prev) => [...prev, message]);
        }
      } catch (error) {
        console.error('Error loading or streaming messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    return () => {
      // Clean up the stream when the component unmounts or dependencies change
      if (stream) {
        stream.return();
      }
    };
  }, [client, conversationTopic]);


  if (!conversationTopic) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Select a conversation to start messaging.</div>
      </div>
    );
  }

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading messages...</div>
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
                <p className="text-sm">{String(message.content)}</p>
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